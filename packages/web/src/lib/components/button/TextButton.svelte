<script lang="ts">
  import { Tooltip } from '@sveltestrap/sveltestrap'
  import { type Snippet } from 'svelte'
  import type { Action } from 'svelte/action'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    id: string
    type?: 'button' | 'submit' | 'reset' | null
    action?: Action
    tooltipText?: string
    onclick?: () => void
    children?: Snippet
  } & HTMLAttributes<HTMLButtonElement>

  let {
    id,
    type = 'button',
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
  {type}
  class={`${className} btn btn-secondary bg-dark-subtle`}
  {onclick}
  use:action
  {...restProps}
>
  {@render children?.()}
</button>
{#if tooltipText}
  <Tooltip target={id}>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html tooltipText}
  </Tooltip>
{/if}
