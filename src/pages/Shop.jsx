import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Filter, X, Loader2 } from 'lucide-react';
import useLangStore from '../store/useLangStore';
import { t } from '../utils/translations';
import { useProducts, useCategories } from '../hooks/useProducts';
import useAuthStore from '../store/useAuthStore';
import useRegionStore from '../store/useRegionStore';

export default function Shop() {
  const { lang } = useLangStore();
  const trans = t[lang];
  const { customerGroup } = useAuthStore();
  const { products, loading } = useProducts(null, customerGroup?.id);
  const { categories: fetchedCategories } = useCategories();
  const { formatPrice } = useRegionStore();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Extract all unique colors and sizes for filter options
  const allColors = useMemo(() => {
    if (!products) return [];
    const colors = new Map();
    products.forEach(p => {
      let prodColors = p.colors;
      if (typeof prodColors === 'string') {
        try { prodColors = JSON.parse(prodColors); } catch(e) { prodColors = []; }
      }
      if (Array.isArray(prodColors)) {
        prodColors.forEach(c => colors.set(c.name, c.hex));
      }
    });
    return Array.from(colors, ([name, hex]) => ({ name, hex }));
  }, [products]);

  const allSizes = useMemo(() => {
    if (!products) return [];
    const sizes = new Set();
    products.forEach(p => {
      let prodSizes = p.sizes;
      if (typeof prodSizes === 'string') {
        // Handle postgres array string e.g. "{S,M,L}" if not parsed automatically
        try { 
          if (prodSizes.startsWith('{')) {
            prodSizes = prodSizes.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
          } else {
            prodSizes = JSON.parse(prodSizes); 
          }
        } catch(e) { prodSizes = []; }
      }
      if (Array.isArray(prodSizes)) {
        prodSizes.forEach(s => sizes.add(s));
      }
    });
    return Array.from(sizes).sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product => {
      const categoryMatch = selectedCategory === 'all' || product.categoryId === selectedCategory || product.category_id === selectedCategory;
      
      let prodColors = product.colors;
      if (typeof prodColors === 'string') {
        try { prodColors = JSON.parse(prodColors); } catch(e) { prodColors = []; }
      }
      const colorMatch = selectedColors.length === 0 || (Array.isArray(prodColors) && prodColors.some(c => selectedColors.includes(c.name)));
      
      let prodSizes = product.sizes;
      if (typeof prodSizes === 'string') {
        try { 
          if (prodSizes.startsWith('{')) {
            prodSizes = prodSizes.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
          } else {
            prodSizes = JSON.parse(prodSizes); 
          }
        } catch(e) { prodSizes = []; }
      }
      const sizeMatch = selectedSizes.length === 0 || (Array.isArray(prodSizes) && prodSizes.some(s => selectedSizes.includes(s)));
      
      return categoryMatch && colorMatch && sizeMatch;
    });
  }, [products, selectedCategory, selectedColors, selectedSizes]);

  const toggleColor = (colorName) => {
    setSelectedColors(prev => 
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  return (
    <div className="bg-background min-h-screen pt-8 pb-16 page-transition-enter-active">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 pb-4 border-b">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">{trans.allProducts}</h1>
          <p className="text-muted-foreground mt-2 md:mt-0">{loading ? '...' : filteredProducts.length} {trans.results}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center gap-2 font-medium bg-secondary p-3 rounded-lg w-fit"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="w-5 h-5" />
            {trans.filters}
          </button>

          {/* Sidebar Filters */}
          <div className={`
            fixed inset-0 z-50 bg-background p-6 lg:p-0 overflow-y-auto transition-transform transform
            lg:static lg:block lg:w-64 lg:shrink-0 lg:translate-x-0
            ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex justify-between items-center lg:hidden mb-6">
              <h2 className="text-xl font-bold">{trans.filters}</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">{trans.categoryLabel}</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                      className="accent-primary w-4 h-4"
                    />
                    <span>{trans.allProcedures}</span>
                  </label>
                  {fetchedCategories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                        className="accent-primary w-4 h-4"
                      />
                      <span>{cat.nameKey ? trans[cat.nameKey] : (lang === 'EN' ? cat.name_en : cat.name_tr)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">{trans.sizeLabel}</h3>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-input hover:border-primary text-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">{trans.colorLabel}</h3>
                <div className="flex flex-wrap gap-3">
                  {allColors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedColors.includes(color.name) ? 'scale-110 border-primary' : 'border-transparent hover:scale-105 shadow-sm'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <button 
                onClick={clearFilters}
                className="w-full py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
              >
                {trans.clearAllFilters}
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">{trans.noProductsFilter}</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 text-primary font-medium hover:underline"
                >
                  {trans.clearFilters}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map((product, index) => {
                  const productName = product.nameKey ? trans[product.nameKey] : (lang === 'EN' ? (product.name_en || product.name_tr) : (product.name_tr || product.name));
                  const productDesc = product.descKey ? trans[product.descKey] : (lang === 'EN' ? product.desc_en : product.desc_tr);
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex flex-col"
                    >
                      <Link to={`/product/${product.slug}`} className="block flex-1 flex flex-col">
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary/50 mb-4">
                          {product.images?.[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={productName} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-bold text-4xl">W</div>
                          )}
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <span className="bg-white/90 backdrop-blur-sm text-black px-6 py-2 rounded-full font-medium shadow-sm">
                              {trans.viewDetails}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1 flex-1 flex flex-col">
                          <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                            {productName}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-1 mb-2">{productDesc}</p>
                          <div className="mt-auto">
                            {product.hasB2BDiscount ? (
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                                <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                              </div>
                            ) : (
                              <p className="font-bold text-foreground">{formatPrice(product.price)}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
