import { ResponseItem } from './ResponseItem';
import type { Response } from '@/types';

interface ResponseListProps {
  responses: Response[];
}

export function ResponseList({ responses }: ResponseListProps) {
  const handleAnchorClick = (resNumber: number) => {
    const element = document.getElementById(`res-${resNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // ハイライトアニメーション
      element.classList.add('bg-yellow-100');
      setTimeout(() => {
        element.classList.remove('bg-yellow-100');
      }, 1500);
    }
  };

  return (
    <div className="bg-board-res border border-board-resBorder p-4">
      {responses.map((response) => (
        <ResponseItem
          key={response.id}
          response={response}
          allResponses={responses}
          onAnchorClick={handleAnchorClick}
        />
      ))}
    </div>
  );
}

