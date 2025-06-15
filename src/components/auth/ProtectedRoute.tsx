
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { 
          state: { from: location },
          replace: true 
        });
      } else if (requireAdmin && !isAdmin) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, isAdmin, loading, navigate, location, requireAdmin]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não autenticado ou sem permissão admin, não renderiza nada
  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
