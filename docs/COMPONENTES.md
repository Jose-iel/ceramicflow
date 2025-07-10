# Componentes Reutilizáveis do CeramicFlow

Este documento explica como usar os novos componentes criados para padronizar e facilitar a manutenção das páginas do projeto.

## Componentes Criados

### 1. StatsCard

**Localização:** `src/components/common/StatsCard.tsx`

Componente para criar cards de estatísticas/resumo com ícone e formatação consistente.

```tsx
import StatsCard from "@/components/common/StatsCard";
import { TreePine } from "lucide-react";

<StatsCard
  title="Estoque Atual"
  value={150.5}
  unit="m³"
  icon={TreePine}
  iconColor="text-green-600"
  iconBgColor="bg-green-100"
  valueFormatter={(value) => Number(value).toFixed(1)}
/>;
```

**Props:**

- `title`: Título do card
- `value`: Valor principal a ser exibido
- `unit?`: Unidade de medida (opcional)
- `subtitle?`: Texto adicional abaixo do valor (opcional)
- `icon`: Ícone do Lucide React
- `iconColor?`: Classe CSS para cor do ícone (padrão: "text-primary")
- `iconBgColor?`: Classe CSS para cor de fundo do ícone (padrão: "bg-primary/10")
- `valueFormatter?`: Função para formatar o valor (opcional)

### 2. SearchAndActions

**Localização:** `src/components/common/SearchAndActions.tsx`

Componente para seção de busca com botões de ação.

```tsx
import SearchAndActions from "@/components/common/SearchAndActions";
import { Plus } from "lucide-react";

<SearchAndActions
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Buscar produtos..."
  actions={[
    {
      label: "Nova Compra",
      mobileLabel: "Compra",
      onClick: () => openDialog(),
      icon: <Plus className="w-4 h-4" />,
    },
    {
      label: "Relatório",
      variant: "outline",
      onClick: () => generateReport(),
    },
  ]}
/>;
```

**Props:**

- `searchValue`: Valor atual da busca
- `onSearchChange`: Função para atualizar valor da busca
- `searchPlaceholder?`: Placeholder do input (padrão: "Buscar...")
- `actions`: Array de configurações de botões

**ActionButtonConfig:**

- `label`: Texto do botão
- `mobileLabel?`: Texto alternativo para dispositivos móveis
- `onClick`: Função executada no clique
- `variant?`: Variante do botão ("default" | "outline" | "secondary" | "ghost")
- `icon?`: Ícone do botão (opcional)

### 3. DataTable

**Localização:** `src/components/common/DataTable.tsx`

Componente genérico para exibir tabelas de dados com ações.

```tsx
import DataTable from "@/components/common/DataTable";

const columns = [
  { key: "date", label: "Data", render: (value) => formatDate(value) },
  { key: "supplier", label: "Fornecedor" },
  { key: "quantity", label: "Quantidade", render: (value) => `${value}m³` },
];

const actions = [
  { label: "Editar", onClick: (row) => editItem(row) },
  {
    label: "Excluir",
    variant: "ghost",
    className: "text-red-500 hover:text-red-700",
    onClick: (row) => deleteItem(row),
  },
];

<DataTable
  data={filteredData as unknown as Record<string, unknown>[]}
  columns={columns}
  actions={actions}
  emptyMessage="Nenhum item encontrado"
  minWidth="700px"
/>;
```

**Props:**

- `data`: Array de dados para exibir
- `columns`: Configuração das colunas
- `actions?`: Configuração das ações (opcional)
- `emptyMessage?`: Mensagem quando não há dados
- `minWidth?`: Largura mínima da tabela
- `isLoading?`: Estado de carregamento

**TableColumn:**

- `key`: Chave do campo nos dados
- `label`: Rótulo da coluna
- `className?`: Classes CSS adicionais
- `render?`: Função para renderização customizada

**TableAction:**

- `label`: Texto do botão de ação
- `onClick`: Função executada no clique
- `variant?`: Variante do botão
- `className?`: Classes CSS adicionais
- `condition?`: Função para mostrar/ocultar ação condicionalmente

### 4. PageLayout

**Localização:** `src/components/common/PageLayout.tsx`

Componente que integra todos os anteriores em um layout de página completo.

```tsx
import PageLayout from "@/components/common/PageLayout";
import { TreePine, ShoppingCart } from "lucide-react";

const statsCards = [
  {
    title: "Estoque",
    value: 150.5,
    unit: "m³",
    icon: TreePine,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-100",
  },
];

const actions = [
  {
    label: "Nova Compra",
    onClick: () => openDialog(),
    icon: <Plus className="w-4 h-4" />,
  },
];

<PageLayout
  title="Lenha"
  subtitle="Gestão de Lenha"
  selectedMonth={selectedMonth}
  onMonthChange={setSelectedMonth}
  statsCards={statsCards}
  searchValue={search}
  onSearchChange={setSearch}
  actions={actions}
  isLoading={isLoading}
>
  {/* Conteúdo específico da página */}
  <div>Conteúdo personalizado aqui</div>
</PageLayout>;
```

**Props:**

- `title`: Título da página
- `subtitle`: Subtítulo da página
- `selectedMonth`: Mês selecionado no filtro
- `onMonthChange`: Função para alterar mês
- `statsCards?`: Array de configurações de cards de estatísticas
- `searchValue?`: Valor da busca
- `onSearchChange?`: Função para atualizar busca
- `searchPlaceholder?`: Placeholder da busca
- `actions?`: Array de ações/botões
- `children`: Conteúdo específico da página
- `isLoading?`: Estado de carregamento
- `showMonthFilter?`: Mostrar filtro de mês (padrão: true)
- `showSearch?`: Mostrar seção de busca (padrão: true)

## Padrões Identificados e Solucionados

### 1. Cards de Estatísticas Repetitivos

**Antes:**

```tsx
<div className="bg-card border rounded-lg p-3 md:p-4 shadow">
  <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">
    Estoque Atual
  </h3>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-lg md:text-2xl font-bold">150.5</p>
      <p className="text-xs text-muted-foreground">m³</p>
    </div>
    <div className="p-1.5 md:p-2 bg-green-100 rounded-full">
      <TreePine className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
    </div>
  </div>
</div>
```

**Depois:**

```tsx
<StatsCard
  title="Estoque Atual"
  value={150.5}
  unit="m³"
  icon={TreePine}
  iconColor="text-green-600"
  iconBgColor="bg-green-100"
/>
```

### 2. Seções de Busca e Ações Duplicadas

**Antes:** Código repetitivo de 15-20 linhas para cada página.

**Depois:** Uma linha com configuração declarativa.

### 3. Tabelas Complexas e Repetitivas

**Antes:** Código de 50+ linhas para cada tabela.

**Depois:** Configuração declarativa com colunas e ações.

### 4. Layout de Página Completo

**Antes:** Cada página reimplementava Sidebar, Navbar, MonthFilter, etc.

**Depois:** Um componente PageLayout que unifica tudo.

## Benefícios da Componentização

1. **Redução de Código:** Páginas que tinham 400+ linhas agora têm ~150 linhas
2. **Consistência:** Visual e comportamental entre todas as páginas
3. **Manutenção:** Mudanças em um componente afetam todas as páginas
4. **Reutilização:** Componentes podem ser usados em novas páginas
5. **Tipagem:** TypeScript rigoroso sem `any`
6. **Responsividade:** Já implementada nos componentes base

## Exemplos de Uso

### Página Simples (Wood.tsx)

```tsx
const WoodPage = () => {
  const { selectedMonth, setSelectedMonth } = useMonthFilter();
  const [search, setSearch] = useState("");

  const statsCards = [
    /* configuração */
  ];
  const actions = [
    /* configuração */
  ];

  return (
    <PageLayout
      title="Lenha"
      subtitle="Gestão de Lenha"
      selectedMonth={selectedMonth}
      onMonthChange={setSelectedMonth}
      statsCards={statsCards}
      searchValue={search}
      onSearchChange={setSearch}
      actions={actions}
    >
      <DataTable data={data} columns={columns} actions={tableActions} />
    </PageLayout>
  );
};
```

### Página com Layout Customizado (RawMaterial.tsx)

```tsx
<PageLayout
  title="Matéria-Prima"
  subtitle="Gestão de Consumo de Barro"
  selectedMonth={selectedMonth}
  onMonthChange={setSelectedMonth}
  statsCards={statsCards}
  actions={actions}
  showSearch={false} // Sem busca nesta página
>
  {/* Conteúdo customizado */}
  <div className="space-y-4">
    {items.map((item) => (
      <CustomCard key={item.id} item={item} />
    ))}
  </div>
</PageLayout>
```

## Próximos Passos

1. Aplicar a componentização nas demais páginas (Operations, Maintenance, Sales)
2. Criar componentes específicos para formulários complexos
3. Adicionar componentes para gráficos e relatórios
4. Implementar testes unitários para os componentes
5. Criar Storybook para documentação visual dos componentes

## Migração de Páginas Existentes

Para migrar uma página existente:

1. Identifique os cards de estatísticas e configure `statsCards`
2. Identifique seção de busca e botões, configure `actions`
3. Identifique tabelas e configure `columns` e `actions` do DataTable
4. Substitua todo o layout por `PageLayout`
5. Mantenha apenas a lógica de negócio e renderização específica

Isso reduzirá significativamente o código e tornará a manutenção muito mais fácil.
