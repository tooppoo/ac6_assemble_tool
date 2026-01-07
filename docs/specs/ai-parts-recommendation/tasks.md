# Implementation Plan

## Overview

本実装計画は、AI パーツ推奨機能（POST `/api/recommend` エンドポイント）を packages/api に追加するタスクを定義します。Cloudflare Workers AI（Llama 3.1-8b-instruct-fast）を使用し、自然言語クエリに基づいてパーツを推奨する機能を実装します。

---

## Tasks

- [ ] 1. プロジェクト基盤とパッケージ依存の設定
- [ ] 1.1 必要なパッケージ依存を追加
  - packages/api の package.json に `@ac6_assemble_tool/parts` と `@ac6_assemble_tool/shared` を workspace 依存として追加
  - valibot をバリデーションライブラリとして追加（バージョンは packages/core と統一）
  - package.json の dependencies セクションを更新
  - pnpm install を実行して依存をインストール
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 1.2 TypeScript 型定義ファイルを作成
  - リクエスト・レスポンスの TypeScript 型定義を作成
  - Recommendation 型（partId, partName, reason, score）を定義
  - RecommendRequest 型（query, slot?）を定義
  - RecommendResponse 型（recommendations 配列）を定義
  - ErrorResponse 型を定義
  - SlotType 型（10種類のスロット列挙）を定義
  - _Requirements: 1.2, 1.3, 1.6, 5.3_

- [ ] 1.3 Valibot バリデーションスキーマを定義
  - RecommendRequest のバリデーションスキーマを作成
  - query フィールドのバリデーション（文字列、最小長1）を実装
  - slot フィールドのバリデーション（オプショナル、10種類のスロット列挙）を実装
  - Valibot の v.object, v.string, v.minLength, v.optional, v.union, v.literal を使用
  - _Requirements: 1.4, 5.1_

- [ ] 2. パーツデータロード機能の実装
- [ ] 2.1 パーツローダーモジュールを作成
  - packages/parts から全パーツデータをインポートする機能を実装
  - heads, arms, cores, legs, booster, fces, generators, armUnits, backUnits, expansions を統合
  - ACParts 型の配列を返す関数を作成
  - スロット指定なしで全パーツを返す機能を実装
  - _Requirements: 2.1_

- [ ] 2.2 スロットフィルタリング機能を実装
  - スロット名（例: 'head', 'arms'）から classification への変換ロジックを作成
  - 指定されたスロットに該当するパーツのみをフィルタリングする機能を実装
  - classification フィールドによるフィルタリングロジックを実装
  - オプショナルなスロット指定に対応（未指定時は全パーツ）
  - _Requirements: 2.2_

- [ ] 2.3 AI 用データ抽出機能を実装
  - パーツから ai_summary と ai_tags を抽出する機能を実装
  - パーツの id, name, ai_summary, ai_tags を含む軽量オブジェクトを生成
  - AI プロンプト生成用のデータ形式に変換
  - _Requirements: 2.3_

- [ ] 3. AI 推論サービスの実装
- [ ] 3.1 構造化プロンプト生成機能を作成
  - ユーザークエリとパーツデータから構造化プロンプトを生成する機能を実装
  - JSON 形式でパーツ候補を含むプロンプトを作成
  - AI に推奨形式（partId, partName, reason, score）を指示
  - プロンプトに日本語での推奨理由説明を要求
  - _Requirements: 2.4_

- [ ] 3.2 Cloudflare Workers AI 呼び出し機能を実装
  - env.AI バインディングを使用した AI API 呼び出し機能を実装
  - Llama 3.1-8b-instruct-fast モデル（`@cf/meta/llama-3.1-8b-instruct-fast`）を指定
  - messages 形式でプロンプトを送信
  - 3秒タイムアウト機能を実装（Promise.race 使用）
  - _Requirements: 3.2, 8.1_

- [ ] 3.3 AI レスポンスパース機能を実装
  - AI レスポンスから JSON を抽出する機能を実装
  - recommendations 配列の存在と形式を検証
  - partId, partName, reason, score フィールドを抽出
  - バリデーション失敗時のエラーハンドリングを実装
  - _Requirements: 2.5, 5.4_

- [ ] 3.4 推奨結果のソートと選択機能を実装
  - 推奨結果をスコア降順でソートする機能を実装
  - 上位3～5件のパーツを選択する機能を実装
  - スコア値（0.0-1.0）の範囲検証を実装
  - _Requirements: 2.6, 2.7_

- [ ] 3.5 Result 型によるエラーハンドリングを実装
  - AI 推論処理全体を Result 型で包む機能を実装
  - タイムアウトエラーを Result.err で返す機能を実装
  - AI API 呼び出し失敗を Result.err で返す機能を実装
  - パースエラーを Result.err で返す機能を実装
  - _Requirements: 3.1, 3.3, 3.5_

- [ ] 4. HTTP エンドポイントハンドラの実装
- [ ] 4.1 リクエストバリデーション機能を実装
  - Hono Context からリクエストボディを取得する機能を実装
  - Valibot スキーマでバリデーションを実行
  - バリデーション成功時に RecommendRequest 型を返す機能を実装
  - バリデーション失敗時に Result.err を返す機能を実装
  - _Requirements: 5.1, 5.2_

- [ ] 4.2 エンドポイントハンドラ関数を作成
  - POST `/api/recommend` のハンドラ関数を実装
  - リクエストバリデーション、パーツロード、AI 推論を統合
  - 成功時に RecommendResponse（200 OK）を返す機能を実装
  - 各エラータイプに応じた HTTP ステータスコード（400/500/503/504）を返す機能を実装
  - _Requirements: 1.1, 1.5, 3.1, 3.3_

- [ ] 4.3 Hono ルーターに新しいエンドポイントを追加
  - packages/api/src/index.ts の既存 Hono インスタンスに POST `/api/recommend` ルートを追加
  - ハンドラ関数をルートに接続
  - Cloudflare Workers AI バインディング（env.AI）をハンドラに渡す
  - _Requirements: 8.2_

- [ ] 5. 構造化ログ機能の統合
- [ ] 5.1 構造化ロガーのインポートと初期化
  - `@ac6_assemble_tool/shared` の logger をインポート
  - ログ出力に必要な context 情報（endpoint, query, slot 等）を定義
  - 機微情報除外のロジックを確認
  - _Requirements: 6.5, 6.6, 7.2_

- [ ] 5.2 リクエスト受信時のログ出力を実装
  - エンドポイントハンドラ開始時に info レベルログを出力
  - query（最大50文字）と slot を context に含める
  - タイムスタンプ、level、message を JSON 形式で出力
  - _Requirements: 6.1_

- [ ] 5.3 AI 呼び出し時のログ出力を実装
  - AI API 呼び出し前に debug レベルログを出力
  - モデル名とプロンプトサイズ（文字数）を context に含める
  - _Requirements: 6.2_

- [ ] 5.4 レスポンス送信時のログ出力を実装
  - レスポンス送信前に info レベルログを出力
  - レスポンス時間（ミリ秒）と HTTP ステータスコードを context に含める
  - 推奨パーツ数を context に含める
  - _Requirements: 6.3_

- [ ] 5.5 エラー時のログ出力を実装
  - バリデーションエラー時に warn レベルログを出力
  - AI API エラー、タイムアウト、予期しない例外時に error レベルログを出力
  - エラータイプと詳細情報を context に含める
  - _Requirements: 3.6, 3.7, 5.5, 6.4_

- [ ] 6. エラーレスポンスの実装
- [ ] 6.1 エラーレスポンス生成関数を作成
  - ErrorResponse 型に基づいたエラーレスポンスを生成する関数を実装
  - エラーメッセージとエラーコードを含む JSON を生成
  - HTTP ステータスコードを指定可能にする
  - _Requirements: 3.4_

- [ ] 6.2 各エラータイプのレスポンス処理を実装
  - バリデーションエラー → 400 Bad Request + "Invalid request" メッセージ
  - タイムアウトエラー → 504 Gateway Timeout + "Request timeout" メッセージ
  - AI サービスエラー → 503 Service Unavailable + "AI service temporarily unavailable" メッセージ
  - 予期しない例外 → 500 Internal Server Error + "Internal server error" メッセージ
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 7. 単体テストの作成
- [ ] 7.1 リクエストバリデーションのテストを作成
  - 正常なリクエストボディでバリデーション成功を確認
  - query 空文字列でバリデーション失敗を確認
  - 不正な slot 値でバリデーション失敗を確認
  - JSON 形式エラーでバリデーション失敗を確認
  - _Requirements: 5.1, 5.2_

- [ ] 7.2 パーツローダーのテストを作成
  - スロット指定なしで全パーツロードを確認
  - 各スロット指定（'head', 'arms' 等）で該当パーツのみロードを確認
  - ai_summary と ai_tags が含まれることを確認
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 7.3 AI プロンプト生成のテストを作成
  - ユーザークエリとパーツデータから構造化プロンプト生成を確認
  - JSON 形式の正当性を確認
  - プロンプトにパーツ情報が含まれることを確認
  - _Requirements: 2.4_

- [ ] 7.4 AI レスポンスパースのテストを作成
  - 正常な AI JSON レスポンスのパース成功を確認
  - 不正な JSON 形式でパース失敗を確認
  - recommendations 配列が空の場合の処理を確認
  - score 値の範囲チェック（0.0-1.0）を確認
  - _Requirements: 2.5, 5.4_

- [ ] 7.5 エラーハンドリングのテストを作成
  - ValidationError から HTTP 400 への変換を確認
  - TimeoutError から HTTP 504 への変換を確認
  - AIServiceError から HTTP 503 への変換を確認
  - 予期しない例外から HTTP 500 への変換を確認
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ] 8. 統合テストの作成
- [ ] 8.1 エンドポイント正常系のテストを作成
  - 正常なリクエストで 200 OK と recommendations 配列を返すことを確認
  - recommendations がスコア降順ソート済みであることを確認
  - 上位5件のみ返却されることを確認
  - partId, partName, reason, score フィールドが含まれることを確認
  - _Requirements: 1.1, 1.5, 1.6, 2.6, 2.7_

- [ ] 8.2 エンドポイント異常系のテストを作成
  - query 空文字列で 400 Bad Request を返すことを確認
  - 不正な slot 値で 400 Bad Request を返すことを確認
  - モック AI がタイムアウトを返す設定で 504 Gateway Timeout を返すことを確認
  - モック AI がエラーを返す設定で 503 Service Unavailable を返すことを確認
  - _Requirements: 1.4, 3.1, 3.2, 3.3_

- [ ] 8.3 パッケージ依存統合のテストを作成
  - `@ac6_assemble_tool/parts` からパーツデータロード成功を確認
  - `@ac6_assemble_tool/shared` の logger が正常に動作することを確認
  - _Requirements: 7.1, 7.2_

- [ ] 8.4 構造化ログ出力のテストを作成
  - 正常リクエストで info/debug ログ出力を確認
  - エラー時に error/warn ログ出力を確認
  - ログに機微情報が含まれていないことを確認
  - JSON 形式でログが出力されることを確認
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 9. パフォーマンステストの作成
- [ ] 9.1 レスポンス時間テストを作成
  - 通常のパーツ数（30-50件）で3秒以内にレスポンスすることを確認
  - スロット指定ありで2秒以内にレスポンスすることを確認
  - _Requirements: 4.1_

- [ ] 9.2 プロンプトサイズテストを作成
  - 全パーツ（約300件）をプロンプトに含めた場合のトークン数を計測
  - Llama 3.1-8b-instruct-fast のコンテキストウィンドウ（128K）内に収まることを確認
  - _Requirements: 4.3_

- [ ] 9.3 並行リクエストテストを作成
  - 10並行リクエストで全て3秒以内にレスポンスすることを確認
  - Cloudflare Workers の CPU 時間制限内に収まることを確認
  - _Requirements: 8.5_

- [ ] 10. ローカル開発環境での動作確認
- [ ] 10.1 wrangler dev でローカル実行を確認
  - `pnpm run dev` コマンドでローカルサーバーを起動
  - POST `/api/recommend` エンドポイントに curl でリクエストを送信
  - 正常なレスポンスが返ることを確認
  - ログが正しく出力されることを確認
  - _Requirements: 8.3_

- [ ] 10.2 エラーケースのローカル動作確認
  - バリデーションエラー（query 空文字列）のテスト
  - タイムアウトのテスト（必要に応じてタイムアウト時間を短縮）
  - 不正な JSON リクエストのテスト
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 11. デプロイ準備と本番環境確認
- [ ] 11.1 wrangler deploy でデプロイ可能であることを確認
  - ビルドエラーがないことを確認（`pnpm run build`）
  - 型チェックが通ることを確認（`pnpm run check-types`）
  - Lint が通ることを確認（`pnpm run lint`）
  - テストが全て成功することを確認（`pnpm run test`）
  - _Requirements: 8.4_

- [ ] 11.2 本番環境での動作確認計画を作成
  - デプロイ後の疎通確認手順を文書化
  - エラーログ監視手順を文書化
  - ロールバック手順を文書化
  - _Requirements: All requirements for production readiness_
