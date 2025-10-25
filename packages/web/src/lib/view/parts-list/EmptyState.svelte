<script lang="ts">
  /**
   * EmptyState - フィルタ結果0件時の表示コンポーネント
   *
   * フィルタ結果が0件の場合に表示され、ユーザーに
   * 条件緩和を促すメッセージを提供します。
   */

  import { Alert } from '@sveltestrap/sveltestrap'

  // Props
  interface Props {
    message?: string
    suggestion?: string
  }

  let {
    message = 'フィルタ条件に一致するパーツが見つかりませんでした',
    suggestion = 'フィルタ条件を変更するか、別のスロットを選択してみてください',
  }: Props = $props()
</script>

<div class="empty-state text-center py-5">
  <Alert color="info" class="mx-auto" style="max-width: 600px;">
    <h5 class="alert-heading mb-3">
      <i class="bi bi-info-circle me-2"></i>
      {message}
    </h5>
    <p class="mb-0">{suggestion}</p>
  </Alert>

  <div class="mt-4 text-muted">
    <small>
      <strong>ヒント:</strong>
      <ul class="list-unstyled mt-2">
        <li>• フィルタ条件を緩和してみてください</li>
        <li>• 別のスロットを選択してみてください</li>
        <li>• フィルタをクリアして最初からやり直してください</li>
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
