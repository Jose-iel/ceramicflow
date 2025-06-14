
import React from 'react';
import StatusCard from './StatusCard';
import { 
  Truck, Users, AlertTriangle, CheckCircle, 
  Clock, TreePine, Settings, Calendar, Mountain
} from 'lucide-react';
import { DashboardStats } from '@/types';

// Mock data for initial rendering
const initialStats: DashboardStats = {
  totalVehicles: 15,
  operationalVehicles: 9,
  stoppedVehicles: 3,
  maintenanceVehicles: 3,
  totalEmployees: 20,
  employeesWithValidCertificates: 16,
  employeesWithWarningCertificates: 3,
  employeesWithExpiredCertificates: 1,
  activeOperations: 7,
  pendingMaintenances: 4,
  monthlyWoodConsumption: 245.5,
  monthlyClayConsumption: 89
};

interface DashboardOverviewProps {
  stats?: DashboardStats;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  stats = initialStats 
}) => {
  return (
    <section className="space-y-6">
      <div className="slide-enter" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-2xl font-semibold mb-4">Operação Atual</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Operações Ativas" 
            value={stats.activeOperations} 
            icon={Truck} 
            status="success"
            change={{ value: 5, trend: 'up' }}
          />
          <StatusCard 
            title="Manutenções Pendentes" 
            value={stats.pendingMaintenances} 
            icon={Settings} 
            status="warning" 
          />
          <StatusCard 
            title="Consumo de Lenha (m³)" 
            value={stats.monthlyWoodConsumption} 
            icon={TreePine} 
            status="info" 
          />
          <StatusCard 
            title="Consumo de Barro (caminhões)" 
            value={stats.monthlyClayConsumption} 
            icon={Mountain} 
            status="info" 
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-semibold mb-4">Status dos Funcionários</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total de Funcionários" 
            value={stats.totalEmployees} 
            icon={Users} 
            status="info" 
          />
          <StatusCard 
            title="ASO e NR Regulares" 
            value={stats.employeesWithValidCertificates} 
            icon={CheckCircle} 
            status="success" 
          />
          <StatusCard 
            title="Próximo do Vencimento" 
            value={stats.employeesWithWarningCertificates} 
            icon={AlertTriangle} 
            status="warning" 
          />
          <StatusCard 
            title="ASO/NR Vencidos" 
            value={stats.employeesWithExpiredCertificates} 
            icon={AlertTriangle} 
            status="danger" 
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-2xl font-semibold mb-4">Status da Frota</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total de Veículos" 
            value={stats.totalVehicles} 
            icon={Truck} 
            status="info" 
          />
          <StatusCard 
            title="Em Operação" 
            value={stats.operationalVehicles} 
            icon={CheckCircle} 
            status="success"
            change={{ value: 12, trend: 'up' }}
          />
          <StatusCard 
            title="Em Manutenção" 
            value={stats.maintenanceVehicles} 
            icon={Settings} 
            status="warning" 
          />
          <StatusCard 
            title="Parados" 
            value={stats.stoppedVehicles} 
            icon={Clock} 
            status="neutral" 
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardOverview;
