
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SalesService } from '../api/sales';
import type { CreateSalePayload, UpdateSalePayload } from '../api/sales';
import { useToast } from '@/hooks/use-toast';

export function useSales() {
  return useQuery({
    queryKey: ['sales'],
    queryFn: SalesService.getAllSales,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useSalesStats() {
  return useQuery({
    queryKey: ['salesStats'],
    queryFn: SalesService.getSalesStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateSalePayload) => SalesService.createSale(payload),
    onSuccess: () => {
      toast({ title: "Venda registrada", description: "Operação realizada com sucesso." });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['salesStats'] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao registrar venda", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateSale() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ saleId, payload }: { saleId: string; payload: UpdateSalePayload }) => 
      SalesService.updateSale(saleId, payload),
    onSuccess: () => {
      toast({ title: "Venda atualizada", description: "Operação realizada com sucesso." });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['salesStats'] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao atualizar venda", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteSale() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (saleId: string) => SalesService.deleteSale(saleId),
    onSuccess: () => {
      toast({ title: "Venda excluída com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['salesStats'] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao excluir venda", description: error.message, variant: "destructive" });
    },
  });
}
