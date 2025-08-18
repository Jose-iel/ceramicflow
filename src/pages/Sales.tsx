import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, ShoppingCart, CalendarDays } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import DataTable from '@/components/common/DataTable';
import PageLayout from '@/components/common/PageLayout';
import SaleDialog from '@/components/sales/SaleDialog';
import { useSales, useCreateSale, useUpdateSale, useDeleteSale } from '@/hooks';
import { useMonthFilter } from '@/hooks/useMonthFilter';
import { type Sale, type CreateSalePayload } from '@/integrations/supabase/api/sales';

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
    // First filter by month using the sale_date field, with safety check
    const monthFiltered = filterDataByMonth(
      sales
        .filter(sale => sale && sale.sale_date) // Ensure sale and sale_date exist
        .map(sale => ({ ...sale, date: sale.sale_date }))
    );
    // Then filter by search
    return monthFiltered.filter(
      sale =>
        sale.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        sale.recorded_by?.toLowerCase().includes(search.toLowerCase()) ||
        sale.brick_type?.toLowerCase().includes(search.toLowerCase())
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
    // TODO: Implementar dialog de confirmação personalizado
    {
      deleteSale.mutate(saleId);
    }
  };

  const handleSaveSale = (saleData: CreateSalePayload) => {
    if (editingSale) {
      updateSale.mutate({
        saleId: editingSale.id,
        payload: saleData,
      });
    } else {
      createSale.mutate(saleData);
    }
    setEditingSale(null);
    setDialogOpen(false);
  };

  // Function to generate expansion data for sales with notes
  const getSaleNotesForExpansion = (sale: Sale) => {
    // If sale has no notes, don't show expansion
    if (!sale.notes || sale.notes.trim() === '') {
      return [];
    }

    // Return formatted data for expansion
    return [
      {
        data: format(new Date(sale.sale_date), 'dd/MM/yyyy', { locale: ptBR }),
        motivo: 'Observações da Venda',
        observacoes: sale.notes,
      },
    ];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
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
      icon: ShoppingCart,
    },
    {
      title: 'Receita Total',
      value: formatCurrency(totalRevenue),
      subtitle: 'em vendas',
      icon: CalendarDays,
    },
    {
      title: 'Tijolos Vendidos',
      value: formatNumber(totalQuantity),
      subtitle: 'tijolos vendidos',
      icon: ShoppingCart,
    },
  ];

  // Table columns configuration
  const columns = [
    {
      key: 'notes_indicator',
      label: 'Obs.',
      render: (value: unknown, sale: Sale) => (
        <div className="text-center">
          {sale.notes && sale.notes.trim() !== '' ? (
            <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto" title="Possui observações" />
          ) : (
            <div className="w-2 h-2 bg-gray-300 rounded-full mx-auto" title="Sem observações" />
          )}
        </div>
      ),
      className: 'w-16 text-center',
    },
    {
      key: 'customer_name',
      label: 'Cliente',
      render: (value: unknown, sale: Sale) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{sale.customer_name}</div>
          <div className="text-sm text-gray-500">{sale.customer_contact || 'Sem contato'}</div>
        </div>
      ),
    },
    {
      key: 'sale_date',
      label: 'Data',
      render: (value: unknown, sale: Sale) => (
        <div className="text-sm text-gray-900">{format(new Date(sale.sale_date), 'dd/MM/yyyy', { locale: ptBR })}</div>
      ),
    },
    {
      key: 'brick_quantity',
      label: 'Quantidade',
      render: (value: unknown, sale: Sale) => (
        <div className="text-sm text-gray-900">{formatNumber(sale.brick_quantity)} tijolos</div>
      ),
    },
    {
      key: 'brick_type',
      label: 'Tipo',
      render: (value: unknown, sale: Sale) => <div className="text-sm text-gray-900">{sale.brick_type || 'Comum'}</div>,
      className: 'min-w-[100px]',
    },
    {
      key: 'price_per_thousand',
      label: 'Preço/Milheiro',
      render: (value: unknown, sale: Sale) => (
        <div className="text-sm text-gray-900">{formatCurrency(sale.price_per_thousand)}</div>
      ),
    },
    {
      key: 'total_value',
      label: 'Total',
      render: (value: unknown, sale: Sale) => (
        <div className="text-sm font-medium text-green-600">{formatCurrency(sale.total_value)}</div>
      ),
    },
    {
      key: 'recorded_by',
      label: 'Registrado por',
      render: (value: unknown, sale: Sale) => <div className="text-sm text-gray-900">{sale.recorded_by}</div>,
    },
  ];

  // Actions for each row
  const tableActions = [
    {
      label: 'Editar',
      onClick: (sale: Sale) => handleEditSale(sale),
      variant: 'outline' as const,
    },
    {
      label: 'Excluir',
      onClick: (sale: Sale) => handleDeleteSale(sale.id),
      variant: 'ghost' as const,
      className: 'text-red-500 hover:text-red-700 hover:bg-red-50',
    },
  ];

  return (
    <PageLayout
      actions={[
        {
          label: 'Nova Venda',
          onClick: handleAddNew,
          icon: <Plus className="w-4 h-4" />,
        },
      ]}
      isLoading={isLoading}
      searchPlaceholder="Buscar cliente ou responsável..."
      searchValue={search}
      selectedMonth={selectedMonth}
      statsCards={statsCards}
      subtitle="Gerencie e acompanhe todas as vendas realizadas"
      title="Vendas de Tijolos"
      onMonthChange={setSelectedMonth}
      onSearchChange={setSearch}
    >
      <DataTable
        actions={tableActions as never}
        columns={columns as never}
        data={filteredSales as unknown as Record<string, unknown>[]}
        emptyMessage="Nenhuma venda encontrada"
        expandable={true}
        expandedRowData={sale => getSaleNotesForExpansion(sale as unknown as Sale)}
        minWidth="800px"
      />

      <SaleDialog open={dialogOpen} sale={editingSale} onOpenChange={setDialogOpen} onSave={handleSaveSale} />
    </PageLayout>
  );
};

export default Sales;
