import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getDefaultLang = () => {
  // Tarayıcı dilini kontrol et (ör. "tr", "tr-TR", "en-US")
  if (typeof window !== 'undefined' && navigator && navigator.language) {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith('tr')) return 'TR';
  }
  return 'EN'; // Türkçe dışındaki tüm ülkeler için varsayılan İngilizce
};

const useLangStore = create(
  persist(
    (set) => ({
      lang: getDefaultLang(),
      toggleLang: () => set((state) => ({ lang: state.lang === 'EN' ? 'TR' : 'EN' })),
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'wellnur-lang',
    }
  )
);

export default useLangStore;
