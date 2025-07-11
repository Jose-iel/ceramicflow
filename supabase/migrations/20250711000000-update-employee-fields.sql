-- Migração para atualizar campos da tabela employees
-- Renomear colunas para os novos nomes solicitados

-- Renomear registration_date para admission_date
ALTER TABLE public.employees 
RENAME COLUMN registration_date TO admission_date;

-- Remover colunas antigas ASO e NR
ALTER TABLE public.employees 
DROP COLUMN IF EXISTS aso_expiration_date,
DROP COLUMN IF EXISTS nr_expiration_date;

-- Adicionar nova coluna vacation_due_date
ALTER TABLE public.employees 
ADD COLUMN vacation_due_date DATE;
