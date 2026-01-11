/**
 * バイブコーディング学習ロードマップデータ
 * 
 * 構造:
 * - level: レベル番号
 * - title: レベル名
 * - emoji: アイコン
 * - color: テーマカラー
 * - items: 学習項目の配列
 *   - id: 一意のID（レベル-番号）
 *   - text: 項目名
 *   - tips: ヒント・補足説明
 */

const roadmapData = [
  {
    level: 1,
    title: "入門編",
    subtitle: "AIとの対話を始めよう",
    emoji: "📗",
    color: "#22c55e",
    items: [
      { 
        id: "1-1", 
        text: "AIとの対話の基本を理解する", 
        tips: "ChatGPT/Claudeで日常的な会話をしてみよう。AIの得意・不得意を体感する。" 
      },
      { 
        id: "1-2", 
        text: "プロンプトの書き方を学ぶ", 
        tips: "具体的に、段階的に指示する。「〇〇として、△△を作って」のような形式。" 
      },
      { 
        id: "1-3", 
        text: "簡単なHTML生成を試す", 
        tips: "「シンプルな自己紹介ページのHTMLを作って」と依頼してみよう。" 
      },
      { 
        id: "1-4", 
        text: "CSSでスタイリングを依頼する", 
        tips: "色、フォント、余白などを具体的に指定。「青系で、モダンな感じ」など。" 
      },
      { 
        id: "1-5", 
        text: "JavaScriptの基本動作を生成", 
        tips: "「ボタンをクリックしたらメッセージを表示」のような簡単な処理から。" 
      }
    ]
  },
  {
    level: 2,
    title: "基礎編",
    subtitle: "Webアプリの基本構造を学ぶ",
    emoji: "📘",
    color: "#3b82f6",
    items: [
      { 
        id: "2-1", 
        text: "コンポーネント分割を理解する", 
        tips: "機能ごとにファイルを分ける。ヘッダー、フッター、メインコンテンツなど。" 
      },
      { 
        id: "2-2", 
        text: "APIの概念を学ぶ", 
        tips: "外部サービスとのデータやり取り。fetchを使った通信を試す。" 
      },
      { 
        id: "2-3", 
        text: "データの永続化を実装", 
        tips: "localStorage/sessionStorageでブラウザにデータを保存する方法。" 
      },
      { 
        id: "2-4", 
        text: "エラーハンドリングを追加", 
        tips: "try-catch、入力チェック。想定外の動作に対応するコードを書く。" 
      },
      { 
        id: "2-5", 
        text: "レスポンシブデザインを適用", 
        tips: "メディアクエリ、Flexbox/Gridでスマホでも見やすいUIを作る。" 
      }
    ]
  },
  {
    level: 3,
    title: "応用編",
    subtitle: "本格的な開発スキルを身につける",
    emoji: "📙",
    color: "#f97316",
    items: [
      { 
        id: "3-1", 
        text: "フレームワークを使う", 
        tips: "React/Vue/Next.jsなど。コンポーネントベースの開発を体験。" 
      },
      { 
        id: "3-2", 
        text: "認証機能を実装", 
        tips: "ログイン/ログアウト、ユーザー管理。Firebase Auth等を活用。" 
      },
      { 
        id: "3-3", 
        text: "データベース連携", 
        tips: "Supabase/Firebase/PlanetScaleなどのBaaSを使ったデータ管理。" 
      },
      { 
        id: "3-4", 
        text: "デプロイを自動化", 
        tips: "Vercel/Netlify/Renderで公開。GitHubと連携した自動デプロイ。" 
      },
      { 
        id: "3-5", 
        text: "テストコードを書く", 
        tips: "Jest/Vitestで単体テスト。品質を担保する習慣をつける。" 
      }
    ]
  },
  {
    level: 4,
    title: "実践編",
    subtitle: "自分のアプリを世に出す",
    emoji: "📕",
    color: "#ef4444",
    items: [
      { 
        id: "4-1", 
        text: "オリジナルアプリを企画", 
        tips: "自分の課題を解決するアプリを考える。小さく始めて徐々に拡張。" 
      },
      { 
        id: "4-2", 
        text: "要件定義をAIと行う", 
        tips: "機能一覧、画面設計、データ構造をAIと一緒に整理する。" 
      },
      { 
        id: "4-3", 
        text: "段階的に実装を進める", 
        tips: "MVP（最小限の製品）を作り、フィードバックを得ながら改善。" 
      },
      { 
        id: "4-4", 
        text: "ユーザーテストを実施", 
        tips: "他の人に使ってもらい、使いにくい点や改善点を発見。" 
      },
      { 
        id: "4-5", 
        text: "改善サイクルを回す", 
        tips: "フィードバック→修正→再テストのサイクルを繰り返す。" 
      }
    ]
  }
];

// モジュールとして使う場合
if (typeof module !== 'undefined' && module.exports) {
  module.exports = roadmapData;
}

