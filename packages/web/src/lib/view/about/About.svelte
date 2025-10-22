<script lang="ts">
  import Navbar from '$lib/view/index/layout/Navbar.svelte'

  import type { AboutSection } from './types'

  export let sections: readonly AboutSection[]
  export let heroTitle: string
  export let heroLead: string
  export let backLinkLabel: string
  export let homeHref: string = '/'
  type LanguageSwitcherItem = {
    readonly label: string
    readonly href: string
    readonly active: boolean
  }

  export let languageSwitcher: readonly LanguageSwitcherItem[] = []
  export let tocNavigationLabel: string = 'Page navigation'
  export let tocHeadingLabel: string = 'Sections'

  const tocItems = sections.map((section) => ({
    id: section.id,
    title: section.title,
  }))

  $: resolvedHomeHref = homeHref
  $: resolvedLanguageSwitcher = languageSwitcher.map((locale) => ({
    ...locale,
    resolvedHref: locale.href,
  }))
</script>

<div class="bg-dark text-light min-vh-100">
  <Navbar>
    <a
      class="nav-link text-light"
      href={resolvedHomeHref}
      data-testid="nav-home-link"
    >
      {backLinkLabel}
    </a>
    {#if resolvedLanguageSwitcher.length > 0}
      {#each resolvedLanguageSwitcher as locale (locale.href)}
        <a
          class={`nav-link ms-3 ${locale.active ? 'fw-bold text-primary' : 'text-light'}`}
          href={locale.resolvedHref}
          aria-current={locale.active ? 'page' : undefined}
        >
          {locale.label}
        </a>
      {/each}
    {/if}
  </Navbar>

  <main class="container py-5 fs-5" data-testid="about-page">
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
        <nav
          class="position-sticky top-0 pt-lg-3"
          aria-label={tocNavigationLabel}
        >
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
        {#each sections as section (section.id)}
          <section id={section.id} class="mb-5">
            <div class="mb-3">
              <span class="badge text-bg-primary text-uppercase">
                {section.id}
              </span>
            </div>
            <h2 class="h3 fw-bold mb-3">{section.title}</h2>
            <p class="text-light border-start border-3 border-primary ps-3">
              {section.lead}
            </p>

            {#each section.body as paragraph, index (index)}
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
