# ⚠️ **ERROR HANDLING - CeramicFlow**

> **⚠️ CONSTITUTIONAL LAW:** Padrões obrigatórios para tratamento de erros. Sistema sem error handling adequado será rejeitado.

---

## 🛡️ **ERROR BOUNDARY CONSTITUTION**

### **Artigo I - Error Boundaries (OBRIGATÓRIO)**

#### **Global Error Boundary**

```typescript
// ✅ OBRIGATÓRIO - src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error para debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Callback customizado
    this.props.onError?.(error, errorInfo);

    // TODO: Send to error reporting service
    // errorReporting.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 text-destructive">
                <AlertTriangle className="h-full w-full" />
              </div>
              <CardTitle>Algo deu errado</CardTitle>
              <CardDescription>
                Ocorreu um erro inesperado. Nossa equipe foi notificada.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button onClick={this.handleReset} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Recarregar página
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### **Page-Level Error Boundaries**

```typescript
// ✅ OBRIGATÓRIO - Wrapper para páginas críticas
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>Página indisponível</CardTitle>
              <CardDescription>
                Esta página está temporariamente indisponível.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/dashboard">Voltar ao Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      }
      onError={(error) => {
        console.error('Page error:', error);
        // TODO: Track page-specific errors
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// ✅ USO OBRIGATÓRIO em páginas
export function EmployeesPage() {
  return (
    <PageErrorBoundary>
      <EmployeesContent />
    </PageErrorBoundary>
  );
}
```

---

## 🔧 **HOOK ERROR HANDLING**

### **Artigo II - Query Error Patterns (OBRIGATÓRIO)**

#### **Query Error Handling**

```typescript
// ✅ PADRÃO OBRIGATÓRIO para queries
export function useEmployees() {
  return useOptimizedQuery({
    queryKey: ['employees'],
    queryFn: EmployeesService.getAllEmployees,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      // Não retry em errors específicos
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// ✅ USO OBRIGATÓRIO em components
function EmployeesContent() {
  const { data: employees, isLoading, error, refetch } = useEmployees();

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetch}
        title="Erro ao carregar funcionários"
        description="Não foi possível carregar a lista de funcionários."
      />
    );
  }

  if (isLoading) {
    return <EmployeesSkeleton />;
  }

  return <EmployeesList employees={employees} />;
}
```

#### **Mutation Error Handling**

```typescript
// ✅ PADRÃO OBRIGATÓRIO para mutations
function EmployeesPage() {
  const createEmployee = useCreateEmployee();
  const { toast } = useToast();

  const handleCreate = (data: CreateEmployeePayload) => {
    createEmployee.mutate(data, {
      onSuccess: newEmployee => {
        toast({
          title: 'Funcionário criado',
          description: `${newEmployee.name} foi adicionado com sucesso.`,
        });
      },
      onError: error => {
        console.error('Create employee error:', error);

        // Error específico do servidor
        if (error.code === 'DUPLICATE_CPF') {
          toast({
            title: 'CPF já cadastrado',
            description: 'Este CPF já está cadastrado no sistema.',
            variant: 'destructive',
          });
          return;
        }

        // Error genérico
        toast({
          title: 'Erro ao criar funcionário',
          description: sanitizeError(error),
          variant: 'destructive',
        });
      },
    });
  };
}
```

---

## 📱 **UI ERROR COMPONENTS**

### **Artigo III - Error Display Components (OBRIGATÓRIO)**

#### **Generic Error Display**

```typescript
// ✅ OBRIGATÓRIO - src/components/common/ErrorDisplay.tsx
interface ErrorDisplayProps {
  error: Error | unknown;
  onRetry?: () => void;
  title?: string;
  description?: string;
  variant?: 'page' | 'inline' | 'card';
  showDetails?: boolean;
}

export function ErrorDisplay({
  error,
  onRetry,
  title = "Erro inesperado",
  description,
  variant = 'card',
  showDetails = false
}: ErrorDisplayProps) {
  const errorMessage = sanitizeError(error);
  const isNetworkError = error instanceof TypeError && error.message.includes('fetch');

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 p-2 text-sm text-destructive bg-destructive/10 rounded">
        <AlertTriangle className="h-4 w-4" />
        <span>{errorMessage}</span>
        {onRetry && (
          <Button size="sm" variant="ghost" onClick={onRetry}>
            Tentar novamente
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={variant === 'page' ? 'max-w-md mx-auto' : undefined}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 h-10 w-10 text-destructive">
          {isNetworkError ? <Wifi className="h-full w-full" /> : <AlertTriangle className="h-full w-full" />}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description || (isNetworkError
            ? "Verifique sua conexão com a internet."
            : "Algo deu errado. Tente novamente."
          )}
        </CardDescription>
      </CardHeader>
      {(onRetry || showDetails) && (
        <CardContent className="text-center space-y-2">
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          )}
          {showDetails && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Detalhes técnicos
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      )}
    </Card>
  );
}
```

#### **Form Field Error Display**

```typescript
// ✅ Já implementado via shadcn/ui FormMessage
// Usar sempre FormMessage para errors de campo
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />  {/* ✅ OBRIGATÓRIO */}
    </FormItem>
  )}
/>
```

#### **Toast Error Patterns**

```typescript
// ✅ PADRÕES OBRIGATÓRIOS para toast errors
export const errorToastPatterns = {
  // Network errors
  network: () =>
    toast({
      title: 'Problema de conexão',
      description: 'Verifique sua internet e tente novamente.',
      variant: 'destructive',
    }),

  // Validation errors
  validation: (field: string) =>
    toast({
      title: 'Dados inválidos',
      description: `Verifique o campo ${field} e tente novamente.`,
      variant: 'destructive',
    }),

  // Permission errors
  permission: () =>
    toast({
      title: 'Acesso negado',
      description: 'Você não tem permissão para esta ação.',
      variant: 'destructive',
    }),

  // Generic error
  generic: (action: string) =>
    toast({
      title: `Erro ao ${action}`,
      description: 'Algo deu errado. Tente novamente.',
      variant: 'destructive',
    }),

  // Success recovery
  retry: (action: string) =>
    toast({
      title: 'Tentando novamente',
      description: `Reaplicando ${action}...`,
    }),
};
```

---

## 🔍 **ERROR CLASSIFICATION**

### **Artigo IV - Error Types (OBRIGATÓRIO)**

```typescript
// ✅ OBRIGATÓRIO - src/lib/errors.ts
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  PERMISSION = 'PERMISSION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// ✅ Error classification helper
export const classifyError = (error: unknown): ErrorType => {
  if (error instanceof AppError) {
    return error.type;
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return ErrorType.NETWORK;
  }

  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as any).status;
    switch (status) {
      case 401:
      case 403:
        return ErrorType.PERMISSION;
      case 404:
        return ErrorType.NOT_FOUND;
      case 422:
        return ErrorType.VALIDATION;
      case 500:
      case 502:
      case 503:
        return ErrorType.SERVER;
      default:
        return ErrorType.UNKNOWN;
    }
  }

  return ErrorType.UNKNOWN;
};
```

---

## 🛠️ **ERROR UTILITIES**

### **Artigo V - Error Helpers (OBRIGATÓRIO)**

```typescript
// ✅ OBRIGATÓRIO - src/lib/error-utils.ts
export const sanitizeError = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Map common errors to user-friendly messages
    const errorMaps = {
      'fetch failed': 'Problema de conexão. Verifique sua internet.',
      'network error': 'Erro de rede. Tente novamente.',
      unauthorized: 'Acesso negado. Faça login novamente.',
      forbidden: 'Você não tem permissão para esta ação.',
      'not found': 'Recurso não encontrado.',
      'validation failed': 'Dados inválidos. Verifique os campos.',
    };

    const errorKey = Object.keys(errorMaps).find(key => error.message.toLowerCase().includes(key));

    if (errorKey) {
      return errorMaps[errorKey];
    }

    // Return generic message for unknown errors
    return 'Algo deu errado. Tente novamente.';
  }

  return 'Erro inesperado. Tente novamente.';
};

// ✅ Error logging helper
export const logError = (error: unknown, context?: string) => {
  const errorType = classifyError(error);
  const timestamp = new Date().toISOString();

  console.group(`🚨 Error [${errorType}] - ${timestamp}`);
  console.log('Context:', context);
  console.log('Error:', error);

  if (error instanceof Error) {
    console.log('Stack:', error.stack);
  }

  console.groupEnd();

  // TODO: Send to error tracking service
  // errorTracking.captureException(error, { context, errorType });
};

// ✅ Retry helper
export const withRetry = async <T>(fn: () => Promise<T>, maxAttempts: number = 3, delay: number = 1000): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        break;
      }

      // Don't retry on certain errors
      if (classifyError(error) === ErrorType.PERMISSION) {
        break;
      }

      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
};
```

---

## 🚫 **FORBIDDEN PRACTICES**

### **❌ NUNCA FAZER:**

```typescript
// ❌ Swallow errors silently
try {
  await api.create(data);
} catch (error) {
  // Silent fail - NUNCA!
}

// ❌ Generic error handling
catch (error) {
  console.log('error');  // Não informativo
  alert('Error!');       // UX ruim
}

// ❌ Expose sensitive info
catch (error) {
  toast({
    description: error.stack  // Expõe detalhes técnicos
  });
}

// ❌ No error boundaries
function App() {
  return <Router>...</Router>;  // Sem error boundary
}

// ❌ Infinite retry loops
const { data } = useQuery({
  retry: true  // Pode causar loop infinito
});
```

---

## ✅ **ERROR HANDLING CHECKLIST**

### **Component Level**

- [ ] Error boundaries implementadas
- [ ] Loading states para todas as operações
- [ ] Error displays apropriados
- [ ] Retry mechanisms onde apropriado
- [ ] Toast notifications para feedback

### **Hook Level**

- [ ] Queries com retry strategy
- [ ] Mutations com error callbacks
- [ ] Error classification implementada
- [ ] Logging apropriado
- [ ] Sanitização de errors

### **Global Level**

- [ ] App-level error boundary
- [ ] Error tracking configurado
- [ ] Fallback pages implementadas
- [ ] Network error handling
- [ ] Session error handling

---

## 📊 **ERROR MONITORING**

### **Artigo VI - Error Tracking (Futuro)**

```typescript
// ✅ Preparado para error tracking
export const errorTracking = {
  captureException: (error: Error, context?: any) => {
    // TODO: Integrate with Sentry or similar
    console.error('Captured exception:', error, context);
  },

  captureMessage: (message: string, level: 'info' | 'warning' | 'error') => {
    // TODO: Integrate with logging service
    console.log(`[${level.toUpperCase()}] ${message}`);
  },

  setContext: (key: string, value: any) => {
    // TODO: Set error context
    console.log(`Setting context: ${key}`, value);
  },
};
```

---

**⚠️ Todo erro no sistema DEVE ser tratado adequadamente. Sistemas sem error handling robusto serão rejeitados.**
