import type { I18Next } from '$lib/i18n/define'

import { OverTryLimitError } from '@ac6_assemble_tool/core/assembly/random/random-assembly'
import {
  ValidationError,
  type ValidationName,
} from '@ac6_assemble_tool/core/assembly/random/validator/validators'

export type Translator = Pick<I18Next, 't'>

export function assemblyErrorMessage(error: Error, i18n: Translator): string[] {
  if (error instanceof OverTryLimitError) {
    return [
      i18n.t('assembly.overTryLimit.description', { ns: 'error' }),
      '',
      ...Array.from(
        groupValidationErrorByValidationName(error.errors).entries(),
      )
        .toSorted(([_a, ac], [_b, bc]) => bc - ac)
        .reduce((acc, [k, c]) => {
          const count = `${c}${i18n.t('times')}`
          switch (k) {
            case 'unknown':
              return [
                ...acc,
                `${i18n.t('assembly.unknown.label', { ns: 'error' })}: ${count}`,
              ]
            default: {
              const errorKey = `assembly.${k}.label` as const

              return [...acc, `${i18n.t(errorKey, { ns: 'error' })}: ${count}`]
            }
          }
        }, [] as string[]),
      '',
      i18n.t('assembly.retry.guide', { ns: 'error' }),
    ]
  }

  return unknownErrorMessage(i18n)
}
function groupValidationErrorByValidationName(
  xs: readonly Error[],
): Map<ValidationName | 'unknown', number> {
  return xs.reduce((m, x) => {
    if (x instanceof ValidationError && !x.adjustable) {
      // ユーザー側で調整できないものは見せない
      return m
    }
    const key = x instanceof ValidationError ? x.validatorName : 'unknown'
    const count = m.get(key) || 0
    m.set(key, count + 1)

    return m
  }, new Map<ValidationName | 'unknown', number>())
}

function unknownErrorMessage(i18n: Translator): string[] {
  return [
    i18n.t('unknown.description', { ns: 'error' }),
    '',
    i18n.t('guideToDevelop', { ns: 'error' }),
    'https://github.com/tooppoo/ac6_assemble_tool/issues/new',
  ]
}
