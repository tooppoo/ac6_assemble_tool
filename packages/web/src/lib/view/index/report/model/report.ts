import type {
  Assembly,
  AssemblyProperty,
} from '@ac6_assemble_tool/core/assembly/assembly'

export function defaultReportAggregation(): ReportAggregation {
  return new ReportAggregation([
    ReportBlock.create([
      Report.create('ap'),
      Report.create('attitudeStability'),
    ]),
    ReportBlock.create([
      Report.create('antiKineticDefense'),
      Report.create('antiEnergyDefense'),
      Report.create('antiExplosiveDefense'),
    ]),
    ReportBlock.create([
      Report.create('weight'),
      Report.create('load'),
      Report.create('loadLimit'),
      Report.create('armsLoad'),
      Report.create('armsLoadLimit'),
      Report.create('meleeSpecialization'),
      Report.create('meleeRatio'),
    ]),
    ReportBlock.create([
      Report.create('enLoad'),
      Report.create('enOutput'),
      Report.create('enCapacity'),
      Report.create('enSurplus'),
      Report.create('enSupplyEfficiency'),
      Report.create('enRechargeDelay'),
      Report.create('enRecoveryDelay'),
      Report.create('postRecoveryEnSupply'),
      Report.create('enFirearmSpec'),
      Report.create('enFirearmRatio'),
    ]),
    ReportBlock.create([Report.create('qbEnConsumption')]),
    ReportBlock.create([Report.create('coam')]),
  ])
}

export type ReadonlyReportAggregation = Pick<ReportAggregation, 'blocks'>
export class ReportAggregation {
  static fromDto(dto: ReportAggregationDto): ReportAggregation {
    return new ReportAggregation(dto.blocks.map(ReportBlock.fromDto))
  }

  constructor(private readonly _blocks: readonly ReportBlock[]) {}

  get allBlocks(): readonly ReportBlock[] {
    return this._blocks
  }
  get blocks(): readonly ReadonlyReportBlock[] {
    return this.allBlocks.filter((b) => b.someReportsShown)
  }

  get allReports(): readonly Report[] {
    return this.allBlocks.flatMap((b) => b.allReports)
  }

  updateReport(blockId: ReportBlockId, report: Report): ReportAggregation {
    const indexOfBlock = this._blocks.findIndex((b) => b.id === blockId)
    if (indexOfBlock === -1) return this

    const block = this._blocks[indexOfBlock]
    const indexOfReport = block.indexOf(report)
    if (indexOfReport === null) return this

    return new ReportAggregation(
      this._blocks.toSpliced(
        indexOfBlock,
        1,
        block.replaceAt(indexOfReport, report),
      ),
    )
  }

  showAll(): ReportAggregation {
    return new ReportAggregation(this.allBlocks.map((b) => b.showAll()))
  }

  toDto(): ReportAggregationDto {
    return {
      blocks: this.allBlocks.map((b) => b.toDto()),
    }
  }
}
interface ReportAggregationDto {
  blocks: ReportBlockDto[]
}

export type ReportBlockId = string
type ReadonlyReportBlock = Pick<
  ReportBlock,
  'reports' | 'indexOf' | 'id' | 'someReportsShown'
>
export class ReportBlock {
  static create(reports: Report[]): ReportBlock {
    return new ReportBlock(crypto.randomUUID(), reports)
  }
  static fromDto(dto: ReportBlockDto): ReportBlock {
    return new ReportBlock(dto.id, dto.reports.map(Report.fromDto))
  }

  private constructor(
    readonly id: ReportBlockId,
    private readonly _reports: readonly Report[],
  ) {}

  get allReports(): readonly Report[] {
    return this._reports
  }
  get reports(): readonly ReadonlyReport[] {
    return this.allReports.filter((r) => r.show)
  }
  get someReportsShown(): boolean {
    return this.allReports.some((r) => r.show)
  }

  indexOf(target: ReadonlyReport): number | null {
    const i = this._reports.findIndex((r) => r.key === target.key)

    return i >= 0 ? i : null
  }
  replaceAt(index: number, target: Report): ReportBlock {
    return new ReportBlock(this.id, this._reports.toSpliced(index, 1, target))
  }
  showAll(): ReportBlock {
    return new ReportBlock(
      this.id,
      this._reports.map((r) => r.forceShow()),
    )
  }

  toDto(): ReportBlockDto {
    return {
      id: this.id,
      reports: this.allReports.map((r) => r.toDto()),
    }
  }
}
interface ReportBlockDto {
  readonly id: ReportBlockId
  readonly reports: readonly ReportDto[]
}

export type ReportStatus = 'danger' | 'warning' | 'normal'
type ReadonlyReport = Pick<Report, 'statusFor' | 'key' | 'show'>
export class Report {
  static fromDto(dto: ReportDto): Report {
    return new Report(dto.key, dto.show)
  }
  static create(key: ReportKey): Report {
    return new Report(key, true)
  }

  constructor(
    readonly key: ReportKey,
    readonly show: boolean,
  ) {}

  statusFor(
    assembly: Pick<
      Assembly,
      'withinEnOutput' | 'withinLoadLimit' | 'withinArmsLoadLimit'
    >,
  ): ReportStatus {
    switch (this.key) {
      case 'enLoad':
      case 'enOutput':
      case 'enSurplus':
      case 'enSupplyEfficiency':
      case 'enRechargeDelay':
      case 'postRecoveryEnSupply':
        return assembly.withinEnOutput ? 'normal' : 'danger'
      case 'load':
      case 'loadLimit':
        return assembly.withinLoadLimit ? 'normal' : 'danger'
      case 'armsLoad':
      case 'armsLoadLimit':
        return assembly.withinArmsLoadLimit ? 'normal' : 'danger'
      default:
        return 'normal'
    }
  }

  toggleShow(): Report {
    return new Report(this.key, !this.show)
  }
  forceShow(): Report {
    return new Report(this.key, true)
  }

  toDto(): ReportDto {
    return { key: this.key, show: this.show }
  }
}
interface ReportDto {
  readonly key: ReportKey
  readonly show: boolean
}

export type ReportKey = Exclude<
  keyof AssemblyProperty,
  'withinEnOutput' | 'withinLoadLimit' | 'withinArmsLoadLimit'
>
