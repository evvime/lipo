import emailjs from '@emailjs/browser';

// EmailJS env değişkenleri (zorunlu)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const isConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

/**
 * Sipariş onay e-postasını gönderir.
 * Best-effort: başarısız olsa bile checkout akışını bloklamaz.
 */
export async function sendOrderConfirmationEmail({ order, items, lang = 'TR' }) {
  if (!isConfigured) {
    console.warn('[email] EmailJS yapılandırılmamış — onay maili atlanıyor');
    return { sent: false, reason: 'not_configured' };
  }

  try {
    const orderItemsText = items
      .map(it => `• ${it.product_name} × ${it.quantity} — ${Number(it.price).toLocaleString('tr-TR')} ₺`)
      .join('\n');

    // Tarih formatı: email backend kodu, lang parametresi alıyor
    const dateFormat = lang === 'EN' ? 'en-US' : 'tr-TR';

    // Ödeme yöntemi çevirisi: backend email template'i için
    const paymentMethodName = order.payment_method === 'bank_transfer'
      ? (lang === 'EN' ? 'Bank Transfer' : 'Havale/EFT')
      : (lang === 'EN' ? 'Credit Card' : 'Kredi Kartı');

    const params = {
      to_email: order.email,
      to_name: order.full_name,
      order_id: order.id,
      order_short_id: order.id.split('-')[0],
      order_date: new Date(order.created_at || Date.now()).toLocaleString(dateFormat),
      payment_method: paymentMethodName,
      total_amount: `${Number(order.total_amount).toLocaleString('tr-TR')} ₺`,
      shipping_address: `${order.address}, ${order.city}`,
      phone: order.phone,
      items_list: orderItemsText,
      language: lang,
    };

    const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });
    return { sent: true, response: res };
  } catch (err) {
    // GStack S7 Fix: Production'da Sentry'ye yönlendir, console'a hassas bilgi sızdırma
    if (import.meta.env.PROD && typeof window !== 'undefined' && window.__SENTRY__) {
      import('@sentry/react').then(Sentry => Sentry.captureException(err)).catch(() => {});
    } else if (import.meta.env.DEV) {
      console.error('[email] Order confirmation send failed:', err);
    }
    return { sent: false, reason: 'send_error', error: err };
  }
}
