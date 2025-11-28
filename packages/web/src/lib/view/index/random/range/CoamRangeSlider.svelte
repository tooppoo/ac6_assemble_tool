<script lang="ts">
  import i18n from '$lib/i18n/define'

  import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
  import { sum } from '@ac6_assemble_tool/shared/array'
  import { roundUpByRealPart } from '@ac6_assemble_tool/shared/number'

  import RangeSlider from './base/RangeSlider.svelte'

  interface Props {
    class?: string
    candidates: Candidates
    onchange?: (ev: { value: number }) => void
  }
  let { class: className, candidates, onchange }: Props = $props()

  // state
  let max = $derived(getMax(candidates))
  let value: number = $derived(max)

  // handle
  const onChange = (event: { value: number }) => {
    value = event.value

    onchange?.(event)
  }

  // setup
  function getMax(c: Candidates): number {
    type WithPrice = Readonly<{ price: number }>
    const sortDesc = <T extends WithPrice>(xs: readonly T[]): readonly T[] =>
      xs.toSorted((a: WithPrice, b: WithPrice) => b.price - a.price)

    const total = sum(
      [
        sortDesc(c.rightArmUnit)[0],
        sortDesc(c.leftArmUnit)[0],
        sortDesc(c.rightBackUnit)[0],
        sortDesc(c.leftBackUnit)[0],
        sortDesc(c.head)[0],
        sortDesc(c.core)[0],
        sortDesc(c.arms)[0],
        sortDesc(c.legs)[0],
        sortDesc(c.booster)[0],
        sortDesc(c.fcs)[0],
        sortDesc(c.generator)[0],
      ].map((p) => p.price),
    )

    return roundUpByRealPart(1)(total)
  }
</script>

<RangeSlider
  id="coam"
  class={className}
  label={$i18n.t('random:range.coam.label')}
  {max}
  {value}
  step={1000}
  onchange={onChange}
/>
