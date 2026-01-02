# 5ch風掲示板 実装設計書

## 技術スタック

| 項目 | 技術 |
|------|------|
| フロントエンド | Next.js (Pages Router) + TypeScript |
| バックエンド | Next.js API Routes |
| データベース | SQLite (sqlite3 + sqlite) |
| スタイリング | Tailwind CSS + shadcn/ui + Radix UI |
| アイコン | Lucide Icons |
| アニメーション | Framer Motion |

---

## プロジェクト構造

```
01_board_app/ch5_board/
├── src/
│   ├── pages/
│   │   ├── _app.tsx              # アプリケーションルート
│   │   ├── index.tsx             # トップページ（板一覧）
│   │   ├── [boardId]/
│   │   │   ├── index.tsx         # スレッド一覧
│   │   │   ├── create.tsx        # スレッド作成
│   │   │   └── [threadId].tsx    # スレッド詳細（レス一覧）
│   │   └── api/
│   │       ├── boards/
│   │       │   └── index.ts      # GET: 板一覧取得
│   │       ├── threads/
│   │       │   ├── index.ts      # GET: スレッド一覧 / POST: スレッド作成
│   │       │   └── [threadId].ts # GET: スレッド詳細
│   │       └── responses/
│   │           └── index.ts      # POST: レス投稿
│   ├── components/
│   │   ├── ui/                   # shadcn/ui コンポーネント
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── board/
│   │   │   └── BoardList.tsx     # 板一覧
│   │   ├── thread/
│   │   │   ├── ThreadList.tsx    # スレッド一覧
│   │   │   ├── ThreadForm.tsx    # スレッド作成フォーム
│   │   │   └── ThreadHeader.tsx  # スレッドヘッダー
│   │   └── response/
│   │       ├── ResponseList.tsx  # レス一覧
│   │       ├── ResponseItem.tsx  # レス単体
│   │       ├── ResponseForm.tsx  # レス投稿フォーム
│   │       └── AnchorPopup.tsx   # アンカーポップアップ
│   ├── lib/
│   │   ├── db.ts                 # SQLite接続
│   │   ├── schema.ts             # テーブル作成SQL
│   │   └── utils.ts              # ユーティリティ関数
│   ├── types/
│   │   └── index.ts              # 型定義
│   └── styles/
│       └── globals.css           # グローバルスタイル
├── data/
│   └── board.db                  # SQLiteデータベースファイル
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── components.json               # shadcn/ui設定
```

---

## データベーススキーマ

### boards テーブル
```sql
CREATE TABLE boards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### threads テーブル
```sql
CREATE TABLE threads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  res_count INTEGER DEFAULT 1,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (board_id) REFERENCES boards(id)
);
```

### responses テーブル
```sql
CREATE TABLE responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id INTEGER NOT NULL,
  res_number INTEGER NOT NULL,
  name TEXT DEFAULT '名無しさん',
  mail TEXT,
  body TEXT NOT NULL,
  user_id TEXT,
  ip_hash TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (thread_id) REFERENCES threads(id)
);
```

---

## API設計

### 板関連
| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| GET | `/api/boards` | 板一覧取得 |

### スレッド関連
| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| GET | `/api/threads?boardId=xxx` | スレッド一覧取得 |
| GET | `/api/threads/[threadId]` | スレッド詳細取得（レス含む） |
| POST | `/api/threads` | スレッド作成 |

### レス関連
| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| POST | `/api/responses` | レス投稿 |

---

## 実装する機能（MVP）

### Phase 1: 基本機能
- [x] プロジェクトセットアップ
- [ ] データベース初期化・シード
- [ ] 板一覧表示
- [ ] スレッド一覧表示
- [ ] スレッド作成
- [ ] レス一覧表示
- [ ] レス投稿

### Phase 2: 5ch風機能
- [ ] アンカー（>>数字）のリンク化
- [ ] アンカーポップアップ
- [ ] 名無しさん自動設定
- [ ] ID生成（IPベース・日替わり）
- [ ] sage機能

### Phase 3: UI/UX改善
- [ ] レスポンシブ対応
- [ ] アニメーション追加
- [ ] エラーハンドリング

---

## 初期データ（シード）

```typescript
const seedBoards = [
  { id: 'news', name: 'ニュース速報', category: 'ニュース' },
  { id: 'zatsudan', name: 'なんでも雑談', category: '雑談' },
  { id: 'tech', name: '技術・プログラミング', category: '専門' },
  { id: 'game', name: 'ゲーム総合', category: '趣味' },
  { id: 'music', name: '音楽総合', category: '趣味' },
];
```

---

## 依存パッケージ

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "better-sqlite3": "^9.0.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "^0.300.0",
    "@radix-ui/react-popover": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 起動方法

```bash
# 依存パッケージインストール
npm install

# 開発サーバー起動
npm run dev

# ブラウザで開く
# http://localhost:3000
```

---

## 実装時の注意点

1. **SQLite接続**
   - `sqlite3` と `sqlite` (Promise wrapper) を使用
   - Next.js API Routes / getServerSideProps で非同期に使用

2. **ID生成**
   - IPアドレス + 日付 をハッシュ化して8文字に短縮
   - `crypto` モジュールを使用

3. **アンカー変換**
   - 正規表現: `/>>(\d+)/g`
   - クリックでスクロール、ホバーでポップアップ

4. **日本語対応**
   - 日時フォーマット: `YYYY/MM/DD(曜) HH:mm:ss`
   - デフォルト名: `名無しさん`
