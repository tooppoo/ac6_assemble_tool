import type { ArmUnit, LeftArmUnit } from '@ac6_assemble_tool/parts/arm-units'
import type { Booster } from '@ac6_assemble_tool/parts/booster'
import type { LegsNotTank, Tank } from '@ac6_assemble_tool/parts/legs'
import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import {
  armUnit as armUnitClassification,
  booster as boosterClassification,
  leftArmUnit as leftArmUnitClassification,
  notEquipped as notEquippedClassification,
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
      const booster =
        baseAssembly.booster.classification !== notEquippedClassification
          ? baseAssembly.booster
          : getDefaultBooster(initialCandidates.booster)
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

    if (isRightArmBackKey(key) && isRightArmUnit(parts)) {
      return changeArmBackPair({
        targetKey: key,
        counterpartKey: key === 'rightArmUnit' ? 'rightBackUnit' : 'rightArmUnit',
        parts,
        baseAssembly,
        baseCandidates,
      })
    }
    if (isLeftArmBackKey(key) && isArmUnit(parts)) {
      return changeArmBackPair({
        targetKey: key,
        counterpartKey: key === 'leftArmUnit' ? 'leftBackUnit' : 'leftArmUnit',
        parts,
        baseAssembly,
        baseCandidates,
      })
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

function getDefaultBooster(
  boosterCandidates: Candidates['booster'],
): Booster {
  const booster = boosterCandidates.find(
    (candidate): candidate is Booster =>
      candidate.classification === boosterClassification,
  )

  if (!booster) {
    throw new Error('ブースター候補が見つかりません')
  }

  return booster
}

type ArmBackKey =
  | 'rightArmUnit'
  | 'rightBackUnit'
  | 'leftArmUnit'
  | 'leftBackUnit'

type ChangeArmBackPairArgs<TargetKey extends ArmBackKey> = {
  targetKey: TargetKey
  counterpartKey: TargetKey extends 'rightArmUnit' | 'rightBackUnit'
    ? 'rightArmUnit' | 'rightBackUnit'
    : 'leftArmUnit' | 'leftBackUnit'
  parts: ArmUnit | LeftArmUnit
  baseAssembly: Assembly
  baseCandidates: Candidates
}

function changeArmBackPair<K extends ArmBackKey>({
  targetKey,
  counterpartKey,
  parts,
  baseAssembly,
  baseCandidates,
}: ChangeArmBackPairArgs<K>): ResultChangeAssembly {
  return {
    assembly: createAssembly({
      ...baseAssembly,
      [targetKey]: parts,
    }),
    remainingCandidates: {
      ...baseCandidates,
      [counterpartKey]: baseCandidates[counterpartKey].filter(
        (candidate) => candidate.id !== parts.id,
      ),
    },
  }
}

function isRightArmBackKey(key: AssemblyKey): key is 'rightArmUnit' | 'rightBackUnit' {
  return key === 'rightArmUnit' || key === 'rightBackUnit'
}

function isLeftArmBackKey(key: AssemblyKey): key is 'leftArmUnit' | 'leftBackUnit' {
  return key === 'leftArmUnit' || key === 'leftBackUnit'
}
