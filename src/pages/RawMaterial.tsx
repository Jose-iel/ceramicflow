
import { Mountain, Plus, Truck } from 'lucide-react';
import { useState, useMemo } from 'react';


import DataTable from '@/components/common/DataTable';
import { DeleteConfirmationDialog } from '@/components/common/DeleteConfirmationDialog';
import PageLayout from '@/components/common/PageLayout';
import ClayConsumptionDialog from '@/components/rawmaterial/ClayConsumptionDialog';
import {
  useClayConsumptions,
  useCreateClayConsumption,
  useUpdateClayConsumption,
  useDeleteClayConsumption,
} from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { useMonthFilter } from '@/hooks/useMonthFilter';
import type { CreateClayConsumptionPayload } from '@/integrations/supabase/api';
import type { ClayConsumptionRawData } from '@/types';

const RawMaterialPage = () => {
  const { toast } = useToast();

  // Month filter hook
  const { selectedMonth, setSelectedMonth, filterDataByMonth } = useMonthFilter();

  // Real database hooks
  const { data: clayConsumptions = [], isLoading } = useClayConsumptions();
  const createClayConsumption = useCreateClayConsumption();
  const updateClayConsumption = useUpdateClayConsumption();
  const deleteClayConsumption = useDeleteClayConsumption();

  // State management
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingConsumption, setEditingConsumption] = useState<ClayConsumptionRawData | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [consumptionToDelete, setConsumptionToDelete] = useState<{ id: string; name: string } | null>(null);

  // Filter data by selected month and search
  const filteredConsumptions = useMemo(() => {
    // First filter by month
    const monthFiltered = filterDataByMonth(clayConsumptions);

    // Then filter by search
    const finalFiltered = monthFiltered.filter(consumption =>
      consumption.supplier?.toLowerCase().includes(search.toLowerCase()) ||
      consumption.origin?.toLowerCase().includes(search.toLowerCase()) ||
      consumption.recorded_by?.toLowerCase().includes(search.toLowerCase()) ||
      consumption.notes?.toLowerCase().includes(search.toLowerCase()),
    );

    return finalFiltered;
  }, [clayConsumptions, filterDataByMonth, search]);

  const totalMonthlyTrucks = filteredConsumptions.reduce((sum, item) => sum + Number(item.trucks_quantity || 0), 0);
  const averageDailyConsumption = filteredConsumptions.length > 0
    ? totalMonthlyTrucks / filteredConsumptions.length
    : 0;

  const handleSaveConsumption = (consumption: {
    date: string;
    trucks_quantity: number;
    supplier?: string;
    origin?: string;
    truck_id?: string;
    recorded_by: string;
    notes?: string;
  }) => {
    if (editingConsumption) {
      updateClayConsumption.mutate({
        clayConsumptionId: editingConsumption.id,
        payload: consumption as unknown as CreateClayConsumptionPayload,
      }, {
        onSuccess: () => {
          toast({
            title: 'Consumo atualizado',
            description: 'O consumo de barro foi atualizado com sucesso.',
          });
        },
      });
    } else {
      createClayConsumption.mutate(consumption as unknown as CreateClayConsumptionPayload, {
        onSuccess: () => {
          toast({
            title: 'Consumo registrado',
            description: 'O consumo de barro foi registrado com sucesso.',
          });
        },
      });
    }
    setEditingConsumption(null);
    setShowDialog(false);
  };

  const handleEditConsumption = (consumption: ClayConsumptionRawData) => {
    setEditingConsumption(consumption);
    setShowDialog(true);
  };

  const handleDeleteConsumption = (consumption: ClayConsumptionRawData) => {
    setConsumptionToDelete({
      id: consumption.id,
      name: `Consumo de ${consumption.trucks_quantity} caminhões - ${new Date(consumption.date).toLocaleDateString('pt-BR')}`,
    });
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (consumptionToDelete) {
      try {
        await deleteClayConsumption.mutateAsync(consumptionToDelete.id);
        toast({
          title: 'Consumo excluído',
          description: `O consumo ${consumptionToDelete.name} foi excluído com sucesso.`,
        });
      } catch {
        toast({
          title: 'Erro ao excluir',
          description: 'Ocorreu um erro ao excluir o consumo.',
          variant: 'destructive',
        });
      }
    }
    setShowDeleteDialog(false);
    setConsumptionToDelete(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  // Stats cards configuration
  const statsCards = [
    {
      title: 'Total no Mês',
      value: `${totalMonthlyTrucks} caminhões`,
      subtitle: 'Total de caminhões no período',
      icon: Truck,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Média por Registro',
      value: `${averageDailyConsumption.toFixed(1)} caminhões`,
      subtitle: 'Média por registro no período',
      icon: Mountain,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
    },
  ];

  // Table columns
  const columns = [
    {
      key: 'date',
      label: 'Data',
      render: (value: unknown) => formatDate(value as string),
      className: 'min-w-[100px]',
    },
    {
      key: 'trucks_quantity',
      label: 'Quantidade',
      render: (value: unknown) => `${value} caminhões`,
      className: 'min-w-[120px]',
    },
    {
      key: 'recorded_by',
      label: 'Registrado por',
      className: 'min-w-[150px]',
    },
    {
      key: 'supplier',
      label: 'Fornecedor',
      render: (value: unknown) => (value as string) || '-',
      className: 'min-w-[120px] hidden sm:table-cell',
    },
    {
      key: 'origin',
      label: 'Origem',
      render: (value: unknown) => (value as string) || '-',
      className: 'min-w-[120px] hidden md:table-cell',
    },
    {
      key: 'truck_id',
      label: 'Caminhão',
      render: (value: unknown) => value ? `Caminhão ${value}` : '-',
      className: 'min-w-[100px] hidden lg:table-cell',
    },
    {
      key: 'notes',
      label: 'Observações',
      render: (value: unknown) => (value as string) || '-',
      className: 'min-w-[150px] hidden xl:table-cell',
    },
  ];

  // Table actions
  const tableActions = [
    {
      label: 'Editar',
      onClick: (row: Record<string, unknown>) => handleEditConsumption(row as unknown as ClayConsumptionRawData),
      variant: 'outline' as const,
      className: 'sm:w-auto w-full mb-2 sm:mb-0',
    },
    {
      label: 'Excluir',
      variant: 'ghost' as const,
      className: 'text-red-500 hover:text-red-700 hover:bg-red-50 sm:w-auto w-full',
      onClick: (row: Record<string, unknown>) => handleDeleteConsumption(row as unknown as ClayConsumptionRawData),
    },
  ];

  // Actions configuration
  const actions = [
    {
      label: 'Registrar Consumo',
      onClick: () => {
        setEditingConsumption(null);
        setShowDialog(true);
      },
      icon: <Plus className="w-4 h-4" />,
    },
  ];

  return (
    <PageLayout
      actions={actions}
      isLoading={isLoading}
      searchPlaceholder="Buscar por fornecedor, origem, responsável..."
      searchValue={search}
      selectedMonth={selectedMonth}
      statsCards={statsCards}
      subtitle="Gestão de Consumo de Barro"
      title="Matéria-Prima"
      onMonthChange={setSelectedMonth}
      onSearchChange={setSearch}
    >
      <div className="space-y-6">
        <DataTable
          showMobileCards
          actions={tableActions}
          columns={columns}
          data={filteredConsumptions as unknown as Record<string, unknown>[]}
          emptyMessage="Nenhum consumo registrado para este período"
          isLoading={isLoading}
          minWidth="600px"
        />
      </div>

      <ClayConsumptionDialog
        consumption={editingConsumption}
        open={showDialog}
        onOpenChange={setShowDialog}
        onSave={handleSaveConsumption}
      />

      <DeleteConfirmationDialog
        cancelText="Cancelar"
        confirmText="Excluir"
        description="Esta ação não pode ser desfeita."
        itemName={consumptionToDelete?.name}
        itemType="consumo"
        open={showDeleteDialog}
        trigger={<></>}
        onConfirm={confirmDelete}
        onOpenChange={setShowDeleteDialog}
      />
    </PageLayout>
  );
};

export default RawMaterialPage;
