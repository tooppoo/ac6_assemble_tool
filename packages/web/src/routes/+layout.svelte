<script lang="ts">
  import './app.scss'
  import { publicPath } from '$lib/app-url'
  import i18n from '$lib/i18n/define'
  import { extractChars } from '$lib/i18n/extract-chars'
  import { resources } from '$lib/i18n/resources'
  import { appVersion } from '$lib/utils/app-version'

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
    on:load={onFontLoad}
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
    on:load={onFontLoad}
  />
  <!-- End Font -->
</svelte:head>

<div class="font-monospace" data-testid="layout-root">
  <slot></slot>

  <hr class="my-3" />

  <footer class="text-center mb-3">
    <div>
      Created by
      <a
        id="link-to-linktr"
        href="https://linktr.ee/Philomagi"
        rel="external noopener noreferrer"
      >
        >Philomagi</a
      >
    </div>
    <div>
      Source code is managed at
      <a
        id="link-to-src"
        href="https://github.com/tooppoo/ac6_assemble_tool/"
        rel="external noopener noreferrer">Github</a
      >
    </div>
    <div>
      App Version v{appVersion}
    </div>
    <div class="my-3">
      <a
        href="https://www.buymeacoffee.com/philomagi"
        aria-label="donate to philomagi via 'Buy Me a Coffee'"
        target="_blank"
        rel="external noopener noreferrer"
      >
        <img
          src="https://img.buymeacoffee.com/button-api/?text=Donate&emoji=☕&slug=philomagi&button_colour=5F7FFF&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00"
          alt="coffee icon"
        />
      </a>
    </div>
  </footer>
</div>
