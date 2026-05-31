import React from 'react';
import { motion } from 'motion/react';
import useLangStore from '../store/useLangStore';

const content = {
  TR: {
    title: 'Gizlilik Politikası',
    updated: 'Son güncelleme: Ocak 2025',
    intro: 'Wellnur Medical ("Wellnur", "biz", "bizim") olarak kişisel verilerinizin güvenliğine ve gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası; 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat kapsamında hangi verileri topladığımızı, bu verileri nasıl kullandığımızı ve haklarınızı açıklamaktadır.',
    sections: [
      {
        title: '1. Veri Sorumlusu',
        body: 'Kişisel verileriniz bakımından veri sorumlusu, Wellnur Medical\'dır. İletişim adresi: info@wellnur.com',
      },
      {
        title: '2. Toplanan Kişisel Veriler',
        body: 'Wellnur olarak aşağıdaki kişisel verilerinizi işleyebiliriz:\n\n• Kimlik verileri: Ad, soyad\n• İletişim verileri: E-posta adresi, telefon numarası, teslimat/fatura adresi\n• Müşteri işlem verileri: Sipariş geçmişi, iade talepleri, ödeme bilgileri (kart bilgileri saklanmaz; ödeme 3. taraf sağlayıcılar aracılığıyla işlenir)\n• Kullanım verileri: IP adresi, tarayıcı bilgisi, site içi davranışlar (çerezler aracılığıyla)\n• Sağlık verisi (özel nitelikli): Yalnızca ürün tavsiyesi amacıyla ve açık rızanıza dayalı olarak işlenen cerrahi prosedür bilgisi',
      },
      {
        title: '3. Kişisel Verilerin İşlenme Amaçları',
        body: 'Verileriniz aşağıdaki amaçlarla işlenmektedir:\n\n• Siparişlerinizin alınması, işlenmesi ve teslimatın sağlanması\n• Müşteri hizmetleri ve iletişim\n• Fatura ve muhasebe yükümlülüklerinin yerine getirilmesi\n• Kargo ve lojistik süreçlerinin yürütülmesi\n• Yasal yükümlülüklerin yerine getirilmesi\n• İzninize dayalı pazarlama ve bilgilendirme iletişimleri\n• Web sitesi güvenliği ve kullanım deneyiminin iyileştirilmesi',
      },
      {
        title: '4. Kişisel Verilerin Aktarılması',
        body: 'Kişisel verileriniz; kargo/lojistik şirketleri, ödeme hizmet sağlayıcıları, bulut altyapı hizmet sağlayıcıları ve yasal zorunluluk hâlinde kamu kurumlarıyla paylaşılabilir. Verileriniz hiçbir surette ticari amaçla üçüncü taraflara satılmaz.',
      },
      {
        title: '5. Çerezler (Cookies)',
        body: 'Web sitemiz; zorunlu çerezler (oturum yönetimi), analitik çerezler (Google Analytics) ve tercih çerezleri kullanmaktadır. Analitik ve tercih çerezlerini tarayıcı ayarlarınızdan devre dışı bırakabilirsiniz. Zorunlu çerezlerin kapatılması sitenin işlevselliğini etkileyebilir.',
      },
      {
        title: '6. Veri Güvenliği',
        body: 'Kişisel verileriniz, SSL/TLS şifrelemesi, erişim kontrolü ve güvenli sunucu altyapıları gibi teknik ve idari tedbirlerle korunmaktadır. Ödeme bilgileriniz sunucularımızda saklanmaz; PCI-DSS uyumlu ödeme sağlayıcıları tarafından işlenir.',
      },
      {
        title: '7. Verilerin Saklanma Süresi',
        body: 'Kişisel verileriniz, işlenme amacının sona ermesi veya yasal saklama süresinin dolması hâlinde silinir, yok edilir veya anonim hâle getirilir. Ticari kayıtlar ve fatura bilgileri Türk Ticaret Kanunu gereği 10 yıl süreyle saklanır.',
      },
      {
        title: '8. KVKK Kapsamındaki Haklarınız',
        body: 'KVKK\'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:\n\n• Kişisel verilerinizin işlenip işlenmediğini öğrenme\n• İşlenmişse buna ilişkin bilgi talep etme\n• İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme\n• Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme\n• Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme\n• Verilerin silinmesini veya yok edilmesini isteme\n• İşlemeye itiraz etme\n• Otomatik sistemler aracılığıyla analiz edilmesi sonucu aleyhinize çıkan karara itiraz etme\n• Zararın giderilmesini talep etme\n\nBaşvurularınızı info@wellnur.com adresine iletebilirsiniz. Talepleriniz 30 gün içinde yanıtlanacaktır.',
      },
      {
        title: '9. Politika Değişiklikleri',
        body: 'Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler yapılması hâlinde web sitemiz veya kayıtlı e-posta adresiniz aracılığıyla bilgilendirme yapılır. Güncel politikayı daima bu sayfadan inceleyebilirsiniz.',
      },
      {
        title: '10. İletişim',
        body: 'Gizlilik uygulamalarımız veya kişisel verilerinizle ilgili her türlü soru ve talebiniz için:\n\nE-posta: info@wellnur.com\nAdres: Türkiye',
      },
    ],
  },
  EN: {
    title: 'Privacy Policy',
    updated: 'Last updated: January 2025',
    intro: 'At Wellnur Medical ("Wellnur", "we", "our"), we are committed to protecting your personal data and privacy. This Privacy Policy explains what data we collect, how we use it, and your rights under Turkish Personal Data Protection Law No. 6698 (KVKK) and applicable regulations.',
    sections: [
      {
        title: '1. Data Controller',
        body: 'The data controller for your personal data is Wellnur Medical. Contact: info@wellnur.com',
      },
      {
        title: '2. Personal Data We Collect',
        body: 'We may process the following categories of personal data:\n\n• Identity data: First name, last name\n• Contact data: Email address, phone number, delivery/billing address\n• Transaction data: Order history, return requests, payment details (card data is never stored; payments are processed via third-party providers)\n• Usage data: IP address, browser information, on-site behaviour (via cookies)\n• Health data (sensitive): Surgical procedure information processed solely for product recommendations and only with your explicit consent',
      },
      {
        title: '3. Purposes of Processing',
        body: 'Your data is processed for the following purposes:\n\n• Receiving, processing, and fulfilling your orders\n• Customer service and communications\n• Invoicing and accounting obligations\n• Logistics and delivery management\n• Compliance with legal obligations\n• Marketing and informational communications (with your consent)\n• Website security and improving user experience',
      },
      {
        title: '4. Data Sharing',
        body: 'Your personal data may be shared with shipping/logistics companies, payment service providers, cloud infrastructure providers, and public authorities when legally required. Your data is never sold to third parties for commercial purposes.',
      },
      {
        title: '5. Cookies',
        body: 'Our website uses essential cookies (session management), analytics cookies (Google Analytics), and preference cookies. You may disable analytics and preference cookies in your browser settings. Disabling essential cookies may affect site functionality.',
      },
      {
        title: '6. Data Security',
        body: 'Your personal data is protected with technical and administrative measures including SSL/TLS encryption, access controls, and secure server infrastructure. Payment data is never stored on our servers; it is processed by PCI-DSS compliant payment providers.',
      },
      {
        title: '7. Data Retention',
        body: 'Personal data is deleted, destroyed, or anonymised once the purpose of processing has ended or the legal retention period has expired. Commercial records and invoices are retained for 10 years as required by Turkish Commercial Code.',
      },
      {
        title: '8. Your Rights Under KVKK',
        body: 'Under Article 11 of KVKK, you have the right to:\n\n• Learn whether your personal data is being processed\n• Request information if it is being processed\n• Learn the purpose and whether it is used accordingly\n• Know third parties to whom data is transferred\n• Request correction of incomplete or incorrect data\n• Request deletion or destruction of data\n• Object to processing\n• Object to decisions made via automated systems\n• Claim compensation for damages\n\nYou may submit requests to info@wellnur.com. We will respond within 30 days.',
      },
      {
        title: '9. Policy Updates',
        body: 'This Privacy Policy may be updated from time to time. For significant changes, we will notify you via our website or your registered email address. Always refer to this page for the latest version.',
      },
      {
        title: '10. Contact',
        body: 'For any questions or requests regarding our privacy practices or your personal data:\n\nEmail: info@wellnur.com\nAddress: Turkey',
      },
    ],
  },
};

export default function PrivacyPolicy() {
  const { lang } = useLangStore();
  const c = content[lang] || content.TR;

  return (
    <div className="bg-background min-h-screen page-transition-enter-active">
      {/* Hero */}
      <div className="bg-primary/10 py-14 border-b border-primary/20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-5xl font-heading font-bold text-primary-900 mb-3"
          >
            {c.title}
          </motion.h1>
          <p className="text-sm text-muted-foreground">{c.updated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-14 max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-muted-foreground leading-relaxed mb-10 text-base"
        >
          {c.intro}
        </motion.p>

        <div className="space-y-10">
          {c.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <h2 className="text-lg font-bold mb-3 text-foreground">{section.title}</h2>
              <div className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                {section.body}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
