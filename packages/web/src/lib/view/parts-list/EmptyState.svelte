<script lang="ts">
  /**
   * EmptyState - フィルタ結果0件時の表示コンポーネント
   *
   * フィルタ結果が0件の場合に表示され、ユーザーに
   * 条件緩和を促すメッセージを提供します。
   */

  import type { I18NextStore } from '$lib/i18n/define'

  import { Alert } from '@sveltestrap/sveltestrap'
  import { getContext } from 'svelte'

  // Props
  interface Props {
    message?: string
  }

  const i18n = getContext<I18NextStore>('i18n')

  let { message }: Props = $props()

  const resolvedMessage = $derived.by(
    () =>
      message ??
      $i18n.t('emptyState.message', {
        ns: 'page/parts-list',
      }),
  )

  const hintTitle = $derived.by(() =>
    $i18n.t('emptyState.hintTitle', {
      ns: 'page/parts-list',
    }),
  )

  const hints = $derived.by(
    () =>
      $i18n.t('emptyState.hints', {
        ns: 'page/parts-list',
        returnObjects: true,
      }) as string[],
  )
</script>

<div class="empty-state text-center py-5">
  <Alert
    color="info"
    class="mx-auto"
    style="max-width: 600px;"
    role="status"
    aria-live="polite"
  >
    <h5 class="alert-heading mb-0">
      <i class="bi bi-info-circle me-2"></i>
      {resolvedMessage}
    </h5>
  </Alert>

  <div class="mt-4 text-muted">
    <small>
      <strong>{hintTitle}:</strong>
      <ul class="list-unstyled mt-2">
        {#each hints as hint, index (hint + index)}
          <li>• {hint}</li>
        {/each}
      </ul>
    </small>
  </div>
</div>

<style>
  .empty-state {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
