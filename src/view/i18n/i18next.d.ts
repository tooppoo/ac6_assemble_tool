import 'i18next'
import { jaAttackType } from '~view/i18n/locales/ja/attackType.ts'
import type { jaError } from '~view/i18n/locales/ja/error.ts'
import type { jaManufactures } from '~view/i18n/locales/ja/manufactures.ts'

import type { jaAssembly } from './locales/ja/assembly.ts'
import type { jaFilter } from './locales/ja/filter.ts'
import type { jaLock } from './locales/ja/lock.ts'
import type { jaPageIndex } from './locales/ja/pages/index.ts'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      assembly: typeof jaAssembly
      lock: typeof jaLock
      filter: typeof jaFilter
      manufacture: typeof jaManufactures
      attack_ype: typeof jaAttackType
      'page/index': typeof jaPageIndex
      error: typeof jaError
    }
  }
}
