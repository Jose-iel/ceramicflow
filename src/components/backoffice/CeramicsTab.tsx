
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Ceramic } from '@/types/backoffice';
import CeramicDialog from './CeramicDialog';

const mockCeramics: Ceramic[] = [
  {
    id: '1',
    name: 'Cerâmica São José',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 1234-5678',
    email: 'contato@ceramicasaojose.com',
    isActive: true,
    createdAt: '2024-01-15',
    users: []
  },
  {
    id: '2',
    name: 'Cerâmica Bela Vista',
    address: 'Av. Industrial, 456 - Distrito Industrial',
    phone: '(11) 8765-4321',
    email: 'admin@ceramicabelavista.com',
    isActive: true,
    createdAt: '2024-01-10',
    users: []
  }
];

const CeramicsTab = () => {
  const [ceramics, setCeramics] = useState<Ceramic[]>(mockCeramics);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCeramic, setEditingCeramic] = useState<Ceramic | null>(null);

  const handleCreateCeramic = () => {
    setEditingCeramic(null);
    setDialogOpen(true);
  };

  const handleEditCeramic = (ceramic: Ceramic) => {
    setEditingCeramic(ceramic);
    setDialogOpen(true);
  };

  const handleDeleteCeramic = (ceramicId: string) => {
    setCeramics(ceramics.filter(ceramic => ceramic.id !== ceramicId));
  };

  const handleSaveCeramic = (ceramicData: Partial<Ceramic>) => {
    if (editingCeramic) {
      setCeramics(ceramics.map(ceramic => 
        ceramic.id === editingCeramic.id 
          ? { ...ceramic, ...ceramicData }
          : ceramic
      ));
    } else {
      const newCeramic: Ceramic = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        users: [],
        isActive: true,
        ...ceramicData
      } as Ceramic;
      setCeramics([...ceramics, newCeramic]);
    }
    setDialogOpen(false);
  };

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
                  <Badge variant={ceramic.isActive ? 'default' : 'secondary'} className="text-xs">
                    {ceramic.isActive ? 'Ativa' : 'Inativa'}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {ceramic.users.length}
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
                    <Badge variant={ceramic.isActive ? 'default' : 'secondary'} className="text-xs">
                      {ceramic.isActive ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {ceramic.users.length}
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
          onSave={handleSaveCeramic}
        />
      </CardContent>
    </Card>
  );
};

export default CeramicsTab;
