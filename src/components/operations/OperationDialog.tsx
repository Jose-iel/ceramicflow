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
import { OperationStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Tipo para dados do banco (snake_case)
type OperationDbData = {
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
};

// Tipo para dados brutos do Supabase
type OperationRawData = {
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
  ceramic_id?: string;
  created_at?: string;
  updated_at?: string;
  vehicles?: { model: string; type: string } | null;
  employees?: { name: string } | null;
};

interface OperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (operation: Omit<OperationDbData, 'id'>) => void;
  operation?: OperationRawData;
  availableOperators: Array<{ id: string; name: string }>;
  availableVehicles: Array<{ id: string; model: string }>;
}

const OperationDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  operation, 
  availableOperators, 
  availableVehicles 
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
  });

  useEffect(() => {
    if (operation) {
      setFormData({
        type: operation.type || '',
        location: operation.location || '',
        operator: operation.operator || '',
        startDate: operation.start_date ? 
          new Date(operation.start_date).toISOString().split('T')[0] : '',
        endDate: operation.end_date ? 
          new Date(operation.end_date).toISOString().split('T')[0] : '',
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
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
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
    };
    
    onSave(operationData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{operation ? 'Editar Operação' : 'Nova Operação'}</DialogTitle>
          <DialogDescription>
            Preencha as informações da operação abaixo.
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
                <Label htmlFor="type">Tipo de Operação *</Label>
                <Input 
                  id="type" 
                  value={formData.type} 
                  onChange={(e) => handleChange('type', e.target.value)}
                  placeholder="Ex: Coleta de Barro"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input 
                  id="location" 
                  value={formData.location} 
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Local da operação"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operator">Operador *</Label>
                <select 
                  id="operator"
                  className="w-full p-2 rounded-md border border-input bg-background text-sm"
                  value={formData.employeeId}
                  onChange={(e) => {
                    const selectedOperator = availableOperators.find(op => op.id === e.target.value);
                    handleChange('employeeId', e.target.value);
                    handleChange('operator', selectedOperator?.name || '');
                  }}
                  required
                >
                  <option value="">Selecione um operador</option>
                  {availableOperators.map(operator => (
                    <option key={operator.id} value={operator.id}>{operator.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle">Veículo (opcional)</Label>
                <select 
                  id="vehicle"
                  className="w-full p-2 rounded-md border border-input bg-background text-sm"
                  value={formData.vehicleId}
                  onChange={(e) => handleChange('vehicleId', e.target.value)}
                >
                  <option value="">Nenhum veículo</option>
                  {availableVehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>{vehicle.model}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input 
                id="description" 
                value={formData.description} 
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descrição da operação"
              />
            </div>
          </div>
          
          {/* Período e Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
              Período e Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input 
                  id="startDate" 
                  type="date"
                  value={formData.startDate} 
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Fim</Label>
                <Input 
                  id="endDate" 
                  type="date"
                  value={formData.endDate} 
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status"
                className="w-full p-2 rounded-md border border-input bg-background text-sm"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as OperationStatus)}
              >
                {Object.values(OperationStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
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
              {operation ? 'Atualizar' : 'Criar'} Operação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OperationDialog;
