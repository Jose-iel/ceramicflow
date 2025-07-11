import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

import UserDialog from './UserDialog';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { CreateUserPayload, UpdateUserPayload } from '@/integrations/supabase/api/backoffice';
import { useUsersTabData, useCreateUser, useUpdateUser, useDeleteUser } from '@/integrations/supabase/hooks';
import type { BackofficeUser } from '@/types/backoffice';


const UsersTab = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<BackofficeUser | null>(null);
  const [selectedCeramic, setSelectedCeramic] = useState('');

  const { data, isLoading } = useUsersTabData();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const users = data?.users || [];
  const ceramics = data?.ceramics || [];
  const userLevels = data?.userLevels || [];

  const handleCreateUser = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: BackofficeUser) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    // TODO: Implementar dialog de confirmação personalizado
    deleteUserMutation.mutate(userId);
  };

  const handleSaveUser = (userData: Record<string, unknown>) => {
    if (editingUser) {
      updateUserMutation.mutate({ userId: editingUser.id, userData: userData as unknown as UpdateUserPayload }, {
        onSuccess: () => setDialogOpen(false),
      });
    } else {
      createUserMutation.mutate(userData as unknown as CreateUserPayload, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredUsers = users.filter((user: BackofficeUser) =>
    !selectedCeramic || user.ceramic_id === selectedCeramic,
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg sm:text-xl">Gerenciamento de Usuários</CardTitle>
            <CardDescription className="text-sm">
              Gerencie todos os usuários do sistema
            </CardDescription>
          </div>
          <Button
            className="flex items-center gap-2 w-full sm:w-auto"
            size="sm"
            onClick={handleCreateUser}
          >
            <Plus className="h-4 w-4" />
            <span className="sm:inline">Novo Usuário</span>
          </Button>
        </div>
        <div className="pt-4 space-y-2">
          <Label className="text-sm font-medium" htmlFor="ceramic-filter">Filtrar por Cerâmica</Label>
          <Select value={selectedCeramic} onValueChange={(value) => setSelectedCeramic(value === 'all' ? '' : value)}>
            <SelectTrigger className="w-full sm:w-[280px]" id="ceramic-filter">
              <SelectValue placeholder="Todas as cerâmicas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cerâmicas</SelectItem>
              {ceramics.map((ceramic: {id: string, name: string}) => (
                <SelectItem key={ceramic.id} value={ceramic.id}>{ceramic.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-4 p-4">
          {filteredUsers.length > 0 ? filteredUsers.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-base">{user.full_name || user.email}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant={user.is_admin ? 'destructive' : 'outline'}>
                    {user.is_admin ? 'Admin Global' : user.user_levels?.name || 'N/A'}
                  </Badge>
                  {user.ceramics && (
                    <Badge variant="secondary">{user.ceramics.name}</Badge>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </Card>
          )) : <p className="text-center text-muted-foreground p-4">Nenhum usuário encontrado para a cerâmica selecionada.</p>}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Cerâmica</TableHead>
                <TableHead className="hidden lg:table-cell">Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name || '-'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{user.email}</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant={user.is_admin ? 'destructive' : 'outline'}>
                      {user.is_admin ? 'Admin Global' : user.user_levels?.name || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.ceramics?.name || '-'}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell className="h-24 text-center" colSpan={6}>
                    Nenhum usuário encontrado para a cerâmica selecionada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <UserDialog
          ceramics={ceramics}
          open={dialogOpen}
          user={editingUser}
          userLevels={userLevels}
          onOpenChange={setDialogOpen}
          onSave={handleSaveUser}
        />
      </CardContent>
    </Card>
  );
};

export default UsersTab;
