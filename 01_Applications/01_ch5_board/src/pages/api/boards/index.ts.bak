import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';
import type { ApiResponse, Board } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Board[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const db = await getDb();
    const boards = await db.all(`
      SELECT 
        id,
        name,
        category,
        description,
        created_at as createdAt
      FROM boards
      ORDER BY category, name
    `) as Board[];

    return res.status(200).json({ success: true, data: boards });
  } catch (error) {
    console.error('Error fetching boards:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
