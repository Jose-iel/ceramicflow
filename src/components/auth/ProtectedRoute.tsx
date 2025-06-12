
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isUserAuthenticated } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuth = isUserAuthenticated();
    console.log('ProtectedRoute check:', {
      isAuthenticated: isAuth,
      currentPath: location.pathname,
      timestamp: new Date().toISOString()
    });

    if (!isAuth) {
      console.log('User not authenticated, redirecting to login with return path:', location.pathname);
      navigate('/login', { 
        state: { from: location },
        replace: true 
      });
    }
  }, [navigate, location]);

  // Check authentication status
  const isAuth = isUserAuthenticated();
  
  // If not authenticated, don't render anything (will redirect)
  if (!isAuth) {
    console.log('Rendering nothing - user not authenticated');
    return null;
  }

  console.log('Rendering protected content for:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
