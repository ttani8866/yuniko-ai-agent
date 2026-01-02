import { Database } from 'sqlite';

// テーブル作成SQL
const createTables = `
-- 板テーブル
CREATE TABLE IF NOT EXISTS boards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- スレッドテーブル
CREATE TABLE IF NOT EXISTS threads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  res_count INTEGER DEFAULT 1,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (board_id) REFERENCES boards(id)
);

-- レステーブル
CREATE TABLE IF NOT EXISTS responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id INTEGER NOT NULL,
  res_number INTEGER NOT NULL,
  name TEXT DEFAULT '名無しさん',
  mail TEXT,
  body TEXT NOT NULL,
  image_url TEXT,
  user_id TEXT,
  ip_hash TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (thread_id) REFERENCES threads(id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_threads_board_id ON threads(board_id);
CREATE INDEX IF NOT EXISTS idx_threads_updated_at ON threads(updated_at);
CREATE INDEX IF NOT EXISTS idx_responses_thread_id ON responses(thread_id);
`;

// 初期データ
const seedBoards = [
  { id: 'news', name: 'ニュース速報', category: 'ニュース', description: '最新ニュースを語るスレ' },
  { id: 'zatsudan', name: 'なんでも雑談', category: '雑談', description: '雑談なんでもOK' },
  { id: 'tech', name: '技術・プログラミング', category: '専門', description: 'プログラミング関連の話題' },
  { id: 'game', name: 'ゲーム総合', category: '趣味', description: 'ゲーム全般について' },
  { id: 'music', name: '音楽総合', category: '趣味', description: '音楽全般について' },
];

// サンプルスレッドとレス
const sampleThreads = [
  {
    boardId: 'zatsudan',
    title: 'はじめてのスレッド',
    responses: [
      { name: '名無しさん', body: 'テスト投稿です' },
      { name: '名無しさん', body: '>>1\nいい感じですね' },
      { name: '名無しさん', body: '動作確認' },
    ]
  },
  {
    boardId: 'tech',
    title: 'プログラミング初心者スレ Part1',
    responses: [
      { name: '名無しさん', body: 'プログラミング初心者のためのスレッドです\n質問歓迎' },
      { name: '名無しさん', body: '>>1\nスレ立て乙' },
    ]
  },
  {
    boardId: 'game',
    title: '最近やってるゲーム',
    responses: [
      { name: '名無しさん', body: 'みんな何やってる？' },
    ]
  },
];

export async function initSchema(db: Database): Promise<void> {
  await db.exec(createTables);
}

export async function seedData(db: Database): Promise<void> {
  // 板の初期データ挿入
  for (const board of seedBoards) {
    await db.run(
      `INSERT OR IGNORE INTO boards (id, name, category, description) VALUES (?, ?, ?, ?)`,
      [board.id, board.name, board.category, board.description]
    );
  }

  // サンプルスレッドとレス
  for (const thread of sampleThreads) {
    const result = await db.run(
      `INSERT INTO threads (board_id, title, res_count) VALUES (?, ?, ?)`,
      [thread.boardId, thread.title, thread.responses.length]
    );
    const threadId = result.lastID;

    if (threadId) {
      for (let i = 0; i < thread.responses.length; i++) {
        const res = thread.responses[i];
        await db.run(
          `INSERT INTO responses (thread_id, res_number, name, body, user_id) VALUES (?, ?, ?, ?, ?)`,
          [threadId, i + 1, res.name, res.body, generateUserId('127.0.0.1')]
        );
      }
    }
  }
}

// ユーザーID生成（簡易版）
function generateUserId(ip: string): string {
  const crypto = require('crypto');
  const date = new Date().toISOString().split('T')[0];
  const hash = crypto.createHash('sha256').update(ip + date).digest('hex');
  return hash.substring(0, 8);
}
