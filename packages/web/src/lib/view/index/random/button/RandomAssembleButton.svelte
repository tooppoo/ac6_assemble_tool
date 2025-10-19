<script lang="ts">
  import TextButton from '$lib/components/button/TextButton.svelte'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
  import type { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
  import type { RandomAssembly } from '@ac6_assemble_tool/core/assembly/random/random-assembly'
  import { notEquipped } from '@ac6_assemble_tool/parts/types/base/category'
  import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
  import { logger } from '@ac6_assemble_tool/shared/logger'
  import { createEventDispatcher } from 'svelte'

  export let id: string
  export let lockedParts: LockedParts
  export let initialCandidates: Candidates
  export let candidates: Candidates
  export let randomAssembly: RandomAssembly
  export let tooltipText: string = ''

  // handler
  const onRandom = () => {
    try {
      logger.debug('on random', lockedParts, candidates.booster)
      const actualCandidates =
        !lockedParts.isLocking('legs') &&
        candidates.booster.length === 1 &&
        candidates.booster[0].category === notEquipped
          ? // 脚部がロックされていないのに候補が未装備のみなら、たまたまタンク脚が選択されているだけなので
            // ランダムアセン時にブースターを制限する必要は無い
            // この処置が必要になるのはランダムアセン時のみなので、filterの処理には含めない
            { ...candidates, booster: initialCandidates.booster }
          : candidates

      dispatch(
        'click',
        randomAssembly.assemble(actualCandidates, { lockedParts }),
      )
    } catch (e) {
      logger.error(e)

      dispatch('error', e instanceof Error ? e : new Error(`${e}`))
    }
  }

  // setup
  const dispatch = createEventDispatcher<{
    click: Assembly
    error: Error
  }>()
</script>

<TextButton
  {id}
  type="button"
  {tooltipText}
  {...$$restProps}
  on:click={onRandom}
>
  <i class="bi bi-shuffle"></i>
  <span class="d-none d-md-inline">
    <slot></slot>
  </span>
</TextButton>
