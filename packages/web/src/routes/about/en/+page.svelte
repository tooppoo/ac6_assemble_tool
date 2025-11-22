<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import { aboutSections } from '$lib/i18n/locales/en/pages/about/content.en'
  import About from '$lib/view/about/About.svelte'
  import type { LanguageLink } from '$lib/view/about/language-state'

  const heroTitle = 'AC6 ASSEMBLE TOOL /about'
  const heroLead =
    'This page introduces AC6 ASSEMBLE TOOL, explains why it exists, highlights the current features—including the new parts exploration workspace—and outlines what comes next so that pilots can rely on the application while planning their builds.'

  let languageSwitcher: readonly LanguageLink[] = [
    { label: '日本語', href: '/about/ja', active: false },
    { label: 'English', href: '/about/en', active: true },
  ]
</script>

<svelte:head>
  <link rel="canonical" href={appUrl('about', 'en')} />
  <meta property="og:url" content={appUrl('about', 'en')} />
  <title>AC6 ASSEMBLE TOOL | About (English)</title>
  <meta property="og:title" content="AC6 ASSEMBLE TOOL | About (English)" />
  <meta
    name="description"
    content="Learn what AC6 ASSEMBLE TOOL offers, the problems it solves, and the roadmap ahead in the English about page."
  />
  <meta
    property="og:description"
    content="Learn what AC6 ASSEMBLE TOOL offers, the problems it solves, and the roadmap ahead in the English about page."
  />
</svelte:head>

<About
  {heroTitle}
  {heroLead}
  backLinkLabel="Back to home"
  tocNavigationLabel="Page navigation"
  tocHeadingLabel="Sections"
  sections={aboutSections}
  languageSwitcher={languageSwitcher}
/>
