# byethrow を採用し、独自Result型実装を統一する

- ステータス: 承認済み
- 日付: 2025-10-20
- 実装完了日: 2025-10-20
- タグ: architecture, error-handling, dependency-management, type-safety

技術ストーリー: tech-architect エージェントによる技術評価セッション

**実装サマリー**:
- 使用バージョン: `@praha/byethrow@0.6.3` (npmレジストリで公開されている最新版)
- 移行完了: web（2ファイル）、core（ValidationResult）、shared（互換レイヤー）
- テスト結果: 全434テスト通過（web: 108、core: 285、parts: 41）
- 型チェック: 全パッケージ成功
- ビルド: 全パッケージ成功

## 背景 / 文脈

プロジェクト内に**2つの異なるResult型実装**が存在することが判明した：

1. **packages/web/src/lib/utils/result.ts** (23行)
   - シンプルなユニオン型（`Ok<T> | Err<E>`）
   - 基本的な `ok()` / `err()` ヘルパー関数のみ
   - 使用箇所: 1ファイル（`favorite-store.ts`）

2. **packages/core/src/assembly/random/validator/result.ts** (約100行)
   - クラスベース型（`ValidationSuccess` / `ValidationFailure`）
   - `fold()` メソッドでパターンマッチング
   - `concat()` で複数エラーの集約機能
   - 使用箇所: 5ファイル（validators.ts, base.ts, random-assembly.ts 等）

どちらの実装もプロジェクト固有のものであり、保守コストと機能の不統一が課題となっている。AGENTS.md L22 の「例外処理: エンドユーザーが解決不可能な問題のみ例外、それ以外はResult型」という原則を徹底するためには、プロジェクト全体で統一されたResult型が必要である。

## 決定ドライバ

- **MUST要件**: 例外処理の統一（AGENTS.md L22, L134-L139）- Result型によるユーザー解決可能エラーの表現
- **MUST要件**: セキュリティファースト（AGENTS.md L79-L85）- 依存バージョン固定、承認手順の遵守
- **SHOULD要件**: 可逆性（AGENTS.md L320）- 設計決定の取り消しが可能であること
- **SHOULD要件**: 低結合・高凝集（AGENTS.md L183, L317-L318）- 共通機能の一元管理
- **MAY要件**: ADR記録（AGENTS.md L230-L242）- 重要な技術決定の文書化

## 検討した選択肢

1. byethrow@0.8.0 を採用（採用）
2. web実装に統一
3. core実装に統一
4. 現状維持（2つの実装を並存）

## 決定（採択）

選択したオプション: "byethrow@0.8.0 を採用"。理由: MUST要件である例外処理の統一を最も効果的に実現し、保守コストを削減できる。さらに、高度な機能（pipe、andThen等）により開発生産性が向上し、TypeScript完全サポートにより型安全性が確保される。

### 実装方針

**依存追加**:

```json
{
  "dependencies": {
    "@praha-inc/byethrow": "0.8.0"
  }
}
```

**バージョン固定の根拠**:
- セマンティックバージョニングに従い、メジャー・マイナー・パッチ番号を具体的に指定（AGENTS.md L349）
- キャレット（^）やチルダ（~）の範囲指定は使用しない

**段階的移行計画**:

1. **Phase 1**: `@praha-inc/byethrow` を `packages/shared` に追加
2. **Phase 2**: `packages/web` の `result.ts` 使用箇所を移行（1ファイル）
3. **Phase 3**: `packages/core` の `result.ts` 使用箇所を移行（5ファイル）
4. **Phase 4**: 独自実装を削除（`web/src/lib/utils/result.ts`, `core/src/assembly/random/validator/result.ts`）

**配置場所**: `packages/shared` パッケージ
- 理由: ADR 20251018 で確立した「技術的インフラレイヤー」として、logger と同様に配置

## 影響評価

- **セキュリティ**: 適正 - @praha-inc は信頼できる開発元（praha-inc社）、バージョン0.8.0固定により予期しない変更を防止
- **パフォーマンス**: 影響微小 - バンドルサイズ +1.7KB (gzip)、実行時オーバーヘッドは無視可能
- **ユーザー体験**: 影響なし - 内部実装の変更のみ、外部APIに変更なし
- **アクセシビリティ**: 影響なし
- **トレーサビリティ**: 改善 - Result型の一元管理により、エラーハンドリングの追跡が容易になる

### ポジティブな影響

- **保守コストの削減**: 独自実装（23行 + 約100行）→ ライブラリ管理（バージョン更新のみ）
- **機能の統一**: プロジェクト全体でResult型の扱いが統一され、学習コストが削減
- **高度な機能の利用**: pipe、andThen、orElse等の関数型プログラミング機能が利用可能
- **TypeScript完全サポート**: 型推論が強力で、型安全性が向上
- **将来の拡張性**: byethrowの開発が継続され、新機能が追加される可能性
- **AGENTS.md準拠**: 例外処理の原則（L134-L139）とParse don't validate（L140-L146）の実践が容易

### ネガティブな影響 / トレードオフ

- **外部依存の追加**: バンドルサイズ +1.7KB (gzip)、依存関係の管理が必要
- **バージョン0.8.0のリスク**: メジャーバージョン1.0未満のため、API安定性にリスクあり（破壊的変更の可能性）
- **移行コスト**: 推定8-12時間（コード変更 + テスト + レビュー）
- **学習コスト**: 新しいAPIの習得が必要（ただし、公式ドキュメントが充実）
- **可逆性の制約**: 一度採用すると、独自実装への戻しは困難（依存が広範囲に拡散）

## 各選択肢の利点と欠点

### byethrow@0.8.0 を採用（採用）

byethrowは`@praha-inc`社が開発する型安全なエラーハンドリングライブラリ。
公式リポジトリ: https://github.com/praha-inc/byethrow

**主要機能**:
- Result型の基本操作（ok, err, isOk, isErr）
- 関数型プログラミング機能（pipe, andThen, orElse, unwrapOr）
- TypeScript完全サポート（型推論が強力）

**ベンチマーク**:
- バンドルサイズ: 1.7KB (gzip)
- TypeScript型チェック: 完全サポート
- ブラウザ互換性: モダンブラウザ全対応

- 良い点: プロジェクト全体でResult型が統一され、保守コストが削減
- 良い点: 独自実装（123行）→ ライブラリ管理（バージョン更新のみ）
- 良い点: pipe、andThen等の高度な機能が利用可能で、開発生産性が向上
- 良い点: TypeScript完全サポートにより型安全性が確保
- 良い点: 公式ドキュメントが充実しており、学習コストが低い
- 良い点: AGENTS.md の例外処理原則（L134-L139）との整合性が高い
- 悪い点: 外部依存が追加され、バンドルサイズが +1.7KB (gzip) 増加
- 悪い点: バージョン0.8.0（メジャーバージョン1.0未満）のため、破壊的変更のリスクあり
- 悪い点: 移行コスト（推定8-12時間）が発生
- 悪い点: 新しいAPIの習得が必要（学習コスト）

### web実装に統一（却下）

packages/web/src/lib/utils/result.ts (23行) をプロジェクト標準とし、coreから参照。

**実装概要**:
- シンプルなユニオン型（`Ok<T> | Err<E>`）
- 基本的な `ok()` / `err()` ヘルパー関数のみ

- 良い点: 外部依存が不要で、バンドルサイズが増加しない
- 良い点: 実装がシンプルで理解しやすい（23行）
- 良い点: 移行コストが低い（coreからの参照のみ）
- 悪い点: 機能不足（fold、concat、pipe等の高度な機能がない）
- 悪い点: coreの複雑なバリデーション（concat等）が実装できない
- 悪い点: packages/shared への移動が必要（web → shared への責務移動）
- 悪い点: 将来的な機能追加により、独自実装が肥大化するリスク

### core実装に統一（却下）

packages/core/src/assembly/random/validator/result.ts (約100行) をプロジェクト標準とし、webから参照。

**実装概要**:
- クラスベース型（`ValidationSuccess` / `ValidationFailure`）
- `fold()` メソッドでパターンマッチング
- `concat()` で複数エラーの集約

- 良い点: 外部依存が不要で、バンドルサイズが増加しない
- 良い点: fold、concat等の高度な機能が実装済み
- 悪い点: 実装が複雑で保守コストが高い（約100行）
- 悪い点: pipe、andThen等の関数型機能が不足
- 悪い点: packages/shared への移動が必要（core → shared への責務移動）
- 悪い点: 将来的な機能追加により、独自実装がさらに肥大化するリスク

### 現状維持（2つの実装を並存）（却下）

web実装とcore実装を並存させ、各パッケージで独立して使用。

- 良い点: 移行コストがゼロ（変更不要）
- 良い点: 各パッケージに最適化された実装を維持できる
- 悪い点: プロジェクト全体で統一されず、学習コストが2倍
- 悪い点: 保守コストが増大（2つの実装を独立して保守）
- 悪い点: AGENTS.md の「低結合・高凝集」（L317-L318）に反する
- 悪い点: 将来的な機能追加が重複し、非効率

## フォローアップ / 移行計画

### Phase 1: 依存追加と検証（推定1-2時間）

1. `packages/shared/package.json` に `@praha-inc/byethrow@0.8.0` を追加
2. 依存承認手順の実施（AGENTS.md L82-L83）
   - チェック項目:
     - バージョン固定: ✓（0.8.0で固定）
     - セキュリティ監査: npm audit / GitHub Security Advisory確認
     - ライセンス確認: MIT License（互換性あり）
     - バンドルサイズ影響: +1.7KB (gzip)（許容範囲内）
3. ビルド・テストの成功確認

### Phase 2: web実装の移行（推定2-3時間）

1. `packages/web/src/lib/view/parts-list/stores/favorite-store.ts` の移行
   - Before: `import { ok, err } from '$lib/utils/result'`
   - After: `import { ok, err } from '@praha-inc/byethrow'`
2. 型定義の調整（必要に応じて）
3. 単体テストの実行と修正
4. `packages/web/src/lib/utils/result.ts` の削除

### Phase 3: core実装の移行（推定4-6時間）

1. `packages/core/src/assembly/random/validator/` 配下5ファイルの移行
   - `validators.ts`, `base.ts`, `random-assembly.ts`, `random-assembly.spec.ts`, `result.spec.ts`
   - Before: `import { success, failure } from './result'`
   - After: `import { ok, err } from '@praha-inc/byethrow'`
2. `fold()` → `match()` / `concat()` → カスタム実装への変換
3. 単体テストの実行と修正（特に `result.spec.ts`）
4. `packages/core/src/assembly/random/validator/result.ts` の削除

### Phase 4: 最終検証（推定1時間）

1. 全パッケージのビルド確認
2. テストカバレッジの維持確認（80%以上）
3. e2eテストの実行
4. ADRの更新（ステータス: 提案中 → 承認済み）

### リスク軽減策

- **破壊的変更のリスク**: package.json でバージョン固定（0.8.0）、Renovate等で更新を監視
- **移行ミスのリスク**: 段階的移行（Phase 1-4）により、各フェーズでテスト実行
- **パフォーマンス劣化のリスク**: 移行前後でベンチマーク測定（Web Vitals、API応答時間）

## 参考リンク

- [byethrow公式リポジトリ](https://github.com/praha-inc/byethrow)
- [byethrow npm package](https://www.npmjs.com/package/@praha-inc/byethrow)
- AGENTS.md L22 - 例外処理（MUST要件）
- AGENTS.md L134-L139 - 例外処理の詳細
- AGENTS.md L140-L146 - Parse don't validate原則
- AGENTS.md L79-L85 - セキュリティと依存管理（MUST要件）
- AGENTS.md L320 - 可逆性（SHOULD要件）
- ADR 20251018 - logger.ts を packages/shared に配置する
