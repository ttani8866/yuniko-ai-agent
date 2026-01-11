# グルメナビ - 食べログ風口コミサイト

Next.js + shadcn/ui + Framer Motionで構築された、食べログ風のレストラン口コミサイトです。

## 機能

- **レストラン検索**: エリア、ジャンル、予算での絞り込み検索
- **レストラン詳細**: 店舗情報と口コミの閲覧
- **口コミ投稿**: 評価付きの口コミ投稿機能
- **レスポンシブデザイン**: モバイルファーストのUIデザイン

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **アニメーション**: Framer Motion
- **アイコン**: Lucide React
- **言語**: TypeScript

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番サーバーの起動
npm run start
```

## プロジェクト構造

```
src/
├── app/                    # App Routerのページ
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # トップページ
│   ├── globals.css         # グローバルCSS
│   └── restaurant/
│       └── [id]/
│           └── page.tsx    # レストラン詳細ページ
├── components/             # コンポーネント
│   ├── ui/                 # shadcn/uiコンポーネント
│   ├── Header.tsx          # ヘッダー
│   ├── Footer.tsx          # フッター
│   ├── RestaurantCard.tsx  # レストランカード
│   ├── ReviewCard.tsx      # 口コミカード
│   ├── ReviewForm.tsx      # 口コミ投稿フォーム
│   ├── SearchBar.tsx       # 検索バー
│   └── StarRating.tsx      # 星評価コンポーネント
├── data/
│   └── mockData.ts         # モックデータ
├── lib/
│   └── utils.ts            # ユーティリティ関数
└── types/
    └── index.ts            # TypeScript型定義
```

## デザイン仕様

### カラーパレット
- **プライマリ**: オレンジ (#f97316)
- **背景**: 白 / グレー50
- **テキスト**: グレー900 / グレー600

### アニメーション
- 店舗カード: hover時にscale 1.02 + shadow変化
- 口コミ投稿: 投稿後にフェードイン (opacity 0→1, duration 0.3s)
- ページ読み込み: 軽いフェードトランジション

### レスポンシブ
- モバイル: 1列グリッド
- タブレット: 2列グリッド
- デスクトップ: 3列グリッド

