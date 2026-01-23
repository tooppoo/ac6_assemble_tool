<script lang="ts">
  import i18n from '$lib/i18n/define'
  import LockBadge from '$lib/view/index/form/status/badge/LockBadge.svelte'
  import StatusBadgeList from '$lib/view/index/form/status/StatusBadgeList.svelte'

  import type { AssemblyKey } from '@ac6_assemble_tool/core/assembly/assembly'
  import type { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'

  import type { ChangePartsEvent, ToggleLockEvent } from '../types/index-events'

  interface Props {
    id: AssemblyKey
    class?: string
    caption: string
    parts: readonly ACParts[]
    selected: ACParts
    lock: LockedParts
    tag?: string
    onchange?: (e: ChangePartsEvent) => void
    onToggleLock?: (e: ToggleLockEvent) => void
  }
  let {
    id,
    class: className = '',
    caption,
    parts,
    selected,
    lock,
    tag = 'div',
    onchange,
    onToggleLock: handleToggleLock,
  }: Props = $props()

  let isLocked = $derived(lock.isLocking(id))

  $effect(() => {
    if (parts.length === 0) {
      throw new Error(`パーツ候補が0件です: ${id}`)
    }

    if (!parts.find((p) => p.name === selected.name)) {
      onchange?.({ id, selected: parts[0]! })
    }
  })

  // handler
  const onChange = () => {
    if (isLocked) return

    onchange?.({ id, selected })
  }
  const onToggleLock = () => {
    handleToggleLock?.({ id, value: !isLocked })
  }
</script>

<svelte:element this={tag} class={className + ' container'}>
  <div
    class={`p-2 row text-start parts-select-row ${isLocked ? 'is-locked' : ''}`}
  >
    <label
      for={`select-${id}`}
      class="mb-1 mb-sm-0 p-0 col-12 col-sm-5 fs-5 d-flex justify-content-between align-items-center"
    >
      {caption}
      <StatusBadgeList>
        <LockBadge
          id={`lock-parts-${id}`}
          class="me-sm-2 parts-select-lock"
          titleWhenLocked={$i18n.t('locked', { ns: 'lock' })}
          titleWhenUnlocked={$i18n.t('unlocked', { ns: 'lock' })}
          locked={isLocked}
          clickable={true}
          onclick={onToggleLock}
        />
      </StatusBadgeList>
    </label>
    <select
      id={`select-${id}`}
      class="col-12 col-sm-7 fs-4 parts-select-control"
      disabled={isLocked}
      bind:value={selected}
      onchange={onChange}
    >
      {#each parts as p (p.name)}
        <option value={p}>{p.name}</option>
      {/each}
    </select>
  </div>
</svelte:element>

<style>
  .parts-select-row {
    --parts-select-locked-bg: var(--bs-secondary-bg);
    --parts-select-locked-border: var(
      --bs-border-color-translucent,
      var(--bs-border-color)
    );
    --parts-select-locked-control-bg: var(--bs-secondary-bg);
    --parts-select-locked-control-color: var(
      --bs-secondary-color,
      var(--bs-body-color)
    );
    --parts-select-locked-icon-color: var(
      --bs-secondary-color,
      var(--bs-body-color)
    );
    border-radius: 0.5rem;
  }

  .parts-select-row.is-locked {
    background-color: var(--parts-select-locked-bg);
  }

  .parts-select-control:disabled {
    opacity: 1;
  }

  .parts-select-row.is-locked .parts-select-control {
    background-color: var(--parts-select-locked-control-bg);
    border-color: var(--parts-select-locked-border);
    color: var(--parts-select-locked-control-color);
  }

  .parts-select-row.is-locked .parts-select-control:disabled {
    box-shadow: none;
  }

  .parts-select-row.is-locked .parts-select-lock {
    color: var(--parts-select-locked-icon-color);
    opacity: 0.75;
  }
</style>
