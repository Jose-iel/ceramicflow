import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, Plus, Search, Clock, User, MapPin, Pause, CheckCircle } from 'lucide-react';
import { Operation, OperationStatus } from '@/types';
import OperationDialog from '@/components/operations/OperationDialog';
import { useToast } from '@/hooks/use-toast';

// Mock data para operações existentes
const initialOperations: Operation[] = [
  {
    id: 'OP001',
    type: 'Coleta de Barro',
    location: 'Fazenda A',
    operator: 'Carlos Silva',
    startDate: '2023-11-15',
    endDate: null,
    status: OperationStatus.IN_PROGRESS
  },
  {
    id: 'OP002',
    type: 'Transporte de Lenha',
    location: 'Pátio Central',
    operator: 'Maria Oliveira',
    startDate: '2023-11-10',
    endDate: '2023-11-12',
    status: OperationStatus.COMPLETED
  },
  {
    id: 'OP003',
    type: 'Alimentação do Forno',
    location: 'Forno 1',
    operator: 'João Pereira',
    startDate: '2023-11-05',
    endDate: null,
    status: OperationStatus.PAUSED
  },
  {
    id: 'OP004',
    type: 'Manutenção Preventiva',
    location: 'Setor de Manutenção',
    operator: 'Ana Costa',
    startDate: '2023-10-28',
    endDate: '2023-10-30',
    status: OperationStatus.COMPLETED
  },
  {
    id: 'OP005',
    type: 'Controle de Qualidade',
    location: 'Laboratório',
    operator: 'Pedro Santos',
    startDate: '2023-10-25',
    endDate: null,
    status: OperationStatus.IN_PROGRESS
  }
];

const OperationsPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [operations, setOperations] = useState<Operation[]>(initialOperations);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  
  // Filter operations based on search and filters
  const filteredOperations = operations.filter(operation => {
    // Search filter
    const matchesSearch = operation.type.toLowerCase().includes(search.toLowerCase()) || 
                          operation.location.toLowerCase().includes(search.toLowerCase()) ||
                          operation.operator.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || operation.status === statusFilter;
    
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
  const getStatusVariant = (status: OperationStatus) => {
    switch (status) {
      case OperationStatus.IN_PROGRESS:
        return 'secondary';
      case OperationStatus.COMPLETED:
        return 'default';
      case OperationStatus.PAUSED:
        return 'outline';
      default:
        return 'default';
    }
  };

  // Handle add/edit operation
  const handleSaveOperation = (operationData: Operation) => {
    if (editDialogOpen) {
      // Update existing operation
      setOperations(prev => 
        prev.map(op => op.id === operationData.id ? operationData : op)
      );
    } else {
      // Add new operation
      setOperations(prev => [...prev, operationData]);
    }
  };

  // Handle edit operation
  const handleEditOperation = (operation: Operation) => {
    setSelectedOperation(operation);
    setEditDialogOpen(true);
  };

  // Handle delete operation
  const handleDeleteOperation = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta operação?")) {
      setOperations(prev => prev.filter(op => op.id !== id));
      toast({
        title: "Operação excluída",
        description: "A operação foi excluída com sucesso."
      });
    }
  };

  // Translate status
  const getStatusTranslation = (status: OperationStatus) => {
    return status;
  };

  // Calculate stats
  const totalOperations = operations.length;
  const operationsInProgress = operations.filter(op => op.status === OperationStatus.IN_PROGRESS).length;
  const operationsCompleted = operations.filter(op => op.status === OperationStatus.COMPLETED).length;
  const operationsPaused = operations.filter(op => op.status === OperationStatus.PAUSED).length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col min-w-0",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Operações" 
          subtitle="Gestão de Operações"
        />
        
        <main className="flex-1 px-3 md:px-6 py-4 md:py-6 overflow-x-hidden">
          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Total Operações</h3>
              <div className="flex items-center justify-between">
                <p className="text-lg md:text-2xl font-bold">{totalOperations}</p>
                <div className="p-1.5 md:p-2 bg-primary/10 rounded-full">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Em Andamento</h3>
              <div className="flex items-center justify-between">
                <p className="text-lg md:text-2xl font-bold text-blue-600">{operationsInProgress}</p>
                <div className="p-1.5 md:p-2 bg-blue-100 rounded-full">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Concluídas</h3>
              <div className="flex items-center justify-between">
                <p className="text-lg md:text-2xl font-bold text-green-600">{operationsCompleted}</p>
                <div className="p-1.5 md:p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Pausadas</h3>
              <div className="flex items-center justify-between">
                <p className="text-lg md:text-2xl font-bold text-yellow-600">{operationsPaused}</p>
                <div className="p-1.5 md:p-2 bg-yellow-100 rounded-full">
                  <Pause className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter section */}
          <div className="flex flex-col gap-3 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
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
                <Button variant="outline" className="flex items-center gap-2 text-sm">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </Button>
                <Button 
                  className="gap-2 text-sm"
                  onClick={() => {
                    setSelectedOperation(null);
                    setAddDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  {isMobile ? 'Nova' : 'Nova Operação'}
                </Button>
              </div>
            </div>
            
            {/* Filter options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Status</h4>
                <select 
                  className="w-full p-2 text-sm rounded-md border border-input bg-background"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value={OperationStatus.IN_PROGRESS}>Em Andamento</option>
                  <option value={OperationStatus.COMPLETED}>Concluída</option>
                  <option value={OperationStatus.PAUSED}>Pausada</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Operations Cards */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4">Operações Ativas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {filteredOperations
                .filter(op => op.status !== OperationStatus.COMPLETED)
                .map((operation) => (
                  <div key={operation.id} className="bg-card border rounded-lg overflow-hidden shadow">
                    <div className="p-3 md:p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm md:text-base font-medium truncate">Operação #{operation.id}</h3>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">{operation.type}</p>
                        </div>
                        <Badge variant={getStatusVariant(operation.status)} className="text-xs whitespace-nowrap ml-2">
                          {getStatusTranslation(operation.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs md:text-sm truncate">{operation.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs md:text-sm truncate">{operation.operator}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs md:text-sm">Início: {formatDate(operation.startDate)}</span>
                        </div>
                        {operation.endDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs md:text-sm">Fim: {formatDate(operation.endDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="border-t px-3 md:px-4 py-2 md:py-3 bg-muted/30 flex flex-col sm:flex-row justify-between gap-2">
                      <span className="text-xs md:text-sm">ID: {operation.id}</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-xs"
                          onClick={() => handleEditOperation(operation)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteOperation(operation.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              
              {filteredOperations.filter(op => op.status !== OperationStatus.COMPLETED).length === 0 && (
                <div className="col-span-full p-6 md:p-8 text-center bg-card border rounded-lg">
                  <p className="text-muted-foreground text-sm md:text-base">Nenhuma operação ativa</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Operations History */}
          <div>
            <h2 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4">Histórico de Operações</h2>
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">ID</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Tipo</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Local</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Operador</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Início</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Fim</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Status</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOperations
                      .filter(op => op.status === OperationStatus.COMPLETED)
                      .map((operation) => (
                        <tr key={operation.id} className="hover:bg-muted/50 transition-colors">
                          <td className="p-2 md:p-4 text-xs md:text-sm">{operation.id}</td>
                          <td className="p-2 md:p-4 text-xs md:text-sm">{operation.type}</td>
                          <td className="p-2 md:p-4 text-xs md:text-sm">{operation.location}</td>
                          <td className="p-2 md:p-4 text-xs md:text-sm">{operation.operator}</td>
                          <td className="p-2 md:p-4 text-xs md:text-sm">{formatDate(operation.startDate)}</td>
                          <td className="p-2 md:p-4 text-xs md:text-sm">{operation.endDate ? formatDate(operation.endDate) : '-'}</td>
                          <td className="p-2 md:p-4">
                            <Badge variant={getStatusVariant(operation.status)} className="text-xs">
                              {getStatusTranslation(operation.status)}
                            </Badge>
                          </td>
                          <td className="p-2 md:p-4">
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-xs"
                                onClick={() => handleEditOperation(operation)}
                              >
                                Editar
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteOperation(operation.id)}
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
              
              {filteredOperations.filter(op => op.status === OperationStatus.COMPLETED).length === 0 && (
                <div className="p-6 md:p-8 text-center">
                  <p className="text-muted-foreground text-sm md:text-base">Nenhuma operação concluída</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Add/Edit Operation Dialog */}
      <OperationDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveOperation}
      />
      
      <OperationDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        operation={selectedOperation || undefined}
        onSave={handleSaveOperation}
      />
    </div>
  );
};

export default OperationsPage;
