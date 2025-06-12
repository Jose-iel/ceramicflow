
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isUserAuthenticated } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Se não está autenticado, não renderiza nada (vai redirecionar)
  if (!isUserAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
