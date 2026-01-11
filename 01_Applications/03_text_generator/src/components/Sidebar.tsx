'use client';

import { useEffect, useState } from 'react';
import { Tool } from '@/lib/tools';
import { getStatistics, Statistics } from '@/lib/history';

interface SidebarProps {
  tools: Tool[];
  selectedTool: Tool | null;
  onSelectTool: (tool: Tool) => void;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  categories: string[];
  onOpenHistory: () => void;
}

export default function Sidebar({
  tools,
  selectedTool,
  onSelectTool,
  selectedCategory,
  onSelectCategory,
  categories,
  onOpenHistory,
}: SidebarProps) {
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  useEffect(() => {
    setStatistics(getStatistics());
  }, []);

  const filteredTools = selectedCategory
    ? tools.filter(t => t.category === selectedCategory)
    : tools;

  return (
    <aside className="w-72 bg-white border-r border-gray-100 h-screen overflow-y-auto flex-shrink-0 flex flex-col">
      {/* ロゴ */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-gray-900">テキスト生成 AI</h1>
            <p className="text-xs text-gray-400">Marketplace</p>
          </div>
        </div>
      </div>

      {/* ユーザー情報 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            U
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">ゲストユーザー</p>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              free プラン
            </p>
          </div>
        </div>
      </div>

      {/* 統計ミニカード */}
      {statistics && statistics.totalGenerations > 0 && (
        <div className="mx-3 mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-600 font-medium">今日の生成</p>
              <p className="text-2xl font-bold text-indigo-700">{statistics.todayGenerations}<span className="text-sm font-normal">回</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">累計</p>
              <p className="text-lg font-semibold text-gray-700">{statistics.totalGenerations}</p>
            </div>
          </div>
        </div>
      )}

      {/* メニュー */}
      <nav className="p-3 flex-1">
        <div className="space-y-1">
          <button
            onClick={onOpenHistory}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">履歴 & 統計</span>
            {statistics && statistics.totalGenerations > 0 && (
              <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {statistics.totalGenerations}
              </span>
            )}
          </button>
          
          <div className="pt-2">
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              カテゴリ
            </p>
            <button
              onClick={() => onSelectCategory(null)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                selectedCategory === null
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="font-medium">すべて</span>
              <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {tools.length}
              </span>
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {category === 'ブログ記事制作' && '📝'}
                  {category === 'ショート動画台本メーカー' && '🎵'}
                  {category === '小説を書く' && '📖'}
                  {category === 'プロンプトメーカー' && '🤖'}
                  {category === 'メール' && '📧'}
                </span>
                <span className="font-medium text-sm">{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ツール一覧 */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            生成ツール一覧
          </p>
          <div className="space-y-1 mt-1">
            {filteredTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                  selectedTool?.id === tool.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tool.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${selectedTool?.id === tool.id ? 'text-white' : ''}`}>
                    {tool.name}
                  </p>
                  <p className={`text-xs truncate ${selectedTool?.id === tool.id ? 'text-indigo-100' : 'text-gray-400'}`}>
                    {tool.usageCount.toLocaleString()} 回使用
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* フッター */}
      <div className="p-3 border-t border-gray-100">
        <div className="text-center text-xs text-gray-400">
          Powered by Gemini
        </div>
      </div>
    </aside>
  );
}
