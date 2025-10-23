<script lang="ts">
  /**
   * SlotSelector - スロット選択UIコンポーネント
   *
   * 12種類のスロットを選択可能なボタンとして表示し、
   * スロット切替イベントを親コンポーネントに通知します。
   */

  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import { CANDIDATES_KEYS } from '@ac6_assemble_tool/parts/types/candidates'
  import i18n from '$lib/i18n/define'

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
  {#each CANDIDATES_KEYS as slot}
    <button
      type="button"
      class="slot-button"
      class:active={currentSlot === slot}
      onclick={() => handleSlotClick(slot)}
    >
      {$i18n.t(`assembly:${slot}`)}
    </button>
  {/each}
</div>

<style>
  .slot-selector {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
    padding: 1rem 0;
  }

  .slot-button {
    padding: 0.75rem 1rem;
    border: 2px solid #dee2e6;
    border-radius: 0.375rem;
    background-color: #fff;
    color: #212529;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .slot-button:hover {
    border-color: #0d6efd;
    background-color: #e7f1ff;
  }

  .slot-button.active {
    border-color: #0d6efd;
    background-color: #0d6efd;
    color: #fff;
    font-weight: 600;
  }

  .slot-button:focus {
    outline: 2px solid #0d6efd;
    outline-offset: 2px;
  }

  /* モバイル対応 */
  @media (max-width: 768px) {
    .slot-selector {
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 0.375rem;
    }

    .slot-button {
      padding: 0.625rem 0.75rem;
      font-size: 0.8125rem;
    }
  }
</style>
