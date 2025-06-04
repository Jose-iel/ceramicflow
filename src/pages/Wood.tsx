
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { WoodConsumption, WoodPurchase } from '@/types';
import { TreePine, Plus, TrendingUp, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  }
];

const WoodPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [consumptions] = useState<WoodConsumption[]>(mockConsumptions);
  const [purchases] = useState<WoodPurchase[]>(mockPurchases);
  
  const totalMonthlyConsumption = consumptions.reduce((sum, item) => sum + item.quantity, 0);
  const totalMonthlyPurchases = purchases.reduce((sum, item) => sum + item.quantity, 0);
  const averageUnitPrice = purchases.length > 0 
    ? purchases.reduce((sum, item) => sum + item.unitPrice, 0) / purchases.length 
    : 0;

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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Consumo Mensal
                </CardTitle>
                <TreePine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMonthlyConsumption.toFixed(1)} m³</div>
                <p className="text-xs text-muted-foreground">
                  Total consumido este mês
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Compras Mensais
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMonthlyPurchases} m³</div>
                <p className="text-xs text-muted-foreground">
                  Total comprado este mês
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
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Registrar Consumo
                </Button>
                <Button variant="outline" className="gap-2">
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
                    {consumptions.map((consumption) => (
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
                    ))}
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
                    {purchases.map((purchase) => (
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default WoodPage;
