# 🔥 **Guia Definitivo de APIs e Hooks - CeramicFlow**

> **⚠️ IMPORTANTE:** Este é o guia OFICIAL para desenvolvimento. Todo código deve seguir estes padrões. Qualquer implementação fora desta arquitetura será rejeitada.

---

## 🏗️ **Arquitetura Obrigatória**

### **📁 Estrutura de Diretórios (OBRIGATÓRIA)**

```
src/integrations/supabase/
├── api/                    # Services para comunicação com Supabase
│   ├── auth.ts
│   ├── employees.ts       # EmployeesService
│   ├── vehicles.ts        # VehiclesService
│   ├── operations.ts      # OperationsService
│   ├── maintenances.ts    # MaintenancesService
│   ├── clay-consumptions.ts # ClayConsumptionsService
│   ├── sales.ts           # SalesService
│   ├── wood.ts            # WoodService
│   └── index.ts           # Export central
├── hooks/                 # Hooks específicos do Supabase
│   ├── use-employees-optimized.ts
│   ├── use-vehicles-optimized.ts
│   └── ...outros hooks optimized
└── types.ts               # Tipos do Supabase

src/hooks/
└── index.ts               # ⭐ PONTO ÚNICO de importação
```

### **📋 Regra Fundamental**

```typescript
// ✅ CORRETO - Import centralizado
import { useEmployees, useCreateEmployee } from '@/hooks';

// ❌ ERRADO - Import direto
import { useEmployeesOptimized } from '@/integrations/supabase/hooks/use-employees-optimized';
```

---

## 🔧 **Padrão Obrigatório para Services**

### **Template para Novos Services**

```typescript
// Arquivo: src/integrations/supabase/api/[entity].ts
import { supabase } from '../client';

// 1. Interface da entidade (OBRIGATÓRIA)
export interface [Entity] {
  id: string;
  ceramic_id: string;  // Sempre presente
  // ... outros campos
  created_at: string;  // Sempre presente
  updated_at: string;  // Sempre presente
}

// 2. Tipos de payload (OBRIGATÓRIOS)
export type Create[Entity]Payload = Omit<[Entity], 'id' | 'created_at' | 'updated_at'>;
export type Update[Entity]Payload = Partial<Omit<[Entity], 'id' | 'created_at' | 'updated_at'>>;

// 3. Service class (OBRIGATÓRIA)
export class [Entity]Service {
  static async getAll[Entity]s(): Promise<[Entity][]> {
    const { data, error } = await supabase
      .from('[table_name]')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async create[Entity](payload: Create[Entity]Payload): Promise<[Entity]> {
    const { data, error } = await supabase
      .from('[table_name]')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update[Entity](id: string, payload: Update[Entity]Payload): Promise<[Entity]> {
    const { data, error } = await supabase
      .from('[table_name]')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete[Entity](id: string): Promise<void> {
    const { error } = await supabase
      .from('[table_name]')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
```

---

## 🎣 **Padrão Obrigatório para Hooks**

### **Template para Novos Hooks**

```typescript
// Arquivo: src/integrations/supabase/hooks/use-[entity]-optimized.ts
import { useQueryClient } from '@tanstack/react-query';
import { [Entity]Service, type Create[Entity]Payload, type Update[Entity]Payload } from '../api';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { useEntityMutation } from '@/hooks/useEntityMutation';

// 1. Hook de Query (OBRIGATÓRIO)
export function use[Entity]sOptimized() {
  return useOptimizedQuery({
    queryKey: ['[entity]s'],
    queryFn: [Entity]Service.getAll[Entity]s,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000,    // 15 minutos
  });
}

// 2. Hook de Create (OBRIGATÓRIO)
export function useCreate[Entity]Optimized() {
  return useEntityMutation({
    mutationFn: (payload: Create[Entity]Payload) => [Entity]Service.create[Entity](payload),
    queryKeyToInvalidate: ['[entity]s'],
    successMessage: '[Entity] criado com sucesso.',
    errorMessage: 'Erro ao criar [entity]',
    // Optimistic update se necessário
  });
}

// 3. Hook de Update (OBRIGATÓRIO)
export function useUpdate[Entity]Optimized() {
  return useEntityMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Update[Entity]Payload) =>
      [Entity]Service.update[Entity](id, payload),
    queryKeyToInvalidate: ['[entity]s'],
    successMessage: '[Entity] atualizado com sucesso.',
    errorMessage: 'Erro ao atualizar [entity]',
  });
}

// 4. Hook de Delete (OBRIGATÓRIO)
export function useDelete[Entity]Optimized() {
  return useEntityMutation({
    mutationFn: (id: string) => [Entity]Service.delete[Entity](id),
    queryKeyToInvalidate: ['[entity]s'],
    successMessage: '[Entity] removido com sucesso.',
    errorMessage: 'Erro ao remover [entity]',
  });
}
```

---

## ⭐ **Centralização em src/hooks/index.ts**

### **Regra OBRIGATÓRIA de Export**

```typescript
// src/hooks/index.ts

// Cada nova entidade DEVE ser adicionada aqui
export {
  use[Entity]sOptimized as use[Entity]s,
  useCreate[Entity]Optimized as useCreate[Entity],
  useUpdate[Entity]Optimized as useUpdate[Entity],
  useDelete[Entity]Optimized as useDelete[Entity],
} from '@/integrations/supabase/hooks/use-[entity]-optimized';
```

**Nomenclatura Simplificada:**

- `useEmployeesOptimized` → `useEmployees`
- `useCreateEmployeeOptimized` → `useCreateEmployee`
- `useUpdateEmployeeOptimized` → `useUpdateEmployee`
- `useDeleteEmployeeOptimized` → `useDeleteEmployee`

---

## 📚 **Services Implementados (Referência)**

### **EmployeesService ✅**

```typescript
// Arquivo: src/integrations/supabase/api/employees.ts
class EmployeesService {
  static getAllEmployees(): Promise<Employee[]>;
  static createEmployee(data: CreateEmployeePayload): Promise<Employee>;
  static updateEmployee(id: string, data: UpdateEmployeePayload): Promise<Employee>;
  static deleteEmployee(id: string): Promise<void>;
}

// Interface completa
interface Employee {
  id: string;
  ceramic_id: string;
  name: string;
  role: EmployeeRole;
  cpf?: string;
  contact?: string;
  shift?: string;
  admission_date?: string;
  vacation_due_date?: string;
  created_at: string;
  updated_at: string;
}
```

### **VehiclesService ✅**

```typescript
// Arquivo: src/integrations/supabase/api/vehicles.ts
class VehiclesService {
  static getAllVehicles(): Promise<Vehicle[]>;
  static createVehicle(data: CreateVehiclePayload): Promise<Vehicle>;
  static updateVehicle(id: string, data: UpdateVehiclePayload): Promise<Vehicle>;
  static deleteVehicle(id: string): Promise<void>;
}
```

### **OperationsService ✅**

```typescript
// Arquivo: src/integrations/supabase/api/operations.ts
class OperationsService {
  static getAllOperations(): Promise<Operation[]>;
  static createOperation(data: CreateOperationPayload): Promise<Operation>;
  static updateOperation(id: string, data: UpdateOperationPayload): Promise<Operation>;
  static deleteOperation(id: string): Promise<void>;
}
```

### **MaintenancesService ✅**

```typescript
// Arquivo: src/integrations/supabase/api/maintenances.ts
class MaintenancesService {
  static getAllMaintenances(): Promise<Maintenance[]>;
  static createMaintenance(data: CreateMaintenancePayload): Promise<Maintenance>;
  static updateMaintenance(id: string, data: UpdateMaintenancePayload): Promise<Maintenance>;
  static deleteMaintenance(id: string): Promise<void>;
}
```

### **ClayConsumptionsService ✅**

```typescript
// Arquivo: src/integrations/supabase/api/clay-consumptions.ts
class ClayConsumptionsService {
  static getAllClayConsumptions(): Promise<ClayConsumption[]>;
  static createClayConsumption(data: CreateClayConsumptionPayload): Promise<ClayConsumption>;
  static updateClayConsumption(id: string, data: UpdateClayConsumptionPayload): Promise<ClayConsumption>;
  static deleteClayConsumption(id: string): Promise<void>;
}
```

### **SalesService ✅**

```typescript
// Arquivo: src/integrations/supabase/api/sales.ts
class SalesService {
  static getAllSales(): Promise<Sale[]>;
  static createSale(data: CreateSalePayload): Promise<Sale>;
  static updateSale(id: string, data: UpdateSalePayload): Promise<Sale>;
  static deleteSale(id: string): Promise<void>;
}
```

### **WoodService ✅**

```typescript
// Arquivo: src/integrations/supabase/api/wood.ts
class WoodService {
  static getAllWoodConsumptions(): Promise<WoodConsumption[]>;
  static getAllWoodPurchases(): Promise<WoodPurchase[]>;
  static createWoodConsumption(data: CreateWoodConsumptionPayload): Promise<WoodConsumption>;
  static createWoodPurchase(data: CreateWoodPurchasePayload): Promise<WoodPurchase>;
  static updateWoodConsumption(id: string, data: UpdateWoodConsumptionPayload): Promise<WoodConsumption>;
  static updateWoodPurchase(id: string, data: UpdateWoodPurchasePayload): Promise<WoodPurchase>;
  static deleteWoodConsumption(id: string): Promise<void>;
  static deleteWoodPurchase(id: string): Promise<void>;
}
```

---

## 🎣 **Hooks Implementados (Referência)**

### **✅ Hooks Disponíveis via `import { ... } from '@/hooks'`**

#### **Funcionários**

```typescript
const { data: employees, isLoading, error } = useEmployees();
const createEmployee = useCreateEmployee();
const updateEmployee = useUpdateEmployee();
const deleteEmployee = useDeleteEmployee();
```

#### **Veículos**

```typescript
const { data: vehicles } = useVehicles();
const createVehicle = useCreateVehicle();
const updateVehicle = useUpdateVehicle();
const deleteVehicle = useDeleteVehicle();
```

#### **Operações**

```typescript
const { data: operations } = useOperations();
const createOperation = useCreateOperation();
const updateOperation = useUpdateOperation();
const deleteOperation = useDeleteOperation();
```

#### **Manutenções**

```typescript
const { data: maintenances } = useMaintenances();
const createMaintenance = useCreateMaintenance();
const updateMaintenance = useUpdateMaintenance();
const deleteMaintenance = useDeleteMaintenance();
```

#### **Consumo de Argila**

```typescript
const { data: clayConsumptions } = useClayConsumptions();
const createClayConsumption = useCreateClayConsumption();
const updateClayConsumption = useUpdateClayConsumption();
const deleteClayConsumption = useDeleteClayConsumption();
```

#### **Vendas**

```typescript
const { data: sales } = useSales();
const createSale = useCreateSale();
const updateSale = useUpdateSale();
const deleteSale = useDeleteSale();
```

#### **Lenha (Consumo e Compra)**

```typescript
const { data: woodConsumptions } = useWoodConsumptions();
const { data: woodPurchases } = useWoodPurchases();
const createWoodConsumption = useCreateWoodConsumption();
const createWoodPurchase = useCreateWoodPurchase();
const updateWoodConsumption = useUpdateWoodConsumption();
const updateWoodPurchase = useUpdateWoodPurchase();
const deleteWoodConsumption = useDeleteWoodConsumption();
const deleteWoodPurchase = useDeleteWoodPurchase();
```

---

## � **Regras de Desenvolvimento (OBRIGATÓRIAS)**

### **🚫 O que é PROIBIDO**

```typescript
// ❌ Import direto de hooks otimizados
import { useEmployeesOptimized } from '@/integrations/supabase/hooks/use-employees-optimized';

// ❌ Import direto de services
import { EmployeesService } from '@/integrations/supabase/api/employees';

// ❌ Chamadas diretas ao Supabase nos componentes
const { data } = await supabase.from('employees').select('*');

// ❌ Lógica de estado manual
const [employees, setEmployees] = useState([]);

// ❌ Fetch manual sem cache
useEffect(() => {
  fetch('/api/employees').then(...)
}, []);
```

### **✅ O que é OBRIGATÓRIO**

```typescript
// ✅ Import centralizado
import { useEmployees, useCreateEmployee } from '@/hooks';

// ✅ Uso dos hooks otimizados
const { data: employees, isLoading, error } = useEmployees();
const createEmployee = useCreateEmployee();

// ✅ Uso das mutations
createEmployee.mutate(employeeData, {
  onSuccess: () => {
    // Query é invalidada automaticamente
  },
  onError: error => {
    // Error handling
  },
});
```

---

## 📋 **Exemplo Completo de Implementação**

### **Página de Funcionários (Template)**

```typescript
// src/pages/Employees.tsx
import { useState } from 'react';
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee
} from '@/hooks';

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export function Employees() {
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);

  // Queries
  const {
    data: employees = [],
    isLoading,
    error
  } = useEmployees();

  // Mutations
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  // Handlers
  const handleCreate = (employeeData: CreateEmployeePayload) => {
    createEmployee.mutate(employeeData, {
      onSuccess: () => {
        toast({ title: "Funcionário criado com sucesso!" });
      },
      onError: (error) => {
        toast({
          title: "Erro ao criar funcionário",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const handleUpdate = (id: string, data: UpdateEmployeePayload) => {
    updateEmployee.mutate({ id, ...data }, {
      onSuccess: () => {
        setEditingEmployee(null);
        toast({ title: "Funcionário atualizado!" });
      }
    });
  };

  const handleDelete = (id: string) => {
    deleteEmployee.mutate(id, {
      onSuccess: () => {
        toast({ title: "Funcionário removido!" });
      }
    });
  };

  // Loading state
  if (isLoading) {
    return <div>Carregando funcionários...</div>;
  }

  // Error state
  if (error) {
    return <div>Erro: {error.message}</div>;
  }

  // Render
  return (
    <div className="space-y-4">
      <h1>Funcionários ({employees.length})</h1>

      {employees.map((employee) => (
        <div key={employee.id} className="border p-4 rounded">
          <h3>{employee.name}</h3>
          <p>Cargo: {employee.role}</p>

          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => setEditingEmployee(employee.id)}
              disabled={updateEmployee.isPending}
            >
              Editar
            </Button>

            <Button
              variant="destructive"
              onClick={() => handleDelete(employee.id)}
              disabled={deleteEmployee.isPending}
            >
              Excluir
            </Button>
          </div>
        </div>
      ))}

      <Button
        onClick={() => handleCreate({
          name: "Novo Funcionário",
          role: "operator",
          ceramic_id: "ceramic_123"
        })}
        disabled={createEmployee.isPending}
      >
        {createEmployee.isPending ? "Criando..." : "Adicionar Funcionário"}
      </Button>
    </div>
  );
}
```

---

## 🧪 **Características dos Hooks (Implementadas)**

### **Performance Otimizada**

- ✅ **Caching automático** com React Query
- ✅ **Stale time** de 10 minutos
- ✅ **Garbage collection** de 15 minutos
- ✅ **Background refetch** automático
- ✅ **Retry** em caso de erro

### **Invalidação Inteligente**

- ✅ **Mutations invalidam** queries automaticamente
- ✅ **Optimistic updates** onde apropriado
- ✅ **Rollback** em caso de erro
- ✅ **Loading states** granulares

### **Developer Experience**

- ✅ **TypeScript completo** com inferência
- ✅ **Error handling** consistente
- ✅ **Toast notifications** automáticas
- ✅ **API uniforme** entre entidades

---

## 🎯 **Checklist para Novos Desenvolvedores**

### **Antes de Desenvolver**

- [ ] Li e entendi este documento completamente
- [ ] Verifico se a entidade já tem Service/Hook implementado
- [ ] Confirmo os tipos TypeScript necessários

### **Ao Criar Nova Entidade**

- [ ] Implemento Service seguindo o template exato
- [ ] Implemento Hooks seguindo o template exato
- [ ] Adiciono exports no `src/hooks/index.ts`
- [ ] Testo todos os CRUD operations
- [ ] Verifico se toast notifications funcionam

### **Ao Usar em Componentes**

- [ ] Uso apenas imports de `@/hooks`
- [ ] Implemento loading e error states
- [ ] Uso mutations com callbacks adequados
- [ ] Não acesso Supabase diretamente

---

## ⚠️ **Consequências do Não Cumprimento**

**Todo código que não seguir estes padrões será:**

1. **Rejeitado** em code review
2. **Refeito** seguindo as regras
3. **Documentado** como exemplo do que não fazer

**Esta arquitetura garante:**

- 🚀 **Performance** consistente
- 🔧 **Manutenibilidade** a longo prazo
- 🎯 **Developer Experience** padronizada
- 🛡️ **Type Safety** completa

---

**Este documento é a fonte da verdade para desenvolvimento no CeramicFlow. 📜✨**
