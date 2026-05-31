import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ShieldCheck, Ruler, Truck, ChevronRight, ExternalLink } from 'lucide-react';
import { products, categories } from '../data/mockData';
import useCartStore from '../store/useCartStore';
import useLangStore from '../store/useLangStore';
import { t } from '../utils/translations';
import { useProduct, useCategories } from '../hooks/useProducts';
import useAuthStore from '../store/useAuthStore';
import useRegionStore from '../store/useRegionStore';

export default function Product() {
  const { slug } = useParams();
  const { lang } = useLangStore();
  const trans = t[lang];

  const { customerGroup } = useAuthStore();
  const { product, loading } = useProduct(slug, customerGroup?.id);
  const { formatPrice } = useRegionStore();
  const { categories: fetchedCategories } = useCategories();
  
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);

  const { addToCart, openCart } = useCartStore();

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product, selectedColor]);

  if (loading) {
    return <div className="pt-32 pb-20 min-h-screen flex justify-center items-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!product) {
    return <div className="pt-32 pb-20 min-h-screen flex justify-center items-center text-muted-foreground">Ürün bulunamadı.</div>;
  }

  const productName = product.nameKey ? trans[product.nameKey] : product.name;
  const productDesc = product.descKey ? trans[product.descKey] : product.description;
  const productFeatures = product.featuresKey ? trans[product.featuresKey] : [];
  const productParams = product.parametersKey ? trans[product.parametersKey] : [];
  
  const category = fetchedCategories.find(c => c.id === product.category_id) || categories.find(c => c.id === product.categoryId);
  const categoryName = category?.nameKey ? trans[category.nameKey] : category?.name || '';
  
  const selectedVariantStock = product.variants?.find(v => v.size === selectedSize && v.color_name === selectedColor?.name)?.stock || 0;
  const isOutOfStock = product.variants && product.variants.length > 0 && selectedSize && selectedColor && selectedVariantStock <= 0;

  // Dynamic document title for SEO
  useEffect(() => {
    document.title = `${productName} | Wellnur Medical`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', productDesc?.substring(0, 160) || '');
    }
    return () => {
      document.title = 'Wellnur Medical | Ameliyat Sonrası Medikal Kompresyon Giysileri';
    };
  }, [productName, productDesc]);

  // JSON-LD Product structured data
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": productDesc,
    "image": product.images,
    "brand": {
      "@type": "Brand",
      "name": "Wellnur Medical"
    },
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://wellnur.com/product/${product.slug}`,
      "priceCurrency": "TRY",
      "price": product.price.toFixed(2),
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Wellnur Medical"
      }
    },
    "category": categoryName
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert(trans.selectSizePrompt || 'Lütfen beden seçiniz.');
      return;
    }
    if (isOutOfStock) {
      alert('Seçtiğiniz varyant tükenmiştir.');
      return;
    }
    const success = await addToCart({ ...product, name: productName }, selectedSize, selectedColor?.name, 1);
    if(success) openCart();
  };

  return (
    <div className="bg-background page-transition-enter-active">
      {/* JSON-LD Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026') }}
      />
      
      {/* Product Top Section */}
      <article className="container mx-auto px-4 py-8 md:py-12" itemScope itemType="https://schema.org/Product">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">{trans.home}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/shop" className="hover:text-primary transition-colors">{trans.shop}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{productName}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-24 md:w-24 md:h-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-primary' : 'border-transparent hover:border-zinc-200'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-grow relative aspect-[3/4] md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden bg-secondary/50">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[activeImage]}
                  alt={productName}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col pt-4">
            <div className="mb-2">
              <Link to={`/category/${product.categoryId}`} className="text-sm font-medium text-primary hover:underline uppercase tracking-wider">
                {categoryName}
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {productName}
            </h1>
            <p className="text-2xl font-semibold text-foreground mb-6">
              {product.hasB2BDiscount ? (
                <span className="flex flex-col">
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-primary">{formatPrice(product.price)}</span>
                </span>
              ) : (
                formatPrice(product.price)
              )}
            </p>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {productDesc}
            </p>

            <div className="space-y-6 mb-8">
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-sm">{trans.color}: <span className="text-muted-foreground">{selectedColor.name}</span></span>
                  </div>
                  <div className="flex gap-3">
                    {product.colors.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 focus:outline-none transition-all ${
                          selectedColor?.name === color.name ? 'border-primary scale-110' : 'border-zinc-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        aria-label={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-sm">{trans.size}</span>
                    <Link to="/guide" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                      <Ruler className="w-4 h-4" />
                      {trans.sizeGuideLabel}
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 rounded-md text-sm font-medium border transition-colors ${
                          selectedSize === size 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-input hover:border-primary hover:bg-secondary/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 rounded-md font-medium text-lg flex items-center justify-center gap-2 transition-colors ${
                isOutOfStock ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' : 'bg-foreground text-background hover:bg-foreground/90'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {isOutOfStock ? 'Tükendi' : trans.addToCart}
            </button>

            {/* Trendyol Link */}
            {product.trendyolUrl && (
              <a 
                href={product.trendyolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-3 bg-orange-500 text-white py-4 rounded-md font-medium text-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                {trans.buyOnTrendyol}
              </a>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">{trans.medGrade}</h4>
                  <p className="text-xs text-muted-foreground">{trans.medGradeDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">{trans.freeShipping}</h4>
                  <p className="text-xs text-muted-foreground">{trans.freeShippingDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Sticky Tabs Navigation */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-y border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar">
            {['description', 'parameters', 'size-chart'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-zinc-200'
                }`}
              >
                {tab === 'description' ? trans.tabDescription : tab === 'parameters' ? trans.tabParameters : trans.tabSizeChart}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="bg-secondary/20 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 bg-background p-8 rounded-2xl shadow-sm border border-zinc-200/50"
              >
                <h3 className="text-2xl font-heading font-bold mb-6">{trans.productDetails}</h3>
                <p className="text-muted-foreground leading-relaxed">{productDesc}</p>
                <h4 className="font-semibold text-lg mt-8 mb-4">{trans.keyFeatures}</h4>
                <ul className="space-y-3">
                  {productFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {activeTab === 'parameters' && (
              <motion.div
                key="params"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-background rounded-2xl shadow-sm border border-zinc-200/50 overflow-hidden"
              >
                <div className="p-8 pb-4">
                  <h3 className="text-2xl font-heading font-bold mb-6">{trans.technicalParameters}</h3>
                </div>
                <div className="divide-y divide-border/50">
                  {productParams.map((param, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center p-4 sm:p-6 hover:bg-secondary/30 transition-colors">
                      <div className="sm:w-1/3 font-medium text-foreground mb-1 sm:mb-0">{param.label}</div>
                      <div className="sm:w-2/3 text-muted-foreground">{param.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'size-chart' && (
              <motion.div
                key="size"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-background p-8 rounded-2xl shadow-sm border border-zinc-200/50"
              >
                <h3 className="text-2xl font-heading font-bold mb-6">{trans.sizeChart}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="p-4 font-semibold text-sm border-b">{trans.chartSize}</th>
                        <th className="p-4 font-semibold text-sm border-b">{trans.chartUnderbust}</th>
                        <th className="p-4 font-semibold text-sm border-b">{trans.chartBust}</th>
                        <th className="p-4 font-semibold text-sm border-b">{trans.chartWaist}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="p-4 font-medium">XS</td><td className="p-4 text-muted-foreground">68 - 72</td><td className="p-4 text-muted-foreground">82 - 86</td><td className="p-4 text-muted-foreground">62 - 68</td></tr>
                      <tr><td className="p-4 font-medium">S</td><td className="p-4 text-muted-foreground">73 - 77</td><td className="p-4 text-muted-foreground">87 - 91</td><td className="p-4 text-muted-foreground">69 - 75</td></tr>
                      <tr><td className="p-4 font-medium">M</td><td className="p-4 text-muted-foreground">78 - 82</td><td className="p-4 text-muted-foreground">92 - 96</td><td className="p-4 text-muted-foreground">76 - 82</td></tr>
                      <tr><td className="p-4 font-medium">L</td><td className="p-4 text-muted-foreground">83 - 87</td><td className="p-4 text-muted-foreground">97 - 101</td><td className="p-4 text-muted-foreground">83 - 89</td></tr>
                      <tr><td className="p-4 font-medium">XL</td><td className="p-4 text-muted-foreground">88 - 92</td><td className="p-4 text-muted-foreground">102 - 106</td><td className="p-4 text-muted-foreground">90 - 98</td></tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
