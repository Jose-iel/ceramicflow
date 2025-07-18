import { useQueryClient } from '@tanstack/react-query';

import { EmployeesService } from '../api';
import type { CreateEmployeePayload, UpdateEmployeePayload, Employee } from '../api';

import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { useEntityMutation } from '@/hooks/useEntityMutation';

// Hook otimizado para listar funcionários
export function useEmployeesOptimized() {
  return useOptimizedQuery({
    queryKey: ['employees'],
    queryFn: EmployeesService.getAllEmployees,
    staleTime: 10 * 60 * 1000, // 10 minutos - dados de funcionários mudam pouco
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

// Hook otimizado para criar funcionário
export function useCreateEmployeeOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: (payload: CreateEmployeePayload) => EmployeesService.createEmployee(payload),
    queryKeyToInvalidate: ['employees'],
    successMessage: 'Funcionário adicionado com sucesso.',
    errorMessage: 'Erro ao criar funcionário',
    onMutate: async newEmployee => {
      await queryClient.cancelQueries({ queryKey: ['employees'] });
      const previousEmployees = queryClient.getQueryData(['employees']);

      const optimisticEmployeeId = `temp-${Date.now()}`;
      const optimisticEmployee = {
        id: optimisticEmployeeId,
        ...newEmployee,
        ceramic_id: 'temp',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      queryClient.setQueryData(['employees'], [optimisticEmployee, ...(previousEmployees as Employee[])]);

      return { previousEmployees, optimisticEmployeeId };
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['employees'], (old: Employee[] = []) =>
        old.map(employee => (employee.id === context?.optimisticEmployeeId ? data : employee))
      );
    },
    onError: (err, newEmployee, context) => {
      if (context?.previousEmployees) {
        queryClient.setQueryData(['employees'], context.previousEmployees);
      }
    },
  });
}

// Hook otimizado para atualizar funcionário
export function useUpdateEmployeeOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: ({ employeeId, payload }: { employeeId: string; payload: UpdateEmployeePayload }) =>
      EmployeesService.updateEmployee(employeeId, payload),
    queryKeyToInvalidate: ['employees'],
    successMessage: 'Dados do funcionário atualizados com sucesso.',
    errorMessage: 'Erro ao atualizar funcionário',
    onMutate: async ({ employeeId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['employees'] });
      const previousEmployees = queryClient.getQueryData(['employees']);
      if (previousEmployees) {
        queryClient.setQueryData(['employees'], (old: Employee[] = []) =>
          old?.map((employee: Employee) =>
            employee.id === employeeId ? { ...employee, ...payload, updated_at: new Date().toISOString() } : employee
          )
        );
      }
      return { previousEmployees };
    },
    onError: (err, _variables, context?: { previousEmployees: unknown }) => {
      if (context?.previousEmployees) {
        queryClient.setQueryData(['employees'], context.previousEmployees);
      }
    },
  });
}

// Hook otimizado para deletar funcionário
export function useDeleteEmployeeOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: (employeeId: string) => EmployeesService.deleteEmployee(employeeId),
    queryKeyToInvalidate: ['employees'],
    successMessage: 'Funcionário removido com sucesso.',
    errorMessage: 'Erro ao excluir funcionário',
    onMutate: async employeeId => {
      await queryClient.cancelQueries({ queryKey: ['employees'] });
      const previousEmployees = queryClient.getQueryData(['employees']);
      if (previousEmployees) {
        queryClient.setQueryData(['employees'], (old: Employee[] = []) =>
          old?.filter((employee: Employee) => employee.id !== employeeId)
        );
      }
      return { previousEmployees };
    },
    onError: (err, employeeId, context?: { previousEmployees: unknown }) => {
      if (context?.previousEmployees) {
        queryClient.setQueryData(['employees'], context.previousEmployees);
      }
    },
  });
}
