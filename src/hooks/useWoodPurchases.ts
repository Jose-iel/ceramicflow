
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useWoodPurchases() {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['wood-purchases', profile?.ceramic_id],
    queryFn: async () => {
      if (!profile?.ceramic_id) return [];
      
      const { data, error } = await supabase
        .from('wood_purchases')
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

export function useCreateWoodPurchase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (purchaseData: any) => {
      if (!profile?.ceramic_id) throw new Error('Usuário não possui cerâmica associada');
      
      const { data, error } = await supabase
        .from('wood_purchases')
        .insert({
          ...purchaseData,
          ceramic_id: profile.ceramic_id,
          date: purchaseData.date ? 
            new Date(purchaseData.date).toISOString().split('T')[0] : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
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

export function useUpdateWoodPurchase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ purchaseId, purchaseData }: { purchaseId: string; purchaseData: any }) => {
      const { data, error } = await supabase
        .from('wood_purchases')
        .update({
          ...purchaseData,
          date: purchaseData.date ? 
            new Date(purchaseData.date).toISOString().split('T')[0] : null,
        })
        .eq('id', purchaseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
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

export function useDeleteWoodPurchase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (purchaseId: string) => {
      const { error } = await supabase
        .from('wood_purchases')
        .delete()
        .eq('id', purchaseId);

      if (error) throw error;
    },
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
