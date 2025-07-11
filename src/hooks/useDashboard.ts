import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/integrations/supabase/hooks/use-auth';

// --- Tipos para Atividades Recentes ---
interface RecentSale {
  id: string;
  sale_date: string;
  customer_name: string;
  total_value: number;
}

interface RecentOperation {
  id: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

// A interface deve espelhar a estrutura de resposta da Edge Function
export interface DashboardData {
  kpis: {
    sales: {
      totalRevenue: number;
      totalSalesCount: number;
      brickQuantitySold: number;
    };
    operations: {
      activeOperationsCount: number;
      completedOperationsCount: number;
    };
    wood: {
      totalWoodConsumed: number;
      totalWoodPurchased: number;
    };
    terra_e_barro: {
      totalTrucks: number;
    };
    employees: {
      totalCount: number;
      regularCount: number;
      expiringSoonCount: number;
      expiredCount: number;
    };
    vehicles: {
      totalCount: number;
      operationalCount: number;
      maintenanceCount: number;
    };
  };
  recentActivities: {
    latestSales: RecentSale[];
    latestOperations: RecentOperation[];
  };
}

const fetchDashboardData = async (ceramic_id: string, selectedMonth?: string) => {
  const { data, error } = await supabase.functions.invoke('get-dashboard-overview', {
    body: { ceramic_id, selectedMonth },
  });

  if (error) {
    throw new Error(`Erro ao buscar dados do dashboard: ${error.message}`);
  }

  return data as DashboardData;
};

export function useDashboard(selectedMonth?: string) {
  const { profile } = useAuth();
  const ceramicId = profile?.ceramic_id;

  return useQuery<DashboardData, Error>({
    queryKey: ['dashboard-overview', ceramicId, selectedMonth],
    queryFn: () => fetchDashboardData(ceramicId!, selectedMonth),
    enabled: !!ceramicId,
    // Força a busca de dados sempre que o componente do dashboard é montado,
    // garantindo que os dados estejam sempre atualizados ao navegar para a tela.
    refetchOnMount: 'always',
  });
}
