import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import UserLevelDialog from './UserLevelDialog';
import { UserLevel } from '@/integrations/supabase/api/user-levels';
import { 
  useUserLevels, 
  useCreateUserLevel, 
  useUpdateUserLevel, 
  useDeleteUserLevel,
  useRoutes
} from '@/integrations/supabase/hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const UserLevelsTab = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<UserLevel | null>(null);

  const { data: userLevels = [], isLoading } = useUserLevels();
  const { data: routes = [] } = useRoutes();
  const createUserLevelMutation = useCreateUserLevel();
  const updateUserLevelMutation = useUpdateUserLevel();
  const deleteUserLevelMutation = useDeleteUserLevel();

  const handleAddNew = () => {
    setEditingLevel(null);
    setDialogOpen(true);
  };

  const handleEditLevel = (level: UserLevel) => {
    setEditingLevel(level);
    setDialogOpen(true);
  };

  const handleDeleteLevel = (levelId: string) => {
    deleteUserLevelMutation.mutate(levelId);
  };

  const handleSaveLevel = (levelData: { name: string; description?: string; permissions: string[] }) => {
    if (editingLevel) {
      updateUserLevelMutation.mutate({ levelId: editingLevel.id, payload: levelData }, {
        onSuccess: () => setDialogOpen(false),
      });
    } else {
      createUserLevelMutation.mutate(levelData, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  if (isLoading) return <div className="text-center p-8">Carregando...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Níveis de Acesso</CardTitle>
            <CardDescription>
              Crie, edite e configure os níveis de usuário e suas permissões.
            </CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Novo Nível
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nível</TableHead>
                <TableHead className="hidden md:table-cell">Descrição</TableHead>
                <TableHead>Rotas Permitidas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userLevels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell className="font-medium">{level.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{level.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      <span className="text-xs text-muted-foreground">Clique em editar para ver permissões</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditLevel(level)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita. Isso irá deletar permanentemente o nível de acesso "{level.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteLevel(level.id)}>
                              Deletar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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