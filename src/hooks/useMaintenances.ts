import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useMaintenances() {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['maintenances', profile?.ceramic_id],
    queryFn: async () => {
      if (!profile?.ceramic_id) return [];
      
      const { data, error } = await supabase
        .from('maintenances')
        .select(`
          *,
          vehicles(model, type)
        `)
        .eq('ceramic_id', profile.ceramic_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.ceramic_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateMaintenance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (maintenanceData: any) => {
      if (!profile?.ceramic_id) throw new Error('Usuário não possui cerâmica associada');
      
      const { data, error } = await supabase
        .from('maintenances')
        .insert({
          ...maintenanceData,
          ceramic_id: profile.ceramic_id,
          reported_date: maintenanceData.reportedDate ? 
            new Date(maintenanceData.reportedDate.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
          completed_date: maintenanceData.completedDate ? 
            new Date(maintenanceData.completedDate.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Manutenção criada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao criar manutenção", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useUpdateMaintenance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ maintenanceId, maintenanceData }: { maintenanceId: string; maintenanceData: any }) => {
      const { data, error } = await supabase
        .from('maintenances')
        .update({
          ...maintenanceData,
          reported_date: maintenanceData.reportedDate ? 
            new Date(maintenanceData.reportedDate.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
          completed_date: maintenanceData.completedDate ? 
            new Date(maintenanceData.completedDate.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
        })
        .eq('id', maintenanceId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Manutenção atualizada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao atualizar manutenção", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useDeleteMaintenance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (maintenanceId: string) => {
      const { error } = await supabase
        .from('maintenances')
        .delete()
        .eq('id', maintenanceId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Manutenção excluída com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao excluir manutenção", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}