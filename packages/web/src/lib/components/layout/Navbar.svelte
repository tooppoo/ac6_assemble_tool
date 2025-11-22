<script lang="ts">
  import { page } from '$app/state'

  let { children } = $props()

  let pageQuery = $derived(page.url.search)
</script>

<nav
  class="navbar navbar-expand-lg sticky-top bg-body-tertiary border-bottom border-secondary"
>
  <div class="container-fluid">
    <a class="navbar-brand" href={`/${pageQuery}`}> Ⅵ </a>
    <div class="navbar-nav ms-auto d-flex flex-row">
      {@render children?.()}
    </div>
  </div>
</nav>
