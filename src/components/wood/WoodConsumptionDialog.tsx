import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { WoodConsumption, CreateWoodConsumptionPayload } from '@/integrations/supabase/api/wood';

interface WoodConsumptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (consumption: CreateWoodConsumptionPayload) => void;
  consumption?: WoodConsumption;
}

const WoodConsumptionDialog = ({ open, onOpenChange, onSave, consumption }: WoodConsumptionDialogProps) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    oven: '',
    responsible: '',
    observations: '',
  });

  useEffect(() => {
    if (consumption) {
      setFormData({
        date: consumption.date || new Date().toISOString().split('T')[0],
        quantity: consumption.quantity ? consumption.quantity.toString() : '',
        oven: consumption.oven || '',
        responsible: consumption.responsible || '',
        observations: consumption.observations || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        quantity: '',
        oven: '',
        responsible: '',
        observations: '',
      });
    }
  }, [consumption, open]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.quantity || !formData.oven || !formData.responsible) {
      toast({
        title: 'Erro ao salvar',
        description: 'Preencha todos os campos obrigatórios (Quantidade, Forno e Responsável)',
        variant: 'destructive',
      });
      return;
    }

    // Convert strings to numbers for submission
    const submissionData: CreateWoodConsumptionPayload = {
      date: formData.date,
      quantity: parseFloat(formData.quantity) || 0,
      oven: formData.oven,
      responsible: formData.responsible,
      observations: formData.observations,
    };

    onSave(submissionData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{consumption ? 'Editar Consumo' : 'Registrar Consumo de Lenha'}</DialogTitle>
          <DialogDescription>
            Preencha as informações do consumo de lenha nos campos abaixo.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 pt-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              required
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade (m³) *</Label>
              <Input
                required
                id="quantity"
                min="0"
                placeholder="0.0"
                step="0.1"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oven">Forno *</Label>
              <Input
                required
                id="oven"
                placeholder="Ex: Forno 1"
                value={formData.oven}
                onChange={(e) => handleChange('oven', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável *</Label>
            <Input
              required
              id="responsible"
              placeholder="Nome do responsável"
              value={formData.responsible}
              onChange={(e) => handleChange('responsible', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              placeholder="Observações adicionais"
              rows={3}
              value={formData.observations || ''}
              onChange={(e) => handleChange('observations', e.target.value)}
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
            <Button
              className="w-full sm:w-auto"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              className="w-full sm:w-auto"
              type="submit"
            >
              {consumption ? 'Atualizar' : 'Registrar'} Consumo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WoodConsumptionDialog;
