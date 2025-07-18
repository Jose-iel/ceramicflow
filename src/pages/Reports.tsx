import { ChevronDown, Download, FileBarChart, Filter } from 'lucide-react';
import React, { useState } from 'react';

import PageLayout from '@/components/common/PageLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useMonthFilter } from '@/hooks/useMonthFilter';

const ReportsPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { selectedMonth, setSelectedMonth } = useMonthFilter();

  const actions = [
    {
      label: 'Filtros',
      mobileLabel: 'Filtros',
      onClick: () => setIsFiltersOpen(!isFiltersOpen),
      variant: 'outline' as const,
      icon: <Filter className="w-4 h-4" />,
    },
    {
      label: 'Exportar',
      mobileLabel: 'Exportar',
      onClick: () => {
        // TODO: Implementar funcionalidade do botão
      },
      variant: 'outline' as const,
      icon: <Download className="w-4 h-4" />,
    },
  ];

  return (
    <PageLayout
      actions={actions}
      selectedMonth={selectedMonth}
      showSearch={false} // Reports não precisa de busca
      statsCards={[]} // Reports não precisa de stats cards
      subtitle="Visualização e exportação de dados"
      title="Relatórios"
      onMonthChange={setSelectedMonth}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Período</h3>
                <Calendar className="rounded-md border" mode="single" selected={date} onSelect={setDate} />
              </div>

              <Collapsible className="space-y-2" open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Tipos de Relatório</h3>
                  <CollapsibleTrigger asChild>
                    <Button className="w-9 p-0" size="sm" variant="ghost">
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="operations" />
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="operations"
                    >
                      Operações
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="maintenance" />
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="maintenance"
                    >
                      Manutenções
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="vehicles" />
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="vehicles"
                    >
                      Veículos
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="employees" />
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="employees"
                    >
                      Funcionários
                    </label>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Relatórios Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Report Cards */}
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="p-2 bg-primary/10 text-primary rounded-md">
                      <FileBarChart className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Utilização de Veículos</h3>
                      <p className="text-sm text-muted-foreground">Análise de horas de uso por veículo</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="p-2 bg-primary/10 text-primary rounded-md">
                      <FileBarChart className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Consumo de Combustível</h3>
                      <p className="text-sm text-muted-foreground">Consumo de combustível por veículo e horímetro</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="p-2 bg-primary/10 text-primary rounded-md">
                      <FileBarChart className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Histórico de Manutenções</h3>
                      <p className="text-sm text-muted-foreground">Registros de manutenções realizadas</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="p-2 bg-primary/10 text-primary rounded-md">
                      <FileBarChart className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Status dos Funcionários</h3>
                      <p className="text-sm text-muted-foreground">Validade de ASO e certificações</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 text-center text-muted-foreground">
                <p>Selecione um relatório para visualizar ou exportar</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReportsPage;
