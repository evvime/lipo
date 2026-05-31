import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Search } from 'lucide-react';
import useLangStore from '../store/useLangStore';

export default function NotFound() {
  const { lang } = useLangStore();

  const texts = {
    TR: {
      heading: 'Sayfa Bulunamadı',
      subheading: 'Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.',
      goHome: 'Ana Sayfaya Dön',
      goShop: 'Ürünleri Keşfet',
    },
    EN: {
      heading: 'Page Not Found',
      subheading: 'The page you are looking for may have been moved, deleted, or never existed.',
      goHome: 'Back to Home',
      goShop: 'Explore Products',
    },
  };

  const tr = texts[lang] || texts.TR;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl md:text-9xl font-heading font-bold text-primary/20 mb-4 select-none">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          {tr.heading}
        </h1>
        <p className="text-muted-foreground mb-8">
          {tr.subheading}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            {tr.goHome}
          </Link>
          <Link
            to="/shop"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-secondary px-6 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <Search className="w-4 h-4" />
            {tr.goShop}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
