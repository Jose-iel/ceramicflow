
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Ceramic } from '@/types/backoffice';

interface CeramicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ceramic: Ceramic | null;
  onSave: (ceramicData: Partial<Ceramic>) => void;
}

const CeramicDialog: React.FC<CeramicDialogProps> = ({ open, onOpenChange, ceramic, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    is_active: true,
  });

  useEffect(() => {
    if (ceramic) {
      setFormData({
        name: ceramic.name,
        address: ceramic.address,
        phone: ceramic.phone,
        email: ceramic.email,
        is_active: ceramic.is_active,
      });
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        is_active: true,
      });
    }
  }, [ceramic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">{ceramic ? 'Editar Cerâmica' : 'Nova Cerâmica'}</DialogTitle>
          <DialogDescription className="text-sm">
            {ceramic ? 'Edite as informações da cerâmica' : 'Preencha as informações para cadastrar uma nova cerâmica'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="name">Nome da Cerâmica</Label>
            <Input
              required
              className="text-sm"
              id="name"
              placeholder="Ex: Cerâmica São José"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="address">Endereço</Label>
            <Textarea
              required
              className="text-sm min-h-[60px] resize-none"
              id="address"
              placeholder="Endereço completo da cerâmica"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="phone">Telefone</Label>
            <Input
              required
              className="text-sm"
              id="phone"
              placeholder="(11) 1234-5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="email">Email</Label>
            <Input
              required
              className="text-sm"
              id="email"
              placeholder="contato@ceramica.com"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Switch
              checked={formData.is_active}
              id="isActive"
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label className="text-sm font-medium" htmlFor="isActive">Cerâmica Ativa</Label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button className="w-full sm:w-auto" type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="w-full sm:w-auto" type="submit">
              {ceramic ? 'Salvar Alterações' : 'Criar Cerâmica'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CeramicDialog;
