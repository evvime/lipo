import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { Loader2 } from 'lucide-react';

const UserRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default UserRoute;
