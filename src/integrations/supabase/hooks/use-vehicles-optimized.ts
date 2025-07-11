import { useMutation, useQueryClient } from '@tanstack/react-query';

import { VehiclesService } from '../api';
import type { CreateVehiclePayload, UpdateVehiclePayload, Vehicle } from '../api';

import { useToast } from '@/hooks/use-toast';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';

type TruckData = Pick<Vehicle, 'id' | 'model' | 'type'>;

// Hook otimizado para listar veículos
export function useVehiclesOptimized() {
  return useOptimizedQuery({
    queryKey: ['vehicles'],
    queryFn: VehiclesService.getAllVehicles,
    staleTime: 5 * 60 * 1000, // 5 minutos - dados de veículos não mudam com frequência
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook otimizado para listar caminhões
export function useTrucksOptimized() {
  return useOptimizedQuery({
    queryKey: ['trucks'],
    queryFn: VehiclesService.getTrucks,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook otimizado para criar veículo
export function useCreateVehicleOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateVehiclePayload) => VehiclesService.createVehicle(payload),
    onMutate: async (newVehicle) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      await queryClient.cancelQueries({ queryKey: ['trucks'] });

      // Snapshot dos dados atuais
      const previousVehicles = queryClient.getQueryData(['vehicles']);
      const previousTrucks = queryClient.getQueryData(['trucks']);

      // Atualização otimista da lista de veículos
      if (previousVehicles) {
        const optimisticVehicle = {
          id: `temp-${Date.now()}`,
          ...newVehicle,
          ceramic_id: 'temp',
          status: newVehicle.status || 'OPERATIONAL',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        queryClient.setQueryData(['vehicles'], [optimisticVehicle, ...(previousVehicles as Vehicle[])]);
      }

      // Se for um caminhão, atualizar também a lista de trucks
      if (newVehicle.type === 'Caminhão' && previousTrucks) {
        const optimisticTruck = {
          id: `temp-${Date.now()}`,
          model: newVehicle.model,
          type: newVehicle.type,
        };
        queryClient.setQueryData(['trucks'], [optimisticTruck, ...(previousTrucks as TruckData[])]);
      }

      return { previousVehicles, previousTrucks };
    },
    onError: (err, newVehicle, context) => {
      // Reverter mudanças otimistas em caso de erro
      if (context?.previousVehicles) {
        queryClient.setQueryData(['vehicles'], context.previousVehicles);
      }
      if (context?.previousTrucks) {
        queryClient.setQueryData(['trucks'], context.previousTrucks);
      }
      toast({
        title: 'Erro ao criar veículo',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Veículo criado',
        description: 'Veículo adicionado com sucesso.',
      });
    },
    onSettled: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}

// Hook otimizado para atualizar veículo
export function useUpdateVehicleOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ vehicleId, payload }: { vehicleId: string; payload: UpdateVehiclePayload }) =>
      VehiclesService.updateVehicle(vehicleId, payload),
    onMutate: async ({ vehicleId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      await queryClient.cancelQueries({ queryKey: ['trucks'] });

      const previousVehicles = queryClient.getQueryData(['vehicles']);
      const previousTrucks = queryClient.getQueryData(['trucks']);

      // Atualização otimista na lista de veículos
      if (previousVehicles) {
        queryClient.setQueryData(['vehicles'], (old: Vehicle[]) =>
          old?.map((vehicle: Vehicle) =>
            vehicle.id === vehicleId
              ? { ...vehicle, ...payload, updated_at: new Date().toISOString() }
              : vehicle,
          ),
        );
      }

      // Atualização otimista na lista de trucks se aplicável
      if (previousTrucks && payload.type === 'Caminhão') {
        queryClient.setQueryData(['trucks'], (old: TruckData[]) =>
          old?.map((truck: TruckData) =>
            truck.id === vehicleId
              ? { ...truck, model: payload.model || truck.model, type: payload.type || truck.type }
              : truck,
          ),
        );
      }

      return { previousVehicles, previousTrucks };
    },
    onError: (err, { vehicleId: _vehicleId }, context) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(['vehicles'], context.previousVehicles);
      }
      if (context?.previousTrucks) {
        queryClient.setQueryData(['trucks'], context.previousTrucks);
      }
      toast({
        title: 'Erro ao atualizar veículo',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Veículo atualizado',
        description: 'Dados do veículo atualizados com sucesso.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}

// Hook otimizado para deletar veículo
export function useDeleteVehicleOptimized() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (vehicleId: string) => VehiclesService.deleteVehicle(vehicleId),
    onMutate: async (vehicleId) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      await queryClient.cancelQueries({ queryKey: ['trucks'] });

      const previousVehicles = queryClient.getQueryData(['vehicles']);
      const previousTrucks = queryClient.getQueryData(['trucks']);

      // Atualização otimista - remover da lista de veículos
      if (previousVehicles) {
        queryClient.setQueryData(['vehicles'], (old: Vehicle[]) =>
          old?.filter((vehicle: Vehicle) => vehicle.id !== vehicleId),
        );
      }

      // Atualização otimista - remover da lista de trucks se aplicável
      if (previousTrucks) {
        queryClient.setQueryData(['trucks'], (old: TruckData[]) =>
          old?.filter((truck: TruckData) => truck.id !== vehicleId),
        );
      }

      return { previousVehicles, previousTrucks };
    },
    onError: (err, vehicleId, context) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(['vehicles'], context.previousVehicles);
      }
      if (context?.previousTrucks) {
        queryClient.setQueryData(['trucks'], context.previousTrucks);
      }
      toast({
        title: 'Erro ao excluir veículo',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Veículo excluído',
        description: 'Veículo removido com sucesso.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
}
