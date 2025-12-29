<script lang="ts">
  import type { I18NextStore } from '$lib/i18n/define'
  import {
    changeLanguage,
    getCurrentLanguage,
  } from '$lib/store/language/language-store.svelte'

  import { getContext } from 'svelte'

  const i18n = getContext<I18NextStore>('i18n')

  // グローバルストアから現在の言語設定を取得
  // $state のため、リアクティブに追跡される
  let language = $derived.by(() => getCurrentLanguage())

  const languages = [
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' },
  ]

  // handler
  function onChange(e: Event) {
    const target = e.target as HTMLInputElement

    // グローバルストアとURLクエリの両方を更新
    changeLanguage(target.value)
  }
</script>

{#if language !== undefined}
  <div>
    <label for="change-language">
      {$i18n.t('language.label', { ns: 'page/index' })}
    </label>
    :
    <select id="change-language" onchange={onChange} value={language}>
      {#each languages as lng (lng.value)}
        <option value={lng.value}>
          {lng.label}
        </option>
      {/each}
    </select>
  </div>
{/if}
