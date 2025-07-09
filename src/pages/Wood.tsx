
import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, Plus, Search, TreePine, ShoppingCart, Flame } from 'lucide-react';
import WoodPurchaseDialog from '@/components/wood/WoodPurchaseDialog';
import WoodConsumptionDialog from '@/components/wood/WoodConsumptionDialog';
import { useToast } from '@/hooks/use-toast';
import { 
  useWoodPurchases, 
  useCreateWoodPurchase, 
  useUpdateWoodPurchase, 
  useDeleteWoodPurchase 
} from '@/hooks/useWoodPurchases';
import { 
  useWoodConsumptions, 
  useCreateWoodConsumption, 
  useUpdateWoodConsumption, 
  useDeleteWoodConsumption 
} from '@/hooks/useWoodConsumptions';

const WoodPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  
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
  const [selectedPurchase, setSelectedPurchase] = useState<any | undefined>(undefined);
  const [selectedConsumption, setSelectedConsumption] = useState<any | undefined>(undefined);

  // Generate month options for the last 12 months
  const monthOptions = useMemo(() => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      
      options.push({
        value: monthKey,
        label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)
      });
    }
    
    return options;
  }, []);

  // Set current month as default
  React.useEffect(() => {
    if (!selectedMonth) {
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      setSelectedMonth(currentMonth);
    }
  }, [selectedMonth]);

  // Filter data by selected month
  const filteredPurchases = useMemo(() => {
    return purchases.filter(purchase => {
      const matchesSearch = purchase.supplier?.toLowerCase().includes(search.toLowerCase()) || false;
      const purchaseMonth = purchase.date ? purchase.date.substring(0, 7) : '';
      const matchesMonth = selectedMonth === '' || purchaseMonth === selectedMonth;
      return matchesSearch && matchesMonth;
    });
  }, [purchases, search, selectedMonth]);

  const filteredConsumption = useMemo(() => {
    return consumption.filter(consumptionItem => {
      const matchesSearch = (consumptionItem.oven?.toLowerCase().includes(search.toLowerCase()) ||
        consumptionItem.responsible?.toLowerCase().includes(search.toLowerCase())) || false;
      const consumptionMonth = consumptionItem.date ? consumptionItem.date.substring(0, 7) : '';
      const matchesMonth = selectedMonth === '' || consumptionMonth === selectedMonth;
      return matchesSearch && matchesMonth;
    });
  }, [consumption, search, selectedMonth]);

  // Calculate stats
  const totalPurchased = purchases.reduce((acc, purchase) => acc + Number(purchase.quantity || 0), 0);
  const totalConsumed = consumption.reduce((acc, consumptionItem) => acc + Number(consumptionItem.quantity || 0), 0);
  const currentStock = 50 + totalPurchased - totalConsumed; // Assuming initial stock of 50

  const monthlyPurchases = filteredPurchases.reduce((acc, purchase) => acc + Number(purchase.quantity || 0), 0);
  const monthlyConsumption = filteredConsumption.reduce((acc, consumptionItem) => acc + Number(consumptionItem.quantity || 0), 0);
  const totalSpent = filteredPurchases.reduce((acc, purchase) => acc + Number(purchase.total_value || 0), 0);

  // Handle save purchase
  const handleSavePurchase = (purchaseData: any) => {
    if (selectedPurchase) {
      updatePurchase.mutate({
        purchaseId: selectedPurchase.id,
        purchaseData: purchaseData
      });
    } else {
      createPurchase.mutate(purchaseData);
    }
    setPurchaseDialogOpen(false);
    setSelectedPurchase(undefined);
  };

  // Handle save consumption
  const handleSaveConsumption = (consumptionData: any) => {
    if (selectedConsumption) {
      updateConsumption.mutate({
        consumptionId: selectedConsumption.id,
        consumptionData: consumptionData
      });
    } else {
      createConsumption.mutate(consumptionData);
    }
    setConsumptionDialogOpen(false);
    setSelectedConsumption(undefined);
  };

  // Handle edit purchase
  const handleEditPurchase = (purchase: any) => {
    setSelectedPurchase(purchase);
    setPurchaseDialogOpen(true);
  };

  // Handle edit consumption
  const handleEditConsumption = (consumptionItem: any) => {
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
    } catch (e) {
      return dateString;
    }
  };

  if (purchasesLoading || consumptionLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
          <Navbar title="Lenha" subtitle="Gestão de Lenha" />
          <main className="flex-1 px-6 py-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando dados...</p>
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
        "flex-1 flex flex-col min-w-0",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Lenha" 
          subtitle="Gestão de Lenha"
        />
        
        <main className="flex-1 px-3 md:px-6 py-4 md:py-6 overflow-x-hidden">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Estoque Atual</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg md:text-2xl font-bold">{currentStock.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">m³</p>
                </div>
                <div className="p-1.5 md:p-2 bg-green-100 rounded-full">
                  <TreePine className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Compras do Mês</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg md:text-2xl font-bold">{monthlyPurchases.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">m³</p>
                </div>
                <div className="p-1.5 md:p-2 bg-blue-100 rounded-full">
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Consumo do Mês</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg md:text-2xl font-bold">{monthlyConsumption.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">m³</p>
                </div>
                <div className="p-1.5 md:p-2 bg-orange-100 rounded-full">
                  <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Valor Gasto</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg md:text-2xl font-bold">R$ {totalSpent.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">no mês</p>
                </div>
                <div className="p-1.5 md:p-2 bg-red-100 rounded-full">
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex flex-col gap-3 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  type="text" 
                  placeholder="Buscar..." 
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
                    setSelectedPurchase(undefined);
                    setPurchaseDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  {isMobile ? 'Compra' : 'Nova Compra'}
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 text-sm"
                  onClick={() => {
                    setSelectedConsumption(undefined);
                    setConsumptionDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  {isMobile ? 'Consumo' : 'Registrar Consumo'}
                </Button>
              </div>
            </div>

            {/* Month Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Mês</h4>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full p-2 text-sm rounded-md border border-input bg-background"
                >
                  {monthOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Purchases Section */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4">Compras de Lenha</h2>
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Data</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Fornecedor</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Quantidade</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Valor Unit.</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Total</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPurchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-2 md:p-4 text-xs md:text-sm">{formatDate(purchase.date)}</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm">{purchase.supplier}</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm">{purchase.quantity}m³</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm">R$ {Number(purchase.unit_price).toFixed(2)}</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm font-medium">R$ {Number(purchase.total_value).toFixed(2)}</td>
                        <td className="p-2 md:p-4">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs"
                              onClick={() => handleEditPurchase(purchase)}
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeletePurchase(purchase.id)}
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
              
              {filteredPurchases.length === 0 && (
                <div className="p-6 md:p-8 text-center">
                  <p className="text-muted-foreground text-sm md:text-base">Nenhuma compra encontrada para este período</p>
                </div>
              )}
            </div>
          </div>

          {/* Consumption Section */}
          <div>
            <h2 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4">Consumo de Lenha</h2>
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Data</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Forno</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Quantidade</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Responsável</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Observações</th>
                      <th className="p-2 md:p-4 text-left text-xs md:text-sm font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredConsumption.map((consumptionItem) => (
                      <tr key={consumptionItem.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-2 md:p-4 text-xs md:text-sm">{formatDate(consumptionItem.date)}</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm">{consumptionItem.oven}</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm">{consumptionItem.quantity}m³</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm">{consumptionItem.responsible}</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm">{consumptionItem.observations || '-'}</td>
                        <td className="p-2 md:p-4">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs"
                              onClick={() => handleEditConsumption(consumptionItem)}
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteConsumption(consumptionItem.id)}
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
              
              {filteredConsumption.length === 0 && (
                <div className="p-6 md:p-8 text-center">
                  <p className="text-muted-foreground text-sm md:text-base">Nenhum consumo registrado para este período</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <WoodPurchaseDialog 
        open={purchaseDialogOpen} 
        onOpenChange={setPurchaseDialogOpen}
        onSave={handleSavePurchase}
        purchase={selectedPurchase}
      />
      
      <WoodConsumptionDialog 
        open={consumptionDialogOpen} 
        onOpenChange={setConsumptionDialogOpen}
        onSave={handleSaveConsumption}
        consumption={selectedConsumption}
      />
    </div>
  );
};

export default WoodPage;
