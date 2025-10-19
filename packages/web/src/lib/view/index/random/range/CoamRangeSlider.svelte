<script lang="ts">
  import i18n from '$lib/i18n/define'

  import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
  import { sum } from '@ac6_assemble_tool/shared/array'
  import { roundUpByRealPart } from '@ac6_assemble_tool/shared/number'
  import { createEventDispatcher } from 'svelte'

  import RangeSlider from './base/RangeSlider.svelte'

  export let candidates: Candidates

  // state
  const max = getMax()

  let value: number = max

  // handle
  const onChange = ({ detail }: CustomEvent<{ value: number }>) => {
    value = detail.value

    dispatch('change', detail)
  }

  // setup
  function getMax(): number {
    type WithPrice = Readonly<{ price: number }>
    const sortDesc = <T extends WithPrice>(xs: readonly T[]): readonly T[] =>
      xs.toSorted((a: WithPrice, b: WithPrice) => b.price - a.price)

    const total = sum(
      [
        sortDesc(candidates.rightArmUnit)[0],
        sortDesc(candidates.leftArmUnit)[0],
        sortDesc(candidates.rightBackUnit)[0],
        sortDesc(candidates.leftBackUnit)[0],
        sortDesc(candidates.head)[0],
        sortDesc(candidates.core)[0],
        sortDesc(candidates.arms)[0],
        sortDesc(candidates.legs)[0],
        sortDesc(candidates.booster)[0],
        sortDesc(candidates.fcs)[0],
        sortDesc(candidates.generator)[0],
      ].map((p) => p.price),
    )

    return roundUpByRealPart(1)(total)
  }
  const dispatch = createEventDispatcher<{ change: { value: number } }>()
</script>

<RangeSlider
  id="coam"
  class={$$props.class}
  label={$i18n.t('maxCoamLimit', { ns: 'filter' })}
  {max}
  {value}
  step={1000}
  on:change={onChange}
/>
