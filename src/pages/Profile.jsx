import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/useAuthStore';
import useLangStore from '../store/useLangStore';
import { Loader2, LogOut, Package, User, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { t } from '../utils/translations';
import { getTrackingUrl } from '../lib/email/sendShipmentEmail';

const Profile = () => {
  const { user, signOut } = useAuthStore();
  const { lang } = useLangStore();
  const trans = t[lang];
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) return null;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-accent/20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar / User Info */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/50 sticky top-32">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-medium mb-1">{user.user_metadata?.full_name || 'Kullanıcı'}</h2>
              <p className="text-muted-foreground text-sm mb-6">{user.email}</p>
              
              <div className="space-y-2 border-t border-zinc-200/50 pt-4">
                <div className="flex items-center text-primary font-medium p-2 rounded-lg bg-primary/5">
                  <Package className="w-5 h-5 mr-3" />
                  {trans.myOrders}
                </div>
                <button
                  onClick={async () => { await signOut(); navigate('/'); }}
                  className="flex items-center w-full text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  {trans.logout}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content / Orders */}
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-2xl font-light">
              {trans.myOrders}
            </h1>

            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={order.id} 
                    className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/50"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-zinc-200/50">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {trans.orderDateLabel}
                        </p>
                        <p className="font-medium">{new Date(order.created_at).toLocaleDateString(lang === 'EN' ? 'en-US' : 'tr-TR')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {trans.orderIdLabel}
                        </p>
                        <p className="font-medium">#{order.id.split('-')[0]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {trans.totalAmountLabel}
                        </p>
                        <p className="font-medium text-primary">{order.total_amount.toLocaleString('tr-TR')} ₺</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'pending' ? trans.statusPending :
                           order.status === 'processing' ? trans.statusProcessing :
                           order.status === 'shipped' ? trans.statusShipped :
                           order.status === 'completed' ? trans.statusCompleted :
                           order.status === 'cancelled' ? trans.statusCancelled : order.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{item.product_name}</h4>
                            <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                              <span>{trans.qtyLabel}: {item.quantity}</span>
                              {item.selected_size && <span>{lang === 'EN' ? 'Size' : 'Beden'}: {item.selected_size}</span>}
                              {item.selected_color && <span>{lang === 'EN' ? 'Color' : 'Renk'}: {item.selected_color}</span>}
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            {item.price.toLocaleString('tr-TR')} ₺
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.tracking_number && (
                      <div className="mt-4 pt-4 border-t border-zinc-200/50 bg-blue-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                        <div className="flex items-center gap-2 text-sm text-blue-900">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold">Kargo Takip:</span>
                          <span>{order.carrier}</span>
                          <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-100">{order.tracking_number}</span>
                          <a 
                            href={getTrackingUrl(order.carrier, order.tracking_number)} 
                            target="_blank" 
                            rel="noreferrer"
                            className="ml-auto text-blue-600 font-medium hover:underline flex items-center gap-1"
                          >
                            Kargom Nerede?
                          </a>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-zinc-200/50">
                <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  {trans.noOrdersYet}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
