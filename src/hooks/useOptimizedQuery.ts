import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

// Hook personalizado para consultas otimizadas
export function useOptimizedQuery<TData, TError = Error>(
  options: UseQueryOptions<TData, TError> & {
    queryKey: (string | number | boolean)[];
    queryFn: () => Promise<TData>;
  },
) {
  return useQuery({
    ...options,
    // Cache mais agressivo por padrão
    staleTime: options.staleTime ?? 10 * 60 * 1000, // 10 minutos
    gcTime: options.gcTime ?? 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: 'always',
    // Ativar refetch automático apenas se especificado
    refetchInterval: options.refetchInterval ?? false,
  });
}

// Hook para consultas que devem ser atualizadas com frequência
export function useRealTimeQuery<TData, TError = Error>(
  options: UseQueryOptions<TData, TError> & {
    queryKey: (string | number | boolean)[];
    queryFn: () => Promise<TData>;
  },
) {
  return useQuery({
    ...options,
    // Cache menor para dados em tempo real
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 60 * 1000, // Refetch a cada minuto
  });
}
