<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    summary: string
    class?: string
    children: Snippet
  }

  let { summary, class: className, children }: Props = $props()
</script>

<details class={className}>
  <summary>{summary}</summary>

  {@render children()}
</details>
