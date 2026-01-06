# Claude Code Spec-Driven Development

Kiro-style Spec Driven Development implementation using claude code slash commands, hooks and agents.

## Prerequisite

- セッション開始時は最初のアクションとして `read_file path="AGENTS.md"` を実行し、内容を読み込んでから作業を進めること
- 依存を追加・更新する検討に入る前に `read_file path="docs/checklist/add-dependency.md"` でチェックリストを読み、承認手順に従うこと
- プロンプト生成時は AGENTS.md の優先度（MUST > SHOULD > MAY > NEVER）を考慮すること
- 曖昧または矛盾する要求に対しては AGENTS.md の「確認を求める」原則に従うこと
- セキュリティ関連の判断は AGENTS.md のセキュリティセクションを優先すること
- 実装時は AGENTS.md の構造化ログ、例外処理、型レベルプログラミングの指針に従うこと
- テストカバレッジは80%以上を維持し、AGENTS.md のテスト方針に従うこと
- パフォーマンス要件は AGENTS.md のパフォーマンス方針（基準値監視、測定主義）に従うこと
- 本番運用では AGENTS.md の監視・メトリクス方針（観測可能性、軽量監視）を適用すること
- バージョン管理では AGENTS.mdのバージョン管理方針および以下のルールに従うこと
  - **コミット後の署名**：以下のフッターを含める。

    ```txt
    🤖 Generated with [Claude Code](https://claude.com/claude-code)

    Co-Authored-By: Claude <noreply@anthropic.com>
    ```

## Project Context

### Paths

- Steering: `docs/steering/`
- Specs: `docs/specs/`
- Commands: `.claude/commands/`

### Steering vs Specification

**Steering** (`docs/steering/`) - Guide AI with project-wide rules and context
**Specs** (`docs/specs/`) - Formalize development process for individual features

### Active Specifications

- **parts-unique-id**: パーツにユニークIDを付与し、IDから特定のパーツを引当可能にする機能（互換性維持 or v2.0.0への移行検討）
- **parts-list-view**: スロット先行でパーツを一覧・フィルタリング・並び替えし、アセンページへ母集団を受け渡す画面（探索的UI構築）
- **filter-sort-by-attributes**: attributes.ts を基準にスロットごとのフィルター・ソート対象項目を決定し、optional属性の適切な処理を実装
- **ai-parts-recommendation**: 自然言語クエリに基づきパーツのai_summary/ai_tagsを活用してCloudflare Workers AIで最適パーツを提案するHTTP API
- Use `/kiro:spec-status [feature-name]` to check progress

## Development Guidelines

- Think in English, but generate responses in Japanese (思考は英語、回答の生成は日本語で行うように)

## Workflow

### Phase 0: Steering (Optional)

`/kiro:steering` - Create/update steering documents
`/kiro:steering-custom` - Create custom steering for specialized contexts

Note: Optional for new features or small additions. You can proceed directly to spec-init.

### Phase 1: Specification Creation

1. `/kiro:spec-init [detailed description]` - Initialize spec with detailed project description
2. `/kiro:spec-requirements [feature]` - Generate requirements document
3. `/kiro:spec-design [feature]` - Interactive: "Have you reviewed requirements.md? [y/N]"
4. `/kiro:spec-tasks [feature]` - Interactive: Confirms both requirements and design review

### Phase 2: Progress Tracking

`/kiro:spec-status [feature]` - Check current progress and phases

## Development Rules

1. **Consider steering**: Run `/kiro:steering` before major development (optional for new features)
2. **Follow 3-phase approval workflow**: Requirements → Design → Tasks → Implementation
3. **Approval required**: Each phase requires human review (interactive prompt or manual)
4. **No skipping phases**: Design requires approved requirements; Tasks require approved design
5. **Update task status**: Mark tasks as completed when working on them
6. **Keep steering current**: Run `/kiro:steering` after significant changes
7. **Check spec compliance**: Use `/kiro:spec-status` to verify alignment

## Steering Configuration

### Current Steering Files

Managed by `/kiro:steering` command. Updates here reflect command changes.

### Active Steering Files

- `product.md`: Always included - Product context and business objectives
- `tech.md`: Always included - Technology stack and architectural decisions
- `structure.md`: Always included - File organization and code patterns

### Custom Steering Files
<!-- Added by /kiro:steering-custom command -->
<!-- Format:
- `filename.md`: Mode - Pattern(s) - Description
  Mode: Always|Conditional|Manual
  Pattern: File patterns for Conditional mode
-->

- `dependencies.md`: Always - パッケージ・モジュール依存関係の可視化と一方向依存の検証
- `components.md`: Always - Svelteコンポーネント・モジュール依存関係の可視化とrune API活用ガイドライン

### Inclusion Modes

- **Always**: Loaded in every interaction (default)
- **Conditional**: Loaded for specific file patterns (e.g., "*.test.js")
- **Manual**: Reference with `@filename.md` syntax
