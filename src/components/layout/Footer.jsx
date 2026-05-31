import { Link } from 'react-router-dom';
import useLangStore from '../../store/useLangStore';
import { t } from '../../utils/translations';

export default function Footer() {
  const { lang } = useLangStore();
  const trans = t[lang];
  
  return (
    <footer className="border-t bg-secondary/30 mt-auto" role="contentinfo" aria-label="Site footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-primary">Wellnur</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {trans.wellnurDesc || "Premium medical compression garments designed for optimal recovery, comfort, and results."}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{trans.shopByProc || "Shop by Procedure"}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/category/liposuction" className="hover:text-primary transition-colors">{trans.liposuction || "Liposuction"}</Link></li>
              <li><Link to="/category/mastectomy" className="hover:text-primary transition-colors">{trans.mastectomy || "Breast Surgery"}</Link></li>
              <li><Link to="/category/facial" className="hover:text-primary transition-colors">{trans.facial || "Facial Surgery"}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{trans.custSupport || "Customer Support"}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/guide" className="hover:text-primary transition-colors">{trans.sizeGuide || "Size Guide"}</Link></li>
              <li><Link to="/shipping" className="hover:text-primary transition-colors">{trans.shippingReturns || "Shipping & Returns"}</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">{trans.aboutUs || "About Us"}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{trans.contact || "Contact Us"}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{trans.professionals || "Professionals"}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/surgeon-portal" className="hover:text-primary transition-colors">{trans.surgeonPortal || "Surgeon Portal"}</Link></li>
              <li><Link to="/wholesale" className="hover:text-primary transition-colors">{trans.wholesale || "Wholesale"}</Link></li>
              <li><Link to="/technology" className="hover:text-primary transition-colors">{trans.technology || "Technology"}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Wellnur Medical. {trans.allRights || "All rights reserved."}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">{trans.privacyPolicy || "Privacy Policy"}</Link>
            <Link to="/terms-of-service" className="hover:text-foreground transition-colors">{trans.termsOfService || "Terms of Service"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
