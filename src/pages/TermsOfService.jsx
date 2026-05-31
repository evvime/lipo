import React from 'react';
import { motion } from 'motion/react';
import useLangStore from '../store/useLangStore';

const content = {
  TR: {
    title: 'Hizmet Şartları',
    updated: 'Son güncelleme: Ocak 2025',
    intro: 'Wellnur Medical web sitesini ve hizmetlerini kullanmadan önce lütfen bu Hizmet Şartlarını dikkatlice okuyun. Sitemizi ziyaret etmek veya alışveriş yapmak, aşağıdaki şartları kabul ettiğiniz anlamına gelir.',
    sections: [
      {
        title: '1. Taraflar ve Kapsam',
        body: 'Bu Hizmet Şartları; Wellnur Medical ("Wellnur", "satıcı") ile wellnur.com web sitesini kullanan kişi ("kullanıcı", "müşteri") arasındaki ilişkiyi düzenler. Şartlar; web sitesinin tamamını, sipariş ve ödeme süreçlerini, teslimat ve iade hizmetlerini kapsar.',
      },
      {
        title: '2. Ürünler ve Tıbbi Bilgi',
        body: 'Wellnur ürünleri, tıbbi kompresyon giysileri olup ameliyat sonrası iyileşme sürecini desteklemeye yöneliktir. Web sitesindeki içerikler genel bilgilendirme amaçlıdır ve tıbbi tavsiye niteliği taşımaz. Herhangi bir sağlık kararı öncesinde doktorunuza veya ilgili sağlık profesyonelinize danışmanızı tavsiye ederiz.\n\nÜrün görselleri ve açıklamaları mümkün olduğunca doğru sunulmaktadır; ancak renk ve detaylarda ekran ayarlarına bağlı küçük farklılıklar oluşabilir.',
      },
      {
        title: '3. Sipariş ve Ödeme',
        body: 'Sipariş vermek için 18 yaşında veya daha büyük olmanız gerekmektedir. Sipariş formunu doğru ve eksiksiz doldurmakla yükümlüsünüz. Siparişinizi aldıktan sonra tarafınıza onay e-postası gönderilir; sözleşme, bu onay ile kurulmuş sayılır.\n\nÖdemeler SSL ile şifrelenmiş güvenli altyapı üzerinden gerçekleştirilir. Kabul edilen ödeme yöntemleri: kredi/banka kartı ve Iyzico altyapısında desteklenen diğer ödeme araçları. Wellnur, kart bilgilerinizi saklamaz.',
      },
      {
        title: '4. Teslimat',
        body: 'Siparişler, stok durumuna göre genellikle 1-3 iş günü içinde kargoya verilir. Teslimat süreleri kargo firmasına ve teslimat adresine göre değişiklik gösterebilir. Belirtilen teslimat süreleri tahmini olup garanti niteliği taşımaz.\n\nYurt içi teslimatlar Türkiye\'nin tüm illerine yapılmaktadır. Uluslararası teslimat koşulları için lütfen müşteri hizmetleriyle iletişime geçin.',
      },
      {
        title: '5. İptal ve İade',
        body: 'Tüketiciler, ürünü teslim aldıktan itibaren 14 gün içinde herhangi bir gerekçe belirtmeksizin cayma hakkını kullanabilir (6502 sayılı Tüketicinin Korunması Hakkında Kanun). Cayma hakkı kullanımı için ürünün kullanılmamış, orijinal ambalajında ve tüm aksesuarlarıyla birlikte iade edilmesi gerekmektedir.\n\nHijyenik nedenlerle, ambalajı açılmış iç giyim ürünleri iade kapsamı dışındadır. İade talebinizi info@wellnur.com adresine iletebilirsiniz.',
      },
      {
        title: '6. Fikri Mülkiyet',
        body: 'Web sitesindeki tüm içerikler (metin, görsel, logo, tasarım, yazılım vb.) Wellnur Medical\'ın mülkiyetindedir veya lisanslıdır. İzinsiz kopyalanması, çoğaltılması veya ticari amaçla kullanılması yasaktır.',
      },
      {
        title: '7. Sorumluluk Sınırlaması',
        body: 'Wellnur, web sitesinin kesintisiz veya hatasız çalışacağını garanti etmez. Teknik arızalar, siber saldırılar veya mücbir sebepler nedeniyle oluşan zararlardan sorumlu tutulamaz. Ürünlerin yanlış kullanımından doğan zararlar kullanıcının sorumluluğundadır.\n\nWellnur\'un olası bir uyuşmazlıkta yükümlülüğü, söz konusu ürün/hizmet bedeli ile sınırlıdır.',
      },
      {
        title: '8. Gizlilik',
        body: 'Kişisel verilerinizin işlenmesi, Gizlilik Politikamız kapsamında yürütülür. Gizlilik Politikası bu Hizmet Şartlarının ayrılmaz bir parçasını oluşturur.',
      },
      {
        title: '9. Uygulanacak Hukuk ve Uyuşmazlık Çözümü',
        body: 'Bu Hizmet Şartları Türk hukukuna tabidir. Uyuşmazlıklarda öncelikle Tüketici Hakem Heyetlerine, akabinde Tüketici Mahkemelerine başvurulabilir. Tüketici Hakem Heyeti başvuru sınır değerleri Türkiye Ticaret Bakanlığı tarafından her yıl güncellenmektedir.',
      },
      {
        title: '10. Değişiklikler',
        body: 'Wellnur, bu Hizmet Şartlarını önceden bildirimde bulunarak değiştirme hakkını saklı tutar. Değişiklikler web sitesinde yayımlandıktan sonra geçerli olur. Güncel şartları daima bu sayfadan inceleyebilirsiniz.',
      },
      {
        title: '11. İletişim',
        body: 'Hizmet Şartlarımıza ilişkin sorularınız için:\n\nE-posta: info@wellnur.com\nAdres: Türkiye',
      },
    ],
  },
  EN: {
    title: 'Terms of Service',
    updated: 'Last updated: January 2025',
    intro: 'Please read these Terms of Service carefully before using the Wellnur Medical website and services. By visiting our website or placing an order, you agree to the following terms.',
    sections: [
      {
        title: '1. Parties and Scope',
        body: 'These Terms of Service govern the relationship between Wellnur Medical ("Wellnur", "seller") and the person using wellnur.com ("user", "customer"). The terms cover the entire website, order and payment processes, delivery, and return services.',
      },
      {
        title: '2. Products and Medical Information',
        body: 'Wellnur products are medical-grade compression garments designed to support post-operative recovery. Content on the website is for general information purposes only and does not constitute medical advice. We recommend consulting your doctor or a qualified healthcare professional before making any health-related decisions.\n\nProduct images and descriptions are presented as accurately as possible; minor differences in colour or detail may occur due to screen settings.',
      },
      {
        title: '3. Orders and Payments',
        body: 'You must be 18 years of age or older to place an order. You are responsible for providing accurate and complete information on the order form. An order confirmation email will be sent to you upon receipt of your order; the contract is deemed formed upon such confirmation.\n\nPayments are processed over a secure SSL-encrypted infrastructure. Accepted payment methods include credit/debit cards and other instruments supported by Iyzico. Wellnur does not store card details.',
      },
      {
        title: '4. Delivery',
        body: 'Orders are typically dispatched within 1-3 business days, subject to stock availability. Delivery times may vary depending on the carrier and delivery address. Stated delivery times are estimates and are not guaranteed.\n\nDomestic delivery is available to all provinces in Turkey. For international delivery terms, please contact customer service.',
      },
      {
        title: '5. Cancellation and Returns',
        body: 'Consumers may exercise the right of withdrawal within 14 days of receiving the product without giving any reason (Consumer Protection Law No. 6502). To exercise this right, the product must be unused, in its original packaging, and returned with all accessories.\n\nFor hygiene reasons, opened underwear/intimate garments are excluded from the right of return. Please send return requests to info@wellnur.com.',
      },
      {
        title: '6. Intellectual Property',
        body: 'All content on the website (text, images, logos, design, software, etc.) is owned by or licensed to Wellnur Medical. Unauthorised copying, reproduction, or commercial use is prohibited.',
      },
      {
        title: '7. Limitation of Liability',
        body: 'Wellnur does not guarantee uninterrupted or error-free operation of the website and accepts no liability for losses arising from technical failures, cyber-attacks, or force majeure. Damages resulting from misuse of products are the responsibility of the user.\n\nWellnur\'s maximum liability in any dispute is limited to the value of the product or service in question.',
      },
      {
        title: '8. Privacy',
        body: 'The processing of your personal data is governed by our Privacy Policy, which forms an integral part of these Terms of Service.',
      },
      {
        title: '9. Governing Law and Dispute Resolution',
        body: 'These Terms of Service are governed by Turkish law. Disputes may be referred to Consumer Arbitration Committees and, thereafter, Consumer Courts. Monetary thresholds for Consumer Arbitration Committees are updated annually by the Turkish Ministry of Trade.',
      },
      {
        title: '10. Changes',
        body: 'Wellnur reserves the right to amend these Terms of Service with prior notice. Changes take effect upon publication on the website. Always refer to this page for the current version.',
      },
      {
        title: '11. Contact',
        body: 'For questions regarding our Terms of Service:\n\nEmail: info@wellnur.com\nAddress: Turkey',
      },
    ],
  },
};

export default function TermsOfService() {
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
