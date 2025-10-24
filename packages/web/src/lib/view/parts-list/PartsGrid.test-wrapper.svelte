<script lang="ts">
  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'

  import PartsGrid from './PartsGrid.svelte'

  interface Props {
    parts: ACParts[]
    slot: CandidatesKey
    favorites: Set<string>
    ontogglefavorite?: (partsId: string) => void
  }

  let { parts, slot, favorites, ontogglefavorite }: Props = $props()

  // i18nモックを提供
  const mockI18n = writable({
    t: (key: string) => key, // キーをそのまま返す
  })
  setContext('i18n', mockI18n)
</script>

<PartsGrid {parts} {slot} {favorites} {ontogglefavorite} />
