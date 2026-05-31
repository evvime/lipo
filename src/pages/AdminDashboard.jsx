import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Loader2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, LogOut, Package, UserCheck, UserX, Users, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import AdminProducts from './AdminProducts';
import { CustomerGroupRepository } from '../lib/repositories/customerGroupRepository';
import { OrderRepository } from '../lib/repositories/orderRepository';
import { sendShipmentEmail, getCarrierOptions, getTrackingUrl } from '../lib/email/sendShipmentEmail';
import AdminRegions from './AdminRegions';

const PAGE_SIZE = 20;

const AdminDashboard = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersPage, setOrdersPage] = useState(0);

  const [wholesaleApps, setWholesaleApps] = useState([]);
  const [appsTotal, setAppsTotal] = useState(0);
  const [appsPage, setAppsPage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  const [shipmentForm, setShipmentForm] = useState({ carrier: '', trackingNumber: '' });
  const [b2bTab, setB2bTab] = useState('surgeons');
  const [surgeons, setSurgeons] = useState([]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders(ordersPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordersPage, activeTab]);

  useEffect(() => {
    if (activeTab === 'b2b' && b2bTab === 'wholesalers') fetchApps(appsPage);
    if (activeTab === 'b2b' && b2bTab === 'surgeons') fetchSurgeons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appsPage, activeTab, b2bTab]);

  const fetchSurgeons = async () => {
    setLoading(true);
    try {
      const data = await CustomerGroupRepository.getSurgeons();
      setSurgeons(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, count, error } = await supabase
        .from('orders')
        .select('*, order_items(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      if (error) throw error;
      setOrders(data || []);
      setOrdersTotal(count || 0);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApps = async (page) => {
    setLoading(true);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, count, error } = await supabase
        .from('wholesale_applications')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      if (error) throw error;
      setWholesaleApps(data || []);
      setAppsTotal(count || 0);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      toast.success('Sipariş durumu güncellendi');
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Güncelleme başarısız: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateAppStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase.from('wholesale_applications').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setWholesaleApps(wholesaleApps.map(a => a.id === id ? { ...a, status: newStatus } : a));
      toast.success('Başvuru durumu güncellendi');
    } catch (err) {
      console.error('Error updating application status:', err);
      toast.error('Güncelleme başarısız: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const orderStatuses = [
    { value: 'pending', label: 'Bekliyor' },
    { value: 'pending_payment', label: 'Ödeme Bekleniyor' },
    { value: 'processing', label: 'İşleniyor' },
    { value: 'shipped', label: 'Kargolandı' },
    { value: 'completed', label: 'Tamamlandı' },
    { value: 'cancelled', label: 'İptal Edildi' }
  ];

  const appStatuses = [
    { value: 'new', label: 'Yeni' },
    { value: 'reviewed', label: 'İnceleniyor' },
    { value: 'approved', label: 'Onaylandı' },
    { value: 'rejected', label: 'Reddedildi' }
  ];

  const ordersTotalPages = Math.max(1, Math.ceil(ordersTotal / PAGE_SIZE));
  const appsTotalPages = Math.max(1, Math.ceil(appsTotal / PAGE_SIZE));

  return (
    <div className="pt-32 pb-20 min-h-screen bg-accent/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-light">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="flex bg-white p-1 rounded-xl border border-zinc-200/50 shadow-sm">
              {['orders', 'b2b', 'products', 'regions'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {tab === 'orders' ? 'Siparişler' : tab === 'b2b' ? 'B2B Yönetimi' : tab === 'products' ? 'Ürünler' : 'Bölgeler'}
                </button>
              ))}
            </div>
            <button
              onClick={async () => { await signOut(); navigate('/'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Çıkış
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === 'orders' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Siparişler ({ordersTotal})</h2>
                <span className="text-sm text-muted-foreground">
                  Sayfa {ordersPage + 1} / {ordersTotalPages}
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : orders.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {orders.map(order => {
                      const expanded = expandedOrderId === order.id;
                      const items = order.order_items || [];
                      return (
                        <div key={order.id} className="border border-zinc-200/50 rounded-xl overflow-hidden">
                          <div className="p-4 flex flex-col gap-3 hover:bg-accent/30 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{order.full_name}</p>
                                <p className="text-sm text-muted-foreground">{order.email}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString('tr-TR')} — {order.payment_method === 'bank_transfer' ? 'Havale/EFT' : 'Sanal POS'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-lg">{Number(order.total_amount).toLocaleString('tr-TR')} ₺</p>
                                <p className="text-xs text-muted-foreground">{items.length} kalem</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-200/50">
                              <button
                                onClick={() => setExpandedOrderId(expanded ? null : order.id)}
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                {expanded ? 'Detayı gizle' : 'Detayı göster'}
                                <span className="ml-2 text-muted-foreground">ID: {order.id.slice(0, 8)}…</span>
                              </button>
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                disabled={updatingId === order.id}
                                className={`text-sm rounded-lg px-2 py-1 outline-none cursor-pointer border ${
                                  order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  order.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                  order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                  'bg-gray-50 text-gray-700 border-gray-200'
                                }`}
                              >
                                {orderStatuses.map(s => (
                                  <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {expanded && (
                            <div className="bg-zinc-50/60 border-t border-zinc-200/50 p-4">
                              <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                                <div>
                                  <p className="text-xs text-muted-foreground">Telefon</p>
                                  <p className="font-medium">{order.phone}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Şehir</p>
                                  <p className="font-medium">{order.city}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="text-xs text-muted-foreground">Adres</p>
                                  <p className="font-medium">{order.address}</p>
                                </div>
                              </div>
                              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                                Sipariş Kalemleri
                              </p>
                              {items.length > 0 ? (
                                <ul className="space-y-1">
                                  {items.map(it => (
                                    <li key={it.id} className="flex justify-between text-sm py-1 border-b border-zinc-200/40 last:border-0">
                                      <span>
                                        {it.product_name}
                                        {(it.selected_size || it.selected_color) && (
                                          <span className="text-muted-foreground">
                                            {' '}({[it.selected_size, it.selected_color].filter(Boolean).join(' / ')})
                                          </span>
                                        )}
                                        <span className="text-muted-foreground"> × {it.quantity}</span>
                                      </span>
                                      <span className="font-medium">
                                        {(Number(it.price) * it.quantity).toLocaleString('tr-TR')} ₺
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                ) : (
                                  <p className="text-sm text-muted-foreground italic">Kalem bulunamadı</p>
                                )}

                                <div className="mt-4 pt-4 border-t border-zinc-200/50">
                                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1"><Truck className="w-4 h-4"/> Kargo Bilgileri</p>
                                  {order.tracking_number ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">{order.carrier}:</span>
                                      <span className="text-sm">{order.tracking_number}</span>
                                      <a href={getTrackingUrl(order.carrier, order.tracking_number)} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline ml-2">Kargonu Takip Et</a>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <select 
                                        value={shipmentForm.carrier} 
                                        onChange={(e) => setShipmentForm(prev => ({ ...prev, carrier: e.target.value }))}
                                        className="text-sm border border-zinc-200 rounded-lg px-2 py-1 outline-none"
                                      >
                                        <option value="">Firma Seçiniz</option>
                                        {getCarrierOptions().map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                      </select>
                                      <input 
                                        type="text" 
                                        placeholder="Takip No" 
                                        value={shipmentForm.trackingNumber}
                                        onChange={(e) => setShipmentForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                                        className="text-sm border border-zinc-200 rounded-lg px-2 py-1 outline-none flex-1 max-w-[200px]"
                                      />
                                      <button 
                                        onClick={async () => {
                                          if(!shipmentForm.carrier || !shipmentForm.trackingNumber) {
                                            toast.error('Kargo firması ve takip no zorunludur');
                                            return;
                                          }
                                          try {
                                            await OrderRepository.updateTracking(order.id, shipmentForm.trackingNumber, shipmentForm.carrier);
                                            await sendShipmentEmail(order, shipmentForm.trackingNumber, shipmentForm.carrier);
                                            toast.success('Kargo bilgisi kaydedildi ve bildirildi');
                                            setOrders(orders.map(o => o.id === order.id ? { ...o, tracking_number: shipmentForm.trackingNumber, carrier: shipmentForm.carrier, status: 'shipped' } : o));
                                            setShipmentForm({ carrier: '', trackingNumber: '' });
                                          } catch (err) {
                                            toast.error('Hata: ' + err.message);
                                          }
                                        }}
                                        className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                                      >
                                        Kaydet & Bildir
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>

                  <Pagination
                    page={ordersPage}
                    totalPages={ordersTotalPages}
                    onChange={setOrdersPage}
                  />
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">Sipariş bulunamadı.</p>
              )}
            </div>
          )}

          {activeTab === 'b2b' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/50">
              <div className="flex gap-4 border-b border-zinc-200/50 pb-4 mb-4">
                <button onClick={() => setB2bTab('surgeons')} className={`text-sm font-medium px-4 py-2 rounded-lg ${b2bTab === 'surgeons' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent'}`}>Cerrahlar</button>
                <button onClick={() => setB2bTab('wholesalers')} className={`text-sm font-medium px-4 py-2 rounded-lg ${b2bTab === 'wholesalers' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent'}`}>Toptancılar</button>
              </div>

              {b2bTab === 'surgeons' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Cerrah Başvuruları</h2>
                  </div>
                  {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  ) : surgeons.length > 0 ? (
                    <div className="space-y-4">
                      {surgeons.map(surgeon => (
                        <div key={surgeon.id} className="p-4 border border-zinc-200/50 rounded-xl flex flex-col gap-3 hover:bg-accent/30 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{surgeon.full_name}</p>
                              <p className="text-sm text-foreground">{surgeon.hospital_name} - {surgeon.specialty}</p>
                              <p className="text-sm text-muted-foreground">{surgeon.phone}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(surgeon.created_at).toLocaleDateString('tr-TR')}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-200/50">
                            {surgeon.status === 'pending' ? (
                              <div className="flex gap-2">
                                <button onClick={async () => {
                                  try {
                                    await CustomerGroupRepository.approveSurgeon(surgeon.id);
                                    toast.success('Cerrah onaylandı');
                                    fetchSurgeons();
                                  } catch(e) { toast.error(e.message); }
                                }} className="flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-lg hover:bg-green-100"><UserCheck className="w-4 h-4"/> Onayla</button>
                                <button onClick={async () => {
                                  try {
                                    await CustomerGroupRepository.rejectSurgeon(surgeon.id);
                                    toast.success('Cerrah reddedildi');
                                    fetchSurgeons();
                                  } catch(e) { toast.error(e.message); }
                                }} className="flex items-center gap-1 text-sm bg-red-50 text-red-700 px-3 py-1 rounded-lg hover:bg-red-100"><UserX className="w-4 h-4"/> Reddet</button>
                              </div>
                            ) : surgeon.status === 'approved' ? (
                              <span className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-lg font-medium flex items-center gap-1"><UserCheck className="w-4 h-4"/> Onaylı</span>
                            ) : (
                              <span className="text-sm bg-red-50 text-red-700 px-3 py-1 rounded-lg font-medium flex items-center gap-1"><UserX className="w-4 h-4"/> Reddedildi</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">Cerrah bulunamadı.</p>
                  )}
                </div>
              )}

              {b2bTab === 'wholesalers' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Toptan Satış Başvuruları ({appsTotal})</h2>
                    <span className="text-sm text-muted-foreground">
                      Sayfa {appsPage + 1} / {appsTotalPages}
                    </span>
                  </div>
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : wholesaleApps.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {wholesaleApps.map(app => (
                      <div key={app.id} className="p-4 border border-zinc-200/50 rounded-xl flex flex-col gap-3 hover:bg-accent/30 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{app.company_name}</p>
                            <p className="text-sm text-foreground">{app.contact_name}</p>
                            <p className="text-sm text-muted-foreground">{app.email} • {app.phone}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{new Date(app.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-200/50">
                          <span className="text-xs text-muted-foreground truncate w-1/2" title={app.message}>{app.message || '-'}</span>
                          <select
                            value={app.status}
                            onChange={(e) => updateAppStatus(app.id, e.target.value)}
                            disabled={updatingId === app.id}
                            className={`text-sm rounded-lg px-2 py-1 outline-none cursor-pointer border ${
                              app.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              app.status === 'reviewed' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              app.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {appStatuses.map(s => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Pagination
                    page={appsPage}
                    totalPages={appsTotalPages}
                    onChange={setAppsPage}
                  />
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">Başvuru bulunamadı.</p>
              )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'regions' && <AdminRegions />}
        </div>
      </div>
    </div>
  );
};

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-zinc-200/50">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-zinc-200 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" /> Önceki
      </button>
      <span className="text-sm text-muted-foreground px-2">
        {page + 1} / {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-zinc-200 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Sonraki <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default AdminDashboard;
