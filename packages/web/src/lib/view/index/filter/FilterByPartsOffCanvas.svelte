<script lang="ts" context="module">
  import type { ToggleOffCanvas } from '$lib/components/off-canvas/OffCanvas.svelte'
  import type { CurrentFilter } from '$lib/view/index/interaction/filter'

  export type ToggleFilter = ToggleOffCanvas
</script>

<script lang="ts">
  import OffCanvas from '$lib/components/off-canvas/OffCanvas.svelte'
  import Margin from '$lib/components/spacing/Margin.svelte'
  import EnableTypeFilter from '$lib/view/index/filter/filter-by-parts/EnableTypeFilter.svelte'
  import type { ChangeFilter } from '$lib/view/index/filter/filter-by-parts/event'
  import FilterByPropertyTypeFilter from '$lib/view/index/filter/filter-by-parts/FilterByPropertyTypeFilter.svelte'

  import { createEventDispatcher } from 'svelte'

  export let open: boolean
  export let current: CurrentFilter

  let toggle: (op: boolean) => void = () => {}
  $: {
    toggle(open)
  }

  // handle
  const onChangeFilter = (e: CustomEvent<ChangeFilter>) => {
    dispatch('change-filter', e.detail)
  }

  // setup
  const dispatch = createEventDispatcher<{
    toggle: ToggleFilter
    'change-filter': ChangeFilter
  }>()
</script>

<OffCanvas
  id={$$props.id || ''}
  {open}
  on:toggle={(e) => dispatch('toggle', e.detail)}
>
  <svelte:fragment slot="title">
    <span class="text-uppercase">
      {`${current.name || ''} FILTER`}
    </span>
  </svelte:fragment>
  <svelte:fragment slot="body">
    {#each current.filter.list as f (f.filter.name)}
      {#if f.filter.type.id === 'enable'}
        <EnableTypeFilter state={f} on:change-filter={onChangeFilter} />
      {/if}
      {#if f.filter.type.id === 'filterByProperty'}
        <FilterByPropertyTypeFilter
          {current}
          state={f}
          on:change-filter={onChangeFilter}
        />
      {/if}
      <Margin space={4} />
    {/each}
  </svelte:fragment>
</OffCanvas>
