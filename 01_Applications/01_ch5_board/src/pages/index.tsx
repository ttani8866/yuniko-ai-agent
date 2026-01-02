import Head from 'next/head';
import { Layout } from '@/components/layout/Layout';
import { BoardList } from '@/components/board/BoardList';
import type { Board } from '@/types';

// Vercelデプロイ用に固定の板データを用意（DBがないため）
const DUMMY_BOARDS: Board[] = [
  { id: 'news', name: 'ニュース速報', category: 'ニュース', description: '最新ニュースを語るスレ', createdAt: '2024/01/01' },
  { id: 'zatsudan', name: 'なんでも雑談', category: '雑談', description: '雑談なんでもOK', createdAt: '2024/01/01' },
  { id: 'tech', name: '技術・プログラミング', category: '専門', description: 'プログラミング関連の話題', createdAt: '2024/01/01' },
  { id: 'game', name: 'ゲーム総合', category: '趣味', description: 'ゲーム全般について', createdAt: '2024/01/01' },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>５ch風掲示板 - AI Agent Edition</title>
        <meta name="description" content="匿名掲示板" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="mb-6 p-4 bg-white border-b-2 border-board-header shadow-sm">
          <h1 className="text-2xl font-bold mb-2">板一覧</h1>
          <p className="text-gray-600 text-sm">
            会員登録不要！匿名で気軽に書き込みできます
          </p>
        </div>
        <BoardList boards={DUMMY_BOARDS} />
      </Layout>
    </>
  );
}
