import { useRef, useEffect } from 'react';

/**
 * IyzicoPayment — Iyzico ödeme formu bileşeni.
 * Checkout.jsx monolith'inden çıkarıldı.
 *
 * GStack S1 Fix: Script injection artık trusted Iyzico domain'leriyle
 * kısıtlanıyor. Bilinmeyen kaynaklı script'ler yürütülmez.
 */

// Yalnızca bu domain'lerden gelen script'ler yürütülür.
const TRUSTED_SCRIPT_ORIGINS = [
  'https://sandbox-static.iyzipay.com',
  'https://static.iyzipay.com',
  'https://cdn.iyzipay.com',
];

/**
 * Bir script src'sinin güvenilir olup olmadığını kontrol eder.
 * Inline script'ler (src olmayan) yalnızca iyzicoScript yanıtı
 * güvenilir Edge Function'dan geliyorsa çalıştırılır.
 */
function isTrustedScript(scriptEl) {
  if (!scriptEl.src) return true; // inline — Edge Function'dan geldiği varsayılır
  try {
    const url = new URL(scriptEl.src);
    return TRUSTED_SCRIPT_ORIGINS.some(origin => url.href.startsWith(origin));
  } catch {
    return false;
  }
}

/**
 * Basit HTML sanitizer: <script>, <iframe>, <object>, <embed> tag'larını
 * ve on* event attribute'larını temizler. Non-script HTML korunur.
 */
function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;

  // Tehlikeli element'leri kaldır (script hariç — onları ayrı işliyoruz)
  const dangerous = div.querySelectorAll('iframe, object, embed, base, meta');
  dangerous.forEach(el => el.remove());

  // on* event handler attribute'larını kaldır
  const allElements = div.querySelectorAll('*');
  allElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return div;
}

const IyzicoPayment = ({ iyzicoScript, onCancel, trans }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!iyzicoScript || !containerRef.current) return;

    const container = containerRef.current;
    container.textContent = ''; // innerHTML yerine textContent ile temizle

    // HTML içeriğini sanitize et
    const sanitized = sanitizeHTML(iyzicoScript);

    // Script taglarını çıkar ve güvenlik kontrolünden geçir
    const scripts = Array.from(sanitized.querySelectorAll('script'));
    scripts.forEach(s => s.remove());
    container.appendChild(sanitized);

    // Yalnızca trusted domain'lerden gelen script'leri yürüt
    const addedScripts = [];
    scripts.forEach(oldScript => {
      if (!isTrustedScript(oldScript)) {
        console.warn('[IyzicoPayment] Güvenilmeyen script engellendi:', oldScript.src || '(inline)');
        return;
      }
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = true;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
      addedScripts.push(newScript);
    });

    return () => {
      // Cleanup: eklenen script'leri temizle
      addedScripts.forEach(s => {
        if (s.parentNode) s.parentNode.removeChild(s);
      });
    };
  }, [iyzicoScript]);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-2xl font-light mb-8">{trans.completePayment}</h2>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200/50 min-h-[400px]">
          <p className="text-sm text-muted-foreground mb-4">
            {trans.secureCheckout}
          </p>
          <div ref={containerRef} />
          <div className="mt-8">
            <button
              onClick={onCancel}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {trans.cancelGoBack}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IyzicoPayment;
