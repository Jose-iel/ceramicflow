
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ClayConsumption } from '@/types';
import { Mountain, Plus, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClayConsumptionDialog from '@/components/rawmaterial/ClayConsumptionDialog';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockClayConsumptions: ClayConsumption[] = [
  {
    id: 'CC001',
    date: '2023-12-01',
    trucksQuantity: 8,
    supplier: 'Barreiro Central',
    origin: 'Fazenda Santa Maria',
    truckId: 'CAM-001',
    recordedBy: 'Carlos Oliveira',
    notes: 'Barro de boa qualidade'
  },
  {
    id: 'CC002',
    date: '2023-12-02',
    trucksQuantity: 6,
    supplier: 'Extração Norte',
    truckId: 'CAM-002',
    recordedBy: 'Ana Costa',
  }
];

const RawMaterialPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [clayConsumptions, setClayConsumptions] = useState<ClayConsumption[]>(mockClayConsumptions);
  const [showDialog, setShowDialog] = useState(false);
  
  const totalMonthlyTrucks = clayConsumptions.reduce((sum, item) => sum + item.trucksQuantity, 0);
  const averageDailyConsumption = clayConsumptions.length > 0 
    ? totalMonthlyTrucks / clayConsumptions.length 
    : 0;

  const handleSaveConsumption = (consumption: ClayConsumption) => {
    setClayConsumptions(prev => [...prev, consumption]);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Matéria-Prima" 
          subtitle="Gestão de Consumo de Barro"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Mensal
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMonthlyTrucks} caminhões</div>
                <p className="text-xs text-muted-foreground">
                  Total de caminhões este mês
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Média Diária
                </CardTitle>
                <Mountain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageDailyConsumption.toFixed(1)} caminhões</div>
                <p className="text-xs text-muted-foreground">
                  Média de consumo diário
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Consumo de Barro</h2>
            <Button className="gap-2" onClick={() => setShowDialog(true)}>
              <Plus className="w-4 h-4" />
              Registrar Consumo
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Consumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clayConsumptions.map((consumption) => (
                  <div key={consumption.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        {consumption.trucksQuantity} caminhões de barro
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(consumption.date).toLocaleDateString('pt-BR')} - por {consumption.recordedBy}
                      </p>
                      {consumption.supplier && (
                        <p className="text-sm text-muted-foreground">
                          Fornecedor: {consumption.supplier}
                        </p>
                      )}
                      {consumption.origin && (
                        <p className="text-sm text-muted-foreground">
                          Origem: {consumption.origin}
                        </p>
                      )}
                      {consumption.truckId && (
                        <p className="text-sm text-muted-foreground">
                          Caminhão: {consumption.truckId}
                        </p>
                      )}
                      {consumption.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{consumption.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-muted-foreground" />
                        <span className="text-lg font-semibold">{consumption.trucksQuantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <ClayConsumptionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSave={handleSaveConsumption}
      />
    </div>
  );
};

export default RawMaterialPage;
