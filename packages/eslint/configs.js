import eslint from '@eslint/js'
import * as tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import { configs as tsConfigs } from 'typescript-eslint'

export const globalIgnores = {
  ignores: ['dist/'],
}

export const baseRules = [
  eslint.configs.recommended,
  ...tsConfigs.recommended,
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxBOF: 1,
          maxEOF: 1,
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          bun: true,
          project: 'packages/*/tsconfig.json',
        },
      },
    },
  },
]

export const importRules = ({ pathGroups, ignoreUnresolved }) => [
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      'import/parsers': {
        /*
         * trick for eslint-plugin-import
         * https://github.com/import-js/eslint-plugin-import/issues/2556#issuecomment-1419518561
         */
        espree: ['.js', '.cjs', '.mjs', '.jsx'],
        '@typescript-eslint/parser': ['.ts', '.js'],
      },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
          pathGroups,
          distinctGroup: true,
        },
      ],
      'import/no-unresolved': [
        'error',
        {
          /*
           * monorepoのパッケージはno-unresolvedの対象から除外
           *
           * https://github.com/import-js/eslint-plugin-import?tab=readme-ov-file#importexternal-module-folders
           * external-module-folders の説明には「monorepoにも良い」と書かれているものの、恐らくrootからサブディレクトリのpackagesに対してlintをかける想定で
           * 今回のように完全にそれぞれのpackageでlintを実行するケースには適合していなさそう
           */
          ignore: ['^@ac6_assemble_tool', ...(ignoreUnresolved || [])],
        },
      ],
    },
  },
]

/**
 * @param {object[]} rules
 */
export function fromBase(rules = importRules([])) {
  return [
    globalIgnores,
    {
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: 2023,
          sourceType: 'module',
        },
        globals: {
          ...globals.node,
          ...globals.es2023,
        },
      },
    },
    ...baseRules,
    ...rules,
  ]
}
