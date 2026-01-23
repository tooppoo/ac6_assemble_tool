import { problemCaptionKeys } from '$lib/view/index/report/model/report'

export const jaPageIndex = {
  command: {
    random: {
      label: 'ランダム設定',
      description: 'ランダムアセンの<br/>条件を設定する',
    },
    resetLock: {
      label: '全ロック解除',
      description: 'ロックを全て解除する',
    },
    partsList: {
      label: 'パーツ探索',
      description: 'フィルタUIを開く',
    },
    share: {
      label: '共有',
      description: "$t(share:command.target.caption, {'what': '現在のアセン'})",
      text: {
        label: 'コピー',
        description: '現在のアセンブルをコピー',
      },
    },
    report: {
      edit: 'ステータス表示を編集する',
      save: 'ステータス表示を保存する',
      reset: '元に戻す',
      showAll: '全て表示する',
      show: '表示する',
      hide: '表示しない',
    },
    store: {
      label: 'アセン保存',
      description: 'アセンデータを<br/>保存・適用する',
    },
    about: {
      label: 'ツール概要',
      description: 'About ページを開く',
    },
  },
  report: {
    bug: '不具合を報告する',
    request: '改修を依頼する',
    block: {
      [problemCaptionKeys.loadLimitOver]: '積載上限超過',
      [problemCaptionKeys.armsLoadLimitOver]: '腕部積載上限超過',
      [problemCaptionKeys.insufficientEnOutput]: 'EN出力不足',
    },
  },
  language: {
    label: '言語',
  },
  aboutSection: {
    summary: 'このアプリについて',
    body: {
      p1: 'AC6 ASSEMBLE TOOL は、ARMORED CORE Ⅵ FIRES OF RUBICON のアセンブル構築を手軽に行うために設計された非公式の Web アプリケーションです。機体パーツを自由に入れ替えながら、最終的なステータスを即座に確認できるシンプルな構造を採用しており、複雑な比較機能や高度な最適化ではなく「どこでもすぐにアセンできる」体験を重視しています。モバイル環境でも快適に操作できることを目標にしており、隙間時間でも気軽にビルド案を試せる点が特徴です。',
      p2: 'アセン機能は直感的な操作に焦点を当てていますが、より詳細なパーツ絞り込みや一覧の確認が必要な場合は、別途提供しているパーツリスト機能を活用できます。これにより、プレイスタイルに合わせた機体構築の検討を効率的に進められます。',
      p3: '本ツールは FromSoftware およびバンダイナムコエンターテインメントとは関係のないファンメイドの非公式ツールであり、ゲームプレイの補助として自由にご利用いただけます。',
    },
  },
}
