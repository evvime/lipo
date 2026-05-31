import { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import useLangStore from '../store/useLangStore';
import { t } from '../utils/translations';
import { supabase } from '../lib/supabase';

// GStack S3 Fix: Spam koruması — 30 saniyelik cooldown
const SUBMIT_COOLDOWN_MS = 30_000;

export default function Contact() {
  const { lang } = useLangStore();
  const form = useRef(null);
  const lastSubmitRef = useRef(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error' | 'cooldown'

  const sendMessage = useCallback(async (e) => {
    e.preventDefault();

    // GStack S3: Rate limit — 30 saniye cooldown
    const now = Date.now();
    if (now - lastSubmitRef.current < SUBMIT_COOLDOWN_MS) {
      setSubmitStatus('cooldown');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(form.current);

    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        full_name: formData.get('user_name'),
        email:     formData.get('user_email'),
        subject:   formData.get('subject'),
        message:   formData.get('message'),
        lang:      lang,
      });

    if (error) {
      console.error('Supabase error:', error.message);
      setSubmitStatus('error');
    } else {
      lastSubmitRef.current = now;
      setSubmitStatus('success');
      form.current.reset();
    }

    setIsSubmitting(false);
  }, [lang]);

  return (
    <div className="bg-background min-h-screen pt-12 pb-24 page-transition-enter-active">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{t[lang].contactTitle}</h1>
          <p className="text-xl text-muted-foreground">{t[lang].contactDesc}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-secondary/20 p-8 rounded-3xl border border-zinc-200/50">
              <h3 className="text-2xl font-bold mb-6">{t[lang].getInTouch}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t[lang].emailSupport}</h4>
                    <p className="text-muted-foreground text-sm mb-1">{t[lang].emailDesc}</p>
                    <a href="mailto:support@wellnur.com" className="text-primary font-medium hover:underline">support@wellnur.com</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t[lang].phone}</h4>
                    <p className="text-muted-foreground text-sm mb-1">{t[lang].phoneDesc}</p>
                    <a href="tel:+18005550199" className="text-primary font-medium hover:underline">+1 (800) 555-0199</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t[lang].headquarters}</h4>
                    <p className="text-muted-foreground text-sm">
                      123 Medical Innovation Way<br />
                      Suite 400<br />
                      Boston, MA 02110
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-3xl border border-zinc-200 shadow-sm">
              <h3 className="text-2xl font-bold mb-6">{t[lang].sendMsg}</h3>
              
              {submitStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-400 p-8 rounded-2xl flex flex-col items-center justify-center text-center border border-green-200 dark:border-green-900"
                >
                  <CheckCircle2 className="w-16 h-16 mb-4 text-green-500" />
                  <h4 className="text-2xl font-bold mb-2">{t[lang].msgSent}</h4>
                  <p>{t[lang].msgSentDesc}</p>
                  <button 
                    onClick={() => setSubmitStatus(null)}
                    className="mt-6 px-6 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    {t[lang].sendAnother}
                  </button>
                </motion.div>
              ) : (
                <form ref={form} onSubmit={sendMessage} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="user_name" className="text-sm font-medium">{t[lang].fullName} <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="user_name" 
                        id="user_name" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="user_email" className="text-sm font-medium">{t[lang].emailAddress} <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        name="user_email" 
                        id="user_email" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">{t[lang].subject}</label>
                    <select 
                      name="subject" 
                      id="subject"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    >
                      <option value="Sizing Help">{t[lang].subjHelp}</option>
                      <option value="Order Status">{t[lang].subjStatus}</option>
                      <option value="Returns/Exchanges">{t[lang].subjReturns}</option>
                      <option value="Product Question">{t[lang].subjQuestion}</option>
                      <option value="Other">{t[lang].subjOther}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">{t[lang].message} <span className="text-red-500">*</span></label>
                    <textarea 
                      name="message" 
                      id="message" 
                      rows="5"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder={t[lang].msgPlaceholder}
                    ></textarea>
                  </div>

                  {submitStatus === 'cooldown' && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl text-sm border border-amber-200 dark:border-amber-900 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {lang === 'TR' ? 'Lütfen tekrar göndermek için 30 saniye bekleyin.' : 'Please wait 30 seconds before sending again.'}
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-900 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {t[lang].errorMsg}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full relative inline-flex h-14 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ccfbf1_0%,#0d9488_50%,#ccfbf1_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background px-8 text-sm font-medium text-foreground backdrop-blur-3xl transition-colors hover:bg-secondary/50 gap-2">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t[lang].sending}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {t[lang].sendBtn}
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
