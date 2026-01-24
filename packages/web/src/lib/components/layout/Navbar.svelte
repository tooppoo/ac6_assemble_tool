<script lang="ts">
  import { withPageQuery } from '$lib/utils/page-query'

  import GlobalNav from './GlobalNav.svelte'

  let { children } = $props<{
    children?: () => unknown
  }>()

  let pageQuery = $derived.by(withPageQuery)
</script>

<header class="sticky-top">
  <!-- 上段: グローバルナビ（PC専用） -->
  <GlobalNav />

  <!-- 下段: 既存のツールバー -->
  <nav
    class="navbar navbar-expand-lg bg-body-tertiary border-bottom border-secondary"
  >
    <div class="container-fluid">
      <a class="navbar-brand" href={`/${pageQuery}`}> Ⅵ </a>
      <div class="navbar-nav ms-auto d-flex flex-row">
        {@render children?.()}
      </div>
    </div>
  </nav>
</header>
