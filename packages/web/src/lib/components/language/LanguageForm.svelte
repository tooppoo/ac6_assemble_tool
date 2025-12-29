<script lang="ts">
  import type { I18NextStore } from '$lib/i18n/define'
  import {
    changeLanguage,
    getCurrentLanguage,
  } from '$lib/store/language/language-store'

  import { getContext } from 'svelte'

  const i18n = getContext<I18NextStore>('i18n')

  // グローバルストアから現在の言語設定を取得
  let language: string = $state(getCurrentLanguage())

  const languages = (() => {
    const defLng = (opt: { value: string; label: string }) => ({
      ...opt,
      isSelected: () => language === opt.value,
    })

    return [
      defLng({ value: 'ja', label: '日本語' }),
      defLng({ value: 'en', label: 'English' }),
    ]
  })()

  // handler
  function onChange(e: Event) {
    const target = e.target as HTMLInputElement

    language = target.value

    // グローバルストアとURLクエリの両方を更新
    changeLanguage(language)
  }
</script>

{#if language !== undefined}
  <div>
    <label for="change-language">
      {$i18n.t('language.label', { ns: 'page/index' })}
    </label>
    :
    <select id="change-language" onchange={onChange} bind:value={language}>
      {#each languages as lng (lng.value)}
        <option value={lng.value} selected={lng.isSelected()}>
          {lng.label}
        </option>
      {/each}
    </select>
  </div>
{/if}
