import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ResponseList } from '@/components/response/ResponseList';
import { Button } from '@/components/ui/button';
import type { Response as ResponseType } from '@/types';

// Vercelデプロイ用のダミーデータ
const DUMMY_RESPONSES: Record<string, ResponseType[]> = {
  "1": [
    { id: 1, threadId: 1, resNumber: 1, name: '名無しさん', body: 'テスト投稿です', createdAt: '2024/01/01 12:00:00', userId: 'abc12345' },
    { id: 2, threadId: 1, resNumber: 2, name: '名無しさん', body: '>>1\nいい感じですね！Vercelでも動いています。', createdAt: '2024/01/01 12:05:00', userId: 'def67890' },
    { id: 3, threadId: 1, resNumber: 3, name: '名無しさん', body: '動作確認中...', createdAt: '2024/01/01 12:10:00', userId: 'abc12345' },
  ]
};

interface ThreadPageProps {
  threadTitle: string;
  boardName: string;
  boardId: string;
  responses: ResponseType[];
}

export default function ThreadPage({ threadTitle, boardName, boardId, responses }: ThreadPageProps) {
  return (
    <>
      <Head>
        <title>{threadTitle} - {boardName} - ５ch風掲示板</title>
      </Head>
      <Layout>
        <div className="mb-4">
          <Link href={`/${boardId}`} className="flex items-center gap-1 text-board-link hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" />
            {boardName}に戻る
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-white border-b-2 border-board-header shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold">{threadTitle}</h1>
            <Button variant="outline" size="sm" className="opacity-50 cursor-not-allowed">
              <RefreshCw className="w-4 h-4 mr-1" />
              更新 (デモ版)
            </Button>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            レス数: {responses.length} / 1000
          </div>
        </motion.div>

        <div className="mb-6">
          <ResponseList responses={responses} />
        </div>

        <div className="p-6 bg-white border border-board-border rounded text-center text-gray-500 shadow-inner">
          <p className="font-bold mb-2">書き込みフォーム (デモ版停止中)</p>
          <p className="text-sm">Vercelの無料プラン環境では、データの保存（SQLite）が制限されているため、現在は閲覧専用モードとなっています。</p>
        </div>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { boardId: 'zatsudan', threadId: '1' } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const threadId = params?.threadId as string;
  const responses = DUMMY_RESPONSES[threadId] || [];

  return {
    props: {
      threadTitle: 'はじめてのスレッド',
      boardName: 'なんでも雑談',
      boardId: 'zatsudan',
      responses
    }
  };
};
