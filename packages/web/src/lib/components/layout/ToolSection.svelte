<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    id?: string
    class?: string
    children?: Snippet
  }
  let { id, class: className = '', children }: Props = $props()
</script>

<section
  {id}
  class={className +
    ' py-4 px-2 px-sm-4 px-md-5 border border-secondary bg-dark-subtle'}
>
  {@render children?.()}
</section>
