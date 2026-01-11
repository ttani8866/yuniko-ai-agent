"""
両方のAPIキーをテストして、どちらが正しく動作するか確認するスクリプト
"""
import os
from dotenv import load_dotenv
from openai import OpenAI

def test_api_key(api_key, key_name):
    """APIキーをテストする"""
    print(f"\n{'='*60}")
    print(f"{key_name}をテスト中...")
    print(f"{'='*60}")
    
    # APIキーの形式を確認
    masked_key = api_key[:10] + "..." + api_key[-4:] if len(api_key) > 14 else "***"
    print(f"APIキー: {masked_key}")
    print(f"長さ: {len(api_key)}文字")
    
    # 形式チェック
    if api_key.startswith("sk-proj-"):
        print("✅ 形式: 新しいプロジェクトキー形式 (sk-proj-...)")
    elif api_key.startswith("sk-"):
        print("✅ 形式: 標準APIキー形式 (sk-...)")
    elif api_key.startswith("BlbkFJ") or api_key.startswith("B1bkFJ"):
        print("⚠️ 形式: 古い形式の可能性 (BlbkFJ... / B1bkFJ...)")
    else:
        print("❌ 形式: 認識できない形式")
    
    # 実際にAPIを呼び出してテスト
    try:
        client = OpenAI(api_key=api_key)
        # 簡単なAPI呼び出しでテスト（モデル一覧を取得）
        models = client.models.list()
        print("✅ APIキーは有効です！")
        print(f"   利用可能なモデル数: {len(list(models))}")
        return True
    except Exception as e:
        error_msg = str(e)
        if "401" in error_msg or "invalid_api_key" in error_msg.lower():
            print("❌ APIキーが無効です")
            print(f"   エラー: {error_msg[:100]}")
        elif "429" in error_msg:
            print("⚠️ レート制限に達しています（キー自体は有効の可能性）")
        else:
            print(f"❌ エラー: {error_msg[:100]}")
        return False

def main():
    print("=" * 60)
    print("APIキーのテスト")
    print("=" * 60)
    
    # .env.localファイルを読み込む
    env_local_path = ".env.local"
    
    if not os.path.exists(env_local_path):
        print(f"❌ {env_local_path}ファイルが見つかりません。")
        return
    
    # ファイルを直接読み込んで両方のキーを取得
    with open(env_local_path, 'r', encoding='utf-8') as f:
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
        return
    elif len(keys) == 1:
        print(f"✅ 1つのAPIキーが見つかりました（{keys[0][0]}行目）")
        test_api_key(keys[0][1], f"{keys[0][0]}行目のキー")
    else:
        print(f"⚠️ {len(keys)}つのAPIキーが見つかりました。")
        print("   両方をテストします...")
        
        results = []
        for line_num, key in keys:
            result = test_api_key(key, f"{line_num}行目のキー")
            results.append((line_num, key, result))
        
        print("\n" + "=" * 60)
        print("テスト結果のまとめ")
        print("=" * 60)
        
        valid_keys = [r for r in results if r[2]]
        if len(valid_keys) == 0:
            print("❌ どちらのAPIキーも動作しませんでした。")
            print("   新しいAPIキーを取得してください:")
            print("   https://platform.openai.com/account/api-keys")
        elif len(valid_keys) == 1:
            line_num, key, _ = valid_keys[0]
            print(f"✅ {line_num}行目のキーが有効です！")
            print(f"   推奨: {line_num}行目だけを残して、他の行を削除してください。")
        else:
            print("✅ 両方のAPIキーが有効です。")
            print("   推奨: 1行目（新しい形式）を残してください。")
        
        print("\n" + "=" * 60)

if __name__ == "__main__":
    main()

