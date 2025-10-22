import type { Assembly } from '#core/assembly/assembly'

import type { Result } from '@praha/byethrow'

export interface Validator {
  validate(assembly: Assembly): Result.Result<Assembly, Error[]>
}
