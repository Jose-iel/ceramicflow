import { TrendingUp, ShoppingCart, Package, DollarSign } from 'lucide-react';

import AnimatedCounter from '@/components/common/AnimatedCounter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonthFilter } from '@/hooks/useMonthFilter';
import { useSalesStatsOptimized } from '@/integrations/supabase/hooks';

interface SalesData {
  totalSales: number;
  totalRevenue: number;
  totalQuantity: number;
  averagePrice: number;
}

interface SalesReportCardProps {
  salesData?: SalesData;
}

const SalesReportCard = ({ salesData }: SalesReportCardProps) => {
  const { selectedMonth } = useMonthFilter();
  // Só usar hook se salesData não for fornecido
  const shouldFetchStats = !salesData;
  const { data: stats, isLoading } = useSalesStatsOptimized(selectedMonth, shouldFetchStats);

  // Usar salesData se fornecido, caso contrário usar stats do hook
  const finalStats = salesData || stats;
  const loading = !salesData && isLoading;

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-20 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Resumo de Vendas
          </CardTitle>
          <Badge className="text-xs" variant="secondary">
            Relatório
          </Badge>
        </div>
        <CardDescription className="text-sm">Relatório geral das vendas de tijolos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Total Vendas</span>
            </div>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={finalStats?.totalSales || 0} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Receita Total</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              R$ {(finalStats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Tijolos Vendidos</span>
            </div>
            <div className="text-lg font-semibold">
              <AnimatedCounter value={finalStats?.totalQuantity || 0} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Preço Médio/Milheiro</span>
            </div>
            <div className="text-lg font-semibold">
              R$ {(finalStats?.averagePrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesReportCard;
