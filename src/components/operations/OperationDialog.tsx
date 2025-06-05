
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Operation } from '@/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Textarea } from "@/components/ui/textarea";

interface OperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operation?: Operation;
  onSave: (operation: Operation) => void;
  availableOperators: { id: string; name: string }[];
  availableForklifts: { id: string; model: string }[];
}

const OperationDialog = ({ 
  open, 
  onOpenChange, 
  operation, 
  onSave,
  availableOperators,
  availableForklifts
}: OperationDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!operation;
  
  // Form state
  const [formData, setFormData] = useState<Partial<Operation>>({
    employeeId: '',
    employeeName: '',
    vehicleId: '',
    vehicleModel: '',
    operationType: 'manual',
    location: '',
    description: '',
    initialHourMeter: 0,
    currentHourMeter: 0,
    startTime: new Date().toISOString().slice(0, 16),
    status: 'active'
  });

  // Initialize form with operation data if editing
  useEffect(() => {
    if (operation) {
      setFormData({
        ...operation,
        startTime: new Date(operation.startTime).toISOString().slice(0, 16),
        endTime: operation.endTime ? new Date(operation.endTime).toISOString().slice(0, 16) : undefined
      });
    } else {
      // Reset form for new operation
      setFormData({
        employeeId: '',
        employeeName: '',
        vehicleId: '',
        vehicleModel: '',
        operationType: 'manual',
        location: '',
        description: '',
        initialHourMeter: 0,
        currentHourMeter: 0,
        startTime: new Date().toISOString().slice(0, 16),
        status: 'active'
      });
    }
  }, [operation, open]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  // Handle employee selection
  const handleEmployeeChange = (employeeId: string) => {
    const selectedEmployee = availableOperators.find(op => op.id === employeeId);
    if (selectedEmployee) {
      setFormData(prev => ({
        ...prev,
        employeeId,
        employeeName: selectedEmployee.name
      }));
    }
  };

  // Handle vehicle selection
  const handleVehicleChange = (vehicleId: string) => {
    const selectedVehicle = availableForklifts.find(f => f.id === vehicleId);
    if (selectedVehicle) {
      setFormData(prev => ({
        ...prev,
        vehicleId,
        vehicleModel: selectedVehicle.model
      }));
    }
  };

  // Handle operation type change
  const handleOperationTypeChange = (operationType: 'vehicle' | 'manual') => {
    setFormData(prev => ({
      ...prev,
      operationType,
      // Clear vehicle data if switching to manual
      ...(operationType === 'manual' && {
        vehicleId: '',
        vehicleModel: '',
        initialHourMeter: 0,
        currentHourMeter: 0
      })
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.employeeId || !formData.location || !formData.description || !formData.startTime) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // For vehicle operations, vehicle is required
    if (formData.operationType === 'vehicle' && !formData.vehicleId) {
      toast({
        title: "Erro de validação",
        description: "Para operações com veículo, selecione um veículo.",
        variant: "destructive"
      });
      return;
    }

    // Generate ID for new operations
    const operationData: Operation = {
      id: operation?.id || `OP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...formData as Operation
    };

    // Save the operation
    onSave(operationData);
    
    // Close the dialog
    onOpenChange(false);
  };

  // Calculate if the operation can be completed
  const canComplete = isEditing && operation?.status === 'active';

  // Complete the operation
  const handleComplete = () => {
    const now = new Date();
    const completedOperation: Operation = {
      ...formData as Operation,
      status: 'completed',
      endTime: now.toISOString()
    };
    
    onSave(completedOperation);
    onOpenChange(false);
    
    toast({
      title: "Operação concluída",
      description: "A operação foi finalizada com sucesso."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Operação' : 'Nova Operação'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Funcionário</Label>
              <Select 
                value={formData.employeeId} 
                onValueChange={handleEmployeeChange}
              >
                <SelectTrigger id="employeeId">
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {availableOperators.map(operator => (
                    <SelectItem key={operator.id} value={operator.id}>
                      {operator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="operationType">Tipo de Operação</Label>
              <Select 
                value={formData.operationType}
                onValueChange={handleOperationTypeChange}
              >
                <SelectTrigger id="operationType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Operação Manual</SelectItem>
                  <SelectItem value="vehicle">Operação com Veículo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.operationType === 'vehicle' && (
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Veículo</Label>
              <Select 
                value={formData.vehicleId}
                onValueChange={handleVehicleChange}
              >
                <SelectTrigger id="vehicleId">
                  <SelectValue placeholder="Selecione um veículo" />
                </SelectTrigger>
                <SelectContent>
                  {availableForklifts.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} ({vehicle.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ex: Barreiro Norte, Forno 1, Armazém A..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição da Operação</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o que está sendo realizado..."
              rows={3}
            />
          </div>
          
          {formData.operationType === 'vehicle' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initialHourMeter">Horímetro Inicial</Label>
                <Input
                  id="initialHourMeter"
                  name="initialHourMeter"
                  type="number"
                  value={formData.initialHourMeter || 0}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentHourMeter">Horímetro Atual</Label>
                <Input
                  id="currentHourMeter"
                  name="currentHourMeter"
                  type="number"
                  value={formData.currentHourMeter || formData.initialHourMeter || 0}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Data/Hora de Início</Label>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="endTime">Data/Hora de Término</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime || ''}
                  onChange={handleChange}
                  disabled={formData.status === 'active'}
                />
              </div>
            )}
          </div>
          
          {isEditing && formData.operationType === 'vehicle' && (
            <div className="space-y-2">
              <Label htmlFor="gasConsumption">Consumo de Combustível (L)</Label>
              <Input
                id="gasConsumption"
                name="gasConsumption"
                type="number"
                step="0.1"
                value={formData.gasConsumption || ''}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>
          )}
          
          <DialogFooter className="pt-4">
            {canComplete && (
              <Button 
                type="button" 
                variant="outline" 
                className="mr-auto" 
                onClick={handleComplete}
              >
                Finalizar Operação
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Salvar Alterações' : 'Criar Operação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OperationDialog;
