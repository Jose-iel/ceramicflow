import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useEmployees() {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['employees', profile?.ceramic_id],
    queryFn: async () => {
      if (!profile?.ceramic_id) return [];
      
      const { data, error } = await supabase
        .from('employees')
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

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (employeeData: any) => {
      if (!profile?.ceramic_id) throw new Error('Usuário não possui cerâmica associada');
      
      const { data, error } = await supabase
        .from('employees')
        .insert({
          name: employeeData.name,
          role: employeeData.role,
          cpf: employeeData.cpf,
          contact: employeeData.contact,
          shift: employeeData.shift,
          ceramic_id: profile.ceramic_id,
          registration_date: employeeData.registrationDate ? 
            new Date(employeeData.registrationDate.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
          aso_expiration_date: employeeData.asoExpirationDate ? 
            new Date(employeeData.asoExpirationDate.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
          nr_expiration_date: employeeData.nrExpirationDate ? 
            new Date(employeeData.nrExpirationDate.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Funcionário criado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao criar funcionário", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ employeeId, employeeData }: { employeeId: string; employeeData: any }) => {
      const { data, error } = await supabase
        .from('employees')
        .update({
          name: employeeData.name,
          role: employeeData.role,
          cpf: employeeData.cpf,
          contact: employeeData.contact,
          shift: employeeData.shift,
          registration_date: employeeData.registrationDate ? 
            new Date(employeeData.registrationDate.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
          aso_expiration_date: employeeData.asoExpirationDate ? 
            new Date(employeeData.asoExpirationDate.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
          nr_expiration_date: employeeData.nrExpirationDate ? 
            new Date(employeeData.nrExpirationDate.split('/').reverse().join('-')).toISOString().split('T')[0] 
            : null,
        })
        .eq('id', employeeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Funcionário atualizado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao atualizar funcionário", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (employeeId: string) => {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Funcionário excluído com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao excluir funcionário", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}