
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Plus, Search, Filter, Edit, Trash2, MapPin } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import OperationDialog from '@/components/operations/OperationDialog';
import { Badge } from '@/components/ui/badge';
import { useOperations, useCreateOperation, useUpdateOperation, useDeleteOperation } from '@/hooks/useOperations';

const OperationsPage = () => {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingOperation, setEditingOperation] = useState<any | null>(null);

  // Use real database hooks
  const { data: operations = [], isLoading } = useOperations();
  const createOperation = useCreateOperation();
  const updateOperation = useUpdateOperation();
  const deleteOperation = useDeleteOperation();

  // Filter operations
  const filteredOperations = operations.filter(operation => 
    operation.type?.toLowerCase().includes(search.toLowerCase()) ||
    operation.location?.toLowerCase().includes(search.toLowerCase()) ||
    operation.operator?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveOperation = (operationData: any) => {
    if (editingOperation) {
      updateOperation.mutate({
        operationId: editingOperation.id,
        operationData: operationData
      });
    } else {
      createOperation.mutate(operationData);
    }
    setEditingOperation(null);
    setShowDialog(false);
  };

  const handleEditOperation = (operation: any) => {
    setEditingOperation(operation);
    setShowDialog(true);
  };

  const handleDeleteOperation = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta operação?")) {
      deleteOperation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'IN_PROGRESS': { label: 'Em Andamento', variant: 'default' as const },
      'COMPLETED': { label: 'Concluída', variant: 'secondary' as const },
      'PAUSED': { label: 'Pausada', variant: 'outline' as const },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
          <Navbar title="Operações" subtitle="Controle Operacional" />
          <main className="flex-1 px-6 py-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando operações...</p>
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
          title="Operações" 
          subtitle="Controle Operacional"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Header with search and actions */}
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
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtrar
              </Button>
              <Button 
                className="gap-2" 
                onClick={() => {
                  setEditingOperation(null);
                  setShowDialog(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Nova Operação
              </Button>
            </div>
          </div>

          {/* Operations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOperations.map((operation) => (
              <div key={operation.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {operation.type}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {operation.vehicles?.model || 'Veículo não especificado'}
                    </p>
                  </div>
                  {getStatusBadge(operation.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {operation.location || 'Local não especificado'}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Operador:</strong> {operation.employees?.name || operation.operator || 'Não especificado'}
                  </div>
                  {operation.start_date && (
                    <div className="text-sm text-gray-600">
                      <strong>Início:</strong> {new Date(operation.start_date).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {operation.description && (
                    <div className="text-sm text-gray-600">
                      <strong>Descrição:</strong> {operation.description}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditOperation(operation)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteOperation(operation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredOperations.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <p>Nenhuma operação encontrada</p>
              <p className="text-sm mt-2">Adicione uma nova operação para começar</p>
            </div>
          )}
        </main>
      </div>

      <OperationDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        operation={editingOperation}
        onSave={handleSaveOperation}
      />
    </div>
  );
};

export default OperationsPage;
