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
    if (lock.isLocking(id)) return

    onchange?.({ id, selected })
  }
  const onToggleLock = () => {
    handleToggleLock?.({ id, value: !lock.isLocking(id) })
  }
</script>

<svelte:element this={tag} class={className + ' container'}>
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
          onclick={onToggleLock}
        />
      </StatusBadgeList>
    </label>
    <select
      id={`select-${id}`}
      class="col-12 col-sm-7 fs-4"
      disabled={lock.isLocking(id)}
      bind:value={selected}
      onchange={onChange}
    >
      {#each parts as p (p.name)}
        <option value={p}>{p.name}</option>
      {/each}
    </select>
  </div>
</svelte:element>
