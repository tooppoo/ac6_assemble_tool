## アセンページ parts pool リファクタ作業チェックリスト

- [x] 現状ロジックの抜き出し範囲を確認（`Index.svelte` のクエリ処理と parts pool 再計算部分）
- [x] プレーンTSモジュール `packages/web/src/lib/view/index/interaction/derive-parts-pool.ts` を新規作成し、`derivePartsPool(search: string, base: Candidates): PartsPoolRestrictions` を実装（副作用なし）
- [x] プレーンTSモジュール `packages/web/src/lib/view/index/interaction/assembly-from-query.ts` を新規作成し、アセンブリ復元・マイグレーションロジックを関数化（副作用なし）
- [x] 既存 `applyPartsPoolRestrictions` を新モジュールから利用する形に整理し、コンポーネントからの直接利用を廃止
- [x] `Index.svelte` の初期化を簡素化：`onMount` 一度だけ `derivePartsPool` → `buildAssembly` を呼び出し、migratedParams があれば `goto` で置換
- [x] `Index.svelte` から `popstate` 監視や parts pool 再同期ロジックを削除（filters 不変仕様を反映）
- [x] リアクティブステートを「候補」「ロック」「アセンブリ」「シリアライズ」に限定し、イベントハンドラ以外の関数を削減
- [x] 単体テストを各新規モジュールと主要ケースに追加（同一ディレクトリ `*.spec.ts`）
- [ ] Lint/型チェック/ユニットテストを実行し、静的生成に影響がないことを確認
- [ ] 変更内容と仕様前提（filters はアセンページで変化しない）を簡潔に記録（必要なら ADR またはコメント）
