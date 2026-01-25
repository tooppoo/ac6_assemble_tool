<script lang="ts">
  import i18n from '$lib/i18n/define'

  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import { setContext } from 'svelte'

  import PartsCard from './PartsCard.svelte'

  interface Props {
    parts: ACParts
    isFavorite?: boolean
    ontogglefavorite?: () => void
    onselect?: () => void
  }

  let { parts, isFavorite, ontogglefavorite, onselect }: Props = $props()

  // 実際のi18nインスタンスを提供
  setContext('i18n', i18n)
</script>

<PartsCard {parts} {isFavorite} {ontogglefavorite} {onselect} />
