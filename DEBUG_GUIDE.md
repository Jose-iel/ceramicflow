# 🔍 Guia de Investigação - Página Branca na Vercel

## ✅ Status da Investigação

### Informações Coletadas:

- ✅ Build local funciona
- ✅ Build da Vercel funciona (sem erros)
- ❌ Página fica em branco na Vercel
- ✅ Funciona localmente

### Possíveis Causas Identificadas:

## 🎯 Principais Suspeitos

### 1. Script do GPT Engineer

**Problema:** O script `gptengineer.js` pode estar causando conflitos
**Localização:** `index.html` linha 15

```html
<script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
```

**Solução:** Remover temporariamente para testar

### 2. Lazy Loading e Code Splitting

**Problema:** Componentes lazy podem não carregar corretamente na Vercel
**Localização:** `App.tsx` - todos os imports com `lazy()`
**Solução:** Testar com imports diretos

### 3. Variáveis de Ambiente

**Problema:** Supabase hardcoded mas pode ter issues de CORS ou network
**Localização:** `src/integrations/supabase/client.ts`
**Solução:** Verificar se URLs funcionam na Vercel

### 4. Error Boundaries Silenciosos

**Problema:** Erros podem estar sendo capturados mas não exibidos
**Localização:** `App.tsx` - ErrorBoundary
**Solução:** Adicionar logging mais verboso

## 🔧 Passos de Debug

### Passo 1: Testar Versão Minimal

1. Copiar `src/main.debug.tsx` para `src/main.tsx`
2. Fazer novo deploy
3. Verificar se aparece a página de debug

### Passo 2: Testar sem GPT Engineer

1. Copiar `index.debug.html` para `index.html`
2. Fazer novo deploy
3. Verificar console do navegador

### Passo 3: Testar App Simplificado

1. Copiar `src/App.simple.tsx` para `src/App.tsx`
2. Fazer novo deploy
3. Ver se carrega páginas básicas

### Passo 4: Verificar Network/Console

1. Abrir DevTools na Vercel
2. Verificar:
   - ❌ Erros de JavaScript
   - ❌ Requests falhando
   - ❌ CORS errors
   - ❌ 404s para assets

## 📋 Comandos para Testar

```bash
# Testar build local com debug
npm run build:debug
npm run preview:debug

# Fazer deploy de debug
# 1. Substituir main.tsx
cp src/main.debug.tsx src/main.tsx

# 2. Substituir index.html
cp index.debug.html index.html

# 3. Commit e push para Vercel
git add .
git commit -m "debug: test minimal app"
git push
```

## 🎯 Checklist de Verificação

### Na Vercel (DevTools):

- [ ] Console mostra erros?
- [ ] Network tab mostra requests falhando?
- [ ] Supabase requests funcionam?
- [ ] Scripts carregam corretamente?
- [ ] CSS carrega?

### Configurações:

- [ ] Vercel.json está correto?
- [ ] Build settings corretos?
- [ ] Environment variables configuradas?
- [ ] Domain/DNS correto?

## 🚨 Ações Imediatas

1. **AGORA:** Testar com main.debug.tsx
2. **SE FUNCIONAR:** O problema é no App.tsx
3. **SE NÃO FUNCIONAR:** O problema é mais básico (scripts, config, etc.)
