-- ============================================
-- Wellnur × MedusaJS Patterns — Database Migration
-- ============================================
-- Supabase Dashboard → SQL Editor'e yapıştırın ve çalıştırın.
-- Bu migration, MedusaJS'in en değerli e-ticaret desenlerini
-- mevcut Wellnur Supabase şemasına ekler.

-- ────────────────────────────────────────────
-- 1. MÜŞTERİ GRUPLARI (Customer Groups)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_groups (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  discount_pct DECIMAL(5,2) DEFAULT 0.00,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE customer_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read customer_groups"
  ON customer_groups FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin manage customer_groups"
  ON customer_groups FOR ALL
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ────────────────────────────────────────────
-- 2. KULLANICI ↔ GRUP İLİŞKİSİ
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_customer_groups (
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_group_id TEXT REFERENCES customer_groups(id) ON DELETE CASCADE,
  assigned_at       TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, customer_group_id)
);

ALTER TABLE user_customer_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own group"
  ON user_customer_groups FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin manage user groups"
  ON user_customer_groups FOR ALL
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ────────────────────────────────────────────
-- 3. FİYAT LİSTELERİ (Price Lists)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS price_lists (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  type        TEXT DEFAULT 'override',  -- 'sale' | 'override'
  is_active   BOOLEAN DEFAULT true,
  starts_at   TIMESTAMPTZ,
  ends_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE price_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active price_lists"
  ON price_lists FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin manage price_lists"
  ON price_lists FOR ALL
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ────────────────────────────────────────────
-- 4. FİYAT LİSTESİ ↔ MÜŞTERİ GRUBU
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS price_list_customer_groups (
  price_list_id     UUID REFERENCES price_lists(id) ON DELETE CASCADE,
  customer_group_id TEXT REFERENCES customer_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (price_list_id, customer_group_id)
);

ALTER TABLE price_list_customer_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read price_list_groups"
  ON price_list_customer_groups FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin manage price_list_groups"
  ON price_list_customer_groups FOR ALL
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ────────────────────────────────────────────
-- 5. ÜRÜN ÖZEL FİYATLARI (Product Prices)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_prices (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id    TEXT REFERENCES products(id) ON DELETE CASCADE,
  price_list_id UUID REFERENCES price_lists(id) ON DELETE CASCADE,
  amount        DECIMAL(10,2) NOT NULL,
  currency_code TEXT DEFAULT 'TRY',
  min_quantity  INT DEFAULT 1,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read product_prices"
  ON product_prices FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin manage product_prices"
  ON product_prices FOR ALL
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ────────────────────────────────────────────
-- 6. ÜRÜN VARYANTLARI (Variant-Level Inventory)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_variants (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  TEXT REFERENCES products(id) ON DELETE CASCADE,
  size        TEXT,
  color_name  TEXT,
  color_hex   TEXT,
  sku         TEXT UNIQUE,
  stock       INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, size, color_name)
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read product_variants"
  ON product_variants FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin manage product_variants"
  ON product_variants FOR ALL
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ────────────────────────────────────────────
-- 7. BÖLGELER (Multi-Region)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS regions (
  id                      TEXT PRIMARY KEY,
  name                    TEXT NOT NULL,
  currency_code           TEXT NOT NULL,
  currency_symbol         TEXT NOT NULL DEFAULT '₺',
  tax_rate                DECIMAL(5,2) DEFAULT 20.00,
  free_shipping_threshold DECIMAL(10,2),
  payment_providers       TEXT[] DEFAULT '{"iyzico"}',
  is_active               BOOLEAN DEFAULT true,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read regions"
  ON regions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin manage regions"
  ON regions FOR ALL
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ────────────────────────────────────────────
-- 8. MEVCUT orders TABLOSUNA YENİ KOLONLAR
-- ────────────────────────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS region_id TEXT REFERENCES regions(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_group_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'TRY';

-- Admin tüm siparişleri görebilsin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admin can view all orders'
  ) THEN
    CREATE POLICY "Admin can view all orders"
      ON orders FOR SELECT
      TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

-- Admin sipariş güncelleyebilsin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admin can update orders'
  ) THEN
    CREATE POLICY "Admin can update orders"
      ON orders FOR UPDATE
      TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

-- ────────────────────────────────────────────
-- 9. SEED VERİSİ
-- ────────────────────────────────────────────

-- Müşteri Grupları
INSERT INTO customer_groups (id, name, discount_pct) VALUES
  ('surgeons',    'Cerrahlar',    15.00),
  ('wholesalers', 'Toptancılar',  35.00),
  ('retail',      'Bireysel',      0.00)
ON CONFLICT (id) DO UPDATE SET discount_pct = EXCLUDED.discount_pct;

-- Bölgeler
INSERT INTO regions (id, name, currency_code, currency_symbol, tax_rate, free_shipping_threshold, payment_providers) VALUES
  ('TR', 'Türkiye', 'TRY', '₺',  20.00, 500.00,  '{"iyzico"}'),
  ('EU', 'Avrupa',  'EUR', '€',   0.00, 100.00,  '{"stripe"}'),
  ('US', 'ABD',     'USD', '$',    0.00,  75.00,  '{"stripe"}')
ON CONFLICT (id) DO UPDATE SET
  currency_symbol = EXCLUDED.currency_symbol,
  free_shipping_threshold = EXCLUDED.free_shipping_threshold;

-- Varsayılan B2B Fiyat Listeleri
INSERT INTO price_lists (id, name, description, type, is_active) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Cerrah Fiyat Listesi',   'Onaylı cerrahlar için %15 indirimli fiyatlar', 'override', true),
  ('00000000-0000-0000-0000-000000000002', 'Toptancı Fiyat Listesi', 'Toptancılar için %35 indirimli fiyatlar',      'override', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO price_list_customer_groups (price_list_id, customer_group_id) VALUES
  ('00000000-0000-0000-0000-000000000001', 'surgeons'),
  ('00000000-0000-0000-0000-000000000002', 'wholesalers')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────
-- 10. ÜRÜN VARYANTLARI SEED (Her beden/renk = 50 adet)
-- ────────────────────────────────────────────

-- wl-lipo-body-suit-01: Siyah + Ten Rengi × S,M,L,XL,XXL
INSERT INTO product_variants (product_id, size, color_name, color_hex, sku, stock) VALUES
  ('wl-lipo-body-suit-01', 'S',   'Siyah',     '#111111', 'WL-LBS01-BLK-S',   50),
  ('wl-lipo-body-suit-01', 'M',   'Siyah',     '#111111', 'WL-LBS01-BLK-M',   50),
  ('wl-lipo-body-suit-01', 'L',   'Siyah',     '#111111', 'WL-LBS01-BLK-L',   50),
  ('wl-lipo-body-suit-01', 'XL',  'Siyah',     '#111111', 'WL-LBS01-BLK-XL',  50),
  ('wl-lipo-body-suit-01', 'XXL', 'Siyah',     '#111111', 'WL-LBS01-BLK-XXL', 50),
  ('wl-lipo-body-suit-01', 'S',   'Ten Rengi', '#E3CBB3', 'WL-LBS01-TAN-S',   50),
  ('wl-lipo-body-suit-01', 'M',   'Ten Rengi', '#E3CBB3', 'WL-LBS01-TAN-M',   50),
  ('wl-lipo-body-suit-01', 'L',   'Ten Rengi', '#E3CBB3', 'WL-LBS01-TAN-L',   50),
  ('wl-lipo-body-suit-01', 'XL',  'Ten Rengi', '#E3CBB3', 'WL-LBS01-TAN-XL',  50),
  ('wl-lipo-body-suit-01', 'XXL', 'Ten Rengi', '#E3CBB3', 'WL-LBS01-TAN-XXL', 50)
ON CONFLICT (product_id, size, color_name) DO UPDATE SET stock = 50;

-- wl-post-op-bra-01: Siyah × S,M,L,XL,XXL
INSERT INTO product_variants (product_id, size, color_name, color_hex, sku, stock) VALUES
  ('wl-post-op-bra-01', 'S',   'Siyah', '#111111', 'WL-POB01-BLK-S',   50),
  ('wl-post-op-bra-01', 'M',   'Siyah', '#111111', 'WL-POB01-BLK-M',   50),
  ('wl-post-op-bra-01', 'L',   'Siyah', '#111111', 'WL-POB01-BLK-L',   50),
  ('wl-post-op-bra-01', 'XL',  'Siyah', '#111111', 'WL-POB01-BLK-XL',  50),
  ('wl-post-op-bra-01', 'XXL', 'Siyah', '#111111', 'WL-POB01-BLK-XXL', 50)
ON CONFLICT (product_id, size, color_name) DO UPDATE SET stock = 50;

-- wl-bbl-diz-ustu-korse: Siyah × S,M,L,XL,XXL
INSERT INTO product_variants (product_id, size, color_name, color_hex, sku, stock) VALUES
  ('wl-bbl-diz-ustu-korse', 'S',   'Siyah', '#111111', 'WL-BBL01-BLK-S',   50),
  ('wl-bbl-diz-ustu-korse', 'M',   'Siyah', '#111111', 'WL-BBL01-BLK-M',   50),
  ('wl-bbl-diz-ustu-korse', 'L',   'Siyah', '#111111', 'WL-BBL01-BLK-L',   50),
  ('wl-bbl-diz-ustu-korse', 'XL',  'Siyah', '#111111', 'WL-BBL01-BLK-XL',  50),
  ('wl-bbl-diz-ustu-korse', 'XXL', 'Siyah', '#111111', 'WL-BBL01-BLK-XXL', 50)
ON CONFLICT (product_id, size, color_name) DO UPDATE SET stock = 50;

-- wl-bbl-popo-yastigi: Siyah × Standart
INSERT INTO product_variants (product_id, size, color_name, color_hex, sku, stock) VALUES
  ('wl-bbl-popo-yastigi', 'Standart', 'Siyah', '#111111', 'WL-BBP01-BLK-STD', 50)
ON CONFLICT (product_id, size, color_name) DO UPDATE SET stock = 50;

-- ────────────────────────────────────────────
-- 11. B2B ÜRÜN FİYATLARI SEED
-- ────────────────────────────────────────────
-- Cerrah fiyatları (%15 indirim)
INSERT INTO product_prices (product_id, price_list_id, amount, currency_code) VALUES
  ('wl-lipo-body-suit-01', '00000000-0000-0000-0000-000000000001', 1130.50, 'TRY'),
  ('wl-post-op-bra-01',    '00000000-0000-0000-0000-000000000001',  969.00, 'TRY'),
  ('wl-bbl-diz-ustu-korse','00000000-0000-0000-0000-000000000001', 1938.00, 'TRY'),
  ('wl-bbl-popo-yastigi',  '00000000-0000-0000-0000-000000000001',  636.52, 'TRY')
ON CONFLICT DO NOTHING;

-- Toptancı fiyatları (%35 indirim)
INSERT INTO product_prices (product_id, price_list_id, amount, currency_code) VALUES
  ('wl-lipo-body-suit-01', '00000000-0000-0000-0000-000000000002',  864.50, 'TRY'),
  ('wl-post-op-bra-01',    '00000000-0000-0000-0000-000000000002',  741.00, 'TRY'),
  ('wl-bbl-diz-ustu-korse','00000000-0000-0000-0000-000000000002', 1482.00, 'TRY'),
  ('wl-bbl-popo-yastigi',  '00000000-0000-0000-0000-000000000002',  486.75, 'TRY')
ON CONFLICT DO NOTHING;

-- ════════════════════════════════════════════
-- Migration tamamlandı.
-- Oluşturulan tablolar:
--   ✓ customer_groups
--   ✓ user_customer_groups
--   ✓ price_lists
--   ✓ price_list_customer_groups
--   ✓ product_prices
--   ✓ product_variants
--   ✓ regions
--   ✓ orders tablosuna yeni kolonlar (tracking, region, discount)
-- ════════════════════════════════════════════
