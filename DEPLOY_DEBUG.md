# 🔍 Debug Deploy - Teste de Diagnóstico

Este commit substitui temporariamente o aplicativo principal por uma versão de debug simplificada para diagnosticar o problema da página em branco na Vercel.

## Mudanças:

- `main.tsx` → versão de debug minimal do React
- `index.html` → versão com scripts de debug e sem GPT Engineer
- Removidos lazy loading, Supabase, roteamento complexo

## Objetivo:

Verificar se o problema é:

1. ❌ Básico (React não carrega)
2. ❌ Scripts externos (GPT Engineer)
3. ❌ Lazy loading / code splitting
4. ❌ Supabase / APIs
5. ❌ Roteamento / AuthProvider

## Se este debug funcionar na Vercel:

O problema está nos componentes complexos (App.tsx original)

## Se este debug NÃO funcionar na Vercel:

O problema é mais fundamental (configuração, scripts, etc.)

---

**Reverter com:** `git revert HEAD` ou usar arquivos .backup
