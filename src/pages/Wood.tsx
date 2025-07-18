import { Plus, TreePine, ShoppingCart, Flame } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import DataTable from '@/components/common/DataTable';
import PageLayout from '@/components/common/PageLayout';
import WoodConsumptionDialog from '@/components/wood/WoodConsumptionDialog';
import WoodPurchaseDialog from '@/components/wood/WoodPurchaseDialog';
import {
  useWoodPurchases,
  useCreateWoodPurchase,
  useUpdateWoodPurchase,
  useDeleteWoodPurchase,
  useWoodConsumptions,
  useCreateWoodConsumption,
  useUpdateWoodConsumption,
  useDeleteWoodConsumption,
} from '@/hooks';
import { useMonthFilter } from '@/hooks/useMonthFilter';
import type {
  WoodPurchase,
  WoodConsumption,
  CreateWoodPurchasePayload,
  CreateWoodConsumptionPayload,
} from '@/integrations/supabase/api/wood';

const WoodPage = () => {
  const [search, setSearch] = useState('');
  const { selectedMonth, setSelectedMonth, filterDataByMonth } = useMonthFilter();

  // Real database hooks
  const { data: purchases = [], isLoading: purchasesLoading } = useWoodPurchases();
  const { data: consumption = [], isLoading: consumptionLoading } = useWoodConsumptions();
  const createPurchase = useCreateWoodPurchase();
  const updatePurchase = useUpdateWoodPurchase();
  const deletePurchase = useDeleteWoodPurchase();
  const createConsumption = useCreateWoodConsumption();
  const updateConsumption = useUpdateWoodConsumption();
  const deleteConsumption = useDeleteWoodConsumption();

  // Dialog states
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [consumptionDialogOpen, setConsumptionDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<WoodPurchase | undefined>(undefined);
  const [selectedConsumption, setSelectedConsumption] = useState<WoodConsumption | undefined>(undefined);

  // Filter data by selected month using the hook
  const filteredPurchases = useMemo(() => {
    const monthFiltered = filterDataByMonth(purchases);
    return monthFiltered.filter(purchase => purchase.supplier?.toLowerCase().includes(search.toLowerCase()) || false);
  }, [purchases, search, filterDataByMonth]);

  const filteredConsumption = useMemo(() => {
    const monthFiltered = filterDataByMonth(consumption);
    return monthFiltered.filter(
      consumptionItem =>
        consumptionItem.oven?.toLowerCase().includes(search.toLowerCase()) ||
        consumptionItem.responsible?.toLowerCase().includes(search.toLowerCase()) ||
        false
    );
  }, [consumption, search, filterDataByMonth]);

  // Calculate stats - Remove mock data and calculate real stock
  const totalPurchased = purchases.reduce((acc, purchase) => acc + Number(purchase.quantity || 0), 0);
  const totalConsumed = consumption.reduce((acc, consumptionItem) => acc + Number(consumptionItem.quantity || 0), 0);
  const currentStock = totalPurchased - totalConsumed; // Real stock calculation without mock initial stock

  const monthlyPurchases = filteredPurchases.reduce((acc, purchase) => acc + Number(purchase.quantity || 0), 0);
  const monthlyConsumption = filteredConsumption.reduce((acc, consumptionItem) => acc + Number(consumptionItem.quantity || 0), 0);
  const totalSpent = filteredPurchases.reduce((acc, purchase) => acc + Number(purchase.total_value || 0), 0);

  // Handle save purchase
  const handleSavePurchase = (purchaseData: CreateWoodPurchasePayload) => {
    if (selectedPurchase) {
      updatePurchase.mutate({
        purchaseId: selectedPurchase.id,
        payload: purchaseData,
      });
    } else {
      createPurchase.mutate(purchaseData);
    }
    setPurchaseDialogOpen(false);
    setSelectedPurchase(undefined);
  };

  // Handle save consumption
  const handleSaveConsumption = (consumptionData: CreateWoodConsumptionPayload) => {
    if (selectedConsumption) {
      updateConsumption.mutate({
        consumptionId: selectedConsumption.id,
        payload: consumptionData,
      });
    } else {
      createConsumption.mutate(consumptionData);
    }
    setConsumptionDialogOpen(false);
    setSelectedConsumption(undefined);
  };

  // Handle edit purchase
  const handleEditPurchase = (purchase: WoodPurchase) => {
    setSelectedPurchase(purchase);
    setPurchaseDialogOpen(true);
  };

  // Handle edit consumption
  const handleEditConsumption = (consumptionItem: WoodConsumption) => {
    setSelectedConsumption(consumptionItem);
    setConsumptionDialogOpen(true);
  };

  // Handle delete purchase
  const handleDeletePurchase = (id: string) => {
    deletePurchase.mutate(id);
  };

  // Handle delete consumption
  const handleDeleteConsumption = (id: string) => {
    deleteConsumption.mutate(id);
  };

  // Format date
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
      title: 'Estoque Atual',
      value: currentStock.toFixed(1),
      unit: 'm³',
      icon: TreePine,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
    },
    {
      title: 'Compras do Mês',
      value: monthlyPurchases.toFixed(1),
      unit: 'm³',
      icon: ShoppingCart,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Consumo do Mês',
      value: monthlyConsumption.toFixed(1),
      unit: 'm³',
      icon: Flame,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
    },
    {
      title: 'Valor Gasto',
      value: `R$ ${totalSpent.toFixed(0)}`,
      subtitle: 'no mês',
      icon: ShoppingCart,
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
    },
  ];

  // Actions configuration
  const actions = [
    {
      label: 'Nova Compra',
      mobileLabel: 'Compra',
      onClick: () => {
        setSelectedPurchase(undefined);
        setPurchaseDialogOpen(true);
      },
      icon: <Plus className="w-4 h-4" />,
    },
    {
      label: 'Registrar Consumo',
      mobileLabel: 'Consumo',
      variant: 'outline' as const,
      onClick: () => {
        setSelectedConsumption(undefined);
        setConsumptionDialogOpen(true);
      },
      icon: <Plus className="w-4 h-4" />,
    },
  ];

  // Purchase table columns
  const purchaseColumns = [
    { key: 'date', label: 'Data', render: (value: unknown) => formatDate(value as string) },
    { key: 'supplier', label: 'Fornecedor' },
    { key: 'quantity', label: 'Quantidade', render: (value: unknown) => `${value}m³` },
    { key: 'unit_price', label: 'Valor Unit.', render: (value: unknown) => `R$ ${Number(value).toFixed(2)}` },
    {
      key: 'total_value',
      label: 'Total',
      render: (value: unknown) => `R$ ${Number(value).toFixed(2)}`,
      className: 'font-medium',
    },
  ];

  // Purchase table actions
  const purchaseActions = [
    {
      label: 'Editar',
      onClick: (row: Record<string, unknown>) => handleEditPurchase(row as unknown as WoodPurchase),
    },
    {
      label: 'Excluir',
      variant: 'ghost' as const,
      className: 'text-red-500 hover:text-red-700 hover:bg-red-50',
      onClick: (row: Record<string, unknown>) => handleDeletePurchase((row as unknown as WoodPurchase).id),
    },
  ];

  // Consumption table columns
  const consumptionColumns = [
    { key: 'date', label: 'Data', render: (value: unknown) => formatDate(value as string) },
    { key: 'oven', label: 'Forno' },
    { key: 'quantity', label: 'Quantidade', render: (value: unknown) => `${value}m³` },
    { key: 'responsible', label: 'Responsável' },
    { key: 'observations', label: 'Observações', render: (value: unknown) => (value as string) || '-' },
  ];

  // Consumption table actions
  const consumptionActions = [
    {
      label: 'Editar',
      onClick: (row: Record<string, unknown>) => handleEditConsumption(row as unknown as WoodConsumption),
    },
    {
      label: 'Excluir',
      variant: 'ghost' as const,
      className: 'text-red-500 hover:text-red-700 hover:bg-red-50',
      onClick: (row: Record<string, unknown>) => handleDeleteConsumption((row as unknown as WoodConsumption).id),
    },
  ];

  return (
    <PageLayout
      actions={actions}
      isLoading={purchasesLoading || consumptionLoading}
      searchValue={search}
      selectedMonth={selectedMonth}
      statsCards={statsCards}
      subtitle="Gestão de Lenha"
      title="Lenha"
      onMonthChange={setSelectedMonth}
      onSearchChange={setSearch}
    >
      {/* Purchases Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4">Compras de Lenha</h2>
        <DataTable
          actions={purchaseActions}
          columns={purchaseColumns}
          data={filteredPurchases as unknown as Record<string, unknown>[]}
          emptyMessage="Nenhuma compra encontrada para este período"
        />
      </div>

      {/* Consumption Section */}
      <div>
        <h2 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4">Consumo de Lenha</h2>
        <DataTable
          actions={consumptionActions}
          columns={consumptionColumns}
          data={filteredConsumption as unknown as Record<string, unknown>[]}
          emptyMessage="Nenhum consumo registrado para este período"
        />
      </div>

      {/* Dialogs */}
      <WoodPurchaseDialog
        open={purchaseDialogOpen}
        purchase={selectedPurchase}
        onOpenChange={setPurchaseDialogOpen}
        onSave={handleSavePurchase}
      />

      <WoodConsumptionDialog
        consumption={selectedConsumption}
        open={consumptionDialogOpen}
        onOpenChange={setConsumptionDialogOpen}
        onSave={handleSaveConsumption}
      />
    </PageLayout>
  );
};

export default WoodPage;
