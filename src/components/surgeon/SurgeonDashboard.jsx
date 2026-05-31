import React from 'react';
import { motion } from 'motion/react';
import { LogOut, User, Building, Phone, Stethoscope, AlertCircle, FileText, CheckCircle2, Users, XCircle, Loader2 } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useLangStore from '../../store/useLangStore';
import { t } from '../../utils/translations';

export default function SurgeonDashboard() {
  const { user, profile, loading, signOut } = useAuthStore();
  const { lang } = useLangStore();
  const trans = t[lang];

  // Profile henüz yükleniyor (auth tamamlandı ama profile fetch sürüyor)
  if (loading) {
    return (
      <div className="bg-card border border-zinc-200 rounded-3xl p-12 shadow-sm flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-card border border-zinc-200 rounded-3xl p-8 md:p-12 shadow-sm text-center">
        <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-6 text-red-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-4">
          {trans.profileNotFound}
        </h2>
        <p className="text-muted-foreground mb-8">
          {trans.profileNotFoundDesc}
        </p>
        <button
          onClick={signOut}
          className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
        >
          {trans.signOut}
        </button>
      </div>
    );
  }

  // Status'a göre yetkilendirme:
  // - pending: Bekliyor → işlemler kilitli
  // - approved: Onaylı → tüm işlemler açık
  // - rejected: Reddedildi → erişim engelli, sadece çıkış
  const isApproved = profile.status === 'approved';
  const isPending = profile.status === 'pending';
  const isRejected = profile.status === 'rejected';

  if (isRejected) {
    return (
      <div className="bg-card border border-zinc-200 rounded-3xl p-8 md:p-12 shadow-sm text-center">
        <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-6 text-red-500">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-4">
          {trans.applicationRejected}
        </h2>
        <p className="text-muted-foreground mb-8">
          {trans.applicationRejectedDesc}
        </p>
        <button
          onClick={signOut}
          className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
        >
          {trans.signOut}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-zinc-200 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Hoş Geldiniz, Dr. {profile.full_name}</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <MailIcon email={user.email} />
          </p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Çıkış Yap</span>
        </button>
      </div>

      {isPending && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-8 flex gap-4 items-start"
        >
          <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-600 dark:text-yellow-500 mb-1">{trans.accountPending}</h3>
            <p className="text-sm text-yellow-600/80 dark:text-yellow-500/80">
              {trans.accountPendingDesc}
            </p>
          </div>
        </motion.div>
      )}

      {!isPending && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-8 flex gap-4 items-start"
        >
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-600 dark:text-green-500 mb-1">{trans.accountApproved}</h3>
            <p className="text-sm text-green-600/80 dark:text-green-500/80">
              {trans.accountApprovedDesc}
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="font-semibold text-lg border-b border-zinc-200 pb-2">{trans.profileInfo}</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-muted-foreground">
              <User className="w-5 h-5 text-primary" />
              <span>{profile.full_name}</span>
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <Stethoscope className="w-5 h-5 text-primary" />
              <span>{profile.specialty}</span>
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <Building className="w-5 h-5 text-primary" />
              <span>{profile.hospital_name}</span>
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <Phone className="w-5 h-5 text-primary" />
              <span>{profile.phone}</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-6">
          <h3 className="font-semibold text-lg border-b border-zinc-200 pb-2">{trans.quickActions}</h3>
          <div className="grid gap-3">
            <button
              disabled={!isApproved}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${!isApproved ? 'opacity-50 cursor-not-allowed border-zinc-200 bg-muted/50' : 'border-primary/20 hover:border-primary hover:bg-primary/5 bg-background'}`}
            >
              <FileText className={`w-5 h-5 ${!isApproved ? 'text-muted-foreground' : 'text-primary'}`} />
              <div>
                <span className="block font-medium">{trans.newPrescription}</span>
                <span className="text-xs text-muted-foreground">{trans.newPrescriptionDesc}</span>
              </div>
            </button>
            <button
              disabled={!isApproved}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${!isApproved ? 'opacity-50 cursor-not-allowed border-zinc-200 bg-muted/50' : 'border-primary/20 hover:border-primary hover:bg-primary/5 bg-background'}`}
            >
              <Users className={`w-5 h-5 ${!isApproved ? 'text-muted-foreground' : 'text-primary'}`} />
              <div>
                <span className="block font-medium">{trans.myPatients}</span>
                <span className="text-xs text-muted-foreground">{trans.myPatientsDesc}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MailIcon({ email }) {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
      {email}
    </>
  );
}
