import { supabase } from '../client';

import { ProfileCacheService } from './profile-cache';

export interface WoodPurchase {
  id: string;
  ceramic_id: string;
  date: string;
  supplier: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  invoice_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWoodPurchasePayload {
  date: string;
  supplier: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  invoice_number?: string;
  notes?: string;
}

export interface WoodConsumption {
  id: string;
  ceramic_id: string;
  date: string;
  oven: string;
  quantity: number;
  responsible: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWoodConsumptionPayload {
  date: string;
  oven: string;
  quantity: number;
  responsible: string;
  observations?: string;
}

export type UpdateWoodPurchasePayload = Partial<CreateWoodPurchasePayload>;
export type UpdateWoodConsumptionPayload = Partial<CreateWoodConsumptionPayload>;

export class WoodService {
  static async getCurrentUserCeramicId(): Promise<string> {
    return ProfileCacheService.getCurrentUserCeramicId();
  }

  // Wood Purchases
  static async getAllWoodPurchases(): Promise<WoodPurchase[]> {
    try {
      const ceramicId = await WoodService.getCurrentUserCeramicId();

      const { data, error } = await supabase
        .from('wood_purchases')
        .select('*')
        .eq('ceramic_id', ceramicId)
        .order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar compras de lenha:', error);
      throw error;
    }
  }

  static async createWoodPurchase(payload: CreateWoodPurchasePayload): Promise<void> {
    const ceramicId = await WoodService.getCurrentUserCeramicId();

    const { error } = await supabase
      .from('wood_purchases')
      .insert({
        ceramic_id: ceramicId,
        ...payload,
      });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async updateWoodPurchase(purchaseId: string, payload: UpdateWoodPurchasePayload): Promise<void> {
    const { error } = await supabase
      .from('wood_purchases')
      .update(payload)
      .eq('id', purchaseId);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async deleteWoodPurchase(purchaseId: string): Promise<void> {
    const { error } = await supabase
      .from('wood_purchases')
      .delete()
      .eq('id', purchaseId);

    if (error) {
      throw new Error(error.message);
    }
  }

  // Wood Consumptions
  static async getAllWoodConsumptions(): Promise<WoodConsumption[]> {
    try {
      const ceramicId = await WoodService.getCurrentUserCeramicId();

      const { data, error } = await supabase
        .from('wood_consumptions')
        .select('*')
        .eq('ceramic_id', ceramicId)
        .order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar consumos de lenha:', error);
      throw error;
    }
  }

  static async createWoodConsumption(payload: CreateWoodConsumptionPayload): Promise<void> {
    const ceramicId = await WoodService.getCurrentUserCeramicId();

    const { error } = await supabase
      .from('wood_consumptions')
      .insert({
        ceramic_id: ceramicId,
        ...payload,
      });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async updateWoodConsumption(consumptionId: string, payload: UpdateWoodConsumptionPayload): Promise<void> {
    const { error } = await supabase
      .from('wood_consumptions')
      .update(payload)
      .eq('id', consumptionId);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async deleteWoodConsumption(consumptionId: string): Promise<void> {
    const { error } = await supabase
      .from('wood_consumptions')
      .delete()
      .eq('id', consumptionId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
