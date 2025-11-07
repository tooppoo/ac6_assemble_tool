<script lang="ts">
  import i18n from '$lib/i18n/define'

  import type { AttributeDefinition } from '@ac6_assemble_tool/parts/attributes-utils'
  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import { setContext } from 'svelte'

  import SortControl from './SortControl.svelte'
  import type { SortKey, SortOrder } from './state/sort'

  interface Props {
    slot: CandidatesKey
    availableAttributes: readonly AttributeDefinition[]
    sortKey: SortKey | null
    sortOrder: SortOrder | null
    onsortchange?: (payload: { key: SortKey; order: SortOrder }) => void
    onsortclear?: () => void
  }

  let {
    slot,
    availableAttributes,
    sortKey,
    sortOrder,
    onsortchange,
    onsortclear,
  }: Props = $props()

  setContext('i18n', i18n)
</script>

<SortControl
  {slot}
  {availableAttributes}
  {sortKey}
  {sortOrder}
  {onsortchange}
  {onsortclear}
/>
