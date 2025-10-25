<script lang="ts">
  import i18n from '$lib/i18n/define'

  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import { setContext } from 'svelte'

  import PartsGrid from './PartsGrid.svelte'

  interface Props {
    parts: ACParts[]
    slot: CandidatesKey
    favorites: Set<string>
    ontogglefavorite?: (partsId: string) => void
  }

  let { parts, slot, favorites, ontogglefavorite }: Props = $props()

  // 実際のi18nインスタンスを提供
  setContext('i18n', i18n)
</script>

<PartsGrid {parts} {slot} {favorites} {ontogglefavorite} />
