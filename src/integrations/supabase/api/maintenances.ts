import { supabase } from '../client';

import { ProfileCacheService } from './profile-cache';

export interface Maintenance {
  id: string;
  ceramic_id: string;
  vehicle_id: string;
  issue: string;
  reported_by: string;
  reported_date?: string;
  status: string;
  completed_date?: string;
  created_at: string;
  updated_at: string;
  vehicles?: {
    id: string;
    model: string;
    type: string;
  } | null;
}

export interface CreateMaintenancePayload {
  vehicle_id: string;
  issue: string;
  reported_by: string;
  reported_date?: string;
  status?: string;
  completed_date?: string;
}

export type UpdateMaintenancePayload = Partial<CreateMaintenancePayload>;

export class MaintenancesService {
  static async getCurrentUserCeramicId(): Promise<string> {
    return ProfileCacheService.getCurrentUserCeramicId();
  }

  static async getAllMaintenances(): Promise<Maintenance[]> {
    const ceramicId = await MaintenancesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('maintenances')
      .select(
        `
        *,
        vehicles (
          id,
          model,
          type
        )
      `
      )
      .eq('ceramic_id', ceramicId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async createMaintenance(payload: CreateMaintenancePayload): Promise<Maintenance> {
    const ceramicId = await MaintenancesService.getCurrentUserCeramicId();

    const maintenanceData = {
      ...payload,
      ceramic_id: ceramicId,
      status: payload.status || 'WAITING',
      reported_date: payload.reported_date || new Date().toISOString().split('T')[0],
    };

    const { data, error } = await supabase.from('maintenances').insert(maintenanceData).select().single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateMaintenance(maintenanceId: string, payload: UpdateMaintenancePayload): Promise<Maintenance> {
    const ceramicId = await MaintenancesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('maintenances')
      .update(payload)
      .eq('id', maintenanceId)
      .eq('ceramic_id', ceramicId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async deleteMaintenance(maintenanceId: string): Promise<void> {
    const ceramicId = await MaintenancesService.getCurrentUserCeramicId();

    const { error } = await supabase.from('maintenances').delete().eq('id', maintenanceId).eq('ceramic_id', ceramicId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
