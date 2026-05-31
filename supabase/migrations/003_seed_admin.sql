-- =====================================================================
-- Wellnur — Admin Rolü Atama Rehberi
-- =====================================================================
-- Bu dosya BİR REHBERDİR. Otomatik olarak çalıştırmayın — admin kullanıcı
-- bilgilerine göre Supabase Dashboard veya SQL Editor üzerinden manuel
-- olarak çalıştırın.
--
-- ÖNEMLİ: app_metadata sadece service_role anahtarı ile veya doğrudan
-- veritabanı üzerinden güncellenebilir. Anon key üzerinden değiştirilemez,
-- bu yüzden güvenlidir.
-- =====================================================================

-- 1) Admin yapılacak kullanıcının ID'sini bulun:
--    select id, email from auth.users where email = 'admin@wellnur.com';

-- 2) O kullanıcıya admin rolü verin (id'yi yukarıdaki sorgudan alın):
--
-- update auth.users
--    set raw_app_meta_data =
--          coalesce(raw_app_meta_data, '{}'::jsonb)
--          || jsonb_build_object('role', 'admin')
--  where id = '<KULLANICI_UUID>';

-- 3) Doğrulama:
--    select id, email, raw_app_meta_data
--      from auth.users
--     where raw_app_meta_data ->> 'role' = 'admin';

-- =====================================================================
-- Alternatif: Supabase Admin API (Edge Function veya backend script)
-- =====================================================================
-- import { createClient } from '@supabase/supabase-js';
-- const admin = createClient(URL, SERVICE_ROLE_KEY);
-- await admin.auth.admin.updateUserById(userId, {
--   app_metadata: { role: 'admin' }
-- });
-- =====================================================================
