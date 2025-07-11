import { Plus, Calendar, User, Wrench, AlertTriangle } from 'lucide-react';
import { useState, useMemo, Suspense, lazy } from 'react';

import DataTable from '@/components/common/DataTable';
import PageLayout from '@/components/common/PageLayout';
import { Badge } from '@/components/ui/badge';
import { useMaintenances, useCreateMaintenance, useUpdateMaintenance, useDeleteMaintenance, useVehicles, useEmployees } from '@/hooks';
import { useMonthFilter } from '@/hooks/useMonthFilter';
import type { CreateMaintenancePayload, Maintenance } from '@/integrations/supabase/api';
import type { Employee } from '@/integrations/supabase/api/employees';
// Lazy load do dialog
const MaintenanceDialog = lazy(() => import('@/components/maintenance/MaintenanceDialog'));

const MaintenancePage = () => {
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);
  const { selectedMonth, setSelectedMonth, filterDataByMonth } = useMonthFilter();

  // Use real database hooks
  const { data: maintenances = [], isLoading } = useMaintenances();
  const { data: vehicles = [] } = useVehicles();
  const { data: employees = [] } = useEmployees();
  const createMaintenance = useCreateMaintenance();
  const updateMaintenance = useUpdateMaintenance();
  const deleteMaintenance = useDeleteMaintenance();

  // Filter maintenances by month and search
  const filteredMaintenances = useMemo(() => {
    // First filter by month using the reported_date field
    const monthFiltered = filterDataByMonth(maintenances.map(maintenance => ({ ...maintenance, date: maintenance.reported_date })));
    // Then filter by search
    return monthFiltered.filter(maintenance =>
      maintenance.issue?.toLowerCase().includes(search.toLowerCase()) ||
      maintenance.vehicles?.model?.toLowerCase().includes(search.toLowerCase()) ||
      maintenance.reported_by?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [maintenances, search, filterDataByMonth]);

  const handleSaveMaintenance = (maintenanceData: Omit<CreateMaintenancePayload, 'id'>) => {
    if (editingMaintenance) {
      updateMaintenance.mutate({
        maintenanceId: editingMaintenance.id!,
        payload: maintenanceData as CreateMaintenancePayload,
      });
    } else {
      createMaintenance.mutate(maintenanceData as CreateMaintenancePayload);
    }
    setEditingMaintenance(null);
    setShowDialog(false);
  };

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setEditingMaintenance(maintenance);
    setShowDialog(true);
  };

  const handleDeleteMaintenance = (id: string) => {
    // TODO: Implementar dialog de confirmação personalizado
    {
      deleteMaintenance.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'PENDING': { label: 'Pendente', variant: 'destructive' as const },
      'IN_PROGRESS': { label: 'Em Andamento', variant: 'default' as const },
      'COMPLETED': { label: 'Concluída', variant: 'secondary' as const },
    };

    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) {return '-';}
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  // Calculate stats
  const totalMaintenances = filteredMaintenances.length;
  const pendingMaintenances = filteredMaintenances.filter(m => m.status === 'PENDING').length;
  const inProgressMaintenances = filteredMaintenances.filter(m => m.status === 'IN_PROGRESS').length;
  const completedMaintenances = filteredMaintenances.filter(m => m.status === 'COMPLETED').length;

  // Stats cards configuration
  const statsCards = [
    {
      title: 'Total de Manutenções',
      value: totalMaintenances,
      subtitle: 'no período',
      icon: Wrench,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Pendentes',
      value: pendingMaintenances,
      subtitle: 'aguardando execução',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
    },
    {
      title: 'Em Andamento',
      value: inProgressMaintenances,
      subtitle: 'sendo executadas',
      icon: User,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
    },
    {
      title: 'Concluídas',
      value: completedMaintenances,
      subtitle: 'finalizadas',
      icon: Calendar,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
    },
  ];

  // Actions configuration
  const actions = [
    {
      label: 'Nova Manutenção',
      onClick: () => {
        setEditingMaintenance(null);
        setShowDialog(true);
      },
      icon: <Plus className="w-4 h-4" />,
    },
  ];

  // Table columns
  const columns = [
    { key: 'vehicles', label: 'Veículo', render: (value: unknown) => (value as { model: string })?.model || 'N/A' },
    { key: 'issue', label: 'Problema' },
    { key: 'reported_by', label: 'Reportado por' },
    { key: 'reported_date', label: 'Data Relatório', render: (value: unknown) => formatDate(value as string) },
    { key: 'status', label: 'Status', render: (value: unknown) => getStatusBadge(value as string) },
    { key: 'completed_date', label: 'Data Conclusão', render: (value: unknown) => formatDate(value as string) },
  ];

  // Table actions
  const tableActions = [
    {
      label: 'Editar',
      onClick: (row: Record<string, unknown>) => handleEditMaintenance(row as unknown as Maintenance),
    },
    {
      label: 'Excluir',
      variant: 'ghost' as const,
      className: 'text-red-500 hover:text-red-700 hover:bg-red-50',
      onClick: (row: Record<string, unknown>) => handleDeleteMaintenance((row as unknown as Maintenance).id!),
    },
  ];

  return (
    <PageLayout
      actions={actions}
      isLoading={isLoading}
      searchPlaceholder="Buscar por problema, veículo ou responsável..."
      searchValue={search}
      selectedMonth={selectedMonth}
      statsCards={statsCards}
      subtitle="Controle de Manutenções de Veículos"
      title="Manutenções"
      onMonthChange={setSelectedMonth}
      onSearchChange={setSearch}
    >
      <div className="space-y-6">
        <DataTable
          actions={tableActions}
          columns={columns}
          data={filteredMaintenances as unknown as Record<string, unknown>[]}
          emptyMessage="Nenhuma manutenção encontrada para este período"
          minWidth="800px"
        />
      </div>

      <Suspense fallback={<div />}>
        <MaintenanceDialog
          availableOperators={(employees as Employee[]).map(e => ({ id: e.id, name: e.name }))}
          availableVehicles={vehicles.map(v => ({ id: v.id, model: v.model }))}
          maintenance={editingMaintenance}
          open={showDialog}
          onOpenChange={setShowDialog}
          onSave={handleSaveMaintenance}
        />
      </Suspense>
    </PageLayout>
  );
};

export default MaintenancePage;
