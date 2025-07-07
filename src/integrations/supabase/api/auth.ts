import { supabase } from '../client';
import type { User, Session } from '@supabase/supabase-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  user: User | null;
  session: Session | null;
}

export class AuthService {
  static async signIn(credentials: LoginCredentials): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { user: data.user, session: data.session };
  }

  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  static async getSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return session;
  }

  static async hasRoutePermission(userId: string, routePath: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('user_has_route_permission', {
      user_id: userId,
      route_path: routePath,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data || false;
  }

  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  static async getCurrentProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', (await this.getSession())?.user?.id)
      .single();
    
    return data;
  }
}

// Legacy exports for backward compatibility
export const signIn = AuthService.signIn;
export const signOut = AuthService.signOut;
export const getSession = AuthService.getSession;
export const hasRoutePermission = AuthService.hasRoutePermission;