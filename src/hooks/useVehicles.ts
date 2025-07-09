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
          ...vehicleData,
          ceramic_id: profile.ceramic_id,
          acquisition_date: vehicleData.acquisitionDate ? 
            new Date(vehicleData.acquisitionDate.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
          last_maintenance: vehicleData.lastMaintenance ? 
            new Date(vehicleData.lastMaintenance.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
          hour_meter: vehicleData.hourMeter || 0,
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
          ...vehicleData,
          acquisition_date: vehicleData.acquisitionDate ? 
            new Date(vehicleData.acquisitionDate.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
          last_maintenance: vehicleData.lastMaintenance ? 
            new Date(vehicleData.lastMaintenance.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
          hour_meter: vehicleData.hourMeter || 0,
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