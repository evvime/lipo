-- ============================================
-- Wellnur × Supabase - Veritabanı Kurulum SQL
-- ============================================
-- Supabase Dashboard → SQL Editor'e yapıştırın ve çalıştırın.


-- ────────────────────────────────────────────
-- 1. KATEGORİLER
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY,
  name_tr     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  desc_tr     TEXT,
  desc_en     TEXT,
  slug        TEXT UNIQUE NOT NULL,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- 2. ÜRÜNLER
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           TEXT PRIMARY KEY,
  name_tr      TEXT NOT NULL,
  name_en      TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  category_id  TEXT REFERENCES categories(id) ON DELETE SET NULL,
  price        DECIMAL(10,2) NOT NULL,
  desc_tr      TEXT,
  desc_en      TEXT,
  trendyol_url TEXT,
  images       TEXT[]  DEFAULT '{}',
  colors       JSONB   DEFAULT '[]',
  sizes        TEXT[]  DEFAULT '{}',
  stock        INT     DEFAULT 99,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- 3. İLETİŞİM FORMU GÖNDERİLERİ
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name  TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  lang       TEXT DEFAULT 'tr',
  status     TEXT DEFAULT 'new',   -- new | read | replied
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Herkes INSERT yapabilir (form gönderimi için gerekli)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Sadece authenticated kullanıcılar okuyabilir (admin)
CREATE POLICY "Authenticated can read submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);


-- ────────────────────────────────────────────
-- 4. MEVCUT ÜRÜN VERİLERİNİ AKTAR (Seed)
-- ────────────────────────────────────────────
INSERT INTO categories (id, name_tr, name_en, desc_tr, desc_en, slug, image_url) VALUES
  ('liposuction', 'Liposuction', 'Liposuction', 
   'Liposuction sonrası kompresyon giysileri', 'Compression garments after liposuction',
   'liposuction', 'https://cdn.dsmcdn.com/ty1775/prod/QC_PREP/20251016/23/9a8fe498-d5b1-37fe-955f-379e66e9e16f/1_org_zoom.jpg'),
  ('mastectomy', 'Mastektomi', 'Mastectomy',
   'Meme ameliyatı sonrası kompresyon', 'Post mastectomy compression',
   'mastectomy', 'https://cdn.dsmcdn.com/ty1776/prod/QC_PREP/20251021/00/2c910bec-28f3-396e-94bc-662985dd04cd/1_org_zoom.jpg'),
  ('facial', 'Yüz Ameliyatı', 'Facial Surgery',
   'Yüz ameliyatı sonrası kompresyon', 'Post facial surgery compression',
   'facial', '/facial_compression.png')
ON CONFLICT (id) DO NOTHING;

-- ── RLS: KATEGORİLER ──────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Herkes kategorileri okuyabilir (mağaza kataloğu için gerekli)
CREATE POLICY "Public read access for categories"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Sadece admin kategorileri ekleyebilir/güncelleyebilir/silebilir
CREATE POLICY "Admin insert categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin delete categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ── RLS: ÜRÜNLER ──────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Herkes ürünleri okuyabilir (mağaza kataloğu için gerekli)
CREATE POLICY "Public read access for products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Sadece admin ürünleri ekleyebilir/güncelleyebilir/silebilir
CREATE POLICY "Admin insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );


INSERT INTO products (id, name_tr, name_en, slug, category_id, price, trendyol_url, images, colors, sizes) VALUES
  (
    'wl-lipo-body-suit-01',
    'Mayo Tipi Liposuction Korsesi',
    'Full Body Liposuction Suit',
    'mayo-tipi-liposuction-korsesi',
    'liposuction',
    1330.00,
    'https://www.trendyol.com/wellnur/mayo-tipi-liposuction-korsesi-ameliyat-sonrasi-yuksek-kompresyonlu-gogus-alti-toparlayici-p-1030666986?merchantId=1027464',
    ARRAY[
      'https://cdn.dsmcdn.com/ty1775/prod/QC_PREP/20251016/23/9a8fe498-d5b1-37fe-955f-379e66e9e16f/1_org_zoom.jpg',
      'https://cdn.dsmcdn.com/ty1775/prod/QC_PREP/20251016/23/629a3f5b-22cf-31d1-ab64-39a85b0fe19e/1_org_zoom.jpg',
      'https://cdn.dsmcdn.com/ty1775/prod/QC_PREP/20251016/23/640da92a-5fa8-391e-b7a5-a3658de156d0/1_org_zoom.jpg'
    ],
    '[{"name":"Siyah","hex":"#111111"},{"name":"Ten Rengi","hex":"#E3CBB3"}]',
    ARRAY['S','M','L','XL','XXL']
  ),
  (
    'wl-post-op-bra-01',
    'Post-Op Sütyen Ameliyat Sonrası',
    'Post-Op Surgical Bra',
    'post-op-sutyen-ameliyat-sonrasi',
    'mastectomy',
    1140.00,
    'https://www.trendyol.com/wellnur/post-op-sutyen-ameliyat-sonrasi-sutyen-estetik-sonrasi-meme-ameliyati-korse-p-1034443198?merchantId=1027464',
    ARRAY[
      'https://cdn.dsmcdn.com/ty1776/prod/QC_PREP/20251021/00/2c910bec-28f3-396e-94bc-662985dd04cd/1_org_zoom.jpg',
      'https://cdn.dsmcdn.com/ty1776/prod/QC_PREP/20251021/00/12878fb0-0371-3ad0-ace3-8e60faab39c8/1_org_zoom.jpg',
      'https://cdn.dsmcdn.com/ty1777/prod/QC_PREP/20251021/00/ea423d8e-c614-36ca-85e3-5714c67524b9/1_org_zoom.jpg'
    ],
    '[{"name":"Siyah","hex":"#111111"}]',
    ARRAY['S','M','L','XL','XXL']
  ),
  (
    'wl-bbl-diz-ustu-korse',
    'BBL Ameliyat Sonrası Diz Üstü Korse',
    'BBL Post-Op Knee Length Garment',
    'bbl-ameliyat-sonrasi-diz-ustu-korse',
    'liposuction',
    2280.00,
    'https://www.trendyol.com/wellnur/bbl-ameliyat-sonrasi-diz-ustu-korse-yuksek-kompresyonlu-hizli-toparlanma-ve-sekillendirici-etki-p-1034283443?merchantId=1027464',
    ARRAY[
      'https://cdn.dsmcdn.com/ty1778/prod/QC_PREP/20251020/20/9e8020a0-bf61-3753-9e00-177c934c8221/1_org_zoom.jpg',
      'https://cdn.dsmcdn.com/ty1778/prod/QC_PREP/20251020/20/904a5479-cd62-3ea7-8771-34828221f07f/1_org_zoom.jpg',
      'https://cdn.dsmcdn.com/ty1776/prod/QC_PREP/20251020/20/1f56c0f7-418c-3837-84b5-e9c2ceffe036/1_org_zoom.jpg'
    ],
    '[{"name":"Siyah","hex":"#111111"}]',
    ARRAY['S','M','L','XL','XXL']
  ),
  (
    'wl-bbl-popo-yastigi',
    'BBL Ameliyat Sonrası Popo Yastığı',
    'BBL Post-Op Recovery Pillow',
    'bbl-ameliyat-sonrasi-popo-yastigi',
    'liposuction',
    748.85,
    'https://www.trendyol.com/wellnur/bbl-ameliyat-sonrasi-popo-yastigi-brezilya-popo-kaldirma-bbl-iyilesme-yastigi-p-863332672?merchantId=1027464',
    ARRAY[
      'https://cdn.dsmcdn.com/ty1575/prod/QC/20241003/10/63078c25-814c-37b9-b079-f801c3df2e80/1_org_zoom.jpg',
      'https://cdn.dsmcdn.com/ty1645/prod/QC/20250301/19/ced7a1f1-ffa3-341d-ada7-1f7cabd7ce85/1_org_zoom.jpg',
      'https://cdn.dsmcdn.com/ty1645/prod/QC/20250301/19/cd8b2c7d-5d65-371a-8b5e-684137ba7ddb/1_org_zoom.jpg'
    ],
    '[{"name":"Siyah","hex":"#111111"}]',
    ARRAY['Standart']
  )
ON CONFLICT (id) DO NOTHING;

-- ────────────────────────────────────────────
-- 5. SURGEON PROFILES
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS surgeon_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  hospital_name TEXT,
  specialty TEXT,
  phone TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE surgeon_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own surgeon profile"
  ON surgeon_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own surgeon profile"
  ON surgeon_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own surgeon profile"
  ON surgeon_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- ────────────────────────────────────────────
-- 6. WHOLESALE APPLICATIONS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wholesale_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tax_id TEXT,
  message TEXT,
  status TEXT DEFAULT 'new', -- new, reviewed, contacted, rejected
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wholesale_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit wholesale applications"
  ON wholesale_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can read wholesale applications"
  ON wholesale_applications
  FOR SELECT
  TO authenticated
  USING (true);

-- ────────────────────────────────────────────
-- 7. ORDERS & ORDER ITEMS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending', 
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert orders"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  selected_size TEXT,
  selected_color TEXT
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert order items"
  ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ────────────────────────────────────────────
-- 8. STORAGE BUCKETS & POLICIES
-- ────────────────────────────────────────────
-- Not: Bu komutlar sadece storage şeması üzerinde yetkisi olan adminler tarafından çalıştırılabilir.
-- Supabase Dashboard -> Storage kısmından 'products' bucket'ını manuel oluşturmanız önerilir.

/*
-- Bucket oluşturma (Eğer yoksa)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Herkes okuyabilir (Public Access)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');

-- Sadece authenticated kullanıcılar (Admin) yükleme yapabilir
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'products');

-- Sadece authenticated kullanıcılar (Admin) silebilir
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'products');
*/

-- ────────────────────────────────────────────
-- 9. BÖLGELER (REGIONS)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  currency_symbol TEXT NOT NULL,
  free_shipping_threshold DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  payment_providers TEXT[] DEFAULT ARRAY['iyzico', 'stripe'],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for regions"
  ON regions
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin full access for regions"
  ON regions
  FOR ALL
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

INSERT INTO regions (id, name, currency_code, currency_symbol, free_shipping_threshold) VALUES
  ('TR', 'Türkiye', 'TRY', '₺', 1000.00),
  ('EU', 'Avrupa', 'EUR', '€', 150.00),
  ('US', 'Amerika', 'USD', '$', 200.00)
ON CONFLICT (id) DO NOTHING;
