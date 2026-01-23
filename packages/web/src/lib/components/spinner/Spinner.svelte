<script lang="ts">
  /**
   * ローディングスピナーコンポーネント
   *
   * Bootstrapのspinner-borderを使用したローディング表示
   */

  type Props = {
    size?: 'sm' | 'default'
    class?: string
    loadingText?: string
  }

  let { size = 'default', class: className = '', loadingText }: Props = $props()

  const sizeClass = $derived(size === 'sm' ? 'spinner-border-sm' : '')
  const classes = $derived(
    `spinner-border ${sizeClass} ${className}`.trim().replace(/\s+/g, ' '),
  )
</script>

<span class={classes} role="status">
  {#if loadingText}
    <span class="visually-hidden">{loadingText}</span>
  {/if}
</span>
