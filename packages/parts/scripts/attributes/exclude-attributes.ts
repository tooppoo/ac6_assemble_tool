import { branch } from 'ceiocs'

import type { ACParts } from "../../src/types/base/types"

export type ACPartsAttribute = Readonly<{
  attributeName: string
  optional: boolean
}> & Readonly<
  | {
    valueType: 'numeric' | 'literal'
    candidates: []
  }
  | {
    valueType: 'array'
    candidates: string[]
  }
>
type InnerValueType = 'numeric' | 'array'
/**
 * numeric: 以下/以上など、数値比較でのフィルタが可能な属性. ソート可能
 * literal: 一定の値で固定された文字列で、フィルタ不可(head.categoryなど). ソート可能
 * array: 候補の中から選択してフィルタ可能な属性. ソート可能(個々のパーツの属性値でソート)
 */
type ValueType = 'numeric' | 'array' | 'literal'

export function excludeAttributes(parts: readonly ACParts[]): readonly ACPartsAttribute[] {
  const attributesScores = new Map<string, { count: number, valueType: InnerValueType }>()
  const arrayCandidates = new Map<string, string[]>()
  // 属性ごとに登場回数をカウント + 値の型を保存
  // 同じ属性でもパーツによって値の型が変わることはない
  forParts(parts, (attributeName, part) => {
    // IDと名前は固有の方法でソート・フィルタを提供するので除外
    // classificationはslot選択時点で固定されるため除外
    if (attributeName === 'id' || attributeName === 'name' || attributeName === 'classification') {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (part as any)[attributeName]

    const storedScore = attributesScores.get(attributeName)
    const valueType: InnerValueType = typeof value === 'number' ? 'numeric' : 'array'
    attributesScores.set(
      attributeName,
      {
        count: storedScore ? storedScore.count + 1 : 1,
        valueType,
      }
    )

    const storedCandidates = arrayCandidates.get(attributeName)
    arrayCandidates.set(attributeName, [...storedCandidates ?? [], value])
  })

  const result: ACPartsAttribute[] = []
  attributesScores.forEach((score, attributeName) => {
    const candidates = Array.from(new Set(arrayCandidates.get(attributeName) ?? []))
    // 値が文字列だったとしても、候補が1以下しかないならliteralとして扱う
    const valueType = branch
      .if<ValueType>(score.valueType === 'numeric', 'numeric')
      .else(() => candidates.length > 1 ? 'array' : 'literal')

    if (valueType === 'array') {
      result.push({
        attributeName,
        valueType,
        candidates,
        // 属性の登場回数がパーツ数より少ない = 属性を持たないパーツがある = optional
        optional: score.count < parts.length,
      })
    }
    else {
      result.push({
        attributeName,
        valueType,
        candidates: [],
        // 属性の登場回数がパーツ数より少ない = 属性を持たないパーツがある = optional
        optional: score.count < parts.length,
      })
    }
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
