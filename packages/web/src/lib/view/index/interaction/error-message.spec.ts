import type { I18Next } from '$lib/i18n/define'
import {
  assemblyErrorMessage,
  type Translator,
} from '$lib/view/index/interaction/error-message'

import { OverTryLimitError } from '@ac6_assemble_tool/core/assembly/random/random-assembly'
import {
  notCarrySameUnitInSameSideName,
  notOverEnergyOutputName,
  totalCoamNotOverMaxName,
  totalLoadNotOverMaxName,
  ValidationError,
  type ValidationName,
} from '@ac6_assemble_tool/core/assembly/random/validator/validators'
import { fc, it } from '@fast-check/vitest'
import type { ArrayConstraints } from 'fast-check'
import { afterEach, beforeEach, describe, expect, vi } from 'vitest'

describe(assemblyErrorMessage.name, () => {
  let i18n: Pick<I18Next, 't'>
  let mock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mock = vi.fn()
    i18n = {
      t: mock as never as I18Next['t'],
    }
  })
  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  renderUnknownError(() => ({ mock, i18n }), assemblyErrorMessage)

  describe('over try limit error', () => {
    const genValidationError = ({
      validationName,
      adjustable,
    }: {
      validationName: ValidationName
      adjustable: boolean
    }) =>
      fc
        .string()
        .map((msg) => new ValidationError(msg, { validationName, adjustable }))

    type TestCase = {
      load: ArrayConstraints
      coam: ArrayConstraints
      notAdjustable: ArrayConstraints
      unknown: ArrayConstraints
      expected: { load: number; coam: number; unknown: number }
    }

    describe.each<TestCase>([
      {
        load: { minLength: 0, maxLength: 0 },
        coam: { minLength: 0, maxLength: 0 },
        notAdjustable: { minLength: 0, maxLength: 0 },
        unknown: { minLength: 0, maxLength: 0 },
        expected: { load: 0, coam: 0, unknown: 0 },
      },
      {
        load: { minLength: 1 },
        coam: { minLength: 0, maxLength: 0 },
        notAdjustable: { minLength: 0, maxLength: 0 },
        unknown: { minLength: 0, maxLength: 0 },
        expected: { load: 1, coam: 0, unknown: 0 },
      },
      {
        load: { minLength: 0, maxLength: 0 },
        coam: { minLength: 1 },
        notAdjustable: { minLength: 0, maxLength: 0 },
        unknown: { minLength: 0, maxLength: 0 },
        expected: { load: 0, coam: 1, unknown: 0 },
      },
      {
        load: { minLength: 0, maxLength: 0 },
        coam: { minLength: 0, maxLength: 0 },
        notAdjustable: { minLength: 1 },
        unknown: { minLength: 0, maxLength: 0 },
        expected: { load: 0, coam: 0, unknown: 0 },
      },
      {
        load: { minLength: 0, maxLength: 0 },
        coam: { minLength: 0, maxLength: 0 },
        notAdjustable: { minLength: 0, maxLength: 0 },
        unknown: { minLength: 1 },
        expected: { load: 0, coam: 0, unknown: 1 },
      },
      {
        load: { minLength: 1 },
        coam: { minLength: 1 },
        notAdjustable: { minLength: 1 },
        unknown: { minLength: 1 },
        expected: { load: 1, coam: 1, unknown: 1 },
      },
    ])(
      'when load-error($load), coam-error($coam), not-adjustable-error($notAdjustable), unknown($unknown)',
      ({ load, coam, notAdjustable, unknown, expected }) => {
        const genTotalLoadNotOverMax = () =>
          genValidationError({
            validationName: totalLoadNotOverMaxName,
            adjustable: true,
          })
        const genTotalCoamNotOverMax = () =>
          genValidationError({
            validationName: totalCoamNotOverMaxName,
            adjustable: true,
          })
        const genNotAdjustable = () =>
          fc
            .constantFrom<ValidationName>(
              notOverEnergyOutputName,
              notCarrySameUnitInSameSideName,
            )
            .chain((validationName) =>
              genValidationError({
                validationName,
                adjustable: false,
              }),
            )
        it.prop([
          fc.array(genTotalLoadNotOverMax(), load),
          fc.array(genTotalCoamNotOverMax(), coam),
          fc.array(genNotAdjustable(), notAdjustable),
          fc.array(
            fc.string().map((s) => new Error(s)),
            unknown,
          ),
        ])(
          `should build error message for ${JSON.stringify(expected)}`,
          (loadError, coamError, notAdjustableError, unknownError) => {
            const shuffle = () => Math.random() - Math.random()
            const sut = new OverTryLimitError('over try limit', {
              limit: 5,
              errors: [
                ...loadError,
                ...coamError,
                ...notAdjustableError,
                ...unknownError,
              ].toSorted(shuffle),
            })

            mock.mockImplementation(() => '')

            assemblyErrorMessage(sut, i18n)

            expect(mock).toHaveBeenCalledTimesWith(
              1,
              'assembly.overTryLimit.description',
              {
                ns: 'error',
              },
            )
            expect(mock).toHaveBeenCalledTimesWith(
              expected.load,
              `assembly.${totalLoadNotOverMaxName}.label`,
              {
                ns: 'error',
              },
            )
            expect(mock).toHaveBeenCalledTimesWith(
              expected.coam,
              `assembly.${totalCoamNotOverMaxName}.label`,
              {
                ns: 'error',
              },
            )
            expect(mock).toHaveBeenCalledTimesWith(1, 'assembly.retry.guide', {
              ns: 'error',
            })
            expect(mock).toHaveBeenCalledTimesWith(1, 'assembly.retry.guide', {
              ns: 'error',
            })
            expect(mock).toHaveBeenCalledTimesWith(
              expected.load + expected.coam + expected.unknown,
              'times',
            )

            // fast-check の各試行間でもモック呼び出し回数をリセットする
            mock.mockClear()
          },
        )
      },
    )
  })
})

function renderUnknownError(
  provider: () => { i18n: Translator; mock: ReturnType<typeof vi.fn> },
  f: (e: Error, i18n: Translator) => unknown,
) {
  describe('unknown error', () => {
    it.prop([fc.string().map((s) => new Error(s))])(
      'should provide unknown message',
      (error) => {
        const { i18n, mock } = provider()

        f(error, i18n)

        expect(mock).toHaveBeenNthCalledWith(1, 'unknown.description', {
          ns: 'error',
        })
        expect(mock).toHaveBeenNthCalledWith(2, 'guideToDevelop', {
          ns: 'error',
        })
      },
    )
  })
}
