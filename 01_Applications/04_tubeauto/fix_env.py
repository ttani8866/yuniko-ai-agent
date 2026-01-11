"""
.env.localファイルを修正するスクリプト
"""
import os
import shutil
from datetime import datetime

def main():
    env_local_path = ".env.local"
    
    print("=" * 60)
    print(".env.localファイルの修正")
    print("=" * 60)
    print()
    
    # バックアップを作成
    if os.path.exists(env_local_path):
        backup_path = f".env.local.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        shutil.copy2(env_local_path, backup_path)
        print(f"✅ バックアップを作成しました: {backup_path}")
        print()
    
    print("現在の.env.localファイルの内容を確認中...")
    try:
        with open(env_local_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
        
        # プレースホルダーが含まれているか確認
        if "your_api" in content.lower() or "here" in content.lower():
            print("⚠️ プレースホルダー値が検出されました。")
            print()
            print("実際のOpenAI APIキーを入力してください。")
            print("APIキーは以下から取得できます:")
            print("  https://platform.openai.com/account/api-keys")
            print()
            print("⚠️ 注意: APIキーは他人に見せないでください。")
            print()
            
            api_key = input("OpenAI APIキーを入力してください: ").strip()
            
            if not api_key:
                print("❌ APIキーが入力されていません。")
                return False
            
            # APIキーの形式を確認
            if not (api_key.startswith("sk-") or api_key.startswith("BlbkFJ")):
                print("⚠️ 警告: APIキーの形式が正しくない可能性があります。")
                print("  通常は 'sk-' または 'BlbkFJ' で始まります。")
                response = input("続行しますか？ (y/n): ")
                if response.lower() != 'y':
                    return False
            
            # .env.localファイルを書き込み
            new_content = f"OPENAI_API_KEY={api_key}\n"
            
            with open(env_local_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print()
            print("=" * 60)
            print("✅ .env.localファイルを更新しました！")
            print("=" * 60)
            print()
            print("Streamlitアプリを再起動してください:")
            print("  1. ターミナルで Ctrl+C で停止")
            print("  2. python -m streamlit run app.py で再起動")
            print()
            return True
        else:
            print("✅ .env.localファイルは既に正しく設定されているようです。")
            print("   内容:", content[:30] + "..." if len(content) > 30 else content)
            return True
            
    except Exception as e:
        print(f"❌ エラー: {e}")
        return False

if __name__ == "__main__":
    success = main()
    import sys
    sys.exit(0 if success else 1)

