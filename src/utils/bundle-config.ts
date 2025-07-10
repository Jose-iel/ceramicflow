// Bundle optimization configuration
// This file helps with manual tree shaking and optimization

// Only import what we need from large libraries
export const optimizedImports = {
  // Date-fns - only import needed functions
  dateFns: {
    format: () => import('date-fns/format'),
    parse: () => import('date-fns/parse'),
    isValid: () => import('date-fns/isValid'),
    startOfMonth: () => import('date-fns/startOfMonth'),
    endOfMonth: () => import('date-fns/endOfMonth'),
  },
  
  // Lucide icons - only import used icons
  lucideIcons: {
    Plus: () => import('lucide-react/dist/esm/icons/plus'),
    Edit: () => import('lucide-react/dist/esm/icons/edit'),
    Trash2: () => import('lucide-react/dist/esm/icons/trash-2'),
    Search: () => import('lucide-react/dist/esm/icons/search'),
    Filter: () => import('lucide-react/dist/esm/icons/filter'),
    Calendar: () => import('lucide-react/dist/esm/icons/calendar'),
    User: () => import('lucide-react/dist/esm/icons/user'),
    Car: () => import('lucide-react/dist/esm/icons/car'),
    Truck: () => import('lucide-react/dist/esm/icons/truck'),
    Settings: () => import('lucide-react/dist/esm/icons/settings'),
    Wrench: () => import('lucide-react/dist/esm/icons/wrench'),
    AlertTriangle: () => import('lucide-react/dist/esm/icons/alert-triangle'),
  },
};

// Code splitting patterns
export const chunkingStrategy = {
  // Vendor chunks
  vendors: [
    'react',
    'react-dom',
    '@tanstack/react-query',
    '@supabase/supabase-js',
    'react-router-dom',
  ],
  
  // Feature chunks
  features: [
    'dashboard',
    'employees',
    'vehicles',
    'operations',
    'maintenance',
    'raw-materials',
    'sales',
    'wood',
    'admin',
    'auth',
  ],
  
  // UI chunks
  ui: [
    '@radix-ui',
    'lucide-react',
    'next-themes',
  ],
};

// Bundle size targets (in KB)
export const bundleTargets = {
  vendor: 200,
  feature: 100,
  ui: 150,
  main: 50,
  total: 500,
};
