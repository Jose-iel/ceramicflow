import { supabase } from '../client';

import { ProfileCacheService } from './profile-cache';

export interface Vehicle {
  id: string;
  ceramic_id: string;
  model: string;
  type: string;
  acquisition_date?: string;
  last_maintenance?: string;
  status: string;
  hour_meter?: number;
  capacity?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVehiclePayload {
  model: string;
  type: string;
  acquisition_date?: string;
  last_maintenance?: string;
  status?: string;
  hour_meter?: number;
  capacity?: string;
}

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;

export class VehiclesService {
  static async getCurrentUserCeramicId(): Promise<string> {
    return ProfileCacheService.getCurrentUserCeramicId();
  }

  static async getAllVehicles(): Promise<Vehicle[]> {
    const ceramicId = await VehiclesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('ceramic_id', ceramicId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getTrucks(): Promise<Pick<Vehicle, 'id' | 'model' | 'type'>[]> {
    const ceramicId = await VehiclesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('vehicles')
      .select('id, model, type')
      .eq('ceramic_id', ceramicId)
      .eq('type', 'Caminhão')
      .order('model');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
    const ceramicId = await VehiclesService.getCurrentUserCeramicId();

    const vehicleData = {
      ...payload,
      ceramic_id: ceramicId,
      status: payload.status || 'OPERATIONAL',
    };

    const { data, error } = await supabase.from('vehicles').insert(vehicleData).select().single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateVehicle(vehicleId: string, payload: UpdateVehiclePayload): Promise<Vehicle> {
    const ceramicId = await VehiclesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('vehicles')
      .update(payload)
      .eq('id', vehicleId)
      .eq('ceramic_id', ceramicId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async deleteVehicle(vehicleId: string): Promise<void> {
    const ceramicId = await VehiclesService.getCurrentUserCeramicId();

    const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId).eq('ceramic_id', ceramicId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
