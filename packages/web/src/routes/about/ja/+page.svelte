<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import About from '$lib/view/about/About.svelte'
  import { aboutSections } from '$lib/i18n/locales/ja/pages/about/content.ja'


  const heroTitle = 'AC6 ASSEMBLE TOOL /about'
  const heroLead =
    '本ページでは、AC6 ASSEMBLE TOOL の役割、提供価値、利用方法、今後の展望をまとめています。初めて触れる方も既存ユーザーも同じ情報を確認でき、安心してアセンブル検討に集中できるようにすることが目的です。'

  const languageSwitcher = [
    { label: '日本語', href: '/about/ja', active: true },
    { label: 'English', href: '/about/en', active: false },
  ] as const
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
  {languageSwitcher}
  sections={aboutSections}
/>
