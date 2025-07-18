import { useQueryClient } from '@tanstack/react-query';

import { VehiclesService } from '../api';
import type { CreateVehiclePayload, UpdateVehiclePayload, Vehicle } from '../api';

import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { useEntityMutation } from '@/hooks/useEntityMutation';

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
  return useEntityMutation({
    mutationFn: (payload: CreateVehiclePayload) => VehiclesService.createVehicle(payload),
    queryKeyToInvalidate: ['vehicles', 'trucks'],
    successMessage: 'Veículo adicionado com sucesso.',
    errorMessage: 'Erro ao criar veículo',
    onMutate: async newVehicle => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      await queryClient.cancelQueries({ queryKey: ['trucks'] });

      const previousVehicles = queryClient.getQueryData(['vehicles']);
      const previousTrucks = queryClient.getQueryData(['trucks']);

      const optimisticVehicleId = `temp-${Date.now()}`;
      const optimisticVehicle = {
        id: optimisticVehicleId,
        ...newVehicle,
        ceramic_id: 'temp',
        status: newVehicle.status || 'OPERATIONAL',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      queryClient.setQueryData(['vehicles'], [optimisticVehicle, ...(previousVehicles as Vehicle[])]);

      if (newVehicle.type === 'Caminhão') {
        const optimisticTruck = {
          id: optimisticVehicleId,
          model: newVehicle.model,
          type: newVehicle.type,
        };
        queryClient.setQueryData(['trucks'], [optimisticTruck, ...(previousTrucks as TruckData[])]);
      }

      return { previousVehicles, previousTrucks, optimisticVehicleId };
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['vehicles'], (old: Vehicle[] = []) =>
        old.map(vehicle => (vehicle.id === context?.optimisticVehicleId ? data : vehicle))
      );

      if (variables.type === 'Caminhão') {
        queryClient.setQueryData(['trucks'], (old: TruckData[] = []) =>
          old.map(truck => (truck.id === context?.optimisticVehicleId ? { ...truck, id: data.id } : truck))
        );
      }
    },
    onError: (err, newVehicle, context) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(['vehicles'], context.previousVehicles);
      }
      if (context?.previousTrucks) {
        queryClient.setQueryData(['trucks'], context.previousTrucks);
      }
    },
  });
}

// Hook otimizado para atualizar veículo
export function useUpdateVehicleOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: ({ vehicleId, payload }: { vehicleId: string; payload: UpdateVehiclePayload }) =>
      VehiclesService.updateVehicle(vehicleId, payload),
    queryKeyToInvalidate: ['vehicles', 'trucks'],
    successMessage: 'Dados do veículo atualizados com sucesso.',
    errorMessage: 'Erro ao atualizar veículo',
    onMutate: async ({ vehicleId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      await queryClient.cancelQueries({ queryKey: ['trucks'] });

      const previousVehicles = queryClient.getQueryData(['vehicles']);
      const previousTrucks = queryClient.getQueryData(['trucks']);

      if (previousVehicles) {
        queryClient.setQueryData(['vehicles'], (old: Vehicle[] = []) =>
          old?.map((vehicle: Vehicle) =>
            vehicle.id === vehicleId ? { ...vehicle, ...payload, updated_at: new Date().toISOString() } : vehicle
          )
        );
      }

      if (previousTrucks && payload.type === 'Caminhão') {
        queryClient.setQueryData(['trucks'], (old: TruckData[] = []) =>
          old?.map((truck: TruckData) =>
            truck.id === vehicleId ? { ...truck, model: payload.model || truck.model, type: payload.type || truck.type } : truck
          )
        );
      }

      return { previousVehicles, previousTrucks };
    },
    onError: (err, _variables, context?: { previousVehicles: unknown; previousTrucks: unknown }) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(['vehicles'], context.previousVehicles);
      }
      if (context?.previousTrucks) {
        queryClient.setQueryData(['trucks'], context.previousTrucks);
      }
    },
  });
}

// Hook otimizado para deletar veículo
export function useDeleteVehicleOptimized() {
  const queryClient = useQueryClient();
  return useEntityMutation({
    mutationFn: (vehicleId: string) => VehiclesService.deleteVehicle(vehicleId),
    queryKeyToInvalidate: ['vehicles', 'trucks'],
    successMessage: 'Veículo removido com sucesso.',
    errorMessage: 'Erro ao excluir veículo',
    onMutate: async vehicleId => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      await queryClient.cancelQueries({ queryKey: ['trucks'] });

      const previousVehicles = queryClient.getQueryData(['vehicles']);
      const previousTrucks = queryClient.getQueryData(['trucks']);

      if (previousVehicles) {
        queryClient.setQueryData(['vehicles'], (old: Vehicle[] = []) =>
          old?.filter((vehicle: Vehicle) => vehicle.id !== vehicleId)
        );
      }

      if (previousTrucks) {
        queryClient.setQueryData(['trucks'], (old: TruckData[] = []) =>
          old?.filter((truck: TruckData) => truck.id !== vehicleId)
        );
      }

      return { previousVehicles, previousTrucks };
    },
    onError: (err, vehicleId, context?: { previousVehicles: unknown; previousTrucks: unknown }) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(['vehicles'], context.previousVehicles);
      }
      if (context?.previousTrucks) {
        queryClient.setQueryData(['trucks'], context.previousTrucks);
      }
    },
  });
}
