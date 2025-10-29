import {
  disallowArmsLoadOverName,
  disallowLoadOverName,
  notCarrySameUnitInSameSideName,
  notOverEnergyOutputName,
  totalCoamNotOverMaxName,
  totalLoadNotOverMaxName,
} from '@ac6_assemble_tool/core/assembly/random/validator/validators'

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
