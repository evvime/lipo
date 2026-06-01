import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import MagicButton from '../components/ui/MagicButton';
import TextReveal from '../components/ui/TextReveal';
import useLangStore from '../store/useLangStore';
import { t } from '../utils/translations';
import { useProducts, useCategories } from '../hooks/useProducts';

// useProducts hook'u Supabase yoksa mockData'ya fallback yapar.
// Bu yüzden her iki şemayı da destekleyen alan okuyucular kullanıyoruz.
const getName = (item, lang, trans) =>
  item.nameKey ? trans[item.nameKey] : (lang === 'EN' ? item.name_en : item.name_tr);

const getDesc = (item, lang, trans) =>
  item.descKey ? trans[item.descKey] : (lang === 'EN' ? item.description_en : item.description_tr);

const getCategoryId = (product) => product.categoryId ?? product.category_id;

export default function Home() {
  const { lang } = useLangStore();
  const trans = t[lang];
  const { categories } = useCategories();
  const { products } = useProducts();
  const [email, setEmail] = useState('');

  const testimonials = [
    { text: trans.t1Text, name: trans.t1Name, role: trans.t1Role },
    { text: trans.t2Text, name: trans.t2Name, role: trans.t2Role },
    { text: trans.t3Text, name: trans.t3Name, role: trans.t3Role },
  ];

  const handleNewsletter = (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      toast.error(trans.newsletterInvalid);
      return;
    }
    toast.success(trans.newsletterSuccess);
    setEmail('');
  };

  return (
    <div className="page-transition-enter-active">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 bg-gradient-to-br from-secondary/50 to-background overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block"
              >
                {trans.advMedComp}
              </motion.span>
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground leading-tight mb-6">
                <TextReveal text={trans.optFor} />
                <span className="text-primary mt-2 block">
                  <TextReveal text={trans.yourRecov} />
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-muted-foreground mb-8 max-w-lg"
              >
                {trans.heroDesc}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <MagicButton to="/category/liposuction">
                  {trans.shopByProcBtn}
                </MagicButton>
                <Link
                  to="/guide"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-secondary px-8 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  {trans.sizingGuideBtn}
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] flex justify-center items-center"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
              <img
                src="https://cdn.dsmcdn.com/ty1775/prod/QC_PREP/20251016/23/9a8fe498-d5b1-37fe-955f-379e66e9e16f/1_org_zoom.jpg"
                alt="Medical compression garment"
                className="relative z-10 max-h-full object-contain drop-shadow-2xl mix-blend-multiply rounded-3xl"
                loading="eager"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shop By Procedure Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{trans.shopByProc}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {trans.shopByProcDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const name = getName(category, lang, trans);
              const desc = getDesc(category, lang, trans);
              const image = category.image || category.cover_image_url || category.image_url;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/category/${category.slug}`} className="group block h-full">
                    <div className="relative rounded-xl overflow-hidden aspect-[4/5] mb-6 bg-secondary/30">
                      <div className="absolute inset-0 bg-foreground/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      {image && (
                        <img
                          src={image}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background/90 to-transparent z-20">
                        <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                          {name}
                        </h3>
                      </div>
                    </div>
                    {desc && (
                      <p className="text-muted-foreground line-clamp-2">{desc}</p>
                    )}
                    <span className="inline-flex items-center mt-4 font-medium text-primary group-hover:underline underline-offset-4">
                      {trans.viewCollection}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{trans.featuredProd}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {trans.featuredProdDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product, index) => {
              const productName = getName(product, lang, trans);
              const catId = getCategoryId(product);
              const category = categories.find(c => c.id === catId);
              const categoryName = category ? getName(category, lang, trans) : '';
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background rounded-xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                >
                  <Link to={`/product/${product.slug}`} className="flex flex-col h-full">
                    <div className="relative aspect-square overflow-hidden bg-secondary/20 p-6 flex-shrink-0">
                      <img
                        src={product.images?.[0]}
                        alt={productName}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      {categoryName && (
                        <div className="text-sm text-primary font-medium mb-2">{categoryName}</div>
                      )}
                      <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2">{productName}</h3>
                      <div className="text-xl font-semibold mb-4 mt-auto">
                        {Number(product.price).toFixed(2)} TL
                      </div>
                      <span className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary/10 px-4 text-sm font-medium text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-auto">
                        {trans.viewDetails}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-secondary/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">{trans.medGrade}</h3>
              <p className="text-muted-foreground">{trans.medGradeDesc}</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">{trans.comfortFirst}</h3>
              <p className="text-muted-foreground">{trans.comfortFirstDesc}</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">{trans.secureOrder}</h3>
              <p className="text-muted-foreground">{trans.secureOrderDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{trans.testimonialsTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{trans.testimonialsDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-secondary/10 rounded-xl p-8 border border-zinc-200 flex flex-col"
              >
                <div className="flex gap-1 mb-4 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-foreground mb-6 flex-grow">&ldquo;{item.text}&rdquo;</p>
                <div>
                  <div className="font-heading font-bold">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-primary/5 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{trans.newsletterTitle}</h2>
            <p className="text-muted-foreground mb-8">{trans.newsletterDesc}</p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={trans.newsletterPlaceholder}
                aria-label={trans.newsletterPlaceholder}
                className="flex-1 h-14 rounded-full border border-zinc-300 bg-background px-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="h-14 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                {trans.newsletterBtn}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
