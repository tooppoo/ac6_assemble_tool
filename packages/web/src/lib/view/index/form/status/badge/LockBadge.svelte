<script lang="ts">
  import BaseStatusBadge from '$lib/view/index/form/status/base/BaseStatusBadge.svelte'

  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    id: string
    titleWhenLocked?: string
    titleWhenUnlocked?: string
    locked?: boolean
    clickable?: boolean
    onclick?: () => void
  } & HTMLAttributes<HTMLButtonElement>

  let {
    id,
    titleWhenLocked = '',
    titleWhenUnlocked = '',
    locked = false,
    clickable = false,
    onclick,
    ...rest
  }: Props = $props()

  // state
  let title: string = $derived(locked ? titleWhenLocked : titleWhenUnlocked)
  let classes: string = $derived(
    ['bi'].concat(locked ? 'bi-lock-fill' : 'bi-unlock').join(' '),
  )
</script>

<BaseStatusBadge
  {id}
  class={`${rest.class || ''} ${classes}`}
  data-clickable={clickable}
  {title}
  {clickable}
  withTooltip={true}
  {onclick}
/>
