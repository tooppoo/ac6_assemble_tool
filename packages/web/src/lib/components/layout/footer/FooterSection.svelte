<script lang="ts">
  import { type Snippet } from 'svelte'

  interface Props {
    caption: string
    class?: string
    children: Snippet
  }
  let { caption, class: className, children }: Props = $props()
</script>

<section class="text-start {className}">
  <div class="fs-5">{caption}</div>
  {@render children()}
</section>
