<script lang="ts">
  import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'

  import PartsListView from './PartsListView.svelte'

  interface Props {
    regulation: Regulation
    initialSearchParams?: URLSearchParams
  }

  let { regulation, initialSearchParams }: Props = $props()

  // i18nモックを提供
  const mockI18n = writable({
    t: (key: string) => key, // キーをそのまま返す
  })
  setContext('i18n', mockI18n)
</script>

<PartsListView {regulation} {initialSearchParams} />
