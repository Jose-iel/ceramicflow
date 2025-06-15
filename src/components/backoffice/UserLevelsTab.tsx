
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { UserLevelAccess } from '@/types/backoffice';
import UserLevelDialog from './UserLevelDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  const [userLevels, setUserLevels] = useState<UserLevelAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<UserLevelAccess | null>(null);
  const { toast } = useToast();

  const fetchUserLevels = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_levels')
      .select(`
        id,
        name,
        description,
        user_level_permissions (
          routes ( path )
        )
      `);

    if (error) {
      toast({ title: "Erro ao buscar níveis", description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    const formattedLevels = data.map(level => ({
      id: level.id,
      name: level.name,
      description: level.description || '',
      allowedRoutes: level.user_level_permissions.map((p: any) => p.routes.path)
    }));
    
    setUserLevels(formattedLevels);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserLevels();
  }, []);

  const handleAddNew = () => {
    setEditingLevel(null);
    setDialogOpen(true);
  };

  const handleEditLevel = (level: UserLevelAccess) => {
    setEditingLevel(level);
    setDialogOpen(true);
  };

  const handleDeleteLevel = async (levelId: string) => {
    const { error } = await supabase.from('user_levels').delete().eq('id', levelId);
    if (error) {
      toast({ title: "Erro ao deletar nível", description: error.message, variant: 'destructive' });
    } else {
      toast({ title: "Nível deletado com sucesso!" });
      fetchUserLevels();
    }
  };

  const handleSaveLevel = async (levelData: Partial<UserLevelAccess>) => {
    const { name, description, allowedRoutes } = levelData;
    let levelId = editingLevel?.id;

    if (!levelId) {
      if (!name) {
        toast({ title: 'Nome do nível é obrigatório', variant: 'destructive' });
        return;
      }
      const { data: newLevel, error: insertError } = await supabase
        .from('user_levels')
        .insert({ name, description })
        .select('id')
        .single();
      
      if (insertError) {
        toast({ title: 'Erro ao criar nível', description: insertError.message, variant: 'destructive' });
        return;
      }
      levelId = newLevel.id;
    } else {
      const { error: updateError } = await supabase
        .from('user_levels')
        .update({ description })
        .eq('id', levelId);
      if (updateError) {
        toast({ title: 'Erro ao atualizar descrição', description: updateError.message, variant: 'destructive' });
      }
    }
    
    if (!levelId) return;

    const { data: routes, error: routesError } = await supabase.from('routes').select('id, path');
    if (routesError) {
      toast({ title: 'Erro ao buscar rotas', description: routesError.message, variant: 'destructive' });
      return;
    }

    const { error: deleteError } = await supabase.from('user_level_permissions').delete().eq('user_level_id', levelId);
    if (deleteError) {
      toast({ title: 'Erro ao limpar permissões antigas', description: deleteError.message, variant: 'destructive' });
      return;
    }

    const permissionsToInsert = allowedRoutes
      ?.map(path => {
        const route = routes.find(r => r.path === path);
        return route ? { user_level_id: levelId, route_id: route.id } : null;
      })
      .filter(p => p !== null);

    if (permissionsToInsert && permissionsToInsert.length > 0) {
      const { error: insertError } = await supabase.from('user_level_permissions').insert(permissionsToInsert as any);
      if (insertError) {
        toast({ title: 'Erro ao salvar novas permissões', description: insertError.message, variant: 'destructive' });
        return;
      }
    }

    toast({ title: 'Nível de acesso salvo com sucesso!' });
    setDialogOpen(false);
    fetchUserLevels();
  };

  if (loading) return <div className="text-center p-8">Carregando...</div>;

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
                      {level.allowedRoutes.length > 0 ? (
                        <>
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
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Nenhuma</span>
                      )}
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
