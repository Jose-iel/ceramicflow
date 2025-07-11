import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface UseEntityMutationOptions<TData, TError, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKeyToInvalidate: string[];
  successMessage: string;
  errorMessage: string;
  onMutate?: (variables: TVariables) => Promise<unknown> | unknown;
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => Promise<unknown> | unknown;
  onError?: (error: TError, variables: TVariables, context: unknown) => Promise<unknown> | unknown;
}

export function useEntityMutation<
  TData = unknown,
  TError extends Error = Error,
  TVariables = void,
>({
  mutationFn,
  queryKeyToInvalidate,
  successMessage,
  errorMessage,
  onMutate,
  onSuccess,
  onError,
}: UseEntityMutationOptions<TData, TError, TVariables>) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<TData, TError, TVariables>({
    mutationFn,
    onMutate,
    onSuccess: (data, variables, context) => {
      toast({
        title: 'Sucesso',
        description: successMessage,
      });
      
      // Invalida a query do dashboard e outras queries relacionadas
      queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.error(errorMessage, error);
      toast({
        title: 'Erro',
        description: `${errorMessage}: ${error.message}`,
        variant: 'destructive',
      });
      if (onError) {
        onError(error, variables, context);
      }
    },
  });
}
