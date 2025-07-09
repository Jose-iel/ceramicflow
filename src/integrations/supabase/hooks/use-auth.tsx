
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
  hasRoutePermission: (routePath: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentSession = await AuthService.getSession();
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Carregar perfil do usuário se estiver autenticado
        if (currentSession?.user) {
          try {
            const userProfile = await AuthService.getCurrentProfile();
            setProfile(userProfile);
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
        
        // Carregar perfil quando o usuário fizer login
        if (session?.user && event === 'SIGNED_IN') {
          try {
            const userProfile = await AuthService.getCurrentProfile();
            setProfile(userProfile);
          } catch (error) {
            console.error('Error loading user profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
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
      
      // Carregar perfil após login
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
    } finally {
      setIsLoading(false);
    }
  };

  const hasRoutePermission = async (routePath: string): Promise<boolean> => {
    if (!user) return false;
    return AuthService.hasRoutePermission(user.id, routePath);
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
