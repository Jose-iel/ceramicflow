import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Vehicle, CreateVehiclePayload } from '@/integrations/supabase/api';
import { VehicleType, VehicleStatus } from '@/types';

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
    type: VehicleType.CAR,
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
        type: (vehicle.type as VehicleType) || VehicleType.CAR,
        capacity: vehicle.capacity || '',
        acquisitionDate: vehicle.acquisition_date ? new Date(vehicle.acquisition_date).toISOString().split('T')[0] : '',
        lastMaintenance: vehicle.last_maintenance ? new Date(vehicle.last_maintenance).toISOString().split('T')[0] : '',
        status: (vehicle.status as VehicleStatus) || VehicleStatus.OPERATIONAL,
        hourMeter: vehicle.hour_meter || 0,
      });
    } else {
      setFormData({
        model: '',
        type: VehicleType.CAR,
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
        title: 'Erro ao salvar',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
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
      hour_meter: formData.hourMeter === '' ? 0 : Number(formData.hourMeter) || 0,
    };

    onSave(vehicleData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Editar Veículo' : 'Novo Veículo'}</DialogTitle>
          <DialogDescription>Preencha as informações do veículo abaixo.</DialogDescription>
        </DialogHeader>

        <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Informações Básicas</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  required
                  id="model"
                  data-testid="vehicle-model-input"
                  placeholder="Ex: Toyota Hilux"
                  value={formData.model}
                  onChange={e => handleChange('model', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select value={formData.type} onValueChange={value => handleChange('type', value as VehicleType)}>
                  <SelectTrigger data-testid="vehicle-type-select">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(VehicleType).map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade em Toneladas</Label>
                <Input
                  id="capacity"
                  data-testid="vehicle-capacity-input"
                  placeholder="Ex: 2.5 toneladas"
                  value={formData.capacity}
                  onChange={e => handleChange('capacity', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={value => handleChange('status', value as VehicleStatus)}>
                  <SelectTrigger data-testid="vehicle-status-select">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(VehicleStatus).map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Datas e Horímetro */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Controle e Manutenção</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="acquisitionDate">Data de Aquisição</Label>
                <Input
                  id="acquisitionDate"
                  data-testid="vehicle-acquisition-date-input"
                  type="date"
                  value={formData.acquisitionDate}
                  onChange={e => handleChange('acquisitionDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastMaintenance">Última Manutenção</Label>
                <Input
                  id="lastMaintenance"
                  data-testid="vehicle-last-maintenance-input"
                  type="date"
                  value={formData.lastMaintenance}
                  onChange={e => handleChange('lastMaintenance', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourMeter">Horímetro (horas)</Label>
                <Input
                  id="hourMeter"
                  data-testid="vehicle-hour-meter-input"
                  min="0"
                  placeholder="Digite as horas"
                  type="number"
                  value={formData.hourMeter || ''}
                  onChange={e => {
                    const { value } = e.target;
                    if (value === '') {
                      handleChange('hourMeter', '');
                    } else {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue >= 0) {
                        handleChange('hourMeter', numValue);
                      }
                    }
                  }}
                />
              </div>
              <div className="space-y-2">{/* Espaço para futuras expansões */}</div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
            <Button className="w-full sm:w-auto" type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="w-full sm:w-auto" type="submit">
              {vehicle ? 'Atualizar' : 'Criar'} Veículo
              {/* data-testid para submit */}
              <span data-testid="vehicle-submit-button" style={{ display: 'none' }} />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDialog;
