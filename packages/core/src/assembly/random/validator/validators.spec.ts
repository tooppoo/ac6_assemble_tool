import type { LeftArmUnit, ArmUnit } from '@ac6_assemble_tool/parts/arm-units'
import {
  type ArmNotEquipped,
  armNotEquipped,
} from '@ac6_assemble_tool/parts/not-equipped'
import { notEquipped as notEquippedClass } from '@ac6_assemble_tool/parts/types/base/classification'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { fc, it as fcit } from '@fast-check/vitest'
import sinon from 'sinon'
import { afterEach, beforeEach, describe, expect } from 'vitest'

import {
  disallowArmsLoadOver,
  disallowLoadOver,
  notCarrySameUnitInSameSide,
  notOverEnergyOutput,
  totalCoamNotOverMax,
  totalLoadNotOverMax,
} from './validators'

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
        fcit.prop([genAssembly()])(
          `is energy enough -> ${withinEnOutput}`,
          (assembly) => {
            const stubAssembly = sinon.stub(assembly, 'withinEnOutput')
            stubAssembly.value(withinEnOutput)

            expect(notOverEnergyOutput.validate(assembly).isSuccess).toBe(
              withinEnOutput,
            )
          },
        )
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
        fcit.prop([genAssembly(candidatesForTest)])(
          'should evaluate as invalid',
          (assembly) => {
            assembly.rightBackUnit = assembly.rightArmUnit
            assembly.leftArmUnit = candidatesForTest.leftArmUnit[0]
            assembly.leftBackUnit = candidatesForTest.leftBackUnit[0]

            expect(
              notCarrySameUnitInSameSide.validate(assembly).isSuccess,
            ).toBe(false)
          },
        )

        describe('when not equipped', () => {
          fcit.prop([genAssembly(candidatesForTest)])(
            'should evaluate as valid. "not equipped" is allowed',
            (assembly) => {
              assembly.rightBackUnit = assembly.rightArmUnit = armNotEquipped
              assembly.leftArmUnit = candidatesForTest.leftArmUnit[0]
              assembly.leftBackUnit = candidatesForTest.leftBackUnit[0]

              expect(
                notCarrySameUnitInSameSide.validate(assembly).isSuccess,
              ).toBe(true)
            },
          )
        })
      })
      describe('at left side', () => {
        fcit.prop([genAssembly(candidatesForTest)])(
          'should evaluate as invalid',
          (assembly) => {
            assembly.leftBackUnit = assembly.leftArmUnit
            assembly.rightArmUnit = candidatesForTest.rightArmUnit[0]
            assembly.rightBackUnit = candidatesForTest.rightBackUnit[0]

            expect(
              notCarrySameUnitInSameSide.validate(assembly).isSuccess,
            ).toBe(false)
          },
        )
        describe('when not equipped', () => {
          fcit.prop([genAssembly(candidatesForTest)])(
            'should evaluate as valid. "not equipped" is allowed',
            (assembly) => {
              assembly.leftBackUnit = assembly.leftArmUnit = armNotEquipped
              assembly.rightArmUnit = candidatesForTest.rightArmUnit[0]
              assembly.rightBackUnit = candidatesForTest.rightBackUnit[0]

              expect(
                notCarrySameUnitInSameSide.validate(assembly).isSuccess,
              ).toBe(true)
            },
          )
        })
      })
      describe('at both side', () => {
        fcit.prop([genAssembly(candidatesForTest)])(
          'should evaluate as invalid',
          (assembly) => {
            assembly.rightBackUnit = assembly.rightArmUnit
            assembly.leftBackUnit = assembly.leftArmUnit

            expect(
              notCarrySameUnitInSameSide.validate(assembly).isSuccess,
            ).toBe(false)
          },
        )
        describe('when not equipped', () => {
          fcit.prop([genAssembly(candidatesForTest)])(
            'should evaluate as valid. "not equipped" is allowed',
            (assembly) => {
              assembly.rightBackUnit = assembly.rightArmUnit = armNotEquipped
              assembly.leftBackUnit = assembly.leftArmUnit = armNotEquipped

              expect(
                notCarrySameUnitInSameSide.validate(assembly).isSuccess,
              ).toBe(true)
            },
          )
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

      fcit.prop([genAssembly(candidatesForTest)])(
        'should evaluate as valid',
        (assembly) => {
          expect(notCarrySameUnitInSameSide.validate(assembly).isSuccess).toBe(
            true,
          )
        },
      )
    })
  })

  describe('total coam not over max', () => {
    fcit.prop([genAssembly(), fc.integer({ min: 0 })])(
      'when total coam <= max then success, else failure',
      (assembly, max) => {
        const sut = totalCoamNotOverMax(max)

        expect(sut.validate(assembly).isSuccess).toBe(assembly.coam <= max)
      },
    )
  })
  describe('total load not over max', () => {
    fcit.prop([genAssembly(), fc.integer({ min: 0 })])(
      'when total load <= max then success, else failure',
      (assembly, max) => {
        const sut = totalLoadNotOverMax(max)

        expect(sut.validate(assembly).isSuccess).toBe(assembly.load <= max)
      },
    )
  })

  describe('disallow over load', () => {
    fcit.prop([genAssembly()])(
      'when within load, validation is success',
      (assembly) => {
        const sut = disallowLoadOver()

        expect(sut.validate(assembly).isSuccess).toBe(assembly.withinLoadLimit)
      },
    )
    fcit.prop([
      genAssembly().filter((a) => !a.withinArmsLoadLimit && a.withinLoadLimit),
    ])(
      'even if arms load over, if load not over, validation success',
      (assembly) => {
        const sut = disallowLoadOver()

        expect(sut.validate(assembly).isSuccess).toBe(true)
      },
    )
  })
  describe('disallow over arms load', () => {
    fcit.prop([genAssembly()])(
      'when within arms load, validation is success',
      (assembly) => {
        const sut = disallowArmsLoadOver()

        expect(sut.validate(assembly).isSuccess).toBe(
          assembly.withinArmsLoadLimit,
        )
      },
    )
    fcit.prop([
      genAssembly().filter((a) => a.withinArmsLoadLimit && !a.withinLoadLimit),
    ])(
      'even if load over, if arms load not over, validation success',
      (assembly) => {
        const sut = disallowArmsLoadOver()

        expect(sut.validate(assembly).isSuccess).toBe(true)
      },
    )
  })
})
