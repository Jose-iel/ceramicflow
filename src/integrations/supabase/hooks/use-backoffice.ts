import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { BackofficeService } from '../api/backoffice';
import type { CreateUserPayload, UpdateUserPayload, CreateCeramicPayload, UpdateCeramicPayload } from '../api/backoffice';

import { useToast } from '@/hooks/use-toast';

// Users Tab Hooks
export function useUsersTabData() {
  return useQuery({
    queryKey: ['usersTabData'],
    queryFn: BackofficeService.getUsersTabData,
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 90 * 60 * 1000, // 1.5 horas
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userData: CreateUserPayload) => BackofficeService.createUser(userData),
    onSuccess: () => {
      toast({ title: 'Usuário criado', description: 'Operação realizada com sucesso.' });
      queryClient.invalidateQueries({ queryKey: ['usersTabData'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar usuário', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: UpdateUserPayload }) =>
      BackofficeService.updateUser(userId, userData),
    onSuccess: () => {
      toast({ title: 'Usuário atualizado', description: 'Operação realizada com sucesso.' });
      queryClient.invalidateQueries({ queryKey: ['usersTabData'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar usuário', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userId: string) => BackofficeService.deleteUser(userId),
    onSuccess: () => {
      toast({ title: 'Usuário excluído com sucesso' });
      queryClient.invalidateQueries({ queryKey: ['usersTabData'] });
    },
    onError: (error: Error) => {
      if (error.message !== 'Exclusão cancelada') {
        toast({ title: 'Erro ao excluir usuário', description: error.message, variant: 'destructive' });
      }
    },
  });
}

// Ceramics Tab Hooks
export function useCeramicsData() {
  return useQuery({
    queryKey: ['ceramics'],
    queryFn: BackofficeService.getCeramicsData,
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 90 * 60 * 1000, // 1.5 horas
  });
}

export function useCreateCeramic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (ceramicData: CreateCeramicPayload) => BackofficeService.createCeramic(ceramicData),
    onSuccess: () => {
      toast({ title: 'Cerâmica criada', description: 'Operação realizada com sucesso.' });
      queryClient.invalidateQueries({ queryKey: ['ceramics'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar cerâmica', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateCeramic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ ceramicId, ceramicData }: { ceramicId: string; ceramicData: UpdateCeramicPayload }) =>
      BackofficeService.updateCeramic(ceramicId, ceramicData),
    onSuccess: () => {
      toast({ title: 'Cerâmica atualizada', description: 'Operação realizada com sucesso.' });
      queryClient.invalidateQueries({ queryKey: ['ceramics'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar cerâmica', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteCeramic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (ceramicId: string) => BackofficeService.deleteCeramic(ceramicId),
    onSuccess: () => {
      toast({ title: 'Cerâmica excluída com sucesso' });
      queryClient.invalidateQueries({ queryKey: ['ceramics'] });
    },
    onError: (error: Error) => {
      if (error.message !== 'Exclusão cancelada') {
        toast({ title: 'Erro ao excluir cerâmica', description: error.message, variant: 'destructive' });
      }
    },
  });
}
