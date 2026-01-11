@echo off
REM Streamlitアプリを実行するスクリプト
echo ========================================
echo 全自動AI動画メーカー - 起動スクリプト
echo ========================================
echo.

REM 仮想環境が存在するか確認
if exist venv\Scripts\activate.bat (
    echo 仮想環境をアクティベート中...
    call venv\Scripts\activate.bat
    echo.
    
    REM Pythonのバージョンを確認
    python --version
    echo.
) else (
    echo [警告] 仮想環境が見つかりません。
    echo Python 3.13または3.12でセットアップを実行してください。
    echo.
    echo セットアップスクリプトを実行:
    echo   setup_python313.bat
    echo   または
    echo   setup_python312.bat
    echo.
    pause
    exit /b 1
)

REM Streamlitアプリを実行
echo Streamlitアプリを起動中...
echo.
python -m streamlit run app.py

pause

