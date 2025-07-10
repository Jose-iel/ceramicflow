# Simplificação da Arquitetura - CeramicFlow

## 📋 Análise de Componentes UI

### ✅ **Componentes UI em Uso**

Os seguintes componentes UI estão sendo ativamente utilizados no projeto:

#### **Componentes Principais**

- `button.tsx` - Usado em toda a aplicação
- `card.tsx` - Dashboards, relatórios, formulários
- `dialog.tsx` - Modais de criação/edição
- `input.tsx` - Formulários em geral
- `label.tsx` - Labels de formulários
- `select.tsx` - Dropdowns e seleções
- `table.tsx` - Listagens de dados
- `badge.tsx` - Status e categorização
- `tabs.tsx` - Navegação do backoffice

#### **Componentes de Navegação/Feedback**

- `toast.tsx` / `toaster.tsx` / `sonner.tsx` - Notificações
- `tooltip.tsx` - Dicas contextuais
- `separator.tsx` - Divisores visuais
- `checkbox.tsx` - Checkboxes em formulários
- `switch.tsx` - Toggle switches (backoffice)

#### **Componentes Específicos**

- `calendar.tsx` - Filtros de data
- `collapsible.tsx` - Seções expansíveis
- `textarea.tsx` - Texto longo em formulários
- `popover.tsx` - Menus contextuais
- `alert-dialog.tsx` - Confirmações
- `sheet.tsx` - Drawer lateral (através do sidebar)
- `skeleton.tsx` - Estados de carregamento
- `radio-group.tsx` - Seleção única

#### **Componentes Utilitários**

- `form.tsx` - Validação de formulários
- `scroll-area.tsx` - Scrollbars customizadas

### ❌ **Componentes UI Não Utilizados**

Os seguintes componentes podem ser removidos com segurança:

#### **Para Remoção Imediata**

- `accordion.tsx` - Não tem imports
- `avatar.tsx` - Não tem imports
- `breadcrumb.tsx` - Não tem imports
- `chart.tsx` - Não tem imports (apenas ícones chart são usados)
- `command.tsx` - Apenas dependência interna
- `context-menu.tsx` - Não tem imports
- `hover-card.tsx` - Não tem imports
- `input-otp.tsx` - Não tem imports
- `navigation-menu.tsx` - Não tem imports
- `pagination.tsx` - Apenas dependência interna
- `progress.tsx` - Não tem imports
- `resizable.tsx` - Não tem imports
- `sidebar.tsx` - Não tem imports diretos (apenas configs CSS)
- `slider.tsx` - Não tem imports
- `toggle.tsx` - Apenas dependência interna
- `toggle-group.tsx` - Apenas dependência interna

## 🗂️ **Análise de Estrutura de Pastas**

### **Pastas de Componentes**

```
src/components/
├── auth/           ✅ Em uso
├── backoffice/     ✅ Em uso
├── common/         ✅ Em uso
├── dashboard/      ✅ Em uso
├── employees/      ✅ Em uso
├── layout/         ⚠️  Verificar uso
├── maintenance/    ✅ Em uso
├── operations/     ✅ Em uso
├── rawmaterial/    ✅ Em uso
├── sales/          ✅ Em uso
├── ui/             🔄 Simplificar (remover não utilizados)
├── vehicle/        ✅ Em uso
└── wood/           ✅ Em uso
```

### **Próximos Passos**

1. **Remoção de Componentes UI**

   - Remover componentes não utilizados listados acima
   - Limpar dependências internas orfãs

2. **Verificação da Pasta Layout**

   - Analisar se componentes de layout são realmente necessários

3. **Consolidação de Hooks**

   - Verificar se todos os hooks estão sendo importados corretamente
   - Remover hooks órfãos

4. **Simplificação de Imports**
   - Centralizar imports de componentes UI
   - Criar barrel exports otimizados

## 🎯 **Progresso da Simplificação**

### ✅ **Componentes UI Removidos**

- `command.tsx` - Não utilizado
- `pagination.tsx` - Não utilizado
- `sidebar.tsx` - Não utilizado (apenas configs CSS mantidas)
- `toggle.tsx` - Não utilizado
- `toggle-group.tsx` - Não utilizado

### ✅ **Componentes Customizados Simplificados**

- `Badge.tsx` customizado - Substituído pelo Badge do UI
- `VehicleCard.tsx` - Migrado para usar Badge do UI

### ✅ **Hooks Centralizados**

- Criado arquivo central `src/hooks/index.ts`
- Todos os hooks otimizados exportados de um local único
- Aliases simplificados (ex: `useEmployeesOptimized` → `useEmployees`)

## 🎯 **Objetivos da Simplificação**

- Reduzir o bundle size removendo código não utilizado
- Simplificar a manutenção do código
- Melhorar a performance de build
- Facilitar a navegação no projeto
- Manter apenas componentes ativamente utilizados
