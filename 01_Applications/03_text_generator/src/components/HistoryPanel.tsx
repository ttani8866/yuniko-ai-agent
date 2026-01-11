'use client';

import { useState, useEffect } from 'react';
import { HistoryItem, getHistory, deleteFromHistory, clearHistory, formatDate, getStatistics, Statistics } from '@/lib/history';
import { getToolById } from '@/lib/tools';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHistory: (item: HistoryItem) => void;
}

export default function HistoryPanel({ isOpen, onClose, onSelectHistory }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'stats'>('history');

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
      setStatistics(getStatistics());
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    setHistory(getHistory());
    setStatistics(getStatistics());
  };

  const handleClearAll = () => {
    if (confirm('すべての履歴を削除しますか？')) {
      clearHistory();
      setHistory([]);
      setStatistics(getStatistics());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* パネル */}
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">履歴 & 統計</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'history'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                履歴
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'stats'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                統計
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {activeTab === 'history' ? (
            <div className="p-6">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">まだ履歴がありません</p>
                  <p className="text-gray-400 text-sm mt-1">テキストを生成すると履歴が表示されます</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={handleClearAll}
                      className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      すべて削除
                    </button>
                  </div>
                  <div className="space-y-3">
                    {history.map(item => (
                      <div
                        key={item.id}
                        className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                              onSelectHistory(item);
                              onClose();
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{item.toolIcon}</span>
                              <span className="font-medium text-gray-900">{item.toolName}</span>
                              {item.hasImage && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  📷 画像付き
                                </span>
                              )}
                              <span className="text-xs text-gray-400 ml-auto">
                                {formatDate(item.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{item.input}</p>
                            <p className="text-sm text-gray-400 line-clamp-1 mt-1">
                              → {item.output.substring(0, 100)}...
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="p-6">
              {statistics && (
                <div className="space-y-6">
                  {/* サマリーカード */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
                      <p className="text-indigo-100 text-sm">累計生成回数</p>
                      <p className="text-4xl font-bold mt-1">{statistics.totalGenerations}</p>
                      <p className="text-indigo-200 text-xs mt-2">回</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-5 text-white">
                      <p className="text-orange-100 text-sm">今日の生成</p>
                      <p className="text-4xl font-bold mt-1">{statistics.todayGenerations}</p>
                      <p className="text-orange-200 text-xs mt-2">回</p>
                    </div>
                  </div>

                  {/* よく使うツール */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">🏆</span>
                      よく使うツール TOP3
                    </h3>
                    {statistics.favoriteTools.length === 0 ? (
                      <p className="text-gray-500 text-sm">まだデータがありません</p>
                    ) : (
                      <div className="space-y-3">
                        {statistics.favoriteTools.map((toolId, index) => {
                          const tool = getToolById(toolId);
                          if (!tool) return null;
                          const count = statistics.toolUsage[toolId];
                          const maxCount = Math.max(...Object.values(statistics.toolUsage));
                          const percentage = (count / maxCount) * 100;
                          
                          return (
                            <div key={toolId} className="flex items-center gap-3">
                              <span className="text-lg font-bold text-gray-400 w-6">
                                {index + 1}
                              </span>
                              <span className="text-xl">{tool.icon}</span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-gray-900">{tool.name}</span>
                                  <span className="text-sm text-gray-500">{count}回</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      index === 0 ? 'bg-yellow-400' :
                                      index === 1 ? 'bg-gray-400' :
                                      'bg-orange-400'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* ツール使用率 */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">📊</span>
                      ツール別使用回数
                    </h3>
                    {Object.keys(statistics.toolUsage).length === 0 ? (
                      <p className="text-gray-500 text-sm">まだデータがありません</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(statistics.toolUsage).map(([toolId, count]) => {
                          const tool = getToolById(toolId);
                          if (!tool) return null;
                          return (
                            <div key={toolId} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                              <span>{tool.icon}</span>
                              <span className="text-sm text-gray-700 flex-1 truncate">{tool.name}</span>
                              <span className="text-sm font-semibold text-indigo-600">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

