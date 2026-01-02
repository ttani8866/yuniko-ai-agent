import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Layout } from '@/components/layout/Layout';
import { BoardList } from '@/components/board/BoardList';
import { getDb } from '@/lib/db';
import type { Board } from '@/types';

interface HomeProps {
  boards: Board[];
}

export default function Home({ boards }: HomeProps) {
  return (
    <>
      <Head>
        <title>５ch風掲示板 - AI Agent Edition</title>
        <meta name="description" content="匿名掲示板" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="mb-6 p-4 bg-white border-b-2 border-board-header">
          <h1 className="text-2xl font-bold mb-2">板一覧</h1>
          <p className="text-gray-600 text-sm">
            会員登録不要！匿名で気軽に書き込みできます
          </p>
        </div>
        <BoardList boards={boards} />
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
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

    return {
      props: { boards },
    };
  } catch (error) {
    console.error('Error fetching boards:', error);
    return {
      props: { boards: [] },
    };
  }
};
