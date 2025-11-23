<script lang="ts">
  import i18n from '$lib/i18n/define'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
  import type { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
  import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
  import { createEventDispatcher, setContext } from 'svelte'

  import LoadRangeSlider from './LoadRangeSlider.svelte'

  export let candidates: Candidates
  export let assembly: Assembly
  export let lock: LockedParts
  export let onChange: ((detail: { value: number }) => void) | undefined =
    undefined
  export let onToggleLock:
    | ((detail: { id: string; value: boolean }) => void)
    | undefined = undefined

  setContext('i18n', i18n)

  const dispatch = createEventDispatcher<{
    change: { value: number }
    'toggle-lock': { id: string; value: boolean }
  }>()

  const forwardChange = (event: { value: number }) => {
    dispatch('change', event)
    onChange?.(event)
  }

  const forwardToggleLock = (
    event: { id: string; value: boolean },
  ) => {
    dispatch('toggle-lock', event)
    onToggleLock?.(event)
  }
</script>

<LoadRangeSlider
  {candidates}
  {assembly}
  {lock}
  onChange={forwardChange}
  onToggleLock={forwardToggleLock}
/>
