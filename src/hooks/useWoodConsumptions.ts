
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useWoodConsumptions() {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['wood-consumptions', profile?.ceramic_id],
    queryFn: async () => {
      if (!profile?.ceramic_id) return [];
      
      const { data, error } = await supabase
        .from('wood_consumptions')
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

export function useCreateWoodConsumption() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (consumptionData: any) => {
      if (!profile?.ceramic_id) throw new Error('Usuário não possui cerâmica associada');
      
      const { data, error } = await supabase
        .from('wood_consumptions')
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
      toast({ title: "Consumo de lenha registrado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['wood-consumptions'] });
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

export function useUpdateWoodConsumption() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ consumptionId, consumptionData }: { consumptionId: string; consumptionData: any }) => {
      const { data, error } = await supabase
        .from('wood_consumptions')
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
      toast({ title: "Consumo de lenha atualizado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['wood-consumptions'] });
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

export function useDeleteWoodConsumption() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (consumptionId: string) => {
      const { error } = await supabase
        .from('wood_consumptions')
        .delete()
        .eq('id', consumptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Consumo de lenha excluído com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['wood-consumptions'] });
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
