
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, Plus, Search, Truck, User, AlertOctagon } from 'lucide-react';
import { Maintenance, MaintenanceStatus } from '@/types';
import MaintenanceDialog from '@/components/maintenance/MaintenanceDialog';
import { useToast } from '@/hooks/use-toast';

const MaintenancePage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [maintenanceItems, setMaintenanceItems] = useState<Maintenance[]>([]);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  
  // Filter maintenance based on search and filters
  const filteredMaintenance = maintenanceItems.filter(maintenance => {
    // Search filter
    const matchesSearch = maintenance.vehicleModel.toLowerCase().includes(search.toLowerCase()) || 
                          maintenance.issue.toLowerCase().includes(search.toLowerCase()) ||
                          maintenance.reportedBy.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || maintenance.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const dateParts = dateString.split('-');
      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    } catch (e) {
      return dateString;
    }
  };

  // Get status classes
  const getStatusClass = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.WAITING:
        return 'bg-status-warning/10 text-status-warning';
      case MaintenanceStatus.IN_PROGRESS:
        return 'bg-status-maintenance/10 text-status-maintenance';
      case MaintenanceStatus.COMPLETED:
        return 'bg-status-operational/10 text-status-operational';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Handle add/edit maintenance
  const handleSaveMaintenance = (maintenanceData: Maintenance) => {
    if (editDialogOpen) {
      // Update existing maintenance
      setMaintenanceItems(prev => 
        prev.map(m => m.id === maintenanceData.id ? maintenanceData : m)
      );
    } else {
      // Add new maintenance
      setMaintenanceItems(prev => [...prev, maintenanceData]);
    }
  };

  // Handle edit maintenance
  const handleEditMaintenance = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setEditDialogOpen(true);
  };

  // Handle delete maintenance
  const handleDeleteMaintenance = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este registro de manutenção?")) {
      setMaintenanceItems(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Manutenção excluída",
        description: "O registro de manutenção foi excluído com sucesso."
      });
    }
  };

  // Translate status
  const getStatusTranslation = (status: MaintenanceStatus) => {
    return status;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col min-w-0",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Manutenção" 
          subtitle="Gestão de Manutenções"
        />
        
        <main className="flex-1 px-3 md:px-6 py-4 md:py-6 overflow-x-hidden">
          {/* Filter section */}
          <div className="flex flex-col gap-3 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
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
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 text-sm"
                  onClick={() => toast({
                    title: "Filtros",
                    description: "Esta funcionalidade permitiria filtros mais avançados."
                  })}
                >
                  <Filter className="w-4 h-4" />
                  Filtrar
                </Button>
                <Button 
                  className="gap-2 text-sm"
                  onClick={() => {
                    setSelectedMaintenance(null);
                    setAddDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  {isMobile ? 'Nova' : 'Nova Manutenção'}
                </Button>
              </div>
            </div>
            
            {/* Filter options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Status</h4>
                <select 
                  className="w-full p-2 text-sm rounded-md border border-input bg-background"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value={MaintenanceStatus.WAITING}>Aguardando</option>
                  <option value={MaintenanceStatus.IN_PROGRESS}>Em andamento</option>
                  <option value={MaintenanceStatus.COMPLETED}>Concluído</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Maintenance Cards - Waiting & In Progress */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4">Manutenções Pendentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {filteredMaintenance
                .filter(m => m.status !== MaintenanceStatus.COMPLETED)
                .map((maintenance) => (
                  <div key={maintenance.id} className="bg-card border rounded-lg overflow-hidden shadow">
                    <div className="p-3 md:p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm md:text-base font-medium truncate">Manutenção #{maintenance.id}</h3>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">{maintenance.vehicleModel}</p>
                        </div>
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs whitespace-nowrap ml-2",
                          getStatusClass(maintenance.status)
                        )}>
                          {getStatusTranslation(maintenance.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-2 md:p-3 bg-muted/30 rounded-md">
                          <div className="flex items-start gap-2">
                            <AlertOctagon className="w-4 h-4 text-status-warning mt-0.5 flex-shrink-0" />
                            <p className="text-xs md:text-sm break-words">{maintenance.issue}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs md:text-sm truncate">{maintenance.vehicleId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs md:text-sm truncate">Reportado por: {maintenance.reportedBy}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs md:text-sm">Data: {formatDate(maintenance.reportedDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t px-3 md:px-4 py-2 md:py-3 bg-muted/30 flex flex-col sm:flex-row justify-between gap-2">
                      <span className="text-xs md:text-sm">ID: {maintenance.id}</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-xs"
                          onClick={() => handleEditMaintenance(maintenance)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteMaintenance(maintenance.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              
              {filteredMaintenance.filter(m => m.status !== MaintenanceStatus.COMPLETED).length === 0 && (
                <div className="col-span-full p-6 md:p-8 text-center bg-card border rounded-lg">
                  <p className="text-muted-foreground text-sm md:text-base">Nenhuma manutenção pendente</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Maintenance History */}
          <div>
            <h2 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4">Histórico de Manutenções</h2>
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">ID</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Veículo</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Problema</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Reportado por</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Data Reportada</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Data Concluída</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Status</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredMaintenance
                      .filter(m => m.status === MaintenanceStatus.COMPLETED)
                      .map((maintenance) => (
                        <tr key={maintenance.id} className="hover:bg-muted/50 transition-colors">
                          <td className="p-2 md:p-4 text-xs md:text-sm">{maintenance.id}</td>
                          <td className="p-2 md:p-4">
                            <div className="text-xs md:text-sm">{maintenance.vehicleModel}</div>
                            <div className="text-xs text-muted-foreground">{maintenance.vehicleId}</div>
                          </td>
                          <td className="p-2 md:p-4 text-xs md:text-sm">{maintenance.issue}</td>
                          <td className="p-2 md:p-4 text-xs md:text-sm">{maintenance.reportedBy}</td>
                          <td className="p-2 md:p-4 text-xs md:text-sm">{formatDate(maintenance.reportedDate)}</td>
                          <td className="p-2 md:p-4 text-xs md:text-sm">{maintenance.completedDate ? formatDate(maintenance.completedDate) : '-'}</td>
                          <td className="p-2 md:p-4">
                            <span className={cn(
                              "inline-flex items-center px-2 py-1 rounded-full text-xs",
                              getStatusClass(maintenance.status)
                            )}>
                              {getStatusTranslation(maintenance.status)}
                            </span>
                          </td>
                          <td className="p-2 md:p-4">
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-xs"
                                onClick={() => handleEditMaintenance(maintenance)}
                              >
                                Editar
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteMaintenance(maintenance.id)}
                              >
                                Excluir
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              
              {filteredMaintenance.filter(m => m.status === MaintenanceStatus.COMPLETED).length === 0 && (
                <div className="p-6 md:p-8 text-center">
                  <p className="text-muted-foreground text-sm md:text-base">Nenhuma manutenção concluída</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Add/Edit Maintenance Dialog */}
      <MaintenanceDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveMaintenance}
        availableVehicles={[]}
        availableOperators={[]}
      />
      
      <MaintenanceDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        maintenance={selectedMaintenance || undefined}
        onSave={handleSaveMaintenance}
        availableVehicles={[]}
        availableOperators={[]}
      />
    </div>
  );
};

export default MaintenancePage;
