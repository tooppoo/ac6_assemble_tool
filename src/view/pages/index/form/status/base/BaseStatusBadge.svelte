<script lang="ts">
import IconButton from '~view/components/button/IconButton.svelte'

import {createEventDispatcher} from "svelte";

export let title: string
export let clickable: boolean = false
export let withTooltip: boolean = true

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
  title={title}
  clickable={clickable}
  withTooltip={withTooltip}
  on:click={onClick}
/>
