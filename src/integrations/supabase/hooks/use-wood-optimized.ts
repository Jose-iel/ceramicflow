import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WoodService } from '../api/wood';
import type { CreateWoodPurchasePayload, UpdateWoodPurchasePayload, CreateWoodConsumptionPayload, UpdateWoodConsumptionPayload } from '../api/wood';
import { useToast } from '@/hooks/use-toast';

// Hook para listar compras de lenha
export function useWoodPurchasesOptimized() {
  return useQuery({
    queryKey: ['wood-purchases'],
    queryFn: WoodService.getAllWoodPurchases,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para listar consumos de lenha
export function useWoodConsumptionsOptimized() {
  return useQuery({
    queryKey: ['wood-consumptions'],
    queryFn: WoodService.getAllWoodConsumptions,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para criar compra de lenha
export function useCreateWoodPurchaseOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateWoodPurchasePayload) => WoodService.createWoodPurchase(payload),
    onSuccess: () => {
      toast({ title: "Compra de lenha criada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['wood-purchases'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao criar compra", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

// Hook para atualizar compra de lenha
export function useUpdateWoodPurchaseOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ purchaseId, payload }: { purchaseId: string; payload: UpdateWoodPurchasePayload }) =>
      WoodService.updateWoodPurchase(purchaseId, payload),
    onSuccess: () => {
      toast({ title: "Compra de lenha atualizada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['wood-purchases'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao atualizar compra", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

// Hook para excluir compra de lenha
export function useDeleteWoodPurchaseOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (purchaseId: string) => WoodService.deleteWoodPurchase(purchaseId),
    onSuccess: () => {
      toast({ title: "Compra de lenha excluída com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['wood-purchases'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao excluir compra", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

// Hook para criar consumo de lenha
export function useCreateWoodConsumptionOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateWoodConsumptionPayload) => WoodService.createWoodConsumption(payload),
    onSuccess: () => {
      toast({ title: "Consumo de lenha registrado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['wood-consumptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao registrar consumo", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

// Hook para atualizar consumo de lenha
export function useUpdateWoodConsumptionOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ consumptionId, payload }: { consumptionId: string; payload: UpdateWoodConsumptionPayload }) =>
      WoodService.updateWoodConsumption(consumptionId, payload),
    onSuccess: () => {
      toast({ title: "Consumo de lenha atualizado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['wood-consumptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao atualizar consumo", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

// Hook para excluir consumo de lenha
export function useDeleteWoodConsumptionOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (consumptionId: string) => WoodService.deleteWoodConsumption(consumptionId),
    onSuccess: () => {
      toast({ title: "Consumo de lenha excluído com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['wood-consumptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao excluir consumo", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}
