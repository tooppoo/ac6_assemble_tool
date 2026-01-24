<script lang="ts">
  import type { I18NextStore } from '$lib/i18n/define'
  import { withPageQuery } from '$lib/utils/page-query'

  import { getContext } from 'svelte'

  import { page } from '$app/state'

  const i18n = getContext<I18NextStore>('i18n')
  let pageQuery = $derived.by(withPageQuery)

  // 現在のパスからアクティブなモードを判定
  let currentPath = $derived(page.url.pathname)

  interface NavItem {
    path: string
    labelKey: string
  }

  const navItems: NavItem[] = [
    { path: '/', labelKey: 'globalNav.assembly' },
    { path: '/parts-list', labelKey: 'globalNav.parts' },
    { path: '/recommendation', labelKey: 'globalNav.ai' },
  ]

  const isActive = (itemPath: string, currentPath: string): boolean => {
    return itemPath === currentPath
  }
</script>

<nav
  class="global-nav d-none d-lg-flex align-items-center justify-content-center"
  aria-label="Mode navigation"
>
  {#each navItems as item (item.path)}
    <a
      href={`${item.path}${pageQuery}`}
      class="global-nav__item"
      class:global-nav__item--active={isActive(item.path, currentPath)}
      aria-current={isActive(item.path, currentPath) ? 'page' : undefined}
    >
      {$i18n.t(item.labelKey, { ns: 'page/index' })}
    </a>
  {/each}
</nav>

<style>
  .global-nav {
    height: 48px;
    background-color: var(--bs-body-bg);
    border-bottom: 1px solid var(--bs-border-color);
  }

  .global-nav__item {
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    color: var(--bs-body-color);
    border-bottom: 3px solid transparent;
    transition: border-color 0.2s ease;
  }

  .global-nav__item--active {
    background-color: var(--global-nav-active-bg);
    font-weight: 500;
  }

  .global-nav__item:not(.global-nav__item--active):hover {
    background-color: var(--bs-tertiary-bg);
  }
</style>
