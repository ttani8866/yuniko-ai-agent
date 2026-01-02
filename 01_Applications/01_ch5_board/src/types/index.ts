// 板（Board）
export interface Board {
  id: string;
  name: string;
  category: string;
  description?: string;
  createdAt: string;
}

// スレッド（Thread）
export interface Thread {
  id: number;
  boardId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  resCount: number;
  isActive: boolean;
  // 計算フィールド
  momentum?: number; // 勢い
}

// レス（Response）
export interface Response {
  id: number;
  threadId: number;
  resNumber: number;
  name: string;
  mail?: string;
  body: string;
  imageUrl?: string;
  userId?: string;
  createdAt: string;
}

// スレッド作成リクエスト
export interface CreateThreadRequest {
  boardId: string;
  title: string;
  name?: string;
  mail?: string;
  body: string;
  imageUrl?: string;
}

// レス投稿リクエスト
export interface CreateResponseRequest {
  threadId: number;
  name?: string;
  mail?: string;
  body: string;
  imageUrl?: string;
}

// APIレスポンス
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// スレッド詳細（レス含む）
export interface ThreadDetail extends Thread {
  boardName: string;
  responses: Response[];
}

