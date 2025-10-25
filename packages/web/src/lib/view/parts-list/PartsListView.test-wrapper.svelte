<script lang="ts">
  import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
  import { setContext } from 'svelte'

  import i18n from '$lib/i18n/define'

  import PartsListView from './PartsListView.svelte'

  interface Props {
    regulation: Regulation
    initialSearchParams?: URLSearchParams
  }

  let { regulation, initialSearchParams }: Props = $props()

  // 実際のi18nインスタンスを提供
  setContext('i18n', i18n)
</script>

<PartsListView {regulation} {initialSearchParams} />
