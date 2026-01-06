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

## Requirements
<!-- Will be generated in /kiro:spec-requirements phase -->
