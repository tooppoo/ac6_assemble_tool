<script lang="ts">
  /**
   * パーツ推奨ページ
   *
   * AIを使って自然言語でパーツを検索・推奨するページ
   */

  import { fetchRecommendations } from '$lib/api/recommend'
  import LanguageForm from '$lib/components/language/LanguageForm.svelte'
  import Navbar from '$lib/components/layout/Navbar.svelte'
  import type { I18NextStore } from '$lib/i18n/define'
  import QueryInput from '$lib/view/recommendation/query/QueryInput.svelte'
  import RecommendationResult from '$lib/view/recommendation/result/RecommendationResult.svelte'
  import SlotFilter from '$lib/view/recommendation/slot/SlotFilter.svelte'

  import type { SlotType, Recommendation } from '@ac6_assemble_tool/api'
  import { logger } from '@ac6_assemble_tool/shared/logger'
  import { Result } from '@praha/byethrow'
  import { getContext } from 'svelte'

  import { PUBLIC_API_ENDPOINT } from '$env/static/public'

  // i18n
  const i18n = getContext<I18NextStore>('i18n')

  // 状態管理
  let selectedSlot = $state<SlotType | undefined>(undefined)
  let query = $state('')
  let answer = $state<string>('')
  let recommendations = $state<Recommendation[]>([])
  let loading = $state(false)
  let error = $state<string | null>(null)

  const pageDescription = $derived.by(() =>
    $i18n.t('page/recommendation:description'),
  )
  const pageDescriptionNote = $derived.by(() =>
    $i18n.t('page/recommendation:descriptionNote'),
  )
  const submitButtonText = $derived.by(() =>
    $i18n.t('page/recommendation:submit'),
  )

  // 推奨リクエストを送信
  async function handleSubmit() {
    if (!query.trim()) {
      error = $i18n.t('page/recommendation:validation.emptyQuery')
      return
    }

    loading = true
    error = null
    answer = ''
    recommendations = []

    logger.info('Submitting recommendation request', {
      query,
      slot: selectedSlot,
    })

    const result = await fetchRecommendations(
      query.trim(),
      selectedSlot,
      PUBLIC_API_ENDPOINT,
    )

    loading = false

    if (Result.isFailure(result)) {
      const err = Result.unwrapError(result)

      if (err instanceof Error) {
        error = err.message
      } else {
        error = $i18n.t('page/recommendation:error.unknown')
      }
      logger.error('Recommendation request failed', { error: err })
    } else {
      const response = Result.unwrap(result)
      answer = response.answer
      recommendations = response.recommendations
      logger.info('Recommendation request succeeded', {
        answerLength: answer.length,
        recommendationCount: recommendations.length,
      })
    }
  }
</script>

<svelte:head>
  <title>AI PARTS RECOMMENDATION | AC6 ASSEMBLE TOOL(UNOFFICIAL)</title>
  <meta name="description" content={pageDescription} />
</svelte:head>

<Navbar>
  <LanguageForm />
</Navbar>

<main class="recommendation-page py-4">
  <div class="container">
    <h1 class="py-2 text-center">
      ARMORED CORE Ⅵ<br class="d-block" />
      AI PARTS RECOMMENDATION(α)
    </h1>

    <p class="text-center text-muted mb-4">
      {pageDescription}
      <br />
      <small class="text-center text-muted">{pageDescriptionNote}</small>
    </p>

    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <form
              onsubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
            >
              <SlotFilter bind:selectedSlot />

              <QueryInput bind:query disabled={loading} />

              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg"
                  disabled={loading || !query.trim()}
                >
                  {#if loading}
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  {/if}
                  {submitButtonText}
                </button>
              </div>
            </form>
          </div>
        </div>

        <RecommendationResult {answer} {recommendations} {loading} {error} />
      </div>
    </div>
  </div>
</main>

<style>
  .recommendation-page {
    min-height: 80vh;
  }

  .card {
    border-radius: 1rem;
  }
</style>
