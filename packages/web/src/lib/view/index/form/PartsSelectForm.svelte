<script lang="ts" context="module">
  import type { AssemblyKey } from '@ac6_assemble_tool/core/assembly/assembly'
  import type { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'

  export type ChangePartsEvent = Readonly<{
    id: AssemblyKey
    selected: ACParts
  }>
  export type ToggleLockEvent = Readonly<{ id: AssemblyKey; value: boolean }>
  export type ToggleFilterEvent = Readonly<{ id: AssemblyKey }>
</script>

<script lang="ts">
  import i18n from '$lib/i18n/define'
  import FilterBadge from '$lib/view/index/form/status/badge/FilterBadge.svelte'
  import LockBadge from '$lib/view/index/form/status/badge/LockBadge.svelte'
  import StatusBadgeList from '$lib/view/index/form/status/StatusBadgeList.svelte'
  import {
    anyFilterContain,
    anyFilterEnabled,
    type FilterState,
  } from '$lib/view/index/interaction/filter'

  import { createEventDispatcher } from 'svelte'

  export let id: AssemblyKey
  export let caption: string
  export let parts: readonly ACParts[]
  export let selected: ACParts
  export let tag = 'div'
  export let lock: LockedParts
  export let filter: FilterState

  $: {
    if (!parts.find((p) => p.name === selected.name)) {
      dispatch('change', { id, selected: parts[0] })
    }
  }

  // handler
  const onChange = () => {
    if (lock.isLocking(id)) return

    dispatch('change', { id, selected })
  }
  const onToggleLock = () => {
    dispatch('toggle-lock', { id, value: !lock.isLocking(id) })
  }
  const onToggleFilter = () => {
    dispatch('toggle-filter', { id })
  }

  // setup
  const dispatch = createEventDispatcher<{
    change: ChangePartsEvent
    'toggle-lock': ToggleLockEvent
    'toggle-filter': ToggleFilterEvent
  }>()
</script>

<svelte:element this={tag} class={($$props.class || '') + ' container'}>
  <div class="row text-start">
    <label
      for={`select-${id}`}
      class="mb-1 mb-sm-0 p-0 col-12 col-sm-5 fs-5 d-flex justify-content-between align-items-center"
    >
      {caption}
      <StatusBadgeList>
        <LockBadge
          id={`lock-parts-${id}`}
          class="me-sm-2"
          titleWhenLocked={$i18n.t('locked', { ns: 'lock' })}
          titleWhenUnlocked={$i18n.t('unlocked', { ns: 'lock' })}
          locked={lock.isLocking(id)}
          clickable={true}
          on:click={onToggleLock}
        />
        {#if anyFilterContain(id, filter)}
          <FilterBadge
            id={`filter-parts-${id}`}
            class="ms-2 ms-sm-0 me-sm-2"
            title={$i18n.t('filterByParts.description', { ns: 'filter' })}
            applied={anyFilterEnabled(id, filter)}
            on:click={onToggleFilter}
          />
        {/if}
      </StatusBadgeList>
    </label>
    <select
      id={`select-${id}`}
      class="col-12 col-sm-7 fs-4"
      disabled={lock.isLocking(id)}
      bind:value={selected}
      on:change={onChange}
    >
      {#each parts as p (p.name)}
        <option value={p} selected={selected.name === p.name}>{p.name}</option>
      {/each}
    </select>
  </div>
</svelte:element>
