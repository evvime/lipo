import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useLangStore from '../store/useLangStore';
import useAuthStore from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { t } from '../utils/translations';
import { sendOrderConfirmationEmail } from '../lib/email';

// Modüler alt bileşenler (eski 469 satırlık monolith parçalandı)
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import CheckoutSuccess from '../components/checkout/CheckoutSuccess';
import IyzicoPayment from '../components/checkout/IyzicoPayment';
import useRegionStore from '../store/useRegionStore';

// Sanal POS feature flag — Iyzico Edge Function deploy edilip secret'lar
// set edildikten sonra .env'de VITE_ENABLE_VIRTUAL_POS=true yapın.
const VIRTUAL_POS_ENABLED = import.meta.env.VITE_ENABLE_VIRTUAL_POS === 'true';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCartStore();
  const { lang } = useLangStore();
  const trans = t[lang];
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { getPaymentProviders, region } = useRegionStore();
  const paymentProviders = getPaymentProviders();
  const isVirtualPosAvailable = VIRTUAL_POS_ENABLED && paymentProviders.includes('iyzico');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [iyzicoScript, setIyzicoScript] = useState(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        fullName: user.user_metadata?.full_name || ''
      }));
    }
  }, [user]);

  // Redirect to shop if cart is empty and not on success page
  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      navigate('/shop');
    }
  }, [cart, navigate, isSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const totalAmount = getCartTotal();

      const regionId = region?.id || 'TR';
      const customerGroupId = user ? useAuthStore.getState().customerGroup?.id : null;

      // SAGA Pattern: Call Edge Function to handle stock decrements, order & item creation
      const { data: wfData, error: wfError } = await supabase.functions.invoke('checkout-workflow', {
        body: {
          buyer: {
            userId: user ? user.id : null,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            address: formData.address
          },
          items: cart.map(item => ({
            id: item.id,
            name: item.name || (lang === 'EN' ? item.name_en : item.name_tr) || '',
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color
          })),
          paymentMethod,
          totalAmount,
          regionId,
          customerGroupId
        }
      });

      if (wfError) throw wfError;
      if (wfData?.status !== 'success') throw new Error(wfData?.errorMessage || 'Checkout failed');

      const { orderData, orderItems } = wfData;

      // 3. Handle Payment Method
      if (paymentMethod === 'virtual_pos') {
        if (!isVirtualPosAvailable) {
          throw new Error(trans.virtualPosUnavailable || 'Sanal POS bu bölge için aktif değil.');
        }
        const { data, error: functionError } = await supabase.functions.invoke('create-iyzico-payment', {
          body: {
            orderId: orderData.id,
            totalAmount: totalAmount,
            buyer: formData,
            items: cart.map(item => ({
              id: item.id,
              name: lang === 'EN' ? item.name_en : item.name_tr,
              price: item.price
            }))
          }
        });

        if (functionError) throw functionError;

        if (data.status === 'success') {
          if (data.paymentPageUrl) {
            window.location.href = data.paymentPageUrl;
            return;
          } else if (data.checkoutFormContent) {
            setIyzicoScript(data.checkoutFormContent);
            return;
          }
        } else {
          throw new Error(data.errorMessage || 'Iyzico initiation failed');
        }
      }

      // Success for Bank Transfer
      sendOrderConfirmationEmail({ order: orderData, items: orderItems, lang })
        .catch(err => console.error('Email send failed:', err));

      clearCart();
      setOrderNumber(orderData.id);
      setIsSuccess(true);

    } catch (err) {
      console.error('Checkout error:', err);
      setError(trans.orderError || 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Iyzico ödeme formu aktifse
  if (iyzicoScript) {
    return (
      <IyzicoPayment
        iyzicoScript={iyzicoScript}
        onCancel={() => setIyzicoScript(null)}
        trans={trans}
      />
    );
  }

  // Sipariş başarılı
  if (isSuccess) {
    return (
      <CheckoutSuccess
        orderNumber={orderNumber}
        trans={trans}
        onContinueShopping={() => navigate('/shop')}
      />
    );
  }

  // Ana checkout formu
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-light mb-12 text-center">{trans.checkoutTitle}</h1>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          <div className="flex-1">
            <CheckoutForm
              formData={formData}
              onInputChange={handleInputChange}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
              trans={trans}
              virtualPosEnabled={isVirtualPosAvailable}
            />
          </div>

          <OrderSummary
            cart={cart}
            getCartTotal={getCartTotal}
            lang={lang}
            trans={trans}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
