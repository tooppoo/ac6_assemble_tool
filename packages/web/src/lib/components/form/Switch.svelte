<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let id: string

  // handler
  const onChange = (e: Event) => {
    if ((e.target as HTMLInputElement).checked) {
      dispatch('enabled', { on: true })
    } else {
      dispatch('disabled', { on: false })
    }
  }

  // setup
  const dispatch = createEventDispatcher<{
    enabled: { on: true }
    disabled: { on: false }
  }>()
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
    <slot></slot>
  </label>
</div>
