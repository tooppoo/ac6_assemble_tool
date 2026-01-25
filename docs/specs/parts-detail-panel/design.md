# Technical Design Document

## Overview

### Purpose

パーツ詳細パネル機能は、パーツ一覧ページにおいてパーツの全ステータスをサイドパネル形式で表示する機能を提供する。

### Target Users

- パーツの詳細ステータスを確認したいプレイヤー
- パーツカード上の情報だけでは判断できない属性を確認したいプレイヤー

### Architecture Context

本機能は既存のパーツ一覧ページ（`PartsListView`）に統合され、以下の既存コンポーネント・パターンを再利用する。

- `OffCanvas.svelte` - サイドパネルUIコンポーネント
- `getAttributesForSlot()` - スロットごとの属性定義取得
- `translateProperty()` - 属性名の翻訳

## Goals / Non-Goals

### Goals

- パーツカードクリックで詳細パネルを表示する
- スロットに応じた属性セットを動的に表示する
- 既存のOffCanvasパターンを踏襲する
- お気に入りボタンとの操作競合を防ぐ

### Non-Goals

- パーツ比較機能の実装
- 詳細パネルからの直接アセンブリ操作
- 詳細情報のURL共有

## Architecture

### Component Structure

```
packages/web/src/lib/view/parts-list/
├── controller/
│   └── parts-detail-panel.ts     # パネル状態管理
├── detail/
│   ├── PartsDetailPanel.svelte   # パネル本体
│   └── PartsAttributeList.svelte # 属性リスト表示
├── PartsCard.svelte              # クリックイベント発火
├── PartsGrid.svelte              # イベント伝播
└── PartsListView.svelte          # 状態管理・統合
```

### Data Flow

```
[PartsCard] --onselect--> [PartsGrid] --onselect--> [PartsListView]
                                                          |
                                                          v
                                              [partsDetailStatus state]
                                                          |
                                                          v
                                              [PartsDetailPanel]
                                                          |
                                                          v
                                              [PartsAttributeList]
```

### State Management

#### PartsDetailPanelStatus

パネルの開閉状態と選択中パーツを保持する型。

- `isOpen: boolean` - パネルの開閉状態
- `selectedParts: ACParts | null` - 選択中のパーツ

#### State Functions

- `closePartsDetailPanel()` - パネルを閉じた状態を返す
- `openPartsDetailPanel(parts)` - 指定パーツでパネルを開いた状態を返す

## Implementation Details

### 1. Event Handling

#### PartsCard

- `onselect` propを追加し、カード全体のクリックで発火
- お気に入りボタンでイベント伝播を停止し、詳細パネルが開かないようにする

#### PartsGrid

- `onselect` propを追加し、PartsCardからのイベントを上位へ伝播

#### PartsListView

- パーツ選択時にパネルを開くハンドラ
- パネル閉じるハンドラ
- スロット変更時にパネルを閉じる処理を追加

### 2. Attribute Display

#### 属性セットの取得

`getAttributesForSlot()`を使用してスロットに応じた`AttributeDefinition[]`を取得する。

#### 属性値の表示ルール

- 数値: ロケールに応じたフォーマット
- 配列型（attack_type, weapon_type等）: 対応するi18n名前空間で翻訳
- 値が存在しない属性: 非表示

#### 属性ラベルの翻訳

`translateProperty()`を使用して`assembly:*`名前空間から属性名を翻訳する。snake_caseからcamelCaseへの変換も自動で行われる。

### 3. i18n Keys

`page/parts-list:partsDetail.*`名前空間に以下のキーを追加。

- `stats` - ステータスセクションのラベル

### 4. OffCanvas Integration

既存の`OffCanvas.svelte`コンポーネントを使用。Snippet（`title`と`body`）でコンテンツを注入するパターンを踏襲。

- title: パーツ名
- body: ステータスセクション（属性リスト）

## Testing Strategy

### Unit Tests

- `parts-detail-panel.ts` - 状態管理関数のテスト
- `PartsAttributeList.svelte` - 属性表示のテスト

### Integration Tests

- パーツカードクリック → パネル表示
- お気に入りボタンクリック → パネル非表示
- スロット変更 → パネル自動クローズ

### Manual Testing

1. `/parts-list`ページを開く
2. パーツカードをクリック → サイドパネルがスライドイン
3. ★ボタンをクリック → お気に入りトグルのみ
4. スロットを変更 → パネルが自動で閉じる
5. 異なるカテゴリ（武器、フレーム等）で属性セットが変わることを確認

## File Changes Summary

### New Files

| File | Description |
|------|-------------|
| `controller/parts-detail-panel.ts` | パネル状態管理 |
| `detail/PartsDetailPanel.svelte` | サイドパネル本体 |
| `detail/PartsAttributeList.svelte` | 属性リスト表示 |

### Modified Files

| File | Changes |
|------|---------|
| `PartsCard.svelte` | `onselect` prop追加、★ボタンでstopPropagation |
| `PartsGrid.svelte` | `onselect` prop追加、イベント伝播 |
| `PartsListView.svelte` | 状態管理、ハンドラ、パネル統合 |
| `ja/pages/parts-list.ts` | `partsDetail`翻訳キー追加 |
| `en/pages/parts-list.ts` | `partsDetail`翻訳キー追加 |
