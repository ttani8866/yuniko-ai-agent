'use client';

import { useState } from 'react';

interface OutputPanelProps {
  output: string;
  toolName: string;
  onClose: () => void;
}

export default function OutputPanel({ output, toolName, onClose }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 簡易的なマークダウン変換
  const formatMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3 pb-2 border-b border-gray-200">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 text-gray-600">• $1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 text-gray-600">• $1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 text-gray-600">$1. $2</li>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-indigo-700">$1</code>')
      .replace(/\n\n/g, '</p><p class="text-gray-600 leading-relaxed mb-4">')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="w-96 bg-white border-l border-gray-100 h-screen overflow-y-auto flex-shrink-0 flex flex-col">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <span className="font-semibold text-gray-900">生成結果</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all ${
              copied
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                コピー完了
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                コピー
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ツール名 */}
      <div className="px-5 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
        <p className="text-sm text-indigo-700 font-medium">
          📝 {toolName} の出力結果
        </p>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 p-5">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: `<p class="text-gray-600 leading-relaxed mb-4">${formatMarkdown(output)}</p>` 
          }}
        />
      </div>

      {/* フッターアクション */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-2">
        <button className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          再生成
        </button>
        <button className="flex-1 py-2.5 px-4 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          保存
        </button>
      </div>
    </div>
  );
}

