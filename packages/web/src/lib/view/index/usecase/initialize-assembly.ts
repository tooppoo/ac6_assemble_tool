import {
  createAssembly,
  type Assembly,
} from '@ac6_assemble_tool/core/assembly/assembly'
import type { Booster } from '@ac6_assemble_tool/parts/booster'
import type { LegsNotTank, LegsTank } from '@ac6_assemble_tool/parts/legs'
import {
  armNotEquipped,
  backNotEquipped,
  boosterNotEquipped,
  type BoosterNotEquipped,
} from '@ac6_assemble_tool/parts/not-equipped'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'

export function initializeAssembly(candidates: Candidates): Assembly {
  type LegBoosterPair =
    | { legs: LegsNotTank; booster: Booster }
    | { legs: LegsTank; booster: BoosterNotEquipped }
  const pair = ((): LegBoosterPair => {
    const legs = candidates.legs[0]

    if (legs.category === 'tank') {
      return { legs, booster: boosterNotEquipped }
    } else {
      return {
        legs,
        booster: candidates.booster.filter((b) => b.category === 'booster')[0],
      }
    }
  })()
  return createAssembly({
    ...pair,
    rightArmUnit: armNotEquipped,
    leftArmUnit: armNotEquipped,
    rightBackUnit: backNotEquipped,
    leftBackUnit: backNotEquipped,

    head: candidates.head[0],
    arms: candidates.arms[0],
    core: candidates.core[0],

    fcs: candidates.fcs[0],
    generator: candidates.generator[0],

    expansion: candidates.expansion[0],
  })
}
