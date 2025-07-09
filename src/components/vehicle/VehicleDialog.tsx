
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
import { useToast } from '@/hooks/use-toast';

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (vehicle: any) => void;
  vehicle?: any;
}

const VehicleDialog = ({ open, onOpenChange, onSave, vehicle }: VehicleDialogProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    model: '',
    type: VehicleType.GAS,
    capacity: '',
    acquisition_date: '',
    last_maintenance: '',
    status: VehicleStatus.OPERATIONAL,
    hour_meter: 0,
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        model: vehicle.model || '',
        type: vehicle.type || VehicleType.GAS,
        capacity: vehicle.capacity || '',
        acquisition_date: vehicle.acquisition_date ? 
          new Date(vehicle.acquisition_date).toISOString().split('T')[0] : '',
        last_maintenance: vehicle.last_maintenance ? 
          new Date(vehicle.last_maintenance).toISOString().split('T')[0] : '',
        status: vehicle.status || VehicleStatus.OPERATIONAL,
        hour_meter: vehicle.hour_meter || 0,
      });
    } else {
      setFormData({
        model: '',
        type: VehicleType.GAS,
        capacity: '',
        acquisition_date: '',
        last_maintenance: '',
        status: VehicleStatus.OPERATIONAL,
        hour_meter: 0,
      });
    }
  }, [vehicle, open]);

  const handleChange = (field: string, value: any) => {
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
    
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Editar Veículo' : 'Novo Veículo'}</DialogTitle>
          <DialogDescription>
            Preencha as informações do veículo abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <Input 
              id="model" 
              value={formData.model} 
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="Ex: Toyota Hilux"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <select 
              id="type"
              className="w-full p-2 rounded-md border border-input bg-background"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value as VehicleType)}
              required
            >
              {Object.values(VehicleType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacidade</Label>
            <Input 
              id="capacity" 
              value={formData.capacity} 
              onChange={(e) => handleChange('capacity', e.target.value)}
              placeholder="Ex: 2.5 toneladas"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="acquisition_date">Data de Aquisição</Label>
            <Input 
              id="acquisition_date" 
              type="date"
              value={formData.acquisition_date} 
              onChange={(e) => handleChange('acquisition_date', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_maintenance">Última Manutenção</Label>
            <Input 
              id="last_maintenance" 
              type="date"
              value={formData.last_maintenance} 
              onChange={(e) => handleChange('last_maintenance', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hour_meter">Horímetro</Label>
            <Input 
              id="hour_meter" 
              type="number"
              value={formData.hour_meter} 
              onChange={(e) => handleChange('hour_meter', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select 
              id="status"
              className="w-full p-2 rounded-md border border-input bg-background"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as VehicleStatus)}
            >
              {Object.values(VehicleStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {vehicle ? 'Atualizar' : 'Criar'} Veículo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDialog;
