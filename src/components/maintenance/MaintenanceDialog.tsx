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
import { MaintenanceStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Tipo para dados do banco (snake_case)
type MaintenanceDbData = {
  id?: string;
  vehicle_id: string;
  issue: string;
  reported_by: string;
  reported_date?: string;
  status: MaintenanceStatus;
  completed_date?: string;
};

// Tipo para dados brutos do Supabase
type MaintenanceRawData = {
  id?: string;
  vehicle_id: string;
  issue: string;
  reported_by: string;
  reported_date?: string;
  status: MaintenanceStatus | string;
  completed_date?: string;
  ceramic_id?: string;
  created_at?: string;
  updated_at?: string;
  vehicles?: { model: string; type: string } | null;
};

interface MaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance?: MaintenanceRawData;
  onSave: (maintenance: Omit<MaintenanceDbData, 'id'>) => void;
  availableVehicles: { id: string; model: string }[];
  availableOperators: { id: string; name: string }[];
}

const MaintenanceDialog = ({ 
  open, 
  onOpenChange, 
  maintenance, 
  onSave,
  availableVehicles,
  availableOperators 
}: MaintenanceDialogProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    issue: '',
    reportedBy: '',
    reportedDate: '',
    status: MaintenanceStatus.WAITING,
    completedDate: '',
  });

  useEffect(() => {
    if (maintenance) {
      setFormData({
        vehicleId: maintenance.vehicle_id || '',
        issue: maintenance.issue || '',
        reportedBy: maintenance.reported_by || '',
        reportedDate: maintenance.reported_date ? 
          new Date(maintenance.reported_date).toISOString().split('T')[0] : '',
        status: (maintenance.status as MaintenanceStatus) || MaintenanceStatus.WAITING,
        completedDate: maintenance.completed_date ? 
          new Date(maintenance.completed_date).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        vehicleId: '',
        issue: '',
        reportedBy: '',
        reportedDate: new Date().toISOString().split('T')[0],
        status: MaintenanceStatus.WAITING,
        completedDate: '',
      });
    }
  }, [maintenance, open]);

  const handleChange = (field: string, value: string | MaintenanceStatus) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If changing status to completed, set completed date to today
    if (field === 'status' && value === MaintenanceStatus.COMPLETED) {
      setFormData(prev => ({ 
        ...prev, 
        completedDate: new Date().toISOString().split('T')[0]
      }));
    }
    // If changing status from completed, clear completed date
    else if (field === 'status' && value !== MaintenanceStatus.COMPLETED) {
      setFormData(prev => ({ ...prev, completedDate: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleId || !formData.issue || !formData.reportedBy || !formData.reportedDate) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Converte os dados para o formato esperado pelo banco (snake_case)
    const maintenanceData = {
      vehicle_id: formData.vehicleId,
      issue: formData.issue,
      reported_by: formData.reportedBy,
      reported_date: formData.reportedDate || null,
      status: formData.status,
      completed_date: formData.completedDate || null,
    };
    
    onSave(maintenanceData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{maintenance ? 'Editar Manutenção' : 'Nova Manutenção'}</DialogTitle>
          <DialogDescription>
            Preencha as informações da manutenção abaixo.
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
                <Label htmlFor="vehicleId">Veículo *</Label>
                <Select value={formData.vehicleId} onValueChange={(value) => handleChange('vehicleId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value as MaintenanceStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MaintenanceStatus.WAITING}>Aguardando</SelectItem>
                    <SelectItem value={MaintenanceStatus.IN_PROGRESS}>Em Andamento</SelectItem>
                    <SelectItem value={MaintenanceStatus.COMPLETED}>Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issue">Descrição do Problema *</Label>
              <Textarea 
                id="issue" 
                value={formData.issue} 
                onChange={(e) => handleChange('issue', e.target.value)}
                placeholder="Descreva o problema do veículo"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportedBy">Reportado por *</Label>
                <Select value={formData.reportedBy} onValueChange={(value) => handleChange('reportedBy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOperators.map(operator => (
                      <SelectItem key={operator.id} value={operator.name}>
                        {operator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportedDate">Data Reportada *</Label>
                <Input 
                  id="reportedDate" 
                  type="date"
                  value={formData.reportedDate} 
                  onChange={(e) => handleChange('reportedDate', e.target.value)}
                  required
                />
              </div>
            </div>
            
            {formData.status === MaintenanceStatus.COMPLETED && (
              <div className="space-y-2">
                <Label htmlFor="completedDate">Data de Conclusão</Label>
                <Input 
                  id="completedDate" 
                  type="date"
                  value={formData.completedDate} 
                  onChange={(e) => handleChange('completedDate', e.target.value)}
                />
              </div>
            )}
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
              {maintenance ? 'Atualizar' : 'Criar'} Manutenção
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceDialog;
