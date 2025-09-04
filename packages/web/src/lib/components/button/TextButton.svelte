<script lang="ts">
  import { Tooltip } from '@sveltestrap/sveltestrap'
  import { createEventDispatcher } from 'svelte'
  import type { Action } from 'svelte/action'

  export let id: string
  export let action: Action = () => {}
  export let tooltipText: string = ''

  const dispatch = createEventDispatcher<{ click: null }>()
</script>

<button
  {id}
  {...$$restProps}
  class={`${$$props.class || ''} btn btn-secondary bg-dark-subtle`}
  onclick={() => dispatch('click')}
  use:action
>
  <slot></slot>
</button>
{#if tooltipText}
  <Tooltip target={id}>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html tooltipText}
  </Tooltip>
{/if}
