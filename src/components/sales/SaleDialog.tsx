import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { CreateSalePayload, Sale } from '@/integrations/supabase/api/sales';

interface SaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale?: Sale | null;
  onSave: (saleData: CreateSalePayload) => void;
}

const SaleDialog: React.FC<SaleDialogProps> = ({ open, onOpenChange, sale, onSave }) => {
  const { toast } = useToast();

  // Estado interno usando camelCase
  const [formData, setFormData] = useState({
    saleDate: new Date(),
    customerName: '',
    customerContact: '',
    brickQuantity: '',
    pricePerThousand: '',
    totalValue: '',
    notes: '',
    recordedBy: '',
  });

  useEffect(() => {
    if (sale) {
      setFormData({
        saleDate: new Date(sale.sale_date),
        customerName: sale.customer_name,
        customerContact: sale.customer_contact || '',
        brickQuantity: sale.brick_quantity.toString(),
        pricePerThousand: sale.price_per_thousand.toString(),
        totalValue: sale.total_value.toString(),
        notes: sale.notes || '',
        recordedBy: sale.recorded_by,
      });
    } else {
      setFormData({
        saleDate: new Date(),
        customerName: '',
        customerContact: '',
        brickQuantity: '',
        pricePerThousand: '',
        totalValue: '',
        notes: '',
        recordedBy: '',
      });
    }
  }, [sale, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.brickQuantity || !formData.pricePerThousand || !formData.recordedBy) {
      toast({
        title: 'Erro ao salvar',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const quantity = parseInt(formData.brickQuantity);
    const pricePerThousand = parseFloat(formData.pricePerThousand);
    const totalValue = parseFloat(formData.totalValue);

    if (isNaN(quantity) || isNaN(pricePerThousand) || isNaN(totalValue)) {
      toast({
        title: 'Erro ao salvar',
        description: 'Verifique os valores numéricos',
        variant: 'destructive',
      });
      return;
    }

    // Converte os dados para o formato esperado pelo banco (snake_case)
    const saleData: CreateSalePayload = {
      sale_date: format(formData.saleDate, 'yyyy-MM-dd'),
      customer_name: formData.customerName,
      customer_contact: formData.customerContact || undefined,
      brick_quantity: quantity,
      price_per_thousand: pricePerThousand,
      total_value: totalValue,
      notes: formData.notes || undefined,
      recorded_by: formData.recordedBy,
    };

    onSave(saleData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantityOrPriceChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Auto-calcular total quando quantidade ou preço mudarem
      if (field === 'brickQuantity' || field === 'pricePerThousand') {
        const quantity = parseFloat(field === 'brickQuantity' ? value : newData.brickQuantity);
        const price = parseFloat(field === 'pricePerThousand' ? value : newData.pricePerThousand);

        if (!isNaN(quantity) && !isNaN(price) && quantity > 0 && price > 0) {
          newData.totalValue = ((quantity / 1000) * price).toFixed(2);
        }
      }

      return newData;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sale ? 'Editar Venda' : 'Nova Venda'}</DialogTitle>
          <DialogDescription>{sale ? 'Edite os dados da venda' : 'Registre uma nova venda de tijolos'}</DialogDescription>
        </DialogHeader>

        <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
          {/* Informações da Venda */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Informações da Venda</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saleDate">Data da Venda *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className={cn('w-full justify-start text-left font-normal', !formData.saleDate && 'text-muted-foreground')}
                      variant="outline"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.saleDate ? format(formData.saleDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      initialFocus
                      mode="single"
                      selected={formData.saleDate}
                      onSelect={date => date && setFormData(prev => ({ ...prev, saleDate: date }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recordedBy">Registrado por *</Label>
                <Input
                  required
                  id="recordedBy"
                  placeholder="Nome do responsável"
                  value={formData.recordedBy}
                  onChange={e => handleChange('recordedBy', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Informações do Cliente */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Informações do Cliente</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nome do Cliente *</Label>
                <Input
                  required
                  id="customerName"
                  placeholder="Nome do cliente"
                  value={formData.customerName}
                  onChange={e => handleChange('customerName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerContact">Contato</Label>
                <Input
                  id="customerContact"
                  placeholder="Telefone ou email"
                  value={formData.customerContact}
                  onChange={e => handleChange('customerContact', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Detalhes da Venda */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Detalhes da Venda</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brickQuantity">Quantidade de Tijolos *</Label>
                <Input
                  required
                  id="brickQuantity"
                  min="1"
                  placeholder="Ex: 5000"
                  type="number"
                  value={formData.brickQuantity}
                  onChange={e => handleQuantityOrPriceChange('brickQuantity', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerThousand">Preço por Milheiro (R$) *</Label>
                <Input
                  required
                  id="pricePerThousand"
                  min="0"
                  placeholder="Ex: 320.00"
                  step="0.01"
                  type="number"
                  value={formData.pricePerThousand}
                  onChange={e => handleQuantityOrPriceChange('pricePerThousand', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalValue">Valor Total (R$) *</Label>
                <Input
                  required
                  id="totalValue"
                  min="0"
                  placeholder="Calculado automaticamente"
                  step="0.01"
                  type="number"
                  value={formData.totalValue}
                  onChange={e => handleChange('totalValue', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Observações adicionais sobre a venda"
                rows={3}
                value={formData.notes}
                onChange={e => handleChange('notes', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
            <Button className="w-full sm:w-auto" type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="w-full sm:w-auto" type="submit">
              {sale ? 'Atualizar' : 'Criar'} Venda
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaleDialog;
