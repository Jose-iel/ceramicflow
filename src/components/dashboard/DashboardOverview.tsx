
import {
  Truck, Users, AlertTriangle, CheckCircle,
  Clock, TreePine, Settings, Mountain,
} from 'lucide-react';

import SalesReportCard from './SalesReportCard';
import StatusCard from './StatusCard';


import { useDashboardOverview } from '@/hooks/useDashboard';
import { useMonthFilter } from '@/hooks/useMonthFilter';

const DashboardOverview = () => {
  const { selectedMonth } = useMonthFilter();
  const { data: dashboardData, isLoading } = useDashboardOverview(selectedMonth);

  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="text-center py-8">Carregando dados do dashboard...</div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Seção de Vendas - Card de Relatório */}
      <div className="slide-enter" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-2xl font-semibold mb-4">Vendas</h2>
        <SalesReportCard salesData={dashboardData?.sales} />
      </div>

      {/* Seção de Operações */}
      <div className="slide-enter" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-semibold mb-4">Operações</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatusCard
            icon={Truck}
            status="success"
            title="Operações Ativas"
            value={dashboardData?.operations?.active || 0}
          />
          <StatusCard
            icon={Settings}
            status="warning"
            title="Manutenções Pendentes"
            value={dashboardData?.maintenances?.pending || 0}
          />
          <StatusCard
            icon={TreePine}
            status="info"
            title="Consumo de Lenha (m³)"
            value={dashboardData?.consumption?.wood || 0}
          />
          <StatusCard
            icon={Mountain}
            status="info"
            title="Consumo de Barro (caminhões)"
            value={dashboardData?.consumption?.clay || 0}
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-2xl font-semibold mb-4">Status dos Funcionários</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            icon={Users}
            status="info"
            title="Total de Funcionários"
            value={dashboardData?.employees?.total || 0}
          />
          <StatusCard
            icon={CheckCircle}
            status="success"
            title="ASO e NR Regulares"
            value={dashboardData?.employees?.regular || 0}
          />
          <StatusCard
            icon={AlertTriangle}
            status="warning"
            title="Próximo do Vencimento"
            value={dashboardData?.employees?.expiringSoon || 0}
          />
          <StatusCard
            icon={AlertTriangle}
            status="danger"
            title="ASO/NR Vencidos"
            value={dashboardData?.employees?.expired || 0}
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-semibold mb-4">Status da Frota</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            icon={Truck}
            status="info"
            title="Total de Veículos"
            value={dashboardData?.vehicles?.total || 0}
          />
          <StatusCard
            icon={CheckCircle}
            status="success"
            title="Em Operação"
            value={dashboardData?.vehicles?.operational || 0}
          />
          <StatusCard
            icon={Settings}
            status="warning"
            title="Em Manutenção"
            value={dashboardData?.vehicles?.maintenance || 0}
          />
          <StatusCard
            icon={Clock}
            status="neutral"
            title="Parados"
            value={dashboardData?.vehicles?.stopped || 0}
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardOverview;
