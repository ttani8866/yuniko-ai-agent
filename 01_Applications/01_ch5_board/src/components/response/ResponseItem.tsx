import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Response } from '@/types';

interface ResponseItemProps {
  response: Response;
  allResponses: Response[];
  onAnchorClick: (resNumber: number) => void;
}

// 日付フォーマット
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekday = weekdays[date.getDay()];
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}/${month}/${day}(${weekday}) ${hours}:${minutes}:${seconds}`;
}

// HTMLエスケープ
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

export function ResponseItem({ response, allResponses, onAnchorClick }: ResponseItemProps) {
  const [hoveredAnchor, setHoveredAnchor] = useState<number | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  // アンカーポップアップの位置調整
  useEffect(() => {
    if (hoveredAnchor && popupRef.current) {
      const popup = popupRef.current;
      const rect = popup.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newLeft = popupPosition.left;
      let newTop = popupPosition.top;

      if (rect.right > viewportWidth) {
        newLeft = viewportWidth - rect.width - 20;
      }
      if (rect.bottom > viewportHeight) {
        newTop = popupPosition.top - rect.height - 20;
      }

      if (newLeft !== popupPosition.left || newTop !== popupPosition.top) {
        setPopupPosition({ top: newTop, left: newLeft });
      }
    }
  }, [hoveredAnchor, popupPosition]);

  // アンカーパース
  const parseBody = (text: string) => {
    const escaped = escapeHtml(text);
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    const regex = /&gt;&gt;(\d+)/g;
    let match;

    while ((match = regex.exec(escaped)) !== null) {
      if (match.index > lastIndex) {
        parts.push(escaped.slice(lastIndex, match.index));
      }
      
      const resNum = parseInt(match[1], 10);
      parts.push(
        <span
          key={`anchor-${match.index}`}
          className="text-board-link cursor-pointer hover:underline"
          onClick={() => onAnchorClick(resNum)}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setPopupPosition({ top: rect.bottom + 5, left: rect.left });
            setHoveredAnchor(resNum);
          }}
          onMouseLeave={() => setHoveredAnchor(null)}
        >
          &gt;&gt;{resNum}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < escaped.length) {
      parts.push(escaped.slice(lastIndex));
    }

    return parts;
  };

  // 改行を<br>に変換
  const renderBody = (text: string) => {
    const parsed = parseBody(text);
    return parsed.map((part, index) => {
      if (typeof part === 'string') {
        return part.split('\n').map((line, lineIndex, arr) => (
          <span key={`${index}-${lineIndex}`}>
            {line}
            {lineIndex < arr.length - 1 && <br />}
          </span>
        ));
      }
      return part;
    });
  };

  // アンカー先のレスを取得
  const getAnchoredResponse = (resNumber: number) => {
    return allResponses.find(r => r.resNumber === resNumber);
  };

  return (
    <motion.div
      id={`res-${response.resNumber}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
      className="res-item border-b border-gray-300 py-3"
    >
      {/* レスヘッダー */}
      <div className="res-header text-sm">
        <span className="font-bold text-board-accent">{response.resNumber}</span>
        {' '}
        ：
        <span className="text-board-name font-bold">
          {response.name}
        </span>
        {response.mail && (
          <span className="text-gray-500 ml-1">
            [{response.mail}]
          </span>
        )}
        {' '}
        ：
        <span className="text-gray-600">
          {formatDate(response.createdAt)}
        </span>
        {' '}
        ID:
        <span className="text-gray-500">
          {response.userId || '???'}
        </span>
      </div>
      
      {/* レス本文 */}
      <div className="res-body mt-1 ml-6 text-[16px]">
        {renderBody(response.body)}
      </div>

      {/* 画像表示 */}
      {response.imageUrl && (
        <div className="mt-3 ml-6">
          <a href={response.imageUrl} target="_blank" rel="noopener noreferrer">
            <img 
              src={response.imageUrl} 
              alt="添付画像" 
              className="max-w-[400px] max-h-[400px] object-contain border border-gray-400 shadow-sm hover:opacity-90 transition-opacity bg-white p-1"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </a>
        </div>
      )}

      {/* アンカーポップアップ */}
      {hoveredAnchor && (
        <div
          ref={popupRef}
          className="fixed z-50 max-w-lg bg-board-res border border-board-resBorder p-2 shadow-lg"
          style={{ top: popupPosition.top, left: popupPosition.left }}
          onMouseEnter={() => setHoveredAnchor(hoveredAnchor)}
          onMouseLeave={() => setHoveredAnchor(null)}
        >
          {(() => {
            const anchoredRes = getAnchoredResponse(hoveredAnchor);
            if (!anchoredRes) {
              return <div className="text-gray-500">レスが見つかりません</div>;
            }
            return (
              <div>
                <div className="text-sm mb-1">
                  <span className="font-bold text-board-accent">{anchoredRes.resNumber}</span>
                  {' '}
                  <span className="text-green-700 font-bold">{anchoredRes.name}</span>
                  {' '}
                  <span className="text-gray-600">{formatDate(anchoredRes.createdAt)}</span>
                </div>
                <div className="text-sm whitespace-pre-wrap break-words">
                  {anchoredRes.body}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </motion.div>
  );
}

