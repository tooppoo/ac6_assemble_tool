import type { I18Next } from '$lib/i18n/define'
import {
  assemblyErrorMessage,
  filterApplyErrorMessage,
  type Translator,
} from '$lib/view/index/interaction/error-message'

import { UsableItemNotFoundError } from '@ac6_assemble_tool/core/assembly/filter/filters'
import { OverTryLimitError } from '@ac6_assemble_tool/core/assembly/random/random-assembly'
import {
  notCarrySameUnitInSameSideName,
  notOverEnergyOutputName,
  totalCoamNotOverMaxName,
  totalLoadNotOverMaxName,
  ValidationError,
  type ValidationName,
} from '@ac6_assemble_tool/core/assembly/random/validator/validators'
import { genAssemblyKey } from '@ac6_assemble_tool/core/spec-helper/property-generator'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  type Mock,
  vi,
} from 'bun:test'
import * as fc from 'fast-check'
import type { ArrayConstraints } from 'fast-check'

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
        .map((msg) => new ValidationError({ validationName, adjustable }, msg))

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

        afterEach(() => {
          vi.restoreAllMocks()
        })
        test(`should build error message for ${JSON.stringify(expected)}`, () => {
          fc.assert(
            fc.property(
              fc.array(genTotalLoadNotOverMax(), load),
              fc.array(genTotalCoamNotOverMax(), coam),
              fc.array(genNotAdjustable(), notAdjustable),
              fc.array(
                fc.string().map((s) => new Error(s)),
                unknown,
              ),
              (loadError, coamError, notAdjustableError, unknownError) => {
                const shuffle = () => Math.random() - Math.random()
                const sut = new OverTryLimitError({
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
                expect(mock).toHaveBeenCalledTimesWith(
                  1,
                  'assembly.retry.guide',
                  {
                    ns: 'error',
                  },
                )
                expect(mock).toHaveBeenCalledTimesWith(
                  1,
                  'assembly.retry.guide',
                  {
                    ns: 'error',
                  },
                )
                expect(mock).toHaveBeenCalledTimesWith(
                  expected.load + expected.coam + expected.unknown,
                  'times',
                )

                // test(prop で実行する場合、
                // beforeEachの前に次のプロパティが実行される模様
                vi.restoreAllMocks()
              },
            ),
          )
        })
      },
    )
  })
})

describe(filterApplyErrorMessage.name, () => {
  let i18n: Pick<I18Next, 't'>
  let mock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mock = vi.fn()
    i18n = {
      t: mock as never as I18Next['t'],
    }
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  renderUnknownError(() => ({ mock, i18n }), filterApplyErrorMessage)

  describe(UsableItemNotFoundError.name, () => {
    test('should show description about the error and guide for next action', () => {
      fc.assert(
        fc.property(genAssemblyKey(), (key) => {
          const error = new UsableItemNotFoundError({
            key,
            property: 'manufacture',
          })

          filterApplyErrorMessage(error, i18n)

          expect(mock).toHaveBeenCalledTimesWith(
            1,
            'filter.notFound.description',
            {
              ns: 'error',
            },
          )
          expect(mock).toHaveBeenCalledTimesWith(1, 'filter.notFound.guide', {
            ns: 'error',
          })
          // test(prop で実行する場合、
          // beforeEachの前に次のプロパティが実行される模様
          vi.restoreAllMocks()
        }),
      )
    })
  })
})

function renderUnknownError(
  provider: () => { i18n: Translator; mock: Mock },
  f: (e: Error, i18n: Translator) => unknown,
) {
  describe('unknown error', () => {
    test('should provide unknown message', () => {
      fc.assert(
        fc.property(
          fc.string().map((s) => new Error(s)),
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
        ),
      )
    })
  })
}
