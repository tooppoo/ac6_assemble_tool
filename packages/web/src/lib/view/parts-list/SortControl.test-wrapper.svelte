<script lang="ts">
  import i18n from '$lib/i18n/define'

  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import { setContext } from 'svelte'

  import SortControl from './SortControl.svelte'
  import type { PropertyFilterKey } from './state/filter/filters-application'
  import type { SortKey, SortOrder } from './state/sort'

  interface Props {
    slot: CandidatesKey
    properties: readonly PropertyFilterKey[]
    sortKey: SortKey | null
    sortOrder: SortOrder | null
    onsortchange?: (payload: { key: SortKey; order: SortOrder }) => void
    onsortclear?: () => void
  }

  let {
    slot,
    properties,
    sortKey,
    sortOrder,
    onsortchange,
    onsortclear,
  }: Props = $props()

  setContext('i18n', i18n)
</script>

<SortControl
  {slot}
  {properties}
  {sortKey}
  {sortOrder}
  onsortchange={onsortchange}
  onsortclear={onsortclear}
/>
