import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';
import { generateUserId, hashIp, getClientIp } from '@/lib/utils';
import type { ApiResponse, Response, CreateResponseRequest } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Response>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { threadId, name, mail, body, imageUrl } = req.body as CreateResponseRequest;

    // バリデーション
    if (!threadId || !body) {
      return res.status(400).json({ 
        success: false, 
        error: 'threadId and body are required' 
      });
    }

    if (body.length > 2000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Body must be 2000 characters or less' 
      });
    }

    const db = await getDb();

    // スレッドの存在と状態確認
    const thread = await db.get(`
      SELECT id, res_count as resCount, is_active as isActive
      FROM threads
      WHERE id = ?
    `, [threadId]) as { id: number; resCount: number; isActive: number } | undefined;

    if (!thread) {
      return res.status(404).json({ success: false, error: 'Thread not found' });
    }

    if (!thread.isActive) {
      return res.status(400).json({ 
        success: false, 
        error: 'This thread is closed (dat落ち)' 
      });
    }

    // 1000レス制限チェック
    if (thread.resCount >= 1000) {
      // スレッドを閉じる
      await db.run('UPDATE threads SET is_active = 0 WHERE id = ?', [threadId]);
      return res.status(400).json({ 
        success: false, 
        error: 'This thread has reached 1000 responses' 
      });
    }

    const ip = getClientIp(req);
    const userId = generateUserId(ip);
    const ipHash = hashIp(ip);
    const newResNumber = thread.resCount + 1;

    // sageチェック（メール欄に"sage"があればupdated_atを更新しない）
    const isSage = mail?.toLowerCase() === 'sage';

    let responseId: number;

    // 手動トランザクション
    await db.run('BEGIN TRANSACTION');
    try {
      const result = await db.run(`
        INSERT INTO responses (thread_id, res_number, name, mail, body, image_url, user_id, ip_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        threadId,
        newResNumber,
        name || '名無しさん',
        mail || null,
        body,
        imageUrl || null,
        userId,
        ipHash
      ]);
      
      responseId = result.lastID!;

      if (isSage) {
        await db.run(`
          UPDATE threads 
          SET res_count = res_count + 1
          WHERE id = ?
        `, [threadId]);
      } else {
        await db.run(`
          UPDATE threads 
          SET res_count = res_count + 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [threadId]);
      }

      // 1000レス到達時の処理
      await db.run(`
        UPDATE threads SET is_active = 0 WHERE id = ? AND res_count >= 1000
      `, [threadId]);

      await db.run('COMMIT');
    } catch (err) {
      await db.run('ROLLBACK');
      throw err;
    }

    const newResponse = await db.get(`
      SELECT 
        id,
        thread_id as threadId,
        res_number as resNumber,
        name,
        mail,
        body,
        image_url as imageUrl,
        user_id as userId,
        created_at as createdAt
      FROM responses
      WHERE id = ?
    `, [responseId]) as Response;

    return res.status(201).json({ success: true, data: newResponse });
  } catch (error) {
    console.error('Error creating response:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
