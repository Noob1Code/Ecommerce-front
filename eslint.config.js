import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      boundaries, 
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      // Mapeamento geográfico das camadas estruturais do projeto
      'boundaries/elements': [
        {
          type: 'app',
          pattern: 'src/app/**/*',
        },
        {
          type: 'features-private',
          pattern: 'src/features/*/{components,hooks}/**/*',
        },
        {
          type: 'features-public-slices',
          pattern: 'src/features/*/{store,domain,api}/**/*',
        },
        {
          type: 'services',
          pattern: 'src/services/**/*',
        },
        {
          type: 'shared',
          pattern: 'src/shared/**/*',
        },
      ],
    },
    rules: {
      // Regras de restrição baseadas em strings puras (compatibilidade máxima de esquema)
      'boundaries/element-types': [
        2, // Falha crítica no build se houver violação
        {
          default: 'allow',
          message: '${this.type} não tem permissão para importar ${target.type}',
          rules: [
            {
              from: 'shared',
              disallow: ['features-private', 'features-public-slices', 'app'],
              message: '🚨 Violou a Seção 10! A camada Shared deve ser pura e atômica. Proibido importar de Features ou App.',
            },
            {
              from: 'services',
              disallow: ['features-private', 'features-public-slices', 'shared', 'app'],
              message: '🚨 Quebra de Isolamento! A infraestrutura técnica de Services não pode depender de regras de negócio ou componentes visuais.',
            },
          ],
        },
      ],
    },
  },
])