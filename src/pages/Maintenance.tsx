
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Plus, Search, Filter, Edit, Trash2, Calendar, User } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import MaintenanceDialog from '@/components/maintenance/MaintenanceDialog';
import { Badge } from '@/components/ui/badge';
import { useMaintenances, useCreateMaintenance, useUpdateMaintenance, useDeleteMaintenance } from '@/hooks/useMaintenances';
import { useVehicles } from '@/hooks/useVehicles';
import { useEmployees } from '@/hooks/useEmployees';

const MaintenancePage = () => {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<any | null>(null);

  // Use real database hooks
  const { data: maintenances = [], isLoading } = useMaintenances();
  const { data: vehicles = [] } = useVehicles();
  const { data: employees = [] } = useEmployees();
  const createMaintenance = useCreateMaintenance();
  const updateMaintenance = useUpdateMaintenance();
  const deleteMaintenance = useDeleteMaintenance();

  // Prepare data for selects
  const availableVehicles = vehicles.map(vehicle => ({
    id: vehicle.id,
    model: vehicle.model
  }));

  const availableOperators = employees.map(employee => ({
    id: employee.id,
    name: employee.name
  }));

  // Filter maintenances
  const filteredMaintenances = maintenances.filter(maintenance => 
    maintenance.issue?.toLowerCase().includes(search.toLowerCase()) ||
    maintenance.vehicles?.model?.toLowerCase().includes(search.toLowerCase()) ||
    maintenance.reported_by?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveMaintenance = (maintenanceData: any) => {
    if (editingMaintenance) {
      updateMaintenance.mutate({
        maintenanceId: editingMaintenance.id,
        maintenanceData: maintenanceData
      });
    } else {
      createMaintenance.mutate(maintenanceData);
    }
    setEditingMaintenance(null);
    setShowDialog(false);
  };

  const handleEditMaintenance = (maintenance: any) => {
    setEditingMaintenance(maintenance);
    setShowDialog(true);
  };

  const handleDeleteMaintenance = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta manutenção?")) {
      deleteMaintenance.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'WAITING': { label: 'Aguardando', variant: 'outline' as const },
      'IN_PROGRESS': { label: 'Em Andamento', variant: 'default' as const },
      'COMPLETED': { label: 'Concluída', variant: 'secondary' as const },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
          <Navbar title="Manutenção" subtitle="Gestão de Manutenções" />
          <main className="flex-1 px-6 py-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando manutenções...</p>
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
          title="Manutenção" 
          subtitle="Gestão de Manutenções"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Header with search and actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Buscar manutenção..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtrar
              </Button>
              <Button 
                className="gap-2" 
                onClick={() => {
                  setEditingMaintenance(null);
                  setShowDialog(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Nova Manutenção
              </Button>
            </div>
          </div>

          {/* Maintenances Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaintenances.map((maintenance) => (
              <div key={maintenance.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {maintenance.vehicles?.model || 'Veículo não especificado'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {maintenance.vehicles?.type || ''}
                    </p>
                  </div>
                  {getStatusBadge(maintenance.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-900">
                    <strong>Problema:</strong> {maintenance.issue}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    {maintenance.reported_by}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {maintenance.reported_date ? 
                      new Date(maintenance.reported_date).toLocaleDateString('pt-BR') : 
                      'Data não informada'
                    }
                  </div>
                  {maintenance.completed_date && (
                    <div className="text-sm text-gray-600">
                      <strong>Concluída em:</strong> {new Date(maintenance.completed_date).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditMaintenance(maintenance)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteMaintenance(maintenance.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredMaintenances.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <p>Nenhuma manutenção encontrada</p>
              <p className="text-sm mt-2">Adicione uma nova manutenção para começar</p>
            </div>
          )}
        </main>
      </div>

      <MaintenanceDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        maintenance={editingMaintenance}
        onSave={handleSaveMaintenance}
        availableVehicles={availableVehicles}
        availableOperators={availableOperators}
      />
    </div>
  );
};

export default MaintenancePage;
