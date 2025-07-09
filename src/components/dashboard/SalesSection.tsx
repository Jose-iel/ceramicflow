
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { useSales, useCreateSale, useUpdateSale, useDeleteSale } from '@/integrations/supabase/hooks';
import SalesItem from '@/components/sales/SalesItem';
import SaleDialog from '@/components/sales/SaleDialog';
import type { Sale } from '@/integrations/supabase/api/sales';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SalesSection = () => {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const { data: sales = [], isLoading } = useSales();
  const createSaleMutation = useCreateSale();
  const updateSaleMutation = useUpdateSale();
  const deleteSaleMutation = useDeleteSale();

  // Filter sales based on search
  const filteredSales = sales.filter(sale => 
    sale.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    sale.recorded_by.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingSale(null);
    setDialogOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setDialogOpen(true);
  };

  const handleDeleteSale = (saleId: string) => {
    deleteSaleMutation.mutate(saleId);
  };

  const handleSaveSale = (saleData: any) => {
    if (editingSale) {
      updateSaleMutation.mutate({ saleId: editingSale.id, payload: saleData }, {
        onSuccess: () => setDialogOpen(false),
      });
    } else {
      createSaleMutation.mutate(saleData, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Carregando vendas...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="slide-enter" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Vendas de Tijolos</h2>
            <p className="text-muted-foreground">Gerencie as vendas realizadas</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtrar
            </Button>
            <Button className="gap-2" onClick={handleAddNew}>
              <Plus className="w-4 h-4" />
              Nova Venda
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            type="text" 
            placeholder="Buscar por cliente ou responsável..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sales Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSales.map((sale) => (
            <SalesItem
              key={sale.id}
              sale={sale}
              onClick={() => {}}
              onEdit={() => handleEditSale(sale)}
              onDelete={() => handleDeleteSale(sale.id)}
            />
          ))}
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {search ? 'Nenhuma venda encontrada' : 'Nenhuma venda registrada ainda.'}
            </p>
            {!search && (
              <Button onClick={handleAddNew} className="mt-4">
                Registrar primeira venda
              </Button>
            )}
          </div>
        )}
      </div>

      <SaleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        sale={editingSale}
        onSave={handleSaveSale}
      />
    </section>
  );
};

export default SalesSection;
