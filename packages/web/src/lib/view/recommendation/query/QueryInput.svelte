<script lang="ts">
  /**
   * QueryInput - 質問入力コンポーネント
   *
   * ユーザーがAIに質問するテキストを入力するためのテキストエリアを提供します。
   */

  import type { I18NextStore } from '$lib/i18n/define'
  import { getContext } from 'svelte'

  // i18n
  const i18n = getContext<I18NextStore>('i18n')

  // Props
  interface Props {
    query: string
    disabled?: boolean
    onquerychange?: (query: string) => void
  }

  let { query = $bindable(), disabled = false, onquerychange }: Props = $props()

  const label = $derived.by(() => $i18n.t('page/recommendation:queryInput.label'))
  const placeholder = $derived.by(() =>
    $i18n.t('page/recommendation:queryInput.placeholder'),
  )

  function handleInput(e: Event) {
    const target = e.currentTarget as HTMLTextAreaElement
    query = target.value
    onquerychange?.(query)
  }
</script>

<div class="query-input">
  <label for="query-textarea" class="form-label fw-bold">{label}</label>
  <textarea
    id="query-textarea"
    class="form-control form-control-lg"
    rows="4"
    {placeholder}
    value={query}
    {disabled}
    oninput={handleInput}
  ></textarea>
</div>

<style>
  .query-input {
    margin-bottom: 1rem;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
</style>
