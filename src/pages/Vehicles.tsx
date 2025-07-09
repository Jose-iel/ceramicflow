
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { VehicleStatus, VehicleType } from '@/types';
import { Filter, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import VehicleCard from '@/components/vehicle/VehicleCard';
import VehicleDialog from '@/components/vehicle/VehicleDialog';
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from '@/hooks/useVehicles';

const VehiclesPage = () => {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);

  // Use real database hooks
  const { data: vehicles = [], isLoading } = useVehicles();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  
  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.model.toLowerCase().includes(search.toLowerCase()) || 
                          vehicle.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = type === 'all' || vehicle.type === type;
    const matchesStatus = status === 'all' || vehicle.status === status;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSaveVehicle = (vehicleData: any) => {
    if (editingVehicle) {
      updateVehicle.mutate({
        vehicleId: editingVehicle.id,
        vehicleData: vehicleData
      });
    } else {
      createVehicle.mutate(vehicleData);
    }
    setEditingVehicle(null);
    setShowDialog(false);
  };

  const handleEditVehicle = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setShowDialog(true);
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este veículo?")) {
      deleteVehicle.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingVehicle(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
          <Navbar title="Frota" subtitle="Gerenciamento de Veículos" />
          <main className="flex-1 px-6 py-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando veículos...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
              <Button 
                className="gap-2" 
                onClick={() => {
                  setEditingVehicle(null);
                  setShowDialog(true);
                }}
              >
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
              <div key={vehicle.id} className="relative group">
                <VehicleCard 
                  vehicle={vehicle} 
                  onClick={() => console.log(`Clicked on ${vehicle.id}`)}
                />
                
                {/* Action buttons overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditVehicle(vehicle);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVehicle(vehicle.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredVehicles.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <p>Nenhum veículo encontrado</p>
              <p className="text-sm mt-2">Adicione um novo veículo para começar</p>
            </div>
          )}
        </main>
      </div>
      
      <VehicleDialog
        open={showDialog}
        onOpenChange={handleDialogClose}
        onSave={handleSaveVehicle}
        vehicle={editingVehicle}
      />
    </div>
  );
};

export default VehiclesPage;
