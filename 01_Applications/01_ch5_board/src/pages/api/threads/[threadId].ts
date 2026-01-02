import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';
import type { ApiResponse, ThreadDetail, Response } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ThreadDetail>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { threadId } = req.query;

    if (!threadId || typeof threadId !== 'string') {
      return res.status(400).json({ success: false, error: 'threadId is required' });
    }

    const db = await getDb();

    // スレッド情報取得
    const thread = await db.get(`
      SELECT 
        t.id,
        t.board_id as boardId,
        t.title,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        t.res_count as resCount,
        t.is_active as isActive,
        b.name as boardName
      FROM threads t
      JOIN boards b ON t.board_id = b.id
      WHERE t.id = ?
    `, [threadId]);

    if (!thread) {
      return res.status(404).json({ success: false, error: 'Thread not found' });
    }

    // レス一覧取得
    const responses = await db.all(`
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
      WHERE thread_id = ?
      ORDER BY res_number ASC
    `, [threadId]) as Response[];

    const threadDetail: ThreadDetail = {
      id: Number(thread.id),
      boardId: String(thread.boardId),
      title: String(thread.title),
      createdAt: String(thread.createdAt),
      updatedAt: String(thread.updatedAt),
      resCount: Number(thread.resCount),
      boardName: String(thread.boardName),
      isActive: Boolean(thread.isActive),
      responses
    };

    return res.status(200).json({ success: true, data: threadDetail });
  } catch (error) {
    console.error('Error fetching thread:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
