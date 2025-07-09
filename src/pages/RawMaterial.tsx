
import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Mountain, Plus, Truck, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ClayConsumptionDialog from '@/components/rawmaterial/ClayConsumptionDialog';
import { useToast } from '@/hooks/use-toast';
import { 
  useClayConsumptions, 
  useCreateClayConsumption, 
  useUpdateClayConsumption, 
  useDeleteClayConsumption 
} from '@/hooks/useClayConsumptions';

const RawMaterialPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Real database hooks
  const { data: clayConsumptions = [], isLoading } = useClayConsumptions();
  const createClayConsumption = useCreateClayConsumption();
  const updateClayConsumption = useUpdateClayConsumption();
  const deleteClayConsumption = useDeleteClayConsumption();
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingConsumption, setEditingConsumption] = useState<any | null>(null);
  
  // Set current month as default
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

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
    return clayConsumptions.filter(consumption => {
      const consumptionMonth = consumption.date ? consumption.date.substring(0, 7) : '';
      return consumptionMonth === selectedMonth;
    });
  }, [clayConsumptions, selectedMonth]);
  
  const totalMonthlyTrucks = filteredConsumptions.reduce((sum, item) => sum + Number(item.trucks_quantity || 0), 0);
  const averageDailyConsumption = filteredConsumptions.length > 0 
    ? totalMonthlyTrucks / filteredConsumptions.length 
    : 0;

  const handleSaveConsumption = (consumption: any) => {
    if (editingConsumption) {
      updateClayConsumption.mutate({
        consumptionId: editingConsumption.id,
        consumptionData: consumption
      });
    } else {
      createClayConsumption.mutate(consumption);
    }
    setEditingConsumption(null);
    setShowDialog(false);
  };

  const handleEditConsumption = (consumption: any) => {
    setEditingConsumption(consumption);
    setShowDialog(true);
  };

  const handleDeleteConsumption = (id: string) => {
    deleteClayConsumption.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
          <Navbar title="Matéria-Prima" subtitle="Gestão de Consumo de Barro" />
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
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Matéria-Prima" 
          subtitle="Gestão de Consumo de Barro"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total no Mês
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMonthlyTrucks} caminhões</div>
                <p className="text-xs text-muted-foreground">
                  Total de caminhões no período
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Média por Registro
                </CardTitle>
                <Mountain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageDailyConsumption.toFixed(1)} caminhões</div>
                <p className="text-xs text-muted-foreground">
                  Média por registro no período
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Consumo de Barro</h2>
            <Button 
              className="gap-2" 
              onClick={() => {
                setEditingConsumption(null);
                setShowDialog(true);
              }}
            >
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
                {filteredConsumptions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum consumo registrado neste período.
                  </p>
                ) : (
                  filteredConsumptions.map((consumption) => (
                    <div key={consumption.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">
                          {consumption.trucks_quantity} caminhões de barro
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(consumption.date).toLocaleDateString('pt-BR')} - por {consumption.recorded_by}
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
                        {consumption.truck_id && (
                          <p className="text-sm text-muted-foreground">
                            Caminhão: {consumption.truck_id}
                          </p>
                        )}
                        {consumption.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{consumption.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-muted-foreground" />
                          <span className="text-lg font-semibold">{consumption.trucks_quantity}</span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditConsumption(consumption)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteConsumption(consumption.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <ClayConsumptionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSave={handleSaveConsumption}
        consumption={editingConsumption}
      />
    </div>
  );
};

export default RawMaterialPage;
