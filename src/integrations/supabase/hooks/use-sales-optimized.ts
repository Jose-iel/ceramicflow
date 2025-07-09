
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SalesService } from '../api/sales';
import type { CreateSalePayload, UpdateSalePayload } from '../api/sales';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { invalidateRelatedQueries, updateCacheOptimistically } from '@/lib/queryClient';

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
export function useSalesStatsOptimized() {
  return useOptimizedQuery({
    queryKey: ['salesStats'],
    queryFn: SalesService.getSalesStats,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

// Hook otimizado para criar venda
export function useCreateSaleOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateSalePayload) => SalesService.createSale(payload),
    onMutate: async (newSale) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['sales'] });
      await queryClient.cancelQueries({ queryKey: ['salesStats'] });

      // Snapshot dos dados atuais
      const previousSales = queryClient.getQueryData(['sales']);
      const previousStats = queryClient.getQueryData(['salesStats']);

      // Atualização otimista da lista de vendas
      if (previousSales) {
        const optimisticSale = {
          id: `temp-${Date.now()}`,
          ...newSale,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        queryClient.setQueryData(['sales'], (old: any) => [optimisticSale, ...old]);
      }

      return { previousSales, previousStats };
    },
    onError: (error: Error, newSale, context) => {
      // Reverter em caso de erro
      if (context?.previousSales) {
        queryClient.setQueryData(['sales'], context.previousSales);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(['salesStats'], context.previousStats);
      }
      toast({ 
        title: "Erro ao registrar venda", 
        description: error.message, 
        variant: "destructive" 
      });
    },
    onSuccess: () => {
      toast({ 
        title: "Venda registrada", 
        description: "Operação realizada com sucesso." 
      });
      // Invalidar apenas quando necessário
      invalidateRelatedQueries(queryClient, ['sales', 'salesStats']);
    },
  });
}

// Hook otimizado para atualizar venda
export function useUpdateSaleOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ saleId, payload }: { saleId: string; payload: UpdateSalePayload }) => 
      SalesService.updateSale(saleId, payload),
    onMutate: async ({ saleId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['sales'] });
      
      const previousSales = queryClient.getQueryData(['sales']);
      
      // Atualização otimista
      queryClient.setQueryData(['sales'], (old: any) => 
        old?.map((sale: any) => 
          sale.id === saleId 
            ? { ...sale, ...payload, updated_at: new Date().toISOString() }
            : sale
        )
      );

      return { previousSales };
    },
    onError: (error: Error, variables, context) => {
      if (context?.previousSales) {
        queryClient.setQueryData(['sales'], context.previousSales);
      }
      toast({ 
        title: "Erro ao atualizar venda", 
        description: error.message, 
        variant: "destructive" 
      });
    },
    onSuccess: () => {
      toast({ 
        title: "Venda atualizada", 
        description: "Operação realizada com sucesso." 
      });
      invalidateRelatedQueries(queryClient, ['sales', 'salesStats']);
    },
  });
}

// Hook otimizado para excluir venda
export function useDeleteSaleOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (saleId: string) => SalesService.deleteSale(saleId),
    onMutate: async (saleId) => {
      await queryClient.cancelQueries({ queryKey: ['sales'] });
      
      const previousSales = queryClient.getQueryData(['sales']);
      
      // Atualização otimista - remover da lista
      queryClient.setQueryData(['sales'], (old: any) => 
        old?.filter((sale: any) => sale.id !== saleId)
      );

      return { previousSales };
    },
    onError: (error: Error, saleId, context) => {
      if (context?.previousSales) {
        queryClient.setQueryData(['sales'], context.previousSales);
      }
      toast({ 
        title: "Erro ao excluir venda", 
        description: error.message, 
        variant: "destructive" 
      });
    },
    onSuccess: () => {
      toast({ title: "Venda excluída com sucesso" });
      invalidateRelatedQueries(queryClient, ['sales', 'salesStats']);
    },
  });
}
