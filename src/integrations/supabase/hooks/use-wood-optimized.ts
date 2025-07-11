import { useQuery } from '@tanstack/react-query';

import { WoodService } from '../api/wood';
import type { CreateWoodPurchasePayload, UpdateWoodPurchasePayload, CreateWoodConsumptionPayload, UpdateWoodConsumptionPayload } from '../api/wood';
import { useEntityMutation } from '@/hooks/useEntityMutation';

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
  return useEntityMutation<void, Error, CreateWoodPurchasePayload>({
    mutationFn: (payload) => WoodService.createWoodPurchase(payload),
    queryKeyToInvalidate: ['wood-purchases'],
    successMessage: 'Compra de lenha criada com sucesso!',
    errorMessage: 'Erro ao criar compra',
  });
}

// Hook para atualizar compra de lenha
export function useUpdateWoodPurchaseOptimized() {
  return useEntityMutation<void, Error, { purchaseId: string; payload: UpdateWoodPurchasePayload }>({
    mutationFn: ({ purchaseId, payload }) => WoodService.updateWoodPurchase(purchaseId, payload),
    queryKeyToInvalidate: ['wood-purchases'],
    successMessage: 'Compra de lenha atualizada com sucesso!',
    errorMessage: 'Erro ao atualizar compra',
  });
}

// Hook para excluir compra de lenha
export function useDeleteWoodPurchaseOptimized() {
  return useEntityMutation<void, Error, string>({
    mutationFn: (purchaseId) => WoodService.deleteWoodPurchase(purchaseId),
    queryKeyToInvalidate: ['wood-purchases'],
    successMessage: 'Compra de lenha excluída com sucesso!',
    errorMessage: 'Erro ao excluir compra',
  });
}

// Hook para criar consumo de lenha
export function useCreateWoodConsumptionOptimized() {
  return useEntityMutation<void, Error, CreateWoodConsumptionPayload>({
    mutationFn: (payload) => WoodService.createWoodConsumption(payload),
    queryKeyToInvalidate: ['wood-consumptions'],
    successMessage: 'Consumo de lenha registrado com sucesso!',
    errorMessage: 'Erro ao registrar consumo',
  });
}

// Hook para atualizar consumo de lenha
export function useUpdateWoodConsumptionOptimized() {
  return useEntityMutation<void, Error, { consumptionId: string; payload: UpdateWoodConsumptionPayload }>({
    mutationFn: ({ consumptionId, payload }) => WoodService.updateWoodConsumption(consumptionId, payload),
    queryKeyToInvalidate: ['wood-consumptions'],
    successMessage: 'Consumo de lenha atualizado com sucesso!',
    errorMessage: 'Erro ao atualizar consumo',
  });
}

// Hook para excluir consumo de lenha
export function useDeleteWoodConsumptionOptimized() {
  return useEntityMutation<void, Error, string>({
    mutationFn: (consumptionId) => WoodService.deleteWoodConsumption(consumptionId),
    queryKeyToInvalidate: ['wood-consumptions'],
    successMessage: 'Consumo de lenha excluído com sucesso!',
    errorMessage: 'Erro ao excluir consumo',
  });
}
