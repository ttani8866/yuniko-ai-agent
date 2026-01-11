"""
インストールされたパッケージを確認するスクリプト
"""
import sys

def check_package(package_name, import_name=None):
    """パッケージがインストールされているか確認"""
    if import_name is None:
        import_name = package_name
    
    try:
        module = __import__(import_name)
        version = getattr(module, '__version__', '不明')
        print(f"✅ {package_name}: {version}")
        return True
    except ImportError:
        print(f"❌ {package_name}: インストールされていません")
        return False

def main():
    print("=" * 60)
    print("インストール確認")
    print("=" * 60)
    print()
    
    packages = [
        ("numpy", "numpy"),
        ("opencv-python", "cv2"),
        ("pydub", "pydub"),
        ("streamlit", "streamlit"),
        ("openai", "openai"),
        ("pillow", "PIL"),
        ("requests", "requests"),
        ("python-dotenv", "dotenv"),
    ]
    
    all_ok = True
    for package_name, import_name in packages:
        if not check_package(package_name, import_name):
            all_ok = False
    
    print()
    print("=" * 60)
    if all_ok:
        print("✅ すべてのパッケージがインストールされました！")
        print("=" * 60)
        print()
        print("アプリを起動するには:")
        print("  python -m streamlit run app.py")
        print()
        print("または:")
        print("  run_app.bat")
    else:
        print("❌ 一部のパッケージがインストールされていません")
        print("=" * 60)
        print()
        print("再度インストールを実行してください:")
        print("  python -m pip install -r requirements.txt")
    
    return all_ok

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

