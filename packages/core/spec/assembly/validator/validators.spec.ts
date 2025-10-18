import {
  disallowArmsLoadOver,
  disallowLoadOver,
  notCarrySameUnitInSameSide,
  notOverEnergyOutput,
  totalCoamNotOverMax,
  totalLoadNotOverMax,
} from '#core/assembly/random/validator/validators'

import type { LeftArmUnit, ArmUnit } from '@ac6_assemble_tool/parts/arm-units'
import {
  type ArmNotEquipped,
  armNotEquipped,
} from '@ac6_assemble_tool/parts/not-equipped'
import { notEquipped as notEquippedClass } from '@ac6_assemble_tool/parts/types/base/classification'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import * as fc from 'fast-check'
import sinon from 'sinon'

import { genAssembly } from '#spec-helper/property-generator'

describe('validator', () => {
  describe('not over energy output', () => {
    let sandbox: sinon.SinonSandbox
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => {
      sandbox.restore()
    })

    describe.each([{ withinEnOutput: true }, { withinEnOutput: false }])(
      'when within en output is $withinEnLoad',
      ({ withinEnOutput }) => {
        test(`is energy enough -> ${withinEnOutput}`, () => {
          fc.assert(
            fc.property(genAssembly(), (assembly) => {
              const stubAssembly = sinon.stub(assembly, 'withinEnOutput')
              stubAssembly.value(withinEnOutput)

              expect(notOverEnergyOutput.validate(assembly).isSuccess).toBe(
                withinEnOutput,
              )
            }),
          )
        })
      },
    )
  })

  describe('not carry same unit in same side hand and back', () => {
    describe('when carry same unit', () => {
      const candidatesForTest = ((): Candidates => {
        const withoutNotEquipped = <T extends { classification: string }>(
          p: T,
        ) => p.classification !== notEquippedClass

        return {
          ...candidates,
          rightArmUnit: candidates.rightArmUnit.filter(withoutNotEquipped),
          leftArmUnit: candidates.leftArmUnit.filter(withoutNotEquipped),
          rightBackUnit: candidates.rightBackUnit.filter(withoutNotEquipped),
          leftBackUnit: candidates.leftBackUnit.filter(withoutNotEquipped),
        }
      })()

      describe('at right side', () => {
        test('should evaluate as invalid', () => {
          fc.assert(
            fc.property(genAssembly(candidatesForTest), (assembly) => {
              assembly.rightBackUnit = assembly.rightArmUnit
              assembly.leftArmUnit = candidatesForTest.leftArmUnit[0]
              assembly.leftBackUnit = candidatesForTest.leftBackUnit[0]

              expect(
                notCarrySameUnitInSameSide.validate(assembly).isSuccess,
              ).toBe(false)
            }),
          )
        })

        describe('when not equipped', () => {
          test('should evaluate as valid. "not equipped" is allowed', () => {
            fc.assert(
              fc.property(genAssembly(candidatesForTest), (assembly) => {
                assembly.rightBackUnit = assembly.rightArmUnit = armNotEquipped
                assembly.leftArmUnit = candidatesForTest.leftArmUnit[0]
                assembly.leftBackUnit = candidatesForTest.leftBackUnit[0]

                expect(
                  notCarrySameUnitInSameSide.validate(assembly).isSuccess,
                ).toBe(true)
              }),
            )
          })
        })
      })
      describe('at left side', () => {
        test('should evaluate as invalid', () => {
          fc.assert(
            fc.property(genAssembly(candidatesForTest), (assembly) => {
              assembly.leftBackUnit = assembly.leftArmUnit
              assembly.rightArmUnit = candidatesForTest.rightArmUnit[0]
              assembly.rightBackUnit = candidatesForTest.rightBackUnit[0]

              expect(
                notCarrySameUnitInSameSide.validate(assembly).isSuccess,
              ).toBe(false)
            }),
          )
        })
        describe('when not equipped', () => {
          test('should evaluate as valid. "not equipped" is allowed', () => {
            fc.assert(
              fc.property(genAssembly(candidatesForTest), (assembly) => {
                assembly.leftBackUnit = assembly.leftArmUnit = armNotEquipped
                assembly.rightArmUnit = candidatesForTest.rightArmUnit[0]
                assembly.rightBackUnit = candidatesForTest.rightBackUnit[0]

                expect(
                  notCarrySameUnitInSameSide.validate(assembly).isSuccess,
                ).toBe(true)
              }),
            )
          })
        })
      })
      describe('at both side', () => {
        test('should evaluate as invalid', () => {
          fc.assert(
            fc.property(genAssembly(candidatesForTest), (assembly) => {
              assembly.rightBackUnit = assembly.rightArmUnit
              assembly.leftBackUnit = assembly.leftArmUnit

              expect(
                notCarrySameUnitInSameSide.validate(assembly).isSuccess,
              ).toBe(false)
            }),
          )
        })
        describe('when not equipped', () => {
          test('should evaluate as valid. "not equipped" is allowed', () => {
            fc.assert(
              fc.property(genAssembly(candidatesForTest), (assembly) => {
                assembly.rightBackUnit = assembly.rightArmUnit = armNotEquipped
                assembly.leftBackUnit = assembly.leftArmUnit = armNotEquipped

                expect(
                  notCarrySameUnitInSameSide.validate(assembly).isSuccess,
                ).toBe(true)
              }),
            )
          })
        })
      })
    })
    describe('when not carry same unit at same side', () => {
      const candidatesForTest = (() => {
        const halfSlice = <T>(xs: readonly T[]): readonly T[] =>
          xs.slice(0, Math.floor(xs.length / 2))
        const exclude = <
          T extends { name: string },
          U extends { name: string },
        >(
          xs: readonly T[],
          ex: readonly U[],
        ): readonly T[] => xs.filter((x) => !ex.find((e) => e.name == x.name))

        // 腕武器と肩武器の候補が重ならないように調整
        const rightArmUnit = halfSlice<ArmUnit | ArmNotEquipped>(
          candidates.rightArmUnit,
        )
        const rightBackUnit = exclude(candidates.rightBackUnit, rightArmUnit)
        const leftArmUnit = halfSlice<LeftArmUnit | ArmUnit | ArmNotEquipped>(
          candidates.leftArmUnit,
        )
        const leftBackUnit = exclude(candidates.leftBackUnit, leftArmUnit)

        return {
          ...candidates,
          rightArmUnit,
          rightBackUnit,
          leftArmUnit,
          leftBackUnit,
        }
      })()

      test('should evaluate as valid', () => {
        fc.assert(
          fc.property(genAssembly(candidatesForTest), (assembly) => {
            expect(
              notCarrySameUnitInSameSide.validate(assembly).isSuccess,
            ).toBe(true)
          }),
        )
      })
    })
  })

  describe('total coam not over max', () => {
    test('when total coam <= max then success, else failure', () => {
      fc.assert(
        fc.property(genAssembly(), fc.integer({ min: 0 }), (assembly, max) => {
          const sut = totalCoamNotOverMax(max)

          expect(sut.validate(assembly).isSuccess).toBe(assembly.coam <= max)
        }),
      )
    })
  })
  describe('total load not over max', () => {
    test('when total load <= max then success, else failure', () => {
      fc.assert(
        fc.property(genAssembly(), fc.integer({ min: 0 }), (assembly, max) => {
          const sut = totalLoadNotOverMax(max)

          expect(sut.validate(assembly).isSuccess).toBe(assembly.load <= max)
        }),
      )
    })
  })

  describe('disallow over load', () => {
    test('when within load, validation is success', () => {
      fc.assert(
        fc.property(genAssembly(), (assembly) => {
          const sut = disallowLoadOver()

          expect(sut.validate(assembly).isSuccess).toBe(
            assembly.withinLoadLimit,
          )
        }),
      )
    })
    test('even if arms load over, if load not over, validation success', () => {
      fc.assert(
        fc.property(
          genAssembly().filter(
            (a) => !a.withinArmsLoadLimit && a.withinLoadLimit,
          ),
          (assembly) => {
            const sut = disallowLoadOver()

            expect(sut.validate(assembly).isSuccess).toBe(true)
          },
        ),
      )
    })
  })
  describe('disallow over arms load', () => {
    test('when within arms load, validation is success', () => {
      fc.assert(
        fc.property(genAssembly(), (assembly) => {
          const sut = disallowArmsLoadOver()

          expect(sut.validate(assembly).isSuccess).toBe(
            assembly.withinArmsLoadLimit,
          )
        }),
      )
    })
    test('even if load over, if arms load not over, validation success', () => {
      fc.assert(
        fc.property(
          genAssembly().filter(
            (a) => a.withinArmsLoadLimit && !a.withinLoadLimit,
          ),
          (assembly) => {
            const sut = disallowArmsLoadOver()

            expect(sut.validate(assembly).isSuccess).toBe(true)
          },
        ),
      )
    })
  })
})
