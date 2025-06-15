
-- Remove a política antiga que era muito restritiva para visualização
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Cria uma nova política que permite que usuários vejam seu próprio perfil OU que administradores vejam todos os perfis
CREATE POLICY "Users can view own or all profiles" ON public.profiles
FOR SELECT USING (
  auth.uid() = id OR public.is_admin(auth.uid())
);

-- Remove a política de atualização antiga
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Cria uma nova política de atualização que permite que usuários atualizem seu próprio perfil OU que administradores atualizem todos os perfis
CREATE POLICY "Users can update own or all profiles" ON public.profiles
FOR UPDATE USING (
  auth.uid() = id OR public.is_admin(auth.uid())
);
