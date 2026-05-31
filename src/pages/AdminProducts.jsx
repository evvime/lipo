import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { ProductRepository } from '../lib/repositories/productRepository';
import { Plus, Edit2, Trash2, X, Upload, Loader2, Save, Package } from 'lucide-react';
import { confirmDialog } from '../lib/confirm';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [selectedProductVariants, setSelectedProductVariants] = useState([]);
  const [variantProduct, setVariantProduct] = useState(null);
  const [variantsLoading, setVariantsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    name_tr: '',
    name_en: '',
    slug: '',
    category_id: '',
    price: '',
    desc_tr: '',
    desc_en: '',
    trendyol_url: '',
    images: [],
    colors: [],
    sizes: [],
    stock: 99
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name_tr)')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) console.error('Error fetching categories:', error);
    else setCategories(data || []);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        price: product.price.toString(),
        colors: product.colors || [],
        sizes: product.sizes || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        id: '',
        name_tr: '',
        name_en: '',
        slug: '',
        category_id: categories[0]?.id || '',
        price: '',
        desc_tr: '',
        desc_en: '',
        trendyol_url: '',
        images: [],
        colors: [],
        sizes: [],
        stock: 99
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsSubmitting(true);
    const newImages = [...formData.images];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading image:', error);
        toast.error('Görsel yüklenirken hata: ' + error.message);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        newImages.push(publicUrl);
      }
    }

    setFormData(prev => ({ ...prev, images: newImages }));
    setIsSubmitting(false);
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      colors: Array.isArray(formData.colors) ? formData.colors.filter(c => c.name && c.hex) : [],
      sizes: typeof formData.sizes === 'string'
        ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
        : (formData.sizes || []),
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        // Simple ID generation if not provided
        if (!productData.id) productData.id = 'wl-' + Math.random().toString(36).substr(2, 9);
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      toast.success(editingProduct ? 'Ürün güncellendi' : 'Ürün eklendi');
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error('Ürün kaydedilemedi: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirmDialog({
      title: 'Ürünü sil?',
      description: 'Bu işlem geri alınamaz. Ürün kalıcı olarak silinecek.',
      confirmText: 'Sil',
      cancelText: 'Vazgeç',
      danger: true,
    });
    if (!ok) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product:', error);
      toast.error('Ürün silinemedi: ' + error.message);
    } else {
      toast.success('Ürün silindi');
      fetchProducts();
    }
  };

  const handleOpenVariants = async (product) => {
    setVariantProduct(product);
    setVariantModalOpen(true);
    setVariantsLoading(true);
    
    try {
      const existingVariants = await ProductRepository.getProductVariants(product.id);
      
      // Generate cartesian product of sizes and colors
      const productSizes = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === 'string' ? product.sizes.split(',').map(s => s.trim()) : []);
      const productColors = Array.isArray(product.colors) ? product.colors : [];
      
      const allVariants = [];
      
      if (productSizes.length > 0 && productColors.length > 0) {
        productSizes.forEach(size => {
          productColors.forEach(color => {
            const existing = existingVariants.find(v => v.size === size && v.color_name === color.name);
            allVariants.push({
              size,
              color_name: color.name,
              color_hex: color.hex,
              sku: existing?.sku || `${product.slug}-${size}-${color.name}`.toLowerCase(),
              stock: existing?.stock || 0
            });
          });
        });
      } else if (productSizes.length > 0) {
        productSizes.forEach(size => {
          const existing = existingVariants.find(v => v.size === size && !v.color_name);
          allVariants.push({
            size,
            color_name: null,
            color_hex: null,
            sku: existing?.sku || `${product.slug}-${size}`.toLowerCase(),
            stock: existing?.stock || 0
          });
        });
      } else if (productColors.length > 0) {
        productColors.forEach(color => {
          const existing = existingVariants.find(v => !v.size && v.color_name === color.name);
          allVariants.push({
            size: null,
            color_name: color.name,
            color_hex: color.hex,
            sku: existing?.sku || `${product.slug}-${color.name}`.toLowerCase(),
            stock: existing?.stock || 0
          });
        });
      }
      
      setSelectedProductVariants(allVariants.length > 0 ? allVariants : existingVariants);
    } catch (err) {
      console.error('Error fetching variants:', err);
      toast.error('Varyantlar yüklenirken hata oluştu');
    } finally {
      setVariantsLoading(false);
    }
  };

  const handleVariantStockChange = (index, value) => {
    const next = [...selectedProductVariants];
    next[index].stock = parseInt(value) || 0;
    setSelectedProductVariants(next);
  };

  const handleVariantSkuChange = (index, value) => {
    const next = [...selectedProductVariants];
    next[index].sku = value;
    setSelectedProductVariants(next);
  };

  const handleSaveVariants = async () => {
    setIsSubmitting(true);
    try {
      await ProductRepository.upsertVariants(variantProduct.id, selectedProductVariants);
      toast.success('Varyant stokları güncellendi');
      setVariantModalOpen(false);
    } catch (err) {
      console.error('Error saving variants:', err);
      toast.error('Kaydedilirken hata oluştu: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/50 overflow-hidden">
      <div className="p-6 border-b border-zinc-200/50 flex justify-between items-center bg-zinc-50/50">
        <h2 className="text-xl font-medium">Ürün Yönetimi</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Yeni Ürün Ekle
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 text-xs uppercase tracking-wider text-muted-foreground font-medium">
              <th className="px-6 py-4 border-b border-zinc-200/50">Ürün</th>
              <th className="px-6 py-4 border-b border-zinc-200/50">Kategori</th>
              <th className="px-6 py-4 border-b border-zinc-200/50">Fiyat</th>
              <th className="px-6 py-4 border-b border-zinc-200/50">Stok</th>
              <th className="px-6 py-4 border-b border-zinc-200/50 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-accent/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-bold">W</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{product.name_tr}</div>
                        <div className="text-xs text-muted-foreground">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {product.categories?.name_tr || product.category_id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {product.price.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenVariants(product)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Stok ve Varyantlar"
                      >
                        <Package className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                  Henüz ürün bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
              <h3 className="text-xl font-medium">{editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Ürün ID (Opsiyonel)</label>
                    <input name="id" value={formData.id} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" placeholder="wl-lipo-body-01" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">İsim (TR)</label>
                      <input required name="name_tr" value={formData.name_tr} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">İsim (EN)</label>
                      <input required name="name_en" value={formData.name_en} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Slug (URL)</label>
                    <input required name="slug" value={formData.slug} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" placeholder="mayo-tipi-korse" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Kategori</label>
                      <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name_tr}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Fiyat (TL)</label>
                      <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Açıklama (TR)</label>
                    <textarea rows="3" name="desc_tr" value={formData.desc_tr} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Açıklama (EN)</label>
                    <textarea rows="3" name="desc_en" value={formData.desc_en} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Trendyol Link</label>
                    <input name="trendyol_url" value={formData.trendyol_url} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground mb-3 block">Ürün Görselleri</label>
                <div className="flex flex-wrap gap-4">
                  {formData.images.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl border border-zinc-200 overflow-hidden group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 rounded-xl border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-[10px] font-medium text-muted-foreground">Yükle</span>
                    <input type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>

              {/* Advanced (Colors, Sizes) */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Renkler</label>
                  <div className="space-y-2">
                    {(Array.isArray(formData.colors) ? formData.colors : []).map((c, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="color"
                          value={c.hex || '#000000'}
                          onChange={(e) => {
                            const next = [...formData.colors];
                            next[idx] = { ...next[idx], hex: e.target.value };
                            setFormData(prev => ({ ...prev, colors: next }));
                          }}
                          className="w-10 h-10 rounded-lg border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={c.name || ''}
                          placeholder="Renk adı (örn. Siyah)"
                          onChange={(e) => {
                            const next = [...formData.colors];
                            next[idx] = { ...next[idx], name: e.target.value };
                            setFormData(prev => ({ ...prev, colors: next }));
                          }}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = formData.colors.filter((_, i) => i !== idx);
                            setFormData(prev => ({ ...prev, colors: next }));
                          }}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg"
                          aria-label="Rengi sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const current = Array.isArray(formData.colors) ? formData.colors : [];
                        setFormData(prev => ({ ...prev, colors: [...current, { name: '', hex: '#000000' }] }));
                      }}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Plus className="w-3 h-3" /> Renk ekle
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Bedenler (Virgülle ayırın)</label>
                  <textarea 
                    name="sizes" 
                    value={Array.isArray(formData.sizes) ? formData.sizes.join(', ') : formData.sizes} 
                    onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.value }))}
                    placeholder="S, M, L, XL"
                    className="w-full px-4 py-2 border rounded-xl text-sm h-20"
                  />
                </div>
              </div>
            </form>

            <div className="p-6 border-t border-zinc-200 bg-zinc-50/50 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border rounded-xl font-medium hover:bg-white transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primary text-white px-8 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {editingProduct ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variant & Stock Modal */}
      {variantModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-medium">Stok & Varyant Yönetimi</h3>
                <p className="text-sm text-muted-foreground">{variantProduct?.name_tr}</p>
              </div>
              <button onClick={() => setVariantModalOpen(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {variantsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : selectedProductVariants.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/50 text-xs uppercase tracking-wider text-muted-foreground font-medium border-y border-zinc-200/50">
                      <th className="px-4 py-3">Beden</th>
                      <th className="px-4 py-3">Renk</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3 w-32">Stok</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/50">
                    {selectedProductVariants.map((variant, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-sm font-medium">{variant.size || '-'}</td>
                        <td className="px-4 py-3">
                          {variant.color_name ? (
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full border border-zinc-200" style={{ backgroundColor: variant.color_hex }}></span>
                              <span className="text-sm">{variant.color_name}</span>
                            </div>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            value={variant.sku || ''} 
                            onChange={(e) => handleVariantSkuChange(idx, e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm"
                            placeholder="SKU"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            min="0"
                            value={variant.stock} 
                            onChange={(e) => handleVariantStockChange(idx, e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg text-sm font-medium"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Bu ürün için boyut veya renk seçeneği bulunmamaktadır. Önce ürünü düzenleyerek renk ve beden ekleyin.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-zinc-200 bg-zinc-50/50 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setVariantModalOpen(false)}
                className="px-6 py-2 border rounded-xl font-medium hover:bg-white transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={handleSaveVariants}
                disabled={isSubmitting || selectedProductVariants.length === 0}
                className="flex items-center gap-2 bg-primary text-white px-8 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Stokları Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
