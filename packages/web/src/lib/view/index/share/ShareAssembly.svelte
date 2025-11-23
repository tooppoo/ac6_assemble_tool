<script lang="ts" context="module">
  import type { ToggleOffCanvas } from '$lib/components/off-canvas/OffCanvas.svelte'
</script>

<script lang="ts">
  import OffCanvas from '$lib/components/off-canvas/OffCanvas.svelte'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
  import { createEventDispatcher } from 'svelte'

  import ShareByText from './text/ShareByText.svelte'
  import ShareByUrl from './url/ShareByUrl.svelte'

  export let id: string
  export let assembly: () => Assembly
  export let prefix: () => string = () => ''
  export let open: boolean

  // setup
  const dispatch = createEventDispatcher<{
    toggle: ToggleOffCanvas
  }>()
</script>

<OffCanvas {id} {open} onToggle={(e) => dispatch('toggle', e)}>
  {#snippet title()}
    <slot name="title" />
  {/snippet}
  {#snippet body()}
    <ShareByText id="{id}-share-by-text" class="mb-3" prefix={prefix} {assembly} />
    <ShareByUrl id="{id}-share-by-url" />
  {/snippet}
</OffCanvas>
