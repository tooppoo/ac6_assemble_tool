import { fromBase, importRules } from '@ac6_assemble_tool/eslint/configs'
import { config as tsConfig } from 'typescript-eslint'

export default tsConfig(
  {
    ignores: ['.turbo', 'dist', '.wrangler', 'node_modules'],
  },
  ...fromBase([...importRules()]),
)
