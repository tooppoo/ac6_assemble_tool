<script lang="ts">
  /**
   * PartsCard - 個別パーツ情報を表示するカードコンポーネント
   *
   * パーツの主要情報（名前、分類、メーカー、価格、重量、EN負荷）を
   * カード形式で表示し、お気に入りボタンを提供します。
   */

  import type { I18NextStore } from '$lib/i18n/define'

  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    Button,
  } from '@sveltestrap/sveltestrap'
  import { getContext } from 'svelte'

  // Props
  interface Props {
    parts: ACParts
    isFavorite?: boolean
    ontogglefavorite?: () => void
  }

  let { parts, isFavorite = false, ontogglefavorite }: Props = $props()

  // i18n
  const i18n = getContext<I18NextStore>('i18n')
  const translatedClassification = $derived(
    $i18n.t(parts.classification, { ns: 'classification' }),
  )
  const translatedCategory = $derived(
    $i18n.t(parts.category, { ns: 'category' }),
  )

  function handleToggleFavorite() {
    ontogglefavorite?.()
  }
</script>

<Card class="parts-card h-100">
  <CardBody class="d-flex flex-column">
    <div class="d-flex justify-content-between align-items-start mb-2">
      <CardTitle tag="h6" class="mb-0 flex-grow-1">
        {parts.name}
      </CardTitle>
      <Button
        color={isFavorite ? 'warning' : 'outline-secondary'}
        size="sm"
        class="ms-2 favorite-button"
        onclick={handleToggleFavorite}
        aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
      >
        {isFavorite ? '★' : '☆'}
      </Button>
    </div>

    <CardText class="flex-grow-1">
      <small class="text-muted d-block mb-1">
        <strong>分類:</strong>
        {translatedClassification}
      </small>
      <small class="text-muted d-block mb-1">
        <strong>メーカー:</strong>
        {parts.manufacture}
      </small>
      <small class="text-muted d-block mb-1">
        <strong>カテゴリ:</strong>
        {translatedCategory}
      </small>
    </CardText>

    <div class="mt-auto">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <small class="text-muted">価格:</small>
        <small><strong>{parts.price.toLocaleString()}</strong></small>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-1">
        <small class="text-muted">重量:</small>
        <small><strong>{parts.weight.toLocaleString()}</strong></small>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">EN負荷:</small>
        <small><strong>{parts.en_load.toLocaleString()}</strong></small>
      </div>
    </div>
  </CardBody>
</Card>

<style>
  :global(.parts-card) {
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    cursor: pointer;
  }

  :global(.parts-card:hover) {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  :global(.favorite-button) {
    min-width: 36px;
    padding: 0.25rem 0.5rem;
  }
</style>
