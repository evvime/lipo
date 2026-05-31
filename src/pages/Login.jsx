import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/useAuthStore';
import useLangStore from '../store/useLangStore';
import { t } from '../utils/translations';

export default function Login() {
  const { user } = useAuthStore();
  const { lang } = useLangStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  // Already logged in → admin'e veya profile'a yönlendir
  useEffect(() => {
    if (user) {
      const dest = user.app_metadata?.role === 'admin' ? '/admin' : '/profile';
      navigate(dest, { replace: true });
    }
  }, [user, navigate]);

  const tr = t[lang] || t.TR;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (authError) throw authError;
        setSuccess(tr.successLogin);
        const dest = data.user?.app_metadata?.role === 'admin' ? '/admin' : '/profile';
        setTimeout(() => navigate(dest), 1000);
      } else if (mode === 'register') {
        const { error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { full_name: formData.fullName },
          },
        });
        if (authError) throw authError;
        setSuccess(tr.successRegister);
      } else if (mode === 'forgot') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (authError) throw authError;
        setSuccess(tr.successForgot);
      }
    } catch (err) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center py-16 px-4 page-transition-enter-active">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Icon + Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4 text-primary">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-heading font-bold mb-2">
              {mode === 'login' ? tr.loginTitle : mode === 'register' ? tr.registerTitle : tr.forgotTitle}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mode === 'login' ? tr.loginDesc : mode === 'register' ? tr.registerDesc : tr.forgotDesc}
            </p>
          </div>

          {/* Card */}
          <div className="bg-card border border-zinc-200 rounded-3xl p-8 shadow-sm">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-5 p-4 bg-red-500/10 text-red-600 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {/* Success */}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-5 p-4 bg-green-500/10 text-green-600 rounded-xl flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{success}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name (register only) */}
              {mode === 'register' && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={tr.authFullName}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={tr.authEmail}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Password (forgot modunda gösterilmez) */}
              {mode !== 'forgot' && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={tr.authPassword}
                    className="w-full pl-10 pr-12 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? tr.authHidePassword : tr.authShowPassword}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Forgot password link — yalnızca login modunda */}
              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }}
                    className="text-sm text-primary hover:underline"
                  >
                    {tr.forgotPassword}
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  mode === 'login' ? tr.loginBtn : mode === 'register' ? tr.registerBtn : tr.forgotBtn
                )}
              </button>
            </form>

            {/* Switch mode */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === 'forgot' ? (
                <button
                  onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                  className="text-primary font-medium hover:underline"
                >
                  ← {tr.backToLogin}
                </button>
              ) : (
                <>
                  {mode === 'login' ? tr.noAccount : tr.hasAccount}{' '}
                  <button
                    onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); setSuccess(null); }}
                    className="text-primary font-medium hover:underline"
                  >
                    {mode === 'login' ? tr.switchToRegister : tr.switchToLogin}
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
