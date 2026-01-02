import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ThreadForm } from '@/components/thread/ThreadForm';
import { getDb } from '@/lib/db';
import type { Board } from '@/types';

interface CreateThreadPageProps {
  board: Board | null;
}

export default function CreateThreadPage({ board }: CreateThreadPageProps) {
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
        <title>スレッド作成 - {board.name} - 5ch風掲示板</title>
      </Head>
      <Layout>
        {/* パンくず */}
        <div className="mb-4">
          <Link 
            href={`/${board.id}`} 
            className="flex items-center gap-1 text-board-link hover:underline text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {board.name}に戻る
          </Link>
        </div>

        <ThreadForm boardId={board.id} />
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<CreateThreadPageProps> = async ({ params }) => {
  const boardId = params?.boardId as string;

  try {
    const db = await getDb();

    const board = await db.get(`
      SELECT 
        id,
        name,
        category,
        description,
        created_at as createdAt
      FROM boards
      WHERE id = ?
    `, boardId) as Board | undefined;

    return {
      props: { board: board || null },
    };
  } catch (error) {
    console.error('Error fetching board:', error);
    return {
      props: { board: null },
    };
  }
};

