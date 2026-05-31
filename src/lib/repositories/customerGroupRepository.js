import { supabase } from '../supabase';

/**
 * Customer Group Repository — B2B müşteri grubu yönetimi.
 * Cerrah/toptancı onay süreçleri ve fiyat listesi atamalarını yönetir.
 */
export const CustomerGroupRepository = {

  /**
   * Kullanıcının müşteri grubunu döner.
   * @returns {{ groupId: string, groupName: string, discountPct: number } | null}
   */
  async getUserGroup(userId) {
    const { data, error } = await supabase
      .from('user_customer_groups')
      .select('customer_group_id, customer_groups(*)')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      groupId: data.customer_group_id,
      groupName: data.customer_groups?.name || '',
      discountPct: data.customer_groups?.discount_pct || 0,
    };
  },

  /**
   * Kullanıcıyı bir müşteri grubuna atar.
   */
  async assignUserToGroup(userId, groupId) {
    const { error } = await supabase
      .from('user_customer_groups')
      .upsert({
        user_id: userId,
        customer_group_id: groupId,
      }, { onConflict: 'user_id,customer_group_id' });

    if (error) throw error;
  },

  /**
   * Kullanıcıyı müşteri grubundan çıkarır.
   */
  async removeUserFromGroup(userId, groupId) {
    const { error } = await supabase
      .from('user_customer_groups')
      .delete()
      .eq('user_id', userId)
      .eq('customer_group_id', groupId);

    if (error) throw error;
  },

  /**
   * Tüm müşteri gruplarını listeler.
   */
  async getGroups() {
    const { data, error } = await supabase
      .from('customer_groups')
      .select('*')
      .order('discount_pct', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Bekleyen cerrah başvurularını listeler.
   */
  async getPendingSurgeons() {
    const { data, error } = await supabase
      .from('surgeon_profiles')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Tüm cerrah profillerini filtreli getirir.
   */
  async getSurgeons(statusFilter = null) {
    let query = supabase
      .from('surgeon_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Cerrah başvurusunu onaylar ve 'surgeons' grubuna atar.
   */
  async approveSurgeon(userId) {
    // 1. Cerrah profilini onayla
    const { error: profileErr } = await supabase
      .from('surgeon_profiles')
      .update({ status: 'approved' })
      .eq('id', userId);

    if (profileErr) throw profileErr;

    // 2. Otomatik olarak surgeons grubuna ata
    await this.assignUserToGroup(userId, 'surgeons');
  },

  /**
   * Cerrah başvurusunu reddeder.
   */
  async rejectSurgeon(userId) {
    const { error } = await supabase
      .from('surgeon_profiles')
      .update({ status: 'rejected' })
      .eq('id', userId);

    if (error) throw error;

    // Eğer daha önce gruba atanmışsa çıkar
    await this.removeUserFromGroup(userId, 'surgeons').catch(() => {});
  },

  /**
   * Toptan satış başvurularını listeler.
   */
  async getWholesaleApplications(page = 0, pageSize = 20) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from('wholesale_applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { applications: data || [], total: count || 0 };
  },

  /**
   * Toptancı başvurusunu onaylar ve gruba atar.
   */
  async approveWholesaler(applicationId, userId) {
    const { error } = await supabase
      .from('wholesale_applications')
      .update({ status: 'approved' })
      .eq('id', applicationId);

    if (error) throw error;

    if (userId) {
      await this.assignUserToGroup(userId, 'wholesalers');
    }
  },

  /**
   * Fiyat listesi oluşturur veya günceller.
   */
  async upsertPriceList(priceList) {
    const { data, error } = await supabase
      .from('price_lists')
      .upsert(priceList)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Ürüne özel B2B fiyat atar.
   */
  async setProductPrice(productId, priceListId, amount, currencyCode = 'TRY') {
    const { error } = await supabase
      .from('product_prices')
      .upsert({
        product_id: productId,
        price_list_id: priceListId,
        amount,
        currency_code: currencyCode,
      }, { onConflict: 'product_id,price_list_id' });

    if (error) throw error;
  },

  /**
   * Bölgeleri listeler.
   */
  async getRegions() {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Bölge günceller (Admin).
   */
  async updateRegion(regionId, updates) {
    const { error } = await supabase
      .from('regions')
      .update(updates)
      .eq('id', regionId);

    if (error) throw error;
  },
};
