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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import type { WoodPurchase, CreateWoodPurchasePayload } from '@/integrations/supabase/api/wood';

interface WoodPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (purchase: CreateWoodPurchasePayload) => void;
  purchase?: WoodPurchase;
}

const WoodPurchaseDialog = ({ open, onOpenChange, onSave, purchase }: WoodPurchaseDialogProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    quantity: '',
    unit_price: '',
    total_value: '',
    invoice_number: '',
    notes: ''
  });

  useEffect(() => {
    if (purchase) {
      setFormData({
        date: purchase.date || new Date().toISOString().split('T')[0],
        supplier: purchase.supplier || '',
        quantity: purchase.quantity ? purchase.quantity.toString() : '',
        unit_price: purchase.unit_price ? purchase.unit_price.toString() : '',
        total_value: purchase.total_value ? purchase.total_value.toString() : '',
        invoice_number: purchase.invoice_number || '',
        notes: purchase.notes || ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        supplier: '',
        quantity: '',
        unit_price: '',
        total_value: '',
        invoice_number: '',
        notes: ''
      });
    }
  }, [purchase, open]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto calculate total when quantity or unit_price changes
      if (field === 'quantity' || field === 'unit_price') {
        const quantity = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(newData.quantity) || 0;
        const unitPrice = field === 'unit_price' ? parseFloat(value) || 0 : parseFloat(newData.unit_price) || 0;
        newData.total_value = (quantity * unitPrice).toString();
      }
      
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplier || !formData.quantity || !formData.unit_price) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios (Fornecedor, Quantidade e Preço Unitário)",
        variant: "destructive"
      });
      return;
    }
    
    // Convert strings to numbers for submission
    const submissionData: CreateWoodPurchasePayload = {
      date: formData.date,
      supplier: formData.supplier,
      quantity: parseFloat(formData.quantity) || 0,
      unit_price: parseFloat(formData.unit_price) || 0,
      total_value: parseFloat(formData.total_value) || 0,
      invoice_number: formData.invoice_number,
      notes: formData.notes
    };
    
    onSave(submissionData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{purchase ? 'Editar Compra' : 'Nova Compra de Lenha'}</DialogTitle>
          <DialogDescription>
            Preencha as informações da compra de lenha.
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
          
          <div className="space-y-2">
            <Label htmlFor="supplier">Fornecedor *</Label>
            <Input 
              id="supplier" 
              value={formData.supplier} 
              onChange={(e) => handleChange('supplier', e.target.value)}
              placeholder="Nome do fornecedor"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade (m³) *</Label>
              <Input 
                id="quantity" 
                type="number"
                step="0.1"
                min="0"
                value={formData.quantity} 
                onChange={(e) => handleChange('quantity', e.target.value)}
                placeholder="0.0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit_price">Preço por m³ (R$) *</Label>
              <Input 
                id="unit_price" 
                type="number"
                step="0.01"
                min="0"
                value={formData.unit_price} 
                onChange={(e) => handleChange('unit_price', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="total_value">Valor Total (R$)</Label>
            <Input 
              id="total_value" 
              type="number"
              step="0.01"
              min="0"
              value={formData.total_value} 
              onChange={(e) => handleChange('total_value', e.target.value)}
              disabled
              className="bg-gray-100"
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoice_number">Número da Nota Fiscal</Label>
            <Input 
              id="invoice_number" 
              value={formData.invoice_number} 
              onChange={(e) => handleChange('invoice_number', e.target.value)}
              placeholder="Opcional"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea 
              id="notes" 
              value={formData.notes || ''} 
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Observações adicionais"
              rows={3}
            />
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
              {purchase ? 'Atualizar' : 'Salvar'} Compra
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WoodPurchaseDialog;
