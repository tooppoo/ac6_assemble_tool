import { fromBase, importRules } from '@ac6_assemble_tool/eslint/configs'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  fromBase([
    ...importRules({
      pathGroups: [
        {
          pattern: '#parts/**',
          group: 'builtin',
          position: 'before',
        },
      ],
    }),
  ]),
)
