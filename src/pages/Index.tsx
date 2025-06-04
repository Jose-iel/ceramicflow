
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import VehicleCard from '@/components/vehicle/VehicleCard';
import { Vehicle, VehicleStatus, VehicleType } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Mock data for the dashboard
const mockVehicles: Vehicle[] = [
  {
    id: 'G001',
    model: 'Toyota 8FGU25',
    type: VehicleType.GAS,
    acquisitionDate: '10/05/2022',
    lastMaintenance: '15/09/2023',
    status: VehicleStatus.OPERATIONAL,
    hourMeter: 12583,
  },
  {
    id: 'E002',
    model: 'Hyster E50XN',
    type: VehicleType.ELECTRIC,
    acquisitionDate: '22/11/2021',
    lastMaintenance: '30/10/2023',
    status: VehicleStatus.OPERATIONAL,
    hourMeter: 8452,
  },
  {
    id: 'T003',
    model: 'John Deere 6110B',
    type: VehicleType.TRACTOR,
    acquisitionDate: '04/03/2022',
    lastMaintenance: '12/08/2023',
    status: VehicleStatus.MAINTENANCE,
    hourMeter: 10974,
  },
  {
    id: 'C004',
    model: 'Mercedes Atego',
    type: VehicleType.TRUCK,
    acquisitionDate: '18/07/2022',
    lastMaintenance: '05/11/2023',
    status: VehicleStatus.STOPPED,
    hourMeter: 6782,
  },
];

const Index = () => {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState<string>('');
  
  useEffect(() => {
    // Set current date in Brazilian format
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(now.toLocaleDateString('pt-BR', options));
    
    // First letter uppercase
    setCurrentDate(prev => 
      prev.charAt(0).toUpperCase() + prev.slice(1)
    );
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64" // Offset for sidebar when not mobile
      )}>
        <Navbar 
          title="Dashboard" 
          subtitle={currentDate}
        />
        
        <main className="flex-1 px-6 py-6">
          <DashboardOverview />
          
          <section className="mt-8 slide-enter" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Veículos Em Destaque</h2>
              <button className="text-sm text-primary hover:underline">
                Ver todos
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockVehicles.map((vehicle) => (
                <VehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  onClick={() => console.log(`Clicked on ${vehicle.id}`)}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
