import React from 'react';
import { motion } from 'motion/react';
import { PackageOpen, TrendingUp, Handshake, Globe } from 'lucide-react';
import useLangStore from '../store/useLangStore';
import { t } from '../utils/translations';
import WholesaleForm from '../components/forms/WholesaleForm';

export default function Wholesale() {
  const { lang } = useLangStore();
  const trans = t[lang];

  return (
    <div className="bg-background min-h-screen pt-12 pb-24 page-transition-enter-active">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6 text-primary">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">{trans.wholesaleTitle}</h1>
          <p className="text-xl text-muted-foreground">
            {trans.wholesaleDesc}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="bg-card rounded-3xl p-8 md:p-12 border border-zinc-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{trans.wholesalePartner}</h2>
            <p className="text-muted-foreground mb-8">
              {trans.wholesalePartnerDesc}
            </p>
            <div className="grid sm:grid-cols-2 gap-8 text-left mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">{trans.wholesaleBenefits}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{trans.wholesaleBenefitsDesc}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">{trans.wholesaleGlobal}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{trans.wholesaleGlobalDesc}</p>
              </div>
            </div>
          </div>
          
          <div className="w-full">
            <WholesaleForm />
          </div>
        </div>
      </div>
    </div>
  );
}
