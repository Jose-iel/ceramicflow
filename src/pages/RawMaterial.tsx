
import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Mountain, Plus, Truck } from 'lucide-react';
import PageLayout from '@/components/common/PageLayout';
import ClayConsumptionDialog from '@/components/rawmaterial/ClayConsumptionDialog';
import { useToast } from '@/hooks/use-toast';
import { useMonthFilter } from '@/hooks/useMonthFilter';
import {
  useClayConsumptions, 
  useCreateClayConsumption, 
  useUpdateClayConsumption, 
  useDeleteClayConsumption
} from '@/hooks';
import { CreateClayConsumptionPayload, ClayConsumption } from '@/integrations/supabase/api';
import type { ClayConsumptionRawData } from '@/types';

const RawMaterialPage = () => {
  const { toast } = useToast();
  
  // Month filter hook
  const { selectedMonth, setSelectedMonth, filterDataByMonth } = useMonthFilter();
  
  // Real database hooks
  const { data: clayConsumptions = [], isLoading } = useClayConsumptions();
  const createClayConsumption = useCreateClayConsumption();
  const updateClayConsumption = useUpdateClayConsumption();
  const deleteClayConsumption = useDeleteClayConsumption();
  
  // Function to get truck model by ID
  const getTruckModel = (truckId: string) => {
    // TODO: Implement trucks hook when needed
    // const truck = trucks.find(t => t.id === truckId);
    // return truck ? truck.model : truckId;
    return `Caminhão ${truckId}`;
  };
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingConsumption, setEditingConsumption] = useState<ClayConsumptionRawData | null>(null);

  // Filter data by selected month using the hook
  const filteredConsumptions = useMemo(() => {
    return filterDataByMonth(clayConsumptions);
  }, [clayConsumptions, filterDataByMonth]);
  
  const totalMonthlyTrucks = filteredConsumptions.reduce((sum, item) => sum + Number(item.trucks_quantity || 0), 0);
  const averageDailyConsumption = filteredConsumptions.length > 0 
    ? totalMonthlyTrucks / filteredConsumptions.length 
    : 0;

  const handleSaveConsumption = (consumption: { 
    date: string; 
    trucks_quantity: number; 
    supplier?: string; 
    origin?: string; 
    truck_id?: string; 
    recorded_by: string; 
    notes?: string; 
  }) => {
    if (editingConsumption) {
      updateClayConsumption.mutate({
        clayConsumptionId: editingConsumption.id,
        payload: consumption as unknown as CreateClayConsumptionPayload
      });
    } else {
      createClayConsumption.mutate(consumption as unknown as CreateClayConsumptionPayload);
    }
    setEditingConsumption(null);
    setShowDialog(false);
  };

  const handleEditConsumption = (consumption: ClayConsumption) => {
    setEditingConsumption(consumption as unknown as ClayConsumptionRawData);
    setShowDialog(true);
  };

  const handleDeleteConsumption = (id: string) => {
    deleteClayConsumption.mutate(id);
  };

  // Stats cards configuration
  const statsCards = [
    {
      title: "Total no Mês",
      value: `${totalMonthlyTrucks} caminhões`,
      subtitle: "Total de caminhões no período",
      icon: Truck,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100"
    },
    {
      title: "Média por Registro",
      value: `${averageDailyConsumption.toFixed(1)} caminhões`,
      subtitle: "Média por registro no período",
      icon: Mountain,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100"
    }
  ];

  // Actions configuration
  const actions = [
    {
      label: "Registrar Consumo",
      onClick: () => {
        setEditingConsumption(null);
        setShowDialog(true);
      },
      icon: <Plus className="w-4 h-4" />
    }
  ];

  return (
    <PageLayout
      title="Matéria-Prima"
      subtitle="Gestão de Consumo de Barro"
      selectedMonth={selectedMonth}
      onMonthChange={setSelectedMonth}
      statsCards={statsCards}
      actions={actions}
      isLoading={isLoading}
      showSearch={false}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Consumo de Barro</h2>
        
        <div className="space-y-4">
          {filteredConsumptions.length === 0 ? (
            <div className="bg-card rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Nenhum consumo registrado neste período.
              </p>
            </div>
          ) : (
            filteredConsumptions.map((consumption) => (
              <div key={consumption.id} className="bg-card border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg mb-2">
                      {consumption.trucks_quantity} caminhões de barro
                    </h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        📅 {new Date(consumption.date).toLocaleDateString('pt-BR')} - por {consumption.recorded_by}
                      </p>
                      {consumption.supplier && (
                        <p>🏢 Fornecedor: {consumption.supplier}</p>
                      )}
                      {consumption.origin && (
                        <p>📍 Origem: {consumption.origin}</p>
                      )}
                      {consumption.truck_id && (
                        <p>🚛 Caminhão: {getTruckModel(consumption.truck_id)}</p>
                      )}
                      {consumption.notes && (
                        <p className="mt-2 p-2 bg-muted/50 rounded text-foreground">💬 {consumption.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="w-5 h-5 text-muted-foreground" />
                      <span className="text-lg font-semibold">{consumption.trucks_quantity}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditConsumption(consumption)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteConsumption(consumption.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <ClayConsumptionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSave={handleSaveConsumption}
        consumption={editingConsumption}
      />
    </PageLayout>
  );
};

export default RawMaterialPage;
