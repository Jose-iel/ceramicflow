import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useDashboardOverview() {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard-overview', profile?.ceramic_id],
    queryFn: async () => {
      if (!profile?.ceramic_id) return null;
      
      // Buscar dados em paralelo
      const [
        vehiclesData,
        employeesData, 
        operationsData,
        maintenancesData,
        salesData,
        woodConsumptionData,
        clayConsumptionData
      ] = await Promise.all([
        supabase.from('vehicles').select('status').eq('ceramic_id', profile.ceramic_id),
        supabase.from('employees').select('id, aso_expiration_date, nr_expiration_date').eq('ceramic_id', profile.ceramic_id),
        supabase.from('operations').select('status').eq('ceramic_id', profile.ceramic_id).eq('status', 'IN_PROGRESS'),
        supabase.from('maintenances').select('status').eq('ceramic_id', profile.ceramic_id).eq('status', 'WAITING'),
        supabase.from('sales').select('total_value').eq('ceramic_id', profile.ceramic_id),
        supabase.from('wood_consumptions').select('quantity').eq('ceramic_id', profile.ceramic_id),
        supabase.from('clay_consumptions').select('trucks_quantity').eq('ceramic_id', profile.ceramic_id),
      ]);

      // Calcular métricas dos veículos
      const vehicles = vehiclesData.data || [];
      const totalVehicles = vehicles.length;
      const operationalVehicles = vehicles.filter(v => v.status === 'OPERATIONAL').length;
      const maintenanceVehicles = vehicles.filter(v => v.status === 'MAINTENANCE').length;
      const stoppedVehicles = vehicles.filter(v => v.status === 'STOPPED').length;

      // Calcular métricas dos funcionários
      const employees = employeesData.data || [];
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

      // Calcular outras métricas
      const activeOperations = operationsData.data?.length || 0;
      const pendingMaintenances = maintenancesData.data?.length || 0;
      
      const totalSales = salesData.data?.reduce((sum, sale) => sum + (sale.total_value || 0), 0) || 0;
      const woodConsumption = woodConsumptionData.data?.reduce((sum, wood) => sum + (wood.quantity || 0), 0) || 0;
      const clayConsumption = clayConsumptionData.data?.reduce((sum, clay) => sum + (clay.trucks_quantity || 0), 0) || 0;

      return {
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
          total: totalSales,
        }
      };
    },
    enabled: !!profile?.ceramic_id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}