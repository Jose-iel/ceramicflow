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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTrucksOptimized } from '@/integrations/supabase/hooks';
import type { ClayConsumptionRawData, ClayConsumptionDbData } from '@/types';

interface ClayConsumptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (consumption: Omit<ClayConsumptionDbData, 'ceramic_id'>) => void;
  consumption?: ClayConsumptionRawData;
}

const ClayConsumptionDialog = ({ open, onOpenChange, onSave, consumption }: ClayConsumptionDialogProps) => {
  const { toast } = useToast();
  const { data: trucks = [], isLoading: isLoadingTrucks } = useTrucksOptimized();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    trucks_quantity: '',
    supplier: '',
    origin: '',
    truck_id: '',
    recorded_by: '',
    notes: '',
  });

  useEffect(() => {
    if (consumption) {
      setFormData({
        date: consumption.date ?
          new Date(consumption.date).toISOString().split('T')[0] :
          new Date().toISOString().split('T')[0],
        trucks_quantity: consumption.trucks_quantity?.toString() || '',
        supplier: consumption.supplier || '',
        origin: consumption.origin || '',
        truck_id: consumption.truck_id || '',
        recorded_by: consumption.recorded_by || '',
        notes: consumption.notes || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        trucks_quantity: '',
        supplier: '',
        origin: '',
        truck_id: '',
        recorded_by: '',
        notes: '',
      });
    }
  }, [consumption, open]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trucksQuantity = Number(formData.trucks_quantity);

    if (!formData.trucks_quantity || trucksQuantity <= 0 || !formData.recorded_by) {
      toast({
        title: 'Erro ao salvar',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    // Convert string to number for trucks_quantity before saving
    const dataToSave = {
      ...formData,
      trucks_quantity: trucksQuantity,
    };

    onSave(dataToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{consumption ? 'Editar Consumo' : 'Registrar Consumo de Barro'}</DialogTitle>
          <DialogDescription>
            Preencha as informações do consumo de barro.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 pt-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                required
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trucks_quantity">Quantidade de Caminhões *</Label>
              <Input
                required
                id="trucks_quantity"
                min="1"
                placeholder="Digite a quantidade"
                step="1"
                type="number"
                value={formData.trucks_quantity}
                onChange={(e) => handleChange('trucks_quantity', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input
                id="supplier"
                placeholder="Nome do fornecedor"
                value={formData.supplier}
                onChange={(e) => handleChange('supplier', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">Origem</Label>
              <Input
                id="origin"
                placeholder="Local de origem do barro"
                value={formData.origin}
                onChange={(e) => handleChange('origin', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="truck_id">Caminhão</Label>
              <Select
                value={formData.truck_id}
                onValueChange={(value) => handleChange('truck_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um caminhão" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingTrucks ? (
                    <SelectItem disabled value="">
                      Carregando caminhões...
                    </SelectItem>
                  ) : trucks.length === 0 ? (
                    <SelectItem disabled value="">
                      Nenhum caminhão cadastrado
                    </SelectItem>
                  ) : (
                    trucks.map((truck) => (
                      <SelectItem key={truck.id} value={truck.id}>
                        {truck.model}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recorded_by">Registrado por *</Label>
              <Input
                required
                id="recorded_by"
                placeholder="Nome do responsável"
                value={formData.recorded_by}
                onChange={(e) => handleChange('recorded_by', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Observações adicionais"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
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

export default ClayConsumptionDialog;
