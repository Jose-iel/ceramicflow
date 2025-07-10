
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Route } from '@/types/backoffice';

const systemRoutes: Route[] = [
  {
    id: 'dashboard',
    path: '/dashboard',
    name: 'Dashboard',
    description: 'Página inicial com visão geral do sistema'
  },
  {
    id: 'vehicles',
    path: '/vehicles',
    name: 'Veículos',
    description: 'Gerenciamento de veículos e empilhadeiras'
  },
  {
    id: 'employees',
    path: '/employees',
    name: 'Funcionários',
    description: 'Controle de funcionários e operadores'
  },
  {
    id: 'operations',
    path: '/operations',
    name: 'Operações',
    description: 'Controle e monitoramento de operações'
  },
  {
    id: 'maintenance',
    path: '/maintenance',
    name: 'Manutenção',
    description: 'Gestão de manutenção de equipamentos'
  },
  {
    id: 'wood',
    path: '/wood',
    name: 'Lenha',
    description: 'Controle de consumo e compra de lenha'
  },
  {
    id: 'raw-material',
    path: '/raw-material',
    name: 'Matéria Prima',
    description: 'Gestão de matéria prima (barro)'
  },
  {
    id: 'reports',
    path: '/reports',
    name: 'Relatórios',
    description: 'Relatórios e análises do sistema'
  },
  {
    id: 'admin',
    path: '/admin',
    name: 'Administração',
    description: 'Painel administrativo do sistema'
  }
];

const RoutesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rotas do Sistema</CardTitle>
        <CardDescription>
          Visualize todas as rotas disponíveis no sistema para configuração de permissões
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID da Rota</TableHead>
              <TableHead>Caminho</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {systemRoutes.map((route) => (
              <TableRow key={route.id}>
                <TableCell className="font-mono text-sm">{route.id}</TableCell>
                <TableCell className="font-mono text-sm">{route.path}</TableCell>
                <TableCell className="font-medium">{route.name}</TableCell>
                <TableCell>{route.description}</TableCell>
                <TableCell>
                  <Badge variant="default">Ativa</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Informações sobre Rotas</h3>
          <p className="text-sm text-muted-foreground">
            Estas são todas as rotas disponíveis no sistema. Use os IDs das rotas ao configurar os 
            níveis de acesso dos usuários na aba "Níveis de Acesso". As rotas são automaticamente 
            protegidas baseado nas permissões configuradas para cada nível de usuário.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoutesTab;
