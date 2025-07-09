-- Primeiro, vamos verificar se RLS está habilitado
ALTER TABLE public.user_level_permissions ENABLE ROW LEVEL SECURITY;

-- Criar políticas para administradores poderem gerenciar permissões de níveis
CREATE POLICY "Admins can manage user level permissions" 
ON public.user_level_permissions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Política para permitir que usuários autenticados leiam as permissões (necessário para verificação de acesso)
CREATE POLICY "Authenticated users can view user level permissions" 
ON public.user_level_permissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);