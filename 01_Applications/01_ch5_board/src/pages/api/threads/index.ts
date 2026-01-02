import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';
import { generateUserId, hashIp, getClientIp, calculateMomentum } from '@/lib/utils';
import type { ApiResponse, Thread, CreateThreadRequest } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Thread[] | Thread>>
) {
  const db = await getDb();

  // GET: スレッド一覧取得
  if (req.method === 'GET') {
    try {
      const { boardId, sort = 'updated' } = req.query;

      if (!boardId || typeof boardId !== 'string') {
        return res.status(400).json({ success: false, error: 'boardId is required' });
      }

      let orderBy = 'updated_at DESC';
      if (sort === 'created') orderBy = 'created_at DESC';
      if (sort === 'res') orderBy = 'res_count DESC';

      const threads = await db.all(`
        SELECT 
          id,
          board_id as boardId,
          title,
          created_at as createdAt,
          updated_at as updatedAt,
          res_count as resCount,
          is_active as isActive
        FROM threads
        WHERE board_id = ?
        ORDER BY ${orderBy}
      `, [boardId]) as Thread[];

      // 勢いを計算
      const threadsWithMomentum = threads.map(thread => ({
        ...thread,
        isActive: Boolean(thread.isActive),
        momentum: calculateMomentum(thread.createdAt, thread.resCount)
      }));

      return res.status(200).json({ success: true, data: threadsWithMomentum });
    } catch (error) {
      console.error('Error fetching threads:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  // POST: スレッド作成
  if (req.method === 'POST') {
    try {
      const { boardId, title, name, mail, body, imageUrl } = req.body as CreateThreadRequest;

      // バリデーション
      if (!boardId || !title || !body) {
        return res.status(400).json({ 
          success: false, 
          error: 'boardId, title, and body are required' 
        });
      }

      if (title.length > 48) {
        return res.status(400).json({ 
          success: false, 
          error: 'Title must be 48 characters or less' 
        });
      }

      if (body.length > 2000) {
        return res.status(400).json({ 
          success: false, 
          error: 'Body must be 2000 characters or less' 
        });
      }

      // 板の存在確認
      const board = await db.get('SELECT id FROM boards WHERE id = ?', [boardId]);
      if (!board) {
        return res.status(404).json({ success: false, error: 'Board not found' });
      }

      const ip = getClientIp(req);
      const userId = generateUserId(ip);
      const ipHash = hashIp(ip);

      let threadId: number;

      // 手動トランザクション
      await db.run('BEGIN TRANSACTION');
      try {
        const threadResult = await db.run(`
          INSERT INTO threads (board_id, title, res_count)
          VALUES (?, ?, 1)
        `, [boardId, title]);
        
        threadId = threadResult.lastID!;

        await db.run(`
          INSERT INTO responses (thread_id, res_number, name, mail, body, image_url, user_id, ip_hash)
          VALUES (?, 1, ?, ?, ?, ?, ?, ?)
        `, [
          threadId,
          name || '名無しさん',
          mail || null,
          body,
          imageUrl || null,
          userId,
          ipHash
        ]);

        await db.run('COMMIT');
      } catch (err) {
        await db.run('ROLLBACK');
        throw err;
      }

      const newThread = await db.get(`
        SELECT 
          id,
          board_id as boardId,
          title,
          created_at as createdAt,
          updated_at as updatedAt,
          res_count as resCount,
          is_active as isActive
        FROM threads
        WHERE id = ?
      `, [threadId]) as Thread;

      return res.status(201).json({ success: true, data: newThread });
    } catch (error) {
      console.error('Error creating thread:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
