
import React, { useState } from 'react';
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
import { WoodConsumption } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface WoodConsumptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (consumption: WoodConsumption) => void;
}

const WoodConsumptionDialog = ({ open, onOpenChange, onSave }: WoodConsumptionDialogProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<WoodConsumption>>({
    id: `WC${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
    date: format(new Date(), 'yyyy-MM-dd'),
    quantity: 0,
    sector: '',
    recordedBy: '',
    notes: ''
  });

  const parseDate = (dateStr: string): Date => {
    return new Date(dateStr);
  };

  const formatDateString = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const handleChange = (field: keyof WoodConsumption, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.quantity || !formData.sector || !formData.recordedBy) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    onSave(formData as WoodConsumption);
    
    setFormData({
      id: `WC${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      quantity: 0,
      sector: '',
      recordedBy: '',
      notes: ''
    });
    
    onOpenChange(false);
    
    toast({
      title: "Consumo registrado",
      description: "O consumo de lenha foi registrado com sucesso!"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Consumo de Lenha</DialogTitle>
          <DialogDescription>
            Preencha as informações do consumo de lenha nos campos abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(parseDate(formData.date || ''), 'dd/MM/yyyy', { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.date || '')}
                  onSelect={(date) => handleChange('date', formatDateString(date || new Date()))}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
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
                onChange={(e) => handleChange('quantity', parseFloat(e.target.value))}
                placeholder="0.0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sector">Setor</Label>
              <Input 
                id="sector" 
                value={formData.sector} 
                onChange={(e) => handleChange('sector', e.target.value)}
                placeholder="Ex: Forno 1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recordedBy">Registrado por</Label>
            <Input 
              id="recordedBy" 
              value={formData.recordedBy} 
              onChange={(e) => handleChange('recordedBy', e.target.value)}
              placeholder="Nome do responsável"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea 
              id="notes" 
              value={formData.notes} 
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Observações adicionais (opcional)"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Consumo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WoodConsumptionDialog;
