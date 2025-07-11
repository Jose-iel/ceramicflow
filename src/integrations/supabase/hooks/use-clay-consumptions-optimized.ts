import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ClayConsumptionsService } from '../api';
import type { CreateClayConsumptionPayload, UpdateClayConsumptionPayload, ClayConsumption } from '../api';

import { useToast } from '@/hooks/use-toast';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';

// Hook otimizado para listar consumos de barro
export function useClayConsumptionsOptimized() {
  return useOptimizedQuery({
    queryKey: ['clay-consumptions'],
    queryFn: ClayConsumptionsService.getAllClayConsumptions,
    staleTime: 3 * 60 * 1000, // 3 minutos - consumos de barro mudam com frequência moderada
    gcTime: 7 * 60 * 1000, // 7 minutos
  });
}

// Hook otimizado para criar consumo de barro
export function useCreateClayConsumptionOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateClayConsumptionPayload) => ClayConsumptionsService.createClayConsumption(payload),
    onMutate: async (newClayConsumption) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['clay-consumptions'] });

      // Snapshot dos dados atuais
      const previousClayConsumptions = queryClient.getQueryData(['clay-consumptions']);

      // Atualização otimista da lista de consumos de barro
      if (previousClayConsumptions) {
        const optimisticClayConsumption = {
          id: `temp-${Date.now()}`,
          ...newClayConsumption,
          ceramic_id: 'temp',
          date: newClayConsumption.date || new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        queryClient.setQueryData(['clay-consumptions'], [optimisticClayConsumption, ...(previousClayConsumptions as ClayConsumption[])]);
      }

      return { previousClayConsumptions };
    },
    onError: (err, newClayConsumption, context) => {
      // Reverter mudanças otimistas em caso de erro
      if (context?.previousClayConsumptions) {
        queryClient.setQueryData(['clay-consumptions'], context.previousClayConsumptions);
      }
      toast({
        title: 'Erro ao criar consumo de barro',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Consumo de barro criado',
        description: 'Consumo de barro adicionado com sucesso.',
      });
    },
    onSettled: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clay-consumptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}

// Hook otimizado para atualizar consumo de barro
export function useUpdateClayConsumptionOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ clayConsumptionId, payload }: { clayConsumptionId: string; payload: UpdateClayConsumptionPayload }) =>
      ClayConsumptionsService.updateClayConsumption(clayConsumptionId, payload),
    onMutate: async ({ clayConsumptionId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['clay-consumptions'] });

      const previousClayConsumptions = queryClient.getQueryData(['clay-consumptions']);

      // Atualização otimista
      if (previousClayConsumptions) {
        queryClient.setQueryData(['clay-consumptions'], (old: ClayConsumption[]) =>
          old?.map((clayConsumption: ClayConsumption) =>
            clayConsumption.id === clayConsumptionId
              ? { ...clayConsumption, ...payload, updated_at: new Date().toISOString() }
              : clayConsumption,
          ),
        );
      }

      return { previousClayConsumptions };
    },
    onError: (err, { clayConsumptionId: _clayConsumptionId }, context) => {
      if (context?.previousClayConsumptions) {
        queryClient.setQueryData(['clay-consumptions'], context.previousClayConsumptions);
      }
      toast({
        title: 'Erro ao atualizar consumo de barro',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Consumo de barro atualizado',
        description: 'Dados do consumo de barro atualizados com sucesso.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clay-consumptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}

// Hook otimizado para deletar consumo de barro
export function useDeleteClayConsumptionOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (clayConsumptionId: string) => ClayConsumptionsService.deleteClayConsumption(clayConsumptionId),
    onMutate: async (clayConsumptionId) => {
      await queryClient.cancelQueries({ queryKey: ['clay-consumptions'] });

      const previousClayConsumptions = queryClient.getQueryData(['clay-consumptions']);

      // Atualização otimista - remover da lista
      if (previousClayConsumptions) {
        queryClient.setQueryData(['clay-consumptions'], (old: ClayConsumption[]) =>
          old?.filter((clayConsumption: ClayConsumption) => clayConsumption.id !== clayConsumptionId),
        );
      }

      return { previousClayConsumptions };
    },
    onError: (err, clayConsumptionId, context) => {
      if (context?.previousClayConsumptions) {
        queryClient.setQueryData(['clay-consumptions'], context.previousClayConsumptions);
      }
      toast({
        title: 'Erro ao excluir consumo de barro',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Consumo de barro excluído',
        description: 'Consumo de barro removido com sucesso.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clay-consumptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}
