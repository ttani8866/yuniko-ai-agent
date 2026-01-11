# Python 3.13/3.12 セットアップガイド

このプロジェクトは**Python 3.13または3.12**を使用してください。

### ステップ1: Python 3.13または3.12をインストール

1. **Python公式サイトからダウンロード**
   - Python 3.13: https://www.python.org/downloads/release/python-3130/
   - Python 3.12: https://www.python.org/downloads/release/python-3120/
   - 「Windows installer (64-bit)」をダウンロード

2. **インストール時の注意事項**
   - ✅ 「Add Python to PATH」にチェックを入れる
   - ✅ 「Install for all users」は任意
   - ✅ 「Install launcher for all users」にチェックを入れる

3. **インストール完了後、バージョンを確認**
   ```cmd
   py --list
   ```
   これで、インストールされたPythonバージョンの一覧が表示されます。

### ステップ2: このプロジェクトでPython 3.13または3.12を使用する

#### 方法A: py launcherを使用（推奨）

```cmd
cd 01_Applications\04_tubeauto

# Python 3.13を使用する場合
py -3.13 -m venv venv

# Python 3.12を使用する場合
py -3.12 -m venv venv

# 仮想環境をアクティベート
venv\Scripts\activate

# 依存関係をインストール
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

#### 方法B: 仮想環境を作成せずに直接使用

```cmd
cd 01_Applications\04_tubeauto

# Python 3.13を使用する場合
py -3.13 -m pip install --upgrade pip
py -3.13 -m pip install -r requirements.txt

# アプリを実行する場合
py -3.13 -m streamlit run app.py
```

### ステップ3: Streamlitアプリを実行

```cmd
cd 01_Applications\04_tubeauto

# 仮想環境を使用している場合
venv\Scripts\activate
python -m streamlit run app.py

# 仮想環境を使用していない場合
py -3.13 -m streamlit run app.py
# または
py -3.12 -m streamlit run app.py
```

## トラブルシューティング

### Python 3.13/3.12が認識されない場合

1. **環境変数PATHを確認**
   - `C:\Users\<ユーザー名>\AppData\Local\Programs\Python\Python313`（またはPython312）
   - `C:\Users\<ユーザー名>\AppData\Local\Programs\Python\Python313\Scripts`

2. **py launcherが正しく動作するか確認**
   ```cmd
   py --list
   ```

3. **再起動**
   - コマンドプロンプトを閉じて再度開く
   - または、システムを再起動

### パッケージのインストールエラーが発生する場合

1. **pipをアップグレード**
   ```cmd
   python -m pip install --upgrade pip
   ```

2. **キャッシュをクリア**
   ```cmd
   python -m pip cache purge
   ```

3. **個別にインストール**
   ```cmd
   python -m pip install numpy
   python -m pip install opencv-python
   python -m pip install pydub
   ```

## 推奨される構成

- **Pythonバージョン**: 3.13 または 3.12
- **仮想環境**: 使用を推奨（プロジェクトごとに依存関係を分離）
- **パッケージマネージャー**: pip（標準）

## 参考リンク

- Python公式サイト: https://www.python.org/
- Python 3.13ドキュメント: https://docs.python.org/3.13/
- Python 3.12ドキュメント: https://docs.python.org/3.12/
- Streamlitドキュメント: https://docs.streamlit.io/

