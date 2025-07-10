import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { SaleDbData, SaleRawData } from '@/types/sales';

interface SaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale?: SaleRawData | null;
  onSave: (saleData: Omit<SaleDbData, 'id'>) => void;
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
    recordedBy: ''
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
        recordedBy: sale.recorded_by
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
        recordedBy: ''
      });
    }
  }, [sale, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.brickQuantity || !formData.pricePerThousand || !formData.recordedBy) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseInt(formData.brickQuantity);
    const pricePerThousand = parseFloat(formData.pricePerThousand);
    const totalValue = parseFloat(formData.totalValue);

    if (isNaN(quantity) || isNaN(pricePerThousand) || isNaN(totalValue)) {
      toast({
        title: "Erro ao salvar",
        description: "Verifique os valores numéricos",
        variant: "destructive"
      });
      return;
    }

    // Converte os dados para o formato esperado pelo banco (snake_case)
    const saleData: Omit<SaleDbData, 'id'> = {
      sale_date: format(formData.saleDate, 'yyyy-MM-dd'),
      customer_name: formData.customerName,
      customer_contact: formData.customerContact || null,
      brick_quantity: quantity,
      price_per_thousand: pricePerThousand,
      total_value: totalValue,
      notes: formData.notes || null,
      recorded_by: formData.recordedBy
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
          <DialogDescription>
            {sale ? 'Edite os dados da venda' : 'Registre uma nova venda de tijolos'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Informações da Venda */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
              Informações da Venda
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saleDate">Data da Venda *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.saleDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.saleDate ? format(formData.saleDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.saleDate}
                      onSelect={(date) => date && setFormData(prev => ({ ...prev, saleDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recordedBy">Registrado por *</Label>
                <Input
                  id="recordedBy"
                  value={formData.recordedBy}
                  onChange={(e) => handleChange('recordedBy', e.target.value)}
                  placeholder="Nome do responsável"
                  required
                />
              </div>
            </div>
          </div>

          {/* Informações do Cliente */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
              Informações do Cliente
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nome do Cliente *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  placeholder="Nome do cliente"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerContact">Contato</Label>
                <Input
                  id="customerContact"
                  value={formData.customerContact}
                  onChange={(e) => handleChange('customerContact', e.target.value)}
                  placeholder="Telefone ou email"
                />
              </div>
            </div>
          </div>

          {/* Detalhes da Venda */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
              Detalhes da Venda
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brickQuantity">Quantidade de Tijolos *</Label>
                <Input
                  id="brickQuantity"
                  type="number"
                  min="1"
                  value={formData.brickQuantity}
                  onChange={(e) => handleQuantityOrPriceChange('brickQuantity', e.target.value)}
                  placeholder="Ex: 5000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerThousand">Preço por Milheiro (R$) *</Label>
                <Input
                  id="pricePerThousand"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePerThousand}
                  onChange={(e) => handleQuantityOrPriceChange('pricePerThousand', e.target.value)}
                  placeholder="Ex: 320.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalValue">Valor Total (R$) *</Label>
                <Input
                  id="totalValue"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.totalValue}
                  onChange={(e) => handleChange('totalValue', e.target.value)}
                  placeholder="Calculado automaticamente"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Observações adicionais sobre a venda"
                rows={3}
              />
            </div>
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
              {sale ? 'Atualizar' : 'Criar'} Venda
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaleDialog;