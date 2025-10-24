<script lang="ts">
  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'

  import PartsCard from './PartsCard.svelte'

  interface Props {
    parts: ACParts
    isFavorite?: boolean
    ontogglefavorite?: () => void
  }

  let { parts, isFavorite, ontogglefavorite }: Props = $props()

  // i18nモックを提供
  const mockI18n = writable({
    t: (key: string) => key, // キーをそのまま返す
  })
  setContext('i18n', mockI18n)
</script>

<PartsCard {parts} {isFavorite} {ontogglefavorite} />
