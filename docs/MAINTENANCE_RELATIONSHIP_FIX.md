# Correção do Relacionamento de Manutenções com Veículos

## 🐛 **Problema Identificado**

O erro `A propriedade 'vehicles' não existe no tipo` estava ocorrendo na página de Manutenções porque:

1. A query SQL não estava fazendo o JOIN com a tabela de veículos
2. O tipo `Maintenance` não incluía o relacionamento com veículos
3. A página estava usando tipos duplicados e hooks não centralizados

## 🔧 **Soluções Implementadas**

### **1. Atualização da Query SQL**

**Arquivo:** `src/integrations/supabase/api/maintenances.ts`

**Antes:**

```typescript
const { data, error } = await supabase
  .from("maintenances")
  .select("*")
  .eq("ceramic_id", ceramicId)
  .order("created_at", { ascending: false });
```

**Depois:**

```typescript
const { data, error } = await supabase
  .from("maintenances")
  .select(
    `
    *,
    vehicles (
      id,
      model,
      type
    )
  `
  )
  .eq("ceramic_id", ceramicId)
  .order("created_at", { ascending: false });
```

### **2. Atualização do Tipo Maintenance**

**Antes:**

```typescript
export interface Maintenance {
  id: string;
  ceramic_id: string;
  vehicle_id: string;
  issue: string;
  reported_by: string;
  reported_date?: string;
  status: string;
  completed_date?: string;
  created_at: string;
  updated_at: string;
}
```

**Depois:**

```typescript
export interface Maintenance {
  id: string;
  ceramic_id: string;
  vehicle_id: string;
  issue: string;
  reported_by: string;
  reported_date?: string;
  status: string;
  completed_date?: string;
  created_at: string;
  updated_at: string;
  vehicles?: {
    id: string;
    model: string;
    type: string;
  } | null;
}
```

### **3. Migração para Hooks Centralizados**

**Arquivo:** `src/pages/Maintenance.tsx`

**Antes:**

```typescript
import {
  useMaintenancesOptimized,
  useCreateMaintenanceOptimized,
  useUpdateMaintenanceOptimized,
  useDeleteMaintenanceOptimized,
} from "@/integrations/supabase/hooks";
import { useVehiclesOptimized } from "@/integrations/supabase/hooks";
```

**Depois:**

```typescript
import {
  useMaintenances,
  useCreateMaintenance,
  useUpdateMaintenance,
  useDeleteMaintenance,
  useVehicles,
} from "@/hooks";
```

### **4. Simplificação de Tipos**

**Removidos tipos duplicados:**

- `MaintenanceRawData`
- `MaintenanceDbData`

**Agora usa apenas:**

- `Maintenance` (da API)
- `CreateMaintenancePayload` (da API)

## ✅ **Resultado**

- ✅ **Relacionamento funcionando:** A propriedade `vehicles` agora está disponível
- ✅ **Tipos consistentes:** Usando apenas os tipos da API
- ✅ **Hooks centralizados:** Imports simplificados
- ✅ **Build successful:** Sem erros de TypeScript
- ✅ **Performance mantida:** Query otimizada com SELECT específico

## 🔄 **Padrão Estabelecido**

Esta correção estabelece o padrão para outros relacionamentos:

### **Para adicionar relacionamentos em outras APIs:**

1. **Atualizar a query SQL** incluindo o JOIN:

   ```typescript
   .select(`
     *,
     related_table (
       field1,
       field2
     )
   `)
   ```

2. **Atualizar a interface TypeScript** adicionando o relacionamento:

   ```typescript
   export interface Entity {
     // campos existentes...
     related_table?: {
       field1: string;
       field2: string;
     } | null;
   }
   ```

3. **Usar o tipo na página** sem duplicações:
   ```typescript
   import { Entity } from "@/integrations/supabase/api";
   ```

## 📊 **Impacto no Bundle**

- **Sem impacto negativo** no tamanho do bundle
- **Tipos mais precisos** melhoram o IntelliSense
- **Queries otimizadas** carregam apenas campos necessários

Esta correção garante que o sistema de manutenções funcione corretamente com os dados relacionados de veículos, mantendo a arquitetura simplificada e os padrões estabelecidos.
