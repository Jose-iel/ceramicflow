import { useState, useMemo } from 'react';
import { Plus, MapPin, Clock, Settings } from 'lucide-react';
import PageLayout from '@/components/common/PageLayout';
import DataTable from '@/components/common/DataTable';
import OperationDialog from '@/components/operations/OperationDialog';
import { Badge } from '@/components/ui/badge';
import { useOperations, useCreateOperation, useUpdateOperation, useDeleteOperation } from '@/hooks';
import { CreateOperationPayload, Operation } from '@/integrations/supabase/api';
import { useVehicles } from '@/hooks';
import { useEmployees } from '@/hooks';
import type { Employee } from '@/integrations/supabase/api/employees';
import { useMonthFilter } from '@/hooks/useMonthFilter';
import { OperationStatus } from '@/types';

// Tipo para dados brutos do Supabase
type OperationRawData = {
  id: string;
  type: string;
  location?: string;
  operator: string;
  start_date?: string;
  end_date?: string;
  status: OperationStatus | string;
  employee_id?: string;
  vehicle_id?: string;
  operation_type: string;
  description?: string;
  initial_hour_meter?: number;
  current_hour_meter?: number;
  start_time?: string;
  end_time?: string;
  gas_consumption?: number;
  ceramic_id: string;
  created_at: string;
  updated_at: string;
  vehicles?: { model: string; type: string } | null;
  employees?: { name: string } | null;
};

const OperationsPage = () => {
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingOperation, setEditingOperation] = useState<OperationRawData | null>(null);
  const { selectedMonth, setSelectedMonth, filterDataByMonth } = useMonthFilter();

  // Use real database hooks
  const { data: operations = [], isLoading } = useOperations();
  const { data: vehicles = [] } = useVehicles();
  const { data: employees = [] } = useEmployees();
  const createOperation = useCreateOperation();
  const updateOperation = useUpdateOperation();
  const deleteOperation = useDeleteOperation();

  // Filter operations by month and search
  const filteredOperations = useMemo(() => {
    // First filter by month using the start_date field
    const monthFiltered = filterDataByMonth(operations.map(operation => ({ ...operation, date: operation.start_date })));
    // Then filter by search
    return monthFiltered.filter(operation => 
      operation.type?.toLowerCase().includes(search.toLowerCase()) ||
      operation.location?.toLowerCase().includes(search.toLowerCase()) ||
      operation.operator?.toLowerCase().includes(search.toLowerCase())
    );
  }, [operations, search, filterDataByMonth]);

  const handleSaveOperation = (operationData: Record<string, unknown>) => {
    if (editingOperation) {
      updateOperation.mutate({
        operationId: editingOperation.id,
        payload: operationData as unknown as CreateOperationPayload
      });
    } else {
      createOperation.mutate(operationData as unknown as CreateOperationPayload);
    }
    setEditingOperation(null);
    setShowDialog(false);
  };

  const handleEditOperation = (operation: OperationRawData) => {
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (e) {
      return dateString;
    }
  };

  // Calculate stats
  const totalOperations = filteredOperations.length;
  const activeOperations = filteredOperations.filter(op => op.status === 'IN_PROGRESS').length;
  const completedOperations = filteredOperations.filter(op => op.status === 'COMPLETED').length;
  const totalGasConsumption = filteredOperations.reduce((sum, op) => sum + (op.gas_consumption || 0), 0);

  // Stats cards configuration
  const statsCards = [
    {
      title: "Total de Operações",
      value: totalOperations,
      subtitle: "operações no período",
      icon: Settings,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100"
    },
    {
      title: "Em Andamento",
      value: activeOperations,
      subtitle: "operações ativas",
      icon: Clock,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100"
    },
    {
      title: "Concluídas",
      value: completedOperations,
      subtitle: "operações finalizadas",
      icon: MapPin,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100"
    },
    {
      title: "Consumo de Gás",
      value: `${totalGasConsumption.toFixed(1)}L`,
      subtitle: "total consumido",
      icon: Settings,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-100"
    }
  ];

  // Actions configuration
  const actions = [
    {
      label: "Nova Operação",
      onClick: () => {
        setEditingOperation(null);
        setShowDialog(true);
      },
      icon: <Plus className="w-4 h-4" />
    }
  ];

  // Table columns - mobile responsive
  const columns = [
    { 
      key: 'type', 
      label: 'Tipo',
      className: 'min-w-[120px]'
    },
    { 
      key: 'location', 
      label: 'Local', 
      render: (value: unknown) => (value as string) || '-',
      className: 'min-w-[120px] hidden sm:table-cell'
    },
    { 
      key: 'operator', 
      label: 'Operador',
      className: 'min-w-[150px]'
    },
    { 
      key: 'start_date', 
      label: 'Data Início', 
      render: (value: unknown) => value ? formatDate(value as string) : '-',
      className: 'min-w-[110px] hidden md:table-cell'
    },
    { 
      key: 'end_date', 
      label: 'Data Fim', 
      render: (value: unknown) => value ? formatDate(value as string) : '-',
      className: 'min-w-[110px] hidden lg:table-cell'
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: unknown) => getStatusBadge(value as string),
      className: 'min-w-[100px]'
    },
    { 
      key: 'gas_consumption', 
      label: 'Consumo Gás', 
      render: (value: unknown) => value ? `${value}L` : '-',
      className: 'min-w-[120px] hidden xl:table-cell'
    }
  ];

  // Table actions - mobile friendly
  const tableActions = [
    {
      label: "Editar",
      onClick: (row: Record<string, unknown>) => handleEditOperation(row as unknown as OperationRawData),
      variant: 'outline' as const,
      className: 'sm:w-auto w-full mb-2 sm:mb-0'
    },
    {
      label: "Excluir",
      variant: "ghost" as const,
      className: "text-red-500 hover:text-red-700 hover:bg-red-50 sm:w-auto w-full",
      onClick: (row: Record<string, unknown>) => handleDeleteOperation((row as unknown as OperationRawData).id)
    }
  ];

  return (
    <PageLayout
      title="Operações"
      subtitle="Controle Operacional"
      selectedMonth={selectedMonth}
      onMonthChange={setSelectedMonth}
      statsCards={statsCards}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Buscar por tipo, local ou operador..."
      actions={actions}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        <DataTable
          data={filteredOperations as unknown as Record<string, unknown>[]}
          columns={columns}
          actions={tableActions}
          emptyMessage="Nenhuma operação encontrada para este período"
          minWidth="600px"
          isLoading={isLoading}
          showMobileCards={true}
        />
      </div>

      <OperationDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSave={handleSaveOperation}
        operation={editingOperation ? {
          ...editingOperation,
          status: editingOperation.status as OperationStatus
        } : null}
        availableOperators={(employees as Employee[]).map(e => ({ id: e.id, name: e.name }))}
        availableVehicles={vehicles.map(v => ({ id: v.id, model: v.model }))}
      />
    </PageLayout>
  );
};

export default OperationsPage;
