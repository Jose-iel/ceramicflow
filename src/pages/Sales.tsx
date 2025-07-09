import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ShoppingCart, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SaleDialog from '@/components/sales/SaleDialog';
import { 
  useSalesOptimized, 
  useCreateSaleOptimized, 
  useUpdateSaleOptimized, 
  useDeleteSaleOptimized 
} from '@/integrations/supabase/hooks';
import type { Sale } from '@/integrations/supabase/api/sales';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Sales = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const isMobile = useIsMobile();

  // Usando hooks otimizados com cache
  const { data: sales = [], isLoading } = useSalesOptimized();
  const createSaleMutation = useCreateSaleOptimized();
  const updateSaleMutation = useUpdateSaleOptimized();
  const deleteSaleMutation = useDeleteSaleOptimized();

  const handleAddNew = () => {
    setEditingSale(null);
    setDialogOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setDialogOpen(true);
  };

  const handleDeleteSale = (saleId: string) => {
    deleteSaleMutation.mutate(saleId);
  };

  const handleSaveSale = (saleData: any) => {
    if (editingSale) {
      updateSaleMutation.mutate({ saleId: editingSale.id, payload: saleData }, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingSale(null);
        },
      });
    } else {
      createSaleMutation.mutate(saleData, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingSale(null);
        },
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingSale(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col min-w-0",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Vendas de Tijolos" 
          subtitle="Gerencie e acompanhe todas as vendas realizadas"
        />
        
        <main className="flex-1 px-4 md:px-6 py-4 md:py-6 overflow-x-hidden">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Vendas de Tijolos
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Gerencie e acompanhe todas as vendas realizadas
                </p>
              </div>
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova Venda
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Histórico de Vendas
                </CardTitle>
                <CardDescription>
                  Lista de todas as vendas registradas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando vendas...</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile Card View */}
                    <div className="block lg:hidden space-y-4">
                      {sales.map((sale) => (
                        <Card key={sale.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-base">{sale.customer_name}</h3>
                                <p className="text-sm text-muted-foreground">{sale.customer_contact}</p>
                              </div>
                              <div className="flex gap-1 ml-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditSale(sale)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteSale(sale.id)}>
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Data:</span>
                                <p className="font-medium">{format(new Date(sale.sale_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Quantidade:</span>
                                <p className="font-medium">{sale.brick_quantity.toLocaleString()} tijolos</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Preço/Milheiro:</span>
                                <p className="font-medium">R$ {sale.price_per_thousand.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Total:</span>
                                <p className="font-medium text-green-600">R$ {sale.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                              </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              Registrado por: {sale.recorded_by}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Contato</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Preço/Milheiro</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Registrado por</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sales.map((sale) => (
                            <TableRow key={sale.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                  {format(new Date(sale.sale_date), 'dd/MM/yyyy', { locale: ptBR })}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{sale.customer_name}</TableCell>
                              <TableCell className="text-muted-foreground">{sale.customer_contact || '-'}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {sale.brick_quantity.toLocaleString()} tijolos
                                </Badge>
                              </TableCell>
                              <TableCell>R$ {sale.price_per_thousand.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                              <TableCell className="font-semibold text-green-600">
                                R$ {sale.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="text-muted-foreground">{sale.recorded_by}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditSale(sale)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Tem certeza que deseja excluir a venda para "{sale.customer_name}"? Esta ação não pode ser desfeita.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteSale(sale.id)}>
                                          Excluir
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {sales.length === 0 && (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhuma venda registrada ainda.</p>
                        <Button onClick={handleAddNew} className="mt-4">
                          Registrar primeira venda
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <SaleDialog
              open={dialogOpen}
              onOpenChange={handleDialogClose}
              sale={editingSale}
              onSave={handleSaveSale}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sales;
