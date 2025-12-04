<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    summary: string
    children: Snippet
  }

  let { summary, children }: Props = $props()
</script>

<details>
  <summary>{summary}</summary>

  {@render children()}
</details>
