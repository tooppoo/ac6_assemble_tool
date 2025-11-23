<script lang="ts">
  import OffCanvas, { type ToggleOffCanvas } from '$lib/components/off-canvas/OffCanvas.svelte'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'

  import ShareByText from './text/ShareByText.svelte'
  import ShareByUrl from './url/ShareByUrl.svelte'
  import type { Snippet } from 'svelte'

  type Props = {
    id: string
    assembly: () => Assembly
    prefix?: () => string
    open: boolean
    onToggle?: (payload: ToggleOffCanvas) => void
    title?: Snippet
  }

  let {
    id,
    assembly,
    prefix = () => '',
    open,
    onToggle: onToggleProp,
    title: titleSnippet,
  }: Props = $props()

  // setup
  const handleToggle = (event: ToggleOffCanvas) => {
    onToggleProp?.(event)
  }
</script>

<OffCanvas {id} {open} onToggle={handleToggle}>
  {#snippet title()}
    {@render titleSnippet?.()}
  {/snippet}
  {#snippet body()}
    <ShareByText id="{id}-share-by-text" class="mb-3" prefix={prefix} {assembly} />
    <ShareByUrl id="{id}-share-by-url" />
  {/snippet}
</OffCanvas>
