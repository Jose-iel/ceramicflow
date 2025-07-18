import { supabase } from '../client';

import { ProfileCacheService } from './profile-cache';

import type { EmployeeRole } from '@/types';

export interface Employee {
  id: string;
  ceramic_id: string;
  name: string;
  role: EmployeeRole;
  cpf?: string;
  contact?: string;
  shift?: string;
  admission_date?: string;
  vacation_due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeePayload {
  name: string;
  role: EmployeeRole;
  cpf?: string;
  contact?: string;
  shift?: string;
  admission_date?: string;
  vacation_due_date?: string;
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

export class EmployeesService {
  static async getCurrentUserCeramicId(): Promise<string> {
    return ProfileCacheService.getCurrentUserCeramicId();
  }

  static async findEmployeeByEmail(email: string): Promise<Employee | null> {
    if (!email) {
      return null;
    }

    try {
      const ceramicId = await EmployeesService.getCurrentUserCeramicId();

      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('ceramic_id', ceramicId)
        .ilike('contact', `%${email}%`) // Busca case-insensitive pelo email no campo de contato
        .maybeSingle(); // Retorna um único objeto ou null, não um array

      if (error) {
        // Loga o erro mas não lança para não quebrar a aplicação
        console.error('Erro ao buscar funcionário por email:', error.message);
        return null;
      }

      return data ? { ...data, role: data.role as EmployeeRole } : null;
    } catch (error) {
      console.error('Erro inesperado ao buscar funcionário:', error);
      return null;
    }
  }

  static async getAllEmployees(): Promise<Employee[]> {
    const ceramicId = await EmployeesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('ceramic_id', ceramicId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []).map(employee => ({
      ...employee,
      role: employee.role as EmployeeRole,
    }));
  }

  static async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    const ceramicId = await EmployeesService.getCurrentUserCeramicId();

    const employeeData = {
      ...payload,
      ceramic_id: ceramicId,
    };

    const { data, error } = await supabase.from('employees').insert(employeeData).select().single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      ...data,
      role: data.role as EmployeeRole,
    };
  }

  static async updateEmployee(employeeId: string, payload: UpdateEmployeePayload): Promise<Employee> {
    const ceramicId = await EmployeesService.getCurrentUserCeramicId();

    const { data, error } = await supabase
      .from('employees')
      .update(payload)
      .eq('id', employeeId)
      .eq('ceramic_id', ceramicId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      ...data,
      role: data.role as EmployeeRole,
    };
  }

  static async deleteEmployee(employeeId: string): Promise<void> {
    const ceramicId = await EmployeesService.getCurrentUserCeramicId();

    const { error } = await supabase.from('employees').delete().eq('id', employeeId).eq('ceramic_id', ceramicId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
