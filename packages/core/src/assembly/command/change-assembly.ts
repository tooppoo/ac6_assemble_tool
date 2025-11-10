import type { ArmUnit, LeftArmUnit } from '@ac6_assemble_tool/parts/arm-units'
import type { Tank } from '@ac6_assemble_tool/parts/legs'
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
  (candidates: Candidates) =>
  (
    key: AssemblyKey,
    parts: ACParts,
    baseAssembly: Assembly,
  ): ResultChangeAssembly => {
    if (key === 'legs' && isTankLegs(parts)) {
      return {
        assembly: createAssembly({
          ...baseAssembly,
          legs: parts,
          booster: boosterNotEquipped,
        }),
        remainingCandidates: {
          ...candidates,
          booster: [boosterNotEquipped],
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
          ...candidates,
          // 同じ武器を右手・右肩に装備は禁止
          rightBackUnit: candidates.rightBackUnit.filter(
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
          ...candidates,
          // 同じ武器を右手・右肩に装備は禁止
          rightArmUnit: candidates.rightArmUnit.filter(
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
          ...candidates,
          // 同じ武器を左手・左肩に装備は禁止
          leftBackUnit: candidates.leftBackUnit.filter(
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
          ...candidates,
          // 同じ武器を左手・左肩に装備は禁止
          leftArmUnit: candidates.leftArmUnit.filter((p) => p.id !== parts.id),
        },
      }
    }

    return {
      assembly: createAssembly({
        ...baseAssembly,
        [key]: parts,
      }),
      remainingCandidates: candidates,
    }
  }

function isTankLegs(parts: ACParts): parts is Tank {
  return parts.category === tank
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
