
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
import { VehicleStatus, VehicleType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: any;
  onSave: (vehicle: any) => void;
}

const VehicleDialog = ({ open, onOpenChange, vehicle, onSave }: VehicleDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!vehicle;
  
  const [formData, setFormData] = useState({
    model: '',
    type: VehicleType.TRUCK,
    acquisitionDate: format(new Date(), 'dd/MM/yyyy'),
    lastMaintenance: format(new Date(), 'dd/MM/yyyy'),
    status: VehicleStatus.OPERATIONAL,
    hourMeter: 0
  });

  // Update form when vehicle prop changes
  useEffect(() => {
    if (vehicle) {
      setFormData({
        model: vehicle.model || '',
        type: vehicle.type || VehicleType.TRUCK,
        acquisitionDate: vehicle.acquisition_date ? 
          format(new Date(vehicle.acquisition_date), 'dd/MM/yyyy') : 
          format(new Date(), 'dd/MM/yyyy'),
        lastMaintenance: vehicle.last_maintenance ? 
          format(new Date(vehicle.last_maintenance), 'dd/MM/yyyy') : 
          format(new Date(), 'dd/MM/yyyy'),
        status: vehicle.status || VehicleStatus.OPERATIONAL,
        hourMeter: vehicle.hour_meter || 0
      });
    } else {
      setFormData({
        model: '',
        type: VehicleType.TRUCK,
        acquisitionDate: format(new Date(), 'dd/MM/yyyy'),
        lastMaintenance: format(new Date(), 'dd/MM/yyyy'),
        status: VehicleStatus.OPERATIONAL,
        hourMeter: 0
      });
    }
  }, [vehicle]);

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Parse date string to Date object (dd/MM/yyyy -> Date)
  const parseDate = (dateStr: string): Date => {
    try {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    } catch (e) {
      return new Date();
    }
  };

  // Format date for display (Date -> dd/MM/yyyy)
  const formatDateString = (date: Date): string => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.model) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Save vehicle
    onSave(formData);
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        model: '',
        type: VehicleType.TRUCK,
        acquisitionDate: format(new Date(), 'dd/MM/yyyy'),
        lastMaintenance: format(new Date(), 'dd/MM/yyyy'),
        status: VehicleStatus.OPERATIONAL,
        hourMeter: 0
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Veículo' : 'Adicionar Novo Veículo'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do veículo nos campos abaixo.' 
              : 'Preencha as informações do novo veículo nos campos abaixo.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={VehicleType.TRUCK}>Caminhão</SelectItem>
                  <SelectItem value={VehicleType.TRACTOR}>Trator</SelectItem>
                  <SelectItem value={VehicleType.GAS}>Empilhadeira Gás</SelectItem>
                  <SelectItem value={VehicleType.ELECTRIC}>Empilhadeira Elétrica</SelectItem>
                  <SelectItem value={VehicleType.RETRACTABLE}>Empilhadeira Retrátil</SelectItem>
                  <SelectItem value={VehicleType.LOADER}>Pá Carregadeira</SelectItem>
                  <SelectItem value={VehicleType.EXCAVATOR}>Retro Escavadeira</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={VehicleStatus.OPERATIONAL}>Em Operação</SelectItem>
                  <SelectItem value={VehicleStatus.MAINTENANCE}>Aguardando Manutenção</SelectItem>
                  <SelectItem value={VehicleStatus.STOPPED}>Parada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="model">Modelo</Label>
              <Input 
                id="model" 
                value={formData.model} 
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder="Ex: Toyota 8FGU25"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hourMeter">Horímetro</Label>
              <Input 
                id="hourMeter" 
                type="number"
                min="0"
                value={formData.hourMeter} 
                onChange={(e) => handleChange('hourMeter', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Data de Aquisição</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.acquisitionDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.acquisitionDate)}
                  onSelect={(date) => handleChange('acquisitionDate', formatDateString(date || new Date()))}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Última Manutenção</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.lastMaintenance}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.lastMaintenance)}
                  onSelect={(date) => handleChange('lastMaintenance', formatDateString(date || new Date()))}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Adicionar Veículo'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDialog;
