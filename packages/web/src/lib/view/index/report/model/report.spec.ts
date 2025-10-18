import { describe, expect, test } from 'bun:test'
import * as fc from 'fast-check'

import {
  Report,
  ReportAggregation,
  ReportBlock,
  defaultReportAggregation,
  type ReportKey,
} from './report'

describe(ReportAggregation, () => {
  describe(ReportAggregation.fromDto, () => {
    test('build from dto', () => {
      fc.assert(
        fc.property(genReportAggregation(), (aggregation) => {
          const dto = aggregation.toDto()

          expect(ReportAggregation.fromDto(dto)).toEqual(aggregation)
        }),
      )
    })
  })

  describe('blocks', () => {
    test('show some reports every block', () => {
      fc.assert(
        fc.property(genReportAggregation(), (aggregation) => {
          expect(aggregation.blocks.every((b) => b.someReportsShown)).toBe(true)
        }),
      )
    })
    test('length less than or equal allBlocks.length', () => {
      fc.assert(
        fc.property(genReportAggregation(), (aggregation) => {
          expect(aggregation.blocks.length).toBeLessThanOrEqual(
            aggregation.allBlocks.length,
          )
        }),
      )
    })
    test('contained in all blocks', () => {
      fc.assert(
        fc.property(genReportAggregation(), (aggregation) => {
          expect(aggregation.allBlocks).toEqual(
            expect.arrayContaining([...aggregation.blocks]),
          )
        }),
      )
    })
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
            new Report('armsLoad', true),
            new Report('armsLoadLimit', true),
            new Report('melesSpecialization', true),
            new Report('melesRatio', true),
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
    test('always all reports shown', () => {
      fc.assert(
        fc.property(genReportAggregation(), (aggregation) => {
          expect(aggregation.showAll().allReports.every((r) => r.show)).toBe(
            true,
          )
        }),
      )
    })
  })
})

describe(ReportBlock, () => {
  describe(ReportBlock.fromDto, () => {
    test('build from dto', () => {
      fc.assert(
        fc.property(genReportBlock(), (block) => {
          const dto = block.toDto()

          expect(ReportBlock.fromDto(dto)).toEqual(block)
        }),
      )
    })
  })
  describe('allReports', () => {
    test('return all reports', () => {
      fc.assert(
        fc.property(fc.array(genReport()), (reports) => {
          const block = ReportBlock.create(reports)

          expect(block.allReports).toEqual(reports)
        }),
      )
    })
  })
  describe('reports', () => {
    test('less than or equal all reports', () => {
      fc.assert(
        fc.property(genReportBlock(), (block) => {
          expect(block.reports.length).toBeLessThanOrEqual(
            block.allReports.length,
          )
        }),
      )
    })
    test('any report is show', () => {
      fc.assert(
        fc.property(genReportBlock(), (block) => {
          expect(block.reports.every((r) => r.show)).toBe(true)
        }),
      )
    })
    test('any report is contained in all reports', () => {
      fc.assert(
        fc.property(genReportBlock(), (block) => {
          expect(block.allReports).toEqual(
            // readonly Report[] を Report[] にするために配列を作り直し
            expect.arrayContaining([...block.reports]),
          )
        }),
      )
    })
  })
  describe('someReportsShown', () => {
    describe('when some reports are shown', () => {
      test('should return true', () => {
        fc.assert(
          fc.property(genReportBlock(), genReportKey(), (baseBlock, key) => {
            const block = ReportBlock.create([
              ...baseBlock.allReports,
              new Report(key, true),
            ])

            expect(block.someReportsShown).toBe(true)
          }),
        )
      })
    })
    describe('when no reports are shown', () => {
      test('should return false', () => {
        fc.assert(
          fc.property(fc.array(genReportKey()), (keys) => {
            const block = ReportBlock.create(
              keys.map((k) => new Report(k, false)),
            )

            expect(block.someReportsShown).toBe(false)
          }),
        )
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
    test('all report should be shown', () => {
      fc.assert(
        fc.property(genReportBlock(), (block) => {
          expect(block.showAll().reports.every((r) => r.show)).toBe(true)
        }),
      )
    })
    test('after allShow, after.reports.length equals with before.allReports.length', () => {
      fc.assert(
        fc.property(genReportBlock(), (block) => {
          expect(block.showAll().reports.length).toBe(block.allReports.length)
        }),
      )
    })
  })
})

describe(Report, () => {
  describe(Report.fromDto, () => {
    test('build from dto', () => {
      fc.assert(
        fc.property(genReport(), (report) => {
          const dto = report.toDto()

          expect(Report.fromDto(dto)).toEqual(report)
        }),
      )
    })
  })
  describe(Report.create, () => {
    test('always build as shown', () => {
      fc.assert(
        fc.property(genReportKey(), (key) => {
          expect(Report.create(key).show).toBe(true)
        }),
      )
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

      test('always be normal', () => {
        fc.assert(
          fc.property(genReportKey(), (key) => {
            const report = Report.create(key)

            expect(report.statusFor(assemblyLike)).toBe('normal')
          }),
        )
      })
    })
    describe('en load over energy output', () => {
      const assemblyLike = { ...baseAssemblyLike, withinEnOutput: false }

      const keyIsAboutEnergy = (k: ReportKey) =>
        (k.startsWith('en') || k.startsWith('postRecoveryEn')) &&
        !k.includes('enFirearm')
      describe('key is about energy', () => {
        test('always be danger', () => {
          fc.assert(
            fc.property(genReportKey().filter(keyIsAboutEnergy), (key) => {
              const report = Report.create(key)

              expect(report.statusFor(assemblyLike)).toBe('danger')
            }),
            {
              seed: 568392928,
              path: '0',
              endOnFailure: true,
            },
          )
        })
      })
      describe('key is not about energy', () => {
        test('always be normal', () => {
          fc.assert(
            fc.property(
              genReportKey().filter((key) => !keyIsAboutEnergy(key)),
              (key) => {
                const report = Report.create(key)

                expect(report.statusFor(assemblyLike)).toBe('normal')
              },
            ),
            {
              seed: 568392928,
              path: '0',
              endOnFailure: true,
            },
          )
        })
      })
    })

    describe('weight within load limit', () => {
      const assemblyLike = { ...baseAssemblyLike, withinLoadLimit: true }

      test('always be normal', () => {
        fc.assert(
          fc.property(genReportKey(), (key) => {
            const report = Report.create(key)

            expect(report.statusFor(assemblyLike)).toBe('normal')
          }),
        )
      })
    })
    describe('weight over load limit', () => {
      const assemblyLike = { ...baseAssemblyLike, withinLoadLimit: false }

      describe('key is about load', () => {
        test('always be danger', () => {
          fc.assert(
            fc.property(
              genReportKey().filter((k) => k.startsWith('load')),
              (key) => {
                const report = Report.create(key)

                expect(report.statusFor(assemblyLike)).toBe('danger')
              },
            ),
          )
        })
      })
      describe('key is not about load', () => {
        test('always be normal', () => {
          fc.assert(
            fc.property(
              genReportKey().filter((k) => !k.startsWith('load')),
              (key) => {
                const report = Report.create(key)

                expect(report.statusFor(assemblyLike)).toBe('normal')
              },
            ),
          )
        })
      })
    })

    describe('arms load within arms load limit', () => {
      const assemblyLike = { ...baseAssemblyLike, withinArmsLoadLimit: true }

      test('always be normal', () => {
        fc.assert(
          fc.property(genReportKey(), (key) => {
            const report = Report.create(key)

            expect(report.statusFor(assemblyLike)).toBe('normal')
          }),
        )
      })
    })
    describe('weight over load limit', () => {
      const assemblyLike = { ...baseAssemblyLike, withinArmsLoadLimit: false }

      describe('key is about arms load', () => {
        test('always be danger', () => {
          fc.assert(
            fc.property(
              genReportKey().filter((k) => k.startsWith('armsLoad')),
              (key) => {
                const report = Report.create(key)

                expect(report.statusFor(assemblyLike)).toBe('danger')
              },
            ),
          )
        })
      })
      describe('key is not about arms load', () => {
        test('always be normal', () => {
          fc.assert(
            fc.property(
              genReportKey().filter((k) => !k.startsWith('armsLoad')),
              (key) => {
                const report = Report.create(key)

                expect(report.statusFor(assemblyLike)).toBe('normal')
              },
            ),
          )
        })
      })
    })
  })
  describe(Report.prototype.toggleShow, () => {
    test('always not equal before toggle and after', () => {
      fc.assert(
        fc.property(genReportKey(), fc.boolean(), (key, show) => {
          const before = new Report(key, show)
          const after = before.toggleShow()

          expect(after.show).toBe(!before.show)
        }),
      )
    })
  })
  describe(Report.prototype.forceShow, () => {
    test('always show', () => {
      fc.assert(
        fc.property(genReportKey(), fc.boolean(), (key, show) => {
          const before = new Report(key, show)

          expect(before.forceShow().show).toBe(true)
        }),
      )
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
    'melesSpecialization',
    'melesRatio',
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

// Alias it to test for compatibility
const it = test
