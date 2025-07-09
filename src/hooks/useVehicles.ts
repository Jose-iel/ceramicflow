
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useVehicles() {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['vehicles', profile?.ceramic_id],
    queryFn: async () => {
      if (!profile?.ceramic_id) return [];
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('ceramic_id', profile.ceramic_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.ceramic_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (vehicleData: any) => {
      if (!profile?.ceramic_id) throw new Error('Usuário não possui cerâmica associada');
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          model: vehicleData.model,
          type: vehicleData.type,
          capacity: vehicleData.capacity,
          acquisition_date: vehicleData.acquisition_date,
          last_maintenance: vehicleData.last_maintenance,
          status: vehicleData.status,
          hour_meter: vehicleData.hour_meter,
          ceramic_id: profile.ceramic_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Veículo criado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao criar veículo", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ vehicleId, vehicleData }: { vehicleId: string; vehicleData: any }) => {
      const { data, error } = await supabase
        .from('vehicles')
        .update({
          model: vehicleData.model,
          type: vehicleData.type,
          capacity: vehicleData.capacity,
          acquisition_date: vehicleData.acquisition_date,
          last_maintenance: vehicleData.last_maintenance,
          status: vehicleData.status,
          hour_meter: vehicleData.hour_meter,
        })
        .eq('id', vehicleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Veículo atualizado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao atualizar veículo", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (vehicleId: string) => {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Veículo excluído com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao excluir veículo", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}
