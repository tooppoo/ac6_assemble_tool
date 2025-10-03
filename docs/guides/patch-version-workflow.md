# パッチバージョン適用ワークフロー

このドキュメントでは、ゲームのパッチバージョン適用時のワークフローを説明します。

## 概要

Armored Core 6のアップデートでパーツの追加・削除・変更が行われた場合、このツールも更新する必要があります。ID不変性を維持しながら、正しくパーツデータを更新する手順を説明します。

## パッチ適用の基本原則

### ID不変性の原則

**一度付与したパーツIDは絶対に変更しません。**

- 既存パーツのIDを変更すると、保存済みの機体データやURLが壊れます
- 新規パーツには新しいIDを付与します
- 削除されたパーツのIDは欠番として保持します

### フォールバック処理の原則

存在しないパーツIDを参照した場合、配列の最初の要素にフォールバックします。これにより、パーツ削除後も既存データが読み込めます。

## ワークフロー

### 1. 新規パーツ追加

ゲームアップデートで新しいパーツが追加された場合：

#### 手順

1. **パーツ性能データを収集**
   - ゲーム内でパーツ性能を確認
   - 必要な全パラメータ（攻撃力、重量、EN負荷など）をメモ

2. **新しいIDを生成**
   ```bash
   cd packages/parts
   pnpm run gen-id <category>
   ```

   例：
   ```bash
   # 新しい頭部パーツのID生成
   pnpm run gen-id head
   # => HD024
   ```

3. **パーツ定義を作成**
   ```typescript
   // packages/parts/src/heads.ts

   const newHead: Head = {
     id: 'HD024', // 生成したID
     name: 'New Head Name',
     classification: 'head',
     manufacture: 'baws',
     price: 150000,
     weight: 450,
     en_load: 80,
     ap: 500,
     anti_kinetic_defense: 120,
     anti_energy_defense: 115,
     anti_explosive_defense: 110,
     attitude_stability: 280,
     // ... その他のパラメータ
   }

   export const heads: readonly Head[] = [
     // ... 既存のパーツ
     newHead, // 配列の最後に追加
   ]
   ```

4. **ID重複検証を実行**
   ```bash
   pnpm run validate-ids
   ```

   エラーが出た場合は、IDが重複しています。手順2に戻って新しいIDを生成してください。

5. **テストを実行**
   ```bash
   pnpm test
   ```

6. **変更をコミット**
   ```bash
   git add packages/parts/src/heads.ts
   git commit -m "feat: v1.07パッチで追加された頭部パーツを追加"
   ```

### 2. パーツ削除

ゲームアップデートでパーツが削除された場合：

#### 手順

1. **該当パーツを特定**
   - 削除されたパーツのIDと名前を確認

2. **パーツ定義をコメントアウトではなく削除**
   ```typescript
   // packages/parts/src/heads.ts

   // 削除前
   export const heads: readonly Head[] = [
     head001,
     deletedHead, // このパーツが削除された
     head003,
   ]

   // 削除後
   export const heads: readonly Head[] = [
     head001,
     // deletedHeadは完全に削除（コメントアウトしない）
     head003,
   ]
   ```

   **重要**：IDは欠番として保持されます。削除したパーツのIDを別のパーツに再利用しないでください。

3. **フォールバック処理の確認**
   - 削除されたパーツIDを参照している保存データやURLは、自動的に配列の最初の要素（この場合`head001`）にフォールバックします

4. **テストを実行**
   ```bash
   pnpm test
   ```

5. **変更をコミット**
   ```bash
   git add packages/parts/src/heads.ts
   git commit -m "feat: v1.07パッチで削除された頭部パーツを削除"
   ```

### 3. パーツステータス変更

ゲームアップデートでパーツの性能が変更された場合：

#### 手順

1. **該当パーツを特定**
   - 変更されたパーツの名前とIDを確認

2. **パラメータのみを更新（IDは変更しない）**
   ```typescript
   // packages/parts/src/heads.ts

   const head001: Head = {
     id: 'HD001', // IDは変更しない
     name: 'KASUAR/42Z', // 名前も通常は変更しない
     // ... 変更前のパラメータ
     ap: 500, // 旧値
     anti_kinetic_defense: 120, // 旧値
   }

   // 変更後
   const head001: Head = {
     id: 'HD001', // IDは変更しない
     name: 'KASUAR/42Z',
     // ... その他のパラメータ
     ap: 550, // 新値（バフ）
     anti_kinetic_defense: 125, // 新値（バフ）
   }
   ```

3. **変更内容をドキュメント化**
   - コミットメッセージに変更内容を記載
   - 必要に応じてCHANGELOG.mdを更新

4. **テストを実行**
   ```bash
   pnpm test
   ```

5. **変更をコミット**
   ```bash
   git add packages/parts/src/heads.ts
   git commit -m "feat: v1.07パッチでKASAUR/42ZのAP/防御力が上方修正"
   ```

### 4. バージョン番号の更新

パッチ適用後、バージョン番号を更新します：

#### 手順

1. **新しいバージョンディレクトリを作成**
   ```bash
   cd packages/parts/src/versions
   cp -r v1.06.1 v1.07
   ```

2. **candidates.tsを更新**
   ```typescript
   // packages/parts/src/versions/v1.07/candidates.ts
   import { heads } from '../../heads'
   // ... その他のインポートと候補定義
   ```

3. **エクスポートを追加**
   ```typescript
   // packages/parts/src/versions/index.ts
   export * from './v1.06.1'
   export * from './v1.07' // 新規追加
   ```

4. **変更をコミット**
   ```bash
   git add packages/parts/src/versions/
   git commit -m "feat: v1.07パッチ対応を追加"
   ```

## チェックリスト

パッチ適用時の確認事項：

- [ ] 新規パーツにはID生成スクリプトで生成したIDを使用
- [ ] 既存パーツのIDは変更していない
- [ ] 削除されたパーツはコメントアウトではなく削除
- [ ] パラメータ変更時はIDを変更していない
- [ ] `pnpm run validate-ids`で検証を実行
- [ ] `pnpm test`で全テストが通過
- [ ] コミットメッセージにパッチバージョンと変更内容を記載

## トラブルシューティング

### 既存の保存データが読み込めない

**原因**：パーツIDを変更した可能性があります

**対処法**：
1. 変更したIDを元に戻す
2. 新しいパーツとして別IDで追加する

### URL共有が機能しない

**原因**：パーツIDが存在しない、または重複している可能性があります

**対処法**：
1. `pnpm run validate-ids`で重複を確認
2. ブラウザの開発者ツールでコンソールエラーを確認
3. URLパラメータに含まれるIDが実際に存在するか確認

### v1形式データが自動変換されない

**原因**：候補配列のインデックスが変更された可能性があります

**対処法**：
1. パーツ追加時は必ず配列の最後に追加する
2. パーツ削除時は順序を変更しない（該当パーツだけを削除）

## まとめ

パッチバージョン適用時は、以下の原則を守ってください：

1. **ID不変性**：一度付与したIDは絶対に変更しない
2. **順序維持**：パーツ追加は配列の最後、削除は該当パーツのみ
3. **検証実行**：必ず`validate-ids`と`test`を実行
4. **ドキュメント化**：変更内容をコミットメッセージに記載

これらの原則を守ることで、既存データとの互換性を維持しながら、新しいパーツデータを追加できます。
