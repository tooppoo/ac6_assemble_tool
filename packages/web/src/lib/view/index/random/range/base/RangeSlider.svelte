<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { ChangeEventHandler } from 'svelte/elements'

  export let id: string
  export let label: string

  export let max: number
  export let min: number = 0
  export let value: number
  export let step: number = 1

  const dataList = (() => {
    const range = max - min
    const index = parseInt(`${range}`[0])

    // 最上位の桁を基準に区切りを決める
    const unit = Math.floor(range / index)

    return [...Array(index + 1)].map((_, i) => unit * i + min)
  })()

  const onChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    value = parseInt(ev.currentTarget.value)

    dispatch('change', { value })
  }

  const dispatch = createEventDispatcher<{ change: { value: number } }>()
</script>

<div {id} class={$$props.class}>
  <div class="d-flex align-items-center">
    <label
      for={`${id}-range`}
      class="current-max-value mr-auto input-group input-group-sm"
    >
      <slot name="label" labelId={`${id}-current-max-value`} text={label}>
        <span id={`${id}-current-max-value`} class="input-group-text"
          >{label}</span
        >
      </slot>
      <input
        id={`${id}-current-max-value-form`}
        type="number"
        class="form-control form-control-sm"
        aria-label={label}
        aria-describedby={`${id}-current-max-value`}
        {min}
        {max}
        {value}
        {step}
        on:change={onChange}
      />
    </label>
    <slot name="status"></slot>
  </div>
  <input
    id={`${id}-range`}
    type="range"
    class="form-range w-100"
    {min}
    {max}
    {value}
    {step}
    on:change={onChange}
    list={`${id}-range-mark`}
  />
  <datalist id={`${id}-range-mark`} class="d-sm-block d-md-none w-100">
    {#each dataList as v (v)}
      <option value={v} label={`${v}`}>{v}</option>
    {/each}
  </datalist>
</div>

<style>
  .current-max-value {
    width: 220px;
  }

  datalist {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    writing-mode: vertical-lr;
  }
</style>
