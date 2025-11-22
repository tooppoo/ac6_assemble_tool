<script lang="ts">
  import { withPageQuery } from '$lib/utils/page-query'

  let { children } = $props<{
    children?: () => unknown
  }>()

  let pageQuery = $derived.by(withPageQuery)
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
