<script lang="ts">
  import type { Snippet } from "svelte"

  let {
    class: klass = '',
    children,
  }: { class?: string, children?: Snippet } = $props()
</script>

<div
  class={`${klass} status-badge-list d-flex align-items-center`}
>
  {@render children?.()}
</div>
