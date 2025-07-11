// Importa dependências e cabeçalhos CORS
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { startOfMonth, endOfMonth, formatISO, subDays, isBefore, parseISO, addDays } from 'https://esm.sh/date-fns@3';

// --- Tipagem ---
interface DashboardData {
  kpis: {
    sales: {
      totalRevenue: number;
      totalSalesCount: number;
      brickQuantitySold: number;
    };
    operations: {
      activeOperationsCount: number;
      completedOperationsCount: number;
    };
    wood: {
      totalWoodConsumed: number;
      totalWoodPurchased: number;
    };
    terra_e_barro: { // Renomeado de raw_materials
      totalTrucks: number;
    };
    employees: {
      totalCount: number;
      regularCount: number;
      expiringSoonCount: number; // ASO/NR vencendo em 30 dias
      expiredCount: number; // ASO/NR vencido
    };
    vehicles: {
      totalCount: number;
      operationalCount: number;
      maintenanceCount: number;
    };
  };
  recentActivities: {
    latestSales: any[]; // Substituir 'any' por tipo Sale
    latestOperations: any[]; // Substituir 'any' por tipo Operation
  };
}


// --- Funções Auxiliares ---

function getDateRange(selectedMonth: string | undefined) {
  const referenceDate = selectedMonth ? parseISO(`${selectedMonth}-15`) : new Date();
  const startDate = formatISO(startOfMonth(referenceDate));
  const endDate = formatISO(endOfMonth(referenceDate));
  return { startDate, endDate };
}

// --- Funções de Busca de Dados (com tratamento de erro individual) ---

async function getSalesData(supabase: SupabaseClient, ceramic_id: string, startDate: string, endDate: string) {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('total_value, brick_quantity')
      .eq('ceramic_id', ceramic_id)
      .gte('sale_date', startDate)
      .lte('sale_date', endDate);
    if (error) throw error;
    if (!data) return { totalRevenue: 0, totalSalesCount: 0, brickQuantitySold: 0 };

    return {
      totalRevenue: data.reduce((sum, item) => sum + (item.total_value || 0), 0),
      totalSalesCount: data.length,
      brickQuantitySold: data.reduce((sum, item) => sum + (item.brick_quantity || 0), 0),
    };
  } catch (error) {
    console.error('Error in getSalesData:', error.message);
    return { totalRevenue: 0, totalSalesCount: 0, brickQuantitySold: 0 };
  }
}

async function getOperationsData(supabase: SupabaseClient, ceramic_id: string, startDate: string, endDate: string) {
  try {
    // Operações concluídas no período
    const { count: completedCount, error: completedError } = await supabase
      .from('operations')
      .select('*', { count: 'exact', head: true })
      .eq('ceramic_id', ceramic_id)
      .eq('status', 'Concluída') // Corrigido para o status exato com acento
      .gte('end_date', startDate)
      .lte('end_date', endDate);
    if (completedError) throw completedError;

    // Operações ativas (em andamento) durante o período
    const { count: activeCount, error: activeError } = await supabase
      .from('operations')
      .select('*', { count: 'exact', head: true })
      .eq('ceramic_id', ceramic_id)
      .eq('status', 'Em Andamento') // Corrigido para o status exato
      .lte('start_date', endDate)
      .or(`end_date.gte.${startDate},end_date.is.null`);
    if (activeError) throw activeError;

    return {
      activeOperationsCount: activeCount ?? 0,
      completedOperationsCount: completedCount ?? 0,
    };
  } catch (error) {
    console.error('Error in getOperationsData:', error.message);
    return { activeOperationsCount: 0, completedOperationsCount: 0 };
  }
}

async function getWoodData(supabase: SupabaseClient, ceramic_id: string, startDate: string, endDate: string) {
    try {
        const [purchasedRes, consumedRes] = await Promise.all([
            supabase.from('wood_purchases').select('quantity').eq('ceramic_id', ceramic_id).gte('date', startDate).lte('date', endDate), // Padronizado para 'date'
            supabase.from('wood_consumptions').select('quantity').eq('ceramic_id', ceramic_id).gte('date', startDate).lte('date', endDate)
        ]);

        if (purchasedRes.error) throw purchasedRes.error;
        if (consumedRes.error) throw consumedRes.error;

        const totalWoodPurchased = purchasedRes.data?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;
        const totalWoodConsumed = consumedRes.data?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;

        return { totalWoodPurchased, totalWoodConsumed };
    } catch (error) {
        console.error('Error in getWoodData:', error.message);
        return { totalWoodPurchased: 0, totalWoodConsumed: 0 };
    }
}

async function getTerraEBarroData(supabase: SupabaseClient, ceramic_id: string, startDate: string, endDate: string) {
  try {
    const { data, error } = await supabase
      .from('clay_consumptions') // Corrigido: raw_material_entries -> clay_consumptions
      .select('trucks_quantity')
      .eq('ceramic_id', ceramic_id)
      .gte('date', startDate) // Corrigido: entry_date -> date
      .lte('date', endDate);

    if (error) throw error;
    if (!data) return { totalTrucks: 0 };

    // Soma a quantidade de caminhões de todos os registros
    const totalTrucks = data.reduce((sum, item) => sum + (item.trucks_quantity || 0), 0);

    return {
      totalTrucks,
    };
  } catch (error) {
    console.error('Error in getTerraEBarroData:', error.message);
    return { totalTrucks: 0 };
  }
}


async function getEmployeesData(supabase: SupabaseClient, ceramic_id: string) {
    try {
        const { data, error, count } = await supabase
            .from('employees')
            .select('id, vacation_due_date', { count: 'exact' }) // Corrigido: usa vacation_due_date
            .eq('ceramic_id', ceramic_id); // Corrigido: remove filtro de status 'ACTIVE'

        if (error) throw error;
        if (!data) return { totalCount: 0, regularCount: 0, expiringSoonCount: 0, expiredCount: 0 };

        const today = new Date();
        const thirtyDaysFromNow = addDays(today, 30);
        let regularCount = 0, expiringSoonCount = 0, expiredCount = 0;

        data.forEach(emp => {
            const vacationDate = emp.vacation_due_date ? parseISO(emp.vacation_due_date) : null;

            if (!vacationDate) {
                regularCount++;
                return;
            }
            
            if (isBefore(vacationDate, today)) {
                expiredCount++;
            } else if (isBefore(vacationDate, thirtyDaysFromNow)) {
                expiringSoonCount++;
            } else {
                regularCount++;
            }
        });
        return { totalCount: count ?? 0, regularCount, expiringSoonCount, expiredCount };
    } catch (error) {
        console.error('Error in getEmployeesData:', error.message);
        return { totalCount: 0, regularCount: 0, expiringSoonCount: 0, expiredCount: 0 };
    }
}

async function getVehiclesData(supabase: SupabaseClient, ceramic_id: string) {
    try {
        const { count, error } = await supabase
            .from('vehicles')
            .select('*', { count: 'exact', head: true })
            .eq('ceramic_id', ceramic_id);
        if (error) throw error;

        const [operationalRes, maintenanceRes] = await Promise.all([
            supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('ceramic_id', ceramic_id).eq('status', 'Em Operação'), // Corrigido
            supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('ceramic_id', ceramic_id).eq('status', 'Aguardando Manutenção') // Corrigido
        ]);

        if (operationalRes.error) throw operationalRes.error;
        if (maintenanceRes.error) throw maintenanceRes.error;

        return {
            totalCount: count ?? 0,
            operationalCount: operationalRes.count ?? 0,
            maintenanceCount: maintenanceRes.count ?? 0,
        };
    } catch (error) {
        console.error('Error in getVehiclesData:', error.message);
        return { totalCount: 0, operationalCount: 0, maintenanceCount: 0 };
    }
}

async function getLatestSales(supabase: SupabaseClient, ceramic_id: string) {
    try {
        const { data, error } = await supabase
            .from('sales')
            .select('id, sale_date, customer_name, total_value')
            .eq('ceramic_id', ceramic_id)
            .order('sale_date', { ascending: false })
            .limit(5);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error in getLatestSales:', error.message);
        return [];
    }
}

async function getLatestOperations(supabase: SupabaseClient, ceramic_id: string) {
    try {
        const { data, error } = await supabase
            .from('operations')
            .select('id, description, status')
            .eq('ceramic_id', ceramic_id)
            .order('start_date', { ascending: false })
            .limit(5);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error in getLatestOperations:', error.message);
        return [];
    }
}


// --- Lógica Principal da Função (agora mais resiliente) ---
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('--- Nova Requisição ---');
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Cabeçalho de autorização ausente.');
    }
    console.log('Cabeçalho de autorização presente.');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    console.log('Cliente Supabase criado.');

    const body = await req.json();
    console.log('Corpo da requisição (JSON):', body);

    const { ceramic_id, selectedMonth } = body;
    if (!ceramic_id) {
      throw new Error('ceramic_id é obrigatório no corpo da requisição.');
    }
    console.log(`Dados recebidos: ceramic_id=${ceramic_id}, selectedMonth=${selectedMonth}`);

    const { startDate, endDate } = getDateRange(selectedMonth);
    console.log(`Período calculado: ${startDate} a ${endDate}`);

    // Executa todas as consultas em paralelo. Graças ao try/catch, uma falha não derruba as outras.
    console.log('Iniciando busca de dados em paralelo...');
    const [
      salesData,
      operationsData,
      woodData,
      employeesData,
      vehiclesData,
      latestSales,
      latestOperations,
      terraEBarroData,
    ] = await Promise.all([
      getSalesData(supabase, ceramic_id, startDate, endDate),
      getOperationsData(supabase, ceramic_id, startDate, endDate),
      getWoodData(supabase, ceramic_id, startDate, endDate),
      getEmployeesData(supabase, ceramic_id),
      getVehiclesData(supabase, ceramic_id),
      getLatestSales(supabase, ceramic_id),
      getLatestOperations(supabase, ceramic_id),
      getTerraEBarroData(supabase, ceramic_id, startDate, endDate),
    ]);
    console.log('Busca de dados concluída.');

    const response: DashboardData = {
      kpis: {
        sales: salesData,
        operations: operationsData,
        wood: woodData,
        employees: employeesData,
        vehicles: vehiclesData,
        terra_e_barro: terraEBarroData,
      },
      recentActivities: {
        latestSales,
        latestOperations,
      },
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro fatal na Edge Function:', error);
    return new Response(
      JSON.stringify({
        message: 'Erro interno no servidor.',
        error: error.message,
        stack: error.stack, // Incluir stack trace para depuração
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
