import '@testing-library/jest-dom/vitest';

// Supabase env değişkenlerini test sırasında stub'la — gerçek bağlantı kurulmasın.
if (!import.meta.env.VITE_SUPABASE_URL) {
  import.meta.env.VITE_SUPABASE_URL = 'http://localhost:54321';
}
if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  import.meta.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
}
