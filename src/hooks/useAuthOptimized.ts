import { useMemo } from 'react';

import { useAuth } from '@/integrations/supabase/hooks/use-auth';

// Hook otimizado para componentes que precisam apenas de informações específicas
export function useAuthOptimized() {
  const { user, profile, loading, hasRoutePermission } = useAuth();

  const isAuthenticated = useMemo(() => !!user, [user]);
  const isAdmin = useMemo(() => profile?.is_admin || false, [profile?.is_admin]);
  const isReady = useMemo(() => !loading && !!user && !!profile, [loading, user, profile]);

  // Função memoizada para verificação de permissões
  const checkRoutePermission = useMemo(() => {
    return (routePath: string) => {
      if (!isReady) {
        return false;
      }
      if (isAdmin) {
        return true;
      }
      return hasRoutePermission(routePath);
    };
  }, [isReady, isAdmin, hasRoutePermission]);

  return {
    isAuthenticated,
    isAdmin,
    isReady,
    loading,
    user,
    profile,
    hasRoutePermission: checkRoutePermission,
  };
}

// Hook específico para navegação rápida
export function useQuickNavigation() {
  const { isAdmin, isReady, hasRoutePermission } = useAuthOptimized();

  const canAccess = useMemo(() => {
    if (!isReady) {
      return () => false;
    }

    return (routePath: string) => {
      if (isAdmin) {
        return true;
      }
      return hasRoutePermission(routePath);
    };
  }, [isReady, isAdmin, hasRoutePermission]);

  return { canAccess, isReady };
}
