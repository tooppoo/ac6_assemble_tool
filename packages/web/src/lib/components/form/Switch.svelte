<script lang="ts">
  import type { Snippet } from "svelte"

  interface Props {
    id: string
    children?: Snippet
    onEnabled?: (args: { on: true }) => void
    onDisabled?: (args: { on: false }) => void
  }

  let {
    id,
    children,
    onEnabled,
    onDisabled,
  }: Props = $props()

  // handler
  const onChange = (e: Event) => {
    if ((e.target as HTMLInputElement).checked) {
      onEnabled?.({ on: true })
    } else {
      onDisabled?.({ on: false })
    }
  }
</script>

<div class="form-check form-switch">
  <input
    class="form-check-input"
    type="checkbox"
    role="switch"
    {id}
    onchange={onChange}
  />
  <label class="form-check-label" for={id}>
    {@render children?.()}
  </label>
</div>
