import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useLangStore from '../store/useLangStore';

// Supabase, reset linkindeki access_token'ı detectSessionInUrl ile otomatik
// olarak session'a çevirir. Bu sayfaya gelindiğinde kullanıcı geçici olarak
// authenticated olur ve sadece updateUser ile şifre değiştirebilir.
export default function ResetPassword() {
  const { lang } = useLangStore();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  const texts = {
    TR: {
      title: 'Yeni Şifre Belirleyin',
      desc: 'En az 6 karakter uzunluğunda yeni bir şifre girin.',
      placeholder: 'Yeni Şifre',
      submit: 'Şifreyi Güncelle',
      successMsg: 'Şifreniz güncellendi. Giriş sayfasına yönlendiriliyorsunuz...',
      invalidLink: 'Geçersiz veya süresi dolmuş bağlantı. Lütfen yeniden talep edin.',
    },
    EN: {
      title: 'Set New Password',
      desc: 'Enter a new password (at least 6 characters).',
      placeholder: 'New Password',
      submit: 'Update Password',
      successMsg: 'Password updated. Redirecting to login...',
      invalidLink: 'Invalid or expired link. Please request a new one.',
    },
  };
  const tr = texts[lang] || texts.TR;

  useEffect(() => {
    // Reset link'i ile gelen session var mı kontrol et
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setReady(true);
      } else {
        setError(tr.invalidLink);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4 text-primary">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-heading font-bold mb-2">{tr.title}</h1>
            <p className="text-muted-foreground text-sm">{tr.desc}</p>
          </div>

          <div className="bg-card border border-zinc-200 rounded-3xl p-8 shadow-sm">
            {error && (
              <div className="mb-5 p-4 bg-red-500/10 text-red-600 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-5 p-4 bg-green-500/10 text-green-600 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{tr.successMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tr.placeholder}
                  disabled={!ready || loading}
                  className="w-full pl-10 pr-12 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={!ready || loading}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : tr.submit}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
