
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { UserLevelAccess, UserLevel, Route } from '@/types/backoffice';
import UserLevelDialog from './UserLevelDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UserLevelsTab = () => {
  const [userLevels, setUserLevels] = useState<UserLevelAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<UserLevelAccess | null>(null);
  const { toast } = useToast();

  const fetchUserLevels = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_level_permissions')
      .select(`
        user_level,
        routes ( id, path )
      `);

    if (error) {
      toast({ title: "Erro ao buscar níveis", description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    const levels = Object.values(UserLevel).map(levelName => ({
      id: levelName,
      name: levelName,
      description: `Permissões para o nível ${levelName}`,
      allowedRoutes: data
        .filter(p => p.user_level === levelName && p.routes)
        .map(p => (p.routes as { path: string }).path)
    }));
    
    setUserLevels(levels);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserLevels();
  }, []);

  const handleEditLevel = (level: UserLevelAccess) => {
    setEditingLevel(level);
    setDialogOpen(true);
  };

  const handleSaveLevel = async (levelData: Partial<UserLevelAccess>) => {
    const levelName = editingLevel?.name;
    if (!levelName) return;

    // 1. Fetch all routes to get IDs from paths
    const { data: routes, error: routesError } = await supabase.from('routes').select('id, path');
    if (routesError) {
      toast({ title: 'Erro ao buscar rotas', description: routesError.message, variant: 'destructive' });
      return;
    }

    // 2. Delete existing permissions for this level
    const { error: deleteError } = await supabase.from('user_level_permissions').delete().eq('user_level', levelName);
    if (deleteError) {
      toast({ title: 'Erro ao limpar permissões', description: deleteError.message, variant: 'destructive' });
      return;
    }

    // 3. Insert new permissions
    const permissionsToInsert = levelData.allowedRoutes
      ?.map(path => {
        const route = routes.find(r => r.path === path);
        return route ? { user_level: levelName, route_id: route.id } : null;
      })
      .filter(p => p !== null);

    if (permissionsToInsert && permissionsToInsert.length > 0) {
      const { error: insertError } = await supabase.from('user_level_permissions').insert(permissionsToInsert as any);
      if (insertError) {
        toast({ title: 'Erro ao salvar permissões', description: insertError.message, variant: 'destructive' });
        return;
      }
    }

    toast({ title: 'Permissões salvas!' });
    setDialogOpen(false);
    fetchUserLevels();
  };

  if (loading) return <div>Carregando...</div>;

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
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nível</TableHead>
              <TableHead>Rotas Permitidas</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userLevels.map((level) => (
              <TableRow key={level.id}>
                <TableCell className="font-medium">{level.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {level.allowedRoutes.slice(0, 5).map((route) => (
                      <Badge key={route} variant="outline" className="text-xs">
                        {route}
                      </Badge>
                    ))}
                    {level.allowedRoutes.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{level.allowedRoutes.length - 5} mais
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
