# 🧪 **Estratégia de Testes - CeramicFlow**

> **Status:** Não implementado
>
> Este projeto atualmente não possui infraestrutura de testes configurada. Este documento serve como referência para implementação futura.

## 📋 **Estado Atual**

- ❌ **Testes Unitários:** Não configurado
- ❌ **Testes de Integração:** Não implementado
- ❌ **Testes E2E:** Não implementado
- ❌ **Testes de Componentes:** Não implementado
- ❌ **Coverage Reports:** Não disponível

---

## 🎯 **Roadmap de Implementação**

### **Fase 1: Setup Básico**

- [ ] Configurar Vitest + Testing Library
- [ ] Setup para testes de componentes React
- [ ] Configurar coverage reports

### **Fase 2: Testes Core**

- [ ] Testes para hooks principais (useAuth, useDashboard)
- [ ] Testes para utils críticos
- [ ] Testes para componentes UI base

### **Fase 3: Testes Avançados**

- [ ] Testes de integração com Supabase
- [ ] E2E com Playwright
- [ ] Performance testing

---

## 🔧 **Configuração Sugerida (Futuro)**

```bash
# Instalar dependências de teste (quando implementar)
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw playwright
```

---

**Para implementar testes:** Consulte a documentação oficial do Vitest e React Testing Library e configure conforme necessidades do projeto.

````

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// MSW setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
````

## 🧩 **Testes de Componentes**

### **Componente Simples**

```typescript
// src/components/common/__tests__/StatsCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatsCard } from '../StatsCard';
import { Users } from 'lucide-react';

describe('StatsCard', () => {
  it('renders title and value correctly', () => {
    render(
      <StatsCard
        title="Total Funcionários"
        value={42}
        icon={Users}
      />
    );

    expect(screen.getByText('Total Funcionários')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('formats value with custom formatter', () => {
    render(
      <StatsCard
        title="Consumo"
        value={1500.5}
        unit="m³"
        valueFormatter={(value) => Number(value).toFixed(1)}
        icon={Users}
      />
    );

    expect(screen.getByText('1500.5')).toBeInTheDocument();
    expect(screen.getByText('m³')).toBeInTheDocument();
  });
});
```

### **Componente com Estado**

```typescript
// src/components/common/__tests__/DataTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DataTable } from '../DataTable';

const mockData = [
  { id: '1', name: 'João Silva', role: 'Operador' },
  { id: '2', name: 'Maria Santos', role: 'Supervisora' },
];

const mockColumns = [
  { key: 'name', label: 'Nome' },
  { key: 'role', label: 'Função' },
];

describe('DataTable', () => {
  it('renders data correctly', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
      />
    );

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
  });

  it('executes action when button is clicked', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn();

    const actions = [
      {
        label: 'Editar',
        onClick: mockAction,
      },
    ];

    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        actions={actions}
      />
    );

    const editButtons = screen.getAllByText('Editar');
    await user.click(editButtons[0]);

    expect(mockAction).toHaveBeenCalledWith(mockData[0]);
  });

  it('shows empty message when no data', () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        emptyMessage="Nenhum dado encontrado"
      />
    );

    expect(screen.getByText('Nenhum dado encontrado')).toBeInTheDocument();
  });
});
```

## 🎣 **Testes de Hooks**

### **Hook Customizado**

```typescript
// src/hooks/__tests__/useMonthFilter.test.tsx
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMonthFilter } from '../useMonthFilter';

describe('useMonthFilter', () => {
  it('initializes with current month', () => {
    const { result } = renderHook(() => useMonthFilter());

    const currentMonth = new Date().getMonth() + 1;
    expect(result.current.selectedMonth).toBe(currentMonth);
  });

  it('updates selected month', () => {
    const { result } = renderHook(() => useMonthFilter());

    act(() => {
      result.current.setSelectedMonth(6);
    });

    expect(result.current.selectedMonth).toBe(6);
  });

  it('provides correct month name', () => {
    const { result } = renderHook(() => useMonthFilter());

    act(() => {
      result.current.setSelectedMonth(1);
    });

    expect(result.current.monthName).toBe('Janeiro');
  });
});
```

### **Hook com React Query**

```typescript
// src/hooks/__tests__/useEmployees.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect } from 'vitest';
import { useEmployees } from '../index';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useEmployees', () => {
  it('fetches employees successfully', async () => {
    const { result } = renderHook(() => useEmployees(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});
```

## 🌐 **Mocks e Fixtures**

### **Mock do Supabase**

```typescript
// src/__mocks__/supabase.ts
import { vi } from 'vitest';

export const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => ({
          data: { id: '1', name: 'Test' },
          error: null,
        })),
      })),
    })),
  })),
  auth: {
    getSession: vi.fn(() => ({
      data: {
        session: {
          user: { id: 'user-1' },
        },
      },
    })),
  },
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));
```

### **MSW Handlers**

```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('*/rest/v1/employees', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: 'João Silva', role: 'Operador' },
        { id: '2', name: 'Maria Santos', role: 'Supervisora' },
      ])
    );
  }),

  rest.post('*/rest/v1/employees', (req, res, ctx) => {
    return res(ctx.json({ id: '3', name: 'Novo Funcionário', role: 'Operador' }));
  }),
];
```

## 📄 **Testes de Páginas**

### **Página Completa**

```typescript
// src/pages/__tests__/Employees.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { EmployeesPage } from '../Employees';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('EmployeesPage', () => {
  it('renders page title and subtitle', () => {
    render(<EmployeesPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Funcionários')).toBeInTheDocument();
    expect(screen.getByText('Gestão de Funcionários')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<EmployeesPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('displays employees data when loaded', async () => {
    render(<EmployeesPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });
  });
});
```

## 🔧 **Testes de Utilidades**

### **Funções Puras**

```typescript
// src/utils/__tests__/auth.test.ts
import { describe, it, expect } from 'vitest';
import { validatePassword, formatDate } from '../auth';

describe('auth utilities', () => {
  describe('validatePassword', () => {
    it('returns true for valid password', () => {
      expect(validatePassword('ValidPass123!')).toBe(true);
    });

    it('returns false for short password', () => {
      expect(validatePassword('123')).toBe(false);
    });

    it('returns false for password without special characters', () => {
      expect(validatePassword('ValidPass123')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2025-01-15');
      expect(formatDate(date)).toBe('15/01/2025');
    });

    it('handles invalid date', () => {
      expect(formatDate(null)).toBe('-');
    });
  });
});
```

## 🚀 **Testes E2E com Playwright**

### **Configuração Playwright**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### **Teste E2E**

```typescript
// e2e/employees.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Employees Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should create new employee', async ({ page }) => {
    await page.goto('/employees');

    await page.click('[data-testid="new-employee-button"]');
    await page.fill('[data-testid="employee-name"]', 'João Silva');
    await page.selectOption('[data-testid="employee-role"]', 'Operador');
    await page.click('[data-testid="save-employee"]');

    await expect(page.locator('text=João Silva')).toBeVisible();
  });

  test('should edit existing employee', async ({ page }) => {
    await page.goto('/employees');

    await page.click('[data-testid="edit-employee-1"]');
    await page.fill('[data-testid="employee-name"]', 'João Santos');
    await page.click('[data-testid="save-employee"]');

    await expect(page.locator('text=João Santos')).toBeVisible();
  });
});
```

## 📊 **Comandos de Teste**

### **Desenvolvimento**

```bash
# Executar todos os testes
npm run test

# Testes em modo watch
npm run test:watch

# Testes específicos
npm run test employees

# Coverage report
npm run test:coverage
```

### **CI/CD**

```bash
# Testes unitários
npm run test:ci

# Testes E2E
npm run test:e2e

# Todos os testes
npm run test:all
```

## 📈 **Métricas de Coverage**

### **Targets de Coverage**

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

### **Prioridade de Testes**

1. **Utils e helpers** - 90%+ coverage
2. **Hooks customizados** - 85%+ coverage
3. **Componentes críticos** - 80%+ coverage
4. **Páginas principais** - 70%+ coverage

## ✅ **Checklist de Testes**

### **Para Novos Componentes**

- [ ] Renderização básica
- [ ] Props são aplicadas corretamente
- [ ] Estados de loading e erro
- [ ] Interações do usuário
- [ ] Responsividade (se aplicável)

### **Para Novos Hooks**

- [ ] Valor inicial correto
- [ ] Atualizações de estado
- [ ] Efeitos colaterais
- [ ] Cleanup (se aplicável)

### **Para Novas Páginas**

- [ ] Renderização de elementos principais
- [ ] Estados de loading
- [ ] Integração com APIs
- [ ] Fluxo completo do usuário

## 🚫 **Anti-padrões**

### **Evitar**

```typescript
// ❌ Testar implementação em vez de comportamento
expect(component.state.count).toBe(1);

// ❌ Mocks desnecessários
vi.mock('entire-library');

// ❌ Testes muito específicos
expect(element).toHaveClass('text-red-500 font-bold text-lg');
```

### **Preferir**

```typescript
// ✅ Testar comportamento do usuário
expect(screen.getByText('1')).toBeInTheDocument();

// ✅ Mocks pontuais
vi.mock('@/api/employees', () => ({ getEmployees: vi.fn() }));

// ✅ Testes semânticos
expect(screen.getByRole('button', { name: /salvar/i })).toBeEnabled();
```

---

Esta estratégia de testes garante **qualidade**, **confiabilidade** e **manutenibilidade** do código, focando nos aspectos mais importantes para a experiência do usuário.
