<script lang="ts">
  /**
   * SlotSelector - スロット選択UIコンポーネント (Bootstrap 5 ベース)
   *
   * 12種類のスロットを選択可能なボタンとして表示し、
   * スロット切替イベントを親コンポーネントに通知します。
   */

  import type { I18NextStore } from '$lib/i18n/define'

  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import { CANDIDATES_KEYS } from '@ac6_assemble_tool/parts/types/candidates'
  import { Button, Collapse } from '@sveltestrap/sveltestrap'
  import { getContext } from 'svelte'

  // i18n
  const i18n = getContext<I18NextStore>('i18n')

  // Props
  interface Props {
    currentSlot: CandidatesKey
    onslotchange?: (event: CustomEvent<{ slot: CandidatesKey }>) => void
  }

  let { currentSlot, onslotchange }: Props = $props()

  // 折りたたみ状態
  let isOpen = $state(true)

  const heading = $derived.by(() =>
    $i18n.t('page/parts-list:slotSelector.title'),
  )

  const toggleLabel = $derived.by(() =>
    $i18n.t(
      `page/parts-list:slotSelector.toggle.${isOpen ? 'collapse' : 'expand'}`,
    ),
  )

  const collapseContentId = 'slot-selector-panel'

  // arm-unit/shoulder-/frame/inner/expansion でグルーピング
  const selectorGroups = [
    [0, 1],
    [2, 3],
    [4, 5, 6, 7],
    [8, 9, 10],
    [11],
  ].reduce(
    (groups, columns) => [...groups, columns.map((i) => CANDIDATES_KEYS[i])],
    [] as CandidatesKey[][],
  )

  // スロット選択ハンドラ
  function handleSlotClick(slot: CandidatesKey) {
    // カスタムイベントを作成して、onslotchange コールバックを呼び出す
    const event = new CustomEvent('slot-change', {
      detail: { slot },
    })
    onslotchange?.(event)
  }

  // 折りたたみトグル
  function toggleCollapse() {
    isOpen = !isOpen
  }
</script>

<div class="card slot-selector-card">
  <div
    class="card-header bg-dark text-white d-flex justify-content-between align-items-center"
  >
    <h5 class="mb-0">{heading}</h5>
    <button
      type="button"
      class="btn btn-sm btn-outline-light"
      onclick={toggleCollapse}
      aria-label={toggleLabel}
      aria-expanded={isOpen}
      aria-controls={collapseContentId}
    >
      {isOpen ? '▲' : '▼'}
    </button>
  </div>

  <Collapse {isOpen}>
    <div class="card-body" id={collapseContentId}>
      {#each selectorGroups as row (row.join('.'))}
        <div class="d-flex flex-wrap gap-2 py-2">
          {#each row as slot (slot)}
            <Button
              color={currentSlot === slot ? 'primary' : 'outline-secondary'}
              size="lg"
              onclick={() => handleSlotClick(slot)}
              class="slot-button px-2"
              type="button"
              aria-pressed={currentSlot === slot}
            >
              {$i18n.t(`assembly:${slot}`)}
            </Button>
          {/each}
        </div>
      {/each}
    </div>
  </Collapse>
</div>
