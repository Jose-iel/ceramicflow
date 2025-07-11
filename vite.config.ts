import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Garante que apenas uma versão do React seja usada
    dedupe: ["react", "react-dom"],
  },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
});
