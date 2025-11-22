<script lang="ts">
  import Navbar from '$lib/components/layout/Navbar.svelte'

  // 情報系ページの共通UIとクエリ維持をまとめたレイアウト
  export type InfoTocItem = {
    id: string
    title: string
    lead?: string
    paragraphs: readonly string[]
  }

  interface Props {
    heroTitle: string
    heroLead: string
    tocItems: readonly InfoTocItem[]
    tocNavigationLabel?: string
    tocHeadingLabel?: string
    testId?: string | null
  }

  let {
    heroTitle,
    heroLead,
    tocItems,
    tocNavigationLabel = 'Page navigation',
    tocHeadingLabel = 'Contents',
    testId = null,
  }: Props = $props()
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
        {#each tocItems as item (item.id)}
          <section id={item.id} class="mb-5">
            <div class="mb-3">
              <span class="badge text-bg-primary text-uppercase">
                {item.id}
              </span>
            </div>
            <h2 class="h3 fw-bold mb-3">{item.title}</h2>
            {#if item.lead}
              <p class="text-light border-start border-3 border-primary ps-3">
                {item.lead}
              </p>
            {/if}

            {#each item.paragraphs as paragraph, index (index)}
              <p class="mt-3 lh-lg">
                {paragraph}
              </p>
            {/each}
          </section>
        {/each}
      </div>
    </div>
  </main>
</div>
