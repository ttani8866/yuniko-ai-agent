// 生成履歴の型定義
export interface HistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  toolIcon: string;
  input: string;
  output: string;
  createdAt: string;
  hasImage: boolean;
}

export interface Statistics {
  totalGenerations: number;
  todayGenerations: number;
  toolUsage: { [toolId: string]: number };
  favoriteTools: string[];
}

const HISTORY_KEY = 'text_generator_history';
const MAX_HISTORY_ITEMS = 50;

// 履歴を取得
export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
}

// 履歴を保存
export function saveToHistory(item: Omit<HistoryItem, 'id' | 'createdAt'>): HistoryItem {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  
  // 先頭に追加、最大件数を超えたら古いものを削除
  const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  
  return newItem;
}

// 履歴を削除
export function deleteFromHistory(id: string): void {
  const history = getHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
}

// 履歴をクリア
export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// 統計情報を計算
export function getStatistics(): Statistics {
  const history = getHistory();
  const today = new Date().toDateString();
  
  const todayGenerations = history.filter(
    item => new Date(item.createdAt).toDateString() === today
  ).length;

  const toolUsage: { [toolId: string]: number } = {};
  history.forEach(item => {
    toolUsage[item.toolId] = (toolUsage[item.toolId] || 0) + 1;
  });

  // 使用回数でソートして上位3つを取得
  const favoriteTools = Object.entries(toolUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([toolId]) => toolId);

  return {
    totalGenerations: history.length,
    todayGenerations,
    toolUsage,
    favoriteTools,
  };
}

// 日付をフォーマット
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'たった今';
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

