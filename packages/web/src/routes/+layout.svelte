<script lang="ts">
  import './app.scss'
  import { appUrl, publicPath } from '$lib/app-url'
  import FooterSection from '$lib/components/layout/footer/FooterSection.svelte'
  import MobileBottomNav from '$lib/components/layout/MobileBottomNav.svelte'
  import ToolSection from '$lib/components/layout/ToolSection.svelte'
  import FlushList from '$lib/components/list/FlushList.svelte'
  import ListItem from '$lib/components/list/ListItem.svelte'
  import Margin from '$lib/components/spacing/Margin.svelte'
  import i18n from '$lib/i18n/define'
  import { extractChars } from '$lib/i18n/extract-chars'
  import { resources } from '$lib/i18n/resources'
  import { initializeLanguageFromQuery } from '$lib/store/language/language-store.svelte'
  import { appVersion } from '$lib/utils/app-version'
  import { withPageQuery } from '$lib/utils/page-query'

  import { setLogLevel } from '@ac6_assemble_tool/shared/logger'
  import { setContext } from 'svelte'

  import { afterNavigate } from '$app/navigation'
  import { page } from '$app/state'
  import {
    PUBLIC_LOG_LEVEL,
    PUBLIC_REPORT_BUG_URL,
    PUBLIC_REPORT_REQUEST_URL,
  } from '$env/static/public'

  let { children } = $props()

  setContext('i18n', i18n)
  setLogLevel(PUBLIC_LOG_LEVEL || 'info')

  // アプリケーション起動時に言語設定を初期化
  afterNavigate(({ type }) => {
    if (type === 'enter') {
      initializeLanguageFromQuery(page.url)
    }
  })

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

  let pageQuery = $derived.by(withPageQuery)
</script>

<svelte:head>
  <!-- OGP -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="AC6 ASSEMBLE TOOL" />
  <meta property="og:image" content={appUrl('/ogp/ac6_assembly_tool.png')} />
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

<div
  class="font-monospace has-mobile-bottom-nav pb-lg-0"
  data-testid="layout-root"
>
  {@render children()}

  <hr class="my-3" />

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

  <footer class="container text-center">
    <div class="row align-items-start">
      <FooterSection caption="TOOLS" class="col">
        <FlushList>
          <ListItem>
            <a href={`/${pageQuery}`}>ASSEMBLY TOOL</a>
          </ListItem>
          <ListItem>
            <a href={`/parts-list${pageQuery}`}>PARTS LIST</a>
          </ListItem>
          <ListItem>
            <a href={`/recommendation${pageQuery}`}>AI RECOMMENDATION</a>
          </ListItem>
        </FlushList>
      </FooterSection>

      <FooterSection caption="CONTENTS" class="col">
        <FlushList>
          <ListItem>
            <a href={`/about${pageQuery}`}>About</a>
          </ListItem>
          <ListItem>
            <a href={`/rule${pageQuery}`} rel="terms-of-service">Terms of Use</a
            >
          </ListItem>
          <ListItem>
            <a href={`/privacy${pageQuery}`} rel="privacy-policy">Privacy</a>
          </ListItem>
        </FlushList>
      </FooterSection>

      <FooterSection caption="LINKS" class="col">
        <FlushList>
          <ListItem>
            <a
              id="link-to-twitter"
              href="https://twitter.com/Philomagi"
              rel="external noopener noreferrer"
              target="_blank"
            >
              Twitter
            </a>
          </ListItem>
          <ListItem>
            <a
              id="link-to-src"
              href="https://github.com/tooppoo/ac6_assemble_tool/"
              rel="external noopener noreferrer"
              target="_blank"
            >
              Github
            </a>
          </ListItem>
          <ListItem>
            <a
              id="link-to-website"
              href="https://philomagi.dev"
              rel="external noopener noreferrer"
              target="_blank"
            >
              https://philomagi.dev
            </a>
          </ListItem>
        </FlushList>
      </FooterSection>
    </div>
    <div class="my-3">
      v{appVersion}
    </div>
  </footer>
</div>

<!-- モバイル下部ナビ -->
<MobileBottomNav />

<style>
  :global(:root) {
    /* モバイル下部ナビ */
    --mobile-bottom-nav-height: 56px;
  }

  .has-mobile-bottom-nav {
    padding-bottom: var(--mobile-bottom-nav-height);
  }
</style>
