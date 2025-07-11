import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserLevelsService } from '../api/user-levels';
import type { CreateUserLevelPayload, UpdateUserLevelPayload } from '../api/user-levels';
import { useToast } from '@/hooks/use-toast';

export function useUserLevels() {
  return useQuery({
    queryKey: ['userLevels'],
    queryFn: UserLevelsService.getAllUserLevels,
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 90 * 60 * 1000, // 1.5 horas
  });
}

export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: UserLevelsService.getAllRoutes,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
    gcTime: 25 * 60 * 60 * 1000, // 25 horas
  });
}

export function useUserLevelPermissions(levelId: string) {
  return useQuery({
    queryKey: ['userLevelPermissions', levelId],
    queryFn: () => UserLevelsService.getUserLevelPermissions(levelId),
    enabled: !!levelId,
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 20 * 60 * 1000, // 20 minutos
  });
}

export function useCreateUserLevel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateUserLevelPayload) => UserLevelsService.createUserLevel(payload),
    onSuccess: () => {
      toast({ title: "Nível criado", description: "Operação realizada com sucesso." });
      queryClient.invalidateQueries({ queryKey: ['userLevels'] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao criar nível", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateUserLevel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ levelId, payload }: { levelId: string; payload: UpdateUserLevelPayload }) => 
      UserLevelsService.updateUserLevel(levelId, payload),
    onSuccess: () => {
      toast({ title: "Nível atualizado", description: "Operação realizada com sucesso." });
      queryClient.invalidateQueries({ queryKey: ['userLevels'] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao atualizar nível", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteUserLevel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (levelId: string) => UserLevelsService.deleteUserLevel(levelId),
    onSuccess: () => {
      toast({ title: "Nível excluído com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['userLevels'] });
    },
    onError: (error: Error) => {
      if (error.message !== 'Exclusão cancelada') {
        toast({ title: "Erro ao excluir nível", description: error.message, variant: "destructive" });
      }
    },
  });
}