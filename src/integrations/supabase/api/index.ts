// Centralized API exports
export * from './auth';
export * from './backoffice';
export * from './user-levels';

// Re-export client for direct access when needed
export { supabase } from '../client';
export type { Database } from '../types';