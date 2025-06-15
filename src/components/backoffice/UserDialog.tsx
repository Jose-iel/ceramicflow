
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
}

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile | null;
  onSave: (userData: any) => void;
}

const UserDialog: React.FC<UserDialogProps> = ({ open, onOpenChange, user, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    is_admin: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        is_admin: user.is_admin
      });
    } else {
      setFormData({
        full_name: '',
        is_admin: false
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
            {user ? 'Editar Usuário' : 'Usuário já existe'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {user ? 'Edite as informações do usuário' : 'Este usuário já foi criado no sistema'}
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="text-sm bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="text-sm"
                />
              </div>

              <div className="flex items-center space-x-2 py-2">
                <Switch
                  id="is_admin"
                  checked={formData.is_admin}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_admin: checked })}
                />
                <Label htmlFor="is_admin" className="text-sm font-medium">Administrador</Label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Salvar Alterações
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
