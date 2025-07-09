
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
import { useToast } from '@/hooks/use-toast';

interface WoodConsumptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (consumption: any) => void;
  consumption?: any;
}

const WoodConsumptionDialog = ({ open, onOpenChange, onSave, consumption }: WoodConsumptionDialogProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: 0,
    oven: '',
    responsible: '',
    observations: ''
  });

  useEffect(() => {
    if (consumption) {
      setFormData({
        date: consumption.date ? 
          new Date(consumption.date).toISOString().split('T')[0] : 
          new Date().toISOString().split('T')[0],
        quantity: Number(consumption.quantity) || 0,
        oven: consumption.oven || '',
        responsible: consumption.responsible || '',
        observations: consumption.observations || ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        quantity: 0,
        oven: '',
        responsible: '',
        observations: ''
      });
    }
  }, [consumption, open]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.quantity || !formData.oven || !formData.responsible) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{consumption ? 'Editar Consumo' : 'Registrar Consumo de Lenha'}</DialogTitle>
          <DialogDescription>
            Preencha as informações do consumo de lenha nos campos abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input 
              id="date" 
              type="date"
              value={formData.date} 
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade (m³)</Label>
              <Input 
                id="quantity" 
                type="number"
                step="0.1"
                min="0"
                value={formData.quantity} 
                onChange={(e) => handleChange('quantity', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="oven">Forno</Label>
              <Input 
                id="oven" 
                value={formData.oven} 
                onChange={(e) => handleChange('oven', e.target.value)}
                placeholder="Ex: Forno 1"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Input 
              id="responsible" 
              value={formData.responsible} 
              onChange={(e) => handleChange('responsible', e.target.value)}
              placeholder="Nome do responsável"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Input 
              id="observations" 
              value={formData.observations} 
              onChange={(e) => handleChange('observations', e.target.value)}
              placeholder="Observações adicionais"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {consumption ? 'Atualizar' : 'Registrar'} Consumo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WoodConsumptionDialog;
