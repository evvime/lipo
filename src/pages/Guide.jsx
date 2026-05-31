import React from 'react';
import { motion } from 'motion/react';
import useLangStore from '../store/useLangStore';
import { t } from '../utils/translations';

export default function Guide() {
  const { lang } = useLangStore();
  const trans = t[lang];

  const steps = [
    {
      title: trans.step1Title,
      description: trans.step1Desc,
      number: "1",
      image: "https://cdn.dsmcdn.com/ty1775/prod/QC_PREP/20251016/23/9a8fe498-d5b1-37fe-955f-379e66e9e16f/1_org_zoom.jpg"
    },
    {
      title: trans.step2Title,
      description: trans.step2Desc,
      number: "2",
      image: "https://cdn.dsmcdn.com/ty1775/prod/QC_PREP/20251016/23/629a3f5b-22cf-31d1-ab64-39a85b0fe19e/1_org_zoom.jpg"
    },
    {
      title: trans.step3Title,
      description: trans.step3Desc,
      number: "3",
      image: "https://cdn.dsmcdn.com/ty1776/prod/QC_PREP/20251021/00/2c910bec-28f3-396e-94bc-662985dd04cd/1_org_zoom.jpg"
    },
    {
      title: trans.step4Title,
      description: trans.step4Desc,
      number: "4",
      image: "https://cdn.dsmcdn.com/ty1778/prod/QC_PREP/20251020/20/9e8020a0-bf61-3753-9e00-177c934c8221/1_org_zoom.jpg"
    }
  ];

  return (
    <div className="bg-background min-h-screen page-transition-enter-active">
      <div className="bg-primary/10 py-16 border-b border-primary/20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-900 mb-6">
            {trans.guideTitle}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {trans.guideDesc}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Steps with Images */}
        <div className="max-w-5xl mx-auto space-y-16">
          <h2 className="text-2xl font-heading font-bold mb-8 text-center">{trans.stepsTitle}</h2>
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={`${index % 2 !== 0 ? 'md:order-2' : 'md:order-1'}`}>
                <div className="flex gap-4 items-start mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-md">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${index % 2 !== 0 ? 'md:order-1' : 'md:order-2'}`}>
                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-secondary/20 shadow-lg">
                  <img 
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          ))}
          
          <div className="mt-12 p-6 bg-secondary/50 rounded-xl border border-zinc-200 max-w-3xl mx-auto">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {trans.proTip}
            </h4>
            <p className="text-sm text-muted-foreground">
              {trans.proTipDesc}
            </p>
          </div>
        </div>

        {/* Visual Reference */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
              <img
                src="https://cdn.dsmcdn.com/ty1775/prod/QC_PREP/20251016/23/640da92a-5fa8-391e-b7a5-a3658de156d0/1_org_zoom.jpg"
                alt="Liposuction kompresyon korsesi"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
              <img
                src="https://cdn.dsmcdn.com/ty1778/prod/QC_PREP/20251020/20/904a5479-cd62-3ea7-8771-34828221f07f/1_org_zoom.jpg"
                alt="BBL ameliyat sonrası korse"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
              <img
                src="https://cdn.dsmcdn.com/ty1776/prod/QC_PREP/20251021/00/12878fb0-0371-3ad0-ace3-8e60faab39c8/1_org_zoom.jpg"
                alt="Post-op sütyeni"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground font-medium uppercase tracking-wider text-center">
            {trans.visualRef}
          </p>
        </motion.div>

        {/* How to Measure Instructions */}
        <div className="mt-24 mb-12">
          <h2 className="text-2xl font-heading font-bold mb-8 text-center">
            {lang === 'TR' ? 'Ölçüm Nasıl Alınır?' : 'How to Measure'}
          </h2>
          <div className="max-w-4xl mx-auto bg-secondary/10 p-8 rounded-2xl border border-zinc-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold flex items-center gap-3 text-lg text-primary-900">
                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                    {lang === 'TR' ? 'Göğüs (Bust)' : 'Bust'}
                  </h4>
                  <p className="text-muted-foreground mt-2 pl-10">
                    {lang === 'TR' 
                      ? 'Mezurayı göğsünüzün en geniş kısmından, kollarınızın altından ve sırttan düz bir şekilde geçirerek ölçün.' 
                      : 'Measure across the fullest part of your bust, keeping the tape horizontal.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold flex items-center gap-3 text-lg text-primary-900">
                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
                    {lang === 'TR' ? 'Göğüs Altı (Underbust)' : 'Underbust'}
                  </h4>
                  <p className="text-muted-foreground mt-2 pl-10">
                    {lang === 'TR' 
                      ? 'Mezurayı göğsünüzün hemen altından, nefesinizi normal seviyede tutarak sıkmadan ölçün.' 
                      : 'Measure directly under your bust, keeping the tape comfortably snug.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold flex items-center gap-3 text-lg text-primary-900">
                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
                    {lang === 'TR' ? 'Bel (Waist)' : 'Waist'}
                  </h4>
                  <p className="text-muted-foreground mt-2 pl-10">
                    {lang === 'TR' 
                      ? 'Mezurayı belinizin en ince kısmından (genellikle göbek deliğinin hemen üzeri) çok sıkmadan geçirerek ölçün.' 
                      : 'Measure around the narrowest part of your waistline, keeping the tape comfortably loose.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold flex items-center gap-3 text-lg text-primary-900">
                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">4</span>
                    {lang === 'TR' ? 'Kalça (Hips)' : 'Hips'}
                  </h4>
                  <p className="text-muted-foreground mt-2 pl-10">
                    {lang === 'TR' 
                      ? 'Ayaklarınızı birleştirerek dik durun. Mezurayı kalçanızın en geniş kısmından yere paralel olacak şekilde geçirerek ölçün.' 
                      : 'Stand with feet together and measure around the fullest part of your hips.'}
                  </p>
                </div>
              </div>
              <div className="relative flex justify-center">
                <img 
                  src="/measurement_guide.jpg" 
                  alt="Ölçüm Rehberi" 
                  className="w-full max-w-sm h-auto rounded-xl shadow-lg object-cover aspect-[4/5]" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Size Chart Table */}
        <div>
          <h2 className="text-2xl font-heading font-bold mb-8 text-center">{trans.sizeChart}</h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 shadow-sm max-w-4xl mx-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="p-4 font-semibold">{trans.chartSize}</th>
                  <th className="p-4 font-semibold">{trans.chartUnderbust}</th>
                  <th className="p-4 font-semibold">{trans.chartBust}</th>
                  <th className="p-4 font-semibold">{trans.chartWaist}</th>
                  <th className="p-4 font-semibold">{trans.chartHips}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">XS</td>
                  <td className="p-4">65-70</td>
                  <td className="p-4">75-80</td>
                  <td className="p-4">60-65</td>
                  <td className="p-4">85-90</td>
                </tr>
                <tr className="bg-secondary/5 hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">S</td>
                  <td className="p-4">70-75</td>
                  <td className="p-4">80-85</td>
                  <td className="p-4">65-70</td>
                  <td className="p-4">90-95</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">M</td>
                  <td className="p-4">75-80</td>
                  <td className="p-4">85-90</td>
                  <td className="p-4">70-75</td>
                  <td className="p-4">95-100</td>
                </tr>
                <tr className="bg-secondary/5 hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">L</td>
                  <td className="p-4">80-85</td>
                  <td className="p-4">90-95</td>
                  <td className="p-4">75-80</td>
                  <td className="p-4">100-105</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">XL</td>
                  <td className="p-4">85-90</td>
                  <td className="p-4">95-100</td>
                  <td className="p-4">80-85</td>
                  <td className="p-4">105-110</td>
                </tr>
                <tr className="bg-secondary/5 hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">XXL</td>
                  <td className="p-4">90-95</td>
                  <td className="p-4">100-105</td>
                  <td className="p-4">85-90</td>
                  <td className="p-4">110-115</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
