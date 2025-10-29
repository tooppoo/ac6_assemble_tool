<script lang="ts">
  import './app.scss'
  import { publicPath } from '$lib/app-url'
  import i18n from '$lib/i18n/define'
  import { extractChars } from '$lib/i18n/extract-chars'
  import { resources } from '$lib/i18n/resources'
  import { appVersion } from '$lib/utils/app-version'

  import { setContext } from 'svelte'
  import ToolSection from '$lib/components/layout/ToolSection.svelte'
  import Margin from '$lib/components/spacing/Margin.svelte'
  import {
    PUBLIC_REPORT_BUG_URL,
    PUBLIC_REPORT_REQUEST_URL,
  } from '$env/static/public'

  setContext('i18n', i18n)

  const jaText = extractChars(resources.ja)
  function onFontLoad(this: HTMLLinkElement): void {
    this.media = 'all'
  }

  const reportRequestLinkAttributes = {
    href: PUBLIC_REPORT_REQUEST_URL,
    target: '_blank',
    rel: 'external noopener noreferrer',
  } as const

  const reportBugLinkAttributes = {
    href: PUBLIC_REPORT_BUG_URL,
    target: '_blank',
    rel: 'external noopener noreferrer',
  } as const
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

  <ToolSection
    id="development-report"
    class="container mx-auto my-4 w-100 text-center d-flex flex-column align-items-center"
  >
    <a class="d-block ms-1" {...reportRequestLinkAttributes}>
      {$i18n.t('report.request', { ns: 'page/index' })}
      <i class="bi bi-send"></i>
    </a>

    <Margin space={2} />

    <a class="d-block ms-1" {...reportBugLinkAttributes}>
      {$i18n.t('report.bug', { ns: 'page/index' })}
      <i class="bi bi-send"></i>
    </a>

    <hr class="w-100" />

    <a
      class="d-block ms-1"
      href="https://github.com/tooppoo/ac6_assemble_tool/releases"
      target="_blank"
      rel="external noopener noreferrer"
    >
      Release Notes
      <i class="bi bi-journal-text"></i>
    </a>
  </ToolSection>

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
