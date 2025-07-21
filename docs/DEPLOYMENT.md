# Guia de Deploy - CeramicFlow

## 🚀 **Deploy Automático (Vercel)**

O projeto está configurado para deploy automático via Vercel conectado ao repositório GitHub.

### **Deploy Automático**

- **Push para `main`** → Deploy automático em produção
- **Pull Requests** → Deploy de preview automático
- **Branches** → Deploy de preview (opcional)

### **URL de Produção**

```
https://ceramicflow.vercel.app
```

## ⚙️ **Configuração de Variáveis de Ambiente**

### **Arquivo `.env.local` (Desenvolvimento)**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Ambiente
VITE_APP_ENV=development
```

### **Vercel Environment Variables (Produção)**

No painel da Vercel, configure:

1. **`VITE_SUPABASE_URL`**
   - Value: `https://your-project.supabase.co`
   - Environment: Production, Preview

2. **`VITE_SUPABASE_ANON_KEY`**
   - Value: `your-anon-public-key`
   - Environment: Production, Preview

3. **`VITE_APP_ENV`**
   - Value: `production`
   - Environment: Production

## 📋 **Configuração do Vercel**

### **vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### **Build Settings**

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## 🔧 **Configuração do Supabase**

### **1. Configuração de CORS**

No dashboard do Supabase, em `Authentication > URL Configuration`:

```
Site URL: https://ceramicflow.vercel.app
Additional Redirect URLs:
- https://ceramicflow.vercel.app/login
- https://ceramicflow.vercel.app/dashboard
- https://*.vercel.app (para previews)
```

### **2. Configuração de JWT**

Verificar em `Settings > API`:

- JWT Secret está configurado
- Service role key para operações administrativas

### **3. Debug de Problemas**

1. **Verificar logs da build:**

   ```bash
   npm run build
   ```

2. **Verificar configuração do Vite:**

## 🏗️ **Process de Build**

### **1. Build Local**

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Preview do build
npm run preview
```

### **2. Verificação Pre-Deploy**

```bash
# Lint do código
npm run lint

# Verificar tipos TypeScript
npm run type-check

# Build de teste
npm run build
```

## 📊 **Otimização para Produção**

### **Vite Config (vite.config.ts)**

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          query: ['@tanstack/react-query'],
          router: ['react-router-dom'],
        },
      },
    },
  },
});
```

### **Build Metrics Target**

- **Total Bundle:** < 800 KB
- **Gzipped:** < 250 KB
- **First Load:** < 100 KB
- **Chunks:** < 25 arquivos

## 🔍 **Troubleshooting**

### **Erro: Environment Variables**

```bash
# Verificar se variáveis estão definidas
echo $VITE_SUPABASE_URL

# No Vercel, verificar em Settings > Environment Variables
```

### **Erro: Build Failed**

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Build limpo
npm run build
```

### **Erro: Supabase Connection**

```javascript
// Verificar se as URLs estão corretas
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

### **Erro: Routing SPA**

Verificar se `vercel.json` tem a configuração de rewrite para SPAs.

## 📱 **Deploy Mobile (PWA)**

### **Configuração PWA**

```json
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'CeramicFlow',
        short_name: 'CeramicFlow',
        description: 'Sistema de Gestão para Cerâmicas',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

## 🔄 **Deploy em Outros Providers**

### **Netlify**

```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key
```

### **Firebase Hosting**

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 📈 **Monitoramento Pós-Deploy**

### **Métricas no Vercel**

- Core Web Vitals
- Bundle size
- Build time
- Error rate

### **Logs e Debugging**

```bash
# Ver logs do Vercel
vercel logs

# Ver logs de função
vercel logs --function=api
```

### **Performance Monitoring**

- Lighthouse CI
- Web Vitals reporting
- Bundle analyzer automático

---

## ✅ **Checklist de Deploy**

- [ ] Variáveis de ambiente configuradas
- [ ] Build local funcionando
- [ ] Supabase configurado corretamente
- [ ] URLs de redirect configuradas
- [ ] RLS habilitado nas tabelas
- [ ] Performance otimizada
- [ ] Error handling implementado
- [ ] Monitoramento configurado

O deploy está configurado para ser **automático** e **otimizado**, garantindo que a aplicação esteja sempre atualizada e performática em produção.
