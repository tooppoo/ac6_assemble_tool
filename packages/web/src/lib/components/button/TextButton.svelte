<script lang="ts">
  import { Tooltip } from '@sveltestrap/sveltestrap'
  import { type Snippet } from 'svelte'
  import type { Action } from 'svelte/action'

  interface Props {
    id: string
    class?: string
    action?: Action
    tooltipText?: string
    onclick?: () => void
    children: Snippet
    [key: string]: unknown
  }

  let {
    id,
    class: className = '',
    action = () => {},
    tooltipText = '',
    children,
    onclick,
    ...restProps
  }: Props = $props()
</script>

<button
  {id}
  {...restProps}
  class={`${className} btn btn-secondary bg-dark-subtle`}
  {onclick}
  use:action
>
  {@render children()}
</button>
{#if tooltipText}
  <Tooltip target={id}>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html tooltipText}
  </Tooltip>
{/if}
