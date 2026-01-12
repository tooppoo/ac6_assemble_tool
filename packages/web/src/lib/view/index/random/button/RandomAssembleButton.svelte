<script lang="ts">
  import TextButton from '$lib/components/button/TextButton.svelte'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
  import type { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
  import type { RandomAssembly } from '@ac6_assemble_tool/core/assembly/random/random-assembly'
  import { notEquipped } from '@ac6_assemble_tool/parts/types/base/category'
  import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
  import { logger } from '@ac6_assemble_tool/shared/logger'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ClickEvent {
    assembly: Assembly
  }
  export interface ErrorEvent {
    error: Error
  }

  type Props = {
    id: string
    lockedParts: LockedParts
    initialCandidates: Candidates
    candidates: Candidates
    randomAssembly: RandomAssembly
    tooltipText?: string
    onclick?: (event: ClickEvent) => void
    onerror?: (error: ErrorEvent) => void
    children?: Snippet
  } & Omit<HTMLAttributes<HTMLButtonElement>, 'onclick' | 'onerror'>

  let {
    id,
    lockedParts,
    initialCandidates,
    candidates,
    randomAssembly,
    tooltipText = '',
    onclick,
    onerror,
    children,
    ...rest
  }: Props = $props()

  // handler
  const onRandom = () => {
    try {
      logger.debug('on random', { lockedParts, booster: candidates.booster })
      const actualCandidates =
        !lockedParts.isLocking('legs') &&
        candidates.booster.length === 1 &&
        candidates.booster[0].category === notEquipped
          ? // 脚部がロックされていないのに候補が未装備のみなら、たまたまタンク脚が選択されているだけなので
            // ランダムアセン時にブースターを制限する必要は無い
            // この処置が必要になるのはランダムアセン時のみなので、filterの処理には含めない
            { ...candidates, booster: initialCandidates.booster }
          : candidates

      onclick?.({
        assembly: randomAssembly.assemble(actualCandidates, { lockedParts }),
      })
    } catch (error) {
      logger.error(`[RandomAssembleButton] error onRandom`, {
        error: error instanceof Error ? error.message : error,
      })

      onerror?.({
        error: error instanceof Error ? error : new Error(`${error}`),
      })
    }
  }
</script>

<TextButton {id} type="button" {tooltipText} onclick={onRandom} {...rest}>
  <i class="bi bi-shuffle"></i>
  <span class="d-none d-md-inline">
    {@render children?.()}
  </span>
</TextButton>
