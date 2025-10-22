<script lang="ts">
  import { resolve } from '$app/paths'
  import TextButton from '$lib/components/button/TextButton.svelte'

  import { createEventDispatcher } from 'svelte'

  export let id: string = ''
  export let title: string
  export let href: string | null = null
  export let rel: string | undefined = undefined
  export let target: string | undefined = undefined

  const dispatch = createEventDispatcher<{ click: null }>()

  const onClick = () => {
    if (href) {
      return
    }
    dispatch('click')
  }
</script>

{#if href}
  <a
    {id}
    href={resolve(href)}
    rel={rel}
    target={target}
    aria-label={title}
    class={`${$$props.class || ''} btn btn-secondary bg-dark-subtle`}
  >
    <slot name="icon"></slot>
    <slot></slot>
  </a>
{:else}
  <TextButton
    {id}
    class={`${$$props.class || ''}`}
    aria-label={title}
    on:click={onClick}
  >
    <slot name="icon"></slot>
    <slot></slot>
  </TextButton>
{/if}
