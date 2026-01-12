import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'

export type IndexEffect =
  | { type: 'serializeAssembly'; assembly: Assembly }
  | { type: 'pushState'; url: URL }
  | { type: 'syncLanguageFromQuery'; url: URL }
