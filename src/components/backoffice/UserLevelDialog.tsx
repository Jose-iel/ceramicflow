
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useRoutes, useUserLevelPermissions } from '@/integrations/supabase/hooks';
import { UserLevel } from '@/integrations/supabase/api/user-levels';

interface UserLevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userLevel: UserLevel | null;
  onSave: (levelData: { name: string; description?: string; permissions: string[] }) => void;
}

const UserLevelDialog: React.FC<UserLevelDialogProps> = ({ open, onOpenChange, userLevel, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedRoutes: [] as string[]
  });
  
  const { data: routes = [] } = useRoutes();
  const { data: currentPermissions = [] } = useUserLevelPermissions(userLevel?.id || '');

  useEffect(() => {
    if (open) {
      const permissionsString = currentPermissions.join(',');
      if (userLevel) {
        setFormData({
          name: userLevel.name,
          description: userLevel.description || '',
          selectedRoutes: currentPermissions
        });
      } else {
        setFormData({
          name: '',
          description: '',
          selectedRoutes: []
        });
      }
    }
  }, [open, userLevel, currentPermissions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description,
      permissions: formData.selectedRoutes
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRouteChange = (routeId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedRoutes: checked
        ? [...prev.selectedRoutes, routeId]
        : prev.selectedRoutes.filter(id => id !== routeId)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">{userLevel ? 'Editar Nível de Acesso' : 'Novo Nível de Acesso'}</DialogTitle>
          <DialogDescription className="text-sm">
            {userLevel ? 'Edite as permissões do nível de acesso' : 'Configure as permissões para o novo nível'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Nome do Nível</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly={Boolean(userLevel)}
              className={userLevel ? 'bg-gray-100' : ''}
              placeholder="Ex: Marketing"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o propósito deste nível de acesso"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Rotas Permitidas</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] sm:max-h-80 overflow-y-auto border rounded-md p-3">
              {routes.map((route) => (
                <div key={route.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={route.id}
                    checked={formData.selectedRoutes.includes(route.id)}
                    onCheckedChange={(checked) => handleRouteChange(route.id, checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none min-w-0 flex-1">
                    <Label
                      htmlFor={route.id}
                      className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {route.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {route.description || route.path}
                    </p>
                  </div>
                </div>
              ))}
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
      </DialogContent>
    </Dialog>
  );
};

export default UserLevelDialog;
