import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// GStack B4 Fix: undefined argümanla createClient çağrısını engelle.
// Eksik .env değişkenleri açık hata mesajıyla raporlanır.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Supabase bağlantı bilgileri eksik!\n' +
    '.env dosyasına VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY ekleyin.\n' +
    'Detay: https://supabase.com/docs/guides/getting-started'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
