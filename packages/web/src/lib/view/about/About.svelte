<script lang="ts">
  import InfoPageLayout from '$lib/components/layout/InfoPageLayout.svelte'

  import type { AboutSection } from './types'

  export let sections: readonly AboutSection[]
  export let heroTitle: string
  export let heroLead: string

  export let tocNavigationLabel: string = 'Page navigation'
  export let tocHeadingLabel: string = 'Sections'

  const tocItems = sections.map((section) => ({
    id: section.id,
    title: section.title,
  }))
</script>

<InfoPageLayout
  {heroTitle}
  {heroLead}
  {tocItems}
  {tocNavigationLabel}
  {tocHeadingLabel}
  testId="about-page"
>
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
</InfoPageLayout>
