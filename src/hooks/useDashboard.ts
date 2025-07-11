import { useQuery } from '@tanstack/react-query';
import { DashboardService, type DashboardOverview } from '@/integrations/supabase/api/dashboard';
import { useAuth } from '@/hooks/useAuth';

export function useDashboardOverview(selectedMonth?: string) {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard-overview', profile?.ceramic_id, selectedMonth],
    queryFn: async (): Promise<DashboardOverview | null> => {
      if (!profile?.ceramic_id || typeof profile.ceramic_id !== 'string') return null;
      
      return DashboardService.getDashboardOverview(profile.ceramic_id, selectedMonth);
    },
    enabled: !!profile?.ceramic_id && typeof profile.ceramic_id === 'string',
    staleTime: 2 * 60 * 1000, // 2 minutos - mais cache, mas ainda responsivo
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: false, // Removido refetch automático - será invalidado pelas mutações
  });
}