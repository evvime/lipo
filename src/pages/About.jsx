import React from 'react';
import { motion } from 'motion/react';
import { Shield, Heart, Award } from 'lucide-react';
import useLangStore from '../store/useLangStore';
import { t } from '../utils/translations';

export default function About() {
  const { lang } = useLangStore();
  const trans = t[lang];

  return (
    <div className="bg-background min-h-screen page-transition-enter-active">
      {/* Hero */}
      <div className="bg-secondary/30 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-bold mb-6"
          >
            {trans.aboutHeroTitle}<span className="text-primary">{trans.aboutHeroHighlight}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            {trans.aboutHeroDesc}
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold mb-6">{trans.ourMission}</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {trans.missionP1}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {trans.missionP2}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-secondary"
          >
            <img 
              src="https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Medical professional reviewing garments" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="p-8 bg-secondary/20 rounded-2xl border border-zinc-200/50 text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-3">{trans.clinicallyProven}</h3>
            <p className="text-muted-foreground">{trans.clinicallyProvenDesc}</p>
          </div>
          <div className="p-8 bg-secondary/20 rounded-2xl border border-zinc-200/50 text-center">
            <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-3">{trans.patientFirst}</h3>
            <p className="text-muted-foreground">{trans.patientFirstDesc}</p>
          </div>
          <div className="p-8 bg-secondary/20 rounded-2xl border border-zinc-200/50 text-center">
            <Award className="w-12 h-12 text-primary mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-3">{trans.premiumQuality}</h3>
            <p className="text-muted-foreground">{trans.premiumQualityDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
