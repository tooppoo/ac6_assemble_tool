import { baseRules, importRules } from '@ac6_assemble_tool/eslint/configs'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import { parser as tsParser } from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['.svelte-kit/', 'dist/', 'coverage/'],
  },
  ...baseRules,
  ...svelte.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
  },
  ...importRules({
    pathGroups: [
      {
        pattern: '$lib/**',
        group: 'builtin',
        position: 'before',
      },
    ],
    ignoreUnresolved: [
      '^\\$app',
      '\\$env',
      '@testing-library/jest-dom/vitest',
      '@testing-library/svelte/vitest',
      'fake-indexeddb/auto',
    ],
  }),
  {
    rules: {
      'svelte/prefer-svelte-reactivity': 'error',
      // クエリやハッシュを伴う伴うリンクに対応できないので、無効化
      'svelte/no-navigation-without-resolve': 'off',
    },
  },
]
