import { useQueryClient } from '@tanstack/react-query';

import { MaintenancesService } from '../api';
import type { CreateMaintenancePayload, UpdateMaintenancePayload, Maintenance } from '../api';

import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { useEntityMutation } from '@/hooks/useEntityMutation';

// Hook otimizado para listar manutenções
export function useMaintenancesOptimized() {
  return useOptimizedQuery({
    queryKey: ['maintenances'],
    queryFn: MaintenancesService.getAllMaintenances,
    staleTime: 5 * 60 * 1000, // 5 minutos - manutenções não mudam com muita frequência
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook otimizado para criar manutenção
export function useCreateMaintenanceOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: (payload: CreateMaintenancePayload) => MaintenancesService.createMaintenance(payload),
    queryKeyToInvalidate: ['maintenances'],
    successMessage: 'Manutenção adicionada com sucesso.',
    errorMessage: 'Erro ao criar manutenção',
    onMutate: async newMaintenance => {
      await queryClient.cancelQueries({ queryKey: ['maintenances'] });
      const previousMaintenances = queryClient.getQueryData(['maintenances']);

      const optimisticMaintenanceId = `temp-${Date.now()}`;
      const optimisticMaintenance = {
        id: optimisticMaintenanceId,
        ...newMaintenance,
        ceramic_id: 'temp',
        status: newMaintenance.status || 'WAITING',
        reported_date: newMaintenance.reported_date || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      queryClient.setQueryData(['maintenances'], [optimisticMaintenance, ...(previousMaintenances as Maintenance[])]);

      return { previousMaintenances, optimisticMaintenanceId };
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['maintenances'], (old: Maintenance[] = []) =>
        old.map(maintenance => (maintenance.id === context?.optimisticMaintenanceId ? data : maintenance))
      );
    },
    onError: (err, newMaintenance, context) => {
      if (context?.previousMaintenances) {
        queryClient.setQueryData(['maintenances'], context.previousMaintenances);
      }
    },
  });
}

// Hook otimizado para atualizar manutenção
export function useUpdateMaintenanceOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: ({ maintenanceId, payload }: { maintenanceId: string; payload: UpdateMaintenancePayload }) =>
      MaintenancesService.updateMaintenance(maintenanceId, payload),
    queryKeyToInvalidate: ['maintenances'],
    successMessage: 'Dados da manutenção atualizados com sucesso.',
    errorMessage: 'Erro ao atualizar manutenção',
    onMutate: async ({ maintenanceId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['maintenances'] });
      const previousMaintenances = queryClient.getQueryData(['maintenances']);
      if (previousMaintenances) {
        queryClient.setQueryData(['maintenances'], (old: Maintenance[] = []) =>
          old?.map((maintenance: Maintenance) =>
            maintenance.id === maintenanceId ? { ...maintenance, ...payload, updated_at: new Date().toISOString() } : maintenance
          )
        );
      }
      return { previousMaintenances };
    },
    onError: (err, _variables, context?: { previousMaintenances: unknown }) => {
      if (context?.previousMaintenances) {
        queryClient.setQueryData(['maintenances'], context.previousMaintenances);
      }
    },
  });
}

// Hook otimizado para deletar manutenção
export function useDeleteMaintenanceOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: (maintenanceId: string) => MaintenancesService.deleteMaintenance(maintenanceId),
    queryKeyToInvalidate: ['maintenances'],
    successMessage: 'Manutenção removida com sucesso.',
    errorMessage: 'Erro ao excluir manutenção',
    onMutate: async maintenanceId => {
      await queryClient.cancelQueries({ queryKey: ['maintenances'] });
      const previousMaintenances = queryClient.getQueryData(['maintenances']);
      if (previousMaintenances) {
        queryClient.setQueryData(['maintenances'], (old: Maintenance[] = []) =>
          old?.filter((maintenance: Maintenance) => maintenance.id !== maintenanceId)
        );
      }
      return { previousMaintenances };
    },
    onError: (err, maintenanceId, context?: { previousMaintenances: unknown }) => {
      if (context?.previousMaintenances) {
        queryClient.setQueryData(['maintenances'], context.previousMaintenances);
      }
    },
  });
}
