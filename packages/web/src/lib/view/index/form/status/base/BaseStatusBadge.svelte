<script lang="ts">
  import IconButton from '$lib/components/button/IconButton.svelte'

  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    id: string
    title: string
    clickable?: boolean
    withTooltip?: boolean
    onclick?: () => void
  } & HTMLAttributes<HTMLButtonElement>
  let {
    id,
    title,
    clickable,
    withTooltip,
    onclick,
    ...rest
  }: Props = $props()
</script>

<IconButton
  id={id}
  class={`${rest.class} status-badge`}
  {title}
  {clickable}
  {withTooltip}
  onclick={onclick}
/>
