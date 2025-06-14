
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BackofficeUser, UserLevel, Ceramic } from '@/types/backoffice';

// Mock data das cerâmicas - em um sistema real, isso viria de uma API
const mockCeramics: Ceramic[] = [
  {
    id: '1',
    name: 'Cerâmica São José',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 1234-5678',
    email: 'contato@ceramicasaojose.com',
    isActive: true,
    createdAt: '2024-01-15',
    users: []
  },
  {
    id: '2',
    name: 'Cerâmica Bela Vista',
    address: 'Av. Industrial, 456 - Distrito Industrial',
    phone: '(11) 8765-4321',
    email: 'admin@ceramicabelavista.com',
    isActive: true,
    createdAt: '2024-01-10',
    users: []
  }
];

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: BackofficeUser | null;
  onSave: (userData: Partial<BackofficeUser>) => void;
}

const UserDialog: React.FC<UserDialogProps> = ({ open, onOpenChange, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userLevel: UserLevel.VIEWER,
    ceramicId: '',
    isActive: true
  });
  const [ceramics, setCeramics] = useState<Ceramic[]>([]);

  useEffect(() => {
    // Carrega a lista de cerâmicas ativas
    const activeCeramics = mockCeramics.filter(ceramic => ceramic.isActive);
    setCeramics(activeCeramics);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        userLevel: user.userLevel,
        ceramicId: user.ceramicId || '',
        isActive: user.isActive
      });
    } else {
      setFormData({
        name: '',
        email: '',
        userLevel: UserLevel.VIEWER,
        ceramicId: '',
        isActive: true
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação para garantir que uma cerâmica foi selecionada
    if (!formData.ceramicId) {
      alert('Por favor, selecione uma cerâmica para o usuário.');
      return;
    }
    
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          <DialogDescription className="text-sm">
            {user ? 'Edite as informações do usuário' : 'Preencha as informações para criar um novo usuário'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                required
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userLevel" className="text-sm font-medium">Nível de Usuário</Label>
              <Select value={formData.userLevel} onValueChange={(value) => setFormData({ ...formData, userLevel: value as UserLevel })}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ceramicId" className="text-sm font-medium">Cerâmica *</Label>
              <Select value={formData.ceramicId} onValueChange={(value) => setFormData({ ...formData, ceramicId: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Selecione uma cerâmica" />
                </SelectTrigger>
                <SelectContent>
                  {ceramics.map((ceramic) => (
                    <SelectItem key={ceramic.id} value={ceramic.id}>
                      {ceramic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive" className="text-sm font-medium">Usuário Ativo</Label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {user ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
