import { enAssembly } from './locales/en/assembly'
import { enAssemblyStore } from './locales/en/assemblyStore'
import { enAttackType } from './locales/en/attackType'
import { enError } from './locales/en/error'
import { enFilter } from './locales/en/filter'
import { enLock } from './locales/en/lock'
import { enManufactures } from './locales/en/manufactures'
import { enPageIndex } from './locales/en/pages'
import { enRandom } from './locales/en/random'
import { enShare } from './locales/en/share'
import { jaAssembly } from './locales/ja/assembly'
import { jaAssemblyStore } from './locales/ja/assemblyStore'
import { jaAttackType } from './locales/ja/attackType'
import { jaError } from './locales/ja/error'
import { jaFilter } from './locales/ja/filter'
import { jaLock } from './locales/ja/lock'
import { jaManufactures } from './locales/ja/manufactures'
import { jaPageIndex } from './locales/ja/pages'
import { jaRandom } from './locales/ja/random'
import { jaShare } from './locales/ja/share'

export const resources = {
  ja: {
    translation: {
      times: '回',
    },
    random: jaRandom,
    assembly: jaAssembly,
    filter: jaFilter,
    lock: jaLock,
    manufacture: jaManufactures,
    attack_type: jaAttackType,
    'page/index': jaPageIndex,
    error: jaError,
    share: jaShare,
    assembly_store: jaAssemblyStore,
  },
  en: {
    translation: {
      times: 'times',
    },
    random: enRandom,
    assembly: enAssembly,
    filter: enFilter,
    lock: enLock,
    manufacture: enManufactures,
    attack_type: enAttackType,
    'page/index': enPageIndex,
    error: enError,
    share: enShare,
    assembly_store: enAssemblyStore,
  },
} as const
