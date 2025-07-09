
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthService } from '../api/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any;
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
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionsCache, setPermissionsCache] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentSession = await AuthService.getSession();
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (currentSession?.user) {
          try {
            const userProfile = await AuthService.getCurrentProfile();
            setProfile(userProfile);
            
            // Pre-carregar permissões para todas as rotas principais
            const routes = ['dashboard', 'vehicles', 'employees', 'operations', 'maintenance', 'wood', 'raw-material', 'gas-supply', 'sales', 'operators', 'forklifts', 'reports', 'admin'];
            const permissionsPromises = routes.map(async (route) => {
              try {
                const hasPermission = await AuthService.hasRoutePermission(currentSession.user.id, route);
                return { route, hasPermission };
              } catch {
                return { route, hasPermission: false };
              }
            });
            
            const permissions = await Promise.all(permissionsPromises);
            const permissionsMap = permissions.reduce((acc, { route, hasPermission }) => {
              acc[route] = hasPermission;
              return acc;
            }, {} as Record<string, boolean>);
            
            setPermissionsCache(permissionsMap);
          } catch (error) {
            console.error('Error loading user profile:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const subscription = AuthService.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user && event === 'SIGNED_IN') {
          try {
            const userProfile = await AuthService.getCurrentProfile();
            setProfile(userProfile);
          } catch (error) {
            console.error('Error loading user profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setPermissionsCache({});
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.data.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: authUser, session: authSession } = await AuthService.signIn({ email, password });
      setUser(authUser);
      setSession(authSession);
      
      if (authUser) {
        try {
          const userProfile = await AuthService.getCurrentProfile();
          setProfile(userProfile);
        } catch (error) {
          console.error('Error loading user profile after login:', error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AuthService.signOut();
      setProfile(null);
      setPermissionsCache({});
    } finally {
      setIsLoading(false);
    }
  };

  // Função otimizada que usa cache
  const hasRoutePermission = (routePath: string): boolean => {
    if (!user) return false;
    
    // Se é admin, sempre permitir
    if (profile?.is_admin) return true;
    
    // Usar cache se disponível
    if (permissionsCache.hasOwnProperty(routePath)) {
      return permissionsCache[routePath];
    }
    
    // Se não tem no cache, assumir falso para evitar loading
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading: isLoading,
      isLoading,
      signIn,
      signOut,
      hasRoutePermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
