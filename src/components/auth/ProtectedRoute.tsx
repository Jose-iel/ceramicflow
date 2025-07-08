
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loading: authLoading, hasRoutePermission } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const routePath = location.pathname.split('/')[1] || 'dashboard';

  useEffect(() => {
    if (authLoading) {
      setHasPermission(null); // Reset permission state while auth is loading
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    if (profile?.is_admin) {
      setHasPermission(true);
      return;
    }
    
    if (user && user.id && routePath) {
      hasRoutePermission(routePath).then((data) => {
        setHasPermission(data);
      });
    } else {
      setHasPermission(false);
    }
  }, [user, profile, authLoading, navigate, location, routePath]);

  useEffect(() => {
    if (hasPermission === false) {
      navigate('/dashboard', { replace: true, state: { error: 'Access Denied' } });
    }
  }, [hasPermission, navigate]);

  if (authLoading || hasPermission === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  return hasPermission ? <>{children}</> : null;
};

export default ProtectedRoute;
