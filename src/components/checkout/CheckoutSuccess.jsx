import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

/**
 * CheckoutSuccess — Sipariş başarılı ekranı.
 * Checkout.jsx monolith'inden çıkarıldı.
 */
const CheckoutSuccess = ({ orderNumber, trans, onContinueShopping }) => {
  return (
    <div className="min-h-[60vh] pt-32 pb-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full mx-auto px-4 text-center"
      >
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-light mb-4">
          {trans.orderSuccess}
        </h1>
        {orderNumber && (
          <p className="text-sm font-medium text-primary mb-3">
            {trans.orderNo}: #{orderNumber.split('-')[0]}
          </p>
        )}
        <p className="text-muted-foreground mb-8">
          {trans.orderSuccessDesc}
        </p>
        <button
          onClick={onContinueShopping}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl hover:bg-primary/90 transition-colors font-medium"
        >
          {trans.continueShopping}
        </button>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
