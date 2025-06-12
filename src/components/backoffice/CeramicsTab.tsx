
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
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gerenciamento de Cerâmicas</CardTitle>
            <CardDescription>
              Cadastre e gerencie as cerâmicas do sistema
            </CardDescription>
          </div>
          <Button onClick={handleCreateCeramic} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Cerâmica
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Telefone</TableHead>
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
                <TableCell>{ceramic.address}</TableCell>
                <TableCell>{ceramic.phone}</TableCell>
                <TableCell>{ceramic.email}</TableCell>
                <TableCell>
                  <Badge variant={ceramic.isActive ? 'default' : 'secondary'}>
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
                  <div className="flex items-center gap-2">
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
