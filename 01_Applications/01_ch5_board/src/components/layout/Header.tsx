import Link from 'next/link';
import { Home, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-board-header text-board-headerText"
    >
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity text-white">
            <MessageSquare className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-black tracking-tighter text-white">５ch風掲示板(最新)</h1>
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

