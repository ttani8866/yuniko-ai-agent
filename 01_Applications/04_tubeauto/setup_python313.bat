@echo off
REM Python 3.13用のセットアップスクリプト
echo ========================================
echo Python 3.13用セットアップスクリプト
echo ========================================
echo.

REM Python 3.13がインストールされているか確認
py -3.13 --version >nul 2>&1
if errorlevel 1 (
    echo [エラー] Python 3.13がインストールされていません。
    echo Python 3.13をインストールしてから再度実行してください。
    echo ダウンロード: https://www.python.org/downloads/release/python-3130/
    pause
    exit /b 1
)

echo [1/4] Python 3.13のバージョンを確認中...
py -3.13 --version
echo.

echo [2/4] 仮想環境を作成中...
if exist venv (
    echo 既存の仮想環境を削除します...
    rmdir /s /q venv
)
py -3.13 -m venv venv
if errorlevel 1 (
    echo [エラー] 仮想環境の作成に失敗しました。
    pause
    exit /b 1
)
echo 仮想環境を作成しました。
echo.

echo [3/4] 仮想環境をアクティベート中...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo [エラー] 仮想環境のアクティベートに失敗しました。
    pause
    exit /b 1
)
echo 仮想環境をアクティベートしました。
echo.

echo [4/4] 依存関係をインストール中...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo [エラー] 依存関係のインストールに失敗しました。
    pause
    exit /b 1
)
echo.

echo ========================================
echo セットアップが完了しました！
echo ========================================
echo.
echo アプリを実行するには:
echo   venv\Scripts\activate
echo   python -m streamlit run app.py
echo.
pause

