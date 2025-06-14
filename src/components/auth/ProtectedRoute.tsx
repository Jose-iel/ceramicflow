
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isUserAuthenticated } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute: Starting auth check for path:', location.pathname);
    
    // Pequeno delay para garantir que os cookies estão prontos
    const timer = setTimeout(() => {
      const authResult = isUserAuthenticated();
      console.log('ProtectedRoute: Auth check result:', authResult);
      
      setIsAuth(authResult);
      setIsChecking(false);
      
      if (!authResult) {
        console.log('ProtectedRoute: User not authenticated, redirecting to login');
        navigate('/login', { 
          state: { from: location },
          replace: true 
        });
      } else {
        console.log('ProtectedRoute: User authenticated, allowing access to:', location.pathname);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [navigate, location]);

  // Mostra loading enquanto verifica
  if (isChecking) {
    console.log('ProtectedRoute: Still checking authentication...');
    return <div>Verificando autenticação...</div>;
  }

  // Se não autenticado, não renderiza nada (vai redirecionar)
  if (!isAuth) {
    console.log('ProtectedRoute: Not authenticated, rendering nothing');
    return null;
  }

  console.log('ProtectedRoute: Rendering protected content for:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
