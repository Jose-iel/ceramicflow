
import React from 'react';
import StatusCard from './StatusCard';
import SalesReportCard from './SalesReportCard';
import { 
  Truck, Users, AlertTriangle, CheckCircle, 
  Clock, TreePine, Settings, Mountain
} from 'lucide-react';
import { useDashboardOverview } from '@/hooks/useDashboard';

const DashboardOverview = () => {
  const { data: dashboardData, isLoading } = useDashboardOverview();

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
        <SalesReportCard />
      </div>

      {/* Seção de Operações */}
      <div className="slide-enter" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-semibold mb-4">Operações</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatusCard 
            title="Operações Ativas" 
            value={dashboardData?.operations?.active || 0} 
            icon={Truck} 
            status="success"
          />
          <StatusCard 
            title="Manutenções Pendentes" 
            value={dashboardData?.maintenances?.pending || 0} 
            icon={Settings} 
            status="warning" 
          />
          <StatusCard 
            title="Consumo de Lenha (m³)" 
            value={dashboardData?.consumption?.wood || 0} 
            icon={TreePine} 
            status="info" 
          />
          <StatusCard 
            title="Consumo de Barro (caminhões)" 
            value={dashboardData?.consumption?.clay || 0} 
            icon={Mountain} 
            status="info" 
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-2xl font-semibold mb-4">Status dos Funcionários</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total de Funcionários" 
            value={dashboardData?.employees?.total || 0} 
            icon={Users} 
            status="info" 
          />
          <StatusCard 
            title="ASO e NR Regulares" 
            value={dashboardData?.employees?.regular || 0} 
            icon={CheckCircle} 
            status="success" 
          />
          <StatusCard 
            title="Próximo do Vencimento" 
            value={dashboardData?.employees?.expiringSoon || 0} 
            icon={AlertTriangle} 
            status="warning" 
          />
          <StatusCard 
            title="ASO/NR Vencidos" 
            value={dashboardData?.employees?.expired || 0} 
            icon={AlertTriangle} 
            status="danger" 
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-semibold mb-4">Status da Frota</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total de Veículos" 
            value={dashboardData?.vehicles?.total || 0} 
            icon={Truck} 
            status="info" 
          />
          <StatusCard 
            title="Em Operação" 
            value={dashboardData?.vehicles?.operational || 0} 
            icon={CheckCircle} 
            status="success"
          />
          <StatusCard 
            title="Em Manutenção" 
            value={dashboardData?.vehicles?.maintenance || 0} 
            icon={Settings} 
            status="warning" 
          />
          <StatusCard 
            title="Parados" 
            value={dashboardData?.vehicles?.stopped || 0} 
            icon={Clock} 
            status="neutral" 
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardOverview;
