import { supabase } from '../client';
import { EmployeeRole } from '@/types';

export interface Employee {
  id: string;
  ceramic_id: string;
  name: string;
  role: EmployeeRole;
  cpf?: string;
  contact?: string;
  shift?: string;
  registration_date?: string;
  aso_expiration_date?: string;
  nr_expiration_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeePayload {
  name: string;
  role: EmployeeRole;
  cpf?: string;
  contact?: string;
  shift?: string;
  registration_date?: string;
  aso_expiration_date?: string;
  nr_expiration_date?: string;
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

export class EmployeesService {
  static async getCurrentUserCeramicId(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('ceramic_id')
      .eq('id', session.user.id)
      .single();

    if (!profile?.ceramic_id) {
      throw new Error('Usuário não possui cerâmica associada');
    }

    return profile.ceramic_id;
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
      role: employee.role as EmployeeRole
    }));
  }

  static async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    const ceramicId = await EmployeesService.getCurrentUserCeramicId();

    const employeeData = {
      ...payload,
      ceramic_id: ceramicId,
    };

    const { data, error } = await supabase
      .from('employees')
      .insert(employeeData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      ...data,
      role: data.role as EmployeeRole
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
      role: data.role as EmployeeRole
    };
  }

  static async deleteEmployee(employeeId: string): Promise<void> {
    const ceramicId = await EmployeesService.getCurrentUserCeramicId();

    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', employeeId)
      .eq('ceramic_id', ceramicId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
