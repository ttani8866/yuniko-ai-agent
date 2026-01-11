"""
.env.localファイルの内容を確認するスクリプト
"""
import os
from dotenv import load_dotenv

def main():
    env_local_path = ".env.local"
    
    print("=" * 60)
    print(".env.localファイルの確認")
    print("=" * 60)
    print()
    
    # ファイルの存在確認
    if not os.path.exists(env_local_path):
        print(f"❌ {env_local_path}ファイルが見つかりません。")
        return False
    
    print(f"✅ {env_local_path}ファイルが存在します。")
    print()
    
    # ファイルの内容を読み込む（直接読み込み）
    try:
        with open(env_local_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            print("ファイルの内容:")
            print("-" * 60)
            # APIキーの一部をマスクして表示
            if content.startswith("OPENAI_API_KEY="):
                key_part = content.split("=", 1)[1]
                if len(key_part) > 10:
                    masked = key_part[:10] + "..." + key_part[-4:]
                else:
                    masked = "***"
                print(f"OPENAI_API_KEY={masked}")
            else:
                print(content[:50] + "..." if len(content) > 50 else content)
            print("-" * 60)
            print()
    except Exception as e:
        print(f"❌ ファイルの読み込みエラー: {e}")
        return False
    
    # dotenvで読み込んで確認
    print("dotenvで読み込んだ結果:")
    print("-" * 60)
    
    # 一度クリア
    if 'OPENAI_API_KEY' in os.environ:
        del os.environ['OPENAI_API_KEY']
    
    # .env.localを読み込む
    result = load_dotenv('.env.local')
    print(f"load_dotenv('.env.local')の結果: {result}")
    
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        if api_key.startswith("sk-") or api_key.startswith("BlbkFJ"):
            masked_key = api_key[:10] + "..." + api_key[-4:]
            print(f"✅ OPENAI_API_KEYが読み込まれました: {masked_key}")
            print(f"   長さ: {len(api_key)}文字")
            
            # プレースホルダーでないか確認
            if "your_api" in api_key.lower() or "here" in api_key.lower():
                print("⚠️ 警告: プレースホルダー値が検出されました。")
                return False
            else:
                print("✅ APIキーの形式は正しいようです。")
                return True
        else:
            print(f"⚠️ APIキーが読み込まれましたが、形式が正しくない可能性があります: {api_key[:20]}...")
            return False
    else:
        print("❌ OPENAI_API_KEYが読み込まれていません。")
        print()
        print("ファイルの形式を確認してください:")
        print("  正しい形式: OPENAI_API_KEY=sk-...")
        print("  または: OPENAI_API_KEY=BlbkFJ...")
        return False

if __name__ == "__main__":
    success = main()
    print()
    if success:
        print("=" * 60)
        print("✅ .env.localファイルは正しく設定されています！")
        print("=" * 60)
    else:
        print("=" * 60)
        print("❌ .env.localファイルに問題があります。")
        print("=" * 60)
        print()
        print("修正方法:")
        print("  1. .env.localファイルを開く")
        print("  2. 以下の形式で記述:")
        print("     OPENAI_API_KEY=sk-あなたのAPIキー")
        print("  3. 保存して、Streamlitアプリを再起動")
    
    import sys
    sys.exit(0 if success else 1)

