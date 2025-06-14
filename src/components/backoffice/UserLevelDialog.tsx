
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserLevelAccess, UserLevel } from '@/types/backoffice';

interface UserLevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userLevel: UserLevelAccess | null;
  onSave: (levelData: Partial<UserLevelAccess>) => void;
}

const availableRoutes = [
  { id: 'dashboard', name: 'Dashboard', description: 'Página inicial com visão geral' },
  { id: 'vehicles', name: 'Veículos', description: 'Gerenciamento de veículos' },
  { id: 'employees', name: 'Funcionários', description: 'Gerenciamento de funcionários' },
  { id: 'operations', name: 'Operações', description: 'Controle de operações' },
  { id: 'maintenance', name: 'Manutenção', description: 'Manutenção de equipamentos' },
  { id: 'wood', name: 'Lenha', description: 'Controle de lenha' },
  { id: 'raw-material', name: 'Matéria Prima', description: 'Controle de matéria prima' },
  { id: 'reports', name: 'Relatórios', description: 'Relatórios do sistema' }
];

const UserLevelDialog: React.FC<UserLevelDialogProps> = ({ open, onOpenChange, userLevel, onSave }) => {
  const [formData, setFormData] = useState({
    name: UserLevel.VIEWER,
    description: '',
    allowedRoutes: [] as string[]
  });

  useEffect(() => {
    if (userLevel) {
      setFormData({
        name: userLevel.name,
        description: userLevel.description,
        allowedRoutes: userLevel.allowedRoutes
      });
    } else {
      setFormData({
        name: UserLevel.VIEWER,
        description: '',
        allowedRoutes: []
      });
    }
  }, [userLevel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleRouteChange = (routeId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        allowedRoutes: [...formData.allowedRoutes, routeId]
      });
    } else {
      setFormData({
        ...formData,
        allowedRoutes: formData.allowedRoutes.filter(id => id !== routeId)
      });
    }
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
            <Label htmlFor="name" className="text-sm font-medium">Nível de Usuário</Label>
            <Select value={formData.name} onValueChange={(value) => setFormData({ ...formData, name: value as UserLevel })}>
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
            <Label htmlFor="description" className="text-sm font-medium">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva as responsabilidades deste nível..."
              required
              className="text-sm min-h-[60px] resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Rotas Permitidas</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[200px] sm:max-h-60 overflow-y-auto border rounded-md p-3">
              {availableRoutes.map((route) => (
                <div key={route.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={route.id}
                    checked={formData.allowedRoutes.includes(route.id)}
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
                      {route.description}
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
              {userLevel ? 'Salvar Alterações' : 'Criar Nível'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserLevelDialog;
