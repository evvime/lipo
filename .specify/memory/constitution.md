# Wellnur Medical — Proje Anayasası (Constitution)

> **Son Güncelleme:** 2026-05-17  
> **Versiyon:** 1.0  
> **Proje:** Wellnur Medical E-Ticaret Platformu

---

## 🎯 Proje Amacı

Wellnur Medical, ameliyat sonrası medikal kompresyon giysileri (liposuction, BBL, mastektomi) satan bir e-ticaret platformudur. Hedef kitle:
- **Birincil:** Ameliyat sonrası iyileşme sürecindeki hastalar
- **İkincil:** Plastik cerrahlar (Cerrah Portalı)
- **Üçüncül:** Toptan distribütörler (klinikler, eczaneler)

---

## 🏛️ Temel İlkeler

### 1. Hasta Güvenliği Öncelikli
- Medikal ürünler satan bir platform olarak doğru bilgi ve güvenilirlik esastır
- Ürün açıklamaları, beden rehberleri ve teknik parametreler klinik doğrulukta olmalıdır
- Yanlış veya yanıltıcı bilgi asla sunulmamalıdır

### 2. Çift Dil (TR/EN) Tutarlılığı
- Tüm kullanıcıya görünen metinler hem Türkçe hem İngilizce olmalıdır
- `useLangStore` üzerinden dil yönetimi yapılır
- `translations.js` modüler namespace'ler kullanır
- Kod içi yorum ve değişken isimleri İngilizce olmalıdır

### 3. Supabase-First Backend
- Tüm veri işlemleri Supabase PostgreSQL üzerinden yapılır
- Row Level Security (RLS) her tabloda zorunludur
- Edge Functions güvenlik gerektiren işlemler için kullanılır
- Client-side'da yalnızca `anon` key kullanılır

### 4. Performans Standartları
- Tüm sayfalar `React.lazy` + `Suspense` ile lazy-loaded olmalıdır
- Vite code splitting aktif olmalıdır (vendor chunks)
- LCP < 2.5s, FID < 100ms, CLS < 0.1 hedeflenir
- Bundle boyutu chunk başına 500KB'ı geçmemelidir
- Görseller harici CDN'den yüklenir, WebP/AVIF tercih edilir

### 5. Güvenlik Gereksinimleri
- Tüm Supabase tablolarında RLS aktif olmalıdır
- Secret'lar yalnızca .env dosyasında tutulur, asla commit edilmez
- Admin işlemleri `app_metadata.role === 'admin'` kontrolü gerektirir
- Ödeme bilgileri asla client-side'da saklanmaz

### 6. Kod Kalitesi
- Bileşenler 300 satırı geçmemelidir — geçiyorsa bölünmelidir
- Dosyalar 15KB'ı geçmemelidir
- Her yeni feature için en az 1 unit test yazılmalıdır
- ESLint kuralları her commit'te geçmelidir
- Kullanılmayan import'lar temizlenmelidir

### 7. UX Tutarlılığı
- Marka rengi: Teal (#50C0B0)
- Font: Inter (body) + Outfit (heading)
- Border radius: 12px (--radius: 0.75rem)
- Animasyonlar: Framer Motion / Motion React
- Toast bildirimleri: react-hot-toast
- Dark mode CSS tanımlı, toggle mekanizması eklenecek

---

## 🔧 Tech Stack

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| Frontend Framework | React | 19.x |
| Build Tool | Vite | 8.x |
| CSS Framework | Tailwind CSS | 4.x |
| Routing | React Router | 7.x |
| State Management | Zustand | 5.x |
| Animation | Motion (Framer) | 12.x |
| Icons | Lucide React | 1.x |
| Backend | Supabase | 2.x |
| Email | EmailJS | 4.x |
| Error Tracking | Sentry | 10.x |
| Testing | Vitest + Testing Library | — |

---

## 📁 Klasör Yapısı Kuralları

```
src/
├── components/       ← Yeniden kullanılabilir bileşenler (alt klasörlü)
│   ├── layout/       ← Header, Footer, Layout
│   ├── auth/         ← Route guard'lar
│   ├── ui/           ← Genel UI bileşenleri
│   ├── forms/        ← Form bileşenleri
│   ├── checkout/     ← Checkout alt bileşenleri
│   └── surgeon/      ← Cerrah portalı bileşenleri
├── pages/            ← Sayfa bileşenleri (route başına 1)
├── store/            ← Zustand store'ları
├── hooks/            ← Custom React hook'lar
├── lib/              ← Harici servis entegrasyonları
├── data/             ← Statik veri (sadece DEV fallback)
├── utils/            ← Yardımcı fonksiyonlar ve çeviriler
│   └── translations/ ← Namespace bazlı i18n dosyaları
└── test/             ← Test kurulum dosyaları
```

---

## ⚠️ Anti-Pattern'ler (YAPMA)

1. **MockData'yı production'da kullanma** — Yalnızca `import.meta.env.DEV` modunda fallback
2. **Tek dosyada 15KB+ kod yazma** — Bileşenlere böl
3. **RLS olmadan tablo oluşturma** — Her tablo için politika zorunlu
4. **Secret'ları client koduna gömme** — .env + VITE_ prefix
5. **Test yazmadan feature merge etme** — En az 1 unit test zorunlu
6. **Hardcoded Türkçe metin kullanma** — translations.js üzerinden
