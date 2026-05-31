import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initSentry, Sentry } from './lib/sentry'

initSentry();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<FallbackUI />}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
);

function FallbackUI() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Bir şeyler ters gitti</h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin. Sorun devam ederse bizimle iletişime geçin.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: '0.75rem 1.5rem', borderRadius: 12, background: '#111', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Sayfayı Yenile
        </button>
      </div>
    </div>
  );
}
