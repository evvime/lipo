import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useLangStore from '../../store/useLangStore';

export default function WholesaleForm() {
  const { lang } = useLangStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    taxId: '',
    message: ''
  });

  const texts = {
    tr: {
      companyName: 'Firma Adı',
      contactName: 'Yetkili Adı Soyadı',
      email: 'E-posta Adresi',
      phone: 'Telefon Numarası',
      taxId: 'Vergi No / T.C. Kimlik No',
      message: 'Mesajınız',
      submit: 'Başvuruyu Gönder',
      successTitle: 'Başvurunuz Alındı',
      successDesc: 'Toptan satış başvurunuz başarıyla bize ulaştı. Satış ekibimiz en kısa sürede sizinle iletişime geçecektir.',
      newApplication: 'Yeni Başvuru Yap'
    },
    en: {
      companyName: 'Company Name',
      contactName: 'Contact Person',
      email: 'Email Address',
      phone: 'Phone Number',
      taxId: 'Tax ID / VAT Number',
      message: 'Your Message',
      submit: 'Submit Application',
      successTitle: 'Application Received',
      successDesc: 'Your wholesale application has been successfully received. Our sales team will contact you shortly.',
      newApplication: 'Submit New Application'
    }
  };

  const t = texts[lang.toLowerCase()] || texts.tr;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from('wholesale_applications')
        .insert([{
          company_name: formData.companyName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          tax_id: formData.taxId,
          message: formData.message,
          status: 'new'
        }]);

      if (dbError) throw dbError;
      setSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 md:p-12 text-center"
      >
        <div className="inline-flex items-center justify-center p-4 bg-green-500/20 rounded-full mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-green-600 dark:text-green-500 mb-4">{t.successTitle}</h3>
        <p className="text-green-600/80 dark:text-green-500/80 mb-8">
          {t.successDesc}
        </p>
        <button
          onClick={() => {
            setFormData({ companyName: '', contactName: '', email: '', phone: '', taxId: '', message: '' });
            setSuccess(false);
          }}
          className="px-8 py-3 bg-background border border-zinc-200 rounded-full hover:bg-muted transition-colors font-medium"
        >
          {t.newApplication}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-card border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-red-500/10 text-red-500 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="companyName"
            required
            value={formData.companyName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder={t.companyName}
          />
          <input
            type="text"
            name="contactName"
            required
            value={formData.contactName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder={t.contactName}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder={t.email}
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder={t.phone}
          />
        </div>
        <input
          type="text"
          name="taxId"
          value={formData.taxId}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder={t.taxId}
        />
        <textarea
          name="message"
          rows="4"
          required
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
          placeholder={t.message}
        ></textarea>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              {t.submit}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
