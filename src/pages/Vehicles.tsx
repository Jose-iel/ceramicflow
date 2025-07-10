
import React, { useState, Suspense, lazy } from 'react';
import { Plus, Edit, Trash2, Car, Truck, Settings } from 'lucide-react';
import { VehicleStatus, VehicleType } from '@/types';
import VehicleCard from '@/components/vehicle/VehicleCard';
// Lazy load do dialog
const VehicleDialog = lazy(() => import('@/components/vehicle/VehicleDialog'));
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from '@/hooks';
import { Vehicle, CreateVehiclePayload } from '@/integrations/supabase/api';
import PageLayout from '@/components/common/PageLayout';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

// Tipo para veículo transformado para exibição
type TransformedVehicle = {
  id: string;
  model: string;
  type: VehicleType;
  acquisitionDate: string;
  lastMaintenance: string;
  status: VehicleStatus;
  hourMeter: number;
  capacity?: string;
};

const VehiclesPage = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Use real database hooks
  const { data: vehicles = [], isLoading } = useVehicles();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  
  // Transform database data to match Vehicle interface
  const transformedVehicles = vehicles.map(vehicle => ({
    id: vehicle.id,
    model: vehicle.model,
    type: vehicle.type as VehicleType,
    acquisitionDate: vehicle.acquisition_date ? 
      new Date(vehicle.acquisition_date).toLocaleDateString('pt-BR') : '',
    lastMaintenance: vehicle.last_maintenance ? 
      new Date(vehicle.last_maintenance).toLocaleDateString('pt-BR') : '',
    status: vehicle.status as VehicleStatus,
    hourMeter: vehicle.hour_meter || 0,
    capacity: vehicle.capacity
  }));
  
  // Filter vehicles
  const filteredVehicles = transformedVehicles.filter(vehicle => {
    const matchesSearch = vehicle.model.toLowerCase().includes(search.toLowerCase()) || 
                          vehicle.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = type === 'all' || vehicle.type === type;
    const matchesStatus = status === 'all' || vehicle.status === status;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSaveVehicle = (vehicleData: CreateVehiclePayload) => {
    if (editingVehicle) {
      updateVehicle.mutate({
        vehicleId: editingVehicle.id,
        payload: vehicleData
      });
    } else {
      createVehicle.mutate(vehicleData);
    }
    setEditingVehicle(null);
    setShowDialog(false);
  };

  const handleEditVehicle = (vehicle: TransformedVehicle) => {
    // Find original vehicle data from database
    const originalVehicle = vehicles.find(v => v.id === vehicle.id);
    setEditingVehicle(originalVehicle || null);
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

  // Calculate stats
  const totalVehicles = filteredVehicles.length;
  const activeVehicles = filteredVehicles.filter(v => v.status === VehicleStatus.OPERATIONAL).length;
  const maintenanceVehicles = filteredVehicles.filter(v => v.status === VehicleStatus.MAINTENANCE).length;

  // Stats cards configuration
  const statsCards = [
    {
      title: 'Total de Veículos',
      value: totalVehicles.toString(),
      subtitle: 'veículos cadastrados',
      icon: Car
    },
    {
      title: 'Veículos Ativos',
      value: activeVehicles.toString(),
      subtitle: 'em operação',
      icon: Truck
    },
    {
      title: 'Em Manutenção',
      value: maintenanceVehicles.toString(),
      subtitle: 'necessitam reparo',
      icon: Settings
    }
  ];

  // Actions configuration
  const actions = [
    {
      label: "Novo Veículo",
      mobileLabel: "Novo",
      onClick: () => {
        setEditingVehicle(null);
        setShowDialog(true);
      },
      icon: <Plus className="w-4 h-4" />,
      className: 'w-full sm:w-auto'
    }
  ];

  return (
    <PageLayout
      title="Frota"
      subtitle="Gerenciamento de Veículos"
      isLoading={isLoading}
      selectedMonth=""
      onMonthChange={() => {}}
      showMonthFilter={false}
      statsCards={statsCards}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Buscar por modelo ou ID..."
      actions={actions}
    >
      <div className="space-y-6">
        {/* Filters - mobile friendly */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="truck">Caminhão</SelectItem>
              <SelectItem value="car">Carro</SelectItem>
              <SelectItem value="motorcycle">Moto</SelectItem>
              <SelectItem value="heavy_machinery">Máquina Pesada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vehicles Grid - responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="relative group">
              <VehicleCard vehicle={vehicle} />
              
              {/* Action buttons overlay - touch friendly */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-9 w-9 p-0 bg-white/90 hover:bg-white touch-manipulation"
                  onClick={() => handleEditVehicle(vehicle)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-9 w-9 p-0 bg-red-500/90 hover:bg-red-600 touch-manipulation"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhum veículo encontrado</p>
            <p className="text-sm">Tente ajustar os filtros ou adicione um novo veículo</p>
          </div>
        )}
      </div>

      <Suspense fallback={<div />}>
        <VehicleDialog
          open={showDialog}
          onOpenChange={handleDialogClose}
          vehicle={editingVehicle}
          onSave={handleSaveVehicle}
        />
      </Suspense>
    </PageLayout>
  );
};

export default VehiclesPage;
