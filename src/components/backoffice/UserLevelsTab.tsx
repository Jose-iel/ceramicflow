
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { UserLevelAccess, UserLevel } from '@/types/backoffice';
import UserLevelDialog from './UserLevelDialog';

const mockUserLevels: UserLevelAccess[] = [
  {
    id: '1',
    name: UserLevel.ADMIN,
    description: 'Acesso total ao sistema',
    allowedRoutes: ['dashboard', 'vehicles', 'employees', 'operations', 'maintenance', 'wood', 'raw-material', 'reports']
  },
  {
    id: '2',
    name: UserLevel.MANAGER,
    description: 'Acesso a relatórios e operações',
    allowedRoutes: ['dashboard', 'vehicles', 'employees', 'operations', 'reports']
  },
  {
    id: '3',
    name: UserLevel.OPERATOR,
    description: 'Acesso limitado às operações',
    allowedRoutes: ['dashboard', 'operations']
  }
];

const UserLevelsTab = () => {
  const [userLevels, setUserLevels] = useState<UserLevelAccess[]>(mockUserLevels);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<UserLevelAccess | null>(null);

  const handleCreateLevel = () => {
    setEditingLevel(null);
    setDialogOpen(true);
  };

  const handleEditLevel = (level: UserLevelAccess) => {
    setEditingLevel(level);
    setDialogOpen(true);
  };

  const handleDeleteLevel = (levelId: string) => {
    setUserLevels(userLevels.filter(level => level.id !== levelId));
  };

  const handleSaveLevel = (levelData: Partial<UserLevelAccess>) => {
    if (editingLevel) {
      setUserLevels(userLevels.map(level => 
        level.id === editingLevel.id 
          ? { ...level, ...levelData }
          : level
      ));
    } else {
      const newLevel: UserLevelAccess = {
        id: Date.now().toString(),
        ...levelData
      } as UserLevelAccess;
      setUserLevels([...userLevels, newLevel]);
    }
    setDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Níveis de Acesso</CardTitle>
            <CardDescription>
              Configure os níveis de usuário e suas permissões de acesso
            </CardDescription>
          </div>
          <Button onClick={handleCreateLevel} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Nível
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nível</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Rotas Permitidas</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userLevels.map((level) => (
              <TableRow key={level.id}>
                <TableCell className="font-medium">{level.name}</TableCell>
                <TableCell>{level.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {level.allowedRoutes.slice(0, 3).map((route) => (
                      <Badge key={route} variant="outline" className="text-xs">
                        {route}
                      </Badge>
                    ))}
                    {level.allowedRoutes.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{level.allowedRoutes.length - 3} mais
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditLevel(level)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLevel(level.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <UserLevelDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          userLevel={editingLevel}
          onSave={handleSaveLevel}
        />
      </CardContent>
    </Card>
  );
};

export default UserLevelsTab;
