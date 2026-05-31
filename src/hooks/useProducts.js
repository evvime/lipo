import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ProductRepository } from '../lib/repositories/productRepository';

// MockData yalnızca development modunda fallback olarak yüklenir.
// Production'da Supabase verisi yoksa boş döner — yanlış veri riski önlenir.
const IS_DEV = import.meta.env.DEV;

let mockProducts = [];
let mockCategories = [];

if (IS_DEV) {
  import('../data/mockData').then(mod => {
    mockProducts = mod.products;
    mockCategories = mod.categories;
  });
}

/**
 * Supabase'den ürünleri çeker.
 * DEV modunda Supabase bağlantısı yoksa mockData'ya fallback yapar.
 * Production'da fallback devre dışıdır.
 */
export function useProducts(categoryId = null, customerGroupId = null) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const data = await ProductRepository.getProducts(categoryId, customerGroupId);
        setProducts(data);
      } catch (sbError) {
        if (IS_DEV) {
          console.warn('Supabase products tablosu yok, mockData kullanılıyor:', sbError?.message);
          const filtered = categoryId
            ? mockProducts.filter(p => p.categoryId === categoryId)
            : mockProducts;
          setProducts(filtered);
        } else {
          console.error('Supabase products sorgusu başarısız:', sbError?.message);
          setProducts([]);
        }
        setError(sbError);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [categoryId, customerGroupId]);

  return { products, loading, error };
}

/**
 * Slug'a göre tek ürün getirir.
 * DEV modunda Supabase'de yoksa mockData'dan döner.
 */
export function useProduct(slug, customerGroupId = null) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      setLoading(true);

      try {
        const data = await ProductRepository.getProductBySlug(slug, customerGroupId);
        setProduct(data);
      } catch (sbError) {
        if (IS_DEV) {
          const found = mockProducts.find(p => p.slug === slug) || null;
          setProduct(found);
        } else {
          setProduct(null);
        }
      }

      setLoading(false);
    };

    fetchProduct();
  }, [slug, customerGroupId]);

  return { product, loading };
}

/**
 * Kategorileri Supabase'den çeker.
 * DEV modunda Supabase yoksa mockData'ya düşer.
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      const { data, error: sbError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (sbError || !data || data.length === 0) {
        if (IS_DEV) {
          setCategories(mockCategories);
        } else {
          setCategories([]);
        }
      } else {
        setCategories(data);
      }

      setLoading(false);
    };

    fetchCategories();
  }, []);

  return { categories, loading };
}
