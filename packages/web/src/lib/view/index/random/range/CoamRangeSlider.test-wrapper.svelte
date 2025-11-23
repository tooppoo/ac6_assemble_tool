<script lang="ts">
  import i18n from '$lib/i18n/define'

  import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
  import { createEventDispatcher, setContext } from 'svelte'

  import CoamRangeSlider from './CoamRangeSlider.svelte'

  export let candidates: Candidates
  export let onChange: ((detail: { value: number }) => void) | undefined =
    undefined

  setContext('i18n', i18n)

  const dispatch = createEventDispatcher<{ change: { value: number } }>()

  const forwardChange = (event: { value: number }) => {
    dispatch('change', event)
    onChange?.(event)
  }
</script>

<CoamRangeSlider {candidates} onchange={forwardChange} />
