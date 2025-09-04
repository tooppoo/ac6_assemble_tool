<script lang="ts">
  import type { I18NextStore } from '$lib/i18n/define'
  import { useWithEnableState } from '$lib/ssg/safety-reference'

  import { getContext, onMount } from 'svelte'

  const i18n = getContext<I18NextStore>('i18n')

  const defaultLanguage: string = 'ja'
  const languageQuery: string = 'lng'

  // state
  let language: string = defaultLanguage
  let serializeLanguage = useWithEnableState(setLanguageQuery)

  onMount(() => {
    initialize()

    serializeLanguage.enable()
  })

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
  $: {
    $i18n.changeLanguage(language)

    serializeLanguage.run()
  }
  function onChange(e: Event) {
    const target = e.target as HTMLInputElement

    language = target.value
  }

  // setup
  function initialize() {
    const url = new URL(location.href)

    language = url.searchParams.get(languageQuery) || defaultLanguage
  }
  function setLanguageQuery() {
    const url = new URL(location.href)
    const query = url.searchParams

    query.set(languageQuery, language)
    url.search = query.toString()

    history.pushState({}, '', url)
  }
</script>

{#if language !== undefined}
  <div>
    <label for="change-language">
      {$i18n.t('language.label', { ns: 'page/index' })}
    </label>
    :
    <select id="change-language" on:change={onChange} bind:value={language}>
      {#each languages as lng (lng.value)}
        <option value={lng.value} selected={lng.isSelected()}>
          {lng.label}
        </option>
      {/each}
    </select>
  </div>
{/if}
