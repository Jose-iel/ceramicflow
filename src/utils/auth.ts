
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

// Verificar se usuário é admin
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();
  
  if (error || !data) return false;
  return data.is_admin || false;
};

// Verificar se usuário está autenticado
export const isUserAuthenticated = (): boolean => {
  return !!supabase.auth.getSession();
};

// Backward compatibility (não mais utilizadas, mas mantidas para não quebrar)
export const setAuthData = () => true;
export const getAuthData = () => null;
export const clearAuthData = () => {};
export const setAuthCookie = setAuthData;
export const getAuthCookie = getAuthData;
export const clearAuthCookie = clearAuthData;
