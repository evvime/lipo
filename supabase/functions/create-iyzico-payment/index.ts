// =====================================================================
// Wellnur — Iyzico Checkout Form Init (Supabase Edge Function)
// =====================================================================
// Bu fonksiyon Iyzico Checkout Form Initialize endpoint'ini çağırır ve
// frontend'e ödeme sayfasını başlatacak token / paymentPageUrl döner.
//
// Deployment:
//   supabase functions deploy create-iyzico-payment
//
// Secrets:
//   supabase secrets set IYZICO_API_KEY=...
//   supabase secrets set IYZICO_SECRET_KEY=...
//   supabase secrets set IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
//   supabase secrets set APP_BASE_URL=https://wellnur.com
// =====================================================================

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const IYZICO_API_KEY = Deno.env.get('IYZICO_API_KEY') ?? '';
const IYZICO_SECRET_KEY = Deno.env.get('IYZICO_SECRET_KEY') ?? '';
const IYZICO_BASE_URL = Deno.env.get('IYZICO_BASE_URL') ?? 'https://sandbox-api.iyzipay.com';
const APP_BASE_URL = Deno.env.get('APP_BASE_URL') ?? 'http://localhost:5173';

async function buildIyzicoAuth(
  uri: string,
  body: string,
  randomKey: string,
): Promise<string> {
  const payload = randomKey + uri + body;
  const keyData = new TextEncoder().encode(IYZICO_SECRET_KEY);
  const msgData = new TextEncoder().encode(payload);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const sigHex = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const authString =
    `apiKey:${IYZICO_API_KEY}&randomKey:${randomKey}&signature:${sigHex}`;

  return 'IYZWSv2 ' + btoa(authString);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!IYZICO_API_KEY || !IYZICO_SECRET_KEY) {
      return new Response(
        JSON.stringify({
          status: 'failure',
          errorMessage: 'Iyzico secrets are not configured on the server.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { orderId, totalAmount, buyer, items } = await req.json();

    if (!orderId || !totalAmount || !buyer || !items?.length) {
      return new Response(
        JSON.stringify({ status: 'failure', errorMessage: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Sunucu tarafı doğrulama: order gerçekten var mı, fiyat order ile eşleşiyor mu?
    // Bu adım kritiktir — aksi halde frontend manipüle edilerek farklı fiyatla ödeme
    // başlatılabilir.
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id, total_amount, status')
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      return new Response(
        JSON.stringify({ status: 'failure', errorMessage: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (Number(order.total_amount) !== Number(totalAmount)) {
      return new Response(
        JSON.stringify({ status: 'failure', errorMessage: 'Amount mismatch' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const conversationId = `wlnr_${orderId}_${Date.now()}`;
    const requestBody = {
      locale: 'tr',
      conversationId,
      price: Number(totalAmount).toFixed(2),
      paidPrice: Number(totalAmount).toFixed(2),
      currency: 'TRY',
      basketId: orderId,
      paymentGroup: 'PRODUCT',
      callbackUrl: `${APP_BASE_URL}/checkout/iyzico-callback?orderId=${orderId}`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: orderId,
        name: buyer.fullName?.split(' ')?.[0] || 'Customer',
        surname: buyer.fullName?.split(' ')?.slice(1).join(' ') || '-',
        gsmNumber: buyer.phone,
        email: buyer.email,
        identityNumber: '11111111111',
        registrationAddress: buyer.address,
        city: buyer.city,
        country: 'Turkey',
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '85.34.78.112',
      },
      shippingAddress: {
        contactName: buyer.fullName,
        city: buyer.city,
        country: 'Turkey',
        address: buyer.address,
      },
      billingAddress: {
        contactName: buyer.fullName,
        city: buyer.city,
        country: 'Turkey',
        address: buyer.address,
      },
      basketItems: items.map((item: any, idx: number) => ({
        id: String(item.id ?? idx),
        name: String(item.name ?? 'Product'),
        category1: 'Medical',
        itemType: 'PHYSICAL',
        price: Number(item.price).toFixed(2),
      })),
    };

    const bodyStr = JSON.stringify(requestBody);
    const uri = '/payment/iyzipos/checkoutform/initialize/auth/ecom';
    const randomKey = crypto.randomUUID();
    const authorization = await buildIyzicoAuth(uri, bodyStr, randomKey);

    const iyzicoRes = await fetch(IYZICO_BASE_URL + uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
        'x-iyzi-rnd': randomKey,
      },
      body: bodyStr,
    });

    const iyzicoData = await iyzicoRes.json();

    if (iyzicoData.status !== 'success') {
      return new Response(
        JSON.stringify({
          status: 'failure',
          errorMessage: iyzicoData.errorMessage || 'Iyzico request failed',
          errorCode: iyzicoData.errorCode,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        token: iyzicoData.token,
        paymentPageUrl: iyzicoData.paymentPageUrl,
        checkoutFormContent: iyzicoData.checkoutFormContent,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: 'failure',
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
