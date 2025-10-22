<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import About from '$lib/view/about/About.svelte'
  import { aboutSections } from '$lib/i18n/locales/en/pages/about/content.en'
  import { page } from '$app/stores'

  const heroTitle = 'AC6 ASSEMBLE TOOL /about'
  const heroLead =
    'This page introduces AC6 ASSEMBLE TOOL, explains why it exists, highlights the current features, and outlines what comes next so that pilots can rely on the application while planning their builds.'

  type LanguageLink = {
    readonly label: string
    readonly href: string
    readonly active: boolean
  }

  function withLanguage(search: string, language: 'ja' | 'en'): string {
    const raw = search.startsWith('?') ? search.slice(1) : search
    const params = new URLSearchParams(raw)

    if (language === 'ja') {
      params.delete('lng')
    } else {
      params.set('lng', language)
    }

    const query = params.toString()

    return query ? `?${query}` : ''
  }

  let currentSearch: string = ''
  let jaQuery: string = ''
  let enQuery: string = ''
  let homeHref: string = '/'
  let languageSwitcher: readonly LanguageLink[] = []

  $: currentSearch = $page.url.search
  $: jaQuery = withLanguage(currentSearch, 'ja')
  $: enQuery = withLanguage(currentSearch, 'en')
  $: homeHref = enQuery ? `/${enQuery}` : '/'
  $: languageSwitcher = [
    { label: '日本語', href: `/about/ja${jaQuery}`, active: false },
    { label: 'English', href: `/about/en${enQuery}`, active: true },
  ] satisfies readonly LanguageLink[]
</script>

<svelte:head>
  <link rel="canonical" href={appUrl('about', 'en')} />
  <meta property="og:url" content={appUrl('about', 'en')} />
  <title>AC6 ASSEMBLE TOOL | About (English)</title>
  <meta
    property="og:title"
    content="AC6 ASSEMBLE TOOL | About (English)"
  />
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
  heroTitle={heroTitle}
  heroLead={heroLead}
  backLinkLabel="Back to home"
  {homeHref}
  {languageSwitcher}
  sections={aboutSections}
/>
