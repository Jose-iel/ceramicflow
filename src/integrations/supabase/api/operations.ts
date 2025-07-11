import { supabase } from '../client';

import { ProfileCacheService } from './profile-cache';

export interface Operation {
  id: string;
  ceramic_id: string;
  type: string;
  location?: string;
  operator?: string;
  start_date?: string;
  end_date?: string;
  status: string;
  employee_id?: string;
  vehicle_id?: string;
  operation_type?: string;
  description?: string;
  initial_hour_meter?: number;
  current_hour_meter?: number;
  start_time?: string;
  end_time?: string;
  gas_consumption?: number;
  fuel_consumption?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOperationPayload {
  type: string;
  location?: string;
  operator?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  employee_id?: string;
  vehicle_id?: string;
  operation_type?: string;
  description?: string;
  initial_hour_meter?: number;
  current_hour_meter?: number;
  start_time?: string;
  end_time?: string;
  gas_consumption?: number;
  fuel_consumption?: number;
}

export type UpdateOperationPayload = Partial<CreateOperationPayload>;

export class OperationsService {
  static async getCurrentUserCeramicId(): Promise<string> {
    return ProfileCacheService.getCurrentUserCeramicId();
  }

  static async getAllOperations(): Promise<Operation[]> {
    const ceramicId = await OperationsService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('operations')
      .select(`
        *,
        vehicles:vehicle_id(model, type),
        employees:employee_id(name)
      `)
      .eq('ceramic_id', ceramicId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async createOperation(payload: CreateOperationPayload): Promise<Operation> {
    const ceramicId = await OperationsService.getCurrentUserCeramicId();

    const operationData = {
      ...payload,
      ceramic_id: ceramicId,
      status: payload.status || 'IN_PROGRESS',
      operation_type: payload.operation_type || 'manual',
    };

    const { data, error } = await supabase
      .from('operations')
      .insert(operationData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateOperation(operationId: string, payload: UpdateOperationPayload): Promise<Operation> {
    const ceramicId = await OperationsService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('operations')
      .update(payload)
      .eq('id', operationId)
      .eq('ceramic_id', ceramicId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async deleteOperation(operationId: string): Promise<void> {
    const ceramicId = await OperationsService.getCurrentUserCeramicId();

    const { error } = await supabase
      .from('operations')
      .delete()
      .eq('id', operationId)
      .eq('ceramic_id', ceramicId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
