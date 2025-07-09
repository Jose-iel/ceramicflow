
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
  
  // Extrair o caminho da rota (sem a barra inicial)
  const routePath = location.pathname.replace('/', '') || 'dashboard';

  useEffect(() => {
    if (authLoading) {
      setHasPermission(null);
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    // Se o usuário é admin, permitir acesso a todas as rotas
    if (profile?.is_admin) {
      setHasPermission(true);
      return;
    }
    
    // Verificar permissão específica da rota
    if (user && user.id && routePath) {
      hasRoutePermission(routePath).then((data) => {
        setHasPermission(data);
      }).catch((error) => {
        console.error('Error checking route permission:', error);
        setHasPermission(false);
      });
    } else {
      setHasPermission(false);
    }
  }, [user, profile, authLoading, navigate, location, routePath, hasRoutePermission]);

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
