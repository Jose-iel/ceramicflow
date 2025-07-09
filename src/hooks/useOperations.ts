
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useOperations() {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['operations', profile?.ceramic_id],
    queryFn: async () => {
      if (!profile?.ceramic_id) return [];
      
      const { data, error } = await supabase
        .from('operations')
        .select(`
          *,
          vehicles(model, type),
          employees(name)
        `)
        .eq('ceramic_id', profile.ceramic_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.ceramic_id,
    staleTime: 2 * 60 * 1000, // 2 minutes - operações mudam mais frequentemente
  });
}

export function useCreateOperation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (operationData: any) => {
      if (!profile?.ceramic_id) throw new Error('Usuário não possui cerâmica associada');
      
      const { data, error } = await supabase
        .from('operations')
        .insert({
          type: operationData.type,
          location: operationData.location,
          operator: operationData.operator,
          start_date: operationData.start_date,
          end_date: operationData.end_date,
          status: operationData.status,
          employee_id: operationData.employee_id,
          vehicle_id: operationData.vehicle_id,
          operation_type: operationData.operation_type,
          description: operationData.description,
          initial_hour_meter: operationData.initial_hour_meter,
          current_hour_meter: operationData.current_hour_meter,
          start_time: operationData.start_time,
          end_time: operationData.end_time,
          gas_consumption: operationData.gas_consumption,
          ceramic_id: profile.ceramic_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Operação criada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao criar operação", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useUpdateOperation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ operationId, operationData }: { operationId: string; operationData: any }) => {
      const { data, error } = await supabase
        .from('operations')
        .update({
          type: operationData.type,
          location: operationData.location,
          operator: operationData.operator,
          start_date: operationData.start_date,
          end_date: operationData.end_date,
          status: operationData.status,
          employee_id: operationData.employee_id,
          vehicle_id: operationData.vehicle_id,
          operation_type: operationData.operation_type,
          description: operationData.description,
          initial_hour_meter: operationData.initial_hour_meter,
          current_hour_meter: operationData.current_hour_meter,
          start_time: operationData.start_time,
          end_time: operationData.end_time,
          gas_consumption: operationData.gas_consumption,
        })
        .eq('id', operationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Operação atualizada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao atualizar operação", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useDeleteOperation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (operationId: string) => {
      const { error } = await supabase
        .from('operations')
        .delete()
        .eq('id', operationId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Operação excluída com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao excluir operação", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}
