# パーツリストexport機能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** パーツリストページ（`packages/web/src/routes/parts-list`）に、パーツデータをJSON/CSVでexportする機能を追加する。対象は「全体（zip、カテゴリ分割）」「特定カテゴリ（単体ファイル）」「表示中/filtered（単体ファイル）」の3種類。

**Architecture:** データ整形・シリアライズ・zip生成・ダウンロードのコアロジックをSvelte非依存の純粋関数群として`packages/web/src/lib/export/parts-export.ts`に実装し、単体テストする。UIは`@sveltestrap/sveltestrap`のModalを使った`ExportDialog.svelte`として実装し、`PartsListView.svelte`にExportボタンから起動する形で統合する。

**Tech Stack:** SvelteKit 2 / Svelte 5 (runes), TypeScript, vitest + `@testing-library/svelte`, `@sveltestrap/sveltestrap`（モーダル）, 新規依存: `jszip`（zip生成）, `papaparse`（CSV生成）, `@types/papaparse`（devDependency）。

参照元設計ドキュメント: [docs/adr/20260714-parts-list-export.md](../../adr/20260714-parts-list-export.md)

## Global Constraints

- テストランナーは vitest。テストファイルの拡張子は `*.spec.ts`（`*.test.ts` ではない）。既存パターンに合わせること
- Svelteコンポーネントのテストは `@testing-library/svelte` を使い、Svelte 5のprops型を満たすために `<Component>.test-wrapper.svelte` というラッパーコンポーネントを用意し、そこに `setContext('i18n', i18n)` でi18nコンテキストを注入する（`packages/web/src/lib/view/parts-list/sort/SortControl.test-wrapper.svelte` を参考にすること）
- 新規依存 `jszip` / `papaparse` / `@types/papaparse` の追加は、CLAUDE.mdの方針上、tech-architectエージェントのレビューを経ること。`docs/checklist/add-dependency.md` は現状リポジトリに存在しないため、その旨をtech-architectエージェントに伝えて判断を仰ぐこと
- i18n文言は `packages/web/src/lib/i18n/locales/ja/pages/parts-list.ts` と `packages/web/src/lib/i18n/locales/en/pages/parts-list.ts` の両方に追加する（片方だけの追加は不可）。参照は `page/parts-list:export.*` 名前空間
- typecheckは `pnpm web check-types`、lintは `pnpm web lint`、テストは `pnpm web test`（すべてリポジトリルートから実行）
- ファイル名にはレギュレーションバージョン（`regulation.version`、例: `v1.09.1`）を含める。全体exportは常にzip（`.zip`拡張子）、特定カテゴリ・表示中exportは単体ファイル（`.json`または`.csv`）
- JSON出力は `{ regulation: string, filter: string[], data: ACParts[] }` の形。`filter`は「表示中(filtered)」export時のみ中身を持ち、それ以外は空配列。CSV出力にはメタデータを含めず、パーツデータのみをフラット化して出力する

---

## File Structure

```
packages/web/src/lib/export/
  parts-export.ts          # Create: コアロジック（Svelte非依存の純粋関数群）
  parts-export.spec.ts     # Create: 上記の単体テスト

packages/web/src/lib/view/parts-list/export/
  ExportDialog.svelte           # Create: exportダイアログ本体
  ExportDialog.test-wrapper.svelte  # Create: テスト用ラッパー
  ExportDialog.spec.ts          # Create: ダイアログのコンポーネントテスト

packages/web/src/lib/i18n/locales/ja/pages/parts-list.ts  # Modify: export用文言追加
packages/web/src/lib/i18n/locales/en/pages/parts-list.ts  # Modify: export用文言追加

packages/web/src/lib/view/parts-list/PartsListView.svelte  # Modify: Exportボタン・ダイアログ統合

packages/web/package.json  # Modify: jszip, papaparse, @types/papaparse 追加
```

---

### Task 1: 依存追加（jszip, papaparse）

**Files:**
- Modify: `packages/web/package.json`

**Interfaces:**
- Produces: `jszip`（default export `JSZip`）, `papaparse`（default export `Papa`、`Papa.unparse(data): string`）が以降のタスクから利用可能になる

- [ ] **Step 1: tech-architectエージェントにレビューを依頼する**

Agentツールで `tech-architect` エージェントを呼び出し、以下を伝える:
「`packages/web` に `jszip`（zip生成）と `papaparse`（CSV生成、devDependencyとして `@types/papaparse` も）を新規依存として追加したい。パーツデータexport機能（zip分割ダウンロード、CSV変換）に使う。`docs/checklist/add-dependency.md` がリポジトリに存在しないため、そのままpnpm addしてよいか判断してほしい」

エージェントの回答を確認し、承認が得られたらStep 2に進む。懸念が示された場合はその場で解決してから進める。

- [ ] **Step 2: 依存をインストールする**

Run:
```bash
pnpm --filter @ac6_assemble_tool/web add jszip papaparse
pnpm --filter @ac6_assemble_tool/web add -D @types/papaparse
```

- [ ] **Step 3: インストール結果を確認する**

Run: `cat packages/web/package.json`
Expected: `dependencies` に `jszip` と `papaparse`、`devDependencies` に `@types/papaparse` が追加されている

- [ ] **Step 4: 型チェックが壊れていないことを確認する**

Run: `pnpm web check-types`
Expected: エラーなく終了する

- [ ] **Step 5: Commit**

```bash
git add packages/web/package.json pnpm-lock.yaml
git commit -m "chore(web): add jszip and papaparse for parts export feature"
```

---

### Task 2: `flattenRegulation` / `groupByCategory`

**Files:**
- Create: `packages/web/src/lib/export/parts-export.ts`
- Create: `packages/web/src/lib/export/parts-export.spec.ts`

**Interfaces:**
- Consumes: `Regulation`（`@ac6_assemble_tool/parts/versions/regulation.types`）, `ACParts`（`@ac6_assemble_tool/parts/types/base/types`）, `Category`（`@ac6_assemble_tool/parts/types/base/category`）, `CANDIDATES_KEYS` / `excludeNotEquipped`（`@ac6_assemble_tool/parts/types/candidates`）, `latest as regulation`（`$lib/regulation`、テスト用フィクスチャ）
- Produces:
  - `flattenRegulation(regulation: Regulation): ACParts[]`
  - `groupByCategory(parts: readonly ACParts[]): Map<Category, ACParts[]>`

`Regulation.candidates` はスロット単位（`rightArmUnit` / `leftArmUnit` / `rightBackUnit` / `leftBackUnit` / `head` / `core` / `arms` / `legs` / `booster` / `fcs` / `generator` / `expansion`）で管理されており、同じパーツが複数スロット配列に重複して現れる（例: 腕武器は `rightArmUnit` と `leftArmUnit` と `rightBackUnit` の両方に登場しうる）。`flattenRegulation` は `id` でユニーク化し、`excludeNotEquipped` でUI上の「未装備」プレースホルダーを除外する。

- [ ] **Step 1: 失敗するテストを書く**

`packages/web/src/lib/export/parts-export.spec.ts`:

```ts
import { latest as regulation } from '$lib/regulation'

import { notEquipped } from '@ac6_assemble_tool/parts/types/base/classification'
import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import { describe, expect, it } from 'vitest'

import { flattenRegulation, groupByCategory } from './parts-export'

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

    expect(
      result.every((part) => part.classification !== notEquipped),
    ).toBe(true)
  })
})

describe(groupByCategory.name, () => {
  it('カテゴリごとにパーツをグルーピングする', () => {
    const parts = [
      makePart({ id: '1', category: 'head' }),
      makePart({ id: '2', category: 'core' }),
      makePart({ id: '3', category: 'head' }),
    ]

    const grouped = groupByCategory(parts)

    expect(grouped.get('head')?.map((part) => part.id)).toEqual(['1', '3'])
    expect(grouped.get('core')?.map((part) => part.id)).toEqual(['2'])
    expect(grouped.size).toBe(2)
  })

  it('空配列に対しては空のMapを返す', () => {
    expect(groupByCategory([]).size).toBe(0)
  })
})
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `pnpm web test -- parts-export.spec.ts`
Expected: FAIL（`./parts-export` が存在しない）

- [ ] **Step 3: 最小実装を書く**

`packages/web/src/lib/export/parts-export.ts`:

```ts
import type { Category } from '@ac6_assemble_tool/parts/types/base/category'
import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import {
  CANDIDATES_KEYS,
  excludeNotEquipped,
} from '@ac6_assemble_tool/parts/types/candidates'
import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'

export function flattenRegulation(regulation: Regulation): ACParts[] {
  const uniqueParts = new Map<string, ACParts>()

  for (const key of CANDIDATES_KEYS) {
    const candidates = regulation.candidates[key] as readonly ACParts[]
    const equipped = excludeNotEquipped(candidates)

    for (const part of equipped) {
      uniqueParts.set(part.id, part)
    }
  }

  return [...uniqueParts.values()]
}

export function groupByCategory(
  parts: readonly ACParts[],
): Map<Category, ACParts[]> {
  const grouped = new Map<Category, ACParts[]>()

  for (const part of parts) {
    const list = grouped.get(part.category) ?? []
    list.push(part)
    grouped.set(part.category, list)
  }

  return grouped
}
```

- [ ] **Step 4: テストを実行し成功を確認する**

Run: `pnpm web test -- parts-export.spec.ts`
Expected: PASS（4 tests）

- [ ] **Step 5: Commit**

```bash
git add packages/web/src/lib/export/parts-export.ts packages/web/src/lib/export/parts-export.spec.ts
git commit -m "feat(web): add flattenRegulation and groupByCategory for parts export"
```

---

### Task 3: `toJson`

**Files:**
- Modify: `packages/web/src/lib/export/parts-export.ts`
- Modify: `packages/web/src/lib/export/parts-export.spec.ts`

**Interfaces:**
- Consumes: `ACParts`（Task 2）
- Produces:
  - `type ExportMeta = Readonly<{ regulation: string; filter: readonly string[] }>`
  - `toJson(parts: readonly ACParts[], meta: ExportMeta): string`

- [ ] **Step 1: 失敗するテストを追加する**

`parts-export.spec.ts` に追加（既存の `makePart` ヘルパーを再利用）:

```ts
import { toJson } from './parts-export'

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
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `pnpm web test -- parts-export.spec.ts`
Expected: FAIL（`toJson` が存在しない）

- [ ] **Step 3: 実装を追加する**

`parts-export.ts` に追加:

```ts
export type ExportMeta = Readonly<{
  regulation: string
  filter: readonly string[]
}>

export function toJson(
  parts: readonly ACParts[],
  meta: ExportMeta,
): string {
  return JSON.stringify(
    {
      regulation: meta.regulation,
      filter: meta.filter,
      data: parts,
    },
    null,
    2,
  )
}
```

- [ ] **Step 4: テストを実行し成功を確認する**

Run: `pnpm web test -- parts-export.spec.ts`
Expected: PASS（6 tests）

- [ ] **Step 5: Commit**

```bash
git add packages/web/src/lib/export/parts-export.ts packages/web/src/lib/export/parts-export.spec.ts
git commit -m "feat(web): add toJson for parts export with regulation/filter metadata"
```

---

### Task 4: `toCsv`

**Files:**
- Modify: `packages/web/src/lib/export/parts-export.ts`
- Modify: `packages/web/src/lib/export/parts-export.spec.ts`

**Interfaces:**
- Consumes: `ACParts`, `papaparse`（`Papa.unparse`）
- Produces: `toCsv(parts: readonly ACParts[]): string`

配列フィールド（例: `ai_tags: readonly string[]`）やオブジェクト型のカテゴリ固有ステータスは、CSVの1セルに収めるためにフラット化する（配列は `;` 区切り文字列に、オブジェクトはJSON文字列に変換）。

- [ ] **Step 1: 失敗するテストを追加する**

```ts
import { toCsv } from './parts-export'

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
})
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `pnpm web test -- parts-export.spec.ts`
Expected: FAIL（`toCsv` が存在しない）

- [ ] **Step 3: 実装を追加する**

`parts-export.ts` の先頭に import を追加し、実装を追加:

```ts
import Papa from 'papaparse'

// ...(既存のimportの後、他の関数の前後どこでもよい)

function flattenCsvValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(';')
  }
  if (value !== null && typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function flattenPartForCsv(part: ACParts): Record<string, string> {
  return Object.fromEntries(
    Object.entries(part).map(([key, value]) => [
      key,
      flattenCsvValue(value),
    ]),
  )
}

export function toCsv(parts: readonly ACParts[]): string {
  if (parts.length === 0) {
    return ''
  }

  const rows = parts.map(flattenPartForCsv)
  return Papa.unparse(rows)
}
```

- [ ] **Step 4: テストを実行し成功を確認する**

Run: `pnpm web test -- parts-export.spec.ts`
Expected: PASS（9 tests）

- [ ] **Step 5: Commit**

```bash
git add packages/web/src/lib/export/parts-export.ts packages/web/src/lib/export/parts-export.spec.ts
git commit -m "feat(web): add toCsv for parts export with flattened array/object fields"
```

---

### Task 5: `buildZip`

**Files:**
- Modify: `packages/web/src/lib/export/parts-export.ts`
- Modify: `packages/web/src/lib/export/parts-export.spec.ts`

**Interfaces:**
- Consumes: `groupByCategory`（Task 2）, `toJson`（Task 3）, `toCsv`（Task 4）, `ExportMeta`（Task 3）, `jszip`
- Produces: `type ExportFormat = 'json' | 'csv'`, `buildZip(groupedParts: Map<Category, ACParts[]>, format: ExportFormat, meta: ExportMeta): Promise<Blob>`

zip内のファイル名は `<category>-<meta.regulation>.<format>`。

- [ ] **Step 1: 失敗するテストを追加する**

```ts
import JSZip from 'jszip'

import { buildZip, groupByCategory } from './parts-export'

describe(buildZip.name, () => {
  it('カテゴリごとにJSONファイルへ分割したzipを生成する', async () => {
    const grouped = groupByCategory([
      makePart({ id: '1', category: 'head' }),
      makePart({ id: '2', category: 'core' }),
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
    const grouped = groupByCategory([makePart({ id: '1', category: 'head' })])

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
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `pnpm web test -- parts-export.spec.ts`
Expected: FAIL（`buildZip` が存在しない）

- [ ] **Step 3: 実装を追加する**

`parts-export.ts` に追加:

```ts
import JSZip from 'jszip'

export type ExportFormat = 'json' | 'csv'

export async function buildZip(
  groupedParts: Map<Category, ACParts[]>,
  format: ExportFormat,
  meta: ExportMeta,
): Promise<Blob> {
  const zip = new JSZip()

  for (const [category, parts] of groupedParts) {
    const filename = `${category}-${meta.regulation}.${format}`
    const content = format === 'json' ? toJson(parts, meta) : toCsv(parts)
    zip.file(filename, content)
  }

  return zip.generateAsync({ type: 'blob' })
}
```

- [ ] **Step 4: テストを実行し成功を確認する**

Run: `pnpm web test -- parts-export.spec.ts`
Expected: PASS（11 tests）

- [ ] **Step 5: Commit**

```bash
git add packages/web/src/lib/export/parts-export.ts packages/web/src/lib/export/parts-export.spec.ts
git commit -m "feat(web): add buildZip for category-split parts export"
```

---

### Task 6: `buildExportFilename` / `buildFileBlob` / `downloadBlob`

**Files:**
- Modify: `packages/web/src/lib/export/parts-export.ts`
- Modify: `packages/web/src/lib/export/parts-export.spec.ts`

**Interfaces:**
- Consumes: `ExportFormat`（Task 5）, `Category`
- Produces:
  - `type ExportTarget = 'all' | 'category' | 'filtered'`
  - `buildExportFilename(target: ExportTarget, format: ExportFormat, version: string, category?: Category): string`
  - `buildFileBlob(content: string, format: ExportFormat): Blob`
  - `downloadBlob(blob: Blob, filename: string): void`

- [ ] **Step 1: 失敗するテストを追加する**

```ts
import {
  buildExportFilename,
  buildFileBlob,
  downloadBlob,
} from './parts-export'

describe(buildExportFilename.name, () => {
  it('全体exportはac6-parts-all-<version>.zipになる', () => {
    expect(buildExportFilename('all', 'json', 'v1.09.1')).toBe(
      'ac6-parts-all-v1.09.1.zip',
    )
    expect(buildExportFilename('all', 'csv', 'v1.09.1')).toBe(
      'ac6-parts-all-v1.09.1.zip',
    )
  })

  it('特定カテゴリexportはac6-parts-<category>-<version>.<format>になる', () => {
    expect(buildExportFilename('category', 'json', 'v1.09.1', 'head')).toBe(
      'ac6-parts-head-v1.09.1.json',
    )
    expect(buildExportFilename('category', 'csv', 'v1.09.1', 'core')).toBe(
      'ac6-parts-core-v1.09.1.csv',
    )
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
    const createObjectURLSpy = vi
      .fn()
      .mockReturnValue('blob:mock-url')
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
```

`vi` は既存のimport（`import { describe, expect, it, vi } from 'vitest'`）に `vi` を追加すること。

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `pnpm web test -- parts-export.spec.ts`
Expected: FAIL（`buildExportFilename` 等が存在しない）

- [ ] **Step 3: 実装を追加する**

`parts-export.ts` に追加:

```ts
export type ExportTarget = 'all' | 'category' | 'filtered'

export function buildExportFilename(
  target: ExportTarget,
  format: ExportFormat,
  version: string,
  category?: Category,
): string {
  switch (target) {
    case 'all':
      return `ac6-parts-all-${version}.zip`
    case 'category':
      return `ac6-parts-${category}-${version}.${format}`
    case 'filtered':
      return `ac6-parts-filtered-${version}.${format}`
  }
}

export function buildFileBlob(content: string, format: ExportFormat): Blob {
  const type = format === 'json' ? 'application/json' : 'text/csv'
  return new Blob([content], { type })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
```

- [ ] **Step 4: テストを実行し成功を確認する**

Run: `pnpm web test -- parts-export.spec.ts`
Expected: PASS（全テスト、16 tests程度）

- [ ] **Step 5: 型チェックを実行する**

Run: `pnpm web check-types`
Expected: エラーなく終了する

- [ ] **Step 6: Commit**

```bash
git add packages/web/src/lib/export/parts-export.ts packages/web/src/lib/export/parts-export.spec.ts
git commit -m "feat(web): add buildExportFilename, buildFileBlob, downloadBlob for parts export"
```

---

### Task 7: i18n文言の追加

**Files:**
- Modify: `packages/web/src/lib/i18n/locales/ja/pages/parts-list.ts`
- Modify: `packages/web/src/lib/i18n/locales/en/pages/parts-list.ts`

**Interfaces:**
- Produces: `page/parts-list:export.*` 名前空間の翻訳キー（`ExportDialog.svelte` から `$i18n.t('page/parts-list:export.xxx')` の形で参照される）

- [ ] **Step 1: `jaPartsListPage` に `export` キーを追加する**

`packages/web/src/lib/i18n/locales/ja/pages/parts-list.ts` の `aboutSection` の直前（`partsGrid` 等と同階層）に追加:

```ts
  export: {
    button: 'エクスポート',
    title: 'パーツデータのエクスポート',
    target: {
      label: '対象',
      all: '全体',
      category: '特定カテゴリ',
      filtered: '表示中のパーツ',
    },
    category: {
      label: 'カテゴリ',
      placeholder: 'カテゴリを選択',
    },
    format: {
      label: '形式',
      json: 'JSON',
      csv: 'CSV',
    },
    execute: 'ダウンロード',
    cancel: 'キャンセル',
    emptyFiltered: '表示中のパーツがありません',
  },
```

- [ ] **Step 2: `enPartsListPage` に対応する `export` キーを追加する**

`packages/web/src/lib/i18n/locales/en/pages/parts-list.ts` の同じ位置に追加:

```ts
  export: {
    button: 'Export',
    title: 'Export Parts Data',
    target: {
      label: 'Target',
      all: 'All',
      category: 'Specific Category',
      filtered: 'Filtered Parts',
    },
    category: {
      label: 'Category',
      placeholder: 'Select a category',
    },
    format: {
      label: 'Format',
      json: 'JSON',
      csv: 'CSV',
    },
    execute: 'Download',
    cancel: 'Cancel',
    emptyFiltered: 'No parts are currently displayed.',
  },
```

- [ ] **Step 3: 型チェックを実行する**

Run: `pnpm web check-types`
Expected: エラーなく終了する（`as const` オブジェクトのキー不整合があればここで検出される）

- [ ] **Step 4: Commit**

```bash
git add packages/web/src/lib/i18n/locales/ja/pages/parts-list.ts packages/web/src/lib/i18n/locales/en/pages/parts-list.ts
git commit -m "feat(web): add i18n strings for parts export dialog"
```

---

### Task 8: `ExportDialog.svelte`

**Files:**
- Create: `packages/web/src/lib/view/parts-list/export/ExportDialog.svelte`
- Create: `packages/web/src/lib/view/parts-list/export/ExportDialog.test-wrapper.svelte`
- Create: `packages/web/src/lib/view/parts-list/export/ExportDialog.spec.ts`

**Interfaces:**
- Consumes:
  - `flattenRegulation`, `groupByCategory`, `toJson`, `toCsv`, `buildZip`, `buildFileBlob`, `buildExportFilename`, `downloadBlob`, `type ExportFormat`, `type ExportTarget`（`$lib/export/parts-export`, Task 2〜6）
  - `Filter`（`$lib/view/parts-list/filter/filters-core`、`.serialize(): string` を持つ）
  - `Regulation`（`@ac6_assemble_tool/parts/versions/regulation.types`）
  - `ACParts`（`@ac6_assemble_tool/parts/types/base/types`）
  - `Category`（`@ac6_assemble_tool/parts/types/base/category`）
  - `Modal` / `ModalHeader` / `ModalBody` / `ModalFooter`（`@sveltestrap/sveltestrap`。`packages/web/src/lib/components/modal/ErrorModal.svelte` と同じ使い方）
  - `i18n`（`$lib/i18n/define`、`I18NextStore` 型を `getContext('i18n')` で取得）
- Produces: `ExportDialog.svelte` の `Props`:
  ```ts
  interface Props {
    open: boolean
    onClose: () => void
    regulation: Regulation
    filteredParts: readonly ACParts[]
    filters: readonly Filter[]
  }
  ```
  これはTask 9で `PartsListView.svelte` から渡される。

- [ ] **Step 1: 失敗するコンポーネントテストを書く**

`packages/web/src/lib/view/parts-list/export/ExportDialog.test-wrapper.svelte`:

```svelte
<script lang="ts">
  import i18n from '$lib/i18n/define'

  import type { Category } from '@ac6_assemble_tool/parts/types/base/category'
  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
  import { setContext } from 'svelte'

  import type { Filter } from '../filter/filters-core'
  import ExportDialog from './ExportDialog.svelte'

  interface Props {
    open: boolean
    onClose: () => void
    regulation: Regulation
    filteredParts: readonly ACParts[]
    filters: readonly Filter[]
  }

  let { open, onClose, regulation, filteredParts, filters }: Props = $props()

  setContext('i18n', i18n)
</script>

<ExportDialog {open} {onClose} {regulation} {filteredParts} {filters} />
```

`packages/web/src/lib/view/parts-list/export/ExportDialog.spec.ts`:

```ts
import { latest as regulation } from '$lib/regulation'

import { render, screen, fireEvent } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'

import type { Filter } from '../filter/filters-core'
import ExportDialogTestWrapper from './ExportDialog.test-wrapper.svelte'

import * as partsExport from '$lib/export/parts-export'

vi.mock('$lib/export/parts-export', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('$lib/export/parts-export')>()
  return {
    ...actual,
    downloadBlob: vi.fn(),
  }
})

const noFilters: readonly Filter[] = []

describe('ExportDialog', () => {
  it('デフォルトで「表示中」が選択され、カテゴリ選択は表示されない', () => {
    render(ExportDialogTestWrapper, {
      props: {
        open: true,
        onClose: vi.fn(),
        regulation,
        filteredParts: [regulation.candidates.head[0]],
        filters: noFilters,
      },
    })

    const filteredRadio = screen.getByLabelText(
      '表示中のパーツ',
    ) as HTMLInputElement
    expect(filteredRadio.checked).toBe(true)
    expect(screen.queryByLabelText('カテゴリ')).not.toBeInTheDocument()
  })

  it('「特定カテゴリ」選択時はカテゴリ未選択だと実行ボタンが無効', async () => {
    render(ExportDialogTestWrapper, {
      props: {
        open: true,
        onClose: vi.fn(),
        regulation,
        filteredParts: [regulation.candidates.head[0]],
        filters: noFilters,
      },
    })

    await fireEvent.click(screen.getByLabelText('特定カテゴリ'))

    expect(screen.getByLabelText('カテゴリ')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ダウンロード' })).toBeDisabled()
  })

  it('表示中のパーツが空の場合は実行ボタンが無効', () => {
    render(ExportDialogTestWrapper, {
      props: {
        open: true,
        onClose: vi.fn(),
        regulation,
        filteredParts: [],
        filters: noFilters,
      },
    })

    expect(screen.getByRole('button', { name: 'ダウンロード' })).toBeDisabled()
    expect(screen.getByText('表示中のパーツがありません')).toBeInTheDocument()
  })

  it('実行ボタンで表示中パーツのJSONダウンロードがトリガーされる', async () => {
    render(ExportDialogTestWrapper, {
      props: {
        open: true,
        onClose: vi.fn(),
        regulation,
        filteredParts: [regulation.candidates.head[0]],
        filters: noFilters,
      },
    })

    await fireEvent.click(
      screen.getByRole('button', { name: 'ダウンロード' }),
    )

    expect(partsExport.downloadBlob).toHaveBeenCalledWith(
      expect.any(Blob),
      `ac6-parts-filtered-${regulation.version}.json`,
    )
  })
})
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `pnpm web test -- ExportDialog.spec.ts`
Expected: FAIL（`ExportDialog.svelte` が存在しない）

- [ ] **Step 3: `ExportDialog.svelte` を実装する**

`packages/web/src/lib/view/parts-list/export/ExportDialog.svelte`:

```svelte
<script lang="ts">
  import type { I18NextStore } from '$lib/i18n/define'

  import {
    buildExportFilename,
    buildFileBlob,
    buildZip,
    downloadBlob,
    flattenRegulation,
    groupByCategory,
    toCsv,
    toJson,
    type ExportFormat,
    type ExportTarget,
  } from '$lib/export/parts-export'
  import type { Category } from '@ac6_assemble_tool/parts/types/base/category'
  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
  import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from '@sveltestrap/sveltestrap'
  import { getContext } from 'svelte'

  import type { Filter } from '../filter/filters-core'

  interface Props {
    open: boolean
    onClose: () => void
    regulation: Regulation
    filteredParts: readonly ACParts[]
    filters: readonly Filter[]
  }

  let { open, onClose, regulation, filteredParts, filters }: Props = $props()

  const i18n = getContext<I18NextStore>('i18n')

  let target = $state<ExportTarget>('filtered')
  let selectedCategory = $state<Category | ''>('')
  let format = $state<ExportFormat>('json')

  const availableCategories = $derived.by<Category[]>(() => {
    const all = flattenRegulation(regulation)
    return [...new Set(all.map((part) => part.category))].sort()
  })

  const isFilteredEmpty = $derived(filteredParts.length === 0)

  const isExecuteDisabled = $derived(
    (target === 'filtered' && isFilteredEmpty) ||
      (target === 'category' && selectedCategory === ''),
  )

  function handleExport(): void {
    const version = regulation.version

    if (target === 'all') {
      const grouped = groupByCategory(flattenRegulation(regulation))
      buildZip(grouped, format, { regulation: version, filter: [] }).then(
        (blob) => {
          downloadBlob(blob, buildExportFilename('all', format, version))
        },
      )
      return
    }

    if (target === 'category' && selectedCategory !== '') {
      const parts = flattenRegulation(regulation).filter(
        (part) => part.category === selectedCategory,
      )
      const content =
        format === 'json'
          ? toJson(parts, { regulation: version, filter: [] })
          : toCsv(parts)
      downloadBlob(
        buildFileBlob(content, format),
        buildExportFilename('category', format, version, selectedCategory),
      )
      return
    }

    if (target === 'filtered' && !isFilteredEmpty) {
      const content =
        format === 'json'
          ? toJson(filteredParts, {
              regulation: version,
              filter: filters.map((filter) => filter.serialize()),
            })
          : toCsv(filteredParts)
      downloadBlob(
        buildFileBlob(content, format),
        buildExportFilename('filtered', format, version),
      )
    }
  }
</script>

<Modal
  id="export-dialog"
  backdrop="static"
  keyboard={false}
  aria-labelledby="export-dialog-label"
  isOpen={open}
>
  <ModalHeader>
    <h1 class="modal-title fs-5" id="export-dialog-label">
      {$i18n.t('page/parts-list:export.title')}
    </h1>
    <button
      type="button"
      class="btn-close"
      onclick={onClose}
      aria-label="Close"
    ></button>
  </ModalHeader>
  <ModalBody>
    <fieldset class="mb-3">
      <legend class="fs-6">{$i18n.t('page/parts-list:export.target.label')}</legend>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="export-target"
          id="export-target-all"
          value="all"
          bind:group={target}
        />
        <label class="form-check-label" for="export-target-all">
          {$i18n.t('page/parts-list:export.target.all')}
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="export-target"
          id="export-target-category"
          value="category"
          bind:group={target}
        />
        <label class="form-check-label" for="export-target-category">
          {$i18n.t('page/parts-list:export.target.category')}
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="export-target"
          id="export-target-filtered"
          value="filtered"
          bind:group={target}
        />
        <label class="form-check-label" for="export-target-filtered">
          {$i18n.t('page/parts-list:export.target.filtered')}
        </label>
      </div>
    </fieldset>

    {#if target === 'category'}
      <div class="mb-3">
        <label class="form-label" for="export-category-select">
          {$i18n.t('page/parts-list:export.category.label')}
        </label>
        <select
          class="form-select"
          id="export-category-select"
          bind:value={selectedCategory}
        >
          <option value=""
            >{$i18n.t('page/parts-list:export.category.placeholder')}</option
          >
          {#each availableCategories as category (category)}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>
    {/if}

    {#if target === 'filtered' && isFilteredEmpty}
      <p class="text-danger small" role="status" aria-live="polite">
        {$i18n.t('page/parts-list:export.emptyFiltered')}
      </p>
    {/if}

    <fieldset>
      <legend class="fs-6">{$i18n.t('page/parts-list:export.format.label')}</legend>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="export-format"
          id="export-format-json"
          value="json"
          bind:group={format}
        />
        <label class="form-check-label" for="export-format-json">
          {$i18n.t('page/parts-list:export.format.json')}
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="export-format"
          id="export-format-csv"
          value="csv"
          bind:group={format}
        />
        <label class="form-check-label" for="export-format-csv">
          {$i18n.t('page/parts-list:export.format.csv')}
        </label>
      </div>
    </fieldset>
  </ModalBody>
  <ModalFooter>
    <button type="button" class="btn btn-secondary" onclick={onClose}>
      {$i18n.t('page/parts-list:export.cancel')}
    </button>
    <button
      type="button"
      class="btn btn-primary"
      disabled={isExecuteDisabled}
      onclick={handleExport}
    >
      {$i18n.t('page/parts-list:export.execute')}
    </button>
  </ModalFooter>
</Modal>
```

- [ ] **Step 4: テストを実行し成功を確認する**

Run: `pnpm web test -- ExportDialog.spec.ts`
Expected: PASS（4 tests）

- [ ] **Step 5: 型チェックとlintを実行する**

Run: `pnpm web check-types && pnpm web lint`
Expected: エラーなく終了する

- [ ] **Step 6: Commit**

```bash
git add packages/web/src/lib/view/parts-list/export/
git commit -m "feat(web): add ExportDialog component for parts export"
```

---

### Task 9: `PartsListView.svelte` への統合

**Files:**
- Modify: `packages/web/src/lib/view/parts-list/PartsListView.svelte`
- Modify: `packages/web/src/lib/view/parts-list/PartsListView.spec.ts`

**Interfaces:**
- Consumes: `ExportDialog`（Task 8）、既存の `filteredParts`（`PartsListView.svelte:201`）、`filters`（`PartsListView.svelte:96`）、`regulation`（props）

- [ ] **Step 1: 失敗するテストを追加する**

`PartsListView.spec.ts` の既存の `describe('PartsListView コンポーネント', ...)` ブロック内に追加（ファイル末尾付近、他の `it` と同階層）:

```ts
it('Exportボタンでダイアログが開閉できる', async () => {
  render(PartsListViewTestWrapper, {
    props: { regulation },
  })

  expect(
    screen.queryByRole('heading', { name: 'パーツデータのエクスポート' }),
  ).not.toBeInTheDocument()

  await fireEvent.click(screen.getByRole('button', { name: 'エクスポート' }))

  expect(
    screen.getByRole('heading', { name: 'パーツデータのエクスポート' }),
  ).toBeInTheDocument()

  await fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: 'パーツデータのエクスポート' }),
    ).not.toBeInTheDocument(),
  )
})
```

このテストで使う `PartsListViewTestWrapper` と `render`/`screen`/`fireEvent`/`waitFor` は既にファイル冒頭でimport済み（Task着手前に確認すること）。

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `pnpm web test -- PartsListView.spec.ts`
Expected: FAIL（「エクスポート」ボタンが存在しない）

- [ ] **Step 3: `PartsListView.svelte` にExportボタンとダイアログを追加する**

import追加（既存の `import PartsDetailPanel from './detail/PartsDetailPanel.svelte'` の下、`FilterPanel` importの前後、アルファベット順を維持できる位置。既存のimport順は相対パスをアルファベット順に並べているため、`./export/ExportDialog.svelte` は `./detail/...` の後、`./filter/...` の前に入る）:

```ts
  import ExportDialog from './export/ExportDialog.svelte'
```

state追加（`let partsDetailStatus = $state<PartsDetailPanelStatus>(...)` の直後、106行目付近）:

```ts
  let isExportDialogOpen = $state<boolean>(false)
```

テンプレートの452行目手前（既存の「アセンに渡す」ボタンを含む `<div class="py-1 d-flex flex-column align-items-end gap-2">` ブロックの直後、`<div class="py-1"><PartsGrid ...` の直前）に追加:

```svelte
  <div class="py-1 d-flex justify-content-end">
    <button
      class="btn btn-outline-secondary"
      type="button"
      onclick={() => (isExportDialogOpen = true)}
    >
      {$i18n.t('page/parts-list:export.button')}
    </button>
  </div>

  <ExportDialog
    open={isExportDialogOpen}
    onClose={() => (isExportDialogOpen = false)}
    {regulation}
    {filteredParts}
    {filters}
  />
```

- [ ] **Step 4: テストを実行し成功を確認する**

Run: `pnpm web test -- PartsListView.spec.ts`
Expected: PASS（既存テスト全件 + 新規1件）

- [ ] **Step 5: 全体のテスト・型チェック・lintを実行する**

Run:
```bash
pnpm web test
pnpm web check-types
pnpm web lint
```
Expected: すべてエラーなく終了する

- [ ] **Step 6: Commit**

```bash
git add packages/web/src/lib/view/parts-list/PartsListView.svelte packages/web/src/lib/view/parts-list/PartsListView.spec.ts
git commit -m "feat(web): integrate export dialog into parts list view"
```

---

### Task 10: 手動検証

**Files:** なし（動作確認のみ）

- [ ] **Step 1: 開発サーバーを起動する**

Run: `pnpm web dev`

- [ ] **Step 2: ブラウザで `parts-list` ページを開き、Exportボタンからダイアログを開く**

http://localhost:5173/parts-list （ポート番号は起動ログで確認）にアクセスし、「エクスポート」ボタンをクリックしてダイアログが開くことを確認する。

- [ ] **Step 3: 全組み合わせをダウンロードして中身を確認する**

以下の6パターンを実行し、それぞれダウンロードされたファイルを開いて確認する:

1. 対象=全体, 形式=JSON → `ac6-parts-all-<version>.zip` がダウンロードされ、解凍するとカテゴリごとの `.json` ファイルが入っており、各ファイルが `{ regulation, filter: [], data: [...] }` の形になっている
2. 対象=全体, 形式=CSV → 同様にzip内が `.csv` ファイル群になっている
3. 対象=特定カテゴリ（例: head）, 形式=JSON → `ac6-parts-head-<version>.json` がダウンロードされ、`data` がheadカテゴリのパーツのみになっている
4. 対象=特定カテゴリ, 形式=CSV → `ac6-parts-head-<version>.csv` がダウンロードされる
5. 対象=表示中, 形式=JSON → フィルタを1つ適用した状態で実行し、`ac6-parts-filtered-<version>.json` の `filter` 配列に適用したフィルタの `serialize()` 文字列が入っていることを確認する
6. 対象=表示中, 形式=CSV → 同条件でCSVがダウンロードされる

- [ ] **Step 4: エッジケースを確認する**

- 表示中のパーツが0件の状態（例えば該当パーツがなくなるフィルタを適用）でダイアログを開き、「ダウンロード」ボタンが無効化され「表示中のパーツがありません」と表示されることを確認する
- 対象=特定カテゴリでカテゴリ未選択のまま「ダウンロード」ボタンが無効化されていることを確認する

- [ ] **Step 5: 問題がなければ完了を報告する**

問題が見つかった場合は該当タスクに戻って修正し、Step 1からやり直す。
