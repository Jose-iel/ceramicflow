
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, Plus, Search, TreePine, ShoppingCart, Flame, Pause, CheckCircle } from 'lucide-react';
import WoodPurchaseDialog from '@/components/wood/WoodPurchaseDialog';
import WoodConsumptionDialog from '@/components/wood/WoodConsumptionDialog';
import { useToast } from '@/hooks/use-toast';
import { WoodPurchase, WoodConsumption } from '@/types';

// Mock data for wood purchases
const initialPurchases: WoodPurchase[] = [
  {
    id: 'WP001',
    date: '2023-11-05',
    supplier: 'Lenhas do Zé',
    quantity: 10,
    unitPrice: 50,
    totalValue: 500
  },
  {
    id: 'WP002',
    date: '2023-11-15',
    supplier: 'Lenhas da Maria',
    quantity: 12,
    unitPrice: 52,
    totalValue: 624
  },
  {
    id: 'WP003',
    date: '2023-10-28',
    supplier: 'Lenhas do Zé',
    quantity: 8,
    unitPrice: 48,
    totalValue: 384
  },
  {
    id: 'WP004',
    date: '2023-10-10',
    supplier: 'Lenhas da Maria',
    quantity: 15,
    unitPrice: 55,
    totalValue: 825
  }
];

// Mock data for wood consumption
const initialConsumption: WoodConsumption[] = [
  {
    id: 'WC001',
    date: '2023-11-01',
    oven: 'Forno 1',
    quantity: 2.5,
    responsible: 'Carlos',
    observations: 'Consumo normal'
  },
  {
    id: 'WC002',
    date: '2023-11-08',
    oven: 'Forno 2',
    quantity: 3.0,
    responsible: 'Maria',
    observations: 'Alta produção'
  },
  {
    id: 'WC003',
    date: '2023-10-25',
    oven: 'Forno 1',
    quantity: 2.0,
    responsible: 'Carlos',
    observations: 'Manutenção no forno'
  },
  {
    id: 'WC004',
    date: '2023-10-12',
    oven: 'Forno 2',
    quantity: 3.5,
    responsible: 'Maria',
    observations: 'Teste de novo processo'
  }
];

const WoodPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [purchases, setPurchases] = useState(initialPurchases);
  const [consumption, setConsumption] = useState(initialConsumption);
  
  // Dialog states
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [consumptionDialogOpen, setConsumptionDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<WoodPurchase | undefined>(undefined);
  const [selectedConsumption, setSelectedConsumption] = useState<WoodConsumption | undefined>(undefined);

  // Handle add/edit purchase
  const handleSavePurchase = (purchaseData: WoodPurchase) => {
    if (selectedPurchase) {
      // Update existing purchase
      setPurchases(prev =>
        prev.map(p => p.id === purchaseData.id ? purchaseData : p)
      );
    } else {
      // Add new purchase
      setPurchases(prev => [...prev, purchaseData]);
    }
    setPurchaseDialogOpen(false);
    setSelectedPurchase(undefined);
  };

  // Handle add/edit consumption
  const handleSaveConsumption = (consumptionData: WoodConsumption) => {
    if (selectedConsumption) {
      // Update existing consumption
      setConsumption(prev =>
        prev.map(c => c.id === consumptionData.id ? consumptionData : c)
      );
    } else {
      // Add new consumption
      setConsumption(prev => [...prev, consumptionData]);
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
    if (confirm("Tem certeza que deseja excluir esta compra?")) {
      setPurchases(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Compra excluída",
        description: "A compra foi excluída com sucesso."
      });
    }
  };

  // Handle delete consumption
  const handleDeleteConsumption = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este consumo?")) {
      setConsumption(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Consumo excluído",
        description: "O consumo foi excluído com sucesso."
      });
    }
  };

  // Set current month as default filter
  useEffect(() => {
    if (!selectedMonth) {
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      setSelectedMonth(currentMonth);
    }
  }, [selectedMonth]);

  // Filter purchases by search and month
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.supplier.toLowerCase().includes(search.toLowerCase());
    const purchaseMonth = `${new Date(purchase.date).getFullYear()}-${String(new Date(purchase.date).getMonth() + 1).padStart(2, '0')}`;
    const matchesMonth = selectedMonth === '' || purchaseMonth === selectedMonth;
    return matchesSearch && matchesMonth;
  });

  // Filter consumption by search and month
  const filteredConsumption = consumption.filter(consumptionItem => {
    const matchesSearch = consumptionItem.oven.toLowerCase().includes(search.toLowerCase()) ||
      consumptionItem.responsible.toLowerCase().includes(search.toLowerCase());
    const consumptionMonth = `${new Date(consumptionItem.date).getFullYear()}-${String(new Date(consumptionItem.date).getMonth() + 1).padStart(2, '0')}`;
    const matchesMonth = selectedMonth === '' || consumptionMonth === selectedMonth;
    return matchesSearch && matchesMonth;
  });

  // Calculate current stock
  const initialStock = 50;
  const totalPurchased = purchases.reduce((acc, purchase) => acc + purchase.quantity, 0);
  const totalConsumed = consumption.reduce((acc, consumptionItem) => acc + consumptionItem.quantity, 0);
  const currentStock = initialStock + totalPurchased - totalConsumed;

  // Calculate monthly purchases
  const monthlyPurchases = filteredPurchases.reduce((acc, purchase) => acc + purchase.quantity, 0);

  // Calculate monthly consumption
  const monthlyConsumption = filteredConsumption.reduce((acc, consumptionItem) => acc + consumptionItem.quantity, 0);

  // Calculate total spent in the selected month
  const totalSpent = filteredPurchases.reduce((acc, purchase) => acc + purchase.totalValue, 0);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const dateParts = dateString.split('-');
      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    } catch (e) {
      return dateString;
    }
  };

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
                  onClick={() => setPurchaseDialogOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  {isMobile ? 'Compra' : 'Nova Compra'}
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 text-sm"
                  onClick={() => setConsumptionDialogOpen(true)}
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
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full p-2 text-sm rounded-md border border-input bg-background"
                />
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
                        <td className="p-2 md:p-4 text-xs md:text-sm">R$ {purchase.unitPrice.toFixed(2)}</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm font-medium">R$ {purchase.totalValue.toFixed(2)}</td>
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
                    {filteredConsumption.map((consumption) => (
                      <tr key={consumption.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-2 md:p-4 text-xs md:text-sm">{formatDate(consumption.date)}</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm">{consumption.oven}</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm">{consumption.quantity}m³</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm">{consumption.responsible}</td>
                        <td className="p-2 md:p-4 text-xs md:text-sm">{consumption.observations || '-'}</td>
                        <td className="p-2 md:p-4">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs"
                              onClick={() => handleEditConsumption(consumption)}
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteConsumption(consumption.id)}
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
      />
      
      <WoodConsumptionDialog 
        open={consumptionDialogOpen} 
        onOpenChange={setConsumptionDialogOpen}
        onSave={handleSaveConsumption}
      />
    </div>
  );
};

export default WoodPage;
