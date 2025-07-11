import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EmployeesService } from '../api';
import type { CreateEmployeePayload, UpdateEmployeePayload, Employee } from '../api';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';

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
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => EmployeesService.createEmployee(payload),
    onMutate: async (newEmployee) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['employees'] });

      // Snapshot dos dados atuais
      const previousEmployees = queryClient.getQueryData(['employees']);

      // Atualização otimista da lista de funcionários
      if (previousEmployees) {
        const optimisticEmployee = {
          id: `temp-${Date.now()}`,
          ...newEmployee,
          ceramic_id: 'temp',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        queryClient.setQueryData(['employees'], [optimisticEmployee, ...(previousEmployees as Employee[])]);
      }

      return { previousEmployees };
    },
    onError: (err, newEmployee, context) => {
      // Reverter mudanças otimistas em caso de erro
      if (context?.previousEmployees) {
        queryClient.setQueryData(['employees'], context.previousEmployees);
      }
      toast({
        title: "Erro ao criar funcionário",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Funcionário criado",
        description: "Funcionário adicionado com sucesso.",
      });
    },
    onSettled: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}

// Hook otimizado para atualizar funcionário
export function useUpdateEmployeeOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ employeeId, payload }: { employeeId: string; payload: UpdateEmployeePayload }) =>
      EmployeesService.updateEmployee(employeeId, payload),
    onMutate: async ({ employeeId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['employees'] });

      const previousEmployees = queryClient.getQueryData(['employees']);

      // Atualização otimista
      if (previousEmployees) {
        queryClient.setQueryData(['employees'], (old: Employee[]) =>
          old?.map((employee: Employee) =>
            employee.id === employeeId
              ? { ...employee, ...payload, updated_at: new Date().toISOString() }
              : employee
          )
        );
      }

      return { previousEmployees };
    },
    onError: (err, { employeeId }, context) => {
      if (context?.previousEmployees) {
        queryClient.setQueryData(['employees'], context.previousEmployees);
      }
      toast({
        title: "Erro ao atualizar funcionário",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Funcionário atualizado",
        description: "Dados do funcionário atualizados com sucesso.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}

// Hook otimizado para deletar funcionário
export function useDeleteEmployeeOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (employeeId: string) => EmployeesService.deleteEmployee(employeeId),
    onMutate: async (employeeId) => {
      await queryClient.cancelQueries({ queryKey: ['employees'] });

      const previousEmployees = queryClient.getQueryData(['employees']);

      // Atualização otimista - remover da lista
      if (previousEmployees) {
        queryClient.setQueryData(['employees'], (old: Employee[]) =>
          old?.filter((employee: Employee) => employee.id !== employeeId)
        );
      }

      return { previousEmployees };
    },
    onError: (err, employeeId, context) => {
      if (context?.previousEmployees) {
        queryClient.setQueryData(['employees'], context.previousEmployees);
      }
      toast({
        title: "Erro ao excluir funcionário",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Funcionário excluído",
        description: "Funcionário removido com sucesso.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}
