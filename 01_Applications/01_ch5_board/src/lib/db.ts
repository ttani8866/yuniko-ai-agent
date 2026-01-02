import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { initSchema, seedData } from './schema';

// データベースファイルのパス
const dbPath = path.join(process.cwd(), 'data', 'board.db');

// シングルトンでDB接続を管理
let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    // dataディレクトリが無ければ作成
    const fs = require('fs');
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await db.exec('PRAGMA journal_mode = WAL');
    
    // テーブルが存在しなければ初期化
    const tableCheck = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='boards'"
    );
    
    if (!tableCheck) {
      await initSchema(db);
      await seedData(db);
    }
  }
  return db;
}

// DB接続を閉じる（必要に応じて）
export async function closeDb(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
