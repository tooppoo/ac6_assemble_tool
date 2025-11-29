<script lang="ts">
  import { Tooltip } from '@sveltestrap/sveltestrap'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    id: string
    class?: string
    title: string
    clickable?: boolean
    withTooltip?: boolean
    onclick?: () => void
  } & HTMLAttributes<HTMLSpanElement>

  let {
    id,
    title,
    clickable = false,
    withTooltip = false,
    class: className = '',
    onclick,
    ...rest
  }: Props = $props()

  function onClick() {
    if (!clickable) return

    onclick?.()
  }

  const role = $derived(clickable ? 'button' : 'img')
  const classes = $derived(`${className.trim()} icon-button`.trim())
</script>

<span
  {...rest}
  {id}
  class={classes}
  data-clickable={clickable}
  aria-label={title}
  {role}
  onclick={onClick}
></span>
{#if withTooltip}
  <Tooltip target={id} placement="bottom">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html title}
  </Tooltip>
{/if}

<style>
  span[data-clickable='true'] {
    cursor: pointer;
  }
  .icon-button {
    font-size: 1.875rem;
    height: 48px;
    text-align: center;
    width: 48px;
  }
</style>
