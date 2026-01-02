import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp } from 'lucide-react';
import type { Thread } from '@/types';

interface ThreadListProps {
  threads: Thread[];
  boardId: string;
}

export function ThreadList({ threads, boardId }: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        スレッドがありません
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {threads.map((thread, index) => (
        <motion.div
          key={thread.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
        >
          <Link
            href={`/${boardId}/${thread.id}`}
            className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded transition-colors group"
          >
            <span className="text-gray-500 w-8 text-right">{index + 1}.</span>
            <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="flex-1 truncate group-hover:text-board-link">
              {thread.title}
            </span>
            <span className="text-sm text-gray-500">
              ({thread.resCount})
            </span>
            {thread.momentum !== undefined && thread.momentum > 0 && (
              <span className="flex items-center gap-1 text-sm text-orange-600">
                <TrendingUp className="w-3 h-3" />
                {thread.momentum}
              </span>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

