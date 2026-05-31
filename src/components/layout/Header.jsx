import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User, X } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import useLangStore from '../../store/useLangStore';
import useAuthStore from '../../store/useAuthStore';
import { t } from '../../utils/translations';

export default function Header() {
  const { openCart, getCartCount } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, toggleLang } = useLangStore();
  const { user } = useAuthStore();
  const trans = t[lang];
  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            className="md:hidden p-2 -ml-2 text-foreground/80 hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/" className="text-2xl font-heading font-bold tracking-tighter text-primary" aria-label="Wellnur Ana Sayfa">
            Wellnur
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Ana navigasyon">
            <Link to="/shop" className="text-foreground hover:text-primary transition-colors font-bold">{trans.shopAll}</Link>
            <Link to="/category/liposuction" className="text-foreground/80 hover:text-primary transition-colors">{trans.liposuction}</Link>
            <Link to="/category/mastectomy" className="text-foreground/80 hover:text-primary transition-colors">{trans.mastectomy}</Link>
            <Link to="/category/facial" className="text-foreground/80 hover:text-primary transition-colors">{trans.facial}</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center text-xs font-bold uppercase bg-secondary/30 rounded-full overflow-hidden mr-2" role="group" aria-label="Dil seçimi">
            <button 
              onClick={() => { if (lang !== 'EN') toggleLang(); }} 
              className={`px-3 py-1.5 transition-colors ${lang === 'EN' ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:text-primary'}`}
              aria-pressed={lang === 'EN'}
              aria-label="English"
            >
              EN
            </button>
            <button 
              onClick={() => { if (lang !== 'TR') toggleLang(); }} 
              className={`px-3 py-1.5 transition-colors ${lang === 'TR' ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:text-primary'}`}
              aria-pressed={lang === 'TR'}
              aria-label="Türkçe"
            >
              TR
            </button>
          </div>
          <button className="p-2 text-foreground/80 hover:text-primary transition-colors hidden sm:block" aria-label="Arama">
            <Search className="w-5 h-5" />
          </button>
          <Link to={user ? "/profile" : "/login"} className="p-2 text-foreground/80 hover:text-primary transition-colors hidden sm:block" aria-label="Hesabım">
            <User className="w-5 h-5" />
          </Link>
          <button 
            onClick={openCart}
            className="p-2 text-foreground/80 hover:text-primary transition-colors relative"
            aria-label={`Sepet${cartCount > 0 ? ` (${cartCount} ürün)` : ''}`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center font-bold" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-6 space-y-4 shadow-lg absolute w-full left-0 top-16">
          <nav className="flex flex-col space-y-4" aria-label="Mobil navigasyon">
            <Link to="/shop" className="text-foreground hover:text-primary transition-colors font-bold text-lg" onClick={() => setIsMobileMenuOpen(false)}>{trans.shopAll}</Link>
            <Link to="/category/liposuction" className="text-foreground/80 hover:text-primary transition-colors text-lg" onClick={() => setIsMobileMenuOpen(false)}>{trans.liposuction}</Link>
            <Link to="/category/mastectomy" className="text-foreground/80 hover:text-primary transition-colors text-lg" onClick={() => setIsMobileMenuOpen(false)}>{trans.mastectomy}</Link>
            <Link to="/category/facial" className="text-foreground/80 hover:text-primary transition-colors text-lg" onClick={() => setIsMobileMenuOpen(false)}>{trans.facial}</Link>
            <div className="border-t pt-4 mt-2 space-y-4 flex flex-col">
              <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors text-lg" onClick={() => setIsMobileMenuOpen(false)}>{trans.aboutUs}</Link>
              <Link to="/contact" className="text-foreground/80 hover:text-primary transition-colors text-lg" onClick={() => setIsMobileMenuOpen(false)}>{trans.contact}</Link>
              <Link to="/shipping" className="text-foreground/80 hover:text-primary transition-colors text-lg" onClick={() => setIsMobileMenuOpen(false)}>{trans.shippingReturns}</Link>
              <Link to={user ? "/profile" : "/login"} className="text-foreground/80 hover:text-primary transition-colors text-lg font-bold pt-4 border-t" onClick={() => setIsMobileMenuOpen(false)}>
                {user ? trans.myAccount : trans.login}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
