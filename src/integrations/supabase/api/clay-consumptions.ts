import { supabase } from '../client';

import { ProfileCacheService } from './profile-cache';

export interface ClayConsumption {
  id: string;
  ceramic_id: string;
  date?: string;
  trucks_quantity: number;
  supplier?: string;
  origin?: string;
  truck_id?: string;
  recorded_by: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClayConsumptionPayload {
  date?: string;
  trucks_quantity: number;
  supplier?: string;
  origin?: string;
  truck_id?: string;
  recorded_by: string;
  notes?: string;
}

export type UpdateClayConsumptionPayload = Partial<CreateClayConsumptionPayload>;

export class ClayConsumptionsService {
  static async getCurrentUserCeramicId(): Promise<string> {
    return ProfileCacheService.getCurrentUserCeramicId();
  }

  static async getAllClayConsumptions(): Promise<ClayConsumption[]> {
    const ceramicId = await ClayConsumptionsService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('clay_consumptions')
      .select('*')
      .eq('ceramic_id', ceramicId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async createClayConsumption(payload: CreateClayConsumptionPayload): Promise<ClayConsumption> {
    const ceramicId = await ClayConsumptionsService.getCurrentUserCeramicId();

    const clayConsumptionData = {
      ...payload,
      ceramic_id: ceramicId,
      date: payload.date || new Date().toISOString().split('T')[0],
    };

    const { data, error } = await supabase
      .from('clay_consumptions')
      .insert(clayConsumptionData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateClayConsumption(clayConsumptionId: string, payload: UpdateClayConsumptionPayload): Promise<ClayConsumption> {
    const ceramicId = await ClayConsumptionsService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('clay_consumptions')
      .update(payload)
      .eq('id', clayConsumptionId)
      .eq('ceramic_id', ceramicId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async deleteClayConsumption(clayConsumptionId: string): Promise<void> {
    const ceramicId = await ClayConsumptionsService.getCurrentUserCeramicId();

    const { error } = await supabase
      .from('clay_consumptions')
      .delete()
      .eq('id', clayConsumptionId)
      .eq('ceramic_id', ceramicId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
