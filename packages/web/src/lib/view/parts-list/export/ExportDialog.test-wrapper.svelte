<script lang="ts">
  import i18n from '$lib/i18n/define'

  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
  import { setContext } from 'svelte'

  import type { Filter } from '../filter/filters-core'

  import ExportDialog from './ExportDialog.svelte'

  interface Props {
    open: boolean
    onClose: () => void
    regulation: Regulation
    filteredParts: readonly ACParts[]
    filters: readonly Filter[]
  }

  let { open, onClose, regulation, filteredParts, filters }: Props = $props()

  setContext('i18n', i18n)
</script>

<ExportDialog {open} {onClose} {regulation} {filteredParts} {filters} />
