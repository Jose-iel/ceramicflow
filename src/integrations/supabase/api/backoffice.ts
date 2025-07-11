import { supabase } from '../client';

import type { BackofficeUser, Ceramic } from '@/types/backoffice';

export interface CreateUserPayload {
  email: string;
  password: string;
  full_name: string;
  is_admin: boolean;
  user_level_id: string;
  ceramic_id: string;
}

export interface UpdateUserPayload {
  full_name: string;
  is_admin: boolean;
  user_level_id: string;
  ceramic_id: string;
}

export interface CreateCeramicPayload {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
}

export type UpdateCeramicPayload = CreateCeramicPayload;

export interface UsersTabData {
  users: BackofficeUser[];
  ceramics: {id: string, name: string}[];
  userLevels: {id: string, name: string}[];
}

export class BackofficeService {
  // Users Tab Operations
  static async getUsersTabData(): Promise<UsersTabData> {
    const { data, error } = await supabase.functions.invoke('backoffice-bff', {
      body: { resource: 'users-tab', action: 'getData' },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async createUser(userData: CreateUserPayload): Promise<void> {
    const { error } = await supabase.functions.invoke('backoffice-bff', {
      body: { resource: 'users-tab', action: 'create', payload: userData },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async updateUser(userId: string, userData: UpdateUserPayload): Promise<void> {
    const { error } = await supabase.functions.invoke('backoffice-bff', {
      body: { resource: 'users-tab', action: 'update', payload: { userId, userData } },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('backoffice-bff', {
      body: { resource: 'users-tab', action: 'delete', payload: { userId } },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Ceramics Tab Operations
  static async getCeramicsData(): Promise<Ceramic[]> {
    const { data, error } = await supabase.functions.invoke('backoffice-bff', {
      body: { resource: 'ceramics-tab', action: 'getData' },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.ceramics || [];
  }

  static async createCeramic(ceramicData: CreateCeramicPayload): Promise<void> {
    const { error } = await supabase.functions.invoke('backoffice-bff', {
      body: { resource: 'ceramics-tab', action: 'create', payload: { ceramicData } },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async updateCeramic(ceramicId: string, ceramicData: UpdateCeramicPayload): Promise<void> {
    const { error } = await supabase.functions.invoke('backoffice-bff', {
      body: { resource: 'ceramics-tab', action: 'update', payload: { ceramicId, ceramicData } },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async deleteCeramic(ceramicId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('backoffice-bff', {
      body: { resource: 'ceramics-tab', action: 'delete', payload: { ceramicId } },
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}
