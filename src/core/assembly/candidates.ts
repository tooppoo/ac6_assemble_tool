import type { VERSION as v1_06_1 } from '~data/versions/v1.06.1.ts'

export function getCandidates(
  version: v1_06_1,
): Promise<typeof import('~data/versions/v1.06.1.ts')>
export function getCandidates(version: string) {
  return import(`~data/versions/${version}.ts`)
}
