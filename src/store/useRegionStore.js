import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

/**
 * Region Store — Çoklu bölge ve para birimi yönetimi.
 * Medusa'nın Region modülünden esinlenmiştir.
 */
const useRegionStore = create(
  persist(
    (set, get) => ({
      region: null,
      regions: [],
      loading: false,

      /**
       * Bölgeleri Supabase'den çeker ve varsayılanı ayarlar.
       */
      initialize: async () => {
        set({ loading: true });
        try {
          const { data, error } = await supabase
            .from('regions')
            .select('*')
            .eq('is_active', true)
            .order('id');

          if (error) throw error;

          const regions = data || [];
          const current = get().region;

          // Eğer kayıtlı bölge yoksa veya geçersizse varsayılana düş
          const validRegion = current && regions.find(r => r.id === current.id);

          set({
            regions,
            region: validRegion || regions.find(r => r.id === 'TR') || regions[0] || null,
            loading: false,
          });
        } catch (err) {
          console.error('Region yükleme hatası:', err);
          set({ loading: false });
        }
      },

      /**
       * Bölge değiştirir.
       */
      setRegion: (regionId) => {
        const found = get().regions.find(r => r.id === regionId);
        if (found) {
          set({ region: found });
        }
      },

      /**
       * Dil seçimine göre bölge öneri. useLangStore ile senkron.
       */
      detectRegionFromLang: (lang) => {
        if (lang === 'TR') {
          get().setRegion('TR');
        }
        // EN seçildiyse bölge seçici gösterilir, otomatik değişmez
      },

      /**
       * Aktif bölgenin para birimi sembolü.
       */
      getCurrencySymbol: () => {
        return get().region?.currency_symbol || '₺';
      },

      /**
       * Aktif bölgenin para birimi kodu.
       */
      getCurrencyCode: () => {
        return get().region?.currency_code || 'TRY';
      },

      /**
       * Aktif bölgenin ücretsiz kargo eşiği.
       */
      getFreeShippingThreshold: () => {
        return get().region?.free_shipping_threshold || null;
      },

      /**
       * Aktif bölgenin ödeme sağlayıcıları.
       */
      getPaymentProviders: () => {
        return get().region?.payment_providers || ['iyzico'];
      },

      /**
       * Fiyatı aktif bölgenin para birimiyle formatlar.
       */
      formatPrice: (amount) => {
        const region = get().region;
        if (!region) return `${Number(amount).toLocaleString('tr-TR')} ₺`;

        const localeMap = { TRY: 'tr-TR', EUR: 'de-DE', USD: 'en-US' };
        const locale = localeMap[region.currency_code] || 'tr-TR';

        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: region.currency_code,
          minimumFractionDigits: 2,
        }).format(amount);
      },
    }),
    {
      name: 'wellnur-region-storage',
      partialize: (state) => ({ region: state.region }),
    }
  )
);

export default useRegionStore;
