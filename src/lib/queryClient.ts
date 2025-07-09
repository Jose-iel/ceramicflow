
import { QueryClient } from '@tanstack/react-query';

// Configuração otimizada do React Query para cache agressivo
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 10 minutos (tempo longo para reduzir consultas)
      staleTime: 10 * 60 * 1000, 
      // Manter dados em cache por 15 minutos
      gcTime: 15 * 60 * 1000,
      // Refetch apenas quando necessário
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      refetchOnMount: false,
      // Retry apenas uma vez em caso de erro
      retry: 1,
      retryDelay: 1000,
    },
    mutations: {
      // Retry para mutations em caso de erro de rede
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Função para invalidar cache relacionado
export const invalidateRelatedQueries = (queryClient: QueryClient, keys: string[]) => {
  keys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: [key] });
  });
};

// Função para atualizar cache otimista
export const updateCacheOptimistically = <T>(
  queryClient: QueryClient,
  queryKey: string[],
  updateFn: (oldData: T) => T
) => {
  queryClient.setQueryData(queryKey, updateFn);
};
