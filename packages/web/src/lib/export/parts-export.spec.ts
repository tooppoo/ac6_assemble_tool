import { latest as regulation } from '$lib/regulation'

import { notEquipped } from '@ac6_assemble_tool/parts/types/base/classification'
import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import JSZip from 'jszip'
import { describe, expect, it, vi } from 'vitest'

import {
  flattenRegulation,
  groupByClassification,
  toJson,
  toCsv,
  buildZip,
  buildExportFilename,
  buildFileBlob,
  downloadBlob,
} from './parts-export'

function makePart(overrides: Partial<ACParts> = {}): ACParts {
  return {
    id: 'id-1',
    name: 'Test Part',
    classification: 'head',
    manufacture: 'test-manufacture',
    category: 'head',
    price: 1000,
    weight: 100,
    en_load: 50,
    ai_summary: 'summary',
    ai_tags: ['tag1'],
    ...overrides,
  } as ACParts
}

describe(flattenRegulation.name, () => {
  it('regulation内の全パーツをidで重複なく返す', () => {
    const result = flattenRegulation(regulation)

    expect(result.length).toBeGreaterThan(0)
    const ids = result.map((part) => part.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('未装備プレースホルダーを含まない', () => {
    const result = flattenRegulation(regulation)

    expect(result.every((part) => part.classification !== notEquipped)).toBe(
      true,
    )
  })
})

describe(groupByClassification.name, () => {
  it('分類ごとにパーツをグルーピングする', () => {
    const parts = [
      makePart({ id: '1', classification: 'head' }),
      makePart({ id: '2', classification: 'core' }),
      makePart({ id: '3', classification: 'head' }),
    ]

    const grouped = groupByClassification(parts)

    expect(grouped.get('head')?.map((part) => part.id)).toEqual(['1', '3'])
    expect(grouped.get('core')?.map((part) => part.id)).toEqual(['2'])
    expect(grouped.size).toBe(2)
  })

  it('空配列に対しては空のMapを返す', () => {
    expect(groupByClassification([]).size).toBe(0)
  })
})

describe(toJson.name, () => {
  it('regulationバージョン・filter条件・パーツデータを含むJSON文字列を返す', () => {
    const parts = [makePart({ id: '1' })]

    const json = toJson(parts, {
      regulation: 'v1.09.1',
      filter: ['numeric:weight:lt:4000'],
    })

    expect(JSON.parse(json)).toEqual({
      regulation: 'v1.09.1',
      filter: ['numeric:weight:lt:4000'],
      data: parts,
    })
  })

  it('filterが空配列の場合も空配列のまま出力する', () => {
    const parts = [makePart({ id: '1' })]

    const json = toJson(parts, { regulation: 'v1.09.1', filter: [] })

    expect(JSON.parse(json).filter).toEqual([])
  })
})

describe(toCsv.name, () => {
  it('パーツ配列をCSV文字列に変換する', () => {
    const parts = [
      makePart({ id: '1', name: 'Part A' }),
      makePart({ id: '2', name: 'Part B' }),
    ]

    const csv = toCsv(parts)
    const lines = csv.trim().split('\n')

    expect(lines).toHaveLength(3) // header + 2 rows
    expect(lines[0]).toContain('id')
    expect(lines[0]).toContain('name')
    expect(csv).toContain('Part A')
    expect(csv).toContain('Part B')
  })

  it('配列フィールドをセミコロン区切り文字列にフラット化する', () => {
    const parts = [makePart({ id: '1', ai_tags: ['tagA', 'tagB'] })]

    const csv = toCsv(parts)

    expect(csv).toContain('tagA;tagB')
  })

  it('空配列に対してはヘッダーのみ、あるいは空文字列を返す', () => {
    expect(toCsv([])).toBe('')
  })

  it('カテゴリが混在していても全行のフィールドを列として保持する', () => {
    const partA = makePart({ id: '1', category: 'head' })
    const partWithExtra = {
      ...makePart({ id: '2', category: 'arms' }),
      arms_only_field: 999,
    } as ACParts

    const csv = toCsv([partA, partWithExtra])
    const lines = csv.trim().split('\n')

    expect(lines[0]).toContain('arms_only_field')
    expect(csv).toContain('999')
  })
})

describe(buildZip.name, () => {
  it('分類ごとにJSONファイルへ分割したzipを生成する', async () => {
    const grouped = groupByClassification([
      makePart({ id: '1', classification: 'head' }),
      makePart({ id: '2', classification: 'core' }),
    ])

    const blob = await buildZip(grouped, 'json', {
      regulation: 'v1.09.1',
      filter: [],
    })
    const zip = await JSZip.loadAsync(blob)

    expect(Object.keys(zip.files).sort()).toEqual([
      'core-v1.09.1.json',
      'head-v1.09.1.json',
    ])

    const headContent = await zip.files['head-v1.09.1.json'].async('string')
    expect(JSON.parse(headContent).data[0].id).toBe('1')
  })

  it('format=csvの場合はcsv拡張子のファイルを生成する', async () => {
    const grouped = groupByClassification([
      makePart({ id: '1', classification: 'head' }),
    ])

    const blob = await buildZip(grouped, 'csv', {
      regulation: 'v1.09.1',
      filter: [],
    })
    const zip = await JSZip.loadAsync(blob)

    expect(Object.keys(zip.files)).toEqual(['head-v1.09.1.csv'])
    const content = await zip.files['head-v1.09.1.csv'].async('string')
    expect(content).toContain('id')
  })
})

describe(buildExportFilename.name, () => {
  it('全体exportはac6-parts-all-<version>.zipになる', () => {
    expect(buildExportFilename('all', 'json', 'v1.09.1')).toBe(
      'ac6-parts-all-v1.09.1.zip',
    )
    expect(buildExportFilename('all', 'csv', 'v1.09.1')).toBe(
      'ac6-parts-all-v1.09.1.zip',
    )
  })

  it('特定分類exportはac6-parts-<classification>-<version>.<format>になる', () => {
    expect(
      buildExportFilename('classification', 'json', 'v1.09.1', 'head'),
    ).toBe('ac6-parts-head-v1.09.1.json')
    expect(
      buildExportFilename('classification', 'csv', 'v1.09.1', 'core'),
    ).toBe('ac6-parts-core-v1.09.1.csv')
  })

  it('表示中exportはac6-parts-filtered-<version>.<format>になる', () => {
    expect(buildExportFilename('filtered', 'json', 'v1.09.1')).toBe(
      'ac6-parts-filtered-v1.09.1.json',
    )
  })
})

describe(buildFileBlob.name, () => {
  it('formatに応じたmime typeのBlobを生成する', () => {
    expect(buildFileBlob('{}', 'json').type).toBe('application/json')
    expect(buildFileBlob('a,b', 'csv').type).toBe('text/csv')
  })
})

describe(downloadBlob.name, () => {
  it('anchor要素を生成してダウンロードをトリガーする', () => {
    const clickSpy = vi.fn()
    const anchor = {
      href: '',
      download: '',
      click: clickSpy,
    } as unknown as HTMLAnchorElement
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(anchor)
    const createObjectURLSpy = vi.fn().mockReturnValue('blob:mock-url')
    const revokeObjectURLSpy = vi.fn()
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: createObjectURLSpy,
      revokeObjectURL: revokeObjectURLSpy,
    })

    downloadBlob(new Blob(['test']), 'test.json')

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(anchor.href).toBe('blob:mock-url')
    expect(anchor.download).toBe('test.json')
    expect(clickSpy).toHaveBeenCalledOnce()
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url')

    createElementSpy.mockRestore()
    vi.unstubAllGlobals()
  })
})
