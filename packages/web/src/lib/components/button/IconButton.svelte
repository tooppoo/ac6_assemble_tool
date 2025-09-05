<script lang="ts">
  import { Tooltip } from '@sveltestrap/sveltestrap'
  import { createEventDispatcher } from 'svelte'

  export let id: string
  export let title: string
  export let clickable: boolean = false
  export let withTooltip: boolean = false

  // handler
  function onClick() {
    if (clickable) {
      dispatch('click')
    }
  }

  const dispatch = createEventDispatcher<{ click: null }>()
</script>

<span
  {...$$restProps}
  {id}
  class={`${($$props.class ?? '').trim()} icon-button`}
  data-clickable={clickable}
  aria-label={title}
  role={clickable ? 'button' : 'img'}
  on:click={onClick}
/>
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
