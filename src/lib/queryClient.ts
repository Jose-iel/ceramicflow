
import { QueryClient } from '@tanstack/react-query';

// Configuração mais agressiva para velocidade máxima
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache muito agressivo - 30 minutos
      staleTime: 30 * 60 * 1000,
      // Manter dados em cache por 1 hora
      gcTime: 60 * 60 * 1000,
      // Desabilitar refetch automático para máxima velocidade
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      // Sem retry para falhas rápidas
      retry: false,
      // Background updates apenas se necessário
      refetchInterval: false,
    },
    mutations: {
      retry: false,
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
  updateFn: (oldData: T) => T,
) => {
  queryClient.setQueryData(queryKey, updateFn);
};
