# Wellnur Medical Platform — Spesifikasyon

> **Spec ID:** 001-wellnur-platform  
> **Oluşturulma:** 2026-05-17  
> **Durum:** Active

---

## 1. Ürün Vizyonu

Ameliyat sonrası medikal kompresyon giysileri satan, çift dilli (TR/EN), Supabase destekli bir e-ticaret platformu. Hedef: hastalar, cerrahlar ve toptan distribütörler için tek noktadan hizmet.

---

## 2. User Story'ler

### US-01: Ürün Kataloğu Gezinme
**Olarak** hasta/müşteri  
**İstiyorum ki** ürünleri kategoriye göre (Liposuction, Mastektomi, Yüz Cerrahisi) filtreleyebileyim  
**Böylece** ameliyat türüme uygun kompresyon giysisini bulabilirim  

**Kabul Kriterleri:**
- [x] Kategori sayfası mevcut (/category/:slug)
- [x] Ürün filtreleme (kategori, beden, renk)
- [x] Ürün detay sayfası (/product/:slug)
- [ ] Ürün arama fonksiyonu

### US-02: Alışveriş Sepeti
**Olarak** müşteri  
**İstiyorum ki** ürünleri sepete ekleyip çıkarabileyim  
**Böylece** satın almak istediğim ürünleri yönetebilirim  

**Kabul Kriterleri:**
- [x] Sepete ürün ekleme (beden + renk seçimli)
- [x] Sepetten ürün çıkarma
- [x] Miktar güncelleme
- [x] LocalStorage ile persist
- [x] Sepet drawer'ı (CartDrawer)

### US-03: Checkout ve Sipariş
**Olarak** müşteri  
**İstiyorum ki** siparişimi tamamlayabileyim  
**Böylece** ürünlerimi satın alabilirim  

**Kabul Kriterleri:**
- [x] Teslimat bilgileri formu
- [x] Havale/EFT ödeme yöntemi
- [ ] Kredi kartı ödeme (Iyzico) — flag ile beklemede
- [x] Sipariş oluşturma (Supabase orders tablosu)
- [x] Sipariş onay e-postası (EmailJS)
- [x] Stok kontrolü checkout'ta

### US-04: Kullanıcı Hesap Yönetimi
**Olarak** kayıtlı kullanıcı  
**İstiyorum ki** hesabıma giriş yapıp profilimi yönetebiliyim  
**Böylece** siparişlerimi takip edebilirim  

**Kabul Kriterleri:**
- [x] Kayıt / Giriş / Çıkış (Supabase Auth)
- [x] Profil sayfası
- [x] Şifre sıfırlama
- [x] Sipariş geçmişi görüntüleme

### US-05: Admin Paneli
**Olarak** yönetici  
**İstiyorum ki** ürünleri ve siparişleri yönetebiliyim  
**Böylece** platformu işletebilirim  

**Kabul Kriterleri:**
- [x] Admin route koruması (role check)
- [x] Dashboard istatistikleri
- [x] Ürün CRUD işlemleri
- [ ] Sipariş durum güncelleme

### US-06: Cerrah Portalı
**Olarak** plastik cerrah  
**İstiyorum ki** hastalarım için özel sipariş verebiliyim  
**Böylece** ameliyat sonrası iyileşmeyi koordine edebilirim  

**Kabul Kriterleri:**
- [x] Cerrah kayıt ve giriş
- [x] Başvuru durumu (pending/approved/rejected)
- [x] Cerrah dashboard'u
- [ ] Hasta siparişi oluşturma
- [ ] Sipariş takibi

### US-07: Çoklu Dil Desteği
**Olarak** uluslararası kullanıcı  
**İstiyorum ki** platformu İngilizce veya Türkçe kullanabileyim  
**Böylece** kendi dilimde alışveriş yapabilirim  

**Kabul Kriterleri:**
- [x] TR/EN toggle
- [x] Tüm UI metinleri çevirili
- [x] Dil tercihi LocalStorage'da persist
- [x] Ürün isimleri çift dilli (name_tr/name_en)

### US-08: İletişim ve Destek
**Olarak** müşteri  
**İstiyorum ki** soru ve sorunlarımı bildirebiliyim  
**Böylece** destek alabiliyorum  

**Kabul Kriterleri:**
- [x] İletişim formu (Supabase'e kayıt)
- [x] Konu seçimi
- [x] Beden rehberi sayfası
- [x] Kargo ve iade politikası sayfası

### US-09: Toptan Satış Başvurusu
**Olarak** klinik/eczane sahibi  
**İstiyorum ki** toptan satış başvurusu yapabileyim  
**Böylece** distribütör olabiliyorum  

**Kabul Kriterleri:**
- [x] Başvuru formu
- [x] Supabase'e kayıt (wholesale_applications)
- [ ] Başvuru durumu takibi

---

## 3. Fonksiyonel Olmayan Gereksinimler

| Gereksinim | Hedef |
|------------|-------|
| Sayfa yükleme (LCP) | < 2.5 saniye |
| İlk giriş (FCP) | < 1.8 saniye |
| Bundle boyutu (chunk) | < 500KB |
| Uptime | %99.5 |
| Dil desteği | TR, EN |
| Tarayıcı desteği | Chrome, Firefox, Safari, Edge (son 2 versiyon) |
| Mobil uyumluluk | Responsive (320px - 2560px) |
| SEO | Structured data, meta tags, canonical URL'ler |

---

## 4. Veritabanı Tabloları

| Tablo | Amaç | RLS |
|-------|-------|-----|
| categories | Ürün kategorileri | ✅ |
| products | Ürünler | ✅ |
| contact_submissions | İletişim formları | ✅ |
| surgeon_profiles | Cerrah profilleri | ✅ |
| wholesale_applications | Toptan satış başvuruları | ✅ |
| orders | Siparişler | ✅ |
| order_items | Sipariş kalemleri | ✅ |
| profiles | Kullanıcı profilleri (trigger ile) | ✅ |

---

## 5. Entegrasyonlar

| Servis | Amaç | Durum |
|--------|-------|-------|
| Supabase | Backend, Auth, DB | ✅ Aktif |
| EmailJS | Sipariş onay e-postası | ✅ Aktif |
| Sentry | Hata izleme | ✅ Aktif |
| Iyzico | Kredi kartı ödeme | ⏳ Beklemede |
| Trendyol | Alternatif satış kanalı (link) | ✅ Aktif |
