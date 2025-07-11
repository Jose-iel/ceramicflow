import { Plugin } from 'vite';

// Plugin personalizado para otimização extrema de bundle
export function bundleOptimizationPlugin(): Plugin {
  return {
    name: 'bundle-optimization',
    generateBundle(options, bundle) {
      // Remove chunks muito pequenos que podem ser inlined
      Object.keys(bundle).forEach(fileName => {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.code && chunk.code.length < 1000) {
          // Se o chunk é muito pequeno, considera inline
          console.log(`Small chunk detected: ${fileName} (${chunk.code.length} bytes)`);
        }
      });
    },
    resolveId(id) {
      // Redirecionar imports específicos para versões otimizadas
      if (id.includes('lucide-react') && !id.includes('/dist/esm/icons/')) {
        // Evitar import do lucide-react completo
        return null;
      }
      return null;
    },
    transform(code, id) {
      // Não fazer transformações que possam quebrar desenvolvimento
      return null;
    }
  };
}

// Configuração de dependências externas para reduzir bundle
export const externalDeps = [
  // Não externalizar nada para manter tudo auto-contido
];

// Configuração de otimização de dependências
export const optimizeDepsConfig = {
  include: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    '@radix-ui/react-use-layout-effect',
    // Forçar pré-bundling de pacotes Radix UI críticos
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-toast',
    '@radix-ui/react-select',
    '@radix-ui/react-tabs',
  ],
  exclude: [],
  // Configurações mínimas para ESBuild
  esbuildOptions: {
    target: 'es2020',
  },
};

// Configuração manual de chunks mais granular
export const createManualChunks = (id: string): string | undefined => {
  // Core do React - manter junto
  if (id.includes('react') && !id.includes('react-router') && !id.includes('react-query') && !id.includes('react-dom')) {
    return 'react-core';
  }
  
  if (id.includes('react-dom')) {
    return 'react-dom';
  }
  
  // Supabase - chunk grande mas necessário
  if (id.includes('@supabase') || id.includes('supabase')) {
    return 'supabase';
  }
  
  // Query - essencial para funcionalidade
  if (id.includes('@tanstack/react-query') || id.includes('@tanstack/query-core')) {
    return 'query';
  }
  
  // Router - carregar sob demanda
  if (id.includes('react-router')) {
    return 'router';
  }
  
  // UI pequeno - Radix UI leve
  if (id.includes('@radix-ui/react-slot') || id.includes('@radix-ui/react-portal') || id.includes('@radix-ui/react-primitive')) {
    return 'ui-core';
  }
  
  // UI médio - componentes básicos
  if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-select') || id.includes('@radix-ui/react-tabs')) {
    return 'ui-dialogs';
  }
  
  // UI restante
  if (id.includes('@radix-ui')) {
    return 'ui-components';
  }
  
  // Ícones - separar completamente
  if (id.includes('lucide-react')) {
    return 'icons';
  }
  
  // Date utilities
  if (id.includes('date-fns')) {
    return 'date-utils';
  }
  
  // Styling e temas
  if (id.includes('next-themes') || id.includes('tailwind-merge') || id.includes('clsx') || id.includes('class-variance-authority')) {
    return 'styling';
  }
  
  // Forms
  if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
    return 'forms';
  }
  
  // Charts (apenas se usado)
  if (id.includes('recharts')) {
    return 'charts';
  }
  
  // Features - lazy load por página
  if (id.includes('src/pages/LandingPage') || id.includes('src/pages/Login') || id.includes('src/components/auth')) {
    return 'page-auth';
  }
  
  if (id.includes('src/pages/Index') || id.includes('src/components/dashboard')) {
    return 'page-dashboard';
  }
  
  if (id.includes('src/pages/Employees') || id.includes('src/components/employees')) {
    return 'page-employees';
  }
  
  if (id.includes('src/pages/Vehicles') || id.includes('src/components/vehicle')) {
    return 'page-vehicles';
  }
  
  if (id.includes('src/pages/Operations') || id.includes('src/components/operations')) {
    return 'page-operations';
  }
  
  if (id.includes('src/pages/Maintenance') || id.includes('src/components/maintenance')) {
    return 'page-maintenance';
  }
  
  if (id.includes('src/pages/RawMaterial') || id.includes('src/components/rawmaterial')) {
    return 'page-raw-materials';
  }
  
  if (id.includes('src/pages/Sales') || id.includes('src/components/sales')) {
    return 'page-sales';
  }
  
  if (id.includes('src/pages/Wood') || id.includes('src/components/wood')) {
    return 'page-wood';
  }
  
  if (id.includes('src/pages/Reports')) {
    return 'page-reports';
  }
  
  if (id.includes('src/pages/AdminBackoffice') || id.includes('src/components/backoffice')) {
    return 'page-admin';
  }
  
  // APIs - agrupar por feature
  if (id.includes('src/integrations/supabase/api') || id.includes('src/integrations/supabase/hooks')) {
    if (id.includes('employees')) return 'api-employees';
    if (id.includes('vehicles')) return 'api-vehicles';
    if (id.includes('operations')) return 'api-operations';
    if (id.includes('maintenance')) return 'api-maintenance';
    if (id.includes('clay') || id.includes('raw')) return 'api-raw-materials';
    if (id.includes('sales')) return 'api-sales';
    if (id.includes('wood')) return 'api-wood';
    return 'api-common';
  }
  
  // Utilitários pequenos
  if (id.includes('js-cookie') || id.includes('sonner') || id.includes('vaul')) {
    return 'utils-small';
  }
  
  // Outras bibliotecas node_modules
  if (id.includes('node_modules')) {
    return 'vendor-misc';
  }
  
  return undefined;
};
