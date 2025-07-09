
import React from 'react';
import StatusCard from './StatusCard';
import SalesReportCard from './SalesReportCard';
import { 
  Truck, Users, AlertTriangle, CheckCircle, 
  Clock, TreePine, Settings, Mountain
} from 'lucide-react';

const DashboardOverview = () => {
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
            value={0} 
            icon={Truck} 
            status="success"
          />
          <StatusCard 
            title="Manutenções Pendentes" 
            value={0} 
            icon={Settings} 
            status="warning" 
          />
          <StatusCard 
            title="Consumo de Lenha (m³)" 
            value={0} 
            icon={TreePine} 
            status="info" 
          />
          <StatusCard 
            title="Consumo de Barro (caminhões)" 
            value={0} 
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
            value={0} 
            icon={Users} 
            status="info" 
          />
          <StatusCard 
            title="ASO e NR Regulares" 
            value={0} 
            icon={CheckCircle} 
            status="success" 
          />
          <StatusCard 
            title="Próximo do Vencimento" 
            value={0} 
            icon={AlertTriangle} 
            status="warning" 
          />
          <StatusCard 
            title="ASO/NR Vencidos" 
            value={0} 
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
            value={0} 
            icon={Truck} 
            status="info" 
          />
          <StatusCard 
            title="Em Operação" 
            value={0} 
            icon={CheckCircle} 
            status="success"
          />
          <StatusCard 
            title="Em Manutenção" 
            value={0} 
            icon={Settings} 
            status="warning" 
          />
          <StatusCard 
            title="Parados" 
            value={0} 
            icon={Clock} 
            status="neutral" 
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardOverview;
