<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import About from '$lib/view/about/About.svelte'
</script>

<svelte:head>
  <!-- url -->
  <link rel="canonical" href={appUrl('about')} />
  <meta property="og:url" content={appUrl('about')} />

  <!-- title -->
  <title>AC6 ASSEMBLE TOOL | About</title>
  <meta property="og:title" content="AC6 ASSEMBLE TOOL | About" />

  <!-- description -->
  <meta
    name="description"
    content="AC6 ASSEMBLE TOOL の開発背景、主要機能、設計思想、品質保証方針、セキュリティ対策、ロードマップを紹介する about ページ。"
  />
  <meta
    property="og:description"
    content="AC6 ASSEMBLE TOOL の開発背景、主要機能、設計思想、品質保証方針、セキュリティ対策、ロードマップを紹介する about ページ。"
  />
</svelte:head>

<About />
