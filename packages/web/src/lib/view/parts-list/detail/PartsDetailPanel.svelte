<script lang="ts">
  /**
   * PartsDetailPanel - パーツ詳細情報を表示するサイドパネル
   *
   * 選択されたパーツの全ステータスをOffCanvasパネルで表示します。
   */

  import OffCanvas, {
    type ToggleOffCanvas,
  } from '$lib/components/off-canvas/OffCanvas.svelte'
  import type { I18NextStore } from '$lib/i18n/define'

  import { getAttributesForSlot } from '@ac6_assemble_tool/parts/attributes-utils'
  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import { getContext } from 'svelte'

  import PartsAttributeList from './PartsAttributeList.svelte'

  interface Props {
    id?: string
    open: boolean
    parts: ACParts | null
    slot: CandidatesKey
    onToggle?: (event: ToggleOffCanvas) => void
  }
  let {
    id = 'parts-detail-panel',
    open,
    parts,
    slot,
    onToggle,
  }: Props = $props()

  const i18n = getContext<I18NextStore>('i18n')

  const attributes = $derived(getAttributesForSlot(slot))
  const statsLabel = $derived.by(() =>
    $i18n.t('page/parts-list:partsDetail.stats'),
  )
</script>

<OffCanvas {id} {open} onToggle={(e) => onToggle?.(e)}>
  {#snippet title()}
    {parts?.name ?? ''}
  {/snippet}
  {#snippet body()}
    {#if parts}
      <div class="parts-detail">
        <section>
          <h6 class="border-bottom pb-2">
            {statsLabel}
          </h6>
          <PartsAttributeList {parts} {attributes} />
        </section>
      </div>
    {/if}
  {/snippet}
</OffCanvas>
