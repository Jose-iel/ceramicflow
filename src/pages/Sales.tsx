import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, ShoppingCart, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SaleDialog from '@/components/sales/SaleDialog';
import { useSales, useCreateSale, useUpdateSale, useDeleteSale } from '@/hooks';
import { type Sale, type CreateSalePayload } from '@/integrations/supabase/api/sales';
import { useMonthFilter } from '@/hooks/useMonthFilter';
import PageLayout from '@/components/common/PageLayout';
import DataTable from '@/components/common/DataTable';

const Sales = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [search, setSearch] = useState('');
  const { selectedMonth, setSelectedMonth, filterDataByMonth } = useMonthFilter();

  // Usando hooks otimizados
  const { data: sales = [], isLoading } = useSales();
  const createSale = useCreateSale();
  const updateSale = useUpdateSale();
  const deleteSale = useDeleteSale();

  // Filter sales by month and search
  const filteredSales = useMemo(() => {
    // First filter by month using the sale_date field
    const monthFiltered = filterDataByMonth(sales.map(sale => ({ ...sale, date: sale.sale_date })));
    // Then filter by search
    return monthFiltered.filter(sale => 
      sale.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      sale.recorded_by?.toLowerCase().includes(search.toLowerCase())
    );
  }, [sales, search, filterDataByMonth]);

  const handleAddNew = () => {
    setEditingSale(null);
    setDialogOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setDialogOpen(true);
  };

  const handleDeleteSale = (saleId: string) => {
    if (confirm("Tem certeza que deseja excluir esta venda?")) {
      deleteSale.mutate(saleId);
    }
  };

  const handleSaveSale = (saleData: CreateSalePayload) => {
    if (editingSale) {
      updateSale.mutate({
        saleId: editingSale.id,
        payload: saleData
      });
    } else {
      createSale.mutate(saleData);
    }
    setEditingSale(null);
    setDialogOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  // Calculate totals
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total_value, 0);
  const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.brick_quantity, 0);

  // Stats cards data
  const statsCards = [
    {
      title: 'Total de Vendas',
      value: totalSales.toString(),
      subtitle: 'vendas realizadas',
      icon: ShoppingCart
    },
    {
      title: 'Receita Total',
      value: formatCurrency(totalRevenue),
      subtitle: 'em vendas',
      icon: CalendarDays
    },
    {
      title: 'Tijolos Vendidos',
      value: formatNumber(totalQuantity),
      subtitle: 'tijolos vendidos',
      icon: ShoppingCart
    }
  ];

  // Table columns configuration
  const columns = [
    {
      key: 'customer_name',
      label: 'Cliente',
      render: (value: unknown, sale: Sale) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {sale.customer_name}
          </div>
          <div className="text-sm text-gray-500">
            {sale.customer_contact || 'Sem contato'}
          </div>
        </div>
      )
    },
    {
      key: 'sale_date',
      label: 'Data',
      render: (value: unknown, sale: Sale) => (
        <div className="text-sm text-gray-900">
          {format(new Date(sale.sale_date), 'dd/MM/yyyy', { locale: ptBR })}
        </div>
      )
    },
    {
      key: 'brick_quantity',
      label: 'Quantidade',
      render: (value: unknown, sale: Sale) => (
        <div className="text-sm text-gray-900">
          {formatNumber(sale.brick_quantity)} tijolos
        </div>
      )
    },
    {
      key: 'price_per_thousand',
      label: 'Preço/Milheiro',
      render: (value: unknown, sale: Sale) => (
        <div className="text-sm text-gray-900">
          {formatCurrency(sale.price_per_thousand)}
        </div>
      )
    },
    {
      key: 'total_value',
      label: 'Total',
      render: (value: unknown, sale: Sale) => (
        <div className="text-sm font-medium text-green-600">
          {formatCurrency(sale.total_value)}
        </div>
      )
    },
    {
      key: 'recorded_by',
      label: 'Registrado por',
      render: (value: unknown, sale: Sale) => (
        <div className="text-sm text-gray-900">
          {sale.recorded_by}
        </div>
      )
    }
  ];

  // Actions for each row
  const tableActions = [
    {
      label: 'Editar',
      onClick: (sale: Sale) => handleEditSale(sale),
      variant: 'outline' as const
    },
    {
      label: 'Excluir',
      onClick: (sale: Sale) => handleDeleteSale(sale.id),
      variant: 'ghost' as const,
      className: 'text-red-500 hover:text-red-700 hover:bg-red-50'
    }
  ];

  return (
    <PageLayout
      title="Vendas de Tijolos"
      subtitle="Gerencie e acompanhe todas as vendas realizadas"
      isLoading={isLoading}
      selectedMonth={selectedMonth}
      onMonthChange={setSelectedMonth}
      statsCards={statsCards}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Buscar cliente ou responsável..."
      actions={[
        {
          label: 'Nova Venda',
          onClick: handleAddNew,
          icon: <Plus className="w-4 h-4" />
        }
      ]}    >
      <DataTable
        data={filteredSales as unknown as Record<string, unknown>[]}
        columns={columns as never}
        actions={tableActions as never}
        emptyMessage="Nenhuma venda encontrada"
        minWidth="800px"
      />

      <SaleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        sale={editingSale}
        onSave={handleSaveSale}
      />
    </PageLayout>
  );
};

export default Sales;
