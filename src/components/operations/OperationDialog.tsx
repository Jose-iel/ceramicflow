import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { OperationStatus } from '@/types';

// Tipo para dados do banco (snake_case)
interface OperationDbData {
  id?: string;
  type: string;
  location?: string;
  operator: string;
  start_date?: string;
  end_date?: string;
  status: OperationStatus;
  employee_id?: string;
  vehicle_id?: string;
  operation_type: string;
  description?: string;
  initial_hour_meter?: number;
  current_hour_meter?: number;
  start_time?: string;
  end_time?: string;
  gas_consumption?: number;
  fuel_consumption?: number;
}

// Tipo para dados brutos do Supabase
interface OperationRawData {
  id?: string;
  type: string;
  location?: string;
  operator: string;
  start_date?: string;
  end_date?: string;
  status: OperationStatus;
  employee_id?: string;
  vehicle_id?: string;
  operation_type: string;
  description?: string;
  initial_hour_meter?: number;
  current_hour_meter?: number;
  start_time?: string;
  end_time?: string;
  gas_consumption?: number;
  fuel_consumption?: number;
  ceramic_id?: string;
  created_at?: string;
  updated_at?: string;
  vehicles?: { model: string; type: string } | null;
  employees?: { name: string } | null;
}

interface OperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (operation: Omit<OperationDbData, 'id'>) => void;
  operation?: OperationRawData;
  availableOperators: { id: string; name: string }[];
  availableVehicles: { id: string; model: string }[];
}

const OperationDialog = ({
  open,
  onOpenChange,
  onSave,
  operation,
  availableOperators,
  availableVehicles,
}: OperationDialogProps) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: '',
    location: '',
    operator: '',
    startDate: '',
    endDate: '',
    status: OperationStatus.IN_PROGRESS,
    employeeId: '',
    vehicleId: '',
    operationType: 'manual',
    description: '',
    initialHourMeter: 0,
    currentHourMeter: 0,
    startTime: '',
    endTime: '',
    gasConsumption: 0,
    fuelConsumption: 0 as number | '',
  });

  useEffect(() => {
    if (operation) {
      setFormData({
        type: operation.type || '',
        location: operation.location || '',
        operator: operation.operator || '',
        startDate: operation.start_date ? new Date(operation.start_date).toISOString().split('T')[0] : '',
        endDate: operation.end_date ? new Date(operation.end_date).toISOString().split('T')[0] : '',
        status: operation.status || OperationStatus.IN_PROGRESS,
        employeeId: operation.employee_id || '',
        vehicleId: operation.vehicle_id || '',
        operationType: operation.operation_type || 'manual',
        description: operation.description || '',
        initialHourMeter: operation.initial_hour_meter || 0,
        currentHourMeter: operation.current_hour_meter || 0,
        startTime: operation.start_time || '',
        endTime: operation.end_time || '',
        gasConsumption: operation.gas_consumption || 0,
        fuelConsumption: operation.fuel_consumption || (0 as number | ''),
      });
    } else {
      setFormData({
        type: '',
        location: '',
        operator: '',
        startDate: '',
        endDate: '',
        status: OperationStatus.IN_PROGRESS,
        employeeId: '',
        vehicleId: '',
        operationType: 'manual',
        description: '',
        initialHourMeter: 0,
        currentHourMeter: 0,
        startTime: '',
        endTime: '',
        gasConsumption: 0,
        fuelConsumption: 0 as number | '',
      });
    }
  }, [operation, open]);

  const handleChange = (field: string, value: string | number | OperationStatus) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.operator) {
      toast({
        title: 'Erro ao salvar',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    // Converte os dados para o formato esperado pelo banco (snake_case)
    const operationData = {
      type: formData.type,
      location: formData.location,
      operator: formData.operator,
      start_date: formData.startDate || null,
      end_date: formData.endDate || null,
      status: formData.status,
      employee_id: formData.employeeId || null,
      vehicle_id: formData.vehicleId || null,
      operation_type: formData.operationType,
      description: formData.description,
      initial_hour_meter: formData.initialHourMeter || 0,
      current_hour_meter: formData.currentHourMeter || 0,
      start_time: formData.startTime || null,
      end_time: formData.endTime || null,
      gas_consumption: formData.gasConsumption || 0,
      fuel_consumption:
        typeof formData.fuelConsumption === 'string' && formData.fuelConsumption === ''
          ? 0
          : (formData.fuelConsumption as number) || 0,
    };

    onSave(operationData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{operation ? 'Editar Operação' : 'Nova Operação'}</DialogTitle>
          <DialogDescription>Preencha as informações da operação abaixo.</DialogDescription>
        </DialogHeader>

        <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Informações Básicas</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Operação *</Label>
                <Input
                  required
                  id="type"
                  placeholder="Ex: Coleta de Barro"
                  value={formData.type}
                  onChange={e => handleChange('type', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  placeholder="Local da operação"
                  value={formData.location}
                  onChange={e => handleChange('location', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operator">Operador *</Label>
                <select
                  required
                  className="w-full p-2 rounded-md border border-input bg-background text-sm"
                  id="operator"
                  value={formData.employeeId}
                  onChange={e => {
                    const selectedOperator = availableOperators.find(op => op.id === e.target.value);
                    handleChange('employeeId', e.target.value);
                    handleChange('operator', selectedOperator?.name || '');
                  }}
                >
                  <option value="">Selecione um operador</option>
                  {availableOperators.map(operator => (
                    <option key={operator.id} value={operator.id}>
                      {operator.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle">Veículo (opcional)</Label>
                <select
                  className="w-full p-2 rounded-md border border-input bg-background text-sm"
                  id="vehicle"
                  value={formData.vehicleId}
                  onChange={e => handleChange('vehicleId', e.target.value)}
                >
                  <option value="">Nenhum veículo</option>
                  {availableVehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Descrição da operação"
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
              />
            </div>
          </div>

          {/* Período e Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Período e Status</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={e => handleChange('startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={e => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                className="w-full p-2 rounded-md border border-input bg-background text-sm"
                id="status"
                value={formData.status}
                onChange={e => handleChange('status', e.target.value as OperationStatus)}
              >
                {Object.values(OperationStatus).map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Consumo de Combustível */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Consumo</h3>

            <div className="space-y-2">
              <Label htmlFor="fuelConsumption">Consumo de Combustível (Litros)</Label>
              <Input
                id="fuelConsumption"
                min="0"
                placeholder="0.0"
                step="0.1"
                type="number"
                value={formData.fuelConsumption || ''}
                onChange={e => {
                  const { value } = e.target;
                  handleChange('fuelConsumption', value === '' ? '' : parseFloat(value) || 0);
                }}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
            <Button className="w-full sm:w-auto" type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="w-full sm:w-auto" type="submit">
              {operation ? 'Atualizar' : 'Criar'} Operação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OperationDialog;
