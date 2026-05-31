import React from 'react';
import { motion } from 'motion/react';
import { Truck, RotateCcw, Clock, ShieldCheck } from 'lucide-react';
import useLangStore from '../store/useLangStore';
import { t } from '../utils/translations';

export default function Shipping() {
  const { lang } = useLangStore();
  
  return (
    <div className="bg-background min-h-screen pt-12 pb-24 page-transition-enter-active">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{t[lang].shipTitle}</h1>
          <p className="text-xl text-muted-foreground">{t[lang].shipDesc}</p>
        </motion.div>

        <div className="space-y-12">
          {/* Shipping Policy */}
          <section className="bg-secondary/20 p-8 md:p-10 rounded-3xl border border-zinc-200/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Truck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">{t[lang].shipOptions}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-background p-6 rounded-xl border border-zinc-200/50">
                  <h3 className="font-bold text-lg mb-2">{t[lang].stdShip}</h3>
                  <p className="text-muted-foreground mb-4">{t[lang].stdShipTime}</p>
                  <p className="font-semibold text-primary">{t[lang].stdShipPrice}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t[lang].stdShipExtra}</p>
                </div>
                <div className="bg-background p-6 rounded-xl border border-zinc-200/50 border-primary/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {t[lang].recSurgery}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{t[lang].expShip}</h3>
                  <p className="text-muted-foreground mb-4">{t[lang].expShipTime}</p>
                  <p className="font-semibold text-primary">{t[lang].expShipPrice}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t[lang].expShipExtra}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t[lang].shipImportant}
              </p>
            </div>
          </section>

          {/* Returns Policy */}
          <section className="bg-secondary/20 p-8 md:p-10 rounded-3xl border border-zinc-200/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">{t[lang].returnPolicy}</h2>
            </div>
            
            <div className="prose prose-gray max-w-none text-muted-foreground">
              <p className="lead text-foreground font-medium text-lg mb-4">
                {t[lang].returnLead}
              </p>
              
              <h3 className="text-foreground font-bold mt-8 mb-4">{t[lang].hygieneProtocol}</h3>
              <p className="mb-4">
                {t[lang].hygieneDesc}
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-lg my-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-amber-800 dark:text-amber-500 font-bold mb-1 m-0">{t[lang].tryingOn}</h4>
                    <p className="text-amber-700 dark:text-amber-600/80 m-0 text-sm">
                      {t[lang].tryingOnDesc}
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-foreground font-bold mt-8 mb-4">{t[lang].initiateReturn}</h3>
              <ol className="list-decimal pl-5 space-y-2 mb-6">
                <li>{t[lang].initStep1}</li>
                <li>{t[lang].initStep2}</li>
                <li>{t[lang].initStep3}</li>
                <li>{t[lang].initStep4}</li>
                <li>{t[lang].initStep5}</li>
              </ol>

              <h3 className="text-foreground font-bold mt-8 mb-4">{t[lang].refundProc}</h3>
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>{t[lang].refundWait}</span>
              </div>
              <p>{t[lang].refundMethod}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
