// @ts-expect-error - Deno runtime resolve this correctly
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Type declarations for Edge Function
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

interface DashboardOverviewRequest {
  ceramic_id: string;
  selectedMonth?: string;
}

interface DashboardOverviewResponse {
  vehicles: {
    total: number;
    operational: number;
    maintenance: number;
    stopped: number;
  };
  employees: {
    total: number;
    regular: number;
    expiringSoon: number;
    expired: number;
  };
  operations: {
    active: number;
  };
  maintenances: {
    pending: number;
  };
  consumption: {
    wood: number;
    clay: number;
  };
  sales: {
    totalSales: number;
    totalRevenue: number;
    totalQuantity: number;
    averagePrice: number;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { ceramic_id, selectedMonth }: DashboardOverviewRequest = await req.json();

    if (!ceramic_id) {
      throw new Error('ceramic_id é obrigatório');
    }

    // Configurar filtros de data se selectedMonth for fornecido
    const startDate = selectedMonth ? `${selectedMonth}-01` : null;
    const endDate = selectedMonth ? `${selectedMonth}-31` : null;

    // Executar todas as consultas em paralelo
    const [
      vehiclesResult,
      employeesResult,
      operationsResult,
      maintenancesResult,
      salesResult,
      woodConsumptionResult,
      clayConsumptionResult
    ] = await Promise.all([
      // Veículos
      supabase
        .from('vehicles')
        .select('status')
        .eq('ceramic_id', ceramic_id),

      // Funcionários
      supabase
        .from('employees')
        .select('id, aso_expiration_date, nr_expiration_date')
        .eq('ceramic_id', ceramic_id),

      // Operações (filtradas por data se selectedMonth estiver definido)
      selectedMonth
        ? supabase
            .from('operations')
            .select('status')
            .eq('ceramic_id', ceramic_id)
            .eq('status', 'IN_PROGRESS')
            .gte('start_date', startDate!)
            .lte('start_date', endDate!)
        : supabase
            .from('operations')
            .select('status')
            .eq('ceramic_id', ceramic_id)
            .eq('status', 'IN_PROGRESS'),

      // Manutenções (filtradas por data se selectedMonth estiver definido)
      selectedMonth
        ? supabase
            .from('maintenances')
            .select('status')
            .eq('ceramic_id', ceramic_id)
            .eq('status', 'WAITING')
            .gte('reported_date', startDate!)
            .lte('reported_date', endDate!)
        : supabase
            .from('maintenances')
            .select('status')
            .eq('ceramic_id', ceramic_id)
            .eq('status', 'WAITING'),

      // Vendas (filtradas por data se selectedMonth estiver definido) - buscar mais campos
      selectedMonth
        ? supabase
            .from('sales')
            .select('total_value, total_quantity, price_per_thousand')
            .eq('ceramic_id', ceramic_id)
            .gte('sale_date', startDate!)
            .lte('sale_date', endDate!)
        : supabase
            .from('sales')
            .select('total_value, total_quantity, price_per_thousand')
            .eq('ceramic_id', ceramic_id),

      // Consumo de lenha (filtrado por data se selectedMonth estiver definido)
      selectedMonth
        ? supabase
            .from('wood_consumptions')
            .select('quantity')
            .eq('ceramic_id', ceramic_id)
            .gte('date', startDate!)
            .lte('date', endDate!)
        : supabase
            .from('wood_consumptions')
            .select('quantity')
            .eq('ceramic_id', ceramic_id),

      // Consumo de barro (filtrado por data se selectedMonth estiver definido)
      selectedMonth
        ? supabase
            .from('clay_consumptions')
            .select('trucks_quantity')
            .eq('ceramic_id', ceramic_id)
            .gte('date', startDate!)
            .lte('date', endDate!)
        : supabase
            .from('clay_consumptions')
            .select('trucks_quantity')
            .eq('ceramic_id', ceramic_id),
    ]);

    // Verificar erros
    if (vehiclesResult.error) throw vehiclesResult.error;
    if (employeesResult.error) throw employeesResult.error;
    if (operationsResult.error) throw operationsResult.error;
    if (maintenancesResult.error) throw maintenancesResult.error;
    if (salesResult.error) throw salesResult.error;
    if (woodConsumptionResult.error) throw woodConsumptionResult.error;
    if (clayConsumptionResult.error) throw clayConsumptionResult.error;

    // Processar dados dos veículos
    const vehicles = vehiclesResult.data || [];
    const totalVehicles = vehicles.length;
    const operationalVehicles = vehicles.filter(v => v.status === 'OPERATIONAL').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'MAINTENANCE').length;
    const stoppedVehicles = vehicles.filter(v => v.status === 'STOPPED').length;

    // Processar dados dos funcionários
    const employees = employeesResult.data || [];
    const totalEmployees = employees.length;
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    let regularCertificates = 0;
    let expiringSoon = 0;
    let expired = 0;

    employees.forEach(employee => {
      const asoDate = employee.aso_expiration_date ? new Date(employee.aso_expiration_date) : null;
      const nrDate = employee.nr_expiration_date ? new Date(employee.nr_expiration_date) : null;

      const asoStatus = asoDate ?
        (asoDate < today ? 'expired' : (asoDate < thirtyDaysFromNow ? 'expiring' : 'regular')) : 'regular';
      const nrStatus = nrDate ?
        (nrDate < today ? 'expired' : (nrDate < thirtyDaysFromNow ? 'expiring' : 'regular')) : 'regular';

      if (asoStatus === 'expired' || nrStatus === 'expired') {
        expired++;
      } else if (asoStatus === 'expiring' || nrStatus === 'expiring') {
        expiringSoon++;
      } else {
        regularCertificates++;
      }
    });

    // Processar dados de vendas
    const sales = salesResult.data || [];
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_value || 0), 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + (sale.total_quantity || 0), 0);
    const averagePrice = sales.length > 0 
      ? sales.reduce((sum, sale) => sum + (sale.price_per_thousand || 0), 0) / sales.length 
      : 0;

    // Processar outras métricas
    const activeOperations = operationsResult.data?.length || 0;
    const pendingMaintenances = maintenancesResult.data?.length || 0;

    const woodConsumption = woodConsumptionResult.data?.reduce((sum, wood) => sum + (wood.quantity || 0), 0) || 0;
    const clayConsumption = clayConsumptionResult.data?.reduce((sum, clay) => sum + (clay.trucks_quantity || 0), 0) || 0;

    const dashboardData: DashboardOverviewResponse = {
      vehicles: {
        total: totalVehicles,
        operational: operationalVehicles,
        maintenance: maintenanceVehicles,
        stopped: stoppedVehicles,
      },
      employees: {
        total: totalEmployees,
        regular: regularCertificates,
        expiringSoon,
        expired,
      },
      operations: {
        active: activeOperations,
      },
      maintenances: {
        pending: pendingMaintenances,
      },
      consumption: {
        wood: woodConsumption,
        clay: clayConsumption,
      },
      sales: {
        totalSales,
        totalRevenue,
        totalQuantity,
        averagePrice,
      }
    };

    return new Response(JSON.stringify(dashboardData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Erro na Edge Function get-dashboard-overview:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
