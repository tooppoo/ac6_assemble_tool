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
      return 'right arm not equipped'
    case 'leftArmUnit':
      return 'left arm not equipped'
    case 'rightBackUnit':
      return 'right shoulder not equipped'
    case 'leftBackUnit':
      return 'left shoulder not equipped'
    case 'expansion':
      return 'core expansion not equipped'
  }
}

export const enError = {
  assembly: {
    overTryLimit: {
      description: 'Generation aborted because exceeded the limit and failed.',
    },
    [notOverEnergyOutputName]: {
      label: 'lack of EN output',
    },
    [notCarrySameUnitInSameSideName]: {
      label: 'arm or back units are duplicated',
    },
    [totalLoadNotOverMaxName]: {
      label: 'over max COAM',
    },
    [totalCoamNotOverMaxName]: {
      label: 'over max load limit',
    },
    [disallowLoadOverName]: {
      label: 'over load limit',
    },
    [disallowArmsLoadOverName]: {
      label: 'over arm load limit',
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
      guide: 'Please retry relaxing conditions.',
    },
  },
  unknown: {
    label: 'Unexpected Error',
    description: 'Unexpected Error occurred',
  },
  guideToDevelop:
    'If you would like to report a problem, please report from the following URL.',
}
