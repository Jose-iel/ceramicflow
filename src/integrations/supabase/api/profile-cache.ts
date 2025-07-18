import { supabase } from '../client';

// Tipo para o perfil do usuário
export interface UserProfile {
  id: string;
  ceramic_id: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// Cache para evitar múltiplas requisições ao profiles
const profileCache: {
  profile: UserProfile | null;
  ceramicId: string | null;
  lastFetch: number;
  userId: string | null;
} = {
  profile: null,
  ceramicId: null,
  lastFetch: 0,
  userId: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export class ProfileCacheService {
  /**
   * Busca o ceramic_id do usuário atual com cache inteligente
   */
  static async getCurrentUserCeramicId(): Promise<string> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const currentUserId = session.user.id;
      const now = Date.now();

      // Verifica se o cache é válido
      if (profileCache.ceramicId && profileCache.userId === currentUserId && now - profileCache.lastFetch < CACHE_DURATION) {
        return profileCache.ceramicId;
      }

      // Se mudou de usuário, limpa o cache
      if (profileCache.userId && profileCache.userId !== currentUserId) {
        ProfileCacheService.clearCache();
      }

      // Buscar perfil no banco
      const { data, error } = await supabase.from('profiles').select('ceramic_id').eq('id', currentUserId).single();

      if (error) {
        console.error('Error fetching ceramic_id:', error);
        throw new Error(`Erro ao buscar ceramic_id: ${error.message}`);
      }

      if (!data?.ceramic_id) {
        throw new Error('ceramic_id não encontrado para o usuário');
      }

      // Atualizar cache
      profileCache.ceramicId = data.ceramic_id;
      profileCache.userId = currentUserId;
      profileCache.lastFetch = now;

      return data.ceramic_id;
    } catch (error) {
      console.error('Error in getCurrentUserCeramicId:', error);
      // Limpar cache em caso de erro
      ProfileCacheService.clearCache();
      throw error;
    }
  }

  /**
   * Busca o perfil completo do usuário atual
   */
  static async getCurrentProfile(): Promise<UserProfile> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const currentUserId = session.user.id;
      const now = Date.now();

      // Verifica se o cache é válido
      if (profileCache.profile && profileCache.userId === currentUserId && now - profileCache.lastFetch < CACHE_DURATION) {
        return profileCache.profile;
      }

      // Se mudou de usuário, limpa o cache
      if (profileCache.userId && profileCache.userId !== currentUserId) {
        ProfileCacheService.clearCache();
      }

      // Buscar perfil completo no banco
      const { data, error } = await supabase.from('profiles').select('*').eq('id', currentUserId).single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw new Error(`Erro ao buscar perfil: ${error.message}`);
      }

      if (!data) {
        throw new Error('Perfil não encontrado para o usuário');
      }

      // Atualizar cache completo
      profileCache.profile = data;
      profileCache.ceramicId = data.ceramic_id;
      profileCache.userId = currentUserId;
      profileCache.lastFetch = now;

      return data;
    } catch (error) {
      console.error('Error in getCurrentProfile:', error);
      // Limpar cache em caso de erro
      ProfileCacheService.clearCache();
      throw error;
    }
  }

  /**
   * Atualiza o cache com novos dados de perfil
   */
  static updateCache(profile: UserProfile): void {
    profileCache.profile = profile;
    profileCache.ceramicId = profile.ceramic_id;
    profileCache.userId = profile.id;
    profileCache.lastFetch = Date.now();
  }

  /**
   * Limpa todo o cache
   */
  static clearCache(): void {
    profileCache.profile = null;
    profileCache.ceramicId = null;
    profileCache.lastFetch = 0;
    profileCache.userId = null;
  }

  /**
   * Verifica se o cache está válido
   */
  static isCacheValid(userId: string): boolean {
    const now = Date.now();
    return profileCache.userId === userId && now - profileCache.lastFetch < CACHE_DURATION;
  }

  /**
   * Força uma atualização do cache na próxima requisição
   */
  static invalidateCache(): void {
    profileCache.lastFetch = 0;
  }
}
