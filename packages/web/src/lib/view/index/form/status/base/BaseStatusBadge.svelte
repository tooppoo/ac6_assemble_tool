<script lang="ts">
  import IconButton from '$lib/components/button/IconButton.svelte'

  import { createEventDispatcher } from 'svelte'

  export let title: string
  export let clickable: boolean = false
  export let withTooltip: boolean = false

  // handler
  function onClick() {
    dispatch('click')
  }

  // setup
  const dispatch = createEventDispatcher<{ click: null }>()
</script>

<IconButton
  id={$$props.id}
  class={`${$$props.class} status-badge`}
  {title}
  {clickable}
  {withTooltip}
  onclick={onClick}
/>
