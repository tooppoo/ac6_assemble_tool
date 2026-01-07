<script lang="ts">
  /**
   * SlotFilter - 推奨ページ用スロット選択コンポーネント
   *
   * パーツスロットを選択または「未指定」を選択できるUIを提供します。
   */

  import type { I18NextStore } from '$lib/i18n/define'
  import type { SlotType } from '@ac6_assemble_tool/api'
  import { getContext } from 'svelte'

  // i18n
  const i18n = getContext<I18NextStore>('i18n')

  // Props
  interface Props {
    selectedSlot: SlotType | undefined
    onslotchange?: (slot: SlotType | undefined) => void
  }

  let { selectedSlot = $bindable(), onslotchange }: Props = $props()

  // スロット一覧（未指定含む）
  const slots: Array<{ value: SlotType | undefined; key: string }> = [
    { value: 'arm-unit', key: 'arm-unit' },
    { value: 'back-unit', key: 'back-unit' },
    { value: 'head', key: 'head' },
    { value: 'core', key: 'core' },
    { value: 'arms', key: 'arms' },
    { value: 'legs', key: 'legs' },
    { value: 'booster', key: 'booster' },
    { value: 'fcs', key: 'fcs' },
    { value: 'generator', key: 'generator' },
    { value: 'expansion', key: 'expansion' },
  ]

  const label = $derived.by(() => $i18n.t('page/recommendation:slotFilter.label'))

  function handleSlotChange(slot: SlotType | undefined) {
    selectedSlot = slot
    onslotchange?.(slot)
  }
</script>

<div class="slot-filter">
  <label for="slot-select" class="form-label fw-bold">{label}</label>
  <select
    id="slot-select"
    class="form-select form-select-lg"
    value={selectedSlot ?? ''}
    onchange={(e) => {
      const value = e.currentTarget.value
      handleSlotChange(value === '' ? undefined : (value as SlotType))
    }}
  >
    {#each slots as slot (slot.value ?? 'all')}
      <option value={slot.value ?? ''}>
        {slot.key === 'all'
          ? $i18n.t('page/recommendation:slotFilter.all')
          : $i18n.t(`assembly:${slot.key}`)}
      </option>
    {/each}
  </select>
</div>

<style>
  .slot-filter {
    margin-bottom: 1rem;
  }
</style>
