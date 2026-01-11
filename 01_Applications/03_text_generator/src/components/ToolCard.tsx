'use client';

import { Tool } from '@/lib/tools';

interface ToolCardProps {
  tool: Tool;
  isSelected: boolean;
  onClick: () => void;
}

export default function ToolCard({ tool, isSelected, onClick }: ToolCardProps) {
  return (
    <div 
      className={`tool-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          {tool.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {tool.category}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 mb-1 truncate">{tool.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{tool.description}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>{tool.usageCount.toLocaleString()} 回使用</span>
          </div>
        </div>
      </div>
    </div>
  );
}

