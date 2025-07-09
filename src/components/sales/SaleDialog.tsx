import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Sale } from '@/integrations/supabase/api/sales';

interface SaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale?: Sale | null;
  onSave: (saleData: any) => void;
}

const SaleDialog: React.FC<SaleDialogProps> = ({ open, onOpenChange, sale, onSave }) => {
  const [formData, setFormData] = useState({
    sale_date: new Date(),
    customer_name: '',
    customer_contact: '',
    brick_quantity: '',
    price_per_thousand: '',
    total_value: '',
    notes: '',
    recorded_by: ''
  });

  useEffect(() => {
    if (open) {
      if (sale) {
        setFormData({
          sale_date: new Date(sale.sale_date),
          customer_name: sale.customer_name,
          customer_contact: sale.customer_contact || '',
          brick_quantity: sale.brick_quantity.toString(),
          price_per_thousand: sale.price_per_thousand.toString(),
          total_value: sale.total_value.toString(),
          notes: sale.notes || '',
          recorded_by: sale.recorded_by
        });
      } else {
        setFormData({
          sale_date: new Date(),
          customer_name: '',
          customer_contact: '',
          brick_quantity: '',
          price_per_thousand: '',
          total_value: '',
          notes: '',
          recorded_by: ''
        });
      }
    }
  }, [open, sale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const quantity = parseInt(formData.brick_quantity);
    const pricePerThousand = parseFloat(formData.price_per_thousand);
    const calculatedTotal = (quantity / 1000) * pricePerThousand;

    onSave({
      sale_date: format(formData.sale_date, 'yyyy-MM-dd'),
      customer_name: formData.customer_name,
      customer_contact: formData.customer_contact || null,
      brick_quantity: quantity,
      price_per_thousand: pricePerThousand,
      total_value: calculatedTotal,
      notes: formData.notes || null,
      recorded_by: formData.recorded_by
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityOrPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-calcular total quando quantidade ou preço mudarem
      if (name === 'brick_quantity' || name === 'price_per_thousand') {
        const quantity = parseFloat(name === 'brick_quantity' ? value : newData.brick_quantity);
        const price = parseFloat(name === 'price_per_thousand' ? value : newData.price_per_thousand);
        
        if (!isNaN(quantity) && !isNaN(price)) {
          newData.total_value = ((quantity / 1000) * price).toFixed(2);
        }
      }
      
      return newData;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sale ? 'Editar Venda' : 'Nova Venda'}</DialogTitle>
          <DialogDescription>
            {sale ? 'Edite os dados da venda' : 'Registre uma nova venda de tijolos'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sale_date">Data da Venda</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.sale_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.sale_date ? format(formData.sale_date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.sale_date}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, sale_date: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recorded_by">Registrado por</Label>
              <Input
                id="recorded_by"
                name="recorded_by"
                value={formData.recorded_by}
                onChange={handleChange}
                placeholder="Nome do responsável"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Cliente</Label>
              <Input
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="Nome do cliente"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_contact">Contato</Label>
              <Input
                id="customer_contact"
                name="customer_contact"
                value={formData.customer_contact}
                onChange={handleChange}
                placeholder="Telefone ou email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brick_quantity">Quantidade de Tijolos</Label>
              <Input
                id="brick_quantity"
                name="brick_quantity"
                type="number"
                value={formData.brick_quantity}
                onChange={handleQuantityOrPriceChange}
                placeholder="Ex: 5000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_thousand">Preço por Milheiro (R$)</Label>
              <Input
                id="price_per_thousand"
                name="price_per_thousand"
                type="number"
                step="0.01"
                value={formData.price_per_thousand}
                onChange={handleQuantityOrPriceChange}
                placeholder="Ex: 320.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_value">Valor Total (R$)</Label>
              <Input
                id="total_value"
                name="total_value"
                type="number"
                step="0.01"
                value={formData.total_value}
                onChange={handleChange}
                placeholder="Calculado automaticamente"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Observações adicionais sobre a venda"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {sale ? 'Atualizar' : 'Salvar'} Venda
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaleDialog;