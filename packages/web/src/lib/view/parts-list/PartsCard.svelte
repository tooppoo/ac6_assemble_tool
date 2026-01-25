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
    onselect?: () => void
  }

  let {
    parts,
    isFavorite = false,
    ontogglefavorite,
    onselect,
  }: Props = $props()

  // i18n
  const i18n = getContext<I18NextStore>('i18n')

  const translatedCategory = $derived($i18n.t(`category:${parts.category}`))
  const translatedManufacture = $derived(
    $i18n.t(`manufacture:${parts.manufacture}`),
  )

  const favoriteLabel = $derived.by(() =>
    $i18n.t(
      `page/parts-list:partsCard.favorite.${isFavorite ? 'remove' : 'add'}`,
    ),
  )

  const manufactureLabel = $derived.by(() =>
    $i18n.t('page/parts-list:partsCard.manufacture'),
  )

  const categoryLabel = $derived.by(() =>
    $i18n.t('page/parts-list:partsCard.category'),
  )

  const priceLabel = $derived.by(() =>
    $i18n.t('page/parts-list:partsCard.price'),
  )

  const weightLabel = $derived.by(() =>
    $i18n.t('page/parts-list:partsCard.weight'),
  )

  const enLoadLabel = $derived.by(() =>
    $i18n.t('page/parts-list:partsCard.enLoad'),
  )

  function handleToggleFavorite(event: MouseEvent) {
    event.stopPropagation()
    ontogglefavorite?.()
  }

  function handleCardClick() {
    onselect?.()
  }
</script>

<Card class="parts-card h-100" onclick={handleCardClick}>
  <CardBody class="d-flex flex-column">
    <div class="d-flex justify-content-between align-items-start mb-2">
      <CardTitle class="mb-0 flex-grow-1">
        {parts.name}
      </CardTitle>
      <Button
        color={isFavorite ? 'warning' : 'outline-secondary'}
        size="sm"
        class="ms-2 favorite-button"
        onclick={handleToggleFavorite}
        aria-label={favoriteLabel}
        aria-pressed={isFavorite}
      >
        {isFavorite ? '★' : '☆'}
      </Button>
    </div>

    <CardText class="flex-grow-1">
      <small class="text-muted d-block mb-1">
        <strong>{manufactureLabel}:</strong>
        {translatedManufacture}
      </small>
      <small class="text-muted d-block mb-1">
        <strong>{categoryLabel}:</strong>
        {translatedCategory}
      </small>
    </CardText>

    <div class="mt-auto">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <small class="text-muted">{priceLabel}:</small>
        <small><strong>{parts.price.toLocaleString()}</strong></small>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-1">
        <small class="text-muted">{weightLabel}:</small>
        <small><strong>{parts.weight.toLocaleString()}</strong></small>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">{enLoadLabel}:</small>
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
