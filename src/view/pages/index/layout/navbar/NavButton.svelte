<script lang="ts">
  import TextButton from "~view/components/button/TextButton.svelte";

  import Tooltip from "bootstrap/js/dist/tooltip";
  import {createEventDispatcher} from "svelte";

  let tooltip: (Tooltip | null) = null
  let onClick: () => void = () => dispatch('click')

  export let title: string
  $: {
    tooltip && tooltip.setContent({ '.tooltip-inner': title })
  }

  // setup
  function setupTooltip(ev: HTMLElement) {
    tooltip = new Tooltip(ev)

    onClick = () => {
      tooltip && tooltip.hide()

      dispatch('click')
    }
  }
  const dispatch = createEventDispatcher<{ click: null }>()
</script>

<TextButton
  id={$$props.id || ''}
  class={`${$$props.class || ''}`}
  data-bs-toggle="tooltip"
  data-bs-title={title}
  data-bs-placement="left"
  data-bs-html="true"
  on:click={onClick}
  action={setupTooltip}
>
  <slot name="icon"></slot>
  <span class="d-none d-sm-inline">
    <slot></slot>
  </span>
</TextButton>
