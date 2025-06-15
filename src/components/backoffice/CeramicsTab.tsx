
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Ceramic } from '@/types/backoffice';
import CeramicDialog from './CeramicDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Funções para interagir com o BFF
const fetchCeramicsData = async () => {
  const { data, error } = await supabase.functions.invoke('backoffice-bff', {
    body: { resource: 'ceramics-tab', action: 'getData' },
  });
  if (error) throw new Error(error.message);
  // O BFF agora retorna um objeto { ceramics: [] }
  return data.ceramics || [];
};

const saveCeramic = async (ceramicData: Partial<Omit<Ceramic, 'id' | 'created_at' | 'users'>>, editingCeramic: Ceramic | null) => {
  const action = editingCeramic ? 'update' : 'create';
  const payload = editingCeramic
    ? { ceramicId: editingCeramic.id, ceramicData }
    : { ceramicData };

  const { error } = await supabase.functions.invoke('backoffice-bff', {
    body: { resource: 'ceramics-tab', action, payload },
  });
  if (error) throw new Error(error.message);
};

const deleteCeramic = async (ceramicId: string) => {
  if (!confirm('Tem certeza que deseja excluir esta cerâmica?')) throw new Error('Exclusão cancelada');
  const { error } = await supabase.functions.invoke('backoffice-bff', {
    body: { resource: 'ceramics-tab', action: 'delete', payload: { ceramicId } },
  });
  if (error) throw new Error(error.message);
};

const CeramicsTab = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCeramic, setEditingCeramic] = useState<Ceramic | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ceramics = [], isLoading, isError, error } = useQuery<Ceramic[]>({
    queryKey: ['ceramics'],
    queryFn: fetchCeramicsData,
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Erro ao carregar cerâmicas",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  const saveCeramicMutation = useMutation({
    mutationFn: (ceramicData: Partial<Omit<Ceramic, 'id' | 'created_at' | 'users'>>) => saveCeramic(ceramicData, editingCeramic),
    onSuccess: () => {
      toast({ title: editingCeramic ? "Cerâmica atualizada" : "Cerâmica criada", description: "Operação realizada com sucesso." });
      queryClient.invalidateQueries({ queryKey: ['ceramics'] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Erro ao salvar cerâmica", description: error.message, variant: "destructive" });
    },
  });

  const deleteCeramicMutation = useMutation({
    mutationFn: deleteCeramic,
    onSuccess: () => {
      toast({ title: "Cerâmica excluída com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['ceramics'] });
    },
    onError: (error: any) => {
      if (error.message !== 'Exclusão cancelada') {
        toast({ title: "Erro ao excluir cerâmica", description: error.message, variant: "destructive" });
      }
    },
  });

  const handleCreateCeramic = () => {
    setEditingCeramic(null);
    setDialogOpen(true);
  };

  const handleEditCeramic = (ceramic: Ceramic) => {
    setEditingCeramic(ceramic);
    setDialogOpen(true);
  };

  const handleDeleteCeramic = (ceramicId: string) => {
    deleteCeramicMutation.mutate(ceramicId);
  };

  const handleSaveCeramic = (ceramicData: Partial<Omit<Ceramic, 'id' | 'created_at' | 'users'>>) => {
    saveCeramicMutation.mutate(ceramicData);
  };

  if (isLoading) {
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
            <CardTitle className="text-lg sm:text-xl">Gerenciamento de Cerâmicas</CardTitle>
            <CardDescription className="text-sm">
              Cadastre e gerencie as cerâmicas do sistema
            </CardDescription>
          </div>
          <Button 
            onClick={handleCreateCeramic} 
            className="flex items-center gap-2 w-full sm:w-auto"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Nova Cerâmica
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-4 p-4">
          {ceramics.map((ceramic) => (
            <Card key={ceramic.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base truncate">{ceramic.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{ceramic.email}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCeramic(ceramic)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCeramic(ceramic.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="truncate">{ceramic.address}</p>
                  <p>{ceramic.phone}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <Badge variant={ceramic.is_active ? 'default' : 'secondary'} className="text-xs">
                    {ceramic.is_active ? 'Ativa' : 'Inativa'}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {/* User count would require another query. Leaving as 0 for now. */}
                    0
                  </div>
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
                <TableHead className="hidden lg:table-cell">Endereço</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ceramics.map((ceramic) => (
                <TableRow key={ceramic.id}>
                  <TableCell className="font-medium">{ceramic.name}</TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                    {ceramic.address}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{ceramic.phone}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{ceramic.email}</TableCell>
                  <TableCell>
                    <Badge variant={ceramic.is_active ? 'default' : 'secondary'} className="text-xs">
                      {ceramic.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {/* User count requires another query. Leaving as 0. */}
                      0
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCeramic(ceramic)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCeramic(ceramic.id)}
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

        <CeramicDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          ceramic={editingCeramic}
          onSave={handleSaveCeramic as any}
        />
      </CardContent>
    </Card>
  );
};

export default CeramicsTab;
