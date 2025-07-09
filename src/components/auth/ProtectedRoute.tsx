
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
  const [hasCheckedPermission, setHasCheckedPermission] = useState(false);
  
  // Extrair o caminho da rota (sem a barra inicial)
  const routePath = location.pathname.replace('/', '') || 'dashboard';

  useEffect(() => {
    // Se ainda está carregando auth, não fazer nada
    if (authLoading) {
      return;
    }

    // Se não tem usuário, redirecionar para login
    if (!user) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    // Se não tem perfil ainda, aguardar um pouco mais
    if (!profile) {
      return;
    }

    // Verificar permissão imediatamente usando cache
    const hasPermission = hasRoutePermission(routePath);
    
    // Se não tem permissão e não é admin, redirecionar
    if (!hasPermission && !profile?.is_admin) {
      navigate('/dashboard', { replace: true, state: { error: 'Access Denied' } });
      return;
    }

    setHasCheckedPermission(true);
  }, [user, profile, authLoading, navigate, location, routePath, hasRoutePermission]);

  // Mostrar loading apenas enquanto está autenticando ou carregando perfil inicial
  if (authLoading || (user && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não tem usuário, o useEffect já redirecionou
  if (!user) {
    return null;
  }

  // Se é admin ou tem permissão, mostrar conteúdo
  if (profile?.is_admin || hasRoutePermission(routePath)) {
    return <>{children}</>;
  }

  // Se chegou aqui e ainda não verificou permissão, mostrar loading rápido
  if (!hasCheckedPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Se não tem permissão, não mostrar nada (já redirecionou)
  return null;
};

export default ProtectedRoute;
