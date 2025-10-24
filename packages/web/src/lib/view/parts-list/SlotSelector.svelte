<script lang="ts">
  /**
   * SlotSelector - スロット選択UIコンポーネント (Bootstrap 5 ベース)
   *
   * 12種類のスロットを選択可能なボタンとして表示し、
   * スロット切替イベントを親コンポーネントに通知します。
   */

  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import { CANDIDATES_KEYS } from '@ac6_assemble_tool/parts/types/candidates'
  import i18n from '$lib/i18n/define'
  import { Button } from '@sveltestrap/sveltestrap'

  // Props
  interface Props {
    currentSlot: CandidatesKey
    onslotchange?: (event: CustomEvent<{ slot: CandidatesKey }>) => void
  }

  let { currentSlot, onslotchange }: Props = $props()

  // スロット選択ハンドラ
  function handleSlotClick(slot: CandidatesKey) {
    // カスタムイベントを作成して、onslotchange コールバックを呼び出す
    const event = new CustomEvent('slot-change', {
      detail: { slot },
    })
    onslotchange?.(event)
  }
</script>

<div class="slot-selector">
  <div class="d-flex flex-wrap gap-2">
    {#each CANDIDATES_KEYS as slot}
      <Button
        color={currentSlot === slot ? 'primary' : 'outline-secondary'}
        size="sm"
        onclick={() => handleSlotClick(slot)}
        class="slot-button"
      >
        {$i18n.t(`assembly:${slot}`)}
      </Button>
    {/each}
  </div>
</div>

<style>
  .slot-selector {
    padding: 1rem 0;
  }

  :global(.slot-button) {
    min-width: 120px;
    white-space: nowrap;
    font-size: 0.875rem;
  }

  /* モバイル対応 */
  @media (max-width: 768px) {
    :global(.slot-button) {
      min-width: 100px;
      font-size: 0.8125rem;
    }
  }
</style>
