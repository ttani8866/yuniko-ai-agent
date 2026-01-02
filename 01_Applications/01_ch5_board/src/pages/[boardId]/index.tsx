import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, SortAsc } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ThreadList } from '@/components/thread/ThreadList';
import { Button } from '@/components/ui/button';
import type { Board, Thread } from '@/types';

// Vercelデプロイ用のダミーデータ
const DUMMY_THREADS: Record<string, { board: Board, threads: Thread[] }> = {
  zatsudan: {
    board: { id: 'zatsudan', name: 'なんでも雑談', category: '雑談', description: '雑談なんでもOK', createdAt: '2024/01/01' },
    threads: [
      { id: 1, boardId: 'zatsudan', title: 'はじめてのスレッド', createdAt: '2024/01/01 12:00:00', updatedAt: '2024/01/01 12:00:00', resCount: 3, isActive: true, momentum: 10 },
      { id: 2, boardId: 'zatsudan', title: 'Vercelデプロイ記念スレ', createdAt: '2024/01/02 10:00:00', updatedAt: '2024/01/02 10:00:00', resCount: 1, isActive: true, momentum: 5 },
    ]
  }
};

interface BoardPageProps {
  board: Board | null;
  threads: Thread[];
}

export default function BoardPage({ board, threads }: BoardPageProps) {
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

        <div className="mb-6 p-4 bg-white border-b-2 border-board-header shadow-sm">
          <h1 className="text-2xl font-bold mb-2">{board.name}</h1>
          <p className="text-gray-600 text-sm">{board.description}</p>
        </div>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <Button className="bg-board-header hover:bg-red-900 opacity-50 cursor-not-allowed">
            <PlusCircle className="w-4 h-4 mr-2" />
            新規スレッド作成 (デモ版停止中)
          </Button>
          
          <div className="flex items-center gap-2 bg-white px-3 py-1 border border-board-border rounded text-sm text-gray-500">
            <SortAsc className="w-4 h-4" />
            <span>更新順 (固定)</span>
          </div>
        </div>

        <div className="bg-white border border-board-border rounded shadow-sm">
          <ThreadList threads={threads} boardId={board.id} />
        </div>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { boardId: 'zatsudan' } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<BoardPageProps> = async ({ params }) => {
  const boardId = params?.boardId as string;
  const data = DUMMY_THREADS[boardId];

  if (!data) {
    return { props: { board: null, threads: [] } };
  }

  return {
    props: {
      board: data.board,
      threads: data.threads,
    }
  };
};
