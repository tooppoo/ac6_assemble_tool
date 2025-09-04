<script lang="ts">
  import './app.scss'
  import { publicPath } from '$lib/app-url'
  import i18n from '$lib/i18n/define'
  import { extractChars } from '$lib/i18n/extract-chars'
  import { resources } from '$lib/i18n/resources'

  import { setContext } from 'svelte'

  setContext('i18n', i18n)

  const jaText = extractChars(resources.ja)
  function onFontLoad(this: HTMLLinkElement): void {
    this.media = 'all'
  }
</script>

<svelte:head>
  <!-- OGP -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="AC6 ASSEMBLE TOOL" />
  <meta
    property="og:image"
    content={publicPath('/ogp/ac6_assembly_tool.png')}
  />
  <meta property="og:locale" content="ja_JP" />

  <meta name="twitter:card" content="summary" />
  <!-- End OGP -->

  <!-- Favicon -->
  <link rel="icon" type="image/png" href={publicPath('/favicon/favicon.ico')} />
  <link
    rel="icon"
    type="image/png"
    href={publicPath('/favicon/favicon-16x16.png')}
  />
  <link
    rel="icon"
    type="image/png"
    href={publicPath('/favicon/favicon-32x32.png')}
  />
  <link
    rel="icon"
    type="image/png"
    href={publicPath('/favicon/apple-touch-icon.png')}
  />
  <link
    rel="icon"
    type="image/png"
    href={publicPath('/favicon/android-chrome-192x192.png')}
  />
  <link
    rel="icon"
    type="image/png"
    href={publicPath('/favicon/android-chrome-512x512.png')}
  />
  <!-- End Favicon -->

  <!-- Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap"
    rel="preload"
    as="style"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap"
    rel="stylesheet"
    media="print"
    onload={onFontLoad}
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Sawarabi+Gothic&display=swap&text={jaText}"
    rel="preload"
    as="style"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Sawarabi+Gothic&display=swap&text={jaText}"
    rel="stylesheet"
    media="print"
    onload={onFontLoad}
  />
  <!-- End Font -->
</svelte:head>

<div class="font-monospace" data-testid="layout-root">
  <slot></slot>
</div>
