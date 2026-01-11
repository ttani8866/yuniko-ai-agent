'use client';

import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ToolDetail from '@/components/ToolDetail';
import OutputPanel from '@/components/OutputPanel';
import HistoryPanel from '@/components/HistoryPanel';
import { tools, Tool, getCategories, getToolById } from '@/lib/tools';
import { saveToHistory, HistoryItem } from '@/lib/history';

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState<string>('');

  const categories = getCategories();

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    setOutput(null);
    setCurrentInput('');
  };

  // カテゴリ選択時に、そのカテゴリの最初のツールも選択
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    const filteredTools = category 
      ? tools.filter(t => t.category === category)
      : tools;
    if (filteredTools.length > 0) {
      setSelectedTool(filteredTools[0]);
      setOutput(null);
      setCurrentInput('');
    }
  };

  const handleGenerate = useCallback((generatedOutput: string, input: string, hasImage: boolean) => {
    setOutput(generatedOutput);
    setCurrentInput(input);
    
    // 履歴に保存
    if (selectedTool) {
      saveToHistory({
        toolId: selectedTool.id,
        toolName: selectedTool.name,
        toolIcon: selectedTool.icon,
        input: input,
        output: generatedOutput,
        hasImage: hasImage,
      });
    }
  }, [selectedTool]);

  const handleSelectHistory = (item: HistoryItem) => {
    const tool = getToolById(item.toolId);
    if (tool) {
      setSelectedTool(tool);
      setOutput(item.output);
      setCurrentInput(item.input);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* サイドバー */}
      <Sidebar
        tools={tools}
        selectedTool={selectedTool}
        onSelectTool={handleToolSelect}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        categories={categories}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* メインコンテンツ */}
      {selectedTool ? (
        <ToolDetail 
          tool={selectedTool} 
          onGenerate={handleGenerate}
          initialInput={currentInput}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
              <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              ツールを選択してください
            </h2>
            <p className="text-gray-500 leading-relaxed">
              左のサイドバーからテキスト生成ツールを選択すると、
              入力フォームが表示されます。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {tools.slice(0, 3).map(tool => (
                <button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                >
                  <span>{tool.icon}</span>
                  {tool.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 出力パネル */}
      {output && selectedTool && (
        <OutputPanel
          output={output}
          toolName={selectedTool.name}
          onClose={() => setOutput(null)}
        />
      )}

      {/* 履歴パネル */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectHistory={handleSelectHistory}
      />
    </div>
  );
}
