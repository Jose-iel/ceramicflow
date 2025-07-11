import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MaintenancesService } from '../api';
import type { CreateMaintenancePayload, UpdateMaintenancePayload, Maintenance } from '../api';

import { useToast } from '@/hooks/use-toast';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';

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
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateMaintenancePayload) => MaintenancesService.createMaintenance(payload),
    onMutate: async (newMaintenance) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['maintenances'] });

      // Snapshot dos dados atuais
      const previousMaintenances = queryClient.getQueryData(['maintenances']);

      // Atualização otimista da lista de manutenções
      if (previousMaintenances) {
        const optimisticMaintenance = {
          id: `temp-${Date.now()}`,
          ...newMaintenance,
          ceramic_id: 'temp',
          status: newMaintenance.status || 'WAITING',
          reported_date: newMaintenance.reported_date || new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        queryClient.setQueryData(['maintenances'], [optimisticMaintenance, ...(previousMaintenances as Maintenance[])]);
      }

      return { previousMaintenances };
    },
    onError: (err, newMaintenance, context) => {
      // Reverter mudanças otimistas em caso de erro
      if (context?.previousMaintenances) {
        queryClient.setQueryData(['maintenances'], context.previousMaintenances);
      }
      toast({
        title: 'Erro ao criar manutenção',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Manutenção criada',
        description: 'Manutenção adicionada com sucesso.',
      });
    },
    onSettled: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}

// Hook otimizado para atualizar manutenção
export function useUpdateMaintenanceOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ maintenanceId, payload }: { maintenanceId: string; payload: UpdateMaintenancePayload }) =>
      MaintenancesService.updateMaintenance(maintenanceId, payload),
    onMutate: async ({ maintenanceId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['maintenances'] });

      const previousMaintenances = queryClient.getQueryData(['maintenances']);

      // Atualização otimista
      if (previousMaintenances) {
        queryClient.setQueryData(['maintenances'], (old: Maintenance[]) =>
          old?.map((maintenance: Maintenance) =>
            maintenance.id === maintenanceId
              ? { ...maintenance, ...payload, updated_at: new Date().toISOString() }
              : maintenance,
          ),
        );
      }

      return { previousMaintenances };
    },
    onError: (err, { maintenanceId: _maintenanceId }, context) => {
      if (context?.previousMaintenances) {
        queryClient.setQueryData(['maintenances'], context.previousMaintenances);
      }
      toast({
        title: 'Erro ao atualizar manutenção',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Manutenção atualizada',
        description: 'Dados da manutenção atualizados com sucesso.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}

// Hook otimizado para deletar manutenção
export function useDeleteMaintenanceOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (maintenanceId: string) => MaintenancesService.deleteMaintenance(maintenanceId),
    onMutate: async (maintenanceId) => {
      await queryClient.cancelQueries({ queryKey: ['maintenances'] });

      const previousMaintenances = queryClient.getQueryData(['maintenances']);

      // Atualização otimista - remover da lista
      if (previousMaintenances) {
        queryClient.setQueryData(['maintenances'], (old: Maintenance[]) =>
          old?.filter((maintenance: Maintenance) => maintenance.id !== maintenanceId),
        );
      }

      return { previousMaintenances };
    },
    onError: (err, maintenanceId, context) => {
      if (context?.previousMaintenances) {
        queryClient.setQueryData(['maintenances'], context.previousMaintenances);
      }
      toast({
        title: 'Erro ao excluir manutenção',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Manutenção excluída',
        description: 'Manutenção removida com sucesso.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}
