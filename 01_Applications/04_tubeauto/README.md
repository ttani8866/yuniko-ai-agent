# TubeAuto - 全自動AI動画メーカー

PythonとStreamlitを使用して、YouTube風動画を全自動生成するアプリケーションです。

## 機能

- **AI台本生成**: GPT-4oを使用してテーマから台本を自動生成
- **画像生成**: DALL-E 3を使用して各シーン用の画像を自動生成
- **音声生成**: OpenAI TTSを使用して自然な音声を自動生成
- **動画合成**: MoviePyを使用して画像、音声、字幕を自動合成
- **Ken Burns効果**: 画像に緩やかなズーム効果を適用
- **日本語字幕**: 画面下部に日本語字幕を自動表示

## セットアップ

### 0. Pythonバージョンの確認（重要）

このプロジェクトは**Python 3.13または3.12**を使用してください。

#### 簡単セットアップ（推奨）

1. **Python 3.13または3.12をインストール**
   - Python 3.13: https://www.python.org/downloads/release/python-3130/
   - Python 3.12: https://www.python.org/downloads/release/python-3120/
   - 「Windows installer (64-bit)」をダウンロード
   - インストール時、「Add Python to PATH」にチェックを入れる

2. **セットアップスクリプトを実行**
   ```cmd
   # Python 3.13を使用する場合
   setup_python313.bat
   
   # Python 3.12を使用する場合
   setup_python312.bat
   ```

3. **アプリを起動**
   ```cmd
   run_app.bat
   ```

詳細な手順は `PYTHON_SETUP.md` を参照してください。

### 1. 依存ライブラリのインストール（手動セットアップ）

仮想環境を使用する場合:

```bash
# Python 3.13を使用する場合
py -3.13 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Python 3.12を使用する場合
py -3.12 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. ImageMagickについて（オプション）

**注意**: このアプリはImageMagickなしでも動作します。字幕はPIL（Pillow）を使用して画像として生成されるため、ImageMagickのインストールは不要です。

もしImageMagickをインストールしたい場合（無料、クレジットカード登録不要）:
1. [ImageMagick公式サイト](https://imagemagick.org/script/download.php)からダウンロード
2. インストール時、**"Install legacy utilities (e.g. convert)"** にチェックを入れる

### 3. 環境変数の設定

`.env`ファイルを作成して、OpenAI APIキーを設定してください。

Windowsの場合（コマンドプロンプト）:
```cmd
echo OPENAI_API_KEY=your_api_key_here > .env
```

または、手動で`.env`ファイルを作成して以下の内容を記述:
```
OPENAI_API_KEY=your_api_key_here
```

**重要**: `.env`ファイルには実際のAPIキーを設定してください。`your_api_key_here`の部分を置き換えてください。

### 4. 日本語フォントの設定（重要）

`video_generator.py`の`FONT_PATH`を、お使いのPCにある実在するフォントファイルのパス（.ttf や .ttc）に書き換えてください。

**詳細な手順は `FONT_SETUP.md` を参照してください。**

簡単な手順:
1. `01_Applications/04_tubeauto/video_generator.py`を開く
2. 14行目あたりの`FONT_PATH = None`を探す
3. Windowsのフォントフォルダ（`C:\Windows\Fonts`）から使いたいフォントを探す
4. パスを設定（例: `FONT_PATH = "C:/Windows/Fonts/msgothic.ttc"`）

よく使われるフォント:
- `msgothic.ttc` - MS ゴシック
- `meiryo.ttc` - メイリオ
- `msmincho.ttc` - MS 明朝

**注意**: パスはスラッシュ（`/`）で区切ってください。

## 使用方法

### 方法1: バッチファイルを使用（推奨）

```cmd
run_app.bat
```

### 方法2: 手動で起動

1. 仮想環境をアクティベート（使用している場合）:
```bash
venv\Scripts\activate
```

2. Streamlitアプリを起動:
```bash
# 仮想環境を使用している場合
python -m streamlit run app.py

# 仮想環境を使用していない場合
py -3.13 -m streamlit run app.py
# または
py -3.12 -m streamlit run app.py
```

2. ブラウザでアプリが開きます

3. 「動画のテーマ」にテーマを入力（例: 「日本の四季の美しさ」）

4. 「動画生成開始」ボタンをクリック

5. 進捗状況を確認しながら、生成された動画を待ちます

6. 生成された動画を確認・ダウンロードできます

## ファイル構成

- `app.py`: Streamlit UI
- `video_generator.py`: MoviePyを使った動画編集ロジック
- `utils.py`: OpenAI API連携（GPT-4o, DALL-E 3, TTS）
- `requirements.txt`: 依存ライブラリ
- `.env.example`: 環境変数テンプレート

## 注意事項

- **Python 3.13または3.12を使用してください**
- OpenAI APIの使用には料金がかかります
- 動画生成には時間がかかる場合があります（数分〜10分程度）
- ImageMagickのインストールは必須です（ただし、このアプリはImageMagickなしでも動作します）
- 日本語フォントのパス設定は必須です

## トラブルシューティング

### 字幕が表示されない / 文字化けする
- `video_generator.py`の`FONT_PATH`が正しく設定されているか確認してください
- フォントファイルのパスが存在するか確認してください
- `FONT_SETUP.md`を参照して、フォント設定手順を確認してください

### APIエラー
- `.env`ファイルに正しくAPIキーが設定されているか確認してください
- APIキーに十分なクレジットがあるか確認してください

