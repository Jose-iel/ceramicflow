import { supabase } from '../client';

import { ProfileCacheService } from './profile-cache';

export interface EmployeeAbsence {
  id: string;
  employee_id: string;
  ceramic_id: string;
  absence_date: string;
  reason?: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export interface CreateEmployeeAbsencePayload {
  employee_id: string;
  absence_date: string;
  reason?: string;
  notes?: string;
}

export type UpdateEmployeeAbsencePayload = Partial<Omit<CreateEmployeeAbsencePayload, 'employee_id'>>;

export class EmployeeAbsencesService {
  static async getCurrentUserCeramicId(): Promise<string> {
    return ProfileCacheService.getCurrentUserCeramicId();
  }

  // Buscar todas as faltas de um funcionário específico
  static async getEmployeeAbsences(employeeId: string): Promise<EmployeeAbsence[]> {
    const ceramicId = await EmployeeAbsencesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('employee_absences')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('ceramic_id', ceramicId)
      .order('absence_date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Buscar todas as faltas de todos os funcionários (útil para relatórios)
  static async getAllAbsences(): Promise<EmployeeAbsence[]> {
    const ceramicId = await EmployeeAbsencesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('employee_absences')
      .select('*')
      .eq('ceramic_id', ceramicId)
      .order('absence_date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Buscar uma falta específica por ID
  static async getAbsenceById(id: string): Promise<EmployeeAbsence | null> {
    const ceramicId = await EmployeeAbsencesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('employee_absences')
      .select('*')
      .eq('id', id)
      .eq('ceramic_id', ceramicId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Criar uma nova falta
  static async createAbsence(
    absence: Omit<EmployeeAbsence, 'id' | 'ceramic_id' | 'created_at' | 'updated_at'>
  ): Promise<EmployeeAbsence> {
    const ceramicId = await EmployeeAbsencesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('employee_absences')
      .insert([
        {
          ...absence,
          ceramic_id: ceramicId,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Atualizar uma falta existente
  static async updateAbsence(
    id: string,
    absence: Partial<Omit<EmployeeAbsence, 'id' | 'ceramic_id' | 'created_at' | 'updated_at'>>
  ): Promise<EmployeeAbsence> {
    const ceramicId = await EmployeeAbsencesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('employee_absences')
      .update(absence)
      .eq('id', id)
      .eq('ceramic_id', ceramicId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Excluir uma falta
  static async deleteAbsence(id: string): Promise<boolean> {
    const ceramicId = await EmployeeAbsencesService.getCurrentUserCeramicId();

    const { error } = await supabase.from('employee_absences').delete().eq('id', id).eq('ceramic_id', ceramicId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  // Verificar se uma falta específica existe
  static async checkAbsenceExists(employeeId: string, absenceDate: string): Promise<boolean> {
    const ceramicId = await EmployeeAbsencesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('employee_absences')
      .select('id')
      .eq('employee_id', employeeId)
      .eq('absence_date', absenceDate)
      .eq('ceramic_id', ceramicId)
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return (data || []).length > 0;
  }

  // Buscar faltas em um período específico
  static async getAbsencesByPeriod(startDate: string, endDate: string, employeeId?: string): Promise<EmployeeAbsence[]> {
    const ceramicId = await EmployeeAbsencesService.getCurrentUserCeramicId();

    let query = supabase
      .from('employee_absences')
      .select('*')
      .eq('ceramic_id', ceramicId)
      .gte('absence_date', startDate)
      .lte('absence_date', endDate);

    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }

    const { data, error } = await query.order('absence_date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
}
