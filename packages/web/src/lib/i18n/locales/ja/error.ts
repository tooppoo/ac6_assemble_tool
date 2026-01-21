import {
  disallowArmsLoadOverName,
  disallowLoadOverName,
  notCarrySameUnitInSameSideName,
  notOverEnergyOutputName,
  totalCoamNotOverMaxName,
  totalLoadNotOverMaxName,
  disallowNotEquippedInSlotName,
  notEquippedTargetSlots,
} from '@ac6_assemble_tool/core/assembly/random/validator/validators'
import type { NotEquippedTargetSlot } from '@ac6_assemble_tool/core/assembly/random/validator/validators'

const toNotEquippedLabel = (slot: NotEquippedTargetSlot) => {
  switch (slot) {
    case 'rightArmUnit':
      return '右腕未装備'
    case 'leftArmUnit':
      return '左腕未装備'
    case 'rightBackUnit':
      return '右肩未装備'
    case 'leftBackUnit':
      return '左肩未装備'
    case 'expansion':
      return 'コア拡張未装備'
  }
}

export const jaError = {
  assembly: {
    overTryLimit: {
      description:
        '試行回数の上限を越えて生成に失敗したため、生成を中断しました',
    },
    [notOverEnergyOutputName]: {
      label: 'EN出力不足',
    },
    [notCarrySameUnitInSameSideName]: {
      label: '腕武器・肩武器重複',
    },
    [totalLoadNotOverMaxName]: {
      label: '総COAM上限を超過',
    },
    [totalCoamNotOverMaxName]: {
      label: '総積載量上限を超過',
    },
    [disallowLoadOverName]: {
      label: '積載超過',
    },
    [disallowArmsLoadOverName]: {
      label: '腕部積載超過',
    },
    ...notEquippedTargetSlots.reduce(
      (acc, slot) => ({
        ...acc,
        [disallowNotEquippedInSlotName(slot)]: {
          label: toNotEquippedLabel(slot),
        },
      }),
      {} as Record<string, { label: string }>,
    ),
    unknown: {
      label: '$t(unknown.label)',
    },
    retry: {
      guide: '違反頻度の多い条件を緩めて再実行してみてください',
    },
  },
  unknown: {
    label: '予期しないエラー',
    description: '予期しないエラーが発生しました',
  },
  guideToDevelop: '不具合報告をいただける場合は、下記URLからお願いします',
}
