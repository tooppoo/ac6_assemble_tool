<script lang="ts">
  import Navbar from '$lib/components/layout/Navbar.svelte'
  import { withPageQuery } from '$lib/utils/page-query'
  import type { Snippet } from 'svelte'

  // 情報系ページの共通UIとクエリ維持をまとめたレイアウト
  export type InfoTocItem = {
    id: string
    title: string
  }

  interface Props {
    heroTitle: string
    heroLead: string
    tocItems?: readonly InfoTocItem[]
    tocNavigationLabel?: string
    tocHeadingLabel?: string
    testId?: string | null
    children: Snippet<[{ pageQuery: string }]>
  }

  let {
    children,
    heroTitle,
    heroLead,
    tocItems = [],
    tocNavigationLabel = 'Page navigation',
    tocHeadingLabel = 'Contents',
    testId = null,
  }: Props = $props()

  const pageQuery = $derived.by(withPageQuery)
</script>

<div class="bg-dark text-light min-vh-100">
  <Navbar />

  <main class="container py-5 fs-5" data-testid={testId ?? undefined}>
    <header class="mb-5">
      <h1 class="display-5 fw-bold mb-3">
        {heroTitle}
      </h1>
      <p class="lead text-light fs-4">
        {heroLead}
      </p>
    </header>

    <div class="row">
      <aside class="col-lg-3 mb-4">
        <nav class="position-sticky top-0 pt-lg-3" aria-label={tocNavigationLabel}>
          <div class="card bg-dark border border-secondary">
            <div class="card-body">
              <h2 class="h6 text-uppercase fw-semibold mb-3 text-light">
                {tocHeadingLabel}
              </h2>
              <ul class="m-0 ps-4 text-light">
                {#each tocItems as item (item.id)}
                  <li class="mb-2">
                    <a
                      class="link-light link-underline-opacity-25 link-underline-opacity-75-hover"
                      href={`#${item.id}`}
                    >
                      {item.title}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </nav>
      </aside>

      <div class="col-lg-9">
        {@render children({ pageQuery })}
      </div>
    </div>
  </main>
</div>
