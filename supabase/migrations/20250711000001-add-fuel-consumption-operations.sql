-- Migração para adicionar campo de consumo de combustível na tabela operations

-- Adicionar nova coluna fuel_consumption
ALTER TABLE public.operations 
ADD COLUMN fuel_consumption DECIMAL(10,2);
