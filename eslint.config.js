// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  { 
    ignores: [
      // Arquivos de build e dependências
      "dist/**", 
      "build/**", 
      "node_modules/**",
      ".pnp",
      ".pnp.js",
      ".next/**",
      "out/**",
      "coverage/**",
      ".vercel/**",
      ".turbo/**",

      // Arquivos de configuração
      "*.config.js", 
      "*.config.ts",

      // Arquivos de cache e logs
      ".eslintcache",
      "*.tsbuildinfo",
      "*.log",
      ".npm",
      ".yarn",
      ".pnpm-store",
      "tmp/**",
      "temp/**",
      ".cache",
      ".parcel-cache",

      // Arquivos de lock
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",

      // Arquivos gerados e específicos do SO
      "*.generated.*",
      "*.auto.*",
      "**/*.min.js",
      "**/*.min.css",
      "*.bundle.js",
      "*.bundle.css",
      ".DS_Store",
      "Thumbs.db",

      // Variáveis de ambiente
      ".env*",

      // Pastas de IDE
      ".vscode/**",
      ".idea/**",

      // Arquivos de teste e documentação
      "docs/**",
      ".storybook-out/**",
      "storybook-static/**",
      ".nyc_output/**",

      // Específicos do projeto
      "public/**",
      "supabase/**",
      "*.backup.*",
      "*.noradix.*",
      "*.safe.*",
      "*.radix-backup.*",
      "test-*.js",
      "**/*.d.ts",
      "src/App.noradix.tsx",
      "src/App.radix-backup.tsx", 
      "src/App.safe.tsx",
      "src/components/ui/**"
    ] 
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react": react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "unused-imports": unusedImports,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Desabilitar regras problemáticas por enquanto
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["warn", { 
        "vars": "all", 
        "varsIgnorePattern": "^_", 
        "args": "after-used", 
        "argsIgnorePattern": "^_" 
      }],
      
      // React
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // TypeScript
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      
      // Estilo
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "no-unused-expressions": "warn",
      
      // Boas práticas
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-alert": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      
      // Complexidade
      "max-lines-per-function": ["warn", { "max": 60, "skipBlankLines": true, "skipComments": true }],
      "complexity": ["warn", 15]
    }
  }
);
