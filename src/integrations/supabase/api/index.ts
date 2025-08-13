// Centralized API exports
export * from './auth';
export * from './backoffice';
export * from './user-levels';
export * from './sales';
export * from './wood';
export * from './employees';
export * from './employee-absences';
export * from './vehicles';
export * from './operations';
export * from './maintenances';
export * from './clay-consumptions';
export * from './dashboard';

// Re-export client for direct access when needed
export { supabase } from '../client';
export type { Database } from '../types';
