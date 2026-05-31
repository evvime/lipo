import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Building, Stethoscope, Phone, AlertCircle, Loader2 } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useLangStore from '../../store/useLangStore';
import { t as translations } from '../../utils/translations';

export default function SurgeonAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signIn, signUp } = useAuthStore();
  const { lang } = useLangStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    hospitalName: '',
    specialty: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, {
          fullName: formData.fullName,
          hospitalName: formData.hospitalName,
          specialty: formData.specialty,
          phone: formData.phone
        });
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const trans = translations[lang] || translations.TR;
  const tt = {
    login: trans.surgeonLogin,
    register: trans.surgeonRegister,
    email: trans.authEmail,
    password: trans.authPassword,
    fullName: trans.authFullName,
    hospitalName: trans.surgeonHospitalName,
    specialty: trans.surgeonSpecialty,
    phone: trans.surgeonPhone,
    submitLogin: trans.surgeonSubmitLogin,
    submitRegister: trans.surgeonSubmitRegister,
    toggleToRegister: trans.surgeonToggleToRegister,
    toggleToLogin: trans.surgeonToggleToLogin,
  };

  return (
    <div className="bg-card border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => { setIsLogin(true); setError(null); }}
          className={`flex-1 pb-3 text-lg font-medium border-b-2 transition-colors ${isLogin ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          {tt.login}
        </button>
        <button
          onClick={() => { setIsLogin(false); setError(null); }}
          className={`flex-1 pb-3 text-lg font-medium border-b-2 transition-colors ${!isLogin ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          {tt.register}
        </button>
      </div>

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
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required={!isLogin}
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder={tt.fullName}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <Building className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="hospitalName"
                  required={!isLogin}
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder={tt.hospitalName}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="specialty"
                  required={!isLogin}
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder={tt.specialty}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required={!isLogin}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder={tt.phone}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder={tt.email}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-background border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder={tt.password}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            isLogin ? tt.submitLogin : tt.submitRegister
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => { setIsLogin(!isLogin); setError(null); }}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {isLogin ? tt.toggleToRegister : tt.toggleToLogin}
        </button>
      </div>
    </div>
  );
}
