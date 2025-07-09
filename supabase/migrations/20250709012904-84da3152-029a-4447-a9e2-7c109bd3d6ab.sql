-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar tabela de vendas
CREATE TABLE public.sales (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ceramic_id uuid NOT NULL,
  sale_date date NOT NULL DEFAULT CURRENT_DATE,
  customer_name text NOT NULL,
  customer_contact text,
  brick_quantity integer NOT NULL,
  price_per_thousand numeric NOT NULL,
  total_value numeric NOT NULL,
  notes text,
  recorded_by text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Users can manage ceramic sales" 
ON public.sales 
FOR ALL 
USING (ceramic_id = (
  SELECT profiles.ceramic_id 
  FROM profiles 
  WHERE profiles.id = auth.uid()
));

CREATE POLICY "Users can view ceramic sales" 
ON public.sales 
FOR SELECT 
USING (ceramic_id = (
  SELECT profiles.ceramic_id 
  FROM profiles 
  WHERE profiles.id = auth.uid()
));

-- Adicionar foreign key
ALTER TABLE public.sales 
ADD CONSTRAINT sales_ceramic_id_fkey 
FOREIGN KEY (ceramic_id) REFERENCES public.ceramics(id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_sales_updated_at
BEFORE UPDATE ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();