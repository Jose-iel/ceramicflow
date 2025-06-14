
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { BackofficeUser, UserLevel } from '@/types/backoffice';
import UserDialog from './UserDialog';

const mockUsers: BackofficeUser[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@ceramica1.com',
    userLevel: UserLevel.MANAGER,
    ceramicId: '1',
    isActive: true,
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@ceramica2.com',
    userLevel: UserLevel.OPERATOR,
    ceramicId: '2',
    isActive: true,
    createdAt: '2024-01-10'
  }
];

const UsersTab = () => {
  const [users, setUsers] = useState<BackofficeUser[]>(mockUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<BackofficeUser | null>(null);

  const handleCreateUser = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: BackofficeUser) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleSaveUser = (userData: Partial<BackofficeUser>) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData }
          : user
      ));
    } else {
      const newUser: BackofficeUser = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        isActive: true,
        ...userData
      } as BackofficeUser;
      setUsers([...users, newUser]);
    }
    setDialogOpen(false);
  };

  const getUserLevelColor = (level: UserLevel) => {
    switch (level) {
      case UserLevel.ADMIN: return 'destructive';
      case UserLevel.MANAGER: return 'default';
      case UserLevel.SUPERVISOR: return 'secondary';
      case UserLevel.OPERATOR: return 'outline';
      case UserLevel.VIEWER: return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg sm:text-xl">Gerenciamento de Usuários</CardTitle>
            <CardDescription className="text-sm">
              Crie, edite e gerencie todos os usuários do sistema
            </CardDescription>
          </div>
          <Button 
            onClick={handleCreateUser} 
            className="flex items-center gap-2 w-full sm:w-auto"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="sm:inline">Novo Usuário</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-4 p-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-base">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getUserLevelColor(user.userLevel)} className="text-xs">
                    {user.userLevel}
                  </Badge>
                  <Badge variant={user.isActive ? 'default' : 'secondary'} className="text-xs">
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Cerâmica: {user.ceramicId ? `Cerâmica ${user.ceramicId}` : 'Não definida'}</p>
                  <p>Último login: {user.lastLogin || 'Nunca'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead className="hidden lg:table-cell">Cerâmica</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden xl:table-cell">Último Login</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getUserLevelColor(user.userLevel)} className="text-xs">
                      {user.userLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {user.ceramicId ? `Cerâmica ${user.ceramicId}` : 'Não definida'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'secondary'} className="text-xs">
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">{user.lastLogin || 'Nunca'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <UserDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          user={editingUser}
          onSave={handleSaveUser}
        />
      </CardContent>
    </Card>
  );
};

export default UsersTab;
