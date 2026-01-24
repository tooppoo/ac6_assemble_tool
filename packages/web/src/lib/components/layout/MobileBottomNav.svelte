<script lang="ts">
  import type { I18NextStore } from '$lib/i18n/define'
  import { isActiveNavItem, navItems } from '$lib/components/layout/nav-items'

  import { getContext } from 'svelte'

  import { page } from '$app/state'
  import { getQuery } from '$lib/store/query/query-store.svelte'

  const i18n = getContext<I18NextStore>('i18n')
  let pageQuery = $derived.by(getQuery)

  // 現在のパスからアクティブなモードを判定
  let currentPath = $derived(page.url.pathname)
</script>

<nav class="mobile-bottom-nav d-flex d-lg-none" aria-label="Main navigation">
  {#each navItems as item (item.path)}
    <a
      href={`${item.path}?${pageQuery}`}
      class="mobile-bottom-nav__item"
      class:mobile-bottom-nav__item--active={isActiveNavItem(item.path, currentPath)}
      aria-current={isActiveNavItem(item.path, currentPath) ? 'page' : undefined}
    >
      {$i18n.t(item.labelKey, { ns: 'page/index' })}
    </a>
  {/each}
</nav>

<style>
  .mobile-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--mobile-bottom-nav-height);
    background-color: var(--bs-body-bg);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1030;
    border-top: 1px solid var(--bs-border-color);
  }

  .mobile-bottom-nav__item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    text-decoration: none;
    color: var(--bs-body-color);
    font-size: 0.875rem;
  }

  .mobile-bottom-nav__item--active {
    background-color: var(--global-nav-active-bg);
    font-weight: 600;
  }

  .mobile-bottom-nav__item:not(.mobile-bottom-nav__item--active):hover {
    background-color: var(--bs-tertiary-bg);
  }
</style>
