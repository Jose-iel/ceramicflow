
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { BackofficeUser } from '@/types/backoffice';

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

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="email">Email</Label>
            <Input
              required
              className="text-sm bg-gray-100 disabled:cursor-not-allowed"
              disabled={!!user}
              id="email"
              type="email"
              value={user ? user.email || '' : formData.email}
              onChange={!user ? (e) => setFormData({ ...formData, email: e.target.value }) : undefined}
            />
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                required
                className="text-sm"
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="full_name">Nome Completo</Label>
            <Input
              className="text-sm"
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="user_level">Nível de Acesso</Label>
            <Select value={formData.user_level_id} onValueChange={(value) => setFormData({ ...formData, user_level_id: value })}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="Selecione um nível" /></SelectTrigger>
              <SelectContent>
                {userLevels && userLevels.length > 0 ? (
                  userLevels.map(level => <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>)
                ) : (
                  <SelectItem disabled value="">Nenhum nível encontrado</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="ceramic">Cerâmica</Label>
            <Select value={formData.ceramic_id} onValueChange={(value) => setFormData({ ...formData, ceramic_id: value })}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="Selecione uma cerâmica" /></SelectTrigger>
              <SelectContent>
                {ceramics && ceramics.length > 0 ? (
                  ceramics.map(ceramic => <SelectItem key={ceramic.id} value={ceramic.id}>{ceramic.name}</SelectItem>)
                ) : (
                  <SelectItem disabled value="">Nenhuma cerâmica encontrada</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Switch
              checked={formData.is_admin}
              id="is_admin"
              onCheckedChange={(checked) => setFormData({ ...formData, is_admin: checked })}
            />
            <Label className="text-sm font-medium" htmlFor="is_admin">Administrador Global</Label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button className="w-full sm:w-auto" type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="w-full sm:w-auto" type="submit">
              {user ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
