# 🤖 **GUIA DE GOVERNANÇA PARA IA - CeramicFlow**

> **🎯 DOCUMENTO SUPREMO:** Este é o guia definitivo para qualquer IA trabalhar no projeto CeramicFlow. Todas as regras, padrões e práticas obrigatórias consolidadas.

---

## 🏛️ **CONSTITUIÇÃO DO PROJETO**

### **⚖️ PRINCÍPIOS FUNDAMENTAIS**

1. **Código limpo é lei constitucional**
2. **TypeScript strict mode é obrigatório**
3. **Zero tolerância a código duplicado**
4. **Testes são mandatórios antes de produção**
5. **Segurança never be compromised**
6. **UX/UI deve ser impecável**
7. **Performance é prioridade máxima**

---

## 🎯 **ARQUITETURA OBRIGATÓRIA**

### **Stack Tecnológica (IMUTÁVEL)**

```typescript
// ✅ STACK OFICIAL
{
  "frontend": "React 18 + TypeScript + Vite",
  "styling": "Tailwind CSS + shadcn/ui",
  "state": "React Query (TanStack Query)",
  "forms": "React Hook Form + Zod",
  "backend": "Supabase (PostgreSQL + RLS)",
  "auth": "Supabase Auth + RLS",
  "deployment": "Vercel",
  "bundler": "Vite (otimizado)",
}
```

### **Estrutura de Diretórios (SACRED)**

```
src/
├── components/          # UI Components por domínio
│   ├── auth/           # Autenticação
│   ├── common/         # Componentes reutilizáveis
│   ├── ui/             # shadcn/ui components
│   └── [domain]/       # Componentes por domínio
├── hooks/              # Custom hooks centralizados
├── services/           # API services + business logic
├── pages/              # Page components
├── types/              # TypeScript definitions
├── lib/                # Utilities e configurações
└── utils/              # Helper functions
```

---

## 🔒 **SEGURANÇA CONSTITUCIONAL**

### **Row Level Security (RLS) - OBRIGATÓRIO**

```sql
-- ✅ PATTERN OBRIGATÓRIO para todas as tabelas
CREATE POLICY "usuarios_propria_empresa" ON employees
FOR ALL USING (
  company_id = (
    SELECT company_id FROM auth.users
    WHERE id = auth.uid()
  )
);
```

### **Validação Zod - MANDATÓRIA**

```typescript
// ✅ SEMPRE validar entrada de dados
const CreateEmployeeSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  cpf: z.string().regex(/^\d{11}$/),
  role: z.enum(['OPERATOR', 'SUPERVISOR', 'MANAGER']),
});

// ✅ NUNCA aceitar dados sem validação
const handleSubmit = (data: unknown) => {
  const validData = CreateEmployeeSchema.parse(data);
  // Proceed with valid data
};
```

### **Sanitização - SEMPRE**

```typescript
// ✅ Sanitizar TODOS os inputs
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};
```

---

## 🎨 **PADRÕES DE UI/UX**

### **Componentes UI - shadcn/ui ONLY**

```typescript
// ✅ SEMPRE usar shadcn/ui components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// ❌ NUNCA criar componentes básicos do zero
```

### **Common Components - REUTILIZÁVEIS**

```typescript
// ✅ USAR componentes reutilizáveis criados
import { StatsCard } from '@/components/common/StatsCard';
import { SearchAndActions } from '@/components/common/SearchAndActions';
import { DataTable } from '@/components/common/DataTable';
import { EntityDialog } from '@/components/common/EntityDialog';

// ✅ PATTERN para StatsCard
<StatsCard
  title="Total de Funcionários"
  value={employees.length}
  icon={Users}
  iconColor="text-blue-600"
  iconBgColor="bg-blue-100"
/>

// ✅ PATTERN para SearchAndActions
<SearchAndActions
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Buscar funcionários..."
  actions={[
    {
      label: "Novo Funcionário",
      onClick: () => setDialogOpen(true),
      icon: <Plus className="w-4 h-4" />,
    }
  ]}
/>
```

### **Loading States - OBRIGATÓRIO**

```typescript
// ✅ SEMPRE mostrar loading
function EmployeesPage() {
  const { data, isLoading, error } = useEmployees();

  if (isLoading) return <EmployeesSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return <EmployeesList data={data} />;
}
```

### **Error Handling - CONSTITUTIONAL**

```typescript
// ✅ Error boundaries OBRIGATÓRIAS
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>...</Routes>
      </Router>
    </ErrorBoundary>
  );
}

// ✅ Error display em TODOS os hooks
const { data, error, refetch } = useEmployees();
if (error) {
  return <ErrorDisplay error={error} onRetry={refetch} />;
}
```

---

## 📝 **FORM PATTERNS - SUPREMOS**

### **React Hook Form + Zod - ÚNICO PADRÃO**

```typescript
// ✅ TEMPLATE OBRIGATÓRIO para forms
const schema = z.object({
  // Zod validation rules
});

function MyForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      // Default values
    }
  });

  const mutation = useCreateEntity();

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        toast({ title: "Sucesso!" });
      },
      onError: (error) => {
        toast({
          title: "Erro",
          description: sanitizeError(error),
          variant: "destructive"
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="fieldName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
```

---

## 🔄 **DATA FETCHING PATTERNS**

### **React Query - ÚNICO MÉTODO**

```typescript
// ✅ PATTERN OBRIGATÓRIO para queries
export function useEmployees() {
  return useOptimizedQuery({
    queryKey: ['employees'],
    queryFn: EmployeesService.getAllEmployees,
    staleTime: 10 * 60 * 1000, // 10 min
    retry: 3,
  });
}

// ✅ PATTERN OBRIGATÓRIO para mutations
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EmployeesService.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
```

### **Service Layer - MANDATÓRIO**

```typescript
// ✅ SEMPRE implementar services em src/integrations/supabase/api/
export const EmployeesService = {
  async getAllEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });

    if (error) throw new AppError(error.message, ErrorType.SERVER);
    return data;
  },

  async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    // ✅ OBRIGATÓRIO: Validation
    const validData = CreateEmployeeSchema.parse(payload);

    const { data, error } = await supabase.from('employees').insert(validData).select().single();

    if (error) throw new AppError(error.message, ErrorType.SERVER);
    return data;
  },
};

// ✅ CENTRALIZED EXPORT - src/integrations/supabase/api/index.ts
export { EmployeesService } from './employees';
export { VehiclesService } from './vehicles';
export { OperationsService } from './operations';
```

### **Hooks Centralizados - SACRED PATTERN**

```typescript
// ✅ ÚNICO PONTO DE ENTRADA - src/hooks/index.ts
export { useEmployees, useCreateEmployee } from '@/integrations/supabase/hooks/use-employees-optimized';
export { useVehicles, useCreateVehicle } from '@/integrations/supabase/hooks/use-vehicles-optimized';

// ✅ SEMPRE importar via central
import { useEmployees, useCreateEmployee } from '@/hooks';

// ❌ NUNCA importar diretamente
import { useEmployeesOptimized } from '@/integrations/supabase/hooks/use-employees-optimized';
```

---

## 🎯 **CÓDIGO STANDARDS**

### **TypeScript - STRICT MODE**

```typescript
// ✅ tsconfig.json OBRIGATÓRIO
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### **Import Patterns - SACRED**

```typescript
// ✅ SEMPRE usar absolute imports
import { Button } from '@/components/ui/button';
import { useEmployees } from '@/hooks';
import { EmployeesService } from '@/services';

// ✅ Centralized hooks export
// @/hooks/index.ts
export { useEmployees } from './useEmployees';
export { useCreateEmployee } from './useCreateEmployee';
```

### **Naming Conventions - IMMUTABLE**

```typescript
// ✅ CONVENTIONS OBRIGATÓRIAS
const COMPONENT_NAME = 'PascalCase'; // Components
const hookName = 'camelCase starting with use'; // Hooks
const SERVICE_NAME = 'PascalCase + Service'; // Services
const CONSTANT_NAME = 'UPPER_SNAKE_CASE'; // Constants
const fileName = 'kebab-case.tsx'; // Files
```

---

## 🔥 **PERFORMANCE RULES**

### **Bundle Optimization - CONSTITUTIONAL**

```typescript
// ✅ SEMPRE lazy load pages
const EmployeesPage = lazy(() => import('@/pages/Employees'));

// ✅ SEMPRE usar Suspense
<Suspense fallback={<PageSkeleton />}>
  <EmployeesPage />
</Suspense>

// ✅ Optimize imports
import { Button } from '@/components/ui/button';
// ❌ NUNCA: import * from '@/components/ui';
```

### **Query Optimization - MANDATÓRIO**

```typescript
// ✅ Stale time para cache
const { data } = useOptimizedQuery({
  queryKey: ['employees'],
  queryFn: EmployeesService.getAllEmployees,
  staleTime: 10 * 60 * 1000, // 10 minutes
});

// ✅ Select specific data
const { data } = useQuery({
  queryKey: ['employee', id],
  queryFn: () =>
    supabase
      .from('employees')
      .select('id, name, email') // Specific fields only
      .eq('id', id)
      .single(),
});
```

---

## 🚫 **FORBIDDEN PRACTICES (DEATH PENALTY)**

### **❌ NEVER DO THESE:**

```typescript
// ❌ Any type usage
const data: any = response;

// ❌ Console.log in production
console.log('debug info');

// ❌ Inline styles
<div style={{ margin: '10px' }}>

// ❌ Direct DOM manipulation
document.getElementById('myElement');

// ❌ Unvalidated data
const createUser = (data) => { // No validation!
  api.post('/users', data);
};

// ❌ No error handling
try {
  await api.call();
} catch {
  // Silent fail
}

// ❌ Hardcoded strings
toast({ title: "Funcionário criado com sucesso!" });
// ✅ Use constants: toast({ title: SUCCESS_MESSAGES.EMPLOYEE_CREATED });

// ❌ Nested ternaries
{isLoading ? <Loading /> : error ? <Error /> : data ? <Content /> : null}

// ❌ useEffect for data fetching
useEffect(() => {
  fetchData(); // Use React Query instead!
}, []);

// ❌ Direct imports bypassing centralization
import { useEmployeesOptimized } from '@/integrations/supabase/hooks/use-employees-optimized';
// ✅ CORRECT: import { useEmployees } from '@/hooks';

// ❌ Creating basic UI components from scratch
const MyButton = ({ children }) => <button>{children}</button>;
// ✅ CORRECT: import { Button } from '@/components/ui/button';

// ❌ Manual RLS bypassing
const { data } = await supabase.from('employees').select('*'); // Ignores RLS!
// ✅ CORRECT: Use proper services with RLS validation

// ❌ Non-centralized hook exports
export { useSpecificHook } from './some-file';
// ✅ CORRECT: Export via src/hooks/index.ts only

// ❌ Direct DOM queries in tests
cy.get('.btn-primary').click();
cy.get('#employee-form').submit();
// ✅ CORRECT: cy.get('[data-testid="submit-button"]').click();

// ❌ Hardcoded waits in tests
cy.wait(3000);
// ✅ CORRECT: cy.wait('@apiCall') or cy.get('[data-testid="loading"]').should('not.exist');

// ❌ Tests without Page Object Model
cy.get('[data-testid="name-input"]').type('test');
cy.get('[data-testid="save-button"]').click();
// ✅ CORRECT: Use employeesPage.fillForm() and employeesPage.save();

// ❌ Not intercepting API calls in tests
cy.get('[data-testid="submit"]').click();
// Test continues without waiting for API
// ✅ CORRECT: Setup intercepts and cy.wait('@createEmployee');

// ❌ Using real API in tests
// Tests should NEVER hit real backend
// ✅ CORRECT: Mock all API calls with cy.intercept();

// ❌ Shared state between tests
let globalEmployee; // NEVER!
// ✅ CORRECT: Generate fresh data in each test

// ❌ Components without data-testid
<button className="save-btn">Save</button>
// ✅ CORRECT: <button data-testid="save-button">Save</button>
```

---

## 📚 **REQUIRED PATTERNS**

### **File Structure Pattern**

```typescript
// ✅ Component file structure
export function EmployeesPage() {
  // 1. Hooks
  const { data, isLoading, error } = useEmployees();
  const createEmployee = useCreateEmployee();

  // 2. Event handlers
  const handleCreate = (data: CreateEmployeePayload) => {
    createEmployee.mutate(data);
  };

  // 3. Early returns
  if (isLoading) return <EmployeesSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  // 4. Main render
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

### **Error Handling Pattern**

```typescript
// ✅ ALWAYS implement this pattern
function DataComponent() {
  const { data, isLoading, error, refetch } = useQuery(...);

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetch}
        title="Erro ao carregar dados"
      />
    );
  }

  if (isLoading) return <Skeleton />;

  return <DataView data={data} />;
}
```

### **Supabase RLS Pattern**

```sql
-- ✅ TEMPLATE for all tables
CREATE POLICY "policy_name" ON table_name
FOR ALL USING (
  company_id = (
    SELECT company_id FROM auth.users
    WHERE id = auth.uid()
  )
);

-- ✅ Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

---

## 🧪 **TESTING PATTERNS - CYPRESS**

### **Testing Architecture - CONSTITUTIONAL**

```typescript
// ✅ OBRIGATÓRIO - Page Object Model pattern
export class EmployeesPage extends BasePage {
  private readonly selectors = {
    pageContent: 'employees-page-content',
    addButton: 'employees-add-button',
    searchInput: 'employees-search-input',
    employeeRow: 'employee-row',
  } as const;

  visit(): void {
    cy.visit('/employees');
    this.isLoaded();
  }

  isLoaded(): void {
    this.waitForPageLoad();
    this.getByTestId(this.selectors.pageContent).should('be.visible');
  }

  // ✅ SEMPRE encapsular ações da página
  searchEmployee(name: string): void {
    this.getByTestId(this.selectors.searchInput).clear().type(name);
    cy.wait('@searchEmployees');
  }
}
```

### **Custom Commands - MANDATORY**

```typescript
// ✅ OBRIGATÓRIO - Reutilização via commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      loginAs(userType: 'admin' | 'manager' | 'operator'): Chainable<void>;
      fillForm(formData: Record<string, any>): Chainable<void>;
      waitForToast(type: 'success' | 'error', message?: string): Chainable<void>;
      setupApiIntercepts(): Chainable<void>;
    }
  }
}

// ✅ PATTERN para authentication
Cypress.Commands.add('loginAs', userType => {
  cy.fixture(`users/${userType}.json`).then(user => {
    cy.login(user.email, user.password);
  });
});
```

### **Data-testid ONLY Selectors**

```typescript
// ✅ ÚNICO seletor permitido
cy.get('[data-testid="employee-name-input"]').type('João');
cy.get('[data-testid="save-button"]').click();

// ❌ FORBIDDEN selectors
cy.get('.btn-primary'); // Classes CSS
cy.get('#employee-form'); // IDs
cy.get('button:nth-child(2)'); // Posição
```

### **API Intercepts - Centralized**

```typescript
// ✅ OBRIGATÓRIO - Centralized intercepts
export class ApiIntercepts {
  static setupEmployeesIntercepts(): void {
    cy.intercept('GET', '**/employees**', { fixture: 'employees/list.json' }).as('getEmployees');

    cy.intercept('POST', '**/employees**', { fixture: 'employees/created.json' }).as('createEmployee');
  }

  static setupAllIntercepts(): void {
    this.setupAuthIntercepts();
    this.setupEmployeesIntercepts();
    this.setupDashboardIntercepts();
  }
}

// ✅ USO OBRIGATÓRIO em beforeEach
beforeEach(() => {
  cy.setupApiIntercepts();
  cy.loginAs('manager');
});
```

### **Test Structure - AAA Pattern**

```typescript
// ✅ TEMPLATE OBRIGATÓRIO
describe('Employee Management', () => {
  let employeesPage: EmployeesPage;

  beforeEach(() => {
    cy.setupApiIntercepts();
    cy.loginAs('manager');
    employeesPage = new EmployeesPage();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should create employee successfully', () => {
    // ✅ ARRANGE
    const newEmployee = TestDataGenerator.generateEmployee({
      name: 'Novo Funcionário',
    });

    // ✅ ACT
    employeesPage.visit();
    employeesPage.clickAddEmployee();
    employeesPage.fillEmployeeForm(newEmployee);
    employeesPage.saveEmployee();

    // ✅ ASSERT
    cy.waitForToast('success', 'Funcionário criado com sucesso');
    employeesPage.getEmployeeRow(newEmployee.id).should('be.visible');
  });
});
```

---

## 🎯 **AI DEVELOPMENT GUIDELINES**

### **When Creating Components:**

1. ✅ Always use TypeScript with strict typing
2. ✅ Implement loading and error states
3. ✅ Use shadcn/ui components only
4. ✅ Follow the file structure pattern
5. ✅ Add proper error boundaries
6. ✅ Implement responsive design
7. ✅ Use React Query for data fetching
8. ✅ Validate all forms with Zod
9. ✅ Add data-testid attributes for testing
10. ✅ Ensure accessibility compliance

### **When Creating Tests:**

1. ✅ Use Page Object Model pattern always
2. ✅ Implement custom commands for reusability
3. ✅ Use data-testid selectors exclusively
4. ✅ Centralize API intercepts
5. ✅ Follow AAA pattern (Arrange, Act, Assert)
6. ✅ Generate test data with TestDataGenerator
7. ✅ Ensure test independence and cleanup
8. ✅ Cover critical user flows end-to-end
9. ✅ Mock all API calls with fixtures
10. ✅ Validate error scenarios and edge cases

### **When Creating Hooks:**

1. ✅ Use useOptimizedQuery for queries
2. ✅ Implement proper error handling
3. ✅ Add to centralized hooks export
4. ✅ Include staleTime for caching
5. ✅ Add proper TypeScript types
6. ✅ Handle loading states

### **When Creating Services:**

1. ✅ Use service layer pattern
2. ✅ Validate inputs with Zod
3. ✅ Implement proper error throwing
4. ✅ Use Supabase client
5. ✅ Return properly typed data
6. ✅ Handle RLS properly

### **When Creating Pages:**

1. ✅ Wrap in PageErrorBoundary
2. ✅ Use lazy loading with Suspense
3. ✅ Implement proper SEO
4. ✅ Follow responsive design
5. ✅ Include breadcrumbs
6. ✅ Add proper loading states
7. ✅ Add comprehensive data-testid attributes
8. ✅ Create corresponding Page Object Model
9. ✅ Implement critical flow tests
10. ✅ Ensure accessibility standards

### **When Writing Tests:**

1. ✅ Create Page Object Model first
2. ✅ Identify reusable custom commands
3. ✅ Plan API intercepts strategy
4. ✅ Prepare test data fixtures
5. ✅ Follow constitutional test patterns
6. ✅ Ensure test independence
7. ✅ Cover happy path and error scenarios
8. ✅ Validate performance targets
9. ✅ Implement proper cleanup
10. ✅ Document test coverage

---

## 🛡️ **QUALITY GATES**

### **Code Review Checklist:**

- [ ] TypeScript strict mode compliance
- [ ] All forms use React Hook Form + Zod
- [ ] Error boundaries implemented
- [ ] Loading states present
- [ ] Proper error handling
- [ ] shadcn/ui components used
- [ ] React Query for data fetching
- [ ] RLS policies applied
- [ ] Input validation implemented
- [ ] Responsive design verified
- [ ] Performance optimized
- [ ] No forbidden practices used
- [ ] Centralized hooks imports via @/hooks
- [ ] Services in correct directory structure
- [ ] Common components reused when available
- [ ] Proper sanitization applied
- [ ] Environment variables used for secrets
- [ ] Cypress tests implemented for critical flows
- [ ] Data-testid attributes added to components
- [ ] Page Object Model used in tests

### **File Structure Validation:**

```
✅ REQUIRED STRUCTURE:
src/
├── components/
│   ├── common/          # ✅ Reusable components (StatsCard, DataTable, etc.)
│   ├── ui/              # ✅ shadcn/ui only
│   └── [domain]/        # ✅ Domain-specific components
├── hooks/
│   └── index.ts         # ✅ SINGLE point of import
├── integrations/supabase/
│   ├── api/             # ✅ Services layer
│   └── hooks/           # ✅ Optimized hooks
├── lib/                 # ✅ Utilities
├── pages/               # ✅ Page components
└── types/               # ✅ TypeScript definitions

cypress/                 # ✅ E2E Testing (CONSTITUTIONAL)
├── e2e/                 # ✅ Tests organized by domain
├── support/
│   ├── commands/        # ✅ Custom commands by domain
│   ├── pages/           # ✅ Page Object Models
│   ├── fixtures/        # ✅ Test data
│   └── intercepts/      # ✅ API mocks centralized
```

### **Testing Strategy (Future Implementation):**

```typescript
// ✅ WHEN IMPLEMENTING TESTS:
{
  "testFramework": "Vitest + React Testing Library",
  "coverage": "Minimum 80% for critical paths",
  "testTypes": ["unit", "integration", "e2e"],
  "priorities": [
    "hooks (useAuth, useDashboard)",
    "forms validation",
    "error boundaries",
    "critical user flows"
  ]
}
```

---

## 📖 **QUICK REFERENCE**

### **Essential Commands:**

```bash
# Install dependencies
bun install

# Development server
bun dev

# Build for production
bun build

# Type checking
bun check

# Supabase local development
supabase start

# Cypress testing
cypress open              # Open test runner
cypress run               # Run tests headless
bun test:e2e             # Run E2E tests with server
```

### **Essential Imports:**

```typescript
// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Common Components (REUSE THESE!)
import { StatsCard } from '@/components/common/StatsCard';
import { SearchAndActions } from '@/components/common/SearchAndActions';
import { DataTable } from '@/components/common/DataTable';
import { EntityDialog } from '@/components/common/EntityDialog';

// Forms
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Data Fetching (CENTRALIZED!)
import { useEmployees, useCreateEmployee } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import { EmployeesService } from '@/integrations/supabase/api';

// Utilities
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { sanitizeInput, sanitizeError } from '@/lib/security';

// Testing (Cypress)
/// <reference types="cypress" />
import { BasePage } from '../support/pages/BasePage';
import { TestDataGenerator } from '../support/utils/data-generators';
import { ApiIntercepts } from '../support/intercepts/api-intercepts';
```

### **Domain Structure Reference:**

```typescript
// ✅ AVAILABLE DOMAINS:
{
  "auth": "Authentication components",
  "backoffice": "Admin/management features",
  "common": "Reusable components (StatsCard, DataTable, etc.)",
  "dashboard": "Main dashboard widgets",
  "employees": "Employee management",
  "maintenance": "Maintenance tracking",
  "operations": "Production operations",
  "rawmaterial": "Raw material management",
  "sales": "Sales tracking",
  "ui": "shadcn/ui base components",
  "vehicle": "Vehicle management",
  "wood": "Wood/fuel management"
}
```

### **Data-testid Naming Convention:**

````typescript
// ✅ OBRIGATÓRIO - Naming pattern
{
  "pages": "[domain]-page-content",
  "forms": "[domain]-form",
  "inputs": "[field-name]-input",
  "buttons": "[action]-button",
  "modals": "[purpose]-modal",
  "tables": "[domain]-table",
  "rows": "[domain]-row-[id]",
  "cards": "[domain]-card",
  "loading": "[context]-loading",
  "errors": "[context]-error"
}

// ✅ EXAMPLES:
// data-testid="employees-page-content"
// data-testid="employee-name-input"
// data-testid="save-button"
// data-testid="employee-row-123"
// data-testid="create-employee-modal"
```### **Environment Variables Reference:**

```bash
# ✅ REQUIRED ENV VARS:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=development|production

# ✅ DEPLOYMENT (Vercel):
# Same variables configured in Vercel dashboard
````

---

## 🚀 **DEPLOYMENT & TROUBLESHOOTING**

### **Deployment Rules:**

```bash
# ✅ AUTOMATIC DEPLOYMENT (Vercel)
# Push to main → Auto deploy to production
# Pull requests → Preview deployments
# Production URL: https://ceramicflow.vercel.app

# ✅ BUILD COMMANDS:
bun install    # Install dependencies
bun build      # Build for production
bun check      # TypeScript checking
```

### **Common Issues & Solutions:**

```typescript
// ❌ Problem: Module not found errors
// ✅ Solution: Check tsconfig paths and restart dev server

// ❌ Problem: Supabase connection issues
// ✅ Solution: Verify environment variables and RLS policies

// ❌ Problem: Build failures
// ✅ Solution: Fix TypeScript errors and run bun check

// ❌ Problem: Import errors
// ✅ Solution: Use centralized imports via @/hooks

// ❌ Problem: Performance issues
// ✅ Solution: Check bundle size and implement lazy loading
```

### **Performance Monitoring:**

````typescript
// ✅ BUNDLE SIZE TARGETS:
{
  "main": "< 500KB gzipped",
  "vendor": "< 300KB gzipped",
  "pages": "< 50KB each",
  "lighthouse": "> 90 performance score"
}

// ✅ TESTING PERFORMANCE TARGETS:
{
  "testSuiteExecution": "< 5 minutes full suite",
  "individualTest": "< 30 seconds per test",
  "pageLoadTime": "< 3 seconds",
  "apiResponseTime": "< 1 second (mocked)",
  "parallelization": "4 threads minimum",
  "retries": "Max 2 retries on failure"
}
```---

**🤖 IA, memorize esta constituição. Ela é a lei suprema do projeto CeramicFlow. Qualquer código que viole estas regras deve ser rejeitado imediatamente.**

**⚖️ Este documento substitui qualquer conflito com outros documentos. É a fonte única da verdade.**

**🎯 Use este guia como referência definitiva para todas as decisões de desenvolvimento.**
````
