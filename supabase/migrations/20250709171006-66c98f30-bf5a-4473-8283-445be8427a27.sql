
-- Atualizar a rota admin no banco de dados para padronizar
UPDATE routes 
SET id = 'admin', path = '/admin' 
WHERE path = '/admin-backoffice' OR id = 'admin-backoffice';

-- Se a rota não existir, criar ela
INSERT INTO routes (id, path, name, description) 
VALUES ('admin', '/admin', 'Administração', 'Painel administrativo do sistema')
ON CONFLICT (id) DO UPDATE SET
  path = EXCLUDED.path,
  name = EXCLUDED.name,
  description = EXCLUDED.description;
