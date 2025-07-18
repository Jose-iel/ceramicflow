import { useQueryClient } from '@tanstack/react-query';
import { Plus, MapPin, Clock, Settings } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

import DataTable from '@/components/common/DataTable';
import { DeleteConfirmationDialog } from '@/components/common/DeleteConfirmationDialog';
import PageLayout from '@/components/common/PageLayout';
import OperationDialog from '@/components/operations/OperationDialog';
import { Badge } from '@/components/ui/badge';
import { useOperations, useCreateOperation, useUpdateOperation, useDeleteOperation, useVehicles, useEmployees } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { useMonthFilter } from '@/hooks/useMonthFilter';
import type { CreateOperationPayload } from '@/integrations/supabase/api';
import type { Employee } from '@/integrations/supabase/api/employees';
import type { OperationStatus } from '@/types';

// Tipo para dados brutos do Supabase
interface OperationRawData {
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
  fuel_consumption?: number;
  ceramic_id: string;
  created_at: string;
  updated_at: string;
  vehicles?: { model: string; type: string } | null;
  employees?: { name: string } | null;
}

const OperationsPage = () => {
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingOperation, setEditingOperation] = useState<OperationRawData | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [operationToDelete, setOperationToDelete] = useState<{ id: string; name: string } | null>(null);
  const { selectedMonth, setSelectedMonth, filterDataByMonth } = useMonthFilter();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Forçar reload dos dados quando o componente monta
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['operations'] });
  }, [queryClient]);

  // Use real database hooks
  const { data: operations = [], isLoading } = useOperations();
  const { data: vehicles = [] } = useVehicles();
  const { data: employees = [] } = useEmployees();
  const createOperation = useCreateOperation();
  const updateOperation = useUpdateOperation();
  const deleteOperation = useDeleteOperation();

  // Debug log para verificar dados
  useEffect(() => {
    if (operations.length > 0) {
      // Debug: Operations loaded and status breakdown
    }
  }, [operations]);

  // Filter operations by month and search
  const filteredOperations = useMemo(() => {
    // First filter by month using the start_date field
    const monthFiltered = filterDataByMonth(operations.map(operation => ({ ...operation, date: operation.start_date })));

    // Then filter by search
    const finalFiltered = monthFiltered.filter(
      operation =>
        operation.type?.toLowerCase().includes(search.toLowerCase()) ||
        operation.location?.toLowerCase().includes(search.toLowerCase()) ||
        operation.operator?.toLowerCase().includes(search.toLowerCase())
    );

    return finalFiltered;
  }, [operations, search, filterDataByMonth]);

  const handleSaveOperation = (operationData: Record<string, unknown>) => {
    if (editingOperation) {
      updateOperation.mutate(
        {
          operationId: editingOperation.id,
          payload: operationData as unknown as CreateOperationPayload,
        },
        {
          onSuccess: () => {
            toast({
              title: 'Operação atualizada',
              description: 'A operação foi atualizada com sucesso.',
            });
          },
        }
      );
    } else {
      createOperation.mutate(operationData as unknown as CreateOperationPayload, {
        onSuccess: () => {
          toast({
            title: 'Operação criada',
            description: 'A operação foi criada com sucesso.',
          });
        },
      });
    }
    setEditingOperation(null);
    setShowDialog(false);
  };

  const handleEditOperation = (operation: OperationRawData) => {
    setEditingOperation(operation);
    setShowDialog(true);
  };

  const handleDeleteOperation = (operation: OperationRawData) => {
    setOperationToDelete({
      id: operation.id,
      name: `${operation.type} - ${operation.location || 'Local não informado'}`,
    });
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (operationToDelete) {
      try {
        await deleteOperation.mutateAsync(operationToDelete.id);
        toast({
          title: 'Operação excluída',
          description: `A operação ${operationToDelete.name} foi excluída com sucesso.`,
        });
      } catch {
        toast({
          title: 'Erro ao excluir',
          description: 'Ocorreu um erro ao excluir a operação.',
          variant: 'destructive',
        });
      }
    }
    setShowDeleteDialog(false);
    setOperationToDelete(null);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      IN_PROGRESS: { label: 'Em Andamento', variant: 'default' as const },
      'Em Andamento': { label: 'Em Andamento', variant: 'default' as const },
      COMPLETED: { label: 'Concluída', variant: 'secondary' as const },
      Concluída: { label: 'Concluída', variant: 'secondary' as const },
      PAUSED: { label: 'Pausada', variant: 'outline' as const },
      Pausada: { label: 'Pausada', variant: 'outline' as const },
    };

    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  // Calculate stats - usar operações filtradas por mês (mantendo funcionalidade do filtro)
  const totalOperations = filteredOperations.length;
  const activeOperations = filteredOperations.filter(op => op.status === 'IN_PROGRESS' || op.status === 'Em Andamento').length;
  const completedOperations = filteredOperations.filter(op => op.status === 'COMPLETED' || op.status === 'Concluída').length;
  const totalFuelConsumption = filteredOperations.reduce((sum, op) => {
    // Suporte para ambos os campos durante a transição
    const opWithConsumption = op as unknown as { fuel_consumption?: number; gas_consumption?: number };
    const consumption = opWithConsumption.fuel_consumption || opWithConsumption.gas_consumption || 0;
    return sum + consumption;
  }, 0);

  // Stats cards configuration
  const statsCards = [
    {
      title: 'Total de Operações',
      value: totalOperations,
      subtitle: 'operações cadastradas',
      icon: Settings,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Em Andamento',
      value: activeOperations,
      subtitle: 'operações ativas',
      icon: Clock,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
    },
    {
      title: 'Concluídas',
      value: completedOperations,
      subtitle: 'operações finalizadas',
      icon: MapPin,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
    },
    {
      title: 'Consumo de Combustível',
      value: `${totalFuelConsumption.toFixed(1)}L`,
      subtitle: 'total consumido',
      icon: Settings,
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
    },
  ];

  // Actions configuration
  const actions = [
    {
      label: 'Nova Operação',
      onClick: () => {
        setEditingOperation(null);
        setShowDialog(true);
      },
      icon: <Plus className="w-4 h-4" />,
    },
  ];

  // Table columns - mobile responsive
  const columns = [
    {
      key: 'type',
      label: 'Tipo',
      className: 'min-w-[120px]',
    },
    {
      key: 'location',
      label: 'Local',
      render: (value: unknown) => (value as string) || '-',
      className: 'min-w-[120px] hidden sm:table-cell',
    },
    {
      key: 'operator',
      label: 'Operador',
      className: 'min-w-[150px]',
    },
    {
      key: 'start_date',
      label: 'Data Início',
      render: (value: unknown) => (value ? formatDate(value as string) : '-'),
      className: 'min-w-[110px] hidden md:table-cell',
    },
    {
      key: 'end_date',
      label: 'Data Fim',
      render: (value: unknown) => (value ? formatDate(value as string) : '-'),
      className: 'min-w-[110px] hidden lg:table-cell',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => getStatusBadge(value as string),
      className: 'min-w-[100px]',
    },
    {
      key: 'fuel_consumption',
      label: 'Consumo de Combustível',
      render: (value: unknown) => {
        // Suporte para ambos os campos durante a transição
        const rowWithConsumption = value as unknown as { fuel_consumption?: number; gas_consumption?: number };
        const consumption = (value as number) || rowWithConsumption?.gas_consumption || 0;
        return consumption ? `${consumption}L` : '-';
      },
      className: 'min-w-[140px] hidden xl:table-cell',
    },
  ];

  // Table actions - mobile friendly
  const tableActions = [
    {
      label: 'Editar',
      onClick: (row: Record<string, unknown>) => handleEditOperation(row as unknown as OperationRawData),
      variant: 'outline' as const,
      className: 'sm:w-auto w-full mb-2 sm:mb-0',
    },
    {
      label: 'Excluir',
      variant: 'ghost' as const,
      className: 'text-red-500 hover:text-red-700 hover:bg-red-50 sm:w-auto w-full',
      onClick: (row: Record<string, unknown>) => handleDeleteOperation(row as unknown as OperationRawData),
    },
  ];

  return (
    <PageLayout
      actions={actions}
      isLoading={isLoading}
      searchPlaceholder="Buscar por tipo, local ou operador..."
      searchValue={search}
      selectedMonth={selectedMonth}
      statsCards={statsCards}
      subtitle="Controle Operacional"
      title="Operações"
      onMonthChange={setSelectedMonth}
      onSearchChange={setSearch}
    >
      <div className="space-y-6">
        <DataTable
          showMobileCards
          actions={tableActions}
          columns={columns}
          data={filteredOperations as unknown as Record<string, unknown>[]}
          emptyMessage="Nenhuma operação encontrada para este período"
          isLoading={isLoading}
          minWidth="600px"
        />
      </div>

      <OperationDialog
        availableOperators={(employees as Employee[]).map(e => ({ id: e.id, name: e.name }))}
        availableVehicles={vehicles.map(v => ({ id: v.id, model: v.model }))}
        open={showDialog}
        operation={
          editingOperation
            ? {
                ...editingOperation,
                status: editingOperation.status as OperationStatus,
              }
            : null
        }
        onOpenChange={setShowDialog}
        onSave={handleSaveOperation}
      />

      <DeleteConfirmationDialog
        cancelText="Cancelar"
        confirmText="Excluir"
        description="Esta ação não pode ser desfeita."
        itemName={operationToDelete?.name}
        itemType="operação"
        open={showDeleteDialog}
        trigger={<></>}
        onConfirm={confirmDelete}
        onOpenChange={setShowDeleteDialog}
      />
    </PageLayout>
  );
};

export default OperationsPage;
