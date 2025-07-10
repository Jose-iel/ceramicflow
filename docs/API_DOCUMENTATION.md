# Guia das APIs e Hooks Otimizados - CeramicFlow

## 📚 **Estrutura das APIs Refatoradas**

### **APIs de Serviços (`src/integrations/supabase/api/`)**

#### **EmployeesService**

```typescript
// Arquivo: src/integrations/supabase/api/employees.ts
- getEmployees(): Lista todos os funcionários
- createEmployee(data): Cria novo funcionário
- updateEmployee(id, data): Atualiza funcionário
- deleteEmployee(id): Remove funcionário
```

#### **VehiclesService**

```typescript
// Arquivo: src/integrations/supabase/api/vehicles.ts
- getVehicles(): Lista todos os veículos
- createVehicle(data): Cria novo veículo
- updateVehicle(id, data): Atualiza veículo
- deleteVehicle(id): Remove veículo
```

#### **OperationsService**

```typescript
// Arquivo: src/integrations/supabase/api/operations.ts
- getOperations(): Lista todas as operações
- createOperation(data): Cria nova operação
- updateOperation(id, data): Atualiza operação
- deleteOperation(id): Remove operação
```

#### **MaintenancesService**

```typescript
// Arquivo: src/integrations/supabase/api/maintenances.ts
- getMaintenances(): Lista todas as manutenções
- createMaintenance(data): Cria nova manutenção
- updateMaintenance(id, data): Atualiza manutenção
- deleteMaintenance(id): Remove manutenção
```

#### **ClayConsumptionsService**

```typescript
// Arquivo: src/integrations/supabase/api/clay-consumptions.ts
- getClayConsumptions(): Lista consumos de argila
- createClayConsumption(data): Cria novo consumo
- updateClayConsumption(id, data): Atualiza consumo
- deleteClayConsumption(id): Remove consumo
```

#### **SalesService**

```typescript
// Arquivo: src/integrations/supabase/api/sales.ts
- getSales(): Lista todas as vendas
- createSale(data): Cria nova venda
- updateSale(id, data): Atualiza venda
- deleteSale(id): Remove venda
```

#### **WoodService**

```typescript
// Arquivo: src/integrations/supabase/api/wood.ts
- getWoodConsumptions(): Lista consumos de lenha
- getWoodPurchases(): Lista compras de lenha
- createWoodConsumption(data): Cria consumo
- createWoodPurchase(data): Cria compra
- updateWoodConsumption(id, data): Atualiza consumo
- updateWoodPurchase(id, data): Atualiza compra
- deleteWoodConsumption(id): Remove consumo
- deleteWoodPurchase(id): Remove compra
```

## 🎣 **Hooks Otimizados (`src/integrations/supabase/hooks/`)**

### **Padrão dos Hooks Otimizados**

Todos os hooks seguem o padrão:

```typescript
- use[Entity]Optimized(): Query para listagem
- useCreate[Entity]Optimized(): Mutation para criação
- useUpdate[Entity]Optimized(): Mutation para atualização
- useDelete[Entity]Optimized(): Mutation para remoção
```

#### **useEmployeesOptimized**

```typescript
// Query hooks
const { data: employees, isLoading, error } = useEmployeesOptimized();

// Mutation hooks
const createMutation = useCreateEmployeeOptimized();
const updateMutation = useUpdateEmployeeOptimized();
const deleteMutation = useDeleteEmployeeOptimized();

// Uso
createMutation.mutate({ name: "João", role: "operador" });
updateMutation.mutate({ id: "123", name: "João Silva" });
deleteMutation.mutate("123");
```

#### **useVehiclesOptimized**

```typescript
// Query
const { data: vehicles } = useVehiclesOptimized();

// Mutations
const createVehicle = useCreateVehicleOptimized();
const updateVehicle = useUpdateVehicleOptimized();
const deleteVehicle = useDeleteVehicleOptimized();
```

#### **useOperationsOptimized**

```typescript
// Query
const { data: operations } = useOperationsOptimized();

// Mutations
const createOperation = useCreateOperationOptimized();
const updateOperation = useUpdateOperationOptimized();
const deleteOperation = useDeleteOperationOptimized();
```

#### **useMaintenancesOptimized**

```typescript
// Query
const { data: maintenances } = useMaintenancesOptimized();

// Mutations
const createMaintenance = useCreateMaintenanceOptimized();
const updateMaintenance = useUpdateMaintenanceOptimized();
const deleteMaintenance = useDeleteMaintenanceOptimized();
```

#### **useClayConsumptionsOptimized**

```typescript
// Query
const { data: consumptions } = useClayConsumptionsOptimized();

// Mutations
const createConsumption = useCreateClayConsumptionOptimized();
const updateConsumption = useUpdateClayConsumptionOptimized();
const deleteConsumption = useDeleteClayConsumptionOptimized();
```

#### **useSalesOptimized**

```typescript
// Query
const { data: sales } = useSalesOptimized();

// Mutations
const createSale = useCreateSaleOptimized();
const updateSale = useUpdateSaleOptimized();
const deleteSale = useDeleteSaleOptimized();
```

#### **useWoodOptimized**

```typescript
// Queries
const { data: consumptions } = useWoodConsumptionsOptimized();
const { data: purchases } = useWoodPurchasesOptimized();

// Mutations
const createConsumption = useCreateWoodConsumptionOptimized();
const createPurchase = useCreateWoodPurchaseOptimized();
const updateConsumption = useUpdateWoodConsumptionOptimized();
const updatePurchase = useUpdateWoodPurchaseOptimized();
const deleteConsumption = useDeleteWoodConsumptionOptimized();
const deletePurchase = useDeleteWoodPurchaseOptimized();
```

## 🔧 **Funcionalidades dos Hooks**

### **Características Principais**

#### **Otimização de Performance**

- **Caching automático** com React Query
- **Stale time** configurado para 5 minutos
- **Background refetch** em foco da aba
- **Retry automático** em caso de erro

#### **Invalidação Inteligente**

- **Mutations invalidam** queries relacionadas automaticamente
- **Optimistic updates** para melhor UX
- **Rollback automático** em caso de erro
- **Loading states** granulares

#### **Filtros e Paginação**

- **Filtro por mês** integrado (quando aplicável)
- **Ordenação** por data/relevância
- **Paginação** otimizada (para listas grandes)
- **Search** em tempo real (onde implementado)

### **Exemplo de Uso Completo**

```typescript
// Em uma página/componente
import {
  useEmployeesOptimized,
  useCreateEmployeeOptimized,
  useUpdateEmployeeOptimized,
  useDeleteEmployeeOptimized,
} from "@/integrations/supabase/hooks";

function EmployeesPage() {
  // Query
  const {
    data: employees,
    isLoading,
    error,
    refetch,
  } = useEmployeesOptimized();

  // Mutations
  const createEmployee = useCreateEmployeeOptimized();
  const updateEmployee = useUpdateEmployeeOptimized();
  const deleteEmployee = useDeleteEmployeeOptimized();

  // Handlers
  const handleCreate = (data: CreateEmployeePayload) => {
    createEmployee.mutate(data, {
      onSuccess: () => {
        // Query é invalidada automaticamente
        console.log("Funcionário criado!");
      },
      onError: (error) => {
        console.error("Erro ao criar:", error);
      },
    });
  };

  const handleUpdate = (id: string, data: Partial<Employee>) => {
    updateEmployee.mutate({ id, ...data });
  };

  const handleDelete = (id: string) => {
    deleteEmployee.mutate(id);
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      {employees?.map((employee) => (
        <div key={employee.id}>
          {employee.name}
          <button
            onClick={() => handleUpdate(employee.id, { name: "Novo Nome" })}
          >
            Editar
          </button>
          <button onClick={() => handleDelete(employee.id)}>Excluir</button>
        </div>
      ))}

      <button onClick={() => handleCreate({ name: "Novo Funcionário" })}>
        Adicionar
      </button>
    </div>
  );
}
```

## 📋 **Tipagem TypeScript**

### **Tipos das Entidades**

```typescript
// Employee
interface Employee {
  id: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Vehicle
interface Vehicle {
  id: string;
  model: string;
  type: VehicleType;
  acquisition_date: string;
  status: VehicleStatus;
}

// Operation
interface Operation {
  id: string;
  clay_consumed: number;
  wood_consumed: number;
  fuel_consumed: number;
  kiln_temperature: number;
  operation_date: string;
  vehicle_id?: string;
  operator_id?: string;
}

// E assim por diante...
```

### **Tipos de Payload**

```typescript
// Para criação (sem id, sem timestamps)
type CreateEmployeePayload = Omit<Employee, "id" | "created_at" | "updated_at">;

// Para atualização (apenas campos modificáveis)
type UpdateEmployeePayload = Partial<
  Omit<Employee, "id" | "created_at" | "updated_at">
>;
```

## 🎯 **Benefícios da Refatoração**

### **Performance**

- ✅ **Queries otimizadas** com caching inteligente
- ✅ **Mutations eficientes** com invalidação automática
- ✅ **Loading states** granulares
- ✅ **Error handling** robusto

### **Developer Experience**

- ✅ **API consistente** entre todas as entidades
- ✅ **TypeScript completo** com inferência de tipos
- ✅ **Documentação clara** e exemplos
- ✅ **Padrões definidos** para extensibilidade

### **Manutenibilidade**

- ✅ **Código centralizado** em services
- ✅ **Reutilização** de lógica comum
- ✅ **Testabilidade** melhorada
- ✅ **Separação de responsabilidades** clara

---

**Nota**: Todos os hooks antigos foram removidos e substituídos pelas versões otimizadas. Certifique-se de usar apenas os hooks com sufixo `Optimized` para garantir performance e consistência.
