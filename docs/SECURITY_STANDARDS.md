# 🔒 **SECURITY STANDARDS - CeramicFlow**

> **⚠️ CONSTITUTIONAL LAW:** Estas são as leis de segurança INVIOLÁVEIS. Qualquer violação resultará em rejeição automática.

---

## 🏛️ **VALIDATION CONSTITUTION**

### **Artigo I - Input Validation Obrigatória**

#### **📋 Zod Schema Requirements (OBRIGATÓRIO)**

```typescript
// ✅ OBRIGATÓRIO - Todo input deve ter schema
import { z } from 'zod';

// Template para entidades
const createEmployeeSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome não pode exceder 100 caracteres').trim(),
  role: z.enum(['admin', 'manager', 'operator']),
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve ter 11 dígitos')
    .optional(),
  email: z.string().email('Email inválido').toLowerCase().optional(),
  ceramic_id: z.string().uuid('ID inválido'),
});

const updateEmployeeSchema = createEmployeeSchema.partial();
```

#### **🔧 Form Integration (OBRIGATÓRIO)**

```typescript
// ✅ PADRÃO OBRIGATÓRIO para todos os forms
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function EmployeeForm() {
  const form = useForm<CreateEmployeePayload>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      name: '',
      role: 'operator',
      ceramic_id: ''
    }
  });

  const onSubmit = (data: CreateEmployeePayload) => {
    // Data já está validada e sanitizada
    createEmployee.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

### **Artigo II - API Validation (OBRIGATÓRIO)**

```typescript
// ✅ Services DEVEM validar payloads
export class EmployeesService {
  static async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    // OBRIGATÓRIO: Validate antes de enviar
    const validatedPayload = createEmployeeSchema.parse(payload);

    const { data, error } = await supabase.from('employees').insert([validatedPayload]).select().single();

    if (error) throw new Error(error.message);
    return data;
  }
}
```

---

## 🛡️ **SANITIZATION BILL OF RIGHTS**

### **Artigo III - Input Sanitization (OBRIGATÓRIO)**

#### **String Sanitization**

```typescript
// ✅ OBRIGATÓRIO - Utility para sanitização
export const sanitizeInput = {
  // Trim all strings
  text: (input: string): string => input.trim(),

  // Remove HTML tags
  textContent: (input: string): string => input.replace(/<[^>]*>/g, '').trim(),

  // Sanitize for search
  search: (input: string): string =>
    input
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/gi, ''),

  // Sanitize CPF/CNPJ
  document: (input: string): string => input.replace(/\D/g, ''),

  // Sanitize phone
  phone: (input: string): string => input.replace(/\D/g, '').substring(0, 11),
};

// ✅ USO OBRIGATÓRIO em Zod schemas
const employeeSchema = z.object({
  name: z.string().transform(sanitizeInput.text),
  cpf: z.string().transform(sanitizeInput.document).optional(),
  contact: z.string().transform(sanitizeInput.phone).optional(),
});
```

#### **File Upload Sanitization**

```typescript
// ✅ OBRIGATÓRIO para uploads
const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'Arquivo muito grande')
    .refine(file => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type), 'Tipo de arquivo não permitido'),
  name: z.string().transform(sanitizeInput.textContent),
});
```

---

## 🔐 **AUTH SECURITY FRAMEWORK**

### **Artigo IV - Authentication Standards**

#### **Session Management (OBRIGATÓRIO)**

```typescript
// ✅ PADRÃO OBRIGATÓRIO para auth
export const authConfig = {
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 horas
  REFRESH_THRESHOLD: 30 * 60 * 1000, // 30 min antes de expirar
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
};

// ✅ Token validation obrigatória
export const validateSession = async (token: string): Promise<boolean> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    return !error && !!user;
  } catch {
    return false;
  }
};
```

#### **Permission Validation (OBRIGATÓRIO)**

```typescript
// ✅ RBAC validation obrigatória
export const permissionLevels = {
  READ: 1,
  WRITE: 2,
  DELETE: 3,
  ADMIN: 4
} as const;

export const validatePermission = (
  userRole: string,
  requiredLevel: number
): boolean => {
  const rolePermissions = {
    operator: permissionLevels.READ,
    supervisor: permissionLevels.WRITE,
    manager: permissionLevels.DELETE,
    admin: permissionLevels.ADMIN
  };

  return (rolePermissions[userRole] || 0) >= requiredLevel;
};

// ✅ USO OBRIGATÓRIO em ProtectedRoute
const ProtectedRoute = ({ children, requiredPermission = 1 }) => {
  const { user, profile } = useAuth();

  if (!validatePermission(profile?.role, requiredPermission)) {
    return <AccessDenied />;
  }

  return children;
};
```

---

## 🚫 **FORBIDDEN PRACTICES**

### **❌ NUNCA FAZER:**

```typescript
// ❌ PROIBIDO - Inputs sem validação
const handleSubmit = data => {
  // Sem tipos
  api.create(data); // Sem validation
};

// ❌ PROIBIDO - Strings sem sanitização
const searchQuery = userInput; // Direto sem sanitizar

// ❌ PROIBIDO - HTML injection vulnerability
const content = `<div>${userInput}</div>`; // Perigoso

// ❌ PROIBIDO - SQL injection possibility
const query = `SELECT * WHERE name = '${userName}'`; // Nunca!

// ❌ PROIBIDO - Hardcoded secrets
const API_KEY = 'sk-1234567890'; // Exposto

// ❌ PROIBIDO - Weak auth checks
if (user) {
  /* access granted */
} // Muito simples
```

### **✅ SEMPRE FAZER:**

```typescript
// ✅ OBRIGATÓRIO - Input validado
const handleSubmit = (data: CreateEmployeePayload) => {
  const validated = employeeSchema.parse(data);
  api.create(validated);
};

// ✅ OBRIGATÓRIO - String sanitizada
const searchQuery = sanitizeInput.search(userInput);

// ✅ OBRIGATÓRIO - Escape HTML
const content = `<div>${escapeHtml(userInput)}</div>`;

// ✅ OBRIGATÓRIO - Parameterized queries (Supabase handles)
const { data } = await supabase.from('employees').select('*').eq('name', userName); // Seguro

// ✅ OBRIGATÓRIO - Environment variables
const API_KEY = import.meta.env.VITE_API_KEY;

// ✅ OBRIGATÓRIO - Robust auth checks
if (user && validatePermission(user.role, requiredLevel)) {
  /* access granted */
}
```

---

## 📋 **SECURITY CHECKLIST (Pré-PR)**

### **Validation Requirements**

- [ ] Todo form usa Zod + zodResolver
- [ ] Todo input é sanitizado
- [ ] Payloads são validados nos Services
- [ ] Error messages não expõem dados sensíveis

### **Auth Requirements**

- [ ] Rotas protegidas verificam permissões
- [ ] Session validation implementada
- [ ] Tokens não expostos em logs
- [ ] Logout limpa estado completamente

### **Data Security**

- [ ] Não há hardcoded secrets
- [ ] Environment variables usadas corretamente
- [ ] PII é tratada adequadamente
- [ ] Logs não expõem dados sensíveis

### **Input Security**

- [ ] XSS prevention implementada
- [ ] File uploads têm type checking
- [ ] Rate limiting considerado
- [ ] SQL injection impossível (Supabase RLS)

---

## 🔍 **SECURITY UTILITIES (Obrigatórias)**

### **Error Sanitization**

```typescript
// ✅ OBRIGATÓRIO - Sanitize errors para usuários
export const sanitizeError = (error: unknown): string => {
  if (error instanceof Error) {
    // Não expor stack traces ou dados internos
    const safeMessages = ['Network error', 'Validation failed', 'Access denied', 'Resource not found'];

    return safeMessages.find(msg => error.message.toLowerCase().includes(msg.toLowerCase())) || 'Something went wrong';
  }

  return 'Unexpected error occurred';
};
```

### **Rate Limiting (Client-side)**

```typescript
// ✅ OBRIGATÓRIO para mutations frequentes
export const useRateLimit = (limit: number, windowMs: number) => {
  const requests = useRef<number[]>([]);

  const canProceed = (): boolean => {
    const now = Date.now();
    requests.current = requests.current.filter(time => now - time < windowMs);

    if (requests.current.length >= limit) {
      return false;
    }

    requests.current.push(now);
    return true;
  };

  return { canProceed };
};
```

---

## ⚡ **EMERGENCY SECURITY PROTOCOLS**

### **Incident Response**

1. **Immediate:** Disable affected endpoint/feature
2. **Assessment:** Identify scope and impact
3. **Containment:** Implement temporary fixes
4. **Resolution:** Apply permanent solution
5. **Review:** Update security documentation

### **Security Updates**

1. **Dependencies:** Regular security audits
2. **Supabase:** Monitor RLS policies
3. **Environment:** Rotate secrets regularly
4. **Logs:** Monitor for suspicious activity

---

**⚖️ Esta constituição de segurança é INVIOLÁVEL. Todo código deve passar por estas validações antes de ser aceito no projeto.**
