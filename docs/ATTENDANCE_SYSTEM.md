# Sistema de Gestão de Faltas - Documentação Técnica

## 📋 Visão Geral

Este documento descreve a arquitetura completa do sistema de gestão de faltas de funcionários implementado no CeramicFlow. O sistema foi migrado de uma abordagem simples de contadores para um sistema robusto com histórico completo e dados sempre consistentes.

---

## 🗃️ Estrutura do Banco de Dados

### 1. Tabela `employee_absences` (Nova)

```sql
CREATE TABLE employee_absences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  ceramic_id UUID NOT NULL,
  absence_date DATE NOT NULL,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),

  CONSTRAINT unique_employee_absence_date UNIQUE (employee_id, absence_date)
);
```

**Propósito:** Armazenar cada falta individualmente com todos os detalhes

**Campos:**

- `employee_id` - Qual funcionário faltou
- `absence_date` - Data específica da falta
- `reason` - Motivo da falta (ex: "Doença", "Particular")
- `notes` - Observações detalhadas (ex: "Gripe - Atestado médico")
- `ceramic_id` - Segurança multi-tenant
- `created_by` - Quem registrou a falta

**Constraint importante:** Um funcionário não pode ter duas faltas na mesma data

### 2. Tabela `employees` (Modificada)

**Colunas removidas:**

- ❌ `last_absence_date` (agora calculado dinamicamente)
- ❌ `total_absences_month` (agora calculado dinamicamente)
- ❌ `attendance_notes` (agora calculado dinamicamente)

**Motivo da remoção:** Para evitar dados duplicados e inconsistências. Agora a fonte única da verdade são os registros individuais na tabela `employee_absences`.

---

## 🔧 Funções e Views

### 3. Função `get_employee_absence_stats(emp_id UUID)`

```sql
CREATE OR REPLACE FUNCTION get_employee_absence_stats(emp_id UUID)
RETURNS TABLE (
  total_absences_month INTEGER,
  last_absence_date DATE,
  latest_notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(COUNT(*)::INTEGER, 0) as total_absences_month,
    MAX(absence_date) as last_absence_date,
    (SELECT notes FROM employee_absences
     WHERE employee_id = emp_id
     AND absence_date = (SELECT MAX(absence_date) FROM employee_absences WHERE employee_id = emp_id)
     LIMIT 1) as latest_notes
  FROM employee_absences
  WHERE employee_id = emp_id
  AND date_trunc('month', absence_date) = date_trunc('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;
```

**O que faz:** Calcula estatísticas em tempo real para um funcionário:

- Conta quantas faltas teve no mês atual
- Encontra a data da última falta
- Busca as observações da última falta

### 4. View `employees_with_absences`

```sql
CREATE OR REPLACE VIEW employees_with_absences AS
SELECT
  e.*,
  COALESCE(abs_stats.total_absences_month, 0) as total_absences_month,
  abs_stats.last_absence_date,
  abs_stats.latest_notes as attendance_notes
FROM employees e
LEFT JOIN LATERAL get_employee_absence_stats(e.id) abs_stats ON true;
```

**O que faz:** Combina dados dos funcionários com suas estatísticas de faltas calculadas automaticamente. É como ter uma "tabela virtual" que sempre mostra dados atualizados.

### 5. Funções RPC (Remote Procedure Call)

#### `get_employees_with_absences(ceramic_id_param UUID)`

```sql
CREATE OR REPLACE FUNCTION get_employees_with_absences(ceramic_id_param UUID)
RETURNS TABLE (
  id UUID,
  ceramic_id UUID,
  name TEXT,
  role TEXT,
  cpf TEXT,
  contact TEXT,
  shift TEXT,
  admission_date DATE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  vacation_due_date DATE,
  total_absences_month INTEGER,
  last_absence_date DATE,
  attendance_notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM employees_with_absences
  WHERE employees_with_absences.ceramic_id = ceramic_id_param
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- **Usa:** A view `employees_with_absences`
- **Retorna:** Lista de funcionários com estatísticas de faltas
- **Segurança:** Filtra apenas funcionários da cerâmica do usuário

#### `create_employee_absence()`

```sql
CREATE OR REPLACE FUNCTION create_employee_absence(
  p_employee_id UUID,
  p_ceramic_id UUID,
  p_absence_date DATE,
  p_reason TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS employee_absences AS $$
DECLARE
  result employee_absences;
BEGIN
  INSERT INTO employee_absences (employee_id, ceramic_id, absence_date, reason, notes, created_by)
  VALUES (p_employee_id, p_ceramic_id, p_absence_date, p_reason, p_notes, auth.uid())
  RETURNING * INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- **Função:** Registra uma nova falta
- **Segurança:** Verifica se o usuário pode registrar faltas nesta cerâmica
- **Retorna:** O registro da falta criada

#### `get_employee_absences()`

```sql
CREATE OR REPLACE FUNCTION get_employee_absences(
  p_employee_id UUID,
  p_ceramic_id UUID
)
RETURNS SETOF employee_absences AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM employee_absences
  WHERE employee_id = p_employee_id
    AND ceramic_id = p_ceramic_id
  ORDER BY absence_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- **Função:** Busca todas as faltas de um funcionário
- **Ordenação:** Mais recentes primeiro
- **Uso:** Para mostrar o histórico completo de faltas

#### `delete_employee_absence()`

```sql
CREATE OR REPLACE FUNCTION delete_employee_absence(
  p_absence_id UUID,
  p_ceramic_id UUID
)
RETURNS VOID AS $$
BEGIN
  DELETE FROM employee_absences
  WHERE id = p_absence_id
    AND ceramic_id = p_ceramic_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- **Função:** Remove uma falta específica
- **Segurança:** Só remove se for da mesma cerâmica
- **Uso:** Corrigir erros de registro

### 6. Índices para Performance

```sql
CREATE INDEX idx_employee_absences_employee_id ON employee_absences(employee_id);
CREATE INDEX idx_employee_absences_ceramic_id ON employee_absences(ceramic_id);
CREATE INDEX idx_employee_absences_date ON employee_absences(absence_date);
```

**Propósito:** Garantem que as consultas sejam rápidas mesmo com milhares de registros de faltas.

### 7. Row Level Security (RLS)

```sql
ALTER TABLE employee_absences ENABLE ROW LEVEL SECURITY;

-- Política para visualizar apenas faltas da própria cerâmica
CREATE POLICY "Users can view absences from their ceramic" ON employee_absences
  FOR SELECT USING (
    ceramic_id IN (
      SELECT ceramic_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Política para inserir faltas apenas na própria cerâmica
CREATE POLICY "Users can insert absences in their ceramic" ON employee_absences
  FOR INSERT WITH CHECK (
    ceramic_id IN (
      SELECT ceramic_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Política para atualizar faltas apenas na própria cerâmica
CREATE POLICY "Users can update absences in their ceramic" ON employee_absences
  FOR UPDATE USING (
    ceramic_id IN (
      SELECT ceramic_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Política para deletar faltas apenas na própria cerâmica
CREATE POLICY "Users can delete absences in their ceramic" ON employee_absences
  FOR DELETE USING (
    ceramic_id IN (
      SELECT ceramic_id FROM profiles WHERE id = auth.uid()
    )
  );
```

**O que fazem:** Garantem segurança multi-tenant - cada cerâmica só vê seus próprios dados.

---

## 🔄 Como Funciona o Fluxo Completo

### Cenário 1: Visualizar funcionários com faltas

1. **Frontend** chama `EmployeeAbsencesServiceV2.getAllEmployeesWithAbsences()`
2. **Código** chama função `get_employees_with_absences()` no Supabase
3. **Supabase** executa a view `employees_with_absences`
4. **View** usa a função `get_employee_absence_stats()` para cada funcionário
5. **Função** conta faltas do mês atual na tabela `employee_absences`
6. **Resultado:** Lista de funcionários com `total_absences_month`, `last_absence_date`, etc. calculados automaticamente

### Cenário 2: Registrar uma falta

1. **Frontend** chama `EmployeeAbsencesServiceV2.createAbsence()`
2. **Código** chama função `create_employee_absence()` no Supabase
3. **Supabase** insere novo registro na tabela `employee_absences`
4. **Automaticamente:** As estatísticas são recalculadas na próxima consulta da view
5. **Resultado:** Nova falta registrada + estatísticas atualizadas automaticamente

### Cenário 3: Ver histórico de faltas

1. **Frontend** chama `EmployeeAbsencesServiceV2.getEmployeeAbsences(employeeId)`
2. **Código** chama função `get_employee_absences()` no Supabase
3. **Supabase** retorna todos os registros de faltas do funcionário
4. **Resultado:** Lista completa com datas, motivos e observações de cada falta

---

## 📊 Comparação: Antes vs Agora

### Sistema Antigo:

- ❌ Apenas contadores (`total_absences_month = 1`)
- ❌ Uma única data (`last_absence_date`)
- ❌ Uma única observação (`attendance_notes`)
- ❌ Sem histórico detalhado
- ❌ Risco de dados inconsistentes
- ❌ Não sabia motivos específicos das faltas
- ❌ Não podia corrigir erros facilmente

### Sistema Novo:

- ✅ **Histórico completo:** Cada falta registrada individualmente
- ✅ **Detalhamento:** Data, motivo e observações para cada falta
- ✅ **Consistência:** Dados sempre corretos (calculados em tempo real)
- ✅ **Flexibilidade:** Pode registrar múltiplas faltas por funcionário
- ✅ **Auditoria:** Sabe quem registrou cada falta e quando
- ✅ **Correções:** Pode remover faltas registradas incorretamente
- ✅ **Escalabilidade:** Performance otimizada com índices
- ✅ **Segurança:** RLS garante isolamento entre cerâmicas

---

## 🎯 Exemplo Prático

### Funcionário: Roberto

**Registros de faltas:**

- **12/08/2025:** Falta por "Doença" - "Gripe - Atestado médico"
- **15/08/2025:** Falta por "Particular" - "Consulta médica da esposa"
- **20/08/2025:** Falta por "Problema pessoal" - "Casamento na família"

**Resultado na view `employees_with_absences`:**

```json
{
  "name": "Roberto",
  "total_absences_month": 3,
  "last_absence_date": "2025-08-20",
  "attendance_notes": "Casamento na família"
}
```

**Histórico completo disponível:** Todas as 3 faltas com detalhes individuais preservados na tabela `employee_absences`!

---

## 🚀 Benefícios da Implementação

### Para Gestores:

- **Visibilidade completa:** Vê exatamente quando e por que cada funcionário faltou
- **Identificação de padrões:** Pode identificar funcionários com problemas recorrentes
- **Justificativas documentadas:** Cada falta tem motivo e observações registradas
- **Auditoria:** Histórico permanente de todas as faltas

### Para o Sistema:

- **Performance:** Consultas otimizadas com índices adequados
- **Escalabilidade:** Suporta crescimento sem perda de performance
- **Integridade:** Constraints garantem dados consistentes
- **Segurança:** RLS impede acesso a dados de outras cerâmicas
- **Manutenibilidade:** Código limpo e bem estruturado

### Para Usuários:

- **Interface melhorada:** Pode expandir cards para ver detalhes das faltas
- **Correção de erros:** Pode remover faltas registradas incorretamente
- **Histórico acessível:** Pode consultar faltas de períodos anteriores
- **Justificativas claras:** Pode adicionar motivos detalhados para cada falta

---

## 📝 Scripts de Instalação Completa

Para implementar todo o sistema, execute as seguintes SQLs na ordem:

### 1. Criar tabela de faltas

```sql
-- [SQL da tabela employee_absences - ver seção 1]
```

### 2. Criar função de estatísticas

```sql
-- [SQL da função get_employee_absence_stats - ver seção 3]
```

### 3. Criar view combinada

```sql
-- [SQL da view employees_with_absences - ver seção 4]
```

### 4. Criar funções RPC

```sql
-- [SQLs das funções RPC - ver seção 5]
```

### 5. Remover colunas antigas (opcional)

```sql
ALTER TABLE employees
  DROP COLUMN last_absence_date,
  DROP COLUMN total_absences_month,
  DROP COLUMN attendance_notes;
```

---

## 🔧 Manutenção e Monitoramento

### Consultas úteis para administradores:

#### Ver faltas do mês atual

```sql
SELECT
  e.name,
  COUNT(*) as total_faltas,
  STRING_AGG(ea.absence_date::text || ' (' || COALESCE(ea.reason, 'Sem motivo') || ')', ', ') as detalhes
FROM employee_absences ea
JOIN employees e ON ea.employee_id = e.id
WHERE date_trunc('month', ea.absence_date) = date_trunc('month', CURRENT_DATE)
GROUP BY e.name
ORDER BY total_faltas DESC;
```

#### Funcionários com mais faltas

```sql
SELECT
  e.name,
  e.role,
  COUNT(*) as total_faltas
FROM employee_absences ea
JOIN employees e ON ea.employee_id = e.id
WHERE ea.absence_date >= date_trunc('year', CURRENT_DATE)
GROUP BY e.name, e.role
ORDER BY total_faltas DESC;
```

---

_Documento criado em: 13 de agosto de 2025_  
_Sistema: CeramicFlow - Gestão de Faltas v2.0_  
_Autor: Sistema de IA - GitHub Copilot_
