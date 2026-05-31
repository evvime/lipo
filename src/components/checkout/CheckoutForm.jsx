import { Landmark, CreditCard } from 'lucide-react';

/**
 * CheckoutForm — Fatura/teslimat bilgileri ve ödeme yöntemi formu.
 * Checkout.jsx monolith'inden çıkarıldı.
 */
const CheckoutForm = ({
  formData,
  onInputChange,
  paymentMethod,
  onPaymentMethodChange,
  onSubmit,
  isSubmitting,
  error,
  trans,
  virtualPosEnabled,
}) => {
  return (
    <form id="checkout-form" onSubmit={onSubmit} className="space-y-8">
      {/* Billing/Shipping Details */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200/50">
        <h2 className="text-xl font-medium mb-6">{trans.billingDetails}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{trans.fullName}</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={onInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-input bg-background hover:bg-accent/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{trans.emailAddress}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-input bg-background hover:bg-accent/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{trans.phone}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-input bg-background hover:bg-accent/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{trans.city}</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={onInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-input bg-background hover:bg-accent/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{trans.fullAddress}</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={onInputChange}
            required
            rows="3"
            className="w-full px-4 py-3 rounded-xl border border-input bg-background hover:bg-accent/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            placeholder={trans.addressPlaceholder}
          ></textarea>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200/50">
        <h2 className="text-xl font-medium mb-6">{trans.paymentMethod}</h2>

        <div className="space-y-4">
          <label
            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
              paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-input hover:border-primary/50'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="bank_transfer"
              checked={paymentMethod === 'bank_transfer'}
              onChange={() => onPaymentMethodChange('bank_transfer')}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${
              paymentMethod === 'bank_transfer' ? 'border-primary' : 'border-muted-foreground'
            }`}>
              {paymentMethod === 'bank_transfer' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
            </div>
            <Landmark className={`w-5 h-5 mr-3 ${paymentMethod === 'bank_transfer' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="font-medium">{trans.bankTransfer}</span>
          </label>

          {virtualPosEnabled && (
            <label
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'virtual_pos' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-input hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="virtual_pos"
                checked={paymentMethod === 'virtual_pos'}
                onChange={() => onPaymentMethodChange('virtual_pos')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${
                paymentMethod === 'virtual_pos' ? 'border-primary' : 'border-muted-foreground'
              }`}>
                {paymentMethod === 'virtual_pos' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
              <CreditCard className={`w-5 h-5 mr-3 ${paymentMethod === 'virtual_pos' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="font-medium">{trans.virtualPos}</span>
            </label>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl">
          {error}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
