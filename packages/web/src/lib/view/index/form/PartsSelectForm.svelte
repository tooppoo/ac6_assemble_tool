<script lang="ts" context="module">
  import type { AssemblyKey } from '@ac6_assemble_tool/core/assembly/assembly'
  import type { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'

  export type ChangePartsEvent = Readonly<{
    id: AssemblyKey
    selected: ACParts
  }>
  export type ToggleLockEvent = Readonly<{ id: AssemblyKey; value: boolean }>
</script>

<script lang="ts">
  import i18n from '$lib/i18n/define'
  import LockBadge from '$lib/view/index/form/status/badge/LockBadge.svelte'
  import StatusBadgeList from '$lib/view/index/form/status/StatusBadgeList.svelte'

  import { createEventDispatcher } from 'svelte'

  export let id: AssemblyKey
  export let caption: string
  export let parts: readonly ACParts[]
  export let selected: ACParts
  export let tag = 'div'
  export let lock: LockedParts

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

  // setup
  const dispatch = createEventDispatcher<{
    change: ChangePartsEvent
    'toggle-lock': ToggleLockEvent
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
