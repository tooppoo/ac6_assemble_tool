import { fc, it } from '@fast-check/vitest'
import { describe, expect } from 'vitest'

import {
  Report,
  ReportAggregation,
  ReportBlock,
  defaultReportAggregation,
  type ReportKey,
} from './report'

describe(ReportAggregation, () => {
  describe(ReportAggregation.fromDto, () => {
    it.prop([genReportAggregation()])('build from dto', (aggregation) => {
      const dto = aggregation.toDto()

      expect(ReportAggregation.fromDto(dto)).toEqual(aggregation)
    })
  })

  describe('blocks', () => {
    it.prop([genReportAggregation()])(
      'show some reports every block',
      (aggregation) => {
        expect(aggregation.blocks.every((b) => b.someReportsShown)).toBe(true)
      },
    )
    it.prop([genReportAggregation()])(
      'length less than or equal allBlocks.length',
      (aggregation) => {
        expect(aggregation.blocks.length).toBeLessThanOrEqual(
          aggregation.allBlocks.length,
        )
      },
    )
    it.prop([genReportAggregation()])(
      'contained in all blocks',
      (aggregation) => {
        expect(aggregation.allBlocks).toEqual(
          expect.arrayContaining([...aggregation.blocks]),
        )
      },
    )
  })

  describe(ReportAggregation.prototype.updateReport, () => {
    const aggregation = defaultReportAggregation()

    describe('specified exist', () => {
      describe.each([
        {
          aggregate: aggregation,
          blockIndex: 0,
          target: Report.create('ap').toggleShow(),
          expectedBlock: ReportBlock.create([
            new Report('ap', false),
            new Report('attitudeStability', true),
          ]),
        },
        {
          aggregate: aggregation,
          blockIndex: 2,
          target: Report.create('weight').toggleShow(),
          expectedBlock: ReportBlock.create([
            new Report('weight', false),
            new Report('load', true),
            new Report('loadLimit', true),
          ]),
        },
      ])(
        '$aggregation.updateReport in blocks[$blockIndex] by $target',
        ({ aggregate, blockIndex, target, expectedBlock }) => {
          it(`updated blocks[${blockIndex}] should be ${expectedBlock}`, () => {
            const targetBlockId = aggregate.allBlocks[blockIndex].id
            const updated = aggregate.updateReport(targetBlockId, target)

            expect(updated.allBlocks[blockIndex].allReports).toEqual(
              expectedBlock.allReports,
            )
          })
        },
      )
    })
    describe('specified not exist', () => {
      describe.each([
        {
          aggregate: aggregation,
          blockId: aggregation.allBlocks[0].id,
          target: Report.create('weight').toggleShow(),
        },
        {
          aggregate: aggregation,
          blockId: 'unknown',
          target: Report.create('coam').toggleShow(),
        },
      ])(
        '$aggregation.updateReport($blockId, $target)',
        ({ aggregate, blockId, target }) => {
          it(`not change anything`, () => {
            const updated = aggregate.updateReport(blockId, target)

            expect(aggregate).toBe(updated)
          })
        },
      )
    })
  })

  describe(ReportAggregation.prototype.showAll, () => {
    it.prop([genReportAggregation()])(
      'always all reports shown',
      (aggregation) => {
        expect(aggregation.showAll().allReports.every((r) => r.show)).toBe(true)
      },
    )
  })
})

describe(ReportBlock, () => {
  describe(ReportBlock.fromDto, () => {
    it.prop([genReportBlock()])('build from dto', (block) => {
      const dto = block.toDto()

      expect(ReportBlock.fromDto(dto)).toEqual(block)
    })
  })
  describe('allReports', () => {
    it.prop([fc.array(genReport())])('return all reports', (reports) => {
      const block = ReportBlock.create(reports)

      expect(block.allReports).toEqual(reports)
    })
  })
  describe('reports', () => {
    it.prop([genReportBlock()])('less than or equal all reports', (block) => {
      expect(block.reports.length).lessThanOrEqual(block.allReports.length)
    })
    it.prop([genReportBlock()])('any report is show', (block) => {
      expect(block.reports.every((r) => r.show)).toBe(true)
    })
    it.prop([genReportBlock()])(
      'any report is contained in all reports',
      (block) => {
        expect(block.allReports).toEqual(
          // readonly Report[] を Report[] にするために配列を作り直し
          expect.arrayContaining([...block.reports]),
        )
      },
    )
  })
  describe('someReportsShown', () => {
    describe('when some reports are shown', () => {
      it.prop([genReportBlock(), genReportKey()])(
        'should return true',
        (baseBlock, key) => {
          const block = ReportBlock.create([
            ...baseBlock.allReports,
            new Report(key, true),
          ])

          expect(block.someReportsShown).toBe(true)
        },
      )
    })
    describe('when no reports are shown', () => {
      it.prop([fc.array(genReportKey())])('should return false', (keys) => {
        const block = ReportBlock.create(keys.map((k) => new Report(k, false)))

        expect(block.someReportsShown).toBe(false)
      })
    })
  })
  describe(ReportBlock.prototype.indexOf, () => {
    const genReports = () => [
      Report.create('ap'),
      Report.create('weight'),
      Report.create('load'),
    ]
    describe.each([
      { reports: genReports(), target: Report.create('ap'), expected: 0 },
      { reports: genReports(), target: Report.create('weight'), expected: 1 },
      { reports: genReports(), target: Report.create('load'), expected: 2 },
      {
        reports: genReports(),
        target: Report.create('enLoad'),
        expected: null,
      },
    ])(
      'ReportBlock($reports).indexOf($target)',
      ({ reports, target, expected }) => {
        it(`should return ${expected}`, () => {
          const block = ReportBlock.create(reports)

          expect(block.indexOf(target)).toBe(expected)
        })
      },
    )
  })
  describe(ReportBlock.prototype.replaceAt, () => {
    describe.each([
      {
        reports: [
          Report.create('ap'),
          Report.create('weight'),
          Report.create('enLoad'),
        ],
        index: 0,
        target: Report.create('load'),
        expected: [
          Report.create('load'),
          Report.create('weight'),
          Report.create('enLoad'),
        ],
      },
      {
        reports: [
          Report.create('ap'),
          Report.create('weight'),
          Report.create('enLoad'),
        ],
        index: 2,
        target: Report.create('load'),
        expected: [
          Report.create('ap'),
          Report.create('weight'),
          Report.create('load'),
        ],
      },
      {
        reports: [
          Report.create('ap'),
          Report.create('weight'),
          Report.create('enLoad'),
        ],
        index: 3,
        target: Report.create('load'),
        expected: [
          Report.create('ap'),
          Report.create('weight'),
          Report.create('enLoad'),
          Report.create('load'),
        ],
      },
      {
        reports: [],
        index: 1,
        target: Report.create('load'),
        expected: [Report.create('load')],
      },
    ])(
      'ReportBlock($reports).replaceAt($index, $target)',
      ({ reports, index, target, expected }) => {
        it(`should be ${expected}`, () => {
          const block = ReportBlock.create(reports)

          expect(block.replaceAt(index, target).allReports).toEqual(expected)
        })
      },
    )
  })
  describe(ReportBlock.prototype.showAll, () => {
    it.prop([genReportBlock()])('all report should be shown', (block) => {
      expect(block.showAll().reports.every((r) => r.show)).toBe(true)
    })
    it.prop([genReportBlock()])(
      'after allShow, after.reports.length equals with before.allReports.length',
      (block) => {
        expect(block.showAll().reports.length).toBe(block.allReports.length)
      },
    )
  })
  describe(ReportBlock.prototype.containProblemFor, () => {
    type AssemblyLike = Parameters<ReportBlock['containProblemFor']>[0]
    const baseAssemblyLike: AssemblyLike = {
      withinEnOutput: true,
      withinArmsLoadLimit: true,
      withinLoadLimit: true,
    }

    describe('when any report not normal', () => {
      const assemblyLike = {
        ...baseAssemblyLike,
        withinEnOutput: false,
      }
      it.prop([genReportBlock()])('should return true', (block) => {
        // make sure at least one report is about energy load
        const energyReport = Report.create('enLoad')
        const testBlock = ReportBlock.create([
          ...block.allReports,
          energyReport,
        ])

        expect(testBlock.containProblemFor(assemblyLike)).toBe(true)
      })
    })
    describe('when all reports are normal', () => {
      const assemblyLike = { ...baseAssemblyLike }
      it.prop([genReportBlock()])('should return false', (block) => {
        const normalReports = block.allReports
        const testBlock = ReportBlock.create(normalReports)

        expect(testBlock.containProblemFor(assemblyLike)).toBe(false)
      })
    })
  })
})

describe(Report, () => {
  describe(Report.fromDto, () => {
    it.prop([genReport()])('build from dto', (report) => {
      const dto = report.toDto()

      expect(Report.fromDto(dto)).toEqual(report)
    })
  })
  describe(Report.create, () => {
    it.prop([genReportKey()])('always build as shown', (key) => {
      expect(Report.create(key).show).toBe(true)
    })
  })
  describe(Report.prototype.statusFor, () => {
    type AssemblyLike = Parameters<Report['statusFor']>[0]
    const baseAssemblyLike: AssemblyLike = {
      withinEnOutput: true,
      withinArmsLoadLimit: true,
      withinLoadLimit: true,
    }

    describe('en load with in energy output', () => {
      const assemblyLike = { ...baseAssemblyLike, withinEnOutput: true }

      it.prop([genReportKey()])('always be normal', (key) => {
        const report = Report.create(key)

        expect(report.statusFor(assemblyLike)).toBe('normal')
      })
    })
    describe('en load over energy output', () => {
      const assemblyLike = { ...baseAssemblyLike, withinEnOutput: false }

      const keyIsAboutEnergy = (k: ReportKey) =>
        (k.startsWith('en') || k.startsWith('postRecoveryEn')) &&
        !k.includes('enFirearm')
      describe('key is about energy', () => {
        it.prop([genReportKey().filter(keyIsAboutEnergy)], {
          seed: 568392928,
          path: '0',
          endOnFailure: true,
        })('always be danger', (key) => {
          const report = Report.create(key)

          expect(report.statusFor(assemblyLike)).toBe('danger')
        })
      })
      describe('key is not about energy', () => {
        it.prop([genReportKey().filter((key) => !keyIsAboutEnergy(key))], {
          seed: 568392928,
          path: '0',
          endOnFailure: true,
        })('always be normal', (key) => {
          const report = Report.create(key)

          expect(report.statusFor(assemblyLike)).toBe('normal')
        })
      })
    })

    describe('weight within load limit', () => {
      const assemblyLike = { ...baseAssemblyLike, withinLoadLimit: true }

      it.prop([genReportKey()])('always be normal', (key) => {
        const report = Report.create(key)

        expect(report.statusFor(assemblyLike)).toBe('normal')
      })
    })
    describe('weight over load limit', () => {
      const assemblyLike = { ...baseAssemblyLike, withinLoadLimit: false }

      describe('key is about load', () => {
        it.prop([genReportKey().filter((k) => k.startsWith('load'))])(
          'always be danger',
          (key) => {
            const report = Report.create(key)

            expect(report.statusFor(assemblyLike)).toBe('danger')
          },
        )
      })
      describe('key is not about load', () => {
        it.prop([genReportKey().filter((k) => !k.startsWith('load'))])(
          'always be normal',
          (key) => {
            const report = Report.create(key)

            expect(report.statusFor(assemblyLike)).toBe('normal')
          },
        )
      })
    })

    describe('arms load within arms load limit', () => {
      const assemblyLike = { ...baseAssemblyLike, withinArmsLoadLimit: true }

      it.prop([genReportKey()])('always be normal', (key) => {
        const report = Report.create(key)

        expect(report.statusFor(assemblyLike)).toBe('normal')
      })
    })
    describe('weight over load limit', () => {
      const assemblyLike = { ...baseAssemblyLike, withinArmsLoadLimit: false }

      describe('key is about arms load', () => {
        it.prop([genReportKey().filter((k) => k.startsWith('armsLoad'))])(
          'always be danger',
          (key) => {
            const report = Report.create(key)

            expect(report.statusFor(assemblyLike)).toBe('danger')
          },
        )
      })
      describe('key is not about arms load', () => {
        it.prop([genReportKey().filter((k) => !k.startsWith('armsLoad'))])(
          'always be normal',
          (key) => {
            const report = Report.create(key)

            expect(report.statusFor(assemblyLike)).toBe('normal')
          },
        )
      })
    })
  })
  describe(Report.prototype.toggleShow, () => {
    it.prop([genReportKey(), fc.boolean()])(
      'always not equal before toggle and after',
      (key, show) => {
        const before = new Report(key, show)
        const after = before.toggleShow()

        expect(after.show).toBe(!before.show)
      },
    )
  })
  describe(Report.prototype.forceShow, () => {
    it.prop([genReportKey(), fc.boolean()])('always show', (key, show) => {
      const before = new Report(key, show)

      expect(before.forceShow().show).toBe(true)
    })
  })
})

function genReportAggregation(): fc.Arbitrary<ReportAggregation> {
  return fc.array(genReportBlock()).map((xs) => new ReportAggregation(xs))
}
function genReportBlock(): fc.Arbitrary<ReportBlock> {
  return fc.array(genReport()).map(ReportBlock.create)
}
function genReport(): fc.Arbitrary<Report> {
  return fc
    .record({ key: genReportKey(), show: fc.boolean() })
    .map(({ key, show }) => new Report(key, show))
}
function genReportKey(): fc.Arbitrary<ReportKey> {
  return fc.constantFrom(
    'ap',
    'antiKineticDefense',
    'antiEnergyDefense',
    'antiExplosiveDefense',
    'attitudeStability',
    'weight',
    'load',
    'loadLimit',
    'armsLoad',
    'armsLoadLimit',
    'meleeSpecialization',
    'meleeRatio',
    'enLoad',
    'enOutput',
    'enSurplus',
    'enSupplyEfficiency',
    'enRechargeDelay',
    'postRecoveryEnSupply',
    'enFirearmSpec',
    'enFirearmRatio',
    'coam',
  )
}
