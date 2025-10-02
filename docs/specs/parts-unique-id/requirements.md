# Requirements Document

## Introduction

AC6 Assemble Toolでは、現在パーツを部位ごとの配列インデックスで識別・引当している。この方式では、新規パーツ追加時にインデックスが変化し、既存のURL共有やストレージデータとの互換性が失われる問題がある。本機能では、各パーツにユニークIDを付与することで、IDベースの安定した引当を実現し、パーツ追加・削除時の互換性問題を解決する。

既存のインデックスベース実装との互換性を維持できない場合は、破壊的変更（v2.0.0）として導入し、v1形式からv2形式への移行方法を提供する。

## Requirements

### Requirement 1: パーツID定義と管理

**Objective:** パーツデータ管理者として、各パーツにグローバルユニークIDを付与し、IDベースでパーツを一意に識別できるようにしたい。これにより、パーツ追加・削除時の互換性を保証する。

#### Acceptance Criteria

1. WHEN 新規パーツを定義する THEN AC6 Assemble Tool SHALL パーツにグローバルユニークID（文字列形式）を付与すること
2. WHEN パーツIDを生成する THEN AC6 Assemble Tool SHALL ID形式を`{2-3文字カテゴリコード}{3-4桁連番}`パターン（例: `HD001`, `WP042`, `CR123`）とすること
3. WHEN 同一パーツが複数部位で使用可能な場合（腕武器・肩武器等） THEN AC6 Assemble Tool SHALL 同一パーツオブジェクトを複数の候補配列で参照し、IDは1つのみ付与すること
4. WHEN 既存パーツデータを読み込む THEN AC6 Assemble Tool SHALL 全パーツに対してIDフィールドが存在することを検証すること
5. IF パーツIDが重複している THEN AC6 Assemble Tool SHALL エラーをログ出力し、アプリケーション起動を中断すること
6. WHEN パーツリストに新規パーツを追加する THEN AC6 Assemble Tool SHALL 既存パーツのIDを変更しないこと

### Requirement 2: IDベース引当機能

**Objective:** システム利用者として、パーツIDを用いて特定のパーツを正確に引当できるようにしたい。これにより、URL共有やストレージ保存時にインデックス変動の影響を受けない。

#### Acceptance Criteria

1. WHEN パーツIDを指定してパーツを検索する THEN AC6 Assemble Tool SHALL 候補配列から該当するパーツオブジェクトを返却すること
2. WHEN 存在しないパーツIDを指定してパーツを検索する THEN AC6 Assemble Tool SHALL フォールバック処理（デフォルトパーツまたは`NotEquipped`）を実行すること
3. WHEN 機体構成をURL形式（v2形式）にシリアライズする THEN AC6 Assemble Tool SHALL バージョン識別パラメータ`v=2`とパーツIDをクエリパラメータに含めること
4. WHEN v2形式のURLクエリパラメータから機体構成をデシリアライズする THEN AC6 Assemble Tool SHALL `v=2`パラメータを検出し、パーツIDを用いてパーツを引当すること
5. WHEN IndexedDBに機体構成を保存する THEN AC6 Assemble Tool SHALL パーツIDベースのデータ形式で保存すること
6. WHEN IndexedDBから機体構成を読み込む THEN AC6 Assemble Tool SHALL パーツIDを用いてパーツを引当すること
7. WHEN URL長がブラウザ制限（Edge 2084バイト）に近づく THEN AC6 Assemble Tool SHALL 短縮ID形式により制限内に収めること

### Requirement 3: 後方互換性とバージョン移行

**Objective:** 既存ユーザーとして、v1形式のURLやストレージデータをv2環境で引き続き利用できるようにしたい。明確な移行手段を提供してほしい。

#### Acceptance Criteria

1. WHEN URLクエリパラメータに`v`パラメータが存在しない THEN AC6 Assemble Tool SHALL v1形式（インデックスベース）と判定すること
2. WHEN v1形式のURLクエリパラメータを受け取る THEN AC6 Assemble Tool SHALL 部位ごとにインデックスから候補配列のパーツオブジェクトを取得し、そのパーツIDを用いてv2形式へ変換すること
3. WHEN v1形式で同一パーツが複数部位で異なるインデックスを持つ場合 THEN AC6 Assemble Tool SHALL 各部位のインデックスから取得したパーツオブジェクトのグローバルIDを正しく取得すること
4. WHEN v1形式のIndexedDBデータを読み込む THEN AC6 Assemble Tool SHALL クエリ文字列形式を検証し、`v`パラメータの有無でv1/v2を判定すること
5. WHEN v1形式のIndexedDBデータを検出する THEN AC6 Assemble Tool SHALL v2形式へ自動変換し、変換後のデータで保存すること
6. WHEN v1形式データの自動変換に失敗する THEN AC6 Assemble Tool SHALL ユーザーに分かりやすいエラーメッセージを表示し、データ再作成を案内すること

### Requirement 4: パッチバージョン対応

**Objective:** パーツデータ管理者として、ゲームパッチによるパーツ追加・削除・変更時にIDベース引当が正しく機能するようにしたい。

#### Acceptance Criteria

1. WHEN ゲームパッチで新規パーツが追加される THEN AC6 Assemble Tool SHALL 新規パーツに新しいユニークIDを付与すること
2. WHEN ゲームパッチでパーツが削除される THEN AC6 Assemble Tool SHALL 削除されたパーツのIDを保持し、フォールバック処理を実行可能にすること
3. WHEN パッチ適用により既存パーツのステータスが変更される THEN AC6 Assemble Tool SHALL パーツIDを変更せず、ステータスのみを更新すること
4. WHEN 異なるパッチバージョン間でパーツを検索する THEN AC6 Assemble Tool SHALL 同一IDのパーツをバージョン横断で識別できること

### Requirement 5: 開発者向けドキュメントとツール

**Objective:** 開発者として、パーツID管理の方針とID付与手順を理解し、正しくパーツデータを追加・更新できるようにしたい。

#### Acceptance Criteria

1. WHEN パーツID管理ドキュメントを参照する THEN AC6 Assemble Tool SHALL ID命名規則、ID生成方法、重複チェック手順を記載していること
2. WHEN 新規パーツを追加する THEN AC6 Assemble Tool SHALL 自動ID生成スクリプトまたはバリデーションツールを提供すること
3. WHEN パーツデータをビルドする THEN AC6 Assemble Tool SHALL ID重複検証をビルドプロセスに組み込むこと
4. IF ID重複が検出される THEN AC6 Assemble Tool SHALL ビルドを失敗させ、重複IDを明示したエラーメッセージを出力すること
