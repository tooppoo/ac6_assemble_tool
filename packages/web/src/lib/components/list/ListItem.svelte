<script lang="ts">
  import { type Snippet } from 'svelte'

  interface Props {
    children: Snippet
  }
  let { children }: Props = $props()
</script>

<li class="list-group-item">
  {@render children()}
</li>
