<script lang="ts">
  import TextButton from '$lib/components/button/TextButton.svelte'

  import type { Snippet } from 'svelte'

  interface Props {
    id: string
    class?: string
    title: string
    href?: string
    rel?: string
    target?: string
    icon?: Snippet
    children?: Snippet
    onclick?: () => void
  }

  let {
    id,
    class: className = '',
    title,
    href,
    rel,
    target,
    onclick,
    icon,
    children,
  }: Props = $props()

  const onClick = () => {
    if (href) {
      return
    }
    onclick?.()
  }
</script>

{#if href}
  <a
    {id}
    {href}
    {rel}
    {target}
    aria-label={title}
    class={`${className} btn btn-secondary bg-dark-subtle`}
  >
    {@render icon?.()}
    {@render children?.()}
  </a>
{:else}
  <TextButton {id} class={`${className}`} aria-label={title} onclick={onClick}>
    {@render icon?.()}
    {@render children?.()}
  </TextButton>
{/if}
