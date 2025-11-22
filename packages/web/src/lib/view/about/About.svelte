<script lang="ts">
  import InfoPageLayout, {
    type InfoTocItem,
  } from '$lib/view/info/Information.svelte'

  export let tocItems: readonly InfoTocItem[]
  export let heroTitle: string
  export let heroLead: string

  export let tocNavigationLabel: string = 'Page navigation'
  export let tocHeadingLabel: string = 'Sections'
</script>

<InfoPageLayout
  {heroTitle}
  {heroLead}
  {tocItems}
  {tocNavigationLabel}
  {tocHeadingLabel}
  testId="about-page"
/>
