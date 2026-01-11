"""
Python 3.12用のシンプルなセットアップスクリプト
文字化けを避けるため、Pythonスクリプトで実行
"""
import subprocess
import sys
import os
import shutil

def run_command(cmd, description):
    """コマンドを実行"""
    print(f"\n[{description}]")
    print(f"実行中: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    if result.stdout:
        print(result.stdout)
    if result.stderr and result.returncode != 0:
        print("エラー:", result.stderr, file=sys.stderr)
    return result.returncode == 0

def main():
    print("=" * 60)
    print("Python 3.12用セットアップスクリプト")
    print("=" * 60)
    
    # Python 3.12のパス
    python312 = r"C:\Users\tetsuya.tani\AppData\Local\Programs\Python\Python312\python.exe"
    
    if not os.path.exists(python312):
        print("[エラー] Python 3.12が見つかりません。")
        return False
    
    print(f"\n[1/4] Python 3.12のバージョンを確認中...")
    if not run_command([python312, "--version"], "バージョン確認"):
        return False
    
    print(f"\n[2/4] 仮想環境を作成中...")
    if os.path.exists("venv"):
        print("既存の仮想環境を削除します...")
        shutil.rmtree("venv", ignore_errors=True)
    
    if not run_command([python312, "-m", "venv", "venv"], "仮想環境作成"):
        return False
    
    print(f"\n[3/4] pipをアップグレード中...")
    venv_python = os.path.join("venv", "Scripts", "python.exe")
    if not run_command([venv_python, "-m", "pip", "install", "--upgrade", "pip"], "pipアップグレード"):
        print("警告: pipのアップグレードに失敗しましたが、続行します...")
    
    print(f"\n[4/4] 依存関係をインストール中...")
    if not run_command([venv_python, "-m", "pip", "install", "-r", "requirements.txt"], "依存関係インストール"):
        print("エラー: 依存関係のインストールに失敗しました。")
        return False
    
    print("\n" + "=" * 60)
    print("セットアップが完了しました！")
    print("=" * 60)
    print("\nアプリを実行するには:")
    print("  venv\\Scripts\\activate")
    print("  python -m streamlit run app.py")
    print("\nまたは:")
    print("  run_app.bat")
    print()
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

