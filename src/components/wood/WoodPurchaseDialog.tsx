
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
import { WoodPurchase } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface WoodPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (purchase: WoodPurchase) => void;
}

const WoodPurchaseDialog = ({ open, onOpenChange, onSave }: WoodPurchaseDialogProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<WoodPurchase>>({
    id: `WP${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
    date: format(new Date(), 'yyyy-MM-dd'),
    supplier: '',
    quantity: 0,
    unitPrice: 0,
    totalValue: 0,
    invoiceNumber: '',
    notes: ''
  });

  const parseDate = (dateStr: string): Date => {
    return new Date(dateStr);
  };

  const formatDateString = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const handleChange = (field: keyof WoodPurchase, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto calculate total value
      if (field === 'quantity' || field === 'unitPrice') {
        const quantity = field === 'quantity' ? value : prev.quantity || 0;
        const unitPrice = field === 'unitPrice' ? value : prev.unitPrice || 0;
        updated.totalValue = quantity * unitPrice;
      }
      
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplier || !formData.quantity || !formData.unitPrice) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    onSave(formData as WoodPurchase);
    
    setFormData({
      id: `WP${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      supplier: '',
      quantity: 0,
      unitPrice: 0,
      totalValue: 0,
      invoiceNumber: '',
      notes: ''
    });
    
    onOpenChange(false);
    
    toast({
      title: "Compra registrada",
      description: "A compra de lenha foi registrada com sucesso!"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Compra de Lenha</DialogTitle>
          <DialogDescription>
            Preencha as informações da compra de lenha nos campos abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Data da Compra</Label>
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
          
          <div className="space-y-2">
            <Label htmlFor="supplier">Fornecedor</Label>
            <Input 
              id="supplier" 
              value={formData.supplier} 
              onChange={(e) => handleChange('supplier', e.target.value)}
              placeholder="Nome do fornecedor"
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
                onChange={(e) => handleChange('quantity', parseFloat(e.target.value))}
                placeholder="0.0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Preço por m³ (R$)</Label>
              <Input 
                id="unitPrice" 
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice} 
                onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalValue">Valor Total (R$)</Label>
            <Input 
              id="totalValue" 
              type="number"
              step="0.01"
              value={formData.totalValue?.toFixed(2) || '0.00'} 
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Número da Nota Fiscal</Label>
            <Input 
              id="invoiceNumber" 
              value={formData.invoiceNumber} 
              onChange={(e) => handleChange('invoiceNumber', e.target.value)}
              placeholder="NF-12345 (opcional)"
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
            <Button type="submit">Registrar Compra</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WoodPurchaseDialog;
