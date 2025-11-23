<script lang="ts">
  import { Offcanvas } from '@sveltestrap/sveltestrap'
  import type { Snippet } from 'svelte'

  export type ToggleOffCanvas = { open: boolean }

  interface Props {
    id?: string
    open: boolean
    title?: Snippet
    body?: Snippet
    onToggle?: (args: { open: boolean }) => void
  }
  let {
    id = '',
    open,
    title,
    body,
    onToggle
  }: Props = $props()

  const toggle = () => {
    onToggle?.({ open: !open })
  }
</script>

<Offcanvas
  {id}
  placement="end"
  backdrop={false}
  scroll={true}
  isOpen={open}
  {toggle}
>
  {@render title?.()}
  {@render body?.()}
</Offcanvas>
