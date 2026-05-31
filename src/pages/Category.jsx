import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { products, categories } from '../data/mockData';
import useLangStore from '../store/useLangStore';
import { t } from '../utils/translations';

export default function Category() {
  const { slug } = useParams();
  const { lang } = useLangStore();
  const trans = t[lang];
  
  const category = categories.find(c => c.id === slug);
  const categoryProducts = products.filter(p => p.categoryId === slug);
  
  return (
    <div className="bg-background min-h-screen pt-8 pb-16 page-transition-enter-active">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 capitalize">
            {category ? trans[category.nameKey] : slug.replace('-', ' ')}
          </h1>
          {category && <p className="text-muted-foreground text-lg">{trans[category.descKey]}</p>}
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-20 bg-secondary/30 rounded-2xl">
            <p className="text-xl text-muted-foreground">{trans.noProducts}</p>
            <Link to="/shop" className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors">
              {trans.seeAllProducts}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {categoryProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary/50 mb-4">
                    <img 
                      src={product.images[0]} 
                      alt={trans[product.nameKey]} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {trans[product.nameKey]}
                    </h3>
                    <p className="font-bold text-foreground mt-2">{product.price.toFixed(2)} TL</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
