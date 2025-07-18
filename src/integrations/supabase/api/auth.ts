import type { User, Session } from '@supabase/supabase-js';

import { supabase } from '../client';

import { ProfileCacheService } from './profile-cache';

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
    // Limpar cache ao fazer logout
    ProfileCacheService.clearCache();

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  static async getSession(): Promise<Session | null> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.warn('Session error:', error.message);
        // Limpar cache se há erro de sessão
        ProfileCacheService.clearCache();
        return null;
      }

      // Verificar se a sessão não está expirada
      if (session && session.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000);
        const now = new Date();

        if (expiresAt <= now) {
          console.warn('Session expired, clearing cache');
          ProfileCacheService.clearCache();
          return null;
        }
      }

      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      ProfileCacheService.clearCache();
      return null;
    }
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
    return ProfileCacheService.getCurrentProfile();
  }
}

// Legacy exports for backward compatibility
export const { signIn } = AuthService;
export const { signOut } = AuthService;
export const { getSession } = AuthService;
export const { hasRoutePermission } = AuthService;
