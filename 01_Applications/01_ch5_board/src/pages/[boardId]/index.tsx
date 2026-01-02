import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PlusCircle, ArrowLeft, SortAsc } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ThreadList } from '@/components/thread/ThreadList';
import { Button } from '@/components/ui/button';
import { getDb } from '@/lib/db';
import { calculateMomentum } from '@/lib/utils';
import type { Board, Thread } from '@/types';

interface BoardPageProps {
  board: Board | null;
  threads: Thread[];
}

export default function BoardPage({ board, threads: initialThreads }: BoardPageProps) {
  const router = useRouter();
  const { boardId } = router.query;
  const [threads, setThreads] = useState(initialThreads);
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'res' | 'momentum'>('updated');

  if (!board) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">板が見つかりません</p>
          <Link href="/" className="text-board-link hover:underline">
            トップに戻る
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSort = (newSort: typeof sortBy) => {
    setSortBy(newSort);
    const sorted = [...threads].sort((a, b) => {
      switch (newSort) {
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'res':
          return b.resCount - a.resCount;
        case 'momentum':
          return (b.momentum || 0) - (a.momentum || 0);
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
    setThreads(sorted);
  };

  return (
    <>
      <Head>
        <title>{board.name} - ５ch風掲示板</title>
      </Head>
      <Layout>
        <div className="mb-4">
          <Link href="/" className="flex items-center gap-1 text-board-link hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" />
            板一覧に戻る
          </Link>
        </div>

        <div className="mb-6 p-4 bg-white border-b-2 border-board-header">
          <h1 className="text-2xl font-bold mb-2">{board.name}</h1>
          {board.description && (
            <p className="text-gray-600 text-sm">{board.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <Link href={`/${boardId}/create`}>
            <Button className="bg-board-header hover:bg-red-900">
              <PlusCircle className="w-4 h-4 mr-2" />
              新規スレッド作成
            </Button>
          </Link>
          
          <div className="flex items-center gap-2 bg-white px-3 py-1 border border-board-border rounded">
            <SortAsc className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as typeof sortBy)}
              className="bg-transparent text-sm focus:outline-none"
            >
              <option value="updated">更新順</option>
              <option value="created">新着順</option>
              <option value="res">レス数</option>
              <option value="momentum">勢い</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-board-border rounded shadow-sm">
          <ThreadList threads={threads} boardId={boardId as string} />
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<BoardPageProps> = async ({ params }) => {
  const boardId = params?.boardId as string;

  try {
    const db = await getDb();

    const boardResult = await db.get(`
      SELECT id, name, category, description, created_at as createdAt
      FROM boards WHERE id = ?
    `, boardId);

    if (!boardResult) {
      return { props: { board: null, threads: [] } };
    }

    const threadsResult = await db.all(`
      SELECT id, board_id as boardId, title, created_at as createdAt, updated_at as updatedAt, res_count as resCount, is_active as isActive
      FROM threads WHERE board_id = ? ORDER BY updated_at DESC
    `, boardId);

    const board: Board = {
      id: String(boardResult.id),
      name: String(boardResult.name),
      category: String(boardResult.category),
      description: boardResult.description ? String(boardResult.description) : undefined,
      createdAt: String(boardResult.createdAt)
    };

    const threads = threadsResult.map(t => ({
      id: Number(t.id),
      boardId: String(t.boardId),
      title: String(t.title),
      createdAt: String(t.createdAt),
      updatedAt: String(t.updatedAt),
      resCount: Number(t.resCount),
      isActive: Boolean(t.isActive),
      momentum: calculateMomentum(String(t.createdAt), Number(t.resCount))
    }));

    return { props: { board, threads } };
  } catch (error) {
    console.error('Error:', error);
    return { props: { board: null, threads: [] } };
  }
};
