/**
 * Wellnur i18n — Modüler Çeviri Sistemi
 * 
 * Önceden tek monolith dosya (706 satır, 41KB) idi.
 * Şimdi namespace bazlı modüllere bölünmüş halde:
 *   - translations/nav.js      → Header, navigasyon
 *   - translations/shop.js     → Mağaza, sepet, ürün
 *   - translations/checkout.js → Ödeme, sipariş
 *   - translations/auth.js     → Kimlik doğrulama, cerrah
 *   - translations/pages.js    → Sayfalar (About, Home, Footer, vb.)
 *   - translations/products.js → Ürün detayları
 * 
 * Bu dosya geriye uyumluluğu korur — `import { t } from '../utils/translations'`
 * kullanımı aynı kalır, hiçbir bileşende değişiklik gerekmez.
 */

import { nav } from './translations/nav';
import { shop } from './translations/shop';
import { checkout } from './translations/checkout';
import { auth } from './translations/auth';
import { pages } from './translations/pages';
import { products } from './translations/products';

/**
 * Tüm namespace'leri tek flat obje olarak birleştirir.
 * Mevcut tüm bileşenler `t[lang].keyName` formatıyla çalışmaya devam eder.
 */
export const t = {
  EN: {
    ...nav.EN,
    ...shop.EN,
    ...checkout.EN,
    ...auth.EN,
    ...pages.EN,
    ...products.EN,
  },
  TR: {
    ...nav.TR,
    ...shop.TR,
    ...checkout.TR,
    ...auth.TR,
    ...pages.TR,
    ...products.TR,
  },
};
