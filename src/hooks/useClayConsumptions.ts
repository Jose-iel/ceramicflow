
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useClayConsumptions() {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['clay-consumptions', profile?.ceramic_id],
    queryFn: async () => {
      if (!profile?.ceramic_id) return [];
      
      const { data, error } = await supabase
        .from('clay_consumptions')
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

export function useCreateClayConsumption() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (consumptionData: any) => {
      if (!profile?.ceramic_id) throw new Error('Usuário não possui cerâmica associada');
      
      const { data, error } = await supabase
        .from('clay_consumptions')
        .insert({
          ...consumptionData,
          ceramic_id: profile.ceramic_id,
          date: consumptionData.date ? 
            new Date(consumptionData.date).toISOString().split('T')[0] : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Consumo de barro registrado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['clay-consumptions'] });
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

export function useUpdateClayConsumption() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ consumptionId, consumptionData }: { consumptionId: string; consumptionData: any }) => {
      const { data, error } = await supabase
        .from('clay_consumptions')
        .update({
          ...consumptionData,
          date: consumptionData.date ? 
            new Date(consumptionData.date).toISOString().split('T')[0] : null,
        })
        .eq('id', consumptionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Consumo de barro atualizado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['clay-consumptions'] });
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

export function useDeleteClayConsumption() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (consumptionId: string) => {
      const { error } = await supabase
        .from('clay_consumptions')
        .delete()
        .eq('id', consumptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Consumo de barro excluído com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['clay-consumptions'] });
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
