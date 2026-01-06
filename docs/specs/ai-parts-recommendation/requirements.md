# Requirements Document

## Project Description (Input)

ai-parts-recommendation

## 概要
ユーザーの質問（自然言語）に対して、パーツの ai_summary と ai_tags を活用し、最適なパーツを提案するHTTP API機能。

## 詳細な要求

### 背景
- packages/parts に定義された全パーツには ai_summary（簡潔な説明）と ai_tags（検索・分類用タグ）が既に実装されている
- ユーザーが「高火力の武器が欲しい」「軽量で機動力が高い脚部」などの自然言語で要求を入力
- Cloudflare Workers AI (Llama等のLLM) を使用してパーツを提案

### 実装先
- packages/api 配下に HTTP API として実装
- packages/web から非同期通信（fetch）で呼び出し

### 技術スタック
- Cloudflare Workers (Hono フレームワーク使用中)
- Cloudflare Workers AI (wrangler.jsonc に AI バインディング設定済み)
- packages/parts のパーツデータ（ai_summary, ai_tags 利用）

### 主要機能
1. POST /api/recommend エンドポイント
   - リクエスト: { query: string, slot?: string }
   - レスポンス: { recommendations: Array<{ partId: string, reason: string, score: number }> }

2. AI推論ロジック
   - ユーザークエリとパーツの ai_summary/ai_tags をLLMに渡す
   - LLMが適合度を判断し、推奨理由とスコアを返す
   - スロット指定がある場合は該当スロットのパーツのみを対象

3. エラーハンドリング
   - AI API呼び出し失敗時の適切なエラーレスポンス
   - 不正なリクエストへの400エラー

### 制約
- Cloudflare Workers の実行時間制限（CPU 50ms～数秒、プランによる）
- AI APIレスポンスのタイムアウト対応
- packages/parts への依存（monorepo内パッケージ参照）

### 成功基準
- ユーザーの自然言語クエリに対して3秒以内にレスポンス
- 推奨結果の精度（主観的だが、明らかに無関係なパーツを推奨しないこと）
- エラー時の適切なフォールバック（タイムアウト、AI API障害時）

---

## Introduction

本機能は、AC6 Assemble Tool において、プレイヤーが自然言語でパーツの要求を入力すると、Cloudflare Workers AI を用いて最適なパーツを推奨するHTTP API機能である。既存のパーツデータに含まれる `ai_summary`（簡潔な説明）と `ai_tags`（検索・分類用タグ）を活用し、LLMがユーザーの意図を理解してパーツを提案する。

packages/api に実装されるこのAPIは、packages/web のフロントエンドから非同期通信で呼び出され、ユーザー体験を向上させる。特に、パーツ選択時の試行錯誤を減らし、データドリブンな機体構築を支援することで、プレイヤーの時間短縮と戦略性向上に貢献する。

---

## Requirements

### Requirement 1: パーツ推奨エンドポイントの提供
**Objective:** ユーザーとして、自然言語クエリを送信することで、最適なパーツの推奨結果を受け取りたい。これにより、パーツ選択の試行錯誤時間を削減できる。

#### Acceptance Criteria

1. WHEN ユーザーが POST リクエストを `/api/recommend` エンドポイントに送信する THEN API サービスは JSON形式のレスポンスを返す
2. WHEN リクエストボディに `query` フィールド（文字列）が含まれている THEN API サービスはそのクエリを受け付ける
3. WHEN リクエストボディに `slot` フィールド（オプショナル文字列）が含まれている THEN API サービスは指定されたスロットのパーツのみを推奨対象とする
4. WHEN リクエストボディに `query` フィールドが存在しない OR 空文字列である THEN API サービスは HTTP 400 ステータスとエラーメッセージを返す
5. WHEN API サービスが推奨処理を完了する THEN レスポンスボディに `recommendations` 配列が含まれる
6. WHERE `recommendations` 配列の各要素 THE API サービスは `partId`（文字列）、`reason`（文字列）、`score`（数値）のフィールドを含む

### Requirement 2: AI推論によるパーツ適合度判定
**Objective:** 開発者として、Cloudflare Workers AI を活用して、ユーザークエリとパーツデータの適合度を判定したい。これにより、精度の高い推奨結果を提供できる。

#### Acceptance Criteria

1. WHEN API サービスがパーツ推奨処理を開始する THEN API サービスは `@ac6_assemble_tool/parts` から全パーツデータをロードする
2. IF リクエストに `slot` フィールドが指定されている THEN API サービスは該当スロットのパーツのみを対象とする
3. WHEN API サービスが対象パーツを決定する THEN API サービスは各パーツの `ai_summary` と `ai_tags` を抽出する
4. WHEN API サービスが Cloudflare Workers AI を呼び出す THEN API サービスはユーザークエリとパーツの `ai_summary`/`ai_tags` を含むプロンプトを送信する
5. WHEN Cloudflare Workers AI がレスポンスを返す THEN API サービスは推奨理由（`reason`）と適合スコア（`score`）を解析する
6. WHEN API サービスが複数のパーツを評価する THEN API サービスは適合スコアの降順で推奨結果をソートする
7. WHEN API サービスが推奨結果を生成する THEN API サービスは上位3～5件のパーツを `recommendations` 配列に含める

### Requirement 3: エラーハンドリングとタイムアウト対応
**Objective:** 運用者として、AI API呼び出し失敗やタイムアウト時に適切なエラーレスポンスを返したい。これにより、システムの堅牢性とユーザー体験を維持できる。

#### Acceptance Criteria

1. WHEN Cloudflare Workers AI の呼び出しが失敗する THEN API サービスは HTTP 503 ステータスと「AI service temporarily unavailable」メッセージを返す
2. WHEN Cloudflare Workers AI の呼び出しが3秒以内に完了しない THEN API サービスはリクエストをタイムアウトさせる
3. WHEN API サービスがタイムアウトを検出する THEN API サービスは HTTP 504 ステータスと「Request timeout」メッセージを返す
4. WHEN リクエストボディのJSON形式が不正である THEN API サービスは HTTP 400 ステータスと「Invalid JSON format」メッセージを返す
5. WHEN API サービスが予期しない例外を捕捉する THEN API サービスは HTTP 500 ステータスと「Internal server error」メッセージを返す
6. WHEN API サービスがエラーレスポンスを返す THEN API サービスは構造化ログ（errorレベル）を出力する
7. WHERE エラーログ出力時 THE API サービスは機微情報（APIキー、個人情報等）を除外する

### Requirement 4: パフォーマンスとレスポンス時間
**Objective:** ユーザーとして、自然言語クエリに対して3秒以内にレスポンスを受け取りたい。これにより、快適なパーツ探索体験を得られる。

#### Acceptance Criteria

1. WHEN ユーザーが `/api/recommend` エンドポイントにリクエストを送信する THEN API サービスは3秒以内にレスポンスを返す
2. WHEN API サービスがパーツデータをロードする THEN API サービスはロード時間を最小化するためにキャッシュまたは遅延評価を活用する
3. WHEN API サービスが Cloudflare Workers AI を呼び出す THEN API サービスはプロンプトサイズを最適化し、必要最小限の情報のみを送信する
4. WHEN API サービスがレスポンスを生成する THEN API サービスは圧縮されたJSON形式で返す

### Requirement 5: 型安全性とバリデーション
**Objective:** 開発者として、リクエスト・レスポンスの型安全性を確保し、実行時エラーを防ぎたい。これにより、保守性と信頼性を向上させる。

#### Acceptance Criteria

1. WHEN API サービスがリクエストを受け取る THEN API サービスは Valibot スキーマでリクエストボディをバリデーションする
2. WHEN バリデーションが失敗する THEN API サービスは HTTP 400 ステータスと具体的なバリデーションエラーメッセージを返す
3. WHEN API サービスがレスポンスを生成する THEN API サービスは TypeScript 型定義に基づいてレスポンスオブジェクトを構築する
4. WHEN API サービスが Cloudflare Workers AI のレスポンスを解析する THEN API サービスは期待される形式（`reason`, `score`）に一致するかバリデーションする
5. WHERE バリデーションエラーが発生する THE API サービスは構造化ログ（warnレベル）を出力する

### Requirement 6: 構造化ログとモニタリング
**Objective:** 運用者として、API動作を追跡し、問題を迅速に診断したい。これにより、障害対応とパフォーマンス改善を効率化できる。

#### Acceptance Criteria

1. WHEN API サービスがリクエストを受け取る THEN API サービスは info レベルの構造化ログを出力する
2. WHEN API サービスが Cloudflare Workers AI を呼び出す THEN API サービスは debug レベルの構造化ログを出力する
3. WHEN API サービスがレスポンスを返す THEN API サービスは info レベルの構造化ログ（レスポンス時間、ステータスコード）を出力する
4. WHEN API サービスがエラーを検出する THEN API サービスは error レベルの構造化ログを出力する
5. WHERE 構造化ログ出力時 THE API サービスは JSON 形式でログを出力し、`level`, `timestamp`, `message`, `context` フィールドを含める
6. WHERE 構造化ログ出力時 THE API サービスは機微情報（APIキー、個人情報等）を除外する

### Requirement 7: monorepo内パッケージ依存の管理
**Objective:** 開発者として、packages/parts への依存を適切に管理し、依存の一方向性を維持したい。これにより、循環依存を防ぎ、保守性を向上させる。

#### Acceptance Criteria

1. WHEN API サービスがパーツデータを参照する THEN API サービスは `@ac6_assemble_tool/parts` パッケージから import する
2. WHEN API サービスが構造化ログを出力する THEN API サービスは `@ac6_assemble_tool/shared` の logger を使用する
3. WHERE パッケージ依存を追加する THE 開発者は `docs/checklist/add-dependency.md` に従い、承認手順を実施する
4. WHERE API サービスのアーキテクチャ THE API サービスは packages/parts や packages/core に依存せず、一方向依存を維持する
5. WHEN API サービスが型定義を参照する THEN API サービスは `@ac6_assemble_tool/parts/types/*` から型をimportする

### Requirement 8: Cloudflare Workers環境との統合
**Objective:** 開発者として、Cloudflare Workers 環境で正常に動作するAPIを実装したい。これにより、デプロイと運用を簡素化できる。

#### Acceptance Criteria

1. WHEN API サービスが Cloudflare Workers AI を利用する THEN API サービスは `wrangler.jsonc` で定義された AI バインディング（`binding: "AI"`）を使用する
2. WHEN API サービスが Hono フレームワークを使用する THEN API サービスは既存の `packages/api/src/index.ts` の Hono インスタンスにルートを追加する
3. WHEN API サービスが開発環境で動作する THEN API サービスは `wrangler dev` コマンドでローカル実行可能である
4. WHEN API サービスが本番環境にデプロイされる THEN API サービスは `wrangler deploy` コマンドでデプロイ可能である
5. WHERE Cloudflare Workers の実行時間制限 THE API サービスは CPU時間を50ms～数秒以内に収める
