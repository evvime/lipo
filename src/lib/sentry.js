import * as Sentry from '@sentry/react';

const DSN = import.meta.env.VITE_SENTRY_DSN;
const ENV = import.meta.env.MODE; // 'development' | 'production'

// DSN yoksa Sentry başlatma — geliştirici makinelerinde sessiz kalır.
export function initSentry() {
  if (!DSN) {
    if (ENV === 'production') {
      console.warn('[sentry] VITE_SENTRY_DSN tanımlı değil — production hata izleme kapalı.');
    }
    return;
  }

  Sentry.init({
    dsn: DSN,
    environment: ENV,
    // Yalnızca production'da event gönder
    enabled: ENV === 'production',
    // PII gönderme; sadece hata
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    // Local dev hatalarını filtrele
    beforeSend(event) {
      if (event.environment !== 'production') return null;
      return event;
    },
  });
}

export { Sentry };
