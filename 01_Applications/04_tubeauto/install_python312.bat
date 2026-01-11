@echo off
REM Python 3.12をインストールするバッチファイル
echo ========================================
echo Python 3.12 インストールスクリプト
echo ========================================
echo.

set INSTALLER_PATH=%TEMP%\python-3.12.8-amd64.exe

if not exist "%INSTALLER_PATH%" (
    echo [エラー] インストーラーが見つかりません: %INSTALLER_PATH%
    echo download_and_install_python.py を先に実行してください。
    pause
    exit /b 1
)

echo インストーラーを実行します...
echo.
echo 重要: インストール時に以下を確認してください:
echo   1. 「Add Python to PATH」にチェックを入れる
echo   2. 「Install launcher for all users」にチェックを入れる
echo.
pause

"%INSTALLER_PATH%" /passive PrependPath=1 Include_launcher=1

echo.
echo ========================================
echo インストールが完了しました！
echo ========================================
echo.
echo コマンドプロンプトを再起動してから、以下を実行してください:
echo   py --list
echo.
pause

