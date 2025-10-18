<script lang="ts" context="module">
  import type { ToggleOffCanvas } from '$lib/components/off-canvas/OffCanvas.svelte'
  import type { FilterState } from '$lib/view/index/interaction/filter'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
  import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'

  export type ToggleFilter = ToggleOffCanvas
  export type ApplyWhole = Partial<
    Readonly<{
      assembly: Assembly
      candidates: Candidates
      filter: FilterState
    }>
  >
</script>

<script lang="ts">
  import TextButton from '$lib/components/button/TextButton.svelte'
  import OffCanvas from '$lib/components/off-canvas/OffCanvas.svelte'
  import i18n from '$lib/i18n/define'
  import {
    assemblyWithHeadParts,
    enableFilterOnAllParts,
    initialFilterState,
  } from '$lib/view/index/interaction/filter'

  import {
    excludeNotEquipped,
    notUseHanger,
  } from '@ac6_assemble_tool/core/assembly/filter/filters'
  import { logger } from '@ac6_assemble_tool/shared/logger'
  import { createEventDispatcher } from 'svelte'

  export let open: boolean
  export let filter: FilterState
  export let initialCandidates: Candidates
  export let candidates: Candidates

  // handler
  const onApply = (param: Partial<ApplyWhole>) => {
    const event = {
      filter: param.filter || undefined,
      assembly: param.assembly || undefined,
      candidates: param.candidates || undefined,
    }

    dispatch('apply', event)

    logger.debug({ event, param })
  }

  // setup
  const dispatch = createEventDispatcher<{
    toggle: ToggleFilter
    apply: ApplyWhole
  }>()
</script>

<OffCanvas
  id={$$props.id || ''}
  {open}
  on:toggle={(e) => dispatch('toggle', e.detail)}
>
  <svelte:fragment slot="title">
    {$i18n.t('filter', { ns: 'filter' })}
  </svelte:fragment>
  <svelte:fragment slot="body">
    <TextButton
      id="exclude-all-not-equipped"
      on:click={() =>
        onApply({
          filter: enableFilterOnAllParts(excludeNotEquipped.name, filter),
          assembly: assemblyWithHeadParts(candidates),
        })}
      class="my-3 w-100 p-2"
    >
      {$i18n.t('excludeAllNotEquipped', { ns: 'filter' })}
    </TextButton>
    <TextButton
      id="not-use-hanger"
      on:click={() =>
        onApply({
          filter: enableFilterOnAllParts(notUseHanger.name, filter),
          assembly: assemblyWithHeadParts(candidates),
        })}
      class="my-3 w-100 p-2"
    >
      {$i18n.t('notUseAllHanger', { ns: 'filter' })}
    </TextButton>
    <TextButton
      id="reset-filter"
      on:click={() =>
        onApply({ filter: initialFilterState(initialCandidates) })}
      class="my-3 w-100 p-2"
    >
      {$i18n.t('resetAllFilter', { ns: 'filter' })}
    </TextButton>
  </svelte:fragment>
</OffCanvas>

<style>
</style>
