import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ResponseList } from '@/components/response/ResponseList';
import { ResponseForm } from '@/components/response/ResponseForm';
import { Button } from '@/components/ui/button';
import { getDb } from '@/lib/db';
import type { ThreadDetail, Response as ResponseType } from '@/types';

interface ThreadPageProps {
  thread: ThreadDetail | null;
}

export default function ThreadPage({ thread: initialThread }: ThreadPageProps) {
  const router = useRouter();
  const { boardId, threadId } = router.query;
  const [thread, setThread] = useState(initialThread);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshThread = useCallback(async () => {
    if (!threadId) return;
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/threads/${threadId}`);
      const data = await res.json();
      if (data.success) {
        setThread(data.data);
      }
    } catch (error) {
      console.error('Error refreshing thread:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [threadId]);

  const handleSubmitResponse = async (data: { name?: string; mail?: string; body: string; imageUrl?: string }) => {
    const res = await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        threadId: Number(threadId),
        ...data,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || '投稿に失敗しました');
    }

    await refreshThread();
    
    setTimeout(() => {
      const newRes = document.getElementById(`res-${result.data.resNumber}`);
      if (newRes) {
        newRes.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  if (!thread) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">スレッドが見つかりません</p>
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
        <title>{thread.title} - ５ch風掲示板</title>
      </Head>
      <Layout>
        <div className="mb-4">
          <Link 
            href={`/${boardId}`} 
            className="flex items-center gap-1 text-board-link hover:underline text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            板に戻る
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-4 bg-white border-b-2 border-board-header shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold text-board-header">{thread.title}</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshThread}
              disabled={isRefreshing}
              className="border-board-border text-gray-600"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              更新
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2 flex items-center gap-3">
            <span>レス数: <b className="text-board-accent">{thread.resCount}</b> / 1000</span>
            {!thread.isActive && (
              <span className="text-red-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                dat落ち
              </span>
            )}
          </div>
        </motion.div>

        <div className="mb-8 bg-white border border-board-border rounded shadow-sm overflow-hidden">
          <ResponseList responses={thread.responses} />
        </div>

        <ResponseForm
          threadId={thread.id}
          onSubmit={handleSubmitResponse}
          disabled={!thread.isActive}
        />
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ThreadPageProps> = async ({ params }) => {
  const threadId = params?.threadId as string;

  try {
    const db = await getDb();

    const threadResult = await db.get(`
      SELECT t.id, t.board_id as boardId, t.title, t.created_at as createdAt, 
             t.updated_at as updatedAt, t.res_count as resCount, t.is_active as isActive,
             b.name as boardName
      FROM threads t JOIN boards b ON t.board_id = b.id WHERE t.id = ?
    `, [threadId]);

    if (!threadResult) {
      return { props: { thread: null } };
    }

    const responsesResult = await db.all(`
      SELECT id, thread_id as threadId, res_number as resNumber, name, mail, body, 
             image_url as imageUrl, user_id as userId, created_at as createdAt
      FROM responses WHERE thread_id = ? ORDER BY res_number ASC
    `, [threadId]);

    const thread: ThreadDetail = {
      id: Number(threadResult.id),
      boardId: String(threadResult.boardId),
      title: String(threadResult.title),
      createdAt: String(threadResult.createdAt),
      updatedAt: String(threadResult.updatedAt),
      resCount: Number(threadResult.resCount),
      boardName: String(threadResult.boardName),
      isActive: Boolean(threadResult.isActive),
      responses: responsesResult.map(r => ({
        id: Number(r.id),
        threadId: Number(r.threadId),
        resNumber: Number(r.resNumber),
        name: String(r.name),
        mail: r.mail ? String(r.mail) : undefined,
        body: String(r.body),
        imageUrl: r.imageUrl ? String(r.imageUrl) : undefined,
        userId: String(r.userId),
        createdAt: String(r.createdAt)
      }))
    };

    return { props: { thread } };
  } catch (error) {
    console.error('Error:', error);
    return { props: { thread: null } };
  }
};
