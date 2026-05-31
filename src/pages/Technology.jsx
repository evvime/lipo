import React from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, ShieldCheck, Microscope } from 'lucide-react';
import useLangStore from '../store/useLangStore';
import { t } from '../utils/translations';

export default function Technology() {
  const { lang } = useLangStore();
  const trans = t[lang];

  return (
    <div className="bg-background min-h-screen pt-12 pb-24 page-transition-enter-active">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6 text-primary">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">{trans.techTitle}</h1>
          <p className="text-xl text-muted-foreground">
            {trans.techDesc}
          </p>
        </motion.div>

        <div className="space-y-24 max-w-5xl mx-auto">
          {/* Tech 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden aspect-square relative bg-secondary/30 flex items-center justify-center">
              <img 
                src="https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Fabric Innovation" 
                className="object-cover w-full h-full absolute inset-0 opacity-80 mix-blend-multiply"
              />
              <Zap className="w-24 h-24 text-primary relative z-10 bg-white/80 p-4 rounded-full shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">{trans.techInnovate}</h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                {trans.techInnovateDesc}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>{trans.techBullet1}</span>
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>{trans.techBullet2}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tech 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="order-1 md:order-2 rounded-3xl overflow-hidden aspect-square relative bg-secondary/30 flex items-center justify-center">
              <img 
                src="https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Antimicrobial Technology" 
                className="object-cover w-full h-full absolute inset-0 opacity-80 mix-blend-multiply"
              />
              <Microscope className="w-24 h-24 text-primary relative z-10 bg-white/80 p-4 rounded-full shadow-lg" />
            </div>
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4">{trans.techBreathable}</h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                {trans.techBreathableDesc}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>{trans.techBullet3}</span>
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>{trans.techBullet4}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
