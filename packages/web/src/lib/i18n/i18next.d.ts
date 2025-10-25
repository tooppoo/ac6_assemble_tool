import 'i18next'
import type { jaAssembly } from './locales/ja/assembly'
import type { jaAttackType } from './locales/ja/attackType'
import type { jaCategory } from './locales/ja/category'
import type { jaClassification } from './locales/ja/classification'
import type { jaError } from './locales/ja/error'
import type { jaFilter } from './locales/ja/filter'
import type { jaLock } from './locales/ja/lock'
import type { jaManufactures } from './locales/ja/manufactures'
import type { jaPageIndex } from './locales/ja/pages/index'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      assembly: typeof jaAssembly
      lock: typeof jaLock
      filter: typeof jaFilter
      manufacture: typeof jaManufactures
      classification: typeof jaClassification
      category: typeof jaCategory
      attack_ype: typeof jaAttackType
      'page/index': typeof jaPageIndex
      error: typeof jaError
    }
  }
}
