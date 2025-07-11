import { useMutation, useQueryClient } from '@tanstack/react-query';

import { OperationsService } from '../api';
import type { CreateOperationPayload, UpdateOperationPayload, Operation } from '../api';

import { useToast } from '@/hooks/use-toast';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';

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
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateOperationPayload) => OperationsService.createOperation(payload),
    onMutate: async (newOperation) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['operations'] });

      // Snapshot dos dados atuais
      const previousOperations = queryClient.getQueryData(['operations']);

      // Atualização otimista da lista de operações
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
    onError: (err, newOperation, context) => {
      // Reverter mudanças otimistas em caso de erro
      if (context?.previousOperations) {
        queryClient.setQueryData(['operations'], context.previousOperations);
      }
      toast({
        title: 'Erro ao criar operação',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Operação criada',
        description: 'Operação adicionada com sucesso.',
      });
    },
    onSettled: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}

// Hook otimizado para atualizar operação
export function useUpdateOperationOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ operationId, payload }: { operationId: string; payload: UpdateOperationPayload }) =>
      OperationsService.updateOperation(operationId, payload),
    onMutate: async ({ operationId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['operations'] });

      const previousOperations = queryClient.getQueryData(['operations']);

      // Atualização otimista
      if (previousOperations) {
        queryClient.setQueryData(['operations'], (old: Operation[]) =>
          old?.map((operation: Operation) =>
            operation.id === operationId
              ? { ...operation, ...payload, updated_at: new Date().toISOString() }
              : operation,
          ),
        );
      }

      return { previousOperations };
    },
    onError: (err, { operationId: _operationId }, context) => {
      if (context?.previousOperations) {
        queryClient.setQueryData(['operations'], context.previousOperations);
      }
      toast({
        title: 'Erro ao atualizar operação',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Operação atualizada',
        description: 'Dados da operação atualizados com sucesso.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}

// Hook otimizado para deletar operação
export function useDeleteOperationOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (operationId: string) => OperationsService.deleteOperation(operationId),
    onMutate: async (operationId) => {
      await queryClient.cancelQueries({ queryKey: ['operations'] });

      const previousOperations = queryClient.getQueryData(['operations']);

      // Atualização otimista - remover da lista
      if (previousOperations) {
        queryClient.setQueryData(['operations'], (old: Operation[]) =>
          old?.filter((operation: Operation) => operation.id !== operationId),
        );
      }

      return { previousOperations };
    },
    onError: (err, operationId, context) => {
      if (context?.previousOperations) {
        queryClient.setQueryData(['operations'], context.previousOperations);
      }
      toast({
        title: 'Erro ao excluir operação',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Operação excluída',
        description: 'Operação removida com sucesso.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}
