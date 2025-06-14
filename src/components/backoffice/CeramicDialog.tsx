
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Ceramic } from '@/types/backoffice';

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
    isActive: true
  });

  useEffect(() => {
    if (ceramic) {
      setFormData({
        name: ceramic.name,
        address: ceramic.address,
        phone: ceramic.phone,
        email: ceramic.email,
        isActive: ceramic.isActive
      });
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        isActive: true
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Nome da Cerâmica</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Cerâmica São José"
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">Endereço</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Endereço completo da cerâmica"
              required
              className="text-sm min-h-[60px] resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 1234-5678"
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contato@ceramica.com"
              required
              className="text-sm"
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive" className="text-sm font-medium">Cerâmica Ativa</Label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {ceramic ? 'Salvar Alterações' : 'Criar Cerâmica'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CeramicDialog;
