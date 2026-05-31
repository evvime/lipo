import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { Loader2 } from 'lucide-react';

const AdminRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Yalnızca sunucu tarafında set edilen app_metadata.role kabul edilir.
  // Why: user_metadata client tarafından değiştirilebilir; hardcoded email
  // ise repo erişimi olan herkes için bilinen bir saldırı yüzeyidir.
  // How to apply: Admin atamak için Supabase Dashboard > Authentication >
  // ilgili user > Raw User Meta Data ALANINI DEĞİL, "Edit" üstünden
  // app_metadata: { "role": "admin" } olarak güncelleyin (veya service_role
  // anahtarıyla auth.admin.updateUserById çağırın).
  const isAdmin = user?.app_metadata?.role === 'admin';

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
