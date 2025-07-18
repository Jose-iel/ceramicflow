// Preload critical components for better UX
import { lazy } from 'react';

// Preload components that are likely to be used soon
export const preloadComponents = () => {
  // Preload dialogs when user hovers over action buttons
  const preloadVehicleDialog = () => import('@/components/vehicle/VehicleDialog');
  const preloadMaintenanceDialog = () => import('@/components/maintenance/MaintenanceDialog');
  const preloadOperationDialog = () => import('@/components/operations/OperationDialog');
  const preloadEmployeeDialog = () => import('@/components/employees/EmployeeDialog');
  const preloadClayConsumptionDialog = () => import('@/components/rawmaterial/ClayConsumptionDialog');

  return {
    preloadVehicleDialog,
    preloadMaintenanceDialog,
    preloadOperationDialog,
    preloadEmployeeDialog,
    preloadClayConsumptionDialog,
  };
};

// Create lazy components with preload capability
export const createLazyComponent = (importFn: () => Promise<{ default: React.ComponentType<unknown> }>) => {
  const LazyComponent = lazy(importFn);

  // Add preload method
  (
    LazyComponent as React.LazyExoticComponent<React.ComponentType<unknown>> & {
      preload: () => Promise<{ default: React.ComponentType<unknown> }>;
    }
  ).preload = importFn;

  return LazyComponent;
};

// Pre-defined lazy components with preload
export const LazyVehicleDialog = createLazyComponent(() => import('@/components/vehicle/VehicleDialog'));
export const LazyMaintenanceDialog = createLazyComponent(() => import('@/components/maintenance/MaintenanceDialog'));
export const LazyOperationDialog = createLazyComponent(() => import('@/components/operations/OperationDialog'));
export const LazyEmployeeDialog = createLazyComponent(() => import('@/components/employees/EmployeeDialog'));
export const LazyClayConsumptionDialog = createLazyComponent(() => import('@/components/rawmaterial/ClayConsumptionDialog'));
