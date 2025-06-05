
import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { WoodConsumption, WoodPurchase } from '@/types';
import { TreePine, Plus, TrendingUp, Package, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WoodConsumptionDialog from '@/components/wood/WoodConsumptionDialog';
import WoodPurchaseDialog from '@/components/wood/WoodPurchaseDialog';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockConsumptions: WoodConsumption[] = [
  {
    id: 'WC001',
    date: '2023-12-01',
    quantity: 45.5,
    sector: 'Forno 1',
    recordedBy: 'João Silva',
    notes: 'Consumo normal'
  },
  {
    id: 'WC002',
    date: '2023-12-02',
    quantity: 52.3,
    sector: 'Forno 2',
    recordedBy: 'Maria Santos',
  },
  {
    id: 'WC003',
    date: '2023-11-15',
    quantity: 38.2,
    sector: 'Forno 1',
    recordedBy: 'Carlos Silva',
    notes: 'Lenha de eucalipto'
  },
  {
    id: 'WC004',
    date: '2023-11-28',
    quantity: 44.1,
    sector: 'Forno 3',
    recordedBy: 'Ana Costa',
  }
];

const mockPurchases: WoodPurchase[] = [
  {
    id: 'WP001',
    date: '2023-11-28',
    supplier: 'Madeireira São João',
    quantity: 500,
    unitPrice: 85.00,
    totalValue: 42500.00,
    invoiceNumber: 'NF-12345'
  },
  {
    id: 'WP002',
    date: '2023-12-05',
    supplier: 'Fornecedor ABC',
    quantity: 300,
    unitPrice: 90.00,
    totalValue: 27000.00,
    invoiceNumber: 'NF-67890'
  }
];

const WoodPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [consumptions, setConsumptions] = useState<WoodConsumption[]>(mockConsumptions);
  const [purchases, setPurchases] = useState<WoodPurchase[]>(mockPurchases);
  const [showConsumptionDialog, setShowConsumptionDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('2023-12');

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

  // Filter data by selected month
  const filteredConsumptions = useMemo(() => {
    return consumptions.filter(consumption => {
      const consumptionMonth = consumption.date.substring(0, 7); // YYYY-MM
      return consumptionMonth === selectedMonth;
    });
  }, [consumptions, selectedMonth]);

  const filteredPurchases = useMemo(() => {
    return purchases.filter(purchase => {
      const purchaseMonth = purchase.date.substring(0, 7); // YYYY-MM
      return purchaseMonth === selectedMonth;
    });
  }, [purchases, selectedMonth]);
  
  const totalMonthlyConsumption = filteredConsumptions.reduce((sum, item) => sum + item.quantity, 0);
  const totalMonthlyPurchases = filteredPurchases.reduce((sum, item) => sum + item.quantity, 0);
  const averageUnitPrice = filteredPurchases.length > 0 
    ? filteredPurchases.reduce((sum, item) => sum + item.unitPrice, 0) / filteredPurchases.length 
    : 0;

  const handleSaveConsumption = (consumption: WoodConsumption) => {
    setConsumptions(prev => [...prev, consumption]);
  };

  const handleSavePurchase = (purchase: WoodPurchase) => {
    setPurchases(prev => [...prev, purchase]);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Lenha" 
          subtitle="Gestão de Consumo e Compras"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Month Filter */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium">Filtrar por mês:</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Consumo no Mês
                </CardTitle>
                <TreePine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMonthlyConsumption.toFixed(1)} m³</div>
                <p className="text-xs text-muted-foreground">
                  Total consumido no período
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Compras no Mês
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMonthlyPurchases} m³</div>
                <p className="text-xs text-muted-foreground">
                  Total comprado no período
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Preço Médio
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {averageUnitPrice.toFixed(2)}/m³</div>
                <p className="text-xs text-muted-foreground">
                  Preço médio por m³
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="consumption" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="consumption">Consumo</TabsTrigger>
                <TabsTrigger value="purchases">Compras</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button className="gap-2" onClick={() => setShowConsumptionDialog(true)}>
                  <Plus className="w-4 h-4" />
                  Registrar Consumo
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => setShowPurchaseDialog(true)}>
                  <Plus className="w-4 h-4" />
                  Nova Compra
                </Button>
              </div>
            </div>

            <TabsContent value="consumption" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Consumo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredConsumptions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum consumo registrado neste período.
                      </p>
                    ) : (
                      filteredConsumptions.map((consumption) => (
                        <div key={consumption.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{consumption.sector}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(consumption.date).toLocaleDateString('pt-BR')} - por {consumption.recordedBy}
                            </p>
                            {consumption.notes && (
                              <p className="text-sm text-muted-foreground mt-1">{consumption.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">{consumption.quantity} m³</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Compras</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredPurchases.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhuma compra registrada neste período.
                      </p>
                    ) : (
                      filteredPurchases.map((purchase) => (
                        <div key={purchase.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{purchase.supplier}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(purchase.date).toLocaleDateString('pt-BR')}
                            </p>
                            {purchase.invoiceNumber && (
                              <p className="text-sm text-muted-foreground">NF: {purchase.invoiceNumber}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">{purchase.quantity} m³</div>
                            <div className="text-sm text-muted-foreground">
                              R$ {purchase.unitPrice.toFixed(2)}/m³
                            </div>
                            <div className="text-sm font-medium">
                              Total: R$ {purchase.totalValue.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <WoodConsumptionDialog
        open={showConsumptionDialog}
        onOpenChange={setShowConsumptionDialog}
        onSave={handleSaveConsumption}
      />
      
      <WoodPurchaseDialog
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
        onSave={handleSavePurchase}
      />
    </div>
  );
};

export default WoodPage;
