# 🧪 **LEIS CONSTITUCIONAIS DE TESTES CYPRESS - CeramicFlow**

> **⚠️ CONSTITUTIONAL LAW:** Estas são as leis INVIOLÁVEIS para testes E2E. Qualquer violação resultará em rejeição automática.

---

## 🏛️ **CONSTITUIÇÃO DOS TESTES**

### **⚖️ PRINCÍPIOS FUNDAMENTAIS**

1. **DRY (Don't Repeat Yourself) é LEI SUPREMA**
2. **Page Object Model é OBRIGATÓRIO**
3. **Custom Commands são MANDATÓRIOS para reutilização**
4. **Data-testid é o ÚNICO seletor permitido**
5. **Testes devem ser independentes SEMPRE**
6. **Performance é prioridade constitucional**
7. **Intercepts devem ser centralizados**

---

## 🎯 **ARQUITETURA OBRIGATÓRIA**

### **Estrutura de Diretórios (SACRED)**

```
cypress/
├── e2e/                           # Testes E2E organizados por fluxo
│   ├── auth/
│   │   ├── login.cy.ts
│   │   └── logout.cy.ts
│   ├── dashboard/
│   │   └── overview.cy.ts
│   ├── employees/
│   │   ├── crud-operations.cy.ts
│   │   └── bulk-actions.cy.ts
│   └── critical-flows/
│       ├── employee-creation-flow.cy.ts
│       └── sales-reporting-flow.cy.ts
├── support/
│   ├── commands/                  # Custom commands por domínio
│   │   ├── auth-commands.ts
│   │   ├── employee-commands.ts
│   │   ├── form-commands.ts
│   │   └── ui-commands.ts
│   ├── pages/                     # Page Object Models
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   └── EmployeesPage.ts
│   ├── fixtures/                  # Dados de teste
│   │   ├── users.json
│   │   ├── employees.json
│   │   └── test-data.json
│   ├── intercepts/                # API Intercepts centralizados
│   │   ├── auth-intercepts.ts
│   │   └── api-intercepts.ts
│   ├── utils/                     # Utilities para testes
│   │   ├── data-generators.ts
│   │   ├── assertions.ts
│   │   └── helpers.ts
│   ├── commands.ts                # Export central de commands
│   └── e2e.ts                     # Setup global
└── cypress.config.ts              # Configuração
```

---

## 🔧 **PAGE OBJECT MODEL - OBRIGATÓRIO**

### **Artigo I - Base Page Pattern (CONSTITUTIONAL)**

```typescript
// ✅ OBRIGATÓRIO - cypress/support/pages/BasePage.ts
export abstract class BasePage {
  protected readonly baseUrl = Cypress.config('baseUrl');

  // ✅ OBRIGATÓRIO - Todos os seletores via data-testid
  protected getByTestId(testId: string): Cypress.Chainable {
    return cy.get(`[data-testid="${testId}"]`);
  }

  // ✅ OBRIGATÓRIO - Loading states
  protected waitForPageLoad(): void {
    cy.get('[data-testid="page-loading"]').should('not.exist');
    cy.get('[data-testid="page-content"]').should('be.visible');
  }

  // ✅ OBRIGATÓRIO - Error handling
  protected checkForErrors(): void {
    cy.get('[data-testid="error-message"]').should('not.exist');
  }

  // ✅ OBRIGATÓRIO - Toast notifications
  protected checkSuccessToast(message: string): void {
    cy.get('[data-testid="toast-success"]').should('be.visible').and('contain.text', message);
  }

  protected checkErrorToast(message: string): void {
    cy.get('[data-testid="toast-error"]').should('be.visible').and('contain.text', message);
  }

  // ✅ OBRIGATÓRIO - Navigation
  abstract visit(): void;
  abstract isLoaded(): void;
}
```

### **Artigo II - Specific Page Implementation (TEMPLATE)**

```typescript
// ✅ TEMPLATE OBRIGATÓRIO - cypress/support/pages/EmployeesPage.ts
import { BasePage } from './BasePage';

export class EmployeesPage extends BasePage {
  private readonly selectors = {
    // ✅ OBRIGATÓRIO - Centralized selectors
    pageContent: 'employees-page-content',
    searchInput: 'employees-search-input',
    addButton: 'employees-add-button',
    employeeRow: 'employee-row',
    editButton: 'employee-edit-button',
    deleteButton: 'employee-delete-button',
    confirmDialog: 'confirm-delete-dialog',
    employeeForm: 'employee-form',
    nameInput: 'employee-name-input',
    emailInput: 'employee-email-input',
    roleSelect: 'employee-role-select',
    saveButton: 'employee-save-button',
    cancelButton: 'employee-cancel-button',
  } as const;

  visit(): void {
    cy.visit('/employees');
    this.isLoaded();
  }

  isLoaded(): void {
    this.waitForPageLoad();
    this.getByTestId(this.selectors.pageContent).should('be.visible');
    this.checkForErrors();
  }

  // ✅ OBRIGATÓRIO - Métodos específicos da página
  searchEmployee(name: string): void {
    this.getByTestId(this.selectors.searchInput).clear().type(name);

    // ✅ Wait for search results
    cy.wait('@searchEmployees');
  }

  clickAddEmployee(): void {
    this.getByTestId(this.selectors.addButton).click();
    this.getByTestId(this.selectors.employeeForm).should('be.visible');
  }

  fillEmployeeForm(employee: EmployeeData): void {
    this.getByTestId(this.selectors.nameInput).clear().type(employee.name);
    this.getByTestId(this.selectors.emailInput).clear().type(employee.email);
    this.getByTestId(this.selectors.roleSelect).select(employee.role);
  }

  saveEmployee(): void {
    this.getByTestId(this.selectors.saveButton).click();
    cy.wait('@createEmployee');
    this.checkSuccessToast('Funcionário criado com sucesso');
  }

  getEmployeeRow(employeeId: string): Cypress.Chainable {
    return this.getByTestId(`${this.selectors.employeeRow}-${employeeId}`);
  }

  editEmployee(employeeId: string): void {
    this.getEmployeeRow(employeeId).find(`[data-testid="${this.selectors.editButton}"]`).click();

    this.getByTestId(this.selectors.employeeForm).should('be.visible');
  }

  deleteEmployee(employeeId: string): void {
    this.getEmployeeRow(employeeId).find(`[data-testid="${this.selectors.deleteButton}"]`).click();

    this.getByTestId(this.selectors.confirmDialog).should('be.visible');
    this.getByTestId('confirm-delete-button').click();

    cy.wait('@deleteEmployee');
    this.checkSuccessToast('Funcionário excluído com sucesso');
  }
}
```

---

## 🛠️ **CUSTOM COMMANDS - MANDATÓRIOS**

### **Artigo III - Authentication Commands (SUPREME)**

```typescript
// ✅ OBRIGATÓRIO - cypress/support/commands/auth-commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      loginAs(userType: 'admin' | 'manager' | 'operator'): Chainable<void>;
      logout(): Chainable<void>;
      checkAuthState(expected: 'authenticated' | 'unauthenticated'): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email?: string, password?: string) => {
  const credentials = {
    email: email || Cypress.env('TEST_USER_EMAIL'),
    password: password || Cypress.env('TEST_USER_PASSWORD'),
  };

  // ✅ OBRIGATÓRIO - Intercept auth requests
  cy.intercept('POST', '**/auth/v1/token**', { fixture: 'auth/login-response.json' }).as('login');

  cy.visit('/login');
  cy.get('[data-testid="login-email-input"]').type(credentials.email);
  cy.get('[data-testid="login-password-input"]').type(credentials.password);
  cy.get('[data-testid="login-submit-button"]').click();

  cy.wait('@login');
  cy.url().should('not.include', '/login');
  cy.get('[data-testid="user-menu"]').should('be.visible');
});

Cypress.Commands.add('loginAs', (userType: 'admin' | 'manager' | 'operator') => {
  // ✅ OBRIGATÓRIO - Use fixtures for different user types
  cy.fixture(`users/${userType}.json`).then(user => {
    cy.login(user.email, user.password);
  });
});

Cypress.Commands.add('logout', () => {
  cy.intercept('POST', '**/auth/v1/logout**').as('logout');

  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();

  cy.wait('@logout');
  cy.url().should('include', '/login');
});

Cypress.Commands.add('checkAuthState', (expected: 'authenticated' | 'unauthenticated') => {
  if (expected === 'authenticated') {
    cy.get('[data-testid="user-menu"]').should('be.visible');
    cy.url().should('not.include', '/login');
  } else {
    cy.url().should('include', '/login');
    cy.get('[data-testid="login-form"]').should('be.visible');
  }
});
```

### **Artigo IV - Form Commands (CONSTITUTIONAL)**

```typescript
// ✅ OBRIGATÓRIO - cypress/support/commands/form-commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      fillForm(formData: Record<string, any>, formTestId?: string): Chainable<void>;
      submitForm(formTestId?: string): Chainable<void>;
      checkFormValidation(fieldTestId: string, expectedError: string): Chainable<void>;
      resetForm(formTestId?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('fillForm', (formData: Record<string, any>, formTestId = 'form') => {
  cy.get(`[data-testid="${formTestId}"]`).within(() => {
    Object.entries(formData).forEach(([field, value]) => {
      const selector = `[data-testid="${field}-input"], [data-testid="${field}-select"], [data-testid="${field}-textarea"]`;

      cy.get(selector).then($el => {
        const tagName = $el.prop('tagName').toLowerCase();
        const type = $el.attr('type');

        if (tagName === 'select') {
          cy.wrap($el).select(value);
        } else if (type === 'checkbox') {
          if (value) cy.wrap($el).check();
          else cy.wrap($el).uncheck();
        } else if (type === 'radio') {
          cy.wrap($el).check();
        } else {
          cy.wrap($el).clear().type(value);
        }
      });
    });
  });
});

Cypress.Commands.add('submitForm', (formTestId = 'form') => {
  cy.get(`[data-testid="${formTestId}"]`).within(() => {
    cy.get('[data-testid*="submit"], [data-testid*="save"]').click();
  });
});

Cypress.Commands.add('checkFormValidation', (fieldTestId: string, expectedError: string) => {
  cy.get(`[data-testid="${fieldTestId}-error"]`).should('be.visible').and('contain.text', expectedError);
});
```

### **Artigo V - UI Commands (SUPREME)**

```typescript
// ✅ OBRIGATÓRIO - cypress/support/commands/ui-commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      waitForToast(type: 'success' | 'error', message?: string): Chainable<void>;
      dismissToast(): Chainable<void>;
      waitForModal(testId: string): Chainable<void>;
      closeModal(testId?: string): Chainable<void>;
      waitForTable(testId?: string): Chainable<void>;
      checkTableRowCount(expectedCount: number, testId?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('waitForToast', (type: 'success' | 'error', message?: string) => {
  const selector = `[data-testid="toast-${type}"]`;
  cy.get(selector).should('be.visible');

  if (message) {
    cy.get(selector).should('contain.text', message);
  }
});

Cypress.Commands.add('waitForModal', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).should('be.visible');
  cy.get('[data-testid="modal-backdrop"]').should('be.visible');
});

Cypress.Commands.add('closeModal', (testId?: string) => {
  if (testId) {
    cy.get(`[data-testid="${testId}"]`).within(() => {
      cy.get('[data-testid="modal-close"], [data-testid="cancel-button"]').click();
    });
  } else {
    cy.get('[data-testid="modal-close"], [data-testid="cancel-button"]').first().click();
  }
});

Cypress.Commands.add('waitForTable', (testId = 'data-table') => {
  cy.get(`[data-testid="${testId}"]`).should('be.visible');
  cy.get(`[data-testid="${testId}"] [data-testid="table-loading"]`).should('not.exist');
});

Cypress.Commands.add('checkTableRowCount', (expectedCount: number, testId = 'data-table') => {
  cy.get(`[data-testid="${testId}"] tbody tr`).should('have.length', expectedCount);
});
```

---

## 🔄 **API INTERCEPTS - CENTRALIZADOS**

### **Artigo VI - Intercept Management (CONSTITUTIONAL)**

```typescript
// ✅ OBRIGATÓRIO - cypress/support/intercepts/api-intercepts.ts
export class ApiIntercepts {
  // ✅ OBRIGATÓRIO - Centralized intercept setup
  static setupEmployeesIntercepts(): void {
    cy.intercept('GET', '**/employees**', { fixture: 'employees/list.json' }).as('getEmployees');

    cy.intercept('POST', '**/employees**', { fixture: 'employees/created.json' }).as('createEmployee');

    cy.intercept('PUT', '**/employees/**', { fixture: 'employees/updated.json' }).as('updateEmployee');

    cy.intercept('DELETE', '**/employees/**', { statusCode: 204 }).as('deleteEmployee');

    cy.intercept('GET', '**/employees?search=**', { fixture: 'employees/search-results.json' }).as('searchEmployees');
  }

  static setupDashboardIntercepts(): void {
    cy.intercept('GET', '**/dashboard/overview**', { fixture: 'dashboard/overview.json' }).as('getDashboardOverview');

    cy.intercept('GET', '**/dashboard/stats**', { fixture: 'dashboard/stats.json' }).as('getDashboardStats');
  }

  static setupAuthIntercepts(): void {
    cy.intercept('POST', '**/auth/v1/token**', { fixture: 'auth/login-response.json' }).as('login');

    cy.intercept('POST', '**/auth/v1/logout**', { statusCode: 200 }).as('logout');

    cy.intercept('GET', '**/auth/v1/user**', { fixture: 'auth/user-profile.json' }).as('getUserProfile');
  }

  // ✅ OBRIGATÓRIO - Setup all intercepts
  static setupAllIntercepts(): void {
    this.setupAuthIntercepts();
    this.setupEmployeesIntercepts();
    this.setupDashboardIntercepts();
  }
}

// ✅ OBRIGATÓRIO - Auto-setup in beforeEach
Cypress.Commands.add('setupApiIntercepts', () => {
  ApiIntercepts.setupAllIntercepts();
});
```

---

## 📋 **TEST DATA MANAGEMENT**

### **Artigo VII - Fixtures Pattern (SUPREME)**

```typescript
// ✅ OBRIGATÓRIO - cypress/support/utils/data-generators.ts
export class TestDataGenerator {
  static generateEmployee(overrides?: Partial<EmployeeData>): EmployeeData {
    return {
      id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `Test Employee ${Date.now()}`,
      email: `test.employee.${Date.now()}@example.com`,
      cpf: this.generateCPF(),
      role: 'OPERATOR',
      company_id: 'test-company-id',
      created_at: new Date().toISOString(),
      ...overrides,
    };
  }

  static generateCPF(): string {
    // ✅ Generate valid test CPF
    return '12345678901';
  }

  static generateUniqueEmail(): string {
    return `test.${Date.now()}.${Math.random().toString(36).substr(2, 5)}@example.com`;
  }

  // ✅ OBRIGATÓRIO - Bulk data generation
  static generateEmployees(count: number): EmployeeData[] {
    return Array.from({ length: count }, (_, index) =>
      this.generateEmployee({ name: `Employee ${index + 1}` })
    );
  }
}

// ✅ OBRIGATÓRIO - Fixtures structure
// cypress/fixtures/employees/list.json
{
  "data": [
    {
      "id": "emp_1",
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "MANAGER"
    }
  ],
  "count": 1,
  "page": 1,
  "totalPages": 1
}
```

---

## 🧪 **TEST PATTERNS**

### **Artigo VIII - Test Structure (CONSTITUTIONAL)**

```typescript
// ✅ TEMPLATE OBRIGATÓRIO para testes
describe('Employees CRUD Operations', () => {
  let employeesPage: EmployeesPage;

  beforeEach(() => {
    // ✅ OBRIGATÓRIO - Setup intercepts
    cy.setupApiIntercepts();

    // ✅ OBRIGATÓRIO - Auth state
    cy.loginAs('manager');

    // ✅ OBRIGATÓRIO - Page object instance
    employeesPage = new EmployeesPage();
  });

  afterEach(() => {
    // ✅ OBRIGATÓRIO - Cleanup
    cy.logout();
  });

  describe('Employee Creation', () => {
    it('should create employee successfully', () => {
      // ✅ OBRIGATÓRIO - Arrange
      const newEmployee = TestDataGenerator.generateEmployee({
        name: 'Novo Funcionário',
        email: 'novo.funcionario@example.com',
      });

      // ✅ OBRIGATÓRIO - Act
      employeesPage.visit();
      employeesPage.clickAddEmployee();
      employeesPage.fillEmployeeForm(newEmployee);
      employeesPage.saveEmployee();

      // ✅ OBRIGATÓRIO - Assert
      cy.waitForToast('success', 'Funcionário criado com sucesso');
      employeesPage.getEmployeeRow(newEmployee.id).should('be.visible');
    });

    it('should validate required fields', () => {
      employeesPage.visit();
      employeesPage.clickAddEmployee();

      // ✅ OBRIGATÓRIO - Test form submission without data
      cy.submitForm('employee-form');

      // ✅ OBRIGATÓRIO - Check validation messages
      cy.checkFormValidation('employee-name', 'Nome é obrigatório');
      cy.checkFormValidation('employee-email', 'Email é obrigatório');
    });
  });

  describe('Employee Search', () => {
    it('should filter employees by name', () => {
      employeesPage.visit();
      employeesPage.searchEmployee('João');

      cy.waitForTable();
      cy.checkTableRowCount(1);
      employeesPage.getEmployeeRow('emp_1').should('contain.text', 'João');
    });
  });
});
```

### **Artigo IX - Critical Flows (SUPREME)**

```typescript
// ✅ OBRIGATÓRIO - cypress/e2e/critical-flows/employee-management-flow.cy.ts
describe('Critical Flow: Complete Employee Management', () => {
  it('should complete full employee lifecycle', () => {
    // ✅ OBRIGATÓRIO - End-to-end critical path
    cy.setupApiIntercepts();
    cy.loginAs('admin');

    const employee = TestDataGenerator.generateEmployee();
    const employeesPage = new EmployeesPage();

    // Create employee
    employeesPage.visit();
    employeesPage.clickAddEmployee();
    employeesPage.fillEmployeeForm(employee);
    employeesPage.saveEmployee();

    // Edit employee
    const updatedData = { ...employee, name: 'Updated Name' };
    employeesPage.editEmployee(employee.id);
    employeesPage.fillEmployeeForm(updatedData);
    employeesPage.saveEmployee();

    // Verify update
    employeesPage.getEmployeeRow(employee.id).should('contain.text', 'Updated Name');

    // Delete employee
    employeesPage.deleteEmployee(employee.id);
    employeesPage.getEmployeeRow(employee.id).should('not.exist');

    cy.logout();
  });
});
```

---

## ⚙️ **CONFIGURAÇÃO CYPRESS**

### **Artigo X - cypress.config.ts (CONSTITUTIONAL)**

```typescript
// ✅ OBRIGATÓRIO - cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // ✅ OBRIGATÓRIO - Base configuration
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,

    // ✅ OBRIGATÓRIO - Test isolation
    testIsolation: true,

    // ✅ OBRIGATÓRIO - Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,

    // ✅ OBRIGATÓRIO - Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // ✅ OBRIGATÓRIO - Video and screenshots
    video: true,
    screenshotOnRunFailure: true,

    // ✅ OBRIGATÓRIO - Test files pattern
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    setupNodeEvents(on, config) {
      // ✅ OBRIGATÓRIO - Environment setup
      config.env = {
        ...config.env,
        TEST_USER_EMAIL: process.env.CYPRESS_TEST_USER_EMAIL || 'test@example.com',
        TEST_USER_PASSWORD: process.env.CYPRESS_TEST_USER_PASSWORD || 'password123',
      };

      return config;
    },
  },

  // ✅ OBRIGATÓRIO - Component testing (future)
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
});
```

---

## 🚫 **FORBIDDEN PRACTICES**

### **❌ NUNCA FAZER:**

```typescript
// ❌ Direct DOM queries without data-testid
cy.get('.btn-primary').click();
cy.get('#employee-form').submit();

// ❌ Hardcoded waits
cy.wait(3000);

// ❌ Multiple assertions in single test without context
it('should do everything', () => {
  // Testing login, CRUD, navigation all together
});

// ❌ Not using Page Object Model
cy.get('[data-testid="name-input"]').type('test');
cy.get('[data-testid="save-button"]').click();

// ❌ Not intercepting API calls
cy.get('[data-testid="submit"]').click();
// Test continues without waiting for API

// ❌ Using real API in tests
// Tests should never hit real backend

// ❌ Shared state between tests
let globalEmployee; // NEVER!

// ❌ Not cleaning up after tests
// Each test should start fresh

// ❌ Complex selectors
cy.get('div > form > div:nth-child(2) input');

// ❌ Testing implementation details
cy.get('[data-testid="component"]').should('have.class', 'specific-class');
```

---

## ✅ **TESTING CHECKLIST**

### **Before Writing Tests:**

- [ ] Page Object Model created
- [ ] Custom commands identified
- [ ] API intercepts planned
- [ ] Test data fixtures prepared
- [ ] Data-testids added to components

### **Test Implementation:**

- [ ] Uses Page Object Model
- [ ] Follows AAA pattern (Arrange, Act, Assert)
- [ ] Tests are independent
- [ ] API calls intercepted
- [ ] Proper assertions
- [ ] Error scenarios covered
- [ ] Loading states verified

### **Test Quality:**

- [ ] No flaky tests
- [ ] Fast execution
- [ ] Clear test descriptions
- [ ] Proper cleanup
- [ ] Maintainable code
- [ ] No code duplication

---

## 📊 **PERFORMANCE TARGETS**

### **Artigo XI - Performance Constitution**

```typescript
// ✅ OBRIGATÓRIO - Performance targets
{
  "testSuiteExecution": "< 5 minutes full suite",
  "individualTest": "< 30 seconds per test",
  "pageLoadTime": "< 3 seconds",
  "apiResponseTime": "< 1 second (mocked)",
  "parallelization": "4 threads minimum",
  "retries": "Max 2 retries on failure"
}
```

---

## 🔄 **CI/CD INTEGRATION**

### **Artigo XII - Pipeline Constitution**

```bash
# ✅ OBRIGATÓRIO - Package.json scripts
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:run:headless": "cypress run --headless",
    "cypress:run:chrome": "cypress run --browser chrome",
    "test:e2e": "start-server-and-test dev http://localhost:5173 cypress:run",
    "test:e2e:ci": "start-server-and-test preview http://localhost:4173 cypress:run:headless"
  }
}

# ✅ OBRIGATÓRIO - CI Pipeline
# .github/workflows/cypress.yml
name: Cypress Tests
on: [push, pull_request]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v5
        with:
          build: bun build
          start: bun preview
          wait-on: 'http://localhost:4173'
          wait-on-timeout: 120
          browser: chrome
          record: true
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

---

**⚠️ Estas leis são INVIOLÁVEIS. Todo teste deve seguir estes padrões. Qualquer violação resultará em rejeição automática.**

**🎯 Testes são a GARANTIA de qualidade. Eles devem ser tratados com o mesmo rigor do código de produção.**

**🛡️ A qualidade dos testes define a qualidade do produto. Não existem exceções.**
