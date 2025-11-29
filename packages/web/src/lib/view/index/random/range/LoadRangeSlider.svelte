<script lang="ts">
  import i18n from '$lib/i18n/define'
  import LockBadge from '$lib/view/index/form/status/badge/LockBadge.svelte'
  import StatusBadgeList from '$lib/view/index/form/status/StatusBadgeList.svelte'

  import type {
    Assembly,
    AssemblyKey,
  } from '@ac6_assemble_tool/core/assembly/assembly'
  import type { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
  import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
  import { sum } from '@ac6_assemble_tool/shared/array'
  import { roundUpByRealPart } from '@ac6_assemble_tool/shared/number'
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
  } from '@sveltestrap/sveltestrap'

  import RangeSlider from './base/RangeSlider.svelte'

  export type ToggleLock = { id: AssemblyKey; value: boolean }

  type Props = {
    candidates: Candidates
    assembly: Assembly
    lock: LockedParts
    class?: string
    onChange?: (payload: { value: number }) => void
    onToggleLock?: (payload: ToggleLock) => void
  }

  let {
    candidates,
    assembly,
    lock,
    class: className = '',
    onChange: onChangeProp,
    onToggleLock: onToggleLockProp,
  }: Props = $props()

  let max = $derived(getMinAndMax(candidates).max)
  let min = $derived(getMinAndMax(candidates).min)
  let value = $derived<number>(max)

  // handler
  const onChange = (event: { value: number }) => {
    value = event.value

    onChangeProp?.(event)
  }
  const onSetLoadLimit = () => {
    value = assembly.loadLimit

    onChangeProp?.({ value })
  }
  const onToggleLock = () => {
    onToggleLockProp?.({ id: 'legs', value: !lock.isLocking('legs') })
  }

  // setup
  function getMinAndMax(target: Candidates): { max: number; min: number } {
    type WithWeight = Readonly<{ weight: number }>
    type Sort = <T extends WithWeight>(xs: readonly T[]) => readonly T[]

    const desc: Sort = (xs) => xs.toSorted((a, b) => b.weight - a.weight)
    const asc: Sort = (xs) => xs.toSorted((a, b) => a.weight - b.weight)
    const total = (s: Sort): number =>
      sum(
        [
          s(target.rightArmUnit)[0],
          s(target.leftArmUnit)[0],
          s(target.rightBackUnit)[0],
          s(target.leftBackUnit)[0],
          s(target.head)[0],
          s(target.core)[0],
          s(target.arms)[0],
          s(target.booster)[0],
          s(target.fcs)[0],
          s(target.generator)[0],
        ].map((x) => x.weight),
      )

    const max = total(desc)
    const min = total(asc)

    return { max: roundUpByRealPart(2)(max), min }
  }
</script>

<RangeSlider
  id="load"
  class={className}
  label={$i18n.t('random:range.load.label')}
  {max}
  {min}
  {value}
  step={10}
  onchange={onChange}
>
  {#snippet status()}
    <StatusBadgeList class="ms-2">
      {#if lock.isLocking('legs')}
        <LockBadge
          id="load-range-slider-lock-legs"
          titleWhenLocked={$i18n.t('lock:locking', {
            part: $i18n.t('legs', { ns: 'assembly' }),
          })}
          locked={true}
        />
      {/if}
    </StatusBadgeList>
  {/snippet}
  {#snippet labelSlot({ labelId, text })}
    <Dropdown id={labelId}>
      <DropdownToggle>
        {text}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem on:click={onToggleLock}>
          {#if lock.isLocking('legs')}
            {$i18n.t('lock:unlockAt', {
              part: $i18n.t('legs', { ns: 'assembly' }),
            })}
          {:else}
            {$i18n.t('lock:lockAt', {
              part: $i18n.t('legs', { ns: 'assembly' }),
            })}
          {/if}
        </DropdownItem>
        <DropdownItem on:click={onSetLoadLimit}>
          {$i18n.t('random:range.load.applyCurrentLegsLoadLimit')}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  {/snippet}
</RangeSlider>

<style>
</style>
