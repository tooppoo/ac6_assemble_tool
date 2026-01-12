import { type I18Next } from '$lib/i18n/define'

import { type Assembly } from '@ac6_assemble_tool/core/assembly/assembly'

export function stringifyAssembly(assembly: Assembly): string {
  return `RIGHT ARM UNIT: ${assembly.rightArmUnit.name}
LEFT ARM UNIT: ${assembly.leftArmUnit.name}
RIGHT BACK UNIT: ${assembly.rightBackUnit.name}
LEFT BACK UNIT: ${assembly.leftBackUnit.name}

HEAD: ${assembly.head.name}
CORE: ${assembly.core.name}
ARMS: ${assembly.arms.name}
LEGS: ${assembly.legs.name}

BOOSTER: ${assembly.booster.name}
FCS: ${assembly.fcs.name}
GENERATOR: ${assembly.generator.name}

EXPANSION: ${assembly.expansion.name}`
}

export function stringifyStatus(assembly: Assembly, i18n: I18Next): string {
  return `${i18n.t('ap', { ns: 'assembly' })}: ${assembly.ap}
${i18n.t('attitudeStability', { ns: 'assembly' })}: ${assembly.attitudeStability}

${i18n.t('antiKineticDefense', { ns: 'assembly' })}: ${assembly.antiKineticDefense}
${i18n.t('antiEnergyDefense', { ns: 'assembly' })}: ${assembly.antiEnergyDefense}
${i18n.t('antiExplosiveDefense', { ns: 'assembly' })}: ${assembly.antiExplosiveDefense}

${i18n.t('weight', { ns: 'assembly' })}: ${assembly.weight}
${i18n.t('load', { ns: 'assembly' })}: ${assembly.load}
${i18n.t('loadLimit', { ns: 'assembly' })}: ${assembly.loadLimit}
${i18n.t('armsLoad', { ns: 'assembly' })}: ${assembly.armsLoad}
${i18n.t('armsLoadLimit', { ns: 'assembly' })}: ${assembly.armsLoadLimit}

${i18n.t('enLoad', { ns: 'assembly' })}: ${assembly.enLoad}
${i18n.t('enOutput', { ns: 'assembly' })}: ${assembly.enOutput}
${i18n.t('enCapacity', { ns: 'assembly' })}: ${assembly.enCapacity}
${i18n.t('enSurplus', { ns: 'assembly' })}: ${assembly.enSurplus}
${i18n.t('enSupplyEfficiency', { ns: 'assembly' })}: ${assembly.enSupplyEfficiency}
${i18n.t('enRechargeDelay', { ns: 'assembly' })}: ${assembly.enRechargeDelay}
${i18n.t('enRecoveryDelay', { ns: 'assembly' })}: ${assembly.enRecoveryDelay}

${i18n.t('qbEnConsumption', { ns: 'assembly' })}: ${assembly.qbEnConsumption}

${i18n.t('coam', { ns: 'assembly' })}: ${assembly.coam}`
}
