import { supabase } from '../client';

export interface UserLevel {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  permissions?: string[];
}

export interface Route {
  id: string;
  name: string;
  path: string;
  description?: string;
}

export interface CreateUserLevelPayload {
  name: string;
  description?: string;
  permissions: string[];
}

export type UpdateUserLevelPayload = CreateUserLevelPayload;

export class UserLevelsService {
  static async getAllUserLevels(): Promise<UserLevel[]> {
    const { data, error } = await supabase
      .from('user_levels')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getAllRoutes(): Promise<Route[]> {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getUserLevelPermissions(levelId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_level_permissions')
      .select('route_id')
      .eq('user_level_id', levelId);

    if (error) {
      throw new Error(error.message);
    }

    return data?.map(p => p.route_id).filter(Boolean) || [];
  }

  static async deleteUserLevel(levelId: string): Promise<void> {
    const { error } = await supabase
      .from('user_levels')
      .delete()
      .eq('id', levelId);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async createUserLevel(payload: CreateUserLevelPayload): Promise<void> {
    const { data: newLevel, error: insertError } = await supabase
      .from('user_levels')
      .insert({
        name: payload.name,
        description: payload.description,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    await this.updateUserLevelPermissions(newLevel.id, payload.permissions);
  }

  static async updateUserLevel(levelId: string, payload: UpdateUserLevelPayload): Promise<void> {
    const { error: updateError } = await supabase
      .from('user_levels')
      .update({
        name: payload.name,
        description: payload.description,
      })
      .eq('id', levelId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    await this.updateUserLevelPermissions(levelId, payload.permissions);
  }

  private static async updateUserLevelPermissions(levelId: string, permissions: string[]): Promise<void> {
    // Primeiro, remove todas as permissões existentes
    const { error: deleteError } = await supabase
      .from('user_level_permissions')
      .delete()
      .eq('user_level_id', levelId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    // Depois, insere as novas permissões
    if (permissions.length > 0) {
      const permissionsToInsert = permissions.map(routeId => ({
        user_level_id: levelId,
        route_id: routeId,
      }));

      const { error: insertError } = await supabase
        .from('user_level_permissions')
        .insert(permissionsToInsert);

      if (insertError) {
        throw new Error(insertError.message);
      }
    }
  }
}
