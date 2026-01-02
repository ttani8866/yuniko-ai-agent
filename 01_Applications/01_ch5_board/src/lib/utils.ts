import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import crypto from 'crypto';

// Tailwindクラス結合ユーティリティ
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ユーザーID生成（IPベース・日替わり）
export function generateUserId(ip: string): string {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const hash = crypto.createHash('sha256').update(ip + date + 'salt').digest('hex');
  return hash.substring(0, 8);
}

// IPアドレスのハッシュ化（保存用）
export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + 'ip_salt').digest('hex');
}

// 日付フォーマット（5ch風）
export function formatDate(dateStr: string): string {
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

// 勢い計算（1日あたりのレス数）
export function calculateMomentum(createdAt: string, resCount: number): number {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = Math.max(1, (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  return Math.round((resCount / diffDays) * 10) / 10;
}

// アンカーをリンクに変換
export function parseAnchors(text: string): string {
  // >>数字 をリンクに変換
  return text.replace(
    /&gt;&gt;(\d+)/g,
    '<span class="res-anchor" data-res="$1">&gt;&gt;$1</span>'
  );
}

// HTMLエスケープ
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// 本文の整形（エスケープ + アンカー変換 + 改行変換）
export function formatBody(text: string): string {
  let formatted = escapeHtml(text);
  formatted = parseAnchors(formatted);
  formatted = formatted.replace(/\n/g, '<br>');
  return formatted;
}

// スレッドタイトルの切り詰め
export function truncateTitle(title: string, maxLength: number = 48): string {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + '...';
}

// クライアント側のIPアドレス取得（API Routes用）
export function getClientIp(req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0];
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

