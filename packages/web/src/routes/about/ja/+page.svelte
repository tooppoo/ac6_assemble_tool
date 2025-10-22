<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import About from '$lib/view/about/About.svelte'
  import { aboutSections } from '$lib/i18n/locales/ja/pages/about/content.ja'
  import { page } from '$app/stores'


  const heroTitle = 'AC6 ASSEMBLE TOOL /about'
  const heroLead =
    '本ページでは、AC6 ASSEMBLE TOOL の役割、提供価値、利用方法、今後の展望をまとめています。初めて触れる方も既存ユーザーも同じ情報を確認でき、安心してアセンブル検討に集中できるようにすることが目的です。'

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
  $: homeHref = jaQuery ? `/${jaQuery}` : '/'
  $: languageSwitcher = [
    { label: '日本語', href: `/about/ja${jaQuery}`, active: true },
    { label: 'English', href: `/about/en${enQuery}`, active: false },
  ] satisfies readonly LanguageLink[]
</script>

<svelte:head>
  <link rel="canonical" href={appUrl('about', 'ja')} />
  <meta property="og:url" content={appUrl('about', 'ja')} />
  <title>AC6 ASSEMBLE TOOL | About (日本語)</title>
  <meta
    property="og:title"
    content="AC6 ASSEMBLE TOOL | About (日本語)"
  />
  <meta
    name="description"
    content="AC6 ASSEMBLE TOOL の概要、開発背景、主要機能、今後のロードマップなどを紹介する日本語版 about ページ。"
  />
  <meta
    property="og:description"
    content="AC6 ASSEMBLE TOOL の概要、開発背景、主要機能、今後のロードマップなどを紹介する日本語版 about ページ。"
  />
</svelte:head>

<About
  heroTitle={heroTitle}
  heroLead={heroLead}
  backLinkLabel="ホームに戻る"
  {homeHref}
  {languageSwitcher}
  sections={aboutSections}
/>
