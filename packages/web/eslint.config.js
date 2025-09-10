import { baseRules, importRules } from '@ac6_assemble_tool/eslint/configs'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import { parser as tsParser } from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['.svelte-kit/', 'dist/', 'coverage/', 'static/', '.wrangler/'],
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
      // TODO: Re-enable after migrating to Svelte 5 runes
      // Temporarily disable as legacy reactive syntax is still in use
      'svelte/prefer-svelte-reactivity': 'off',
    },
  },
]
