import type { User, Session } from '@supabase/supabase-js';
import {
  useState, useEffect, useContext, createContext, useMemo,
} from 'react';
import type { ReactNode } from 'react';

import { AuthService } from '../api/auth';
import { type UserProfile } from '../api/profile-cache';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRoutePermission: (routePath: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionsCache, setPermissionsCache] = useState<Record<string, boolean>>({});
  const [initializationComplete, setInitializationComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const currentSession = await AuthService.getSession();

        if (!isMounted) {return;}

        setSession(currentSession);
        setUser(currentSession?.user || null);

        if (currentSession?.user) {
          // Carregar perfil primeiro
          const userProfile = await AuthService.getCurrentProfile();

          if (!isMounted) {return;}

          setProfile(userProfile);

          // Se é admin, não precisa carregar permissões específicas
          if (userProfile?.is_admin) {
            // Admin tem acesso a tudo - criar cache básico
            const adminCache = {
              'dashboard': true, 'vehicles': true, 'employees': true,
              'operations': true, 'maintenance': true, 'wood': true,
              'raw-material': true, 'sales': true, 'reports': true, 'admin': true,
            };
            setPermissionsCache(adminCache);
          } else if (userProfile) {
            // Para usuários não-admin, carregar permissões apenas uma vez
            const routes = ['dashboard', 'vehicles', 'employees', 'operations', 'maintenance', 'wood', 'raw-material', 'sales', 'reports', 'admin'];

            try {
              const permissionsPromises = routes.map(async (route) => {
                const hasPermission = await AuthService.hasRoutePermission(currentSession.user.id, route);
                return { route, hasPermission };
              });

              const permissions = await Promise.all(permissionsPromises);

              if (!isMounted) {return;}

              const permissionsMap = permissions.reduce((acc, { route, hasPermission }) => {
                acc[route] = hasPermission;
                return acc;
              }, {} as Record<string, boolean>);

              setPermissionsCache(permissionsMap);
            } catch (error) {
              console.error('Error loading permissions:', error);
              // Em caso de erro, permitir acesso básico
              setPermissionsCache({ 'dashboard': true });
            }
          }
        } else {
          // Sem usuário, limpar tudo
          setProfile(null);
          setPermissionsCache({});
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Em caso de erro, limpar tudo
        setUser(null);
        setSession(null);
        setProfile(null);
        setPermissionsCache({});
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setInitializationComplete(true);
        }
      }
    };

    initializeAuth();

    const { data: authListener } = AuthService.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
        setUser(newSession?.user || null);
        if (!newSession) {
          setProfile(null);
          setPermissionsCache({});
        } else {
          // Recarregar perfil quando a sessão muda
          initializeAuth();
        }
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await AuthService.signIn({ email, password });
    // O listener onAuthStateChange cuidará de atualizar o estado
  };

  const signOut = async () => {
    await AuthService.signOut();
    // O listener onAuthStateChange cuidará de atualizar o estado
  };

  const hasRoutePermission = (routePath: string): boolean => {
    if (isLoading || !initializationComplete) {
      return false; // Ou um estado de carregamento
    }
    if (profile?.is_admin) {
      return true;
    }
    const routeKey = routePath.replace('/', '');
    return permissionsCache[routeKey] ?? false;
  };

  // Memoriza o valor do contexto para evitar re-renderizações desnecessárias
  const value = useMemo(() => ({
    user,
    session,
    profile,
    loading: isLoading,
    isLoading: isLoading || !initializationComplete,
    signIn,
    signOut,
    hasRoutePermission,
  }), [user, session, profile, isLoading, initializationComplete, permissionsCache]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Alias for centralized hooks
export const useAuthOptimized = useAuth;
