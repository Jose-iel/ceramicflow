# Arquitetura do CeramicFlow

## 📋 **Visão Geral**

O CeramicFlow é uma aplicação React moderna para gestão de cerâmicas, construída com foco em performance, manutenibilidade e experiência do usuário.

## 🏗️ **Stack Tecnológica**

### **Frontend**

- **React 18** - Interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes base

### **Backend**

- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados
- **Row Level Security** - Segurança de dados
- **Real-time** - Atualizações em tempo real

### **Estado e Cache**

- **React Query** - Cache de dados e estado servidor
- **Context API** - Estado global da aplicação

## 📁 **Estrutura do Projeto**

```
src/
├── components/           # Componentes React
│   ├── auth/            # Autenticação
│   ├── backoffice/      # Admin/Backoffice
│   ├── common/          # Componentes reutilizáveis
│   ├── dashboard/       # Dashboard principal
│   ├── employees/       # Gestão de funcionários
│   ├── maintenance/     # Manutenções
│   ├── operations/      # Operações
│   ├── rawmaterial/     # Matéria-prima
│   ├── sales/           # Vendas
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── vehicle/         # Veículos
│   └── wood/            # Gestão de lenha
├── contexts/            # Contextos React
├── hooks/               # Hooks customizados (centralizados)
├── integrations/        # Integrações externas
│   └── supabase/        # API e hooks do Supabase
├── lib/                 # Utilitários e configurações
├── pages/               # Páginas da aplicação
├── types/               # Definições de tipos TypeScript
└── utils/               # Funções utilitárias
```

## 🎣 **Hooks Centralizados**

Todos os hooks estão centralizados em `src/hooks/index.ts`:

```typescript
// Core hooks
export { useAuth } from '@/integrations/supabase/hooks/use-auth';
export { useToast } from './use-toast';
export { useMobile } from './use-mobile';

// Entity hooks (nomes simplificados)
export { useEmployees, useCreateEmployee } from '@/integrations/supabase/hooks/use-employees-optimized';
export { useVehicles, useCreateVehicle } from '@/integrations/supabase/hooks/use-vehicles-optimized';
// ... outros hooks
```

**Benefícios:**

- Import único: `import { useEmployees } from '@/hooks'`
- Nomes simplificados (sem "Optimized")
- Ponto único de controle para mudanças

## 🔄 **Fluxo de Dados**

### **1. Autenticação**

```
Login → Supabase Auth → Context → Protected Routes
```

### **2. Dados da Aplicação**

```
Component → Hook → React Query → Supabase API → Cache
```

### **3. Mutações**

```
User Action → Mutation Hook → API → Optimistic Update → Cache Invalidation
```

## 🎨 **Padrões de UI/UX**

### **Componentes Reutilizáveis**

- `PageLayout` - Layout padrão das páginas
- `DataTable` - Tabelas responsivas
- `StatsCard` - Cards de estatísticas
- `SearchAndActions` - Busca e ações

### **Estados de Loading**

- Skeleton components em vez de spinners
- Loading granular por seção
- Lazy loading para páginas

### **Responsividade**

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Touch-friendly elements (min 44px)

## 📊 **Otimização de Performance**

### **Bundle Splitting**

```javascript
// vite.config.ts
manualChunks: {
  'react-core': ['react'],
  'react-dom': ['react-dom'],
  'supabase': ['@supabase/supabase-js'],
  'query': ['@tanstack/react-query'],
  'router': ['react-router-dom']
}
```

### **Code Splitting**

- Lazy loading de páginas
- Dynamic imports para componentes grandes
- Chunks por funcionalidade

### **Cache Strategy**

```typescript
// React Query config
{
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
  refetchOnWindowFocus: false,
  retry: (failureCount, error) => failureCount < 3
}
```

## 🔒 **Segurança e Autorização**

### **Row Level Security (RLS)**

- Cada usuário acessa apenas dados da sua cerâmica
- Políticas definidas no Supabase
- Filtros automáticos por `ceramic_id`

### **Autenticação**

- JWT tokens via Supabase Auth
- Refresh automático de tokens
- Protected routes com `ProtectedRoute` component

### **Validação**

- Validação client-side com React Hook Form
- Validação server-side no Supabase
- Sanitização de inputs

## 🏢 **Módulos de Negócio**

### **Dashboard**

- Visão geral das operações
- Estatísticas em tempo real
- Gráficos e KPIs

### **Gestão de Pessoas**

- Funcionários
- Perfis de usuário
- Controle de acesso

### **Operações**

- Registro de operações
- Consumo de matéria-prima
- Produção de telhas/tijolos

### **Logística**

- Gestão de veículos
- Manutenções
- Consumo de combustível

### **Vendas e Estoque**

- Registro de vendas
- Controle de estoque
- Relatórios financeiros

### **Backoffice**

- Administração do sistema
- Configurações
- Relatórios avançados

## 🚀 **Deploy e Infraestrutura**

### **Hospedagem**

- **Frontend:** Vercel (otimizado para React)
- **Backend:** Supabase (gerenciado)
- **CDN:** Automático via Vercel

### **CI/CD**

- Deploy automático no push para `main`
- Build otimizado com Vite
- Environment variables configuradas

### **Monitoramento**

- Build size tracking
- Performance metrics via Vercel
- Error tracking (a implementar)

## 📈 **Métricas de Performance**

### **Bundle Size**

- Total: ~640 KB (gzipped: ~200 KB)
- Vendor libraries: ~150 KB
- Application code: ~100 KB
- CSS: ~10 KB (gzipped)

### **Loading Performance**

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s

## 🔧 **Padrões de Desenvolvimento**

### **Nomenclatura**

- Componentes: PascalCase (`UserCard`)
- Hooks: camelCase com prefixo `use` (`useEmployees`)
- Arquivos: kebab-case (`user-card.tsx`)
- Constantes: UPPER_SNAKE_CASE

### **Estrutura de Componentes**

```typescript
// Imports
import { ... } from "...";

// Types
interface ComponentProps {
  // props definition
}

// Component
export function Component({ ...props }: ComponentProps) {
  // hooks
  // handlers
  // render
}

// Default export (se necessário)
export default Component;
```

### **Error Handling**

- Error Boundaries para captura de erros React
- Try-catch em operações assíncronas
- Estados de erro específicos por contexto
- Fallbacks elegantes

## 🎯 **Próximos Passos**

### **Melhorias Planejadas**

1. Implementar testes automatizados
2. Progressive Web App (PWA)
3. Notificações em tempo real
4. Modo offline
5. Analytics avançados

### **Tecnologias a Avaliar**

- Next.js (SSR/SSG)
- Micro-frontends
- GraphQL
- WebSockets nativos

---

Esta arquitetura foi projetada para ser **escalável**, **performática** e **fácil de manter**, seguindo as melhores práticas modernas de desenvolvimento React.
