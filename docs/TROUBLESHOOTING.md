# Guia de Troubleshooting - CeramicFlow

## 🔧 **Problemas Comuns e Soluções**

Este guia contém soluções para os problemas mais frequentes encontrados no desenvolvimento e uso do CeramicFlow.

## 🚨 **Erros de Build/Development**

### **Erro: "Module not found" ou imports não funcionando**

**Sintomas:**

```bash
Error: Cannot resolve module '@/components/ui/button'
Module not found: Can't resolve '@/hooks'
```

**Soluções:**

```bash
# 1. Limpar cache e reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# 2. Verificar configuração do tsconfig.json
# Verificar se os paths estão corretos:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# 3. Verificar configuração do vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
}

# 4. Reiniciar o servidor de desenvolvimento
npm run dev
```

### **Erro: "The requested module does not provide an export named 'X'"**

**Sintomas:**

```bash
The requested module '/src/integrations/supabase/hooks/use-auth.tsx'
does not provide an export named 'useAuthOptimized'
```

**Soluções:**

```typescript
// 1. Verificar se o hook está exportado corretamente
// Arquivo: src/integrations/supabase/hooks/use-auth.tsx
export const useAuthOptimized = useAuth; // ← Adicionar se não existir

// 2. Verificar se está no índice centralizado
// Arquivo: src/hooks/index.ts
export { useAuthOptimized as useAuth } from '@/integrations/supabase/hooks/use-auth';

// 3. Usar apenas o hook centralizado
import { useAuth } from '@/hooks'; // ✅ Correto
// NÃO usar: import { useAuthOptimized } from "@/integrations/..."; // ❌
```

### **Erro: TypeScript "Property does not exist on type"**

**Sintomas:**

```bash
Property 'vehicles' does not exist on type 'Maintenance'
Property 'ceramic_id' does not exist on type 'Profile'
```

**Soluções:**

```typescript
// 1. Verificar se o tipo está atualizado
// Arquivo: src/types/index.ts ou src/integrations/supabase/api/
export interface Maintenance {
  id: string;
  // ... outros campos
  vehicles?: {
    id: string;
    model: string;
    type: string;
  } | null; // ← Adicionar relacionamento
}

// 2. Verificar se a query SQL inclui o relacionamento
const { data, error } = await supabase.from('maintenances').select(`
    *,
    vehicles (
      id,
      model,
      type
    )
  `); // ← Incluir JOIN

// 3. Verificar tipagem no hook
return useQuery<MaintenanceWithVehicles[]>({
  queryKey: ['maintenances'],
  queryFn: MaintenanceService.getMaintenances,
});
```

## 🔌 **Problemas de Conexão Supabase**

### **Erro: "Invalid API key" ou "Authentication failed"**

**Sintomas:**

```bash
Invalid API key provided
Failed to authenticate with Supabase
Session expired or invalid
```

**Soluções:**

```bash
# 1. Verificar variáveis de ambiente
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# 2. Verificar arquivo .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 3. Verificar configuração no Supabase dashboard
# - API URL está correto
# - Anon key está ativa
# - RLS está configurado corretamente

# 4. Reiniciar o servidor após alterar .env
npm run dev
```

### **Erro: "Row Level Security violation"**

**Sintomas:**

```bash
new row violates row-level security policy
permission denied for table employees
```

**Soluções:**

```sql
-- 1. Verificar se RLS está habilitado
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- 2. Verificar políticas existentes
SELECT * FROM pg_policies WHERE tablename = 'employees';

-- 3. Criar política se não existir
CREATE POLICY "Users can access their ceramic's data" ON employees
  FOR ALL USING (
    ceramic_id = (
      SELECT ceramic_id FROM profiles WHERE id = auth.uid()
    )
  );

-- 4. Verificar se usuário tem ceramic_id no profile
SELECT id, ceramic_id FROM profiles WHERE id = auth.uid();
```

### **Erro: "Cannot read properties of null (ceramic_id)"**

**Sintomas:**

```bash
Cannot read properties of null (reading 'ceramic_id')
User not associated with a ceramic
```

**Soluções:**

```typescript
// 1. Verificar ProfileCacheService
// Arquivo: src/integrations/supabase/api/profile-cache.ts
static async getCurrentUserCeramicId(): Promise<string> {
  // ... implementação existente

  if (!profile?.ceramic_id) {
    throw new Error('Usuário não possui cerâmica associada');
  }

  return profile.ceramic_id;
}

// 2. Criar perfil com ceramic_id se necessário
INSERT INTO profiles (id, ceramic_id, email)
VALUES (auth.uid(), 'ceramic-uuid', 'user@email.com');

// 3. Verificar fluxo de criação de usuário
// Garantir que ceramic_id é atribuído no registro
```

## 🎨 **Problemas de UI/Responsividade**

### **Layout quebrado no mobile**

**Sintomas:**

- Elementos cortados em telas pequenas
- Texto ilegível
- Botões muito pequenos

**Soluções:**

```typescript
// 1. Usar classes responsivas
<div className="w-full sm:w-auto p-2 sm:p-4">
  <h1 className="text-sm sm:text-base md:text-lg">Título</h1>
</div>

// 2. Garantir touch-friendly elements
<button className="min-h-[44px] px-4 py-2 touch-manipulation">
  Botão
</button>

// 3. Usar breakpoints corretos
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px

// 4. Testar em diferentes tamanhos
// Chrome DevTools → Toggle device toolbar
```

### **Componentes não aparecem/Loading infinito**

**Sintomas:**

```bash
Loading... (não carrega nunca)
Tela branca
Componentes não renderizam
```

**Soluções:**

```typescript
// 1. Verificar Error Boundary
// Adicionar ao App.tsx se não existir
<ErrorBoundary fallback={<ErrorFallback />}>
  <Routes>...</Routes>
</ErrorBoundary>

// 2. Verificar estados de loading/error
const { data, isLoading, error } = useEmployees();

if (error) {
  console.error('API Error:', error);
  return <ErrorState variant="api" />;
}

if (isLoading) {
  return <ComponentSkeleton />;
}

// 3. Verificar React Query DevTools
// Adicionar ao App.tsx em desenvolvimento
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

## 📱 **Problemas Mobile Específicos**

### **Scroll horizontal indesejado**

**Soluções:**

```css
/* 1. Verificar overflow */
.container {
  overflow-x: auto; /* ou hidden */
  max-width: 100vw;
}

/* 2. Tabelas responsivas */
.table-container {
  overflow-x: auto;
  min-width: 0; /* importante para flex containers */
}

/* 3. Evitar larguras fixas grandes */
/* ❌ */
width: 800px;
/* ✅ */
width: 100%;
max-width: 800px;
```

### **Menu/Sidebar não fecha no mobile**

**Soluções:**

```typescript
// 1. Verificar event handlers
const handleNavigate = () => {
  // Navegar
  navigate('/employees');

  // Fechar sidebar no mobile
  if (isMobile) {
    setIsOpen(false);
  }
};

// 2. Verificar backdrop click
<div
  className="fixed inset-0 bg-black/50 lg:hidden"
  onClick={() => setIsOpen(false)}
/>

// 3. Verificar escape key
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
  };

  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, []);
```

## 🔄 **Problemas de Estado/Cache**

### **Dados não atualizam após mutation**

**Sintomas:**

- Criar item mas não aparece na lista
- Editar item mas mudanças não aparecem
- Cache desatualizado

**Soluções:**

```typescript
// 1. Verificar invalidação de queries
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EmployeeService.createEmployee,
    onSuccess: () => {
      // ✅ Invalidar query relacionada
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

// 2. Invalidação manual
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['employees'] });

// 3. Optimistic updates
onMutate: async (newEmployee) => {
  await queryClient.cancelQueries({ queryKey: ['employees'] });

  const previousEmployees = queryClient.getQueryData(['employees']);

  queryClient.setQueryData(['employees'], (old: Employee[]) => [
    ...old,
    { ...newEmployee, id: 'temp-' + Date.now() }
  ]);

  return { previousEmployees };
},
```

### **Context não atualiza componentes**

**Soluções:**

```typescript
// 1. Verificar se componente está dentro do Provider
<AuthProvider>
  <App /> {/* ✅ Dentro do provider */}
</AuthProvider>

// 2. Verificar se valor do context muda
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Recria objeto apenas quando user muda
  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Verificar se hook está correto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## 🚀 **Problemas de Performance**

### **Bundle muito grande**

**Soluções:**

```bash
# 1. Analisar bundle
npm run build

# 2. Verificar imports desnecessários
# ❌ import * as Icons from 'lucide-react';
# ✅ import { User, Settings } from 'lucide-react';

# 3. Lazy loading de componentes
const EmployeesPage = lazy(() => import('./pages/Employees'));

# 4. Code splitting manual
const HeavyComponent = lazy(() =>
  import('./components/HeavyComponent').then(module => ({
    default: module.HeavyComponent
  }))
);
```

### **App lenta/travando**

**Soluções:**

```typescript
// 1. Verificar re-renders desnecessários
// Usar React DevTools Profiler

// 2. Memoizar componentes pesados
const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  return <div>{/* renderização complexa */}</div>;
});

// 3. Otimizar useEffect
useEffect(() => {
  // função pesada
}, [dependency]); // ← Verificar dependências

// 4. Virtualizar listas longas
import { FixedSizeList as List } from 'react-window';

// 5. Debounce em inputs de busca
const debouncedSearch = useMemo(
  () => debounce((value: string) => setSearch(value), 300),
  []
);
```

## 🔍 **Debugging Tools**

### **React DevTools**

```bash
# Instalar extensão React Developer Tools
# Chrome/Firefox Web Store

# Verificar:
# - Component hierarchy
# - Props/State
# - Re-renders (Profiler)
# - Hooks state
```

### **React Query DevTools**

```typescript
// Adicionar ao App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} position="bottom-right" />

// Verificar:
// - Query status
// - Cache data
// - Network requests
// - Query invalidation
```

### **Console Debugging**

```typescript
// 1. Log de dados estruturados
console.table(employees);
console.group('Employee Creation');
console.log('Payload:', payload);
console.log('Result:', result);
console.groupEnd();

// 2. Network tab
// Verificar requisições Supabase
// Status codes, responses, headers

// 3. Performance tab
// Verificar tempos de carregamento
// Memory usage, CPU usage
```

## 📞 **Quando Pedir Ajuda**

### **Antes de Reportar Bug:**

1. ✅ Verificar se é um problema conhecido neste guia
2. ✅ Tentar reproduzir em ambiente limpo
3. ✅ Verificar console errors
4. ✅ Testar em browser incógnito
5. ✅ Verificar versões das dependências

### **Informações para Incluir:**

- Versão do Node.js (`node --version`)
- Sistema operacional
- Browser e versão
- Passos para reproduzir
- Console errors/warnings
- Screenshots (se UI)
- Código relevante

### **Contatos:**

- GitHub Issues para bugs
- Discussões técnicas em PRs
- Documentação em `/docs`

---

Este guia será atualizado conforme novos problemas são identificados e solucionados. 🔧
