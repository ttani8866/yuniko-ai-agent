"""
Python 3.12をダウンロードしてインストールするスクリプト
"""
import urllib.request
import subprocess
import sys
import os
import tempfile

def download_file(url, filepath):
    """ファイルをダウンロード"""
    print(f"ダウンロード中: {url}")
    print(f"保存先: {filepath}")
    
    def show_progress(block_num, block_size, total_size):
        downloaded = block_num * block_size
        percent = min(downloaded * 100 / total_size, 100)
        print(f"\r進行状況: {percent:.1f}% ({downloaded}/{total_size} bytes)", end="")
    
    try:
        urllib.request.urlretrieve(url, filepath, show_progress)
        print("\nダウンロード完了！")
        return True
    except Exception as e:
        print(f"\nダウンロードエラー: {e}")
        return False

def main():
    print("=" * 60)
    print("Python 3.12 インストーラーのダウンロードとインストール")
    print("=" * 60)
    print()
    
    # Python 3.12.8のインストーラーURL（64-bit）
    python_url = "https://www.python.org/ftp/python/3.12.8/python-3.12.8-amd64.exe"
    
    # 一時ディレクトリにダウンロード
    temp_dir = tempfile.gettempdir()
    installer_path = os.path.join(temp_dir, "python-3.12.8-amd64.exe")
    
    # ダウンロード
    if not download_file(python_url, installer_path):
        print("ダウンロードに失敗しました。")
        return False
    
    print()
    print("=" * 60)
    print("インストーラーを実行します...")
    print("=" * 60)
    print()
    print("⚠️ 重要: インストール時に以下を確認してください:")
    print("   1. 「Add Python to PATH」にチェックを入れる")
    print("   2. 「Install launcher for all users」にチェックを入れる")
    print()
    
    # インストーラーを実行
    try:
        # /quiet オプションでサイレントインストール（ただし、PATHへの追加は手動で必要）
        # 通常のインストールを実行
        subprocess.run([installer_path, "/passive", "PrependPath=1", "Include_launcher=1"], check=True)
        print()
        print("=" * 60)
        print("インストールが完了しました！")
        print("=" * 60)
        print()
        print("⚠️ コマンドプロンプトを再起動してから、以下を実行してください:")
        print("   py --list")
        print()
        return True
    except subprocess.CalledProcessError as e:
        print(f"インストールエラー: {e}")
        print()
        print("手動でインストーラーを実行してください:")
        print(f"   {installer_path}")
        return False
    except Exception as e:
        print(f"エラー: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

