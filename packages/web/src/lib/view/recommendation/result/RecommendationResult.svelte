<script lang="ts">
  /**
   * RecommendationResult - 推奨結果表示コンポーネント
   *
   * AIからの推奨パーツリストを表示します。
   */

  import type { I18NextStore } from '$lib/i18n/define'
  import type { Recommendation } from '@ac6_assemble_tool/api'
  import { getContext } from 'svelte'

  // i18n
  const i18n = getContext<I18NextStore>('i18n')

  // Props
  interface Props {
    answer?: string
    recommendations: Recommendation[]
    loading?: boolean
    error?: string | null
  }

  let { answer, recommendations, loading = false, error = null }: Props = $props()

  const title = $derived.by(() => $i18n.t('page/recommendation:result.title'))
  const loadingText = $derived.by(() =>
    $i18n.t('page/recommendation:result.loading'),
  )
  const emptyText = $derived.by(() =>
    $i18n.t('page/recommendation:result.empty'),
  )
  const errorPrefix = $derived.by(() =>
    $i18n.t('page/recommendation:result.error'),
  )
</script>

<div class="recommendation-result">
  <h3 class="mb-3">{title}</h3>

  {#if loading}
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{loadingText}</span>
      </div>
      <p class="mt-3 text-muted">{loadingText}</p>
    </div>
  {:else if error}
    <div class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {errorPrefix}: {error}
    </div>
  {:else if !answer && recommendations.length === 0}
    <div class="alert alert-info" role="alert">
      <i class="bi bi-info-circle-fill me-2"></i>
      {emptyText}
    </div>
  {:else}
    {#if answer}
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">
            <i class="bi bi-chat-dots me-2"></i>AIの回答
          </h5>
          <p class="card-text ai-answer">{answer}</p>
        </div>
      </div>
    {/if}

    {#if recommendations.length > 0}
      <div class="list-group">
        {#each recommendations as recommendation, index (recommendation.partId)}
          <div class="list-group-item">
            <div class="d-flex w-100 justify-content-between align-items-start">
              <h5 class="mb-1">
                <span class="badge bg-primary me-2">{index + 1}</span>
                {recommendation.partName}
              </h5>
              <span class="badge bg-secondary"
                >{Math.round(recommendation.score * 100)}%</span
              >
            </div>
            <p class="mb-1 mt-2">{recommendation.reason}</p>
            <small class="text-muted">ID: {recommendation.partId}</small>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .recommendation-result {
    margin-top: 2rem;
  }

  .ai-answer {
    white-space: pre-wrap;
    line-height: 1.8;
  }

  .list-group-item {
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
  }
</style>
