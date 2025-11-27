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
  const max = getMax()
  let value: number = $state(max)

  // handle
  const onChange = (event: { value: number }) => {
    value = event.value

    onchange?.(event)
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
