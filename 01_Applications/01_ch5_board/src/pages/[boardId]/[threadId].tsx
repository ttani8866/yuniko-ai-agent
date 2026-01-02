import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ResponseList } from '@/components/response/ResponseList';

// ダミーデータ
const DUMMY_RESPONSES = [
  { id: 1, threadId: 1, resNumber: 1, name: '名無しさん', body: 'テスト投稿です', createdAt: '2024/01/01 12:00:00', userId: 'abc12345' },
  { id: 2, threadId: 1, resNumber: 2, name: '名無しさん', body: '>>1\nいい感じですね', createdAt: '2024/01/01 12:05:00', userId: 'def67890' },
  { id: 3, threadId: 1, resNumber: 3, name: '名無しさん', body: '動作確認中', createdAt: '2024/01/01 12:10:00', userId: 'abc12345' },
];

export default function ThreadPage() {
  return (
    <>
      <Head>
        <title>はじめてのスレッド - 5ch風掲示板</title>
      </Head>
      <Layout>
        <div className="mb-4">
          <Link href="/zatsudan" className="flex items-center gap-1 text-board-link hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" />
            なんでも雑談に戻る
          </Link>
        </div>
        <div className="mb-4">
          <h1 className="text-xl font-bold">はじめてのスレッド (静的デモ)</h1>
        </div>
        <div className="mb-6">
          <ResponseList responses={DUMMY_RESPONSES as any} />
        </div>
        <div className="p-4 bg-gray-100 border border-gray-300 text-center text-gray-600">
          ※静的デモページのため、新しい書き込みはできません。
        </div>
      </Layout>
    </>
  );
}

// 静的エクスポート用のパス生成（デモ用に1つだけ）
export async function getStaticPaths() {
  return {
    paths: [{ params: { boardId: 'zatsudan', threadId: '1' } }],
    fallback: false,
  };
}

export async function getStaticProps() {
  return { props: {} };
}

