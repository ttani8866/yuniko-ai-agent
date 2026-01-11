# テキスト生成マーケットプレイス

クラウドワークスAIのようなテキスト生成ツールのマーケットプレイスです。
プロンプト定義（ツール）を切り替えて、様々な用途に特化したテキスト生成が行えます。

## 機能

- **ツール選択**: 複数のプリセットツールから目的に合ったものを選択
- **テキスト生成**: Google Gemini API を使用した高品質なテキスト生成
- **カテゴリフィルター**: ツールをカテゴリで絞り込み

## 構成説明

### なぜ Next.js (App Router) を選んだか

1. **API Routes 統合**: フロントエンドとバックエンド（API）を1つのプロジェクトで管理できる
2. **Server Components**: 初期表示のパフォーマンス向上
3. **環境変数管理**: `.env.local` のサポートが組み込み
4. **開発体験**: HMR（Hot Module Replacement）による快適な開発

### なぜ Gemini API を選んだか

1. **無料枠**: 学習・開発用途では十分な無料枠がある
2. **日本語対応**: 日本語の入出力に優れている
3. **簡単な統合**: `@google/generative-ai` パッケージで簡単に統合可能

### ディレクトリ構成

```
src/
├── app/
│   ├── api/generate/route.ts  # Gemini API エンドポイント
│   ├── globals.css            # グローバルスタイル
│   ├── layout.tsx             # ルートレイアウト
│   └── page.tsx               # メインページ
├── components/
│   ├── Header.tsx             # ヘッダーコンポーネント
│   ├── ToolCard.tsx           # ツール選択カード
│   ├── GeneratorForm.tsx      # 入力フォーム
│   └── OutputDisplay.tsx      # 出力表示
└── lib/
    └── tools.ts               # ツール定義
```

### データフロー

```
ユーザー入力
    ↓
GeneratorForm (Client Component)
    ↓
POST /api/generate
    ↓
Gemini API (Server-side)
    ↓
OutputDisplay (Client Component)
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`env.example` を参考に `.env.local` を作成：

```bash
GEMINI_API_KEY=your_api_key_here
```

API Key は [Google AI Studio](https://aistudio.google.com/app/apikey) で取得できます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセス可能になります。

## ツールの追加方法

`src/lib/tools.ts` の `tools` 配列に新しいツール定義を追加します：

```typescript
{
  id: 'unique-id',
  name: 'ツール名',
  description: '説明文',
  icon: '🎯',
  category: 'カテゴリ名',
  systemPrompt: `ここにプロンプトを記述...`,
  inputPlaceholder: 'プレースホルダーテキスト',
  usageCount: 0,
}
```

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **スタイリング**: Tailwind CSS
- **LLM API**: Google Gemini (gemini-1.5-flash)
- **言語**: TypeScript

## 今後の拡張案

- [ ] ツールのカスタム作成機能
- [ ] 生成履歴の保存
- [ ] お気に入りツール機能
- [ ] 出力のマークダウンレンダリング強化
- [ ] 複数の LLM 切り替え機能

