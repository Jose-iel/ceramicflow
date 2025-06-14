
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          <DialogDescription>
            {user ? 'Edite as informações do usuário' : 'Preencha as informações para criar um novo usuário'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userLevel">Nível de Usuário</Label>
            <Select value={formData.userLevel} onValueChange={(value) => setFormData({ ...formData, userLevel: value as UserLevel })}>
              <SelectTrigger>
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
            <Label htmlFor="ceramicId">Cerâmica *</Label>
            <Select value={formData.ceramicId} onValueChange={(value) => setFormData({ ...formData, ceramicId: value })}>
              <SelectTrigger>
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

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Usuário Ativo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {user ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
