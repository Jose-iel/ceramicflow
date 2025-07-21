# 🏺 CeramicFlow

Sistema completo de gestão para cerâmicas, desenvolvido com React, TypeScript e Supabase.

## 🎯 **Sobre o Projeto**

O CeramicFlow é uma aplicação web moderna para gestão completa de operações em cerâmicas, incluindo:

- 📊 **Dashboard Analytics** - KPIs e métricas em tempo real
- 👥 **Gestão de Funcionários** - Controle de pessoal e funções
- 🚛 **Gestão de Veículos** - Frota e manutenções
- ⚙️ **Operações** - Registro de produção e consumo
- 🧱 **Matéria-Prima** - Controle de argila e lenha
- 💰 **Vendas** - Gestão comercial e estoque
- 🔧 **Backoffice** - Administração do sistema

## 🚀 **Demo**

**URL de Produção:** https://ceramicflow.vercel.app

## 🛠️ **Stack Tecnológica**

### **Frontend**

- **React 18** - Interface de usuário moderna
- **TypeScript** - Tipagem estática
- **Vite** - Build tool otimizado
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes base

### **Backend**

- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados
- **Row Level Security** - Segurança de dados
- **Real-time** - Atualizações em tempo real

### **Estado e Cache**

- **React Query** - Cache e estado servidor
- **Context API** - Estado global
- **Hooks centralizados** - Gerenciamento simplificado

## 🏗️ **Como Executar**

### **Pré-requisitos**

- Node.js 18+
- npm ou yarn
- Conta no Supabase

### **Instalação**

```bash
# 1. Clonar o repositório
git clone https://github.com/Jose-iel/ceramicflow.git
cd ceramicflow

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
# Criar arquivo .env.local com suas credenciais do Supabase

# 4. Executar em desenvolvimento
npm run dev
```

### **Variáveis de Ambiente**

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=development
```

### **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build           # Build para produção
npm run preview         # Preview do build local

# Qualidade
npm run lint            # Verificar lint
npm run type-check      # Verificar tipos TypeScript
```

## 📁 **Estrutura do Projeto**

```
src/
├── components/           # Componentes React organizados por funcionalidade
│   ├── auth/            # Autenticação
│   ├── common/          # Componentes reutilizáveis
│   ├── dashboard/       # Dashboard principal
│   ├── ui/              # Componentes base (shadcn/ui)
│   └── ...              # Módulos específicos
├── hooks/               # Hooks centralizados
├── integrations/        # APIs e integrações (Supabase)
├── pages/               # Páginas da aplicação
├── types/               # Definições TypeScript
└── utils/               # Funções utilitárias
```

## 🎨 **Características**

### **🎯 Performance Otimizada**

- Bundle size: ~640KB (gzipped: ~200KB)
- Code splitting automático
- Lazy loading de páginas
- Cache inteligente com React Query

### **📱 Mobile-First**

- Interface completamente responsiva
- Touch-friendly navigation
- Cards adaptáveis no mobile
- Menu drawer otimizado

### **🔧 Developer Experience**

- Hooks centralizados para imports simples
- Componentes reutilizáveis padronizados
- TypeScript rigoroso
- Hot reload rápido com Vite

### **🔒 Segurança**

- Row Level Security (RLS) no Supabase
- Autenticação JWT
- Filtros automáticos por cerâmica
- Validação client e server-side

## 📚 **Documentação**

- 📋 **[Arquitetura](./docs/ARCHITECTURE.md)** - Visão geral da arquitetura
- 🚀 **[Deploy](./docs/DEPLOYMENT.md)** - Guia de deploy e configuração
- 🤝 **[Contribuição](./docs/CONTRIBUTING.md)** - Como contribuir
- 🔧 **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Soluções para problemas comuns
- 📝 **[Changelog](./docs/CHANGELOG.md)** - Histórico de mudanças
- 🔌 **[API](./docs/API.md)** - Documentação das APIs
- 🎨 **[Componentes](./docs/COMPONENTS.md)** - Guia dos componentes

## 🚀 **Deploy**

### **Deploy Automático (Vercel)**

O projeto está configurado para deploy automático:

- Push para `main` → Deploy em produção
- Pull Requests → Deploy de preview

### **Deploy Manual**

```bash
# Build para produção
npm run build

# Preview local do build
npm run preview
```

Para configuração detalhada, consulte [DEPLOYMENT.md](./docs/DEPLOYMENT.md).

## **Como Contribuir**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

Consulte [CONTRIBUTING.md](./docs/CONTRIBUTING.md) para detalhes completos.

## 📊 **Métricas do Projeto**

- **Bundle Size:** ~640KB total
- **Performance:** < 2s para carregamento inicial
- **Mobile-friendly:** 100% responsivo
- **TypeScript:** 100% tipado

## 🛠️ **Troubleshooting**

Problemas comuns e suas soluções estão documentados em [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md).

### **Problemas Frequentes:**

- Erro de imports → Verificar hooks centralizados
- Supabase connection → Verificar variáveis de ambiente
- Build failed → Limpar cache e reinstalar dependências

## 📄 **Licença**

Este projeto é proprietário. Todos os direitos reservados.

## 👥 **Equipe**

- **Desenvolvedor Principal:** Jose-iel
- **Arquitetura:** React + TypeScript + Supabase
- **Design System:** Tailwind CSS + shadcn/ui

---

## 🎯 **Próximos Passos**

- [ ] Implementar testes automatizados
- [ ] Progressive Web App (PWA)
- [ ] Notificações em tempo real
- [ ] Analytics avançados
- [ ] Modo offline

Para ver o roadmap completo, consulte [CHANGELOG.md](./docs/CHANGELOG.md).---

**CeramicFlow** - Sistema moderno e eficiente para gestão de cerâmicas 🏺
