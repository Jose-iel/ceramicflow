import { useQueryClient } from '@tanstack/react-query';

import { ClayConsumptionsService } from '../api';
import type { CreateClayConsumptionPayload, UpdateClayConsumptionPayload, ClayConsumption } from '../api';

import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { useEntityMutation } from '@/hooks/useEntityMutation';

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
  return useEntityMutation({
    mutationFn: (payload: CreateClayConsumptionPayload) => ClayConsumptionsService.createClayConsumption(payload),
    queryKeyToInvalidate: ['clay-consumptions'],
    successMessage: 'Consumo de barro adicionado com sucesso.',
    errorMessage: 'Erro ao criar consumo de barro',
    onMutate: async (newClayConsumption) => {
      await queryClient.cancelQueries({ queryKey: ['clay-consumptions'] });
      const previousClayConsumptions = queryClient.getQueryData(['clay-consumptions']);
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
    onError: (err, newClayConsumption, context?: { previousClayConsumptions: unknown }) => {
      if (context?.previousClayConsumptions) {
        queryClient.setQueryData(['clay-consumptions'], context.previousClayConsumptions);
      }
    },
  });
}

// Hook otimizado para atualizar consumo de barro
export function useUpdateClayConsumptionOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: ({ clayConsumptionId, payload }: { clayConsumptionId: string; payload: UpdateClayConsumptionPayload }) =>
      ClayConsumptionsService.updateClayConsumption(clayConsumptionId, payload),
    queryKeyToInvalidate: ['clay-consumptions'],
    successMessage: 'Consumo de barro atualizado com sucesso.',
    errorMessage: 'Erro ao atualizar consumo de barro',
    onMutate: async ({ clayConsumptionId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['clay-consumptions'] });
      const previousClayConsumptions = queryClient.getQueryData(['clay-consumptions']);
      if (previousClayConsumptions) {
        queryClient.setQueryData(['clay-consumptions'], (old: ClayConsumption[] = []) =>
          old?.map((clayConsumption: ClayConsumption) =>
            clayConsumption.id === clayConsumptionId
              ? { ...clayConsumption, ...payload, updated_at: new Date().toISOString() }
              : clayConsumption,
          ),
        );
      }
      return { previousClayConsumptions };
    },
    onError: (err, { clayConsumptionId: _clayConsumptionId }, context?: { previousClayConsumptions: unknown }) => {
      if (context?.previousClayConsumptions) {
        queryClient.setQueryData(['clay-consumptions'], context.previousClayConsumptions);
      }
    },
  });
}

// Hook otimizado para deletar consumo de barro
export function useDeleteClayConsumptionOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: (clayConsumptionId: string) => ClayConsumptionsService.deleteClayConsumption(clayConsumptionId),
    queryKeyToInvalidate: ['clay-consumptions'],
    successMessage: 'Consumo de barro removido com sucesso.',
    errorMessage: 'Erro ao excluir consumo de barro',
    onMutate: async (clayConsumptionId) => {
      await queryClient.cancelQueries({ queryKey: ['clay-consumptions'] });
      const previousClayConsumptions = queryClient.getQueryData(['clay-consumptions']);
      if (previousClayConsumptions) {
        queryClient.setQueryData(['clay-consumptions'], (old: ClayConsumption[] = []) =>
          old?.filter((clayConsumption: ClayConsumption) => clayConsumption.id !== clayConsumptionId),
        );
      }
      return { previousClayConsumptions };
    },
    onError: (err, clayConsumptionId, context?: { previousClayConsumptions: unknown }) => {
      if (context?.previousClayConsumptions) {
        queryClient.setQueryData(['clay-consumptions'], context.previousClayConsumptions);
      }
    },
  });
}
