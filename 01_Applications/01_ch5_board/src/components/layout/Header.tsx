import Link from 'next/link';
import { Home, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="site-header text-board-headerText"
    >
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity text-white">
            <div className="bg-white p-1 rounded-sm shadow-inner">
              <MessageSquare className="w-8 h-8 text-board-header" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-md">
                ５ch風掲示板
              </h1>
              <p className="text-[10px] text-gray-200 font-bold tracking-widest uppercase opacity-80">
                AI Agent Edition
              </p>
            </div>
          </Link>
          <nav>
            <Link 
              href="/" 
              className="flex items-center gap-1 text-sm hover:underline"
            >
              <Home className="w-4 h-4" />
              トップ
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

