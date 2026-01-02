import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { BoardList } from '@/components/board/BoardList';
import type { Board } from '@/types';

// 静的書き出し用のダミーデータ
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
        <title>5ch風掲示板</title>
        <meta name="description" content="匿名掲示板 (Static Demo)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">板一覧 (静的デモ)</h1>
          <p className="text-gray-600">
            ※デプロイ確認用の静的ページです。データベースとの通信は行われません。
          </p>
        </div>
        <BoardList boards={DUMMY_BOARDS} />
      </Layout>
    </>
  );
}

