import { useQueryClient } from '@tanstack/react-query';

import { SalesService } from '../api/sales';
import type { CreateSalePayload, UpdateSalePayload, Sale } from '../api/sales';

import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { useEntityMutation } from '@/hooks/useEntityMutation';

// Hook otimizado para listar vendas
export function useSalesOptimized() {
  return useOptimizedQuery({
    queryKey: ['sales'],
    queryFn: SalesService.getAllSales,
    staleTime: 15 * 60 * 1000, // 15 minutos - dados de vendas não mudam frequentemente
    gcTime: 20 * 60 * 1000, // 20 minutos
  });
}

// Hook otimizado para estatísticas de vendas
export function useSalesStatsOptimized(selectedMonth?: string, enabled = true) {
  return useOptimizedQuery({
    queryKey: ['salesStats', selectedMonth],
    queryFn: () => selectedMonth
      ? SalesService.getSalesStatsByMonth(selectedMonth)
      : SalesService.getSalesStats(),
    staleTime: 2 * 60 * 1000, // 2 minutos - mais reativo
    gcTime: 5 * 60 * 1000, // 5 minutos
    enabled,
  });
}

// Hook otimizado para criar venda
export function useCreateSaleOptimized() {
  const queryClient = useQueryClient();

  return useEntityMutation({
    mutationFn: (payload: CreateSalePayload) => SalesService.createSale(payload),
    queryKeyToInvalidate: ['sales', 'salesStats'],
    successMessage: 'Venda registrada com sucesso.',
    errorMessage: 'Erro ao registrar venda',
    onMutate: async (newSale) => {
      await queryClient.cancelQueries({ queryKey: ['sales'] });
      const previousSales = queryClient.getQueryData(['sales']);
      if (previousSales) {
        const optimisticSale = {
          id: `temp-${Date.now()}`,
          ...newSale,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        queryClient.setQueryData(['sales'], (old: Sale[] = []) => [optimisticSale, ...old]);
      }
      return { previousSales };
    },
    onError: (error, newSale, context?: { previousSales: unknown }) => {
      if (context?.previousSales) {
        queryClient.setQueryData(['sales'], context.previousSales);
      }
    },
  });
}

// Hook otimizado para atualizar venda
export function useUpdateSaleOptimized() {
  const queryClient = useQueryClient();

  return useEntityMutation({
    mutationFn: ({ saleId, payload }: { saleId: string; payload: UpdateSalePayload }) =>
      SalesService.updateSale(saleId, payload),
    queryKeyToInvalidate: ['sales', 'salesStats'],
    successMessage: 'Venda atualizada com sucesso.',
    errorMessage: 'Erro ao atualizar venda',
    onMutate: async ({ saleId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['sales'] });
      const previousSales = queryClient.getQueryData(['sales']);
      queryClient.setQueryData(['sales'], (old: Sale[] = []) =>
        old?.map((sale: Sale) =>
          sale.id === saleId
            ? { ...sale, ...payload, updated_at: new Date().toISOString() }
            : sale,
        ),
      );
      return { previousSales };
    },
    onError: (error, variables, context?: { previousSales: unknown }) => {
      if (context?.previousSales) {
        queryClient.setQueryData(['sales'], context.previousSales);
      }
    },
  });
}

// Hook otimizado para excluir venda
export function useDeleteSaleOptimized() {
  const queryClient = useQueryClient();

  return useEntityMutation({
    mutationFn: (saleId: string) => SalesService.deleteSale(saleId),
    queryKeyToInvalidate: ['sales', 'salesStats'],
    successMessage: 'Venda excluída com sucesso.',
    errorMessage: 'Erro ao excluir venda',
    onMutate: async (saleId) => {
      await queryClient.cancelQueries({ queryKey: ['sales'] });
      const previousSales = queryClient.getQueryData(['sales']);
      queryClient.setQueryData(['sales'], (old: Sale[] = []) =>
        old?.filter((sale: Sale) => sale.id !== saleId),
      );
      return { previousSales };
    },
    onError: (error, saleId, context?: { previousSales: unknown }) => {
      if (context?.previousSales) {
        queryClient.setQueryData(['sales'], context.previousSales);
      }
    },
  });
}
