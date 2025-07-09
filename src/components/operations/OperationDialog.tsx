
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

interface OperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (operation: any) => void;
  operation?: any;
  availableOperators: Array<{ id: string; name: string }>;
  availableForklifts: Array<{ id: string; model: string }>;
}

const OperationDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  operation, 
  availableOperators, 
  availableForklifts 
}: OperationDialogProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    operator: '',
    start_date: '',
    end_date: '',
    status: OperationStatus.IN_PROGRESS,
    employee_id: '',
    vehicle_id: '',
    operation_type: 'manual',
    description: '',
    initial_hour_meter: 0,
    current_hour_meter: 0,
    start_time: '',
    end_time: '',
    gas_consumption: 0,
  });

  useEffect(() => {
    if (operation) {
      setFormData({
        type: operation.type || '',
        location: operation.location || '',
        operator: operation.operator || '',
        start_date: operation.start_date ? 
          new Date(operation.start_date).toISOString().split('T')[0] : '',
        end_date: operation.end_date ? 
          new Date(operation.end_date).toISOString().split('T')[0] : '',
        status: operation.status || OperationStatus.IN_PROGRESS,
        employee_id: operation.employee_id || '',
        vehicle_id: operation.vehicle_id || '',
        operation_type: operation.operation_type || 'manual',
        description: operation.description || '',
        initial_hour_meter: operation.initial_hour_meter || 0,
        current_hour_meter: operation.current_hour_meter || 0,
        start_time: operation.start_time || '',
        end_time: operation.end_time || '',
        gas_consumption: operation.gas_consumption || 0,
      });
    } else {
      setFormData({
        type: '',
        location: '',
        operator: '',
        start_date: '',
        end_date: '',
        status: OperationStatus.IN_PROGRESS,
        employee_id: '',
        vehicle_id: '',
        operation_type: 'manual',
        description: '',
        initial_hour_meter: 0,
        current_hour_meter: 0,
        start_time: '',
        end_time: '',
        gas_consumption: 0,
      });
    }
  }, [operation, open]);

  const handleChange = (field: string, value: any) => {
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
    
    onSave(formData);
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
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Operação</Label>
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
          
          <div className="space-y-2">
            <Label htmlFor="operator">Operador</Label>
            <select 
              id="operator"
              className="w-full p-2 rounded-md border border-input bg-background"
              value={formData.employee_id}
              onChange={(e) => {
                const selectedOperator = availableOperators.find(op => op.id === e.target.value);
                handleChange('employee_id', e.target.value);
                handleChange('operator', selectedOperator?.name || '');
              }}
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
              className="w-full p-2 rounded-md border border-input bg-background"
              value={formData.vehicle_id}
              onChange={(e) => handleChange('vehicle_id', e.target.value)}
            >
              <option value="">Nenhum veículo</option>
              {availableForklifts.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.model}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Data de Início</Label>
              <Input 
                id="start_date" 
                type="date"
                value={formData.start_date} 
                onChange={(e) => handleChange('start_date', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_date">Data de Fim</Label>
              <Input 
                id="end_date" 
                type="date"
                value={formData.end_date} 
                onChange={(e) => handleChange('end_date', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select 
              id="status"
              className="w-full p-2 rounded-md border border-input bg-background"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as OperationStatus)}
            >
              {Object.values(OperationStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
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
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {operation ? 'Atualizar' : 'Criar'} Operação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OperationDialog;
