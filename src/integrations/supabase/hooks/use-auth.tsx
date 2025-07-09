
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
  const [initializationComplete, setInitializationComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        const currentSession = await AuthService.getSession();
        
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (currentSession?.user) {
          // Carregar perfil primeiro
          const userProfile = await AuthService.getCurrentProfile();
          
          if (!isMounted) return;
          
          setProfile(userProfile);
          
          // Se é admin, não precisa carregar permissões específicas
          if (userProfile?.is_admin) {
            // Admin tem acesso a tudo - criar cache básico
            const adminCache = {
              'dashboard': true, 'vehicles': true, 'employees': true, 
              'operations': true, 'maintenance': true, 'wood': true, 
              'raw-material': true, 'gas-supply': true, 'sales': true, 
              'operators': true, 'forklifts': true, 'reports': true, 'admin': true
            };
            setPermissionsCache(adminCache);
          } else {
            // Para usuários não-admin, carregar permissões apenas uma vez
            const routes = ['dashboard', 'vehicles', 'employees', 'operations', 'maintenance', 'wood', 'raw-material', 'gas-supply', 'sales', 'operators', 'forklifts', 'reports', 'admin'];
            
            try {
              const permissionsPromises = routes.map(async (route) => {
                const hasPermission = await AuthService.hasRoutePermission(currentSession.user.id, route);
                return { route, hasPermission };
              });
              
              const permissions = await Promise.all(permissionsPromises);
              
              if (!isMounted) return;
              
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
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setInitializationComplete(true);
        }
      }
    };

    initializeAuth();

    const subscription = AuthService.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user || null);
      
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setPermissionsCache({});
        setIsLoading(false);
      } else if (session?.user && event === 'SIGNED_IN' && !initializationComplete) {
        // Apenas recarregar se não foi inicializado ainda
        initializeAuth();
      }
    });

    return () => {
      isMounted = false;
      subscription.data.subscription.unsubscribe();
    };
  }, [initializationComplete]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: authUser, session: authSession } = await AuthService.signIn({ email, password });
      setUser(authUser);
      setSession(authSession);
      
      if (authUser) {
        const userProfile = await AuthService.getCurrentProfile();
        setProfile(userProfile);
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
      setInitializationComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Função otimizada que usa cache sem fazer requisições adicionais
  const hasRoutePermission = (routePath: string): boolean => {
    if (!user || !profile) return false;
    
    // Se é admin, sempre permitir
    if (profile.is_admin) return true;
    
    // Usar cache - sem fallback para requisições
    return permissionsCache[routePath] || false;
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
