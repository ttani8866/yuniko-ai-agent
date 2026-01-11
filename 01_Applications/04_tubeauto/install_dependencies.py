"""
依存関係をインストールするスクリプト
numpyを適切なバージョンにインストールしてから、
opencv-pythonとその他のパッケージをインストールします。
"""
import subprocess
import sys

def run_pip_install(packages):
    """pip installを実行"""
    cmd = [sys.executable, "-m", "pip", "install"] + packages
    print(f"実行中: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print("エラー:", result.stderr, file=sys.stderr)
    return result.returncode == 0

def main():
    print("=" * 60)
    print("依存関係のインストールを開始します...")
    print("=" * 60)
    
    # 1. pipをアップグレード
    print("\n[1/4] pipをアップグレード中...")
    if not run_pip_install(["--upgrade", "pip"]):
        print("⚠️ pipのアップグレードに失敗しましたが、続行します...")
    
    # 2. numpyをopencv-pythonと互換性のあるバージョンにダウングレード
    print("\n[2/4] numpyを互換性のあるバージョンにインストール中...")
    if not run_pip_install(["numpy>=2.0.0,<2.3.0", "--only-binary", ":all:"]):
        print("⚠️ プリビルドwheelが見つかりません。ソースからビルドを試みます...")
        if not run_pip_install(["numpy>=2.0.0,<2.3.0"]):
            print("❌ numpyのインストールに失敗しました。")
            print("💡 Visual Studio Build Toolsのインストールが必要な可能性があります。")
            return False
    
    # 3. opencv-pythonとpydubをインストール
    print("\n[3/4] opencv-pythonとpydubをインストール中...")
    if not run_pip_install(["opencv-python", "pydub"]):
        print("❌ opencv-pythonまたはpydubのインストールに失敗しました。")
        return False
    
    # 4. 残りのパッケージをインストール
    print("\n[4/4] その他のパッケージをインストール中...")
    packages = [
        "streamlit>=1.28.0",
        "openai>=1.12.0",
        "python-dotenv>=1.0.0",
        "pillow>=10.0.0",
        "requests>=2.31.0"
    ]
    if not run_pip_install(packages):
        print("⚠️ 一部のパッケージのインストールに失敗しました。")
    
    # 5. インストール確認
    print("\n" + "=" * 60)
    print("インストール確認中...")
    print("=" * 60)
    
    try:
        import cv2
        print(f"✅ opencv-python: {cv2.__version__}")
    except ImportError as e:
        print(f"❌ opencv-python: インポートエラー - {e}")
        return False
    
    try:
        import pydub
        # pydubには__version__属性がない場合があるため、安全に取得
        try:
            version = pydub.__version__
        except AttributeError:
            try:
                import importlib.metadata
                version = importlib.metadata.version('pydub')
            except:
                version = "インストール済み"
        print(f"✅ pydub: {version}")
    except ImportError as e:
        print(f"❌ pydub: インポートエラー - {e}")
        return False
    
    try:
        import numpy
        print(f"✅ numpy: {numpy.__version__}")
    except ImportError as e:
        print(f"❌ numpy: インポートエラー - {e}")
        return False
    
    print("\n" + "=" * 60)
    print("✅ すべての依存関係のインストールが完了しました！")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

