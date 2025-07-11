
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

import CeramicDialog from './CeramicDialog';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { CreateCeramicPayload } from '@/integrations/supabase/api/backoffice';
import { useCeramicsData, useCreateCeramic, useUpdateCeramic, useDeleteCeramic } from '@/integrations/supabase/hooks';
import type { Ceramic } from '@/types/backoffice';




const CeramicsTab = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCeramic, setEditingCeramic] = useState<Ceramic | null>(null);

  const { data: ceramics = [], isLoading } = useCeramicsData();
  const createCeramicMutation = useCreateCeramic();
  const updateCeramicMutation = useUpdateCeramic();
  const deleteCeramicMutation = useDeleteCeramic();


  const handleCreateCeramic = () => {
    setEditingCeramic(null);
    setDialogOpen(true);
  };

  const handleEditCeramic = (ceramic: Ceramic) => {
    setEditingCeramic(ceramic);
    setDialogOpen(true);
  };

  const handleDeleteCeramic = (ceramicId: string) => {
    // TODO: Implementar dialog de confirmação personalizado
    deleteCeramicMutation.mutate(ceramicId);
  };

  const handleSaveCeramic = (ceramicData: CreateCeramicPayload) => {
    if (editingCeramic) {
      updateCeramicMutation.mutate({ ceramicId: editingCeramic.id, ceramicData }, {
        onSuccess: () => setDialogOpen(false),
      });
    } else {
      createCeramicMutation.mutate(ceramicData, {
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
            className="flex items-center gap-2 w-full sm:w-auto"
            size="sm"
            onClick={handleCreateCeramic}
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
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditCeramic(ceramic)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
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
                  <Badge className="text-xs" variant={ceramic.is_active ? 'default' : 'secondary'}>
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
                    <Badge className="text-xs" variant={ceramic.is_active ? 'default' : 'secondary'}>
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
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCeramic(ceramic)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
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
          ceramic={editingCeramic}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveCeramic}
        />
      </CardContent>
    </Card>
  );
};

export default CeramicsTab;
