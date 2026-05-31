import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useLangStore from '../store/useLangStore';
import { t } from '../utils/translations';

const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  const { lang } = useLangStore();
  const trans = t[lang];
  const navigate = useNavigate();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card text-card-foreground shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                {trans.yourCart}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-50" />
                  <p className="text-lg font-medium text-muted-foreground">{trans.emptyCart}</p>
                  <button 
                    onClick={closeCart}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                  >
                    {trans.continueShopping}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <motion.div 
                      key={item.cartItemId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 bg-secondary/30 p-4 rounded-2xl"
                    >
                      <div className="w-24 h-24 bg-card rounded-xl overflow-hidden shrink-0">
                        <img 
                          src={item.image || "/placeholder.svg"} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-medium text-foreground line-clamp-2">{item.name}</h3>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 space-x-2">
                            <span>{trans.size}: {item.size}</span>
                            <span>•</span>
                            <span>{trans.color}: {item.color}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="p-1 hover:bg-secondary rounded-md transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="p-1 hover:bg-secondary rounded-md transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-semibold text-primary">
                            {(item.price * item.quantity).toFixed(2)} TL
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-border p-6 bg-secondary/30 mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground font-medium">{trans.subtotal}</span>
                  <span className="text-2xl font-bold text-foreground">
                    {getCartTotal().toFixed(2)} TL
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{trans.shippingCalcAtCheckout}</p>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white py-4 rounded-xl font-medium text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                >
                  {trans.checkout}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
