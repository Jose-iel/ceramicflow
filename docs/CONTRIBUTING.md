# 🤝 **Guia de Contribuição - CeramicFlow**

> **⚠️ LEITURA OBRIGATÓRIA:** Antes de contribuir, leia TODOS os documentos de referência listados abaixo.

---

## 📚 **Documentos OBRIGATÓRIOS**

### **🔥 Leitura Crítica (Ordem Obrigatória)**

1. **[API.md](./API.md)** - Guia definitivo de APIs e Hooks
2. **[CODE_STANDARDS.md](./CODE_STANDARDS.md)** - Padrões de código obrigatórios
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura do projeto
4. **[COMPONENTS.md](./COMPONENTS.md)** - Guia de componentes

### **📖 Documentação Complementar**

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy e produção
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solução de problemas
- **[TESTING.md](./TESTING.md)** - Estratégia de testes (futuro)

---

## ⚠️ **REGRAS CRÍTICAS**

### **❌ Seu PR será REJEITADO se:**

1. Não seguir os padrões definidos em `API.md`
2. Importar hooks diretamente (deve usar `@/hooks`)
3. Fazer calls diretas ao Supabase em components
4. Não seguir os padrões de `CODE_STANDARDS.md`
5. Não implementar error handling adequado
6. Componentes sem TypeScript apropriado

### **✅ Seu PR será APROVADO se:**

1. Seguir 100% os padrões documentados
2. Implementar loading e error states
3. Usar apenas imports de `@/hooks`
4. Seguir nomenclatura definida
5. Incluir documentation se necessário

---

## 🎯 **Processo de Contribuição**

### **1. Setup Inicial**

#### **Ferramentas Necessárias**

- **Node.js** 18+ e **npm**
- **Git** para controle de versão
- **VS Code** (recomendado) com extensões:
  - TypeScript
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Prettier

#### **Setup do Ambiente**

```bash
# Clonar o repositório
git clone https://github.com/Jose-iel/ceramicflow.git
cd ceramicflow

# Instalar dependências
npm install

# Configurar variáveis de ambiente do Supabase
# (Configure conforme necessário)


```

### **2. Workflow de Desenvolvimento**

```bash
# Criar branch para feature/fix
git checkout -b feature/nome-da-feature

# Desenvolver seguindo os padrões
# (Consultar API.md e CODE_STANDARDS.md)

# Testar localmente
npm run code-quality  # Linting + type-check
npm run build         # Test build

# Commit com mensagem clara
git add .
git commit -m "feat: adiciona funcionalidade X seguindo padrões"

# Push e criar PR
git push origin feature/nome-da-feature
```

### **3. Checklist Pré-PR**

#### **🔍 Antes de Submeter**

- [ ] Li completamente `API.md` e `CODE_STANDARDS.md`
- [ ] Uso apenas imports de `@/hooks`
- [ ] Components tipados corretamente
- [ ] Error handling implementado
- [ ] Loading states adequados
- [ ] Nomenclatura seguindo padrões
- [ ] `npm run code-quality` passou sem erros
- [ ] `npm run build` executou com sucesso

#### **📝 Descrição do PR**

```markdown
## Tipo de Mudança

- [ ] 🚀 Nova feature
- [ ] 🐛 Bug fix
- [ ] 📚 Documentação
- [ ] 🎨 Refatoração
- [ ] ⚡ Performance

## Conformidade

- [ ] Segue padrões de `API.md`
- [ ] Segue padrões de `CODE_STANDARDS.md`
- [ ] Imports via `@/hooks`
- [ ] TypeScript strict
- [ ] Error handling implementado

## Descrição

Descreva o que foi implementado...

## Screenshots (se aplicável)

[Anexe screenshots se for mudança visual]
```

---

## 🏗️ **Patterns para Features**

### **Nova Entidade (Exemplo: Products)**

#### **1. Service (Obrigatório)**

```typescript
// src/integrations/supabase/api/products.ts
export interface Product {
  id: string;
  ceramic_id: string;
  name: string;
  // ... outros campos
  created_at: string;
  updated_at: string;
}

export class ProductsService {
  static async getAllProducts(): Promise<Product[]> {
    /* ... */
  }
  static async createProduct(data: CreateProductPayload): Promise<Product> {
    /* ... */
  }
  // ... outros métodos CRUD
}
```

#### **2. Hooks (Obrigatório)**

```typescript
// src/integrations/supabase/hooks/use-products-optimized.ts
export function useProductsOptimized() {
  /* ... */
}
export function useCreateProductOptimized() {
  /* ... */
}
export function useUpdateProductOptimized() {
  /* ... */
}
export function useDeleteProductOptimized() {
  /* ... */
}
```

#### **3. Export Central (Obrigatório)**

```typescript
// src/hooks/index.ts
export {
  useProductsOptimized as useProducts,
  useCreateProductOptimized as useCreateProduct,
  useUpdateProductOptimized as useUpdateProduct,
  useDeleteProductOptimized as useDeleteProduct,
} from '@/integrations/supabase/hooks/use-products-optimized';
```

#### **4. Página (Exemplo)**

```typescript
// src/pages/Products.tsx
import { useProducts, useCreateProduct } from '@/hooks';

export function Products() {
  const { data: products, isLoading, error } = useProducts();
  const createProduct = useCreateProduct();

  // Implementação seguindo padrões...
}
```

### **Novo Componente**

```typescript
// src/components/products/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="p-4">
      <h3>{product.name}</h3>
      <div className="flex gap-2 mt-2">
        <Button onClick={() => onEdit(product.id)}>Editar</Button>
        <Button variant="destructive" onClick={() => onDelete(product.id)}>
          Excluir
        </Button>
      </div>
    </Card>
  );
}
```

---

## 🔧 **Development Guidelines**

### **TypeScript**

- **Strict mode** habilitado
- **Interfaces** para todos os props
- **Types** importados dos Services
- **No any** permitido

### **React Patterns**

- **Functional components** apenas
- **Hooks** para state management
- **Lazy loading** para páginas
- **Error boundaries** para componentes críticos

### **Styling**

- **Tailwind CSS** apenas
- **shadcn/ui** components como base
- **Responsive design** obrigatório
- **Dark/light mode** support

### **Performance**

- **React Query** para cache
- **Optimistic updates** quando apropriado
- **Memoization** para computations pesadas
- **Bundle analysis** para novas features

---

## 🚫 **Anti-Patterns (PROIBIDO)**

### **❌ Imports Incorretos**

```typescript
// ERRADO - Import direto
import { useEmployeesOptimized } from '@/integrations/supabase/hooks/use-employees-optimized';

// CORRETO - Import centralizado
import { useEmployees } from '@/hooks';
```

### **❌ State Manual**

```typescript
// ERRADO - Estado manual para server data
const [employees, setEmployees] = useState([]);
useEffect(() => {
  fetchEmployees();
}, []);

// CORRETO - React Query hook
const { data: employees } = useEmployees();
```

### **❌ Calls Diretas**

```typescript
// ERRADO - Supabase direto em component
const { data } = await supabase.from('employees').select('*');

// CORRETO - Via hook centralizado
const { data: employees } = useEmployees();
```

---

## 🎯 **Code Review Standards**

### **Critérios de Aprovação**

1. **✅ Conformidade Arquitetural:** Segue padrões definidos
2. **✅ Type Safety:** TypeScript strict compliance
3. **✅ Performance:** Não degrada bundle size
4. **✅ UX:** Loading/error states adequados
5. **✅ Maintainability:** Código legível e documentado

### **Critérios de Rejeição**

1. **❌ Pattern Violation:** Qualquer violação dos padrões
2. **❌ Direct Imports:** Import direto de hooks otimizados
3. **❌ Missing Types:** Components sem interfaces
4. **❌ No Error Handling:** Sem tratamento de erro
5. **❌ Performance Issues:** Bundle size impact significativo

---

## 📊 **Métricas de Qualidade**

### **Code Quality Targets**

- **TypeScript:** 0 errors, 0 warnings
- **ESLint:** 0 errors, minimal warnings
- **Bundle Size:** <500KB increase per feature
- **Build Time:** <2min para build completa

### **Comandos de Verificação**

```bash
# Verificação completa
npm run code-quality

# Verificação individual
npm run type-check    # TypeScript
npm run lint:check    # ESLint
npm run build         # Build test
```

---

## 🎖️ **Contributor Levels**

### **🥇 Gold Contributor**

- Conhece todos os patterns de cor
- PRs sempre aprovados no primeiro review
- Contribui para padrões e documentação
- Mentora outros contributors

### **🥈 Silver Contributor**

- Segue consistentemente os padrões
- PRs aprovados com minimal feedback
- Implementa features seguindo guidelines
- Contribui com bug fixes

### **🥉 Bronze Contributor**

- Learning os padrões do projeto
- PRs requerem review iterations
- Contribui com pequenas features
- Segue guidance de maintainers

---

**⚠️ Lembre-se: Este projeto prioriza qualidade sobre velocidade. É melhor dedicar tempo seguindo os padrões do que retrabalhar depois!**

# Executar em desenvolvimento

npm run dev

```

## 🏗️ **Estrutura do Projeto**

### **Organização de Arquivos**

```

src/
├── components/ # Componentes React organizados por funcionalidade
├── hooks/ # Hooks customizados (SEMPRE usar o índice centralizado)
├── integrations/ # APIs e integrações externas
├── pages/ # Páginas da aplicação
├── types/ # Definições de tipos TypeScript
└── utils/ # Funções utilitárias

````

### **Convenções de Nomenclatura**

- **Componentes:** PascalCase (`UserCard`, `DataTable`)
- **Arquivos:** kebab-case (`user-card.tsx`, `data-table.tsx`)
- **Hooks:** camelCase com prefixo `use` (`useEmployees`, `useAuth`)
- **Tipos:** PascalCase (`Employee`, `CreateEmployeePayload`)
- **Constantes:** UPPER_SNAKE_CASE (`API_ENDPOINTS`, `DEFAULT_VALUES`)

## 🎨 **Padrões de Código**

### **Componentes React**

```typescript
// ✅ Estrutura recomendada
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEmployees } from "@/hooks"; // ← SEMPRE usar hooks centralizados

interface UserCardProps {
  user: Employee;
  onEdit?: (user: Employee) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    onEdit?.(user);
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold">{user.name}</h3>
      <Button onClick={handleEdit} disabled={isLoading}>
        Editar
      </Button>
    </div>
  );
}

export default UserCard;
````

### **Hooks Customizados**

```typescript
// ✅ SEMPRE importar de @/hooks
import { useEmployees, useCreateEmployee } from '@/hooks';

// ❌ NUNCA importar diretamente
import { useEmployeesOptimized } from '@/integrations/supabase/hooks/use-employees-optimized';
```

### **Páginas**

```typescript
// ✅ Usar PageLayout para consistência
import { PageLayout } from "@/components/common/PageLayout";
import { useEmployees } from "@/hooks";

export function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();

  const statsCards = [
    {
      title: "Total Funcionários",
      value: employees?.length ?? 0,
      icon: Users,
    },
  ];

  return (
    <PageLayout
      title="Funcionários"
      subtitle="Gestão de Funcionários"
      statsCards={statsCards}
      isLoading={isLoading}
    >
      {/* Conteúdo específico da página */}
    </PageLayout>
  );
}
```

## 🎯 **Adicionando Novas Features**

### **1. Nova Página/Módulo**

1. **Criar os tipos** em `src/types/`:

```typescript
// src/types/new-module.ts
export interface NewEntity {
  id: string;
  name: string;
  created_at: string;
}

export type CreateNewEntityPayload = Omit<NewEntity, 'id' | 'created_at'>;
```

2. **Criar a API** em `src/integrations/supabase/api/`:

```typescript
// src/integrations/supabase/api/new-entity.ts
import { supabase } from '../client';
import type { NewEntity, CreateNewEntityPayload } from '@/types/new-module';

export class NewEntityService {
  static async getNewEntities(): Promise<NewEntity[]> {
    const { data, error } = await supabase.from('new_entities').select('*').order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createNewEntity(payload: CreateNewEntityPayload): Promise<NewEntity> {
    const { data, error } = await supabase.from('new_entities').insert(payload).select().single();

    if (error) throw error;
    return data;
  }
}
```

3. **Criar os hooks** em `src/integrations/supabase/hooks/`:

```typescript
// src/integrations/supabase/hooks/use-new-entity-optimized.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NewEntityService } from '../api/new-entity';

export function useNewEntitiesOptimized() {
  return useQuery({
    queryKey: ['new-entities'],
    queryFn: NewEntityService.getNewEntities,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateNewEntityOptimized() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: NewEntityService.createNewEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['new-entities'] });
    },
  });
}
```

4. **Adicionar ao índice centralizado** em `src/hooks/index.ts`:

```typescript
// src/hooks/index.ts
export {
  useNewEntitiesOptimized as useNewEntities,
  useCreateNewEntityOptimized as useCreateNewEntity,
} from '@/integrations/supabase/hooks/use-new-entity-optimized';
```

5. **Criar a página** em `src/pages/`:

```typescript
// src/pages/NewEntity.tsx
import { PageLayout } from "@/components/common/PageLayout";
import { useNewEntities } from "@/hooks";

export function NewEntityPage() {
  const { data: entities, isLoading } = useNewEntities();

  return (
    <PageLayout
      title="Nova Entidade"
      subtitle="Gestão de Nova Entidade"
      isLoading={isLoading}
    >
      {/* Implementar interface */}
    </PageLayout>
  );
}
```

### **2. Novo Componente Reutilizável**

```typescript
// src/components/common/NewComponent.tsx
interface NewComponentProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
}

export function NewComponent({
  title,
  children,
  variant = 'default'
}: NewComponentProps) {
  return (
    <div className={`border rounded-lg p-4 ${variant === 'secondary' ? 'bg-gray-50' : ''}`}>
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}
```

## 🎨 **Padrões de UI/UX**

### **Responsividade**

```typescript
// ✅ Mobile-first approach
<div className="w-full sm:w-auto p-2 sm:p-4">
  <h1 className="text-lg sm:text-xl md:text-2xl">Título</h1>
</div>
```

### **Loading States**

```typescript
// ✅ Usar skeleton components
import { StatsCardSkeleton } from "@/components/ui/skeleton-variants";

{isLoading ? <StatsCardSkeleton /> : <StatsCard {...props} />}
```

### **Error Handling**

```typescript
// ✅ Estados de erro específicos
import { ErrorState } from "@/components/common/ErrorStates";

{error && <ErrorState variant="api" />}
```

## 🔄 **Workflow Git**

### **Branches**

```bash
# Criar branch para nova feature
git checkout -b feature/new-entity-management

# Trabalhar na feature
git add .
git commit -m "feat: add new entity management"

# Push e criar PR
git push origin feature/new-entity-management
```

### **Mensagens de Commit**

```bash
# Usar conventional commits
feat: add new entity management
fix: resolve authentication issue
docs: update API documentation
style: improve mobile responsiveness
refactor: simplify hooks structure
```

## 📝 **Documentação**### **Componentes**

````typescript
/**
 * Card para exibir informações do usuário
 *
 * @param user - Dados do usuário
 * @param onEdit - Callback executado ao clicar em editar
 *
 * @example
 * ```tsx
 * <UserCard
 *   user={employee}
 *   onEdit={(user) => console.log('Edit:', user)}
 * />
 * ```
 */
````

### **APIs**

```typescript
/**
 * Busca todos os funcionários da cerâmica atual
 *
 * @returns Promise<Employee[]> Lista de funcionários
 * @throws Error quando usuário não está autenticado
 */
```

## ✅ **Checklist de PR**

Antes de criar um Pull Request, verifique:

- [ ] Código segue os padrões estabelecidos
- [ ] Hooks importados de `@/hooks` (não diretamente)
- [ ] Componentes respondem corretamente no mobile
- [ ] Loading states implementados
- [ ] Error handling adequado
- [ ] TypeScript sem erros
- [ ] Build funcionando (`npm run build`)
- [ ] Documentação atualizada

## 🚫 **O que NÃO Fazer**

### **Imports Incorretos**

```typescript
// ❌ NUNCA importar hooks diretamente
import { useEmployeesOptimized } from '@/integrations/supabase/hooks/use-employees-optimized';

// ✅ SEMPRE usar o índice centralizado
import { useEmployees } from '@/hooks';
```

### **Componentes sem Responsividade**

```typescript
// ❌ Layout fixo
<div className="w-80 h-60">

// ✅ Layout responsivo
<div className="w-full sm:w-80 h-auto">
```

### **Estados de Loading Ruins**

```typescript
// ❌ Loading genérico
{isLoading && <div>Carregando...</div>}

// ✅ Skeleton component
{isLoading ? <ComponentSkeleton /> : <Component />}
```

## 💡 **Dicas Úteis**

1. **Use os componentes do PageLayout** sempre que possível
2. **Reutilize componentes existentes** antes de criar novos
3. **Mantenha consistência visual** com o design system
4. **Teste no mobile** durante o desenvolvimento
5. **Documente componentes complexos**
6. **Siga os padrões de nomenclatura**

## 🤝 **Obtendo Ajuda**

- Consulte a documentação em `/docs`
- Veja exemplos nas páginas existentes
- Analise componentes similares
- Pergunte no GitHub Issues

---

Obrigado por contribuir com o CeramicFlow! 🎉
