import { useQueryClient } from '@tanstack/react-query';

import { OperationsService } from '../api';
import type { CreateOperationPayload, UpdateOperationPayload, Operation } from '../api';

import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { useEntityMutation } from '@/hooks/useEntityMutation';

// Hook otimizado para listar operações
export function useOperationsOptimized() {
  return useOptimizedQuery({
    queryKey: ['operations'],
    queryFn: OperationsService.getAllOperations,
    staleTime: 2 * 60 * 1000, // 2 minutos - operações mudam com mais frequência
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook otimizado para criar operação
export function useCreateOperationOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: (payload: CreateOperationPayload) => OperationsService.createOperation(payload),
    queryKeyToInvalidate: ['operations'],
    successMessage: 'Operação registrada com sucesso.',
    errorMessage: 'Erro ao criar operação',
    onMutate: async (newOperation) => {
      await queryClient.cancelQueries({ queryKey: ['operations'] });
      const previousOperations = queryClient.getQueryData(['operations']);
      if (previousOperations) {
        const optimisticOperation = {
          id: `temp-${Date.now()}`,
          ...newOperation,
          ceramic_id: 'temp',
          status: newOperation.status || 'IN_PROGRESS',
          operation_type: newOperation.operation_type || 'manual',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        queryClient.setQueryData(['operations'], [optimisticOperation, ...(previousOperations as Operation[])]);
      }
      return { previousOperations };
    },
    onError: (err, newOperation, context?: { previousOperations: unknown }) => {
      if (context?.previousOperations) {
        queryClient.setQueryData(['operations'], context.previousOperations);
      }
    },
  });
}

// Hook otimizado para atualizar operação
export function useUpdateOperationOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: ({ operationId, payload }: { operationId: string; payload: UpdateOperationPayload }) =>
      OperationsService.updateOperation(operationId, payload),
    queryKeyToInvalidate: ['operations'],
    successMessage: 'Operação atualizada com sucesso.',
    errorMessage: 'Erro ao atualizar operação',
    onMutate: async ({ operationId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['operations'] });
      const previousOperations = queryClient.getQueryData(['operations']);
      if (previousOperations) {
        queryClient.setQueryData(['operations'], (old: Operation[] = []) =>
          old?.map((operation: Operation) =>
            operation.id === operationId
              ? { ...operation, ...payload, updated_at: new Date().toISOString() }
              : operation,
          ),
        );
      }
      return { previousOperations };
    },
    onError: (err, { operationId: _operationId }, context?: { previousOperations: unknown }) => {
      if (context?.previousOperations) {
        queryClient.setQueryData(['operations'], context.previousOperations);
      }
    },
  });
}

// Hook otimizado para deletar operação
export function useDeleteOperationOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: (operationId: string) => OperationsService.deleteOperation(operationId),
    queryKeyToInvalidate: ['operations'],
    successMessage: 'Operação removida com sucesso.',
    errorMessage: 'Erro ao excluir operação',
    onMutate: async (operationId) => {
      await queryClient.cancelQueries({ queryKey: ['operations'] });
      const previousOperations = queryClient.getQueryData(['operations']);
      if (previousOperations) {
        queryClient.setQueryData(['operations'], (old: Operation[] = []) =>
          old?.filter((operation: Operation) => operation.id !== operationId),
        );
      }
      return { previousOperations };
    },
    onError: (err, operationId, context?: { previousOperations: unknown }) => {
      if (context?.previousOperations) {
        queryClient.setQueryData(['operations'], context.previousOperations);
      }
    },
  });
}
