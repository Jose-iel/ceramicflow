
-- 1. Cria a nova tabela para armazenar os níveis de usuário de forma dinâmica
CREATE TABLE public.user_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
COMMENT ON TABLE public.user_levels IS 'Armazena os níveis de acesso de usuário de forma dinâmica.';

-- 2. Adiciona políticas de segurança de nível de linha (RLS) para a nova tabela
ALTER TABLE public.user_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir que usuários autenticados leiam os níveis" ON public.user_levels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir que administradores gerenciem os níveis" ON public.user_levels FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
);

-- 3. Popula a nova tabela com os valores do antigo tipo 'user_level'
-- Isso garante que os níveis existentes sejam mantidos
INSERT INTO public.user_levels (name, description)
VALUES
  ('ADMIN', 'Administrador com acesso total'),
  ('MANAGER', 'Gerente com acesso a quase todos os recursos'),
  ('SUPERVISOR', 'Supervisor com acesso a recursos operacionais e de relatórios'),
  ('OPERATOR', 'Operador com acesso básico a operações'),
  ('VIEWER', 'Visualizador com acesso apenas ao dashboard')
ON CONFLICT (name) DO NOTHING;

-- 4. Altera a tabela 'user_level_permissions' para usar a nova tabela de níveis
ALTER TABLE public.user_level_permissions ADD COLUMN user_level_id UUID;
UPDATE public.user_level_permissions p
SET user_level_id = (SELECT id FROM public.user_levels ul WHERE ul.name = p.user_level::text);
ALTER TABLE public.user_level_permissions DROP COLUMN user_level;
ALTER TABLE public.user_level_permissions
  ADD CONSTRAINT fk_user_level_id FOREIGN KEY (user_level_id) REFERENCES public.user_levels(id) ON DELETE CASCADE,
  ALTER COLUMN user_level_id SET NOT NULL;
ALTER TABLE public.user_level_permissions DROP CONSTRAINT IF EXISTS user_level_permissions_user_level_route_id_key;
ALTER TABLE public.user_level_permissions ADD CONSTRAINT user_level_permissions_user_level_id_route_id_key UNIQUE (user_level_id, route_id);

-- 5. Altera a tabela 'profiles' para usar a nova tabela de níveis
ALTER TABLE public.profiles ADD COLUMN user_level_id UUID;
UPDATE public.profiles p
SET user_level_id = (SELECT id FROM public.user_levels ul WHERE ul.name = p.user_level::text);
ALTER TABLE public.profiles DROP COLUMN user_level;
ALTER TABLE public.profiles ADD CONSTRAINT fk_user_level_id FOREIGN KEY (user_level_id) REFERENCES public.user_levels(id);

-- 6. Atualiza as funções do banco de dados que dependiam do tipo 'user_level'
CREATE OR REPLACE FUNCTION public.user_has_route_permission(user_id UUID, route_path TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_level_id UUID;
  v_route_id UUID;
  v_is_admin BOOLEAN;
BEGIN
  SELECT is_admin, user_level_id INTO v_is_admin, v_level_id
  FROM public.profiles 
  WHERE id = user_id;
  
  IF v_is_admin THEN
    RETURN TRUE;
  END IF;

  IF v_level_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  SELECT id INTO v_route_id
  FROM public.routes 
  WHERE path = route_path;
  
  IF v_route_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM public.user_level_permissions 
    WHERE user_level_id = v_level_id AND route_id = v_route_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  viewer_level_id UUID;
  new_user_level_id UUID;
BEGIN
  SELECT id INTO viewer_level_id FROM public.user_levels WHERE name = 'VIEWER';
  
  IF NEW.raw_user_meta_data->>'user_level' IS NOT NULL THEN
     SELECT id INTO new_user_level_id FROM public.user_levels WHERE name = NEW.raw_user_meta_data->>'user_level';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, ceramic_id, user_level_id)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    (NEW.raw_user_meta_data->>'ceramic_id')::UUID,
    COALESCE(new_user_level_id, viewer_level_id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Remove o antigo tipo 'user_level' que não é mais necessário
DROP TYPE public.user_level;
