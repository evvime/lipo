import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const SHIPMENT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_SHIPMENT_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Kargo firması → takip URL'i eşleştirmesi.
 */
const CARRIER_TRACKING_URLS = {
  'Yurtiçi Kargo': 'https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=',
  'Aras Kargo':    'https://www.araskargo.com.tr/tanimlar/gonderi_takip.aspx?kod=',
  'MNG Kargo':     'https://www.mngkargo.com.tr/gonderi-takip?barcode=',
  'PTT Kargo':     'https://gonderitakip.ptt.gov.tr/Track/Verify?q=',
  'Sürat Kargo':   'https://www.suratkargo.com.tr/KargoTakip?code=',
};

/**
 * Müşteriye kargo bildirim e-postası gönderir.
 * @param {Object} order - Sipariş bilgileri
 * @param {string} trackingNumber - Kargo takip numarası
 * @param {string} carrier - Kargo firması adı
 */
export async function sendShipmentEmail(order, trackingNumber, carrier) {
  if (!SERVICE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS ayarları eksik, kargo bildirimi gönderilemedi.');
    return false;
  }

  const trackingBaseUrl = CARRIER_TRACKING_URLS[carrier] || '';
  const trackingUrl = trackingBaseUrl ? `${trackingBaseUrl}${trackingNumber}` : '';

  const templateParams = {
    to_name: order.full_name,
    to_email: order.email,
    order_id: order.id?.slice(0, 8) || '',
    tracking_number: trackingNumber,
    carrier_name: carrier,
    tracking_url: trackingUrl,
    order_total: `${Number(order.total_amount).toLocaleString('tr-TR')} ${order.currency_code || '₺'}`,
    subject: `Siparişiniz Kargolandı — ${carrier} #${trackingNumber}`,
  };

  try {
    await emailjs.send(SERVICE_ID, SHIPMENT_TEMPLATE_ID, templateParams, PUBLIC_KEY);
    return true;
  } catch (err) {
    console.error('Kargo bildirim e-postası gönderilemedi:', err);
    return false;
  }
}

/**
 * Desteklenen kargo firmalarının listesini döner.
 */
export function getCarrierOptions() {
  return [
    { value: 'Yurtiçi Kargo', label: 'Yurtiçi Kargo' },
    { value: 'Aras Kargo',    label: 'Aras Kargo' },
    { value: 'MNG Kargo',     label: 'MNG Kargo' },
    { value: 'PTT Kargo',     label: 'PTT Kargo' },
    { value: 'Sürat Kargo',   label: 'Sürat Kargo' },
    { value: 'Diğer',         label: 'Diğer' },
  ];
}

/**
 * Kargo takip URL'i oluşturur.
 */
export function getTrackingUrl(carrier, trackingNumber) {
  const baseUrl = CARRIER_TRACKING_URLS[carrier];
  if (!baseUrl || !trackingNumber) return null;
  return `${baseUrl}${trackingNumber}`;
}
