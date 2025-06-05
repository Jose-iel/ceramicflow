
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Filter, Plus, Search, Truck, User, MapPin, CheckCircle } from 'lucide-react';
import { Operation } from '@/types';
import { useToast } from '@/hooks/use-toast';
import OperationDialog from '@/components/operations/OperationDialog';
import OperationDetails from '@/components/operations/OperationDetails';

// Mock data for operations - Updated for general operations
const initialOperations: Operation[] = [
  {
    id: 'OP001',
    employeeId: 'EMP001',
    employeeName: 'Carlos Silva',
    vehicleId: 'G001',
    vehicleModel: 'Toyota 8FGU25',
    operationType: 'vehicle',
    location: 'Armazém A',
    description: 'Movimentação de material',
    initialHourMeter: 12500,
    currentHourMeter: 12583,
    gasConsumption: 25.5,
    startTime: '2023-11-20T08:00:00',
    status: 'active'
  },
  {
    id: 'OP002',
    employeeId: 'EMP002',
    employeeName: 'João Santos',
    operationType: 'manual',
    location: 'Barreiro - Setor Norte',
    description: 'Extração de argila',
    startTime: '2023-11-20T14:00:00',
    status: 'active'
  },
  {
    id: 'OP003',
    employeeId: 'EMP003',
    employeeName: 'Maria Oliveira',
    operationType: 'manual',
    location: 'Forno 1',
    description: 'Alimentação do forno',
    startTime: '2023-11-20T22:00:00',
    status: 'active'
  },
  {
    id: 'OP004',
    employeeId: 'EMP004',
    employeeName: 'Ana Costa',
    vehicleId: 'T001',
    vehicleModel: 'Scania P320',
    operationType: 'vehicle',
    location: 'Transporte - Barreiro',
    description: 'Transporte de argila',
    initialHourMeter: 8350,
    currentHourMeter: 8400,
    startTime: '2023-11-19T08:00:00',
    endTime: '2023-11-19T16:00:00',
    status: 'completed'
  },
];

// Mock data for available employees and vehicles
const availableEmployees = [
  { id: 'EMP001', name: 'Carlos Silva' },
  { id: 'EMP002', name: 'João Santos' },
  { id: 'EMP003', name: 'Maria Oliveira' },
  { id: 'EMP004', name: 'Ana Costa' },
  { id: 'EMP005', name: 'Pedro Mendes' }
];

const availableVehicles = [
  { id: 'G001', model: 'Toyota 8FGU25' },
  { id: 'T001', model: 'Scania P320' },
  { id: 'E002', model: 'Hyster E50XN' },
  { id: 'L001', model: 'Caterpillar 950M' }
];

const OperationsPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [operations, setOperations] = useState<Operation[]>(initialOperations);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  
  // Filter operations based on search and filters
  const filteredOperations = operations.filter(operation => {
    // Search filter
    const matchesSearch = operation.employeeName.toLowerCase().includes(search.toLowerCase()) || 
                          operation.location.toLowerCase().includes(search.toLowerCase()) ||
                          operation.description.toLowerCase().includes(search.toLowerCase()) ||
                          operation.id.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesStatus = status === 'all' || operation.status === status;
    
    // Location filter
    const matchesLocation = location === 'all' || operation.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get unique locations for filter
  const locations = [...new Set(operations.map(op => op.location))];

  // Handle save operation
  const handleSaveOperation = (operationData: Operation) => {
    const isNewOperation = !operations.some(op => op.id === operationData.id);
    
    if (isNewOperation) {
      // Add new operation
      setOperations(prev => [operationData, ...prev]);
      toast({
        title: "Operação criada",
        description: "A operação foi criada com sucesso."
      });
    } else {
      // Update existing operation
      setOperations(prev => 
        prev.map(op => op.id === operationData.id ? operationData : op)
      );
      toast({
        title: "Operação atualizada",
        description: "A operação foi atualizada com sucesso."
      });
    }
  };

  // Complete operation directly from card
  const handleCompleteOperation = (operation: Operation) => {
    const completedOperation: Operation = {
      ...operation,
      status: 'completed',
      endTime: new Date().toISOString()
    };
    
    setOperations(prev => 
      prev.map(op => op.id === operation.id ? completedOperation : op)
    );
    
    toast({
      title: "Operação finalizada",
      description: `A operação de ${operation.employeeName} foi finalizada.`
    });
  };

  // Open details dialog
  const handleViewDetails = (operation: Operation) => {
    setSelectedOperation(operation);
    setDetailsDialogOpen(true);
  };

  // Open edit dialog from details
  const handleEditFromDetails = () => {
    setDetailsDialogOpen(false);
    setEditDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Operações" 
          subtitle="Controle de Operações Gerais"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Filter section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Buscar operação..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </Button>
              </div>
              <Button 
                className="gap-2"
                onClick={() => {
                  setSelectedOperation(null);
                  setAddDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Nova Operação
              </Button>
            </div>
          </div>
          
          {/* Filter options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Status</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="active">Em Andamento</option>
                <option value="completed">Concluídas</option>
              </select>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Local</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="all">Todos</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Active Operations */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Operações em Andamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOperations
                .filter(op => op.status === 'active')
                .map((operation) => (
                  <div key={operation.id} className="bg-card border rounded-lg overflow-hidden shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{operation.employeeName}</h3>
                          <p className="text-sm text-muted-foreground">ID: {operation.id}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                          Em Andamento
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{operation.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{operation.description}</span>
                        </div>
                        {operation.vehicleModel && (
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{operation.vehicleModel} ({operation.vehicleId})</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(operation.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Início: {formatTime(operation.startTime)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t px-4 py-3 bg-muted/30 flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(operation)}
                      >
                        Detalhes
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="gap-1"
                        onClick={() => handleCompleteOperation(operation)}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Finalizar
                      </Button>
                    </div>
                  </div>
                ))}
              
              {filteredOperations.filter(op => op.status === 'active').length === 0 && (
                <div className="col-span-full p-8 text-center bg-card border rounded-lg">
                  <p className="text-muted-foreground">Nenhuma operação em andamento</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Completed Operations */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Operações Concluídas</h2>
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-medium text-muted-foreground">ID</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Funcionário</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Local</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Descrição</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Data</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Período</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOperations
                      .filter(op => op.status === 'completed')
                      .map((operation) => (
                        <tr key={operation.id} className="hover:bg-muted/50 transition-colors">
                          <td className="p-4">{operation.id}</td>
                          <td className="p-4">{operation.employeeName}</td>
                          <td className="p-4">{operation.location}</td>
                          <td className="p-4">{operation.description}</td>
                          <td className="p-4">{formatDate(operation.startTime)}</td>
                          <td className="p-4">
                            {formatTime(operation.startTime)} - {operation.endTime ? formatTime(operation.endTime) : 'Em andamento'}
                          </td>
                          <td className="p-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(operation)}
                            >
                              Detalhes
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              
              {filteredOperations.filter(op => op.status === 'completed').length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhuma operação concluída</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Operation Dialog */}
      <OperationDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveOperation}
        availableOperators={availableEmployees}
        availableForklifts={availableVehicles}
      />
      
      {/* Edit Operation Dialog */}
      <OperationDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        operation={selectedOperation || undefined}
        onSave={handleSaveOperation}
        availableOperators={availableEmployees}
        availableForklifts={availableVehicles}
      />
      
      {/* Operation Details Dialog */}
      <OperationDetails
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        operation={selectedOperation}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
};

export default OperationsPage;
