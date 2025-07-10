
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BackofficeUser } from '@/types/backoffice';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: BackofficeUser | null;
  onSave: (userData: Partial<BackofficeUser>) => void;
  ceramics: { id: string, name: string }[];
  userLevels: { id: string, name: string }[];
}

const UserDialog: React.FC<UserDialogProps> = ({ open, onOpenChange, user, onSave, ceramics, userLevels }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    is_admin: false,
    user_level_id: '',
    ceramic_id: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '',
        full_name: user.full_name || '',
        is_admin: user.is_admin || false,
        user_level_id: user.user_level_id || '',
        ceramic_id: user.ceramic_id || '',
      });
    } else {
      setFormData({
        email: '',
        password: '',
        full_name: '',
        is_admin: false,
        user_level_id: '',
        ceramic_id: '',
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            {user ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {user ? 'Edite as informações do usuário.' : 'Preencha os dados para criar um novo usuário.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={user ? user.email || '' : formData.email}
              disabled={!!user}
              onChange={!user ? (e) => setFormData({ ...formData, email: e.target.value }) : undefined}
              required
              className="text-sm bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          
          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="text-sm"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm font-medium">Nome Completo</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_level" className="text-sm font-medium">Nível de Acesso</Label>
            <Select value={formData.user_level_id} onValueChange={(value) => setFormData({ ...formData, user_level_id: value })}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="Selecione um nível" /></SelectTrigger>
              <SelectContent>
                {userLevels && userLevels.length > 0 ? (
                  userLevels.map(level => <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>)
                ) : (
                  <SelectItem value="" disabled>Nenhum nível encontrado</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ceramic" className="text-sm font-medium">Cerâmica</Label>
            <Select value={formData.ceramic_id} onValueChange={(value) => setFormData({ ...formData, ceramic_id: value })}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="Selecione uma cerâmica" /></SelectTrigger>
              <SelectContent>
                {ceramics && ceramics.length > 0 ? (
                  ceramics.map(ceramic => <SelectItem key={ceramic.id} value={ceramic.id}>{ceramic.name}</SelectItem>)
                ) : (
                  <SelectItem value="" disabled>Nenhuma cerâmica encontrada</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="is_admin"
              checked={formData.is_admin}
              onCheckedChange={(checked) => setFormData({ ...formData, is_admin: checked })}
            />
            <Label htmlFor="is_admin" className="text-sm font-medium">Administrador Global</Label>
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
