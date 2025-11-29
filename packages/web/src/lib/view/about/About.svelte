<script lang="ts">
  import InfoPageLayout, {
    type InfoTocItem,
  } from '$lib/view/info/Information.svelte'

  interface Props {
    tocItems: readonly InfoTocItem[]
    heroTitle: string
    heroLead: string
    tocNavigationLabel?: string
    tocHeadingLabel?: string
  }
  let {
    tocItems,
    heroTitle,
    heroLead,
    tocNavigationLabel = 'Page navigation',
    tocHeadingLabel = 'Sections',
  }: Props = $props()
</script>

<InfoPageLayout
  {heroTitle}
  {heroLead}
  {tocItems}
  {tocNavigationLabel}
  {tocHeadingLabel}
  testId="about-page"
/>
