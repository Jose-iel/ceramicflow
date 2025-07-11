import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { optimizeDepsConfig, createManualChunks } from "./src/utils/vite-optimization";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // CRITICAL: Force single React/React-DOM versions
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      // CRITICAL: Force single Radix UI hook version to prevent useLayoutEffect errors
      "@radix-ui/react-use-layout-effect": path.resolve(__dirname, "./node_modules/@radix-ui/react-use-layout-effect"),
    },
    // Enforce resolution order for React packages
    dedupe: ["react", "react-dom", "@radix-ui/react-use-layout-effect"],
  },
  build: {
    target: 'es2020',
    sourcemap: mode === 'development',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: createManualChunks,
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 200,
    // Minificação apenas em produção
    minify: mode === 'production' ? 'terser' : false,
    ...(mode === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
          passes: 1,
          unsafe: false,
          // Configurações mais conservadoras
          conditionals: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          loops: true,
          reduce_vars: true,
          unused: true,
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },
    }),
    cssCodeSplit: true,
    cssMinify: mode === 'production',
    assetsInlineLimit: 2048,
    reportCompressedSize: mode === 'production',
  },
  // Otimizar dependências
  optimizeDeps: optimizeDepsConfig,
  
  // CSS preprocessor otimizations
  css: {
    devSourcemap: false,
  },
  
  // Definir variáveis de ambiente
  define: {
    // Fix para React 18 na Vercel
    global: 'globalThis',
  },
  
  // Configurações específicas para resolver conflitos React/React-DOM
  esbuild: {
    // Compatibilidade com navegadores mais antigos
    target: 'es2020',
    // Deixar JSX nas configurações padrão
  },
}));
