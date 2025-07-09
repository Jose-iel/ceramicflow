
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loading: authLoading, hasRoutePermission } = useAuth();
  
  // Extrair o caminho da rota (sem a barra inicial)
  const routePath = location.pathname.replace('/', '') || 'dashboard';

  useEffect(() => {
    // Se ainda está carregando auth, aguardar
    if (authLoading) return;

    // Se não tem usuário, redirecionar para login
    if (!user) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    // Se não tem perfil, aguardar
    if (!profile) return;

    // Verificação de permissão instantânea usando cache
    const hasPermission = hasRoutePermission(routePath);
    
    // Se não tem permissão e não é admin, redirecionar
    if (!hasPermission && !profile.is_admin) {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [user, profile, authLoading, navigate, location, routePath, hasRoutePermission]);

  // Loading apenas quando realmente necessário
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

  // Se não tem usuário, não renderizar nada
  if (!user || !profile) return null;

  // Verificação final: se é admin ou tem permissão, mostrar conteúdo
  if (profile.is_admin || hasRoutePermission(routePath)) {
    return <>{children}</>;
  }

  // Se chegou aqui, não tem permissão
  return null;
};

export default ProtectedRoute;
