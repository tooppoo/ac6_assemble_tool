<script lang="ts">
  import { type Snippet } from 'svelte'
  import type { ChangeEventHandler } from 'svelte/elements'

  interface Props {
    id: string
    class?: string
    label: string
    max: number
    min?: number
    value: number
    step?: number
    labelSlot?: Snippet<[{ labelId: string, text: string }]>
    status?: Snippet
    onchange?: (ev: { value: number }) => void
  }
  let {
    id,
    class: className = '',
    label,
    max,
    min = 0,
    value,
    step = 1,
    labelSlot,
    status,
    onchange,
  }: Props = $props()

  let dataList = $derived.by(() => {
    const range = max - min
    const index = parseInt(`${range}`[0])

    // 最上位の桁を基準に区切りを決める
    const unit = Math.floor(range / index)

    return [...Array(index + 1)].map((_, i) => unit * i + min)
  })

  const onChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    value = parseInt(ev.currentTarget.value)

    onchange?.({ value })
  }
</script>

<div {id} class={className}>
  <div class="d-flex align-items-center">
    <label
      for={`${id}-range`}
      class="current-max-value mr-auto input-group input-group-sm"
    >
      {#if labelSlot}
        {@render labelSlot({ labelId: `${id}-current-max-value`, text: label })}
      {:else}
        <span id={`${id}-current-max-value`} class="input-group-text"
          >{label}</span
        >
      {/if}
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
        onchange={onChange}
      />
    </label>
    {@render status?.()}
  </div>
  <input
    id={`${id}-range`}
    type="range"
    class="form-range w-100"
    {min}
    {max}
    {value}
    {step}
    onchange={onChange}
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
