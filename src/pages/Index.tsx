import { useMemo } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Truck,
  Users,
  HardHat,
  Fuel,
  Package,
  Wrench,
  LucideIcon,
  RefreshCw,
  UserX,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import PageLayout from '@/components/common/PageLayout';
import { type StatCardProps } from '@/components/common/StatsCard';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { useDashboard, type DashboardData } from '@/hooks/useDashboard';
import { useMonthFilter } from '@/hooks/useMonthFilter';

/**
 * Generates the statistics cards for the dashboard based on the provided data.
 * @param data - The dashboard data from the API.
 * @returns An array of StatCardProps.
 */
const generateStatsCards = (data: DashboardData | undefined): StatCardProps[] => {
  const loadingCard = (title: string, icon: LucideIcon): StatCardProps => ({
    title,
    value: '...',
    icon,
    isLoading: true,
  });

  if (!data) {
    return [
      loadingCard('Receita Total', DollarSign),
      loadingCard('Vendas Totais', ShoppingCart),
      loadingCard('Operações Concluídas', Truck),
      loadingCard('Funcionários', Users),
      loadingCard('Consumo de Lenha (m³)', Fuel),
      loadingCard('Terra e Barro', Package),
      loadingCard('Veículos em Manutenção', Wrench),
      loadingCard('Férias a Vencer', HardHat),
    ];
  }

  const { kpis } = data;

  console.log(kpis);

  return [
    {
      title: 'Receita Total',
      value: kpis.sales.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      icon: DollarSign,
      description: 'Receita no período',
      dataTestId: 'total-revenue-dashboard-card',
    },
    {
      title: 'Vendas Totais',
      value: kpis.sales.totalSalesCount.toString(),
      icon: ShoppingCart,
      description: 'Vendas no período',
      dataTestId: 'total-sales-dashboard-card',
    },
    {
      title: 'Operações Concluídas',
      value: kpis.operations.completedOperationsCount.toString(),
      icon: Truck,
      description: 'Concluídas no período',
      dataTestId: 'completed-operations-dashboard-card',
    },
    {
      title: 'Consumo de Lenha (m³)',
      value: kpis.wood.totalWoodConsumed.toLocaleString('pt-BR'),
      icon: Fuel,
      description: 'Consumo no período',
      dataTestId: 'total-wood-consumed-dashboard-card',
    },
    {
      title: 'Terra e Barro',
      value: `${kpis.terra_e_barro.totalTrucks} Caminhões`,
      icon: Package,
      description: 'Entradas no período',
      dataTestId: 'total-trucks-dashboard-card',
    },
    {
      title: 'Veículos em Manutenção',
      value: kpis.vehicles.maintenanceCount.toString(),
      icon: Wrench,
      description: 'Veículos atualmente em manutenção',
      dataTestId: 'vehicles-in-maintenance-dashboard-card',
    },
    {
      title: 'Funcionários',
      value: kpis.employees.totalCount.toString(),
      icon: Users,
      description: 'Total de funcionários ativos',
      dataTestId: 'total-employees-dashboard-card',
    },
    {
      title: 'Férias a Vencer',
      value: `${kpis.employees.expiredCount + kpis.employees.expiringSoonCount}`,
      icon: HardHat,
      description: `${kpis.employees.expiredCount} vencida(s), ${kpis.employees.expiringSoonCount} a vencer`,
      dataTestId: 'vacations-expiring-dashboard-card',
    },
    {
      title: 'Faltas no mês',
      value: kpis.total_absences.totalAbsences.toString(),
      icon: UserX,
      description: 'Total de faltas no mês',
      dataTestId: 'total-absenses-dashboard-card',
    },
  ];
};

const Index = () => {
  const { selectedMonth, setSelectedMonth } = useMonthFilter();
  const { data: dashboardData, isLoading, refetch } = useDashboard(selectedMonth);
  const queryClient = useQueryClient();

  const statsCards = useMemo(() => generateStatsCards(dashboardData), [dashboardData]);

  const handleRefresh = () => {
    refetch();
  };

  // Invalida a query do dashboard em qualquer mutação para manter os dados atualizados
  queryClient.getQueryCache().subscribe(event => {
    if (event.type === 'observerResultsUpdated' && event.query.state.status === 'success') {
      const mutationKeys = ['create', 'update', 'delete'];
      if (mutationKeys.some(key => event.query.queryKey.includes(key))) {
        queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      }
    }
  });

  const subtitle = useMemo(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const dateStr = now.toLocaleDateString('pt-BR', options);
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  }, []);

  return (
    <PageLayout
      selectedMonth={selectedMonth}
      showSearch={false}
      statsCards={statsCards}
      subtitle={subtitle}
      title="Dashboard"
      onMonthChange={setSelectedMonth}
      dataTestId="dashboard-page-content"
      actions={[
        {
          label: 'Atualizar Dados',
          onClick: handleRefresh,
          icon: <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />,
        },
      ]}
    >
      <DashboardOverview data={dashboardData} isLoading={isLoading} />
    </PageLayout>
  );
};

export default Index;
