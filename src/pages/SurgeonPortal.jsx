import React from 'react';
import { motion } from 'motion/react';
import { Stethoscope, Shield, Users } from 'lucide-react';
import useLangStore from '../store/useLangStore';
import useAuthStore from '../store/useAuthStore';
import { t } from '../utils/translations';
import SurgeonAuth from '../components/auth/SurgeonAuth';
import SurgeonDashboard from '../components/surgeon/SurgeonDashboard';

export default function SurgeonPortal() {
  const { lang } = useLangStore();
  const { user } = useAuthStore();
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
            <Stethoscope className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">{trans.surgeonTitle}</h1>
          <p className="text-xl text-muted-foreground">
            {trans.surgeonDesc}
          </p>
        </motion.div>

        {user ? (
          <div className="max-w-4xl mx-auto">
            <SurgeonDashboard />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start mb-16">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] relative sticky top-24">
              <img 
                src="https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Surgeon Consultation" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h2 className="text-2xl font-bold mb-2">{trans.surgeonPartner}</h2>
                <p className="text-white/80 text-sm">
                  {trans.surgeonPartnerDesc}
                </p>
              </div>
            </div>
            
            <div className="w-full">
              <SurgeonAuth />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
