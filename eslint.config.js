import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'off',

      // Phase 1 (当前): 基础收紧 - 已启用
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'warn',
      'no-empty-function': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-useless-escape': 'warn',

      // TypeScript 规则 - Phase 1收紧
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-as-const': 'warn',

      // Phase 2 (下个迭代): 更严格 - 暂时注释，待代码适配后启用
      // '@typescript-eslint/no-explicit-any': 'error',
      // '@typescript-eslint/strict-boolean-expressions': 'warn',
      // '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      // '@typescript-eslint/prefer-nullish-coalescing': 'error',
      // '@typescript-eslint/prefer-optional-chain': 'error',
    },
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['vite.config.ts', 'vitest.config.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
      },
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'docs/', '*.py', '*.yaml', '*.json', 'public/', '**/*.js', '**/*.config.*'],
  }
);
