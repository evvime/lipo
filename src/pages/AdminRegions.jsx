import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Globe, Edit, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminRegions = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('id');
      if (error) throw error;
      setRegions(data || []);
    } catch (err) {
      console.error('Error fetching regions:', err);
      toast.error('Bölgeler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (region) => {
    setEditingId(region.id);
    setEditData({
      is_active: region.is_active,
      free_shipping_threshold: region.free_shipping_threshold || '',
    });
  };

  const handleSave = async (id) => {
    try {
      const { error } = await supabase
        .from('regions')
        .update({
          is_active: editData.is_active,
          free_shipping_threshold: editData.free_shipping_threshold ? parseFloat(editData.free_shipping_threshold) : null,
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Bölge güncellendi.');
      setEditingId(null);
      fetchRegions();
    } catch (err) {
      console.error('Error updating region:', err);
      toast.error('Güncelleme başarısız: ' + err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/50">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-medium">Bölge Yönetimi</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-accent/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3 rounded-l-lg">ID / Ülke</th>
              <th className="px-4 py-3">Para Birimi</th>
              <th className="px-4 py-3">Kargo Eşiği</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3 rounded-r-lg text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {regions.map(region => {
              const isEditing = editingId === region.id;
              
              return (
                <tr key={region.id} className="border-b border-zinc-200/50 last:border-0 hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    {region.id} - {region.name}
                  </td>
                  <td className="px-4 py-3">
                    {region.currency_code} ({region.currency_symbol})
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="number"
                        className="border border-zinc-200 rounded px-2 py-1 w-24 outline-none text-sm"
                        value={editData.free_shipping_threshold}
                        onChange={e => setEditData({ ...editData, free_shipping_threshold: e.target.value })}
                        placeholder="Limit"
                      />
                    ) : (
                      region.free_shipping_threshold 
                        ? `${region.free_shipping_threshold} ${region.currency_symbol}` 
                        : '-'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editData.is_active}
                          onChange={e => setEditData({ ...editData, is_active: e.target.checked })}
                          className="accent-primary"
                        />
                        <span>Aktif</span>
                      </label>
                    ) : (
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${region.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {region.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-zinc-400 hover:text-red-500 rounded bg-white border border-zinc-200">
                          <X className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleSave(region.id)} className="p-1.5 text-green-600 hover:text-green-700 rounded bg-green-50 border border-green-200">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEdit(region)} className="p-1.5 text-zinc-400 hover:text-primary transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRegions;
