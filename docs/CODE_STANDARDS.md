# 🏗️ **Padrões de Código e Arquitetura - CeramicFlow**

> **⚠️ CRÍTICO:** Este documento define os padrões OBRIGATÓRIOS de código. Qualquer violação resultará em rejeição do PR.

---

## 🎯 **Princípios Fundamentais**

### **1. Separação de Responsabilidades**

- **Services:** Comunicação com API (Supabase)
- **Hooks:** Gerenciamento de estado e cache
- **Components:** Interface do usuário apenas
- **Utils:** Funções puras e helpers

### **2. Single Source of Truth**

- **Imports:** Sempre via `@/hooks`
- **State:** React Query como única fonte
- **Types:** Definidos nos Services
- **Config:** Centralizada em `@/lib`

### **3. Performance First**

- **Lazy Loading:** Obrigatório para páginas
- **Memoization:** Para componentes pesados
- **Code Splitting:** Por funcionalidade
- **Bundle Analysis:** Antes de deploy

---

## 📁 **Estrutura de Arquivos (OBRIGATÓRIA)**

```
src/
├── components/                 # UI Components
│   ├── ui/                    # Base components (shadcn/ui)
│   ├── common/                # Shared components
│   ├── [feature]/             # Feature-specific components
│   └── layout/                # Layout components
├── pages/                     # Route pages (lazy loaded)
├── hooks/                     # Custom hooks + central exports
│   ├── index.ts              # ⭐ ÚNICO ponto de import
│   ├── use-[feature].ts      # Feature hooks
│   └── use-[utility].ts      # Utility hooks
├── integrations/              # External services
│   └── supabase/
│       ├── api/              # Service classes
│       ├── hooks/            # Supabase-specific hooks
│       └── types.ts          # Supabase types
├── lib/                      # Configuration & utilities
│   ├── utils.ts              # General utilities
│   ├── queryClient.ts        # React Query config
│   └── constants.ts          # App constants
├── types/                    # Global TypeScript types
└── utils/                    # Pure functions & helpers
```

---

## 🔧 **Regras de Implementação**

### **🚫 PROIBIDO**

#### **Import Anti-patterns**

```typescript
// ❌ Import direto de hooks otimizados
import { useEmployeesOptimized } from '@/integrations/supabase/hooks/use-employees-optimized';

// ❌ Import de services em componentes
import { EmployeesService } from '@/integrations/supabase/api/employees';

// ❌ Múltiplos imports relacionados
import { useEmployees } from '@/integrations/supabase/hooks/use-employees-optimized';
import { useCreateEmployee } from '@/integrations/supabase/hooks/use-employees-optimized';
```

#### **State Anti-patterns**

```typescript
// ❌ Estado manual para dados do servidor
const [employees, setEmployees] = useState([]);

// ❌ useEffect para fetch de dados
useEffect(() => {
  fetchEmployees().then(setEmployees);
}, []);

// ❌ Fetch direto em componentes
const response = await supabase.from('employees').select('*');
```

#### **Component Anti-patterns**

```typescript
// ❌ Lógica de negócio em componentes
function EmployeeCard({ employee }) {
  const processEmployeeData = () => {
    // Complex business logic here - WRONG!
  };
}

// ❌ Componentes sem types
function SomeComponent(props) { // Missing TypeScript
  return <div>{props.data}</div>;
}
```

### **✅ OBRIGATÓRIO**

#### **Import Patterns Corretos**

```typescript
// ✅ Import centralizado
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '@/hooks';

// ✅ Import agrupado por categoria
import { Button, Input, Card } from '@/components/ui';
import { DataTable, LoadingSpinner } from '@/components/common';
import { EmployeeForm } from '@/components/employees';
```

#### **Component Patterns Corretos**

```typescript
// ✅ Componente tipado e focado
interface EmployeeCardProps {
  employee: Employee;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold">{employee.name}</h3>
      <p className="text-muted-foreground">{employee.role}</p>

      <div className="flex gap-2 mt-4">
        <Button onClick={() => onEdit(employee.id)}>
          Editar
        </Button>
        <Button variant="destructive" onClick={() => onDelete(employee.id)}>
          Excluir
        </Button>
      </div>
    </Card>
  );
}
```

#### **Hook Usage Patterns**

```typescript
// ✅ Hook usage com error handling
function EmployeesPage() {
  const { data: employees = [], isLoading, error, refetch } = useEmployees();
  const deleteEmployee = useDeleteEmployee();

  const handleDelete = useCallback((id: string) => {
    deleteEmployee.mutate(id, {
      onSuccess: () => {
        toast({ title: "Funcionário removido com sucesso!" });
      },
      onError: (error) => {
        toast({
          title: "Erro ao remover funcionário",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  }, [deleteEmployee]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      {employees.map(employee => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

---

## 📝 **Padrões de Nomenclatura**

### **Arquivos**

```
kebab-case.tsx          # Components
kebab-case.ts           # Utils, hooks, services
PascalCase.tsx          # Page components
```

### **Funções e Variáveis**

```typescript
// Functions: camelCase
const handleSubmit = () => {};
const processEmployeeData = () => {};

// Components: PascalCase
const EmployeeCard = () => {};
const DataTable = () => {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// Types/Interfaces: PascalCase
interface Employee {}
type CreateEmployeePayload = {};
```

### **Hooks**

```typescript
// Custom hooks: use + PascalCase
const useEmployeeData = () => {};
const useFormValidation = () => {};

// Optimized hooks: use + Entity + Optimized
const useEmployeesOptimized = () => {};
const useCreateEmployeeOptimized = () => {};
```

---

## 🎨 **UI/UX Patterns**

### **Loading States**

```typescript
// ✅ Loading granular
if (isLoading) return <EmployeesSkeleton />;

// ✅ Loading com contexto
<Button disabled={createEmployee.isPending}>
  {createEmployee.isPending ? "Criando..." : "Criar Funcionário"}
</Button>
```

### **Error Handling**

```typescript
// ✅ Error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <EmployeesPage />
</ErrorBoundary>

// ✅ Error toast
onError: (error) => {
  toast({
    title: "Erro ao processar solicitação",
    description: error.message,
    variant: "destructive"
  });
}
```

### **Form Patterns**

```typescript
// ✅ React Hook Form + Zod
const form = useForm<CreateEmployeePayload>({
  resolver: zodResolver(createEmployeeSchema),
  defaultValues: {
    name: '',
    role: 'operator',
    ceramic_id: '',
  },
});

const onSubmit = (data: CreateEmployeePayload) => {
  createEmployee.mutate(data, {
    onSuccess: () => {
      form.reset();
      toast({ title: 'Funcionário criado!' });
    },
  });
};
```

---

## 🔒 **Security Patterns**

### **Input Validation**

```typescript
// ✅ Zod schemas para validação
import { z } from 'zod';

const employeeSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  role: z.enum(['admin', 'manager', 'operator']),
  ceramic_id: z.string().uuid('ID inválido'),
});
```

### **Environment Variables**

```typescript
// ✅ Validação de env vars
const env = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

// Validate required env vars
Object.entries(env).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
```

---

## 🚀 **Performance Patterns**

### **Lazy Loading**

```typescript
// ✅ Pages lazy loaded
const EmployeesPage = lazy(() => import('@/pages/Employees'));
const VehiclesPage = lazy(() => import('@/pages/Vehicles'));

// ✅ Components lazy loaded quando pesados
const HeavyChart = lazy(() => import('@/components/HeavyChart'));
```

### **Memoization**

```typescript
// ✅ Memoize expensive computations
const processedData = useMemo(() => {
  return employees.map(employee => ({
    ...employee,
    displayName: `${employee.name} (${employee.role})`,
  }));
}, [employees]);

// ✅ Memoize callbacks
const handleEmployeeClick = useCallback(
  (id: string) => {
    navigate(`/employees/${id}`);
  },
  [navigate]
);
```

### **Code Splitting**

```typescript
// ✅ Dynamic imports para features
const loadEmployeeModule = () => import('@/features/employees');
const loadReportsModule = () => import('@/features/reports');
```

---

## 📊 **Testing Patterns (Quando Implementado)**

### **Estrutura de Testes**

```
src/
├── components/
│   └── __tests__/
│       └── EmployeeCard.test.tsx
├── hooks/
│   └── __tests__/
│       └── useEmployees.test.ts
└── pages/
    └── __tests__/
        └── Employees.test.tsx
```

### **Test Patterns**

```typescript
// ✅ Test pattern para components
describe('EmployeeCard', () => {
  it('renders employee information correctly', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    expect(screen.getByText(mockEmployee.name)).toBeInTheDocument();
  });
});

// ✅ Test pattern para hooks
describe('useEmployees', () => {
  it('fetches employees successfully', async () => {
    const { result } = renderHook(() => useEmployees());
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

---

## 🎯 **Code Review Checklist**

### **Antes de Submeter PR**

- [ ] Segue padrões de import (`@/hooks`)
- [ ] Components tipados corretamente
- [ ] Error handling implementado
- [ ] Loading states adequados
- [ ] Performance otimizada
- [ ] Nomenclatura consistente
- [ ] Sem lógica de negócio em components
- [ ] Sem calls diretas ao Supabase
- [ ] Documentação atualizada se necessário

### **Durante Code Review**

- [ ] Arquitetura seguida corretamente
- [ ] Padrões de código respeitados
- [ ] TypeScript strict compliance
- [ ] Bundle size impact considerado
- [ ] Security patterns aplicados
- [ ] Accessibility básica implementada

---

## ⚡ **Comandos Úteis**

### **Development**

```bash
# Start dev server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint:fix

# Build
npm run build
```

### **Code Quality**

```bash
# Full code quality check
npm run code-quality

# Cache cleared lint
npm run lint:cache
```

---

## 🎖️ **Levels de Conformidade**

### **🥇 Gold Standard (Objetivo)**

- Todos os padrões seguidos
- Performance otimizada
- Zero TypeScript errors
- Comprehensive error handling
- Accessible components

### **🥈 Silver Standard (Mínimo Aceitável)**

- Padrões de import seguidos
- Básico error handling
- Components tipados
- Loading states implementados

### **🥉 Bronze Standard (Rejeitado)**

- Qualquer violação dos padrões OBRIGATÓRIOS
- Import direto de hooks otimizados
- Lógica de negócio em components
- Fetch manual em components

---

**⚠️ Lembre-se: Este documento evolui com o projeto. Sempre verifique a versão mais recente antes de desenvolver.**
