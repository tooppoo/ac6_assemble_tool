import type {
  Assembly,
  AssemblyKey,
} from '@ac6_assemble_tool/core/assembly/assembly'
import type { RandomAssembly } from '@ac6_assemble_tool/core/assembly/random/random-assembly'
import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'

export type ChangePartsEvent = Readonly<{
  id: AssemblyKey
  selected: ACParts
}>

export type ToggleLockEvent = Readonly<{ id: AssemblyKey; value: boolean }>

export type AssembleRandomly = Readonly<{
  assembly: Assembly
}>

export type ErrorOnAssembly = Readonly<{
  error: Error
}>

export type ApplyRandomFilter = Readonly<{
  randomAssembly: RandomAssembly
}>
