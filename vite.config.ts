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
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: createManualChunks,
        // Nomes de arquivos mais limpos
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Meta muito agressiva para o tamanho dos chunks
    chunkSizeWarningLimit: 200,
    // Minificação menos agressiva para evitar erros
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.error'],
        passes: 2,
        unsafe: false,
        unsafe_comps: false,
        unsafe_math: false,
        unsafe_methods: false,
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
    // CSS otimização
    cssCodeSplit: true,
    cssMinify: true,
    // Assets inline para arquivos muito pequenos
    assetsInlineLimit: 2048,
    // Reportar tamanho do bundle
    reportCompressedSize: true,
  },
  // Otimizar dependências
  optimizeDeps: optimizeDepsConfig,
  
  // CSS preprocessor otimizations
  css: {
    devSourcemap: false,
  },
  
  // Definir variáveis de ambiente
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}));
