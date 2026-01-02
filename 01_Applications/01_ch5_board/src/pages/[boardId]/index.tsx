import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import type { Board, Thread } from '@/types';

// ダミーデータ
const DUMMY_THREADS: Thread[] = [
  { id: 1, boardId: 'zatsudan', title: 'はじめてのスレッド', createdAt: '2024/01/01', updatedAt: '2024/01/01', resCount: 3, isActive: true, momentum: 10 },
  { id: 2, boardId: 'zatsudan', title: 'テストスレ', createdAt: '2024/01/01', updatedAt: '2024/01/01', resCount: 1, isActive: true, momentum: 2 },
];

export default function BoardPage({ boardId }: { boardId: string }) {
  return (
    <>
      <Head>
        <title>なんでも雑談 - 5ch風掲示板</title>
      </Head>
      <Layout>
        <div className="mb-4">
          <Link href="/" className="flex items-center gap-1 text-board-link hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" />
            板一覧に戻る
          </Link>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">なんでも雑談 (静的デモ)</h1>
        </div>
        <div className="bg-white border border-board-border rounded p-4">
          <ul className="space-y-2">
            {DUMMY_THREADS.map((thread) => (
              <li key={thread.id}>
                <Link href={`/zatsudan/${thread.id}`} className="text-board-link hover:underline">
                  {thread.id}: {thread.title} ({thread.resCount})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    </>
  );
}

// 静的エクスポート用のパス生成（デモ用にzatsudanのみ）
export async function getStaticPaths() {
  return {
    paths: [{ params: { boardId: 'zatsudan' } }],
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  return {
    props: { boardId: params.boardId },
  };
}

