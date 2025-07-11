import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DashboardData } from '@/hooks/useDashboard';

interface DashboardOverviewProps {
  data: DashboardData | undefined;
  isLoading: boolean;
  error?: Error | null;
}

// --- Componente Principal ---
const DashboardOverview = ({ data, isLoading, error }: DashboardOverviewProps) => {
  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div className="text-red-500">Erro ao carregar o dashboard: {error.message}</div>;
  if (!data) return <div>Nenhum dado disponível para o período selecionado.</div>;

  return (
    <div className="space-y-6">
      {/* A seção de KPIs foi movida para o PageLayout através dos statsCards */}
      <RecentActivitiesSection data={data.recentActivities} />
    </div>
  );
};

// --- Seção de Atividades Recentes ---
const RecentActivitiesSection = ({ data }: { data: DashboardData['recentActivities'] }) => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <RecentSalesTable sales={data.latestSales} />
    <RecentOperationsTable operations={data.latestOperations} />
  </div>
);

// --- Tabelas de Atividades Recentes ---
const RecentSalesTable = ({ sales }: { sales: DashboardData['recentActivities']['latestSales'] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Vendas Recentes</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map(sale => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.customer_name}</TableCell>
              <TableCell>{formatDate(sale.sale_date)}</TableCell>
              <TableCell className="text-right">{formatCurrency(sale.total_value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const RecentOperationsTable = ({ operations }: { operations: DashboardData['recentActivities']['latestOperations'] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Operações Recentes</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operations.map(op => (
            <TableRow key={op.id}>
              <TableCell>{op.description}</TableCell>
              <TableCell><Badge variant={op.status === 'COMPLETED' ? 'default' : 'secondary'}>{op.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);


// --- Skeleton Loader ---
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  </div>
);

// --- Funções de Formatação ---
const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return 'Data inválida';
  }
};

export default DashboardOverview;
