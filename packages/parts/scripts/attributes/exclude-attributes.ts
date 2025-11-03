import type { ACParts } from "../../src/types/base/types"

export type ACPartsAttribute = Readonly<{
  attributeName: string
  valueType: ValueType
  optional: boolean
}>
type ValueType = 'numeric' | 'array'

export function excludeAttributes(parts: readonly ACParts[]): readonly ACPartsAttribute[] {
  const attributesScores = new Map<string, { count: number, valueType: ValueType }>()
  // 属性ごとに登場回数をカウント + 値の型を保存
  // 同じ属性でもパーツによって値の型が変わることはない
  forParts(parts, (attributeName, part) => {
    // IDと名前は固有の方法でソート・フィルタを提供するので除外
    if (attributeName === 'id' || attributeName === 'name') {
      return
    }
    const stored = attributesScores.get(attributeName)

    attributesScores.set(
      attributeName,
      {
        count: stored ? stored.count + 1 : 1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        valueType: typeof (part as any)[attributeName] === 'number' ? 'numeric' : 'array',
      }
    )
  })

  const result: ACPartsAttribute[] = []
  attributesScores.forEach((score, attributeName) => {
    result.push({
      attributeName,
      valueType: score.valueType,
      // 属性の登場回数がパーツ数より少ない = 属性を持たないパーツがある = optional
      optional: score.count < parts.length,
    })
  })

  return result
}

function forParts(parts: readonly ACParts[], f: (k: string, p: ACParts) => void): void {
  parts.forEach((part) => {
    Object.keys(part).forEach((attributeName) => {
      f(attributeName, part)
    })
  })
}
