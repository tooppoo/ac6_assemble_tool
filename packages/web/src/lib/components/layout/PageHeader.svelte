<script lang="ts">
  import type { Snippet } from 'svelte'

  import LanguageForm from '$lib/components/language/LanguageForm.svelte'

  interface Props {
    class?: string
    title: Snippet
    subtitle?: Snippet
  }
  let { class: className = '', title, subtitle }: Props = $props()

  const classes = $derived(
    ['text-center', className].join(' ').trim().replace(/\s+/g, ' '),
  )
</script>

<div class={classes}>
  <h1>
    {@render title()}
  </h1>
  {#if subtitle}
    <h2>
      {@render subtitle()}
    </h2>
  {/if}
  <div>
    <LanguageForm />
  </div>
</div>
