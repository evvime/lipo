import { supabase } from '../supabase';

/**
 * Order Repository — Sipariş veri erişim katmanı.
 * Sipariş CRUD, kargo takip ve B2B indirim kayıtlarını yönetir.
 */
export const OrderRepository = {

  /**
   * Yeni sipariş oluşturur.
   */
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Sipariş kalemlerini toplu ekler.
   */
  async createOrderItems(orderId, items) {
    const rows = items.map(item => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      selected_size: item.selectedSize || item.size,
      selected_color: item.selectedColor || item.color,
    }));

    const { data, error } = await supabase
      .from('order_items')
      .insert(rows)
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Sayfalı sipariş listesi (detaylı).
   */
  async getOrders(page = 0, pageSize = 20) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { orders: data || [], total: count || 0 };
  },

  /**
   * Kullanıcının kendi siparişlerini getirir.
   */
  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Sipariş durumunu günceller.
   */
  async updateStatus(orderId, status) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
  },

  /**
   * Kargo takip bilgilerini günceller.
   */
  async updateTracking(orderId, trackingNumber, carrier) {
    const { error } = await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber,
        carrier: carrier,
        status: 'shipped',
      })
      .eq('id', orderId);

    if (error) throw error;
  },

  /**
   * Siparişi başarısız olarak işaretle (compensation).
   */
  async markFailed(orderId) {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'failed' })
      .eq('id', orderId);

    if (error) throw error;
  },
};
