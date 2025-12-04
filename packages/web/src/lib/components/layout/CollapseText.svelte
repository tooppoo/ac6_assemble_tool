<script lang="ts">
  import type { Snippet } from "svelte"

  interface Props {
    summary?: string
    children: Snippet
  }

  let { summary = '', children }: Props = $props()
</script>

<details>
  {#if summary.length > 0}
    <summary>{summary}</summary>
  {/if}

  {@render children()}
</details>
