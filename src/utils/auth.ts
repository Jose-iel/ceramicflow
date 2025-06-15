
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthData {
  user: User;
  session: Session;
  isAdmin?: boolean;
}

// Fazer login
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

// Fazer logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Obter sessão atual
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

// Verificar se usuário tem permissão para uma rota
export const checkRoutePermission = async (userId: string, routePath: string) => {
  if (!userId || !routePath) return { data: false, error: null };
  
  const { data, error } = await supabase.rpc('user_has_route_permission', {
    user_id: userId,
    route_path: routePath
  });

  return { data, error };
};
