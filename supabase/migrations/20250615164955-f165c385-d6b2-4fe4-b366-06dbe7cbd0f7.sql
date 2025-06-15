
-- Criar tabela de cerâmicas
CREATE TABLE public.ceramics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar enum para níveis de usuário
CREATE TYPE public.user_level AS ENUM (
  'ADMIN',
  'MANAGER', 
  'SUPERVISOR',
  'OPERATOR',
  'VIEWER'
);

-- Atualizar tabela profiles para incluir ceramic_id e user_level
ALTER TABLE public.profiles 
ADD COLUMN ceramic_id UUID REFERENCES public.ceramics(id),
ADD COLUMN user_level public.user_level DEFAULT 'VIEWER',
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;

-- Criar tabela de rotas disponíveis
CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir rotas padrão do sistema
INSERT INTO public.routes (path, name, description) VALUES
('dashboard', 'Dashboard', 'Página inicial com visão geral'),
('vehicles', 'Veículos', 'Gerenciamento de veículos'),
('employees', 'Funcionários', 'Gerenciamento de funcionários'),
('operations', 'Operações', 'Controle de operações'),
('maintenance', 'Manutenção', 'Manutenção de equipamentos'),
('wood', 'Lenha', 'Controle de lenha'),
('raw-material', 'Matéria Prima', 'Controle de matéria prima'),
('reports', 'Relatórios', 'Relatórios do sistema'),
('admin-backoffice', 'Admin Backoffice', 'Painel administrativo');

-- Criar tabela de permissões por nível de usuário
CREATE TABLE public.user_level_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_level public.user_level NOT NULL,
  route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_level, route_id)
);

-- Inserir permissões padrão por nível
-- ADMIN: acesso total
INSERT INTO public.user_level_permissions (user_level, route_id)
SELECT 'ADMIN', id FROM public.routes;

-- MANAGER: acesso a tudo exceto admin-backoffice
INSERT INTO public.user_level_permissions (user_level, route_id)
SELECT 'MANAGER', id FROM public.routes WHERE path != 'admin-backoffice';

-- SUPERVISOR: acesso a operações e relatórios
INSERT INTO public.user_level_permissions (user_level, route_id)
SELECT 'SUPERVISOR', id FROM public.routes 
WHERE path IN ('dashboard', 'vehicles', 'employees', 'operations', 'reports');

-- OPERATOR: acesso básico a operações
INSERT INTO public.user_level_permissions (user_level, route_id)
SELECT 'OPERATOR', id FROM public.routes 
WHERE path IN ('dashboard', 'operations');

-- VIEWER: apenas dashboard
INSERT INTO public.user_level_permissions (user_level, route_id)
SELECT 'VIEWER', id FROM public.routes WHERE path = 'dashboard';

-- Criar tabela de veículos
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ceramic_id UUID REFERENCES public.ceramics(id) ON DELETE CASCADE NOT NULL,
  model TEXT NOT NULL,
  type TEXT NOT NULL,
  acquisition_date DATE,
  last_maintenance DATE,
  status TEXT NOT NULL DEFAULT 'OPERATIONAL',
  hour_meter INTEGER DEFAULT 0,
  capacity TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de funcionários
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ceramic_id UUID REFERENCES public.ceramics(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  cpf TEXT,
  contact TEXT,
  shift TEXT,
  registration_date DATE DEFAULT CURRENT_DATE,
  aso_expiration_date DATE,
  nr_expiration_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de operações
CREATE TABLE public.operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ceramic_id UUID REFERENCES public.ceramics(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  location TEXT,
  operator TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
  employee_id UUID REFERENCES public.employees(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  operation_type TEXT DEFAULT 'manual',
  description TEXT,
  initial_hour_meter INTEGER,
  current_hour_meter INTEGER,
  start_time TIME,
  end_time TIME,
  gas_consumption DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de manutenções
CREATE TABLE public.maintenances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ceramic_id UUID REFERENCES public.ceramics(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  issue TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  reported_date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'WAITING',
  completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de consumo de lenha
CREATE TABLE public.wood_consumptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ceramic_id UUID REFERENCES public.ceramics(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  quantity DECIMAL(10,2) NOT NULL,
  oven TEXT,
  responsible TEXT,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de compras de lenha
CREATE TABLE public.wood_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ceramic_id UUID REFERENCES public.ceramics(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  supplier TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_value DECIMAL(10,2) NOT NULL,
  invoice_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de consumo de barro
CREATE TABLE public.clay_consumptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ceramic_id UUID REFERENCES public.ceramics(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  trucks_quantity INTEGER NOT NULL,
  supplier TEXT,
  origin TEXT,
  truck_id TEXT,
  recorded_by TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de abastecimento de combustível
CREATE TABLE public.gas_supplies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ceramic_id UUID REFERENCES public.ceramics(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_value DECIMAL(10,2) NOT NULL,
  supplier TEXT,
  recorded_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.ceramics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_level_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wood_consumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wood_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clay_consumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gas_supplies ENABLE ROW LEVEL SECURITY;

-- Políticas para ceramics (apenas admins podem ver todas)
CREATE POLICY "Users can view ceramics" ON public.ceramics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    OR id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage ceramics" ON public.ceramics
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Políticas para routes (todos podem ver)
CREATE POLICY "Anyone can view routes" ON public.routes FOR SELECT USING (true);

-- Políticas para user_level_permissions (todos podem ver)
CREATE POLICY "Anyone can view permissions" ON public.user_level_permissions FOR SELECT USING (true);

-- Políticas para dados atrelados à cerâmica (usuários só veem dados da sua cerâmica)
CREATE POLICY "Users can view ceramic vehicles" ON public.vehicles
  FOR SELECT USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage ceramic vehicles" ON public.vehicles
  FOR ALL USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can view ceramic employees" ON public.employees
  FOR SELECT USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage ceramic employees" ON public.employees
  FOR ALL USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can view ceramic operations" ON public.operations
  FOR SELECT USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage ceramic operations" ON public.operations
  FOR ALL USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can view ceramic maintenances" ON public.maintenances
  FOR SELECT USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage ceramic maintenances" ON public.maintenances
  FOR ALL USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can view ceramic wood consumptions" ON public.wood_consumptions
  FOR SELECT USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage ceramic wood consumptions" ON public.wood_consumptions
  FOR ALL USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can view ceramic wood purchases" ON public.wood_purchases
  FOR SELECT USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage ceramic wood purchases" ON public.wood_purchases
  FOR ALL USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can view ceramic clay consumptions" ON public.clay_consumptions
  FOR SELECT USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage ceramic clay consumptions" ON public.clay_consumptions
  FOR ALL USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can view ceramic gas supplies" ON public.gas_supplies
  FOR SELECT USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage ceramic gas supplies" ON public.gas_supplies
  FOR ALL USING (
    ceramic_id = (SELECT ceramic_id FROM public.profiles WHERE id = auth.uid())
  );

-- Função para verificar permissão de rota
CREATE OR REPLACE FUNCTION public.user_has_route_permission(user_id UUID, route_path TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_level_val public.user_level;
  route_id_val UUID;
BEGIN
  -- Buscar o nível do usuário
  SELECT user_level INTO user_level_val
  FROM public.profiles 
  WHERE id = user_id;
  
  -- Se não encontrou o usuário, retorna false
  IF user_level_val IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Buscar o ID da rota
  SELECT id INTO route_id_val
  FROM public.routes 
  WHERE path = route_path;
  
  -- Se não encontrou a rota, retorna false
  IF route_id_val IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se o usuário tem permissão para esta rota
  RETURN EXISTS (
    SELECT 1 FROM public.user_level_permissions 
    WHERE user_level = user_level_val AND route_id = route_id_val
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar função handle_new_user para incluir ceramic_id se fornecido
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, ceramic_id, user_level)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'ceramic_id')::UUID, NULL),
    COALESCE((NEW.raw_user_meta_data->>'user_level')::public.user_level, 'VIEWER')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
