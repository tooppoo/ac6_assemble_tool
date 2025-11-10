import type { ArmUnit, LeftArmUnit } from '@ac6_assemble_tool/parts/arm-units'
import type { Booster } from '@ac6_assemble_tool/parts/booster'
import type { LegsNotTank, Tank } from '@ac6_assemble_tool/parts/legs'
import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import {
  armUnit as armUnitClassification,
  leftArmUnit as leftArmUnitClassification,
} from '@ac6_assemble_tool/parts/types/base/classification'
import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'

import { createAssembly, type Assembly, type AssemblyKey } from '../assembly'

interface ResultChangeAssembly {
  assembly: Assembly
  remainingCandidates: Candidates
}
export const changeAssemblyCommand =
  (initialCandidates: Candidates) =>
  (
    key: AssemblyKey,
    parts: ACParts,
    baseAssembly: Assembly,
    baseCandidates: Candidates,
  ): ResultChangeAssembly => {
    if (key === 'legs' && isTankLegs(parts)) {
      return {
        assembly: createAssembly({
          ...baseAssembly,
          legs: parts,
          booster: boosterNotEquipped,
        }),
        remainingCandidates: {
          ...baseCandidates,
          booster: [boosterNotEquipped],
        },
      }
    }
    if (key === 'legs' && isNotTankLegs(parts)) {
      const booster = baseAssembly.booster.category !== 'not-equipped'
        ? baseAssembly.booster
        : initialCandidates.booster[0] as Booster
      return {
        assembly: createAssembly({
          ...baseAssembly,
          legs: parts,
          booster,
        }),
        remainingCandidates: {
          ...baseCandidates,
          booster: initialCandidates.booster,
        },
      }
    }

    if (key === 'rightArmUnit' && isRightArmUnit(parts)) {
      return {
        assembly: createAssembly({
          ...baseAssembly,
          rightArmUnit: parts,
        }),
        remainingCandidates: {
          ...baseCandidates,
          // 同じ武器を右手・右肩に装備は禁止
          rightBackUnit: baseCandidates.rightBackUnit.filter(
            (p) => p.id !== parts.id,
          ),
        },
      }
    }
    if (key === 'rightBackUnit' && isRightArmUnit(parts)) {
      return {
        assembly: createAssembly({
          ...baseAssembly,
          [key]: parts,
        }),
        remainingCandidates: {
          ...baseCandidates,
          // 同じ武器を右手・右肩に装備は禁止
          rightArmUnit: baseCandidates.rightArmUnit.filter(
            (p) => p.id !== parts.id,
          ),
        },
      }
    }
    if (key === 'leftArmUnit' && isArmUnit(parts)) {
      return {
        assembly: createAssembly({
          ...baseAssembly,
          [key]: parts,
        }),
        remainingCandidates: {
          ...baseCandidates,
          // 同じ武器を左手・左肩に装備は禁止
          leftBackUnit: baseCandidates.leftBackUnit.filter(
            (p) => p.id !== parts.id,
          ),
        },
      }
    }
    if (key === 'leftBackUnit' && isArmUnit(parts)) {
      return {
        assembly: createAssembly({
          ...baseAssembly,
          [key]: parts,
        }),
        remainingCandidates: {
          ...baseCandidates,
          // 同じ武器を左手・左肩に装備は禁止
          leftArmUnit: baseCandidates.leftArmUnit.filter((p) => p.id !== parts.id),
        },
      }
    }

    return {
      assembly: createAssembly({
        ...baseAssembly,
        [key]: parts,
      }),
      remainingCandidates: baseCandidates,
    }
  }

function isTankLegs(parts: ACParts): parts is Tank {
  return parts.category === tank
}
function isNotTankLegs(parts: ACParts): parts is LegsNotTank {
  return parts.classification === 'legs' && parts.category !== tank
}
function isArmUnit(parts: ACParts): parts is ArmUnit | LeftArmUnit {
  return isRightArmUnit(parts) || isLeftArmUnit(parts)
}
function isRightArmUnit(parts: ACParts): parts is ArmUnit {
  return parts.classification === armUnitClassification
}
function isLeftArmUnit(parts: ACParts): parts is LeftArmUnit {
  return parts.classification === leftArmUnitClassification
}
