"""
Python 3.12インストーラーを実行するスクリプト
"""
import subprocess
import sys
import os
import tempfile

def main():
    installer_path = os.path.join(tempfile.gettempdir(), "python-3.12.8-amd64.exe")
    
    if not os.path.exists(installer_path):
        print(f"[エラー] インストーラーが見つかりません: {installer_path}")
        print("download_and_install_python.py を先に実行してください。")
        return False
    
    print("=" * 60)
    print("Python 3.12 インストーラーを実行します")
    print("=" * 60)
    print()
    print("重要: インストール時に以下を確認してください:")
    print("  1. 「Add Python to PATH」にチェックを入れる")
    print("  2. 「Install launcher for all users」にチェックを入れる")
    print()
    
    try:
        # /passive モードで実行（UIは表示されるが、自動的に進行）
        subprocess.run([installer_path, "/passive", "PrependPath=1", "Include_launcher=1"], check=True)
        print()
        print("=" * 60)
        print("インストールが完了しました！")
        print("=" * 60)
        print()
        print("コマンドプロンプトを再起動してから、以下を実行してください:")
        print("  py --list")
        print()
        return True
    except subprocess.CalledProcessError as e:
        print(f"インストールエラー: {e}")
        return False
    except Exception as e:
        print(f"エラー: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

