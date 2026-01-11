/**
 * バイブコーディング学習管理アプリ - メインスクリプト
 * 
 * 機能:
 * - ロードマップの描画
 * - チェック状態の管理（localStorage）
 * - 進捗計算・表示
 * - レベル折りたたみ
 */

// ===== 定数 =====
const STORAGE_KEY = 'vibe-coding-progress';

// ===== 状態管理 =====
let progress = {};

// ===== 初期化 =====
function init() {
  loadProgress();
  renderRoadmap();
  updateOverallProgress();
}

// ===== localStorage操作 =====
function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    progress = saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('進捗データの読み込みに失敗:', e);
    progress = {};
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('進捗データの保存に失敗:', e);
  }
}

function resetProgress() {
  if (confirm('進捗をリセットしますか？\nすべてのチェックが外れます。')) {
    progress = {};
    saveProgress();
    renderRoadmap();
    updateOverallProgress();
  }
}

// ===== チェック操作 =====
function toggleItem(id) {
  progress[id] = !progress[id];
  saveProgress();
  
  // UI更新
  const item = document.querySelector(`[data-item-id="${id}"]`);
  if (item) {
    item.classList.toggle('checked', progress[id]);
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox) checkbox.checked = progress[id];
  }
  
  // 進捗更新
  updateLevelProgress(id.split('-')[0]);
  updateOverallProgress();
}

// ===== 進捗計算 =====
function calculateLevelProgress(level) {
  const levelData = roadmapData.find(l => l.level === level);
  if (!levelData) return { completed: 0, total: 0, percent: 0 };
  
  const total = levelData.items.length;
  const completed = levelData.items.filter(item => progress[item.id]).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { completed, total, percent };
}

function calculateOverallProgress() {
  let totalItems = 0;
  let completedItems = 0;
  
  roadmapData.forEach(level => {
    totalItems += level.items.length;
    completedItems += level.items.filter(item => progress[item.id]).length;
  });
  
  const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  return { completed: completedItems, total: totalItems, percent };
}

// ===== UI更新 =====
function updateLevelProgress(levelNum) {
  const level = parseInt(levelNum);
  const { completed, total, percent } = calculateLevelProgress(level);
  
  // テキスト更新
  const countEl = document.querySelector(`[data-level="${level}"] .level-progress-text .count`);
  if (countEl) countEl.textContent = `${completed}/${total}`;
  
  // プログレスバー更新
  const barEl = document.querySelector(`[data-level="${level}"] .level-progress-bar-fill`);
  if (barEl) barEl.style.width = `${percent}%`;
}

function updateOverallProgress() {
  const { completed, total, percent } = calculateOverallProgress();
  
  // テキスト更新
  const statsEl = document.querySelector('.overall-progress-stats');
  if (statsEl) {
    statsEl.innerHTML = `<span class="highlight">${percent}%</span> 達成 (${completed}/${total})`;
  }
  
  // プログレスバー更新
  const barEl = document.querySelector('.progress-bar-fill');
  if (barEl) barEl.style.width = `${percent}%`;
}

// ===== 折りたたみ =====
function toggleLevel(levelNum) {
  const card = document.querySelector(`[data-level="${levelNum}"]`);
  if (card) {
    card.classList.toggle('collapsed');
  }
}

// ===== 描画 =====
function renderRoadmap() {
  const container = document.getElementById('roadmap-container');
  if (!container) return;
  
  container.innerHTML = roadmapData.map(level => {
    const { completed, total, percent } = calculateLevelProgress(level.level);
    
    return `
      <div class="level-card" data-level="${level.level}">
        <div class="level-header" onclick="toggleLevel(${level.level})">
          <div class="level-title-group">
            <span class="level-emoji">${level.emoji}</span>
            <div>
              <div class="level-title">Level ${level.level}: ${level.title}</div>
              <div class="level-subtitle">${level.subtitle}</div>
            </div>
          </div>
          <div class="level-stats">
            <span class="level-progress-text">
              <span class="count">${completed}/${total}</span> 完了
            </span>
            <span class="level-toggle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>
        </div>
        <div class="level-progress-bar">
          <div class="level-progress-bar-fill" style="width: ${percent}%"></div>
        </div>
        <div class="level-items">
          ${level.items.map(item => renderCheckItem(item)).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function renderCheckItem(item) {
  const isChecked = progress[item.id] || false;
  
  return `
    <div class="check-item ${isChecked ? 'checked' : ''}" data-item-id="${item.id}" onclick="toggleItem('${item.id}')">
      <div class="checkbox-wrapper">
        <input type="checkbox" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation()">
        <div class="checkbox-custom">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
      <div class="check-content">
        <div class="check-text">${item.text}</div>
        <div class="check-tips">💡 ${item.tips}</div>
      </div>
    </div>
  `;
}

// ===== イベントリスナー =====
document.addEventListener('DOMContentLoaded', init);

// グローバルに公開（HTMLから呼び出すため）
window.toggleItem = toggleItem;
window.toggleLevel = toggleLevel;
window.resetProgress = resetProgress;

