import { useQueryClient } from '@tanstack/react-query';

import {
  EmployeeAbsencesService,
  type EmployeeAbsence,
  type CreateEmployeeAbsencePayload,
  type UpdateEmployeeAbsencePayload,
} from '@/integrations/supabase/api/employee-absences';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { useEntityMutation } from '@/hooks/useEntityMutation';

// Hook otimizado para buscar faltas de um funcionário específico
export function useEmployeeAbsences(employeeId: string | null) {
  return useOptimizedQuery({
    queryKey: ['employee-absences', employeeId],
    queryFn: () => (employeeId ? EmployeeAbsencesService.getEmployeeAbsences(employeeId) : Promise.resolve([])),
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutos - dados de faltas podem ser atualizados frequentemente
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook otimizado para buscar todas as faltas (relatórios)
export function useAllEmployeeAbsences() {
  return useOptimizedQuery({
    queryKey: ['employee-absences', 'all'],
    queryFn: EmployeeAbsencesService.getAllAbsences,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook otimizado para buscar uma falta específica por ID
export function useEmployeeAbsenceById(id: string | null) {
  return useOptimizedQuery({
    queryKey: ['employee-absence', id],
    queryFn: () => (id ? EmployeeAbsencesService.getAbsenceById(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos - dados específicos mudam menos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

// Hook otimizado para buscar faltas por período
export function useEmployeeAbsencesByPeriod(startDate: string, endDate: string, employeeId?: string) {
  return useOptimizedQuery({
    queryKey: ['employee-absences', 'period', startDate, endDate, employeeId],
    queryFn: () => EmployeeAbsencesService.getAbsencesByPeriod(startDate, endDate, employeeId),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook otimizado para criar falta
export function useCreateEmployeeAbsence() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: (payload: CreateEmployeeAbsencePayload) =>
      EmployeeAbsencesService.createAbsence({
        ...payload,
        employee_id: payload.employee_id,
        absence_date: payload.absence_date,
        reason: payload.reason,
        notes: payload.notes,
      }),
    queryKeyToInvalidate: ['employee-absences'],
    successMessage: 'Falta registrada com sucesso.',
    errorMessage: 'Erro ao registrar falta',
    onMutate: async newAbsence => {
      // Cancelar queries relacionadas
      await queryClient.cancelQueries({ queryKey: ['employee-absences'] });

      // Buscar dados anteriores
      const previousEmployeeAbsences = queryClient.getQueryData(['employee-absences', newAbsence.employee_id]);
      const previousAllAbsences = queryClient.getQueryData(['employee-absences', 'all']);

      // Criar absence otimista
      const optimisticAbsenceId = `temp-${Date.now()}`;
      const optimisticAbsence: EmployeeAbsence = {
        id: optimisticAbsenceId,
        employee_id: newAbsence.employee_id,
        ceramic_id: 'temp',
        absence_date: newAbsence.absence_date,
        reason: newAbsence.reason,
        notes: newAbsence.notes,
        created_at: new Date().toISOString(),
      };

      // Atualizar cache otimisticamente
      if (previousEmployeeAbsences) {
        queryClient.setQueryData(
          ['employee-absences', newAbsence.employee_id],
          [optimisticAbsence, ...(previousEmployeeAbsences as EmployeeAbsence[])]
        );
      }

      if (previousAllAbsences) {
        queryClient.setQueryData(
          ['employee-absences', 'all'],
          [optimisticAbsence, ...(previousAllAbsences as EmployeeAbsence[])]
        );
      }

      return { previousEmployeeAbsences, previousAllAbsences, optimisticAbsenceId, employeeId: newAbsence.employee_id };
    },
    onSuccess: (data, variables, context) => {
      // Substituir dados otimistas pelos dados reais
      if (context?.optimisticAbsenceId) {
        queryClient.setQueryData(['employee-absences', context.employeeId], (old: EmployeeAbsence[] = []) =>
          old.map(absence => (absence.id === context.optimisticAbsenceId ? data : absence))
        );

        queryClient.setQueryData(['employee-absences', 'all'], (old: EmployeeAbsence[] = []) =>
          old.map(absence => (absence.id === context.optimisticAbsenceId ? data : absence))
        );
      }
    },
    onError: (err, variables, context) => {
      // Reverter para dados anteriores em caso de erro
      if (context?.previousEmployeeAbsences) {
        queryClient.setQueryData(['employee-absences', context.employeeId], context.previousEmployeeAbsences);
      }
      if (context?.previousAllAbsences) {
        queryClient.setQueryData(['employee-absences', 'all'], context.previousAllAbsences);
      }
    },
  });
}

// Hook otimizado para atualizar falta
export function useUpdateEmployeeAbsence() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: ({ absenceId, payload }: { absenceId: string; payload: UpdateEmployeeAbsencePayload }) =>
      EmployeeAbsencesService.updateAbsence(absenceId, payload),
    queryKeyToInvalidate: ['employee-absences'],
    successMessage: 'Falta atualizada com sucesso.',
    errorMessage: 'Erro ao atualizar falta',
    onMutate: async ({ absenceId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['employee-absences'] });

      // Buscar dados anteriores de todas as queries relacionadas
      const queryCache = queryClient.getQueryCache();
      const previousData: Record<string, unknown> = {};

      queryCache.findAll({ queryKey: ['employee-absences'] }).forEach(query => {
        const key = JSON.stringify(query.queryKey);
        previousData[key] = query.state.data;

        // Atualizar dados otimisticamente
        if (query.state.data) {
          const updatedData = (query.state.data as EmployeeAbsence[]).map((absence: EmployeeAbsence) =>
            absence.id === absenceId ? { ...absence, ...payload, updated_at: new Date().toISOString() } : absence
          );
          queryClient.setQueryData(query.queryKey, updatedData);
        }
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // Reverter todas as queries relacionadas
      if (context?.previousData) {
        Object.entries(context.previousData).forEach(([key, data]) => {
          const queryKey = JSON.parse(key);
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
}

// Hook otimizado para deletar falta
export function useDeleteEmployeeAbsence() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: (absenceId: string) => EmployeeAbsencesService.deleteAbsence(absenceId),
    queryKeyToInvalidate: ['employee-absences'],
    successMessage: 'Falta removida com sucesso.',
    errorMessage: 'Erro ao excluir falta',
    onMutate: async absenceId => {
      await queryClient.cancelQueries({ queryKey: ['employee-absences'] });

      // Buscar dados anteriores de todas as queries relacionadas
      const queryCache = queryClient.getQueryCache();
      const previousData: Record<string, unknown> = {};

      queryCache.findAll({ queryKey: ['employee-absences'] }).forEach(query => {
        const key = JSON.stringify(query.queryKey);
        previousData[key] = query.state.data;

        // Remover absence otimisticamente
        if (query.state.data) {
          const filteredData = (query.state.data as EmployeeAbsence[]).filter(
            (absence: EmployeeAbsence) => absence.id !== absenceId
          );
          queryClient.setQueryData(query.queryKey, filteredData);
        }
      });

      return { previousData };
    },
    onError: (err, absenceId, context) => {
      // Reverter todas as queries relacionadas
      if (context?.previousData) {
        Object.entries(context.previousData).forEach(([key, data]) => {
          const queryKey = JSON.parse(key);
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
}

// Hook utilitário para verificar se uma falta existe
export function useCheckAbsenceExists() {
  return useEntityMutation({
    mutationFn: ({ employeeId, absenceDate }: { employeeId: string; absenceDate: string }) =>
      EmployeeAbsencesService.checkAbsenceExists(employeeId, absenceDate),
    queryKeyToInvalidate: [], // Não invalida nenhuma query específica
    successMessage: '',
    errorMessage: 'Erro ao verificar existência da falta',
  });
}
