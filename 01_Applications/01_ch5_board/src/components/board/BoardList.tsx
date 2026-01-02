import Link from 'next/link';
import { motion } from 'framer-motion';
import { Folder, ChevronRight } from 'lucide-react';
import type { Board } from '@/types';

interface BoardListProps {
  boards: Board[];
}

// カテゴリごとにグループ化
function groupByCategory(boards: Board[]): Record<string, Board[]> {
  return boards.reduce((acc, board) => {
    const category = board.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(board);
    return acc;
  }, {} as Record<string, Board[]>);
}

export function BoardList({ boards }: BoardListProps) {
  const groupedBoards = groupByCategory(boards);
  const categories = Object.keys(groupedBoards);

  return (
    <div className="space-y-6">
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
        >
          <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Folder className="w-5 h-5 text-board-header" />
            {category}
          </h2>
          <div className="bg-white border border-board-border rounded">
            {groupedBoards[category].map((board, index) => (
              <Link
                key={board.id}
                href={`/${board.id}`}
                className={`
                  flex items-center justify-between p-3 hover:bg-gray-50 transition-colors
                  ${index !== groupedBoards[category].length - 1 ? 'border-b border-board-border' : ''}
                `}
              >
                <div>
                  <span className="font-medium hover:text-board-link">
                    {board.name}
                  </span>
                  {board.description && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {board.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

