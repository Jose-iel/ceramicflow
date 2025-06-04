
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Vehicle, VehicleStatus, VehicleType } from '@/types';
import { Filter, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import VehicleCard from '@/components/vehicle/VehicleCard';
import VehicleDialog from '@/components/vehicle/VehicleDialog';
import { useToast } from '@/hooks/use-toast';

// Mock data for vehicles
const initialVehicles: Vehicle[] = [
  {
    id: 'V001',
    model: 'Toyota 8FGU25',
    type: VehicleType.GAS,
    acquisitionDate: '10/05/2022',
    lastMaintenance: '15/09/2023',
    status: VehicleStatus.OPERATIONAL,
    hourMeter: 12583,
  },
  {
    id: 'V002',
    model: 'Mercedes Atego',
    type: VehicleType.TRUCK,
    acquisitionDate: '22/11/2021',
    lastMaintenance: '30/10/2023',
    status: VehicleStatus.OPERATIONAL,
    hourMeter: 8452,
  },
  {
    id: 'V003',
    model: 'John Deere 6110B',
    type: VehicleType.TRACTOR,
    acquisitionDate: '04/03/2022',
    lastMaintenance: '12/08/2023',
    status: VehicleStatus.MAINTENANCE,
    hourMeter: 10974,
  },
  {
    id: 'V004',
    model: 'Hyster E50XN',
    type: VehicleType.ELECTRIC,
    acquisitionDate: '18/07/2022',
    lastMaintenance: '05/11/2023',
    status: VehicleStatus.STOPPED,
    hourMeter: 6782,
  },
];

const VehiclesPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [showDialog, setShowDialog] = useState(false);
  
  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.model.toLowerCase().includes(search.toLowerCase()) || 
                          vehicle.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = type === 'all' || vehicle.type === type;
    const matchesStatus = status === 'all' || vehicle.status === status;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSaveVehicle = (vehicle: Vehicle) => {
    setVehicles(prev => [...prev, vehicle]);
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este veículo?")) {
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast({
        title: "Veículo excluído",
        description: "O veículo foi excluído com sucesso."
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Frota" 
          subtitle="Gerenciamento de Veículos"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Filter section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Buscar veículo..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtrar
              </Button>
              <Button className="gap-2" onClick={() => setShowDialog(true)}>
                <Plus className="w-4 h-4" />
                Novo Veículo
              </Button>
            </div>
          </div>
          
          {/* Filter options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tipo</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value={VehicleType.GAS}>Empilhadeira Gás</option>
                <option value={VehicleType.ELECTRIC}>Empilhadeira Elétrica</option>
                <option value={VehicleType.TRUCK}>Caminhão</option>
                <option value={VehicleType.TRACTOR}>Trator</option>
                <option value={VehicleType.RETRACTABLE}>Empilhadeira Retrátil</option>
                <option value={VehicleType.LOADER}>Pá Carregadeira</option>
                <option value={VehicleType.EXCAVATOR}>Retro Escavadeira</option>
              </select>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Status</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value={VehicleStatus.OPERATIONAL}>Em Operação</option>
                <option value={VehicleStatus.MAINTENANCE}>Manutenção</option>
                <option value={VehicleStatus.STOPPED}>Parado</option>
              </select>
            </div>
          </div>

          {/* Vehicles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                onClick={() => console.log(`Clicked on ${vehicle.id}`)}
              />
            ))}
          </div>
          
          {filteredVehicles.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <p>Nenhum veículo encontrado</p>
            </div>
          )}
        </main>
      </div>
      
      <VehicleDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSave={handleSaveVehicle}
      />
    </div>
  );
};

export default VehiclesPage;
