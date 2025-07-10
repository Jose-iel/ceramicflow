// Centralized hooks export - simplified architecture
// All hooks should be imported from this single file

// Core hooks
export { useAuthOptimized as useAuth } from '@/integrations/supabase/hooks/use-auth';
export { useToast } from './use-toast';
export { useIsMobile as useMobile } from './use-mobile';

// Filter hooks
export { useMonthFilter } from './useMonthFilter';

// Entity hooks - optimized versions only
export { 
  useEmployeesOptimized as useEmployees,
  useCreateEmployeeOptimized as useCreateEmployee,
  useUpdateEmployeeOptimized as useUpdateEmployee,
  useDeleteEmployeeOptimized as useDeleteEmployee
} from '@/integrations/supabase/hooks/use-employees-optimized';

export { 
  useVehiclesOptimized as useVehicles,
  useCreateVehicleOptimized as useCreateVehicle,
  useUpdateVehicleOptimized as useUpdateVehicle,
  useDeleteVehicleOptimized as useDeleteVehicle
} from '@/integrations/supabase/hooks/use-vehicles-optimized';

export { 
  useOperationsOptimized as useOperations,
  useCreateOperationOptimized as useCreateOperation,
  useUpdateOperationOptimized as useUpdateOperation,
  useDeleteOperationOptimized as useDeleteOperation
} from '@/integrations/supabase/hooks/use-operations-optimized';

export { 
  useMaintenancesOptimized as useMaintenances,
  useCreateMaintenanceOptimized as useCreateMaintenance,
  useUpdateMaintenanceOptimized as useUpdateMaintenance,
  useDeleteMaintenanceOptimized as useDeleteMaintenance
} from '@/integrations/supabase/hooks/use-maintenances-optimized';

export { 
  useClayConsumptionsOptimized as useClayConsumptions,
  useCreateClayConsumptionOptimized as useCreateClayConsumption,
  useUpdateClayConsumptionOptimized as useUpdateClayConsumption,
  useDeleteClayConsumptionOptimized as useDeleteClayConsumption
} from '@/integrations/supabase/hooks/use-clay-consumptions-optimized';

export { 
  useSalesOptimized as useSales,
  useCreateSaleOptimized as useCreateSale,
  useUpdateSaleOptimized as useUpdateSale,
  useDeleteSaleOptimized as useDeleteSale
} from '@/integrations/supabase/hooks/use-sales-optimized';

export { 
  useWoodPurchasesOptimized as useWoodPurchases,
  useWoodConsumptionsOptimized as useWoodConsumptions,
  useCreateWoodPurchaseOptimized as useCreateWoodPurchase,
  useCreateWoodConsumptionOptimized as useCreateWoodConsumption,
  useUpdateWoodPurchaseOptimized as useUpdateWoodPurchase,
  useUpdateWoodConsumptionOptimized as useUpdateWoodConsumption,
  useDeleteWoodPurchaseOptimized as useDeleteWoodPurchase,
  useDeleteWoodConsumptionOptimized as useDeleteWoodConsumption
} from '@/integrations/supabase/hooks/use-wood-optimized';
