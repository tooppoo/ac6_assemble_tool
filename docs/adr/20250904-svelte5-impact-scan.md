# Svelte v5 移行 影響箇所スキャン（概観）

日時: 2025-09-04

## 概要統計

- `.svelte` ファイル数: 36
- `createEventDispatcher` の出現: 46
- `on:` DOMイベントの出現: 78
- `bind:` の出現: 8
- `svelte:window/body` の出現: 1
- `$store` マジックの出現: 0

## 主な影響箇所（抜粋）

- Dispatcher 利用コンポーネント（コールバック props 置換が必要）
  - packages/web/src/lib/components/off-canvas/OffCanvas.svelte
  - packages/web/src/lib/components/modal/ErrorModal.svelte
  - packages/web/src/lib/view/index/share/ShareAssembly.svelte
  - packages/web/src/lib/view/index/random/RandomAssemblyOffCanvas.svelte
  - packages/web/src/lib/view/index/random/range/base/RangeSlider.svelte
  - packages/web/src/lib/view/index/random/range/CoamRangeSlider.svelte
  - packages/web/src/lib/view/index/random/range/LoadRangeSlider.svelte
  - packages/web/src/lib/view/index/store/StoreAssembly.svelte
  - packages/web/src/lib/view/index/filter/FilterForWholeOffCanvas.svelte
  - packages/web/src/lib/view/index/report/ReportListEditor.svelte
  - packages/web/src/lib/view/index/form/PartsSelectForm.svelte
  - packages/web/src/lib/view/index/form/status/badge/*
  - packages/web/src/lib/view/index/report/ReportListViewer.svelte
  - packages/web/src/lib/view/index/layout/navbar/NavButton.svelte
  - packages/web/src/lib/components/button/(Icon|Text)Button.svelte

- `on:` DOMイベント利用（`onclick` などプロパティ化が必要）
  - packages/web/src/lib/view/index/ 以下の各画面と UI コンポーネント多数
  - packages/web/src/routes/+layout.svelte（`on:load`）
  - packages/web/src/lib/view/index/Index.svelte（`<svelte:window on:popstate>` あり）

- 双方向バインド（`$bindable` 対応が必要）
  - packages/web/src/lib/components/tooltip/ClickToggleTooltip.svelte（`bind:isOpen`）
  - フォーム系: `bind:value` が数箇所（Store/Language/PartsSelect など）

## 優先度提案

1) 共通ボタン/スイッチ/モーダル/オフキャンバス等の基盤UI（利用箇所が多い）
2) ルート画面（Index.svelte）と主要フロー（Store/Filter/Random/Report）
3) range/slider 等の入力コンポーネント
4) 残余の on: → プロパティ化と `$bindable` 置換

## 備考

- `event.detail` 参照が多数。コールバック props へ移行時は「引数化」することで置換容易。
- `$store` マジックの直接使用は見当たらないため、Runes 導入は段階適用で問題なし。

