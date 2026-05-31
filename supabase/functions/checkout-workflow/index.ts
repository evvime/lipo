import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { buyer, items, paymentMethod, totalAmount, regionId, customerGroupId } = await req.json();

    if (!buyer || !items?.length || !paymentMethod || !totalAmount) {
      return new Response(
        JSON.stringify({ status: 'failure', errorMessage: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // SAGA Step 1: Reserve Stock (Decrement)
    for (const item of items) {
      if (item.size && item.color) {
        // Find variant
        const { data: variant, error: varErr } = await supabase
          .from('product_variants')
          .select('id, stock')
          .eq('product_id', item.id)
          .eq('size', item.size)
          .eq('color_name', item.color)
          .single();

        if (!varErr && variant) {
          if (variant.stock < item.quantity) {
            return new Response(
              JSON.stringify({ status: 'failure', errorMessage: `Yetersiz stok: ${item.name}` }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          // Decrement
          await supabase
            .from('product_variants')
            .update({ stock: variant.stock - item.quantity })
            .eq('id', variant.id);
        }
      }
    }

    // SAGA Step 2: Create Order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: buyer.userId || null,
          full_name: buyer.fullName,
          email: buyer.email,
          phone: buyer.phone,
          city: buyer.city,
          address: buyer.address,
          payment_method: paymentMethod,
          total_amount: totalAmount,
          region_id: regionId || 'TR',
          customer_group_id: customerGroupId || null,
          status: paymentMethod === 'virtual_pos' ? 'pending_payment' : 'pending'
        }
      ])
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // SAGA Step 3: Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      selected_size: item.size || null,
      selected_color: item.color || null
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Rollback order
      await supabase.from('orders').delete().eq('id', orderData.id);
      throw itemsError;
    }

    // Return the created order id to frontend
    return new Response(
      JSON.stringify({
        status: 'success',
        orderId: orderData.id,
        orderData,
        orderItems
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        status: 'failure',
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
