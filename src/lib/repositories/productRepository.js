import { supabase } from '../supabase';

/**
 * Helper: Parse stringified arrays/JSON from DB to JS arrays/objects safely
 */
const parseArrays = (product) => {
  if (!product) return product;
  
  if (typeof product.colors === 'string') {
    try { product.colors = JSON.parse(product.colors); } catch(e) { product.colors = []; }
  }
  
  if (typeof product.sizes === 'string') {
    try { 
      if (product.sizes.startsWith('{')) {
        product.sizes = product.sizes.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        if (product.sizes.length === 1 && product.sizes[0] === "") product.sizes = [];
      } else {
        product.sizes = JSON.parse(product.sizes); 
      }
    } catch(e) { product.sizes = []; }
  }
  
  if (typeof product.images === 'string') {
    try {
      if (product.images.startsWith('{')) {
        product.images = product.images.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        if (product.images.length === 1 && product.images[0] === "") product.images = [];
      } else {
        product.images = JSON.parse(product.images);
      }
    } catch(e) { product.images = []; }
  }

  return product;
};

/**
 * Product Repository — Supabase veri erişim katmanı.
 * Tüm ürün sorguları bu dosyadan geçer.
 * B2B fiyat listeleri ve varyant stok bilgilerini destekler.
 */
export const ProductRepository = {

/**
 * Aktif ürünleri çeker. customerGroupId verilirse B2B fiyatlarını da getirir.
 */
  async getProducts(categoryId = null, customerGroupId = null) {
    let query = supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    const parsedData = data.map(parseArrays);

    // B2B fiyat listeleri varsa uygula
    if (customerGroupId) {
      return await this._applyGroupPrices(parsedData, customerGroupId);
    }

    return parsedData;
  },

  /**
   * Slug'a göre tek ürün getirir. Varyant stok bilgilerini de çeker.
   */
  async getProductBySlug(slug, customerGroupId = null) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('slug', slug)
      .single();

    if (error) throw error;

    // Varyant stoklarını çek
    const { data: variants } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', data.id)
      .eq('is_active', true);

    data.variants = variants || [];

    const parsedProduct = parseArrays(data);

    // B2B fiyat
    if (customerGroupId) {
      const withPrice = await this._applyGroupPrices([parsedProduct], customerGroupId);
      return withPrice[0];
    }

    return parsedProduct;
  },

  /**
   * Ürün varyantlarını ve stok bilgilerini çeker.
   */
  async getProductVariants(productId) {
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true)
      .order('size', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Belirli bir varyantın stok durumunu kontrol eder.
   * @returns {number} Mevcut stok miktarı
   */
  async checkVariantStock(productId, size, colorName) {
    const { data, error } = await supabase
      .from('product_variants')
      .select('stock')
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color_name', colorName)
      .single();

    if (error || !data) return 0;
    return data.stock;
  },

  /**
   * Varyant stoklarını toplu günceller (Admin).
   */
  async upsertVariants(productId, variants) {
    const rows = variants.map(v => ({
      product_id: productId,
      size: v.size,
      color_name: v.color_name,
      color_hex: v.color_hex,
      sku: v.sku,
      stock: v.stock,
      is_active: true,
    }));

    const { data, error } = await supabase
      .from('product_variants')
      .upsert(rows, { onConflict: 'product_id,size,color_name' })
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Stok düşümü yapar (checkout sırasında).
   */
  async decrementStock(productId, size, colorName, quantity) {
    const { data, error } = await supabase.rpc('decrement_variant_stock', {
      p_product_id: productId,
      p_size: size,
      p_color_name: colorName,
      p_quantity: quantity,
    });

    // RPC yoksa fallback: manuel güncelleme
    if (error && error.code === '42883') {
      const current = await this.checkVariantStock(productId, size, colorName);
      if (current < quantity) throw new Error('Yetersiz stok');

      const { error: updateErr } = await supabase
        .from('product_variants')
        .update({ stock: current - quantity })
        .eq('product_id', productId)
        .eq('size', size)
        .eq('color_name', colorName);

      if (updateErr) throw updateErr;
      return;
    }

    if (error) throw error;
    return data;
  },

  /**
   * Stok geri yükleme (rollback/compensation).
   */
  async restoreStock(productId, size, colorName, quantity) {
    const current = await this.checkVariantStock(productId, size, colorName);

    const { error } = await supabase
      .from('product_variants')
      .update({ stock: current + quantity })
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color_name', colorName);

    if (error) throw error;
  },

  /**
   * Müşteri grubuna ait aktif fiyat listesinden ürün fiyatlarını uygular.
   * @private
   */
  async _applyGroupPrices(products, customerGroupId) {
    // Gruba atanmış aktif fiyat listelerini bul
    const { data: priceLists } = await supabase
      .from('price_list_customer_groups')
      .select('price_list_id, price_lists(*)')
      .eq('customer_group_id', customerGroupId);

    if (!priceLists || priceLists.length === 0) return products;

    // Aktif ve tarih aralığında olan fiyat listelerini filtrele
    const now = new Date().toISOString();
    const activeLists = priceLists
      .filter(pl => {
        const list = pl.price_lists;
        if (!list || !list.is_active) return false;
        if (list.starts_at && list.starts_at > now) return false;
        if (list.ends_at && list.ends_at < now) return false;
        return true;
      })
      .map(pl => pl.price_list_id);

    if (activeLists.length === 0) return products;

    // Bu fiyat listelerindeki ürün fiyatlarını çek
    const productIds = products.map(p => p.id);
    const { data: specialPrices } = await supabase
      .from('product_prices')
      .select('*')
      .in('price_list_id', activeLists)
      .in('product_id', productIds);

    if (!specialPrices || specialPrices.length === 0) return products;

    // Fiyatları eşleştir
    const priceMap = {};
    specialPrices.forEach(sp => {
      if (!priceMap[sp.product_id] || sp.amount < priceMap[sp.product_id].amount) {
        priceMap[sp.product_id] = sp;
      }
    });

    return products.map(product => ({
      ...product,
      originalPrice: product.price,
      b2bPrice: priceMap[product.id]?.amount || null,
      price: priceMap[product.id]?.amount || product.price,
      hasB2BDiscount: !!priceMap[product.id],
    }));
  },
};
