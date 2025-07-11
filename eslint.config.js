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
      "dist/**", 
      "build/**", 
      "node_modules/**", 
      "*.config.js", 
      "*.config.ts",
      "coverage/**",
      ".next/**",
      "public/**",
      "supabase/**",
      "*.backup.*",
      "*.noradix.*",
      "*.safe.*",
      "*.radix-backup.*",
      "test-dashboard.js",
      "test-edge-function.js",
      "bun.lockb",
      "**/*.min.js",
      "**/*.min.css",
      "**/migrations/**",
      "**/*.sql",
      "**/*.d.ts",
      "src/App.noradix.tsx",
      "src/App.radix-backup.tsx", 
      "src/App.safe.tsx",
      "docs/**",
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
