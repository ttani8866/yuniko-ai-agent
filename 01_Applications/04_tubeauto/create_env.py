"""
.envファイルを作成するスクリプト
"""
import os

def main():
    env_file = ".env"
    example_file = ".env.example"
    
    # .envファイルが既に存在するか確認
    if os.path.exists(env_file):
        print(f"⚠️ {env_file}ファイルは既に存在します。")
        response = input("上書きしますか？ (y/n): ")
        if response.lower() != 'y':
            print("キャンセルしました。")
            return
    
    # .env.exampleからテンプレートを読み込む
    if os.path.exists(example_file):
        with open(example_file, 'r', encoding='utf-8') as f:
            template = f.read()
    else:
        template = "OPENAI_API_KEY=your_api_key_here\n"
    
    print("=" * 60)
    print("OpenAI APIキーの設定")
    print("=" * 60)
    print()
    print("OpenAI APIキーを入力してください。")
    print("APIキーは以下から取得できます:")
    print("  https://platform.openai.com/account/api-keys")
    print()
    print("⚠️ 注意: APIキーは他人に見せないでください。")
    print()
    
    api_key = input("OpenAI APIキー: ").strip()
    
    if not api_key or api_key == "your_api_key_here":
        print("❌ APIキーが入力されていません。")
        return
    
    # .envファイルを作成
    content = f"OPENAI_API_KEY={api_key}\n"
    
    try:
        with open(env_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print()
        print("=" * 60)
        print(f"✅ {env_file}ファイルを作成しました！")
        print("=" * 60)
        print()
        print("Streamlitアプリを再起動してください。")
    except Exception as e:
        print(f"❌ エラー: {e}")

if __name__ == "__main__":
    main()

