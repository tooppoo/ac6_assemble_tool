<script lang="ts">
  import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from '@sveltestrap/sveltestrap'
  import type { Snippet } from 'svelte'

  interface Props {
    id: string
    open: boolean
    title?: Snippet
    children?: Snippet
    button?: Snippet
    onClose?: () => void
  }
  let { id, open, title, children, button, onClose }: Props = $props()

  const labelId = `${id}-label`
</script>

<Modal
  {id}
  backdrop="static"
  keyboard={false}
  aria-labelledby={labelId}
  aria-hidden="true"
  isOpen={open}
>
  <ModalHeader>
    <h1 class="modal-title fs-5" id={labelId}>
      {@render title?.()}
    </h1>
    <button type="button" class="btn-close" onclick={onClose} aria-label="Close"
    ></button>
  </ModalHeader>
  <ModalBody>
    {@render children?.()}
  </ModalBody>
  <ModalFooter>
    <button type="button" onclick={onClose} class="btn btn-primary">
      {@render button?.()}
    </button>
  </ModalFooter>
</Modal>
