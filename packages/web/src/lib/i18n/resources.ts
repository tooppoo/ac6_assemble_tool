import { enAssembly } from './locales/en/assembly'
import { enAssemblyStore } from './locales/en/assemblyStore'
import { enAttackType } from './locales/en/attackType'
import { enCategory } from './locales/en/category'
import { enClassification } from './locales/en/classification'
import { enError } from './locales/en/error'
import { enFilterOperand } from './locales/en/filter/operand'
import { enLock } from './locales/en/lock'
import { enManufactures } from './locales/en/manufactures'
import { enPageIndex } from './locales/en/pages'
import { enPartsListPage } from './locales/en/pages/parts-list'
import { enRandom } from './locales/en/random'
import { enShare } from './locales/en/share'
import { enSort } from './locales/en/sort'
import { enWeaponType } from './locales/en/weaponType'
import { jaAssembly } from './locales/ja/assembly'
import { jaAssemblyStore } from './locales/ja/assemblyStore'
import { jaAttackType } from './locales/ja/attackType'
import { jaCategory } from './locales/ja/category'
import { jaClassification } from './locales/ja/classification'
import { jaError } from './locales/ja/error'
import { jaFilterOperand } from './locales/ja/filter/operand'
import { jaLock } from './locales/ja/lock'
import { jaManufactures } from './locales/ja/manufactures'
import { jaPageIndex } from './locales/ja/pages'
import { jaPartsListPage } from './locales/ja/pages/parts-list'
import { jaRandom } from './locales/ja/random'
import { jaShare } from './locales/ja/share'
import { jaSort } from './locales/ja/sort'
import { jaWeaponType } from './locales/ja/weaponType'

export const resources = {
  ja: {
    translation: {
      times: '回',
    },
    random: jaRandom,
    assembly: jaAssembly,
    lock: jaLock,
    manufacture: jaManufactures,
    classification: jaClassification,
    category: jaCategory,
    attack_type: jaAttackType,
    'page/index': jaPageIndex,
    'page/parts-list': jaPartsListPage,
    'filter/operand': jaFilterOperand,
    sort: jaSort,
    error: jaError,
    share: jaShare,
    assembly_store: jaAssemblyStore,
    weapon_type: jaWeaponType,
  },
  en: {
    translation: {
      times: 'times',
    },
    random: enRandom,
    assembly: enAssembly,
    lock: enLock,
    manufacture: enManufactures,
    classification: enClassification,
    category: enCategory,
    attack_type: enAttackType,
    'page/index': enPageIndex,
    'page/parts-list': enPartsListPage,
    'filter/operand': enFilterOperand,
    sort: enSort,
    error: enError,
    share: enShare,
    assembly_store: enAssemblyStore,
    weapon_type: enWeaponType,
  },
} as const
