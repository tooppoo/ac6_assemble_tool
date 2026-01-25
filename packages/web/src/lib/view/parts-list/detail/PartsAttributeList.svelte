<script lang="ts">
  /**
   * PartsAttributeList - パーツの属性リストを表示するコンポーネント
   *
   * 渡された属性定義に基づいて、パーツの属性値をリスト形式で表示します。
   * 値が存在しない属性は表示されません。
   */

  import type { I18NextStore } from '$lib/i18n/define'

  import type { AttributeDefinition } from '@ac6_assemble_tool/parts/attributes-utils'
  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import { getContext } from 'svelte'

  import { translateProperty } from '../filter/filters-application'

  interface Props {
    parts: ACParts
    attributes: readonly AttributeDefinition[]
  }
  let { parts, attributes }: Props = $props()

  const i18n = getContext<I18NextStore>('i18n')

  // 値が存在する属性のみをフィルタ
  const visibleAttributes = $derived(
    attributes.filter((attr) => {
      const value = (parts as Record<string, unknown>)[attr.attributeName]
      return value !== undefined && value !== null
    }),
  )

  function formatValue(attr: AttributeDefinition, value: unknown): string {
    if (attr.valueType === 'numeric' && typeof value === 'number') {
      return value.toLocaleString()
    }
    if (attr.valueType === 'array' && typeof value === 'string') {
      // attack_type, weapon_type などの翻訳
      const ns = getNamespaceForAttribute(attr.attributeName)
      if (ns) {
        return $i18n.t(`${ns}:${value}`)
      }
      return value
    }
    return String(value)
  }

  function getNamespaceForAttribute(attrName: string): string | null {
    switch (attrName) {
      case 'attack_type':
      case 'weapon_type':
      case 'category':
      case 'manufacture':
        return attrName
      default:
        return null
    }
  }
</script>

<dl class="row mb-0 parts-attribute-list">
  {#each visibleAttributes as attr (attr.attributeName)}
    {@const value = (parts as Record<string, unknown>)[attr.attributeName]}
    <dt
      class="col-6 text-truncate"
      title={translateProperty(attr.attributeName, $i18n)}
    >
      {translateProperty(attr.attributeName, $i18n)}
    </dt>
    <dd class="col-6 text-end">
      {formatValue(attr, value)}
    </dd>
  {/each}
</dl>

<style>
  .parts-attribute-list dt {
    font-weight: normal;
    color: var(--bs-secondary);
  }
  .parts-attribute-list dd {
    font-weight: 600;
  }
</style>
