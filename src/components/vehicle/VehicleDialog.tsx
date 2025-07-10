import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VehicleType, VehicleStatus } from '@/types';
import { Vehicle, CreateVehiclePayload } from '@/integrations/supabase/api';
import { useToast } from '@/hooks/use-toast';

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (vehicle: CreateVehiclePayload) => void;
  vehicle?: Vehicle | null;
}

const VehicleDialog = ({ open, onOpenChange, onSave, vehicle }: VehicleDialogProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    model: '',
    type: VehicleType.GAS,
    capacity: '',
    acquisitionDate: '',
    lastMaintenance: '',
    status: VehicleStatus.OPERATIONAL,
    hourMeter: '' as string | number,
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        model: vehicle.model || '',
        type: (vehicle.type as VehicleType) || VehicleType.GAS,
        capacity: vehicle.capacity || '',
        acquisitionDate: vehicle.acquisition_date ? 
          new Date(vehicle.acquisition_date).toISOString().split('T')[0] : '',
        lastMaintenance: vehicle.last_maintenance ? 
          new Date(vehicle.last_maintenance).toISOString().split('T')[0] : '',
        status: (vehicle.status as VehicleStatus) || VehicleStatus.OPERATIONAL,
        hourMeter: vehicle.hour_meter || 0,
      });
    } else {
      setFormData({
        model: '',
        type: VehicleType.GAS,
        capacity: '',
        acquisitionDate: '',
        lastMaintenance: '',
        status: VehicleStatus.OPERATIONAL,
        hourMeter: '',
      });
    }
  }, [vehicle, open]);

  const handleChange = (field: string, value: string | number | VehicleType | VehicleStatus) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.model || !formData.type) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Converte os dados para o formato esperado pelo banco (snake_case)
    const vehicleData = {
      model: formData.model,
      type: formData.type,
      capacity: formData.capacity,
      acquisition_date: formData.acquisitionDate || null,
      last_maintenance: formData.lastMaintenance || null,
      status: formData.status,
      hour_meter: formData.hourMeter === '' ? 0 : Number(formData.hourMeter) || 0
    };
    
    onSave(vehicleData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Editar Veículo' : 'Novo Veículo'}</DialogTitle>
          <DialogDescription>
            Preencha as informações do veículo abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
              Informações Básicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Modelo *</Label>
                <Input 
                  id="model" 
                  value={formData.model} 
                  onChange={(e) => handleChange('model', e.target.value)}
                  placeholder="Ex: Toyota Hilux"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <select 
                  id="type"
                  className="w-full p-2 rounded-md border border-input bg-background text-sm"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value as VehicleType)}
                  required
                >
                  {Object.values(VehicleType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade em Toneladas</Label>
                <Input 
                  id="capacity" 
                  value={formData.capacity} 
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  placeholder="Ex: 2.5 toneladas"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status"
                  className="w-full p-2 rounded-md border border-input bg-background text-sm"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as VehicleStatus)}
                >
                  {Object.values(VehicleStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Datas e Horímetro */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
              Controle e Manutenção
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="acquisitionDate">Data de Aquisição</Label>
                <Input 
                  id="acquisitionDate" 
                  type="date"
                  value={formData.acquisitionDate} 
                  onChange={(e) => handleChange('acquisitionDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastMaintenance">Última Manutenção</Label>
                <Input 
                  id="lastMaintenance" 
                  type="date"
                  value={formData.lastMaintenance} 
                  onChange={(e) => handleChange('lastMaintenance', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourMeter">Horímetro (horas)</Label>
                <Input 
                  id="hourMeter" 
                  type="number"
                  min="0"
                  value={formData.hourMeter || ''} 
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      handleChange('hourMeter', '');
                    } else {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue >= 0) {
                        handleChange('hourMeter', numValue);
                      }
                    }
                  }}
                  placeholder="Digite as horas"
                />
              </div>
              <div className="space-y-2">
                {/* Espaço para futuras expansões */}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="w-full sm:w-auto"
            >
              {vehicle ? 'Atualizar' : 'Criar'} Veículo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDialog;
