import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Ceramic } from '@/types/backoffice';
import CeramicDialog from './CeramicDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CeramicsTab = () => {
  const [ceramics, setCeramics] = useState<Ceramic[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCeramic, setEditingCeramic] = useState<Ceramic | null>(null);
  const { toast } = useToast();

  const fetchCeramics = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('ceramics').select('*');
    if (error) {
      toast({ title: "Erro ao buscar cerâmicas", description: error.message, variant: 'destructive' });
    } else {
      setCeramics(data as any[] || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCeramics();
  }, []);

  const handleCreateCeramic = () => {
    setEditingCeramic(null);
    setDialogOpen(true);
  };

  const handleEditCeramic = (ceramic: Ceramic) => {
    setEditingCeramic(ceramic);
    setDialogOpen(true);
  };

  const handleDeleteCeramic = async (ceramicId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta cerâmica?')) return;
    const { error } = await supabase.from('ceramics').delete().eq('id', ceramicId);
    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Cerâmica excluída!' });
      fetchCeramics();
    }
  };

  const handleSaveCeramic = async (ceramicData: Partial<Omit<Ceramic, 'id' | 'created_at' | 'users'>>) => {
    const dataToSave = {
      name: ceramicData.name,
      address: ceramicData.address,
      phone: ceramicData.phone,
      email: ceramicData.email,
      is_active: ceramicData.is_active,
    };
    
    let error;
    if (editingCeramic) {
      ({ error } = await supabase.from('ceramics').update(dataToSave).eq('id', editingCeramic.id));
    } else {
      ({ error } = await supabase.from('ceramics').insert(dataToSave));
    }

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Cerâmica salva com sucesso!' });
      setDialogOpen(false);
      fetchCeramics();
    }
  };

  if (loading) return <div>Carregando...</div>;

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
