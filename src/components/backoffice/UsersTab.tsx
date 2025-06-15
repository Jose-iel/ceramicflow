
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import UserDialog from './UserDialog';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
}

const UsersTab = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: Profile) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      await fetchUsers();
      toast({
        title: "Usuário excluído com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir usuário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (editingUser) {
        // Atualizar usuário existente
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: userData.full_name,
            is_admin: userData.is_admin
          })
          .eq('id', editingUser.id);

        if (error) throw error;
      }
      
      await fetchUsers();
      setDialogOpen(false);
      toast({
        title: editingUser ? "Usuário atualizado" : "Usuário criado",
        description: "Operação realizada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                    <h3 className="font-medium text-base">{user.full_name || user.email}</h3>
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
                  <Badge variant={user.is_admin ? 'destructive' : 'outline'} className="text-xs">
                    {user.is_admin ? 'Administrador' : 'Usuário'}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p>Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
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
                <TableHead>Tipo</TableHead>
                <TableHead className="hidden lg:table-cell">Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name || '-'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.is_admin ? 'destructive' : 'outline'} className="text-xs">
                      {user.is_admin ? 'Administrador' : 'Usuário'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
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
