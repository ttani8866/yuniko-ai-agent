"""
APIキーをテストするシンプルなスクリプト
"""
import os
import sys

# 仮想環境のPythonを使用
sys.path.insert(0, 'venv\\Lib\\site-packages')

try:
    from openai import OpenAI
except ImportError:
    print("openaiモジュールが見つかりません。")
    print("仮想環境をアクティベートしてから実行してください。")
    sys.exit(1)

# .env.localファイルを読み込む
env_file = ".env.local"
if not os.path.exists(env_file):
    print(f"❌ {env_file}ファイルが見つかりません。")
    sys.exit(1)

print("=" * 60)
print("APIキーのテスト")
print("=" * 60)
print()

# ファイルを読み込む
with open(env_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

keys = []
for i, line in enumerate(lines, 1):
    line = line.strip()
    if line.startswith("OPENAI_API_KEY="):
        key = line.split("=", 1)[1]
        if key and "your_api" not in key.lower():
            keys.append((i, key))

if len(keys) == 0:
    print("❌ APIキーが見つかりません。")
    sys.exit(1)

print(f"見つかったAPIキー: {len(keys)}個\n")

for line_num, api_key in keys:
    print(f"{'='*60}")
    print(f"{line_num}行目のキーをテスト中...")
    print(f"{'='*60}")
    
    masked = api_key[:15] + "..." + api_key[-10:] if len(api_key) > 25 else api_key
    print(f"キー: {masked}")
    print(f"長さ: {len(api_key)}文字")
    
    if api_key.startswith("sk-proj-"):
        print("形式: 新しいプロジェクトキー (sk-proj-...)")
    elif api_key.startswith("sk-"):
        print("形式: 標準APIキー (sk-...)")
    elif api_key.startswith("B1bkFJ") or api_key.startswith("BlbkFJ"):
        print("形式: 古い形式 (B1bkFJ... / BlbkFJ...)")
    else:
        print("形式: 不明")
    
    # APIをテスト
    try:
        client = OpenAI(api_key=api_key)
        # 簡単なテスト（モデル一覧を取得）
        models = list(client.models.list())
        print(f"✅ 有効です！利用可能なモデル数: {len(models)}")
        print(f"   推奨: このキーを使用してください。")
    except Exception as e:
        error = str(e)
        if "401" in error or "invalid_api_key" in error.lower():
            print(f"❌ 無効なAPIキーです")
        elif "429" in error:
            print(f"⚠️ レート制限（キーは有効の可能性）")
        else:
            print(f"❌ エラー: {error[:80]}")
    print()

print("=" * 60)
print("テスト完了")
print("=" * 60)

