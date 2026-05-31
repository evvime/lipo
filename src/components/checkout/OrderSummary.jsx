import { Loader2 } from 'lucide-react';
import useRegionStore from '../../store/useRegionStore';

/**
 * OrderSummary — Sipariş özeti paneli.
 * Checkout.jsx monolith'inden çıkarıldı.
 */
const OrderSummary = ({ cart, getCartTotal, lang, trans, isSubmitting }) => {
  const { formatPrice, getFreeShippingThreshold } = useRegionStore();
  const freeShippingThreshold = getFreeShippingThreshold() || 0;
  const cartTotal = getCartTotal();
  const shippingCost = (freeShippingThreshold && cartTotal < freeShippingThreshold) ? 150 : 0; // Or whatever logic
  const total = cartTotal + shippingCost;
  return (
    <div className="w-full lg:w-[400px]">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200/50 sticky top-32">
        <h2 className="text-xl font-medium mb-6">{trans.orderSummary}</h2>

        <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
          {cart.map((item) => (
            <div key={item.cartItemId} className="flex gap-4">
              <div className="w-16 h-16 bg-accent rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.images?.[0] || ''}
                  alt={lang === 'EN' ? item.name_en : item.name_tr}
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">
                  {lang === 'EN' ? item.name_en : item.name_tr}
                </h4>
                <div className="text-xs text-muted-foreground mt-1 space-x-2">
                  {item.size && <span>{lang === 'EN' ? 'Size' : 'Beden'}: {item.size}</span>}
                  {item.color && <span>{lang === 'EN' ? 'Color' : 'Renk'}: {item.color}</span>}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">x{item.quantity}</span>
                  <span className="text-sm font-medium">{formatPrice(item.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-200/50 pt-4 space-y-4 mb-8">
          <div className="flex justify-between text-muted-foreground">
            <span>{trans.subtotal}</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{trans.shipping}</span>
            <span>{shippingCost === 0 ? trans.free : formatPrice(shippingCost)}</span>
          </div>
          <div className="flex justify-between text-lg font-medium pt-2 border-t border-zinc-200/50">
            <span>{trans.total}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <button
          type="submit"
          form="checkout-form"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl hover:bg-primary/90 transition-colors font-medium flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {trans.processing}
            </>
          ) : (
            trans.placeOrder
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
