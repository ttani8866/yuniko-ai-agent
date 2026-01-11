"""
全自動AI動画メーカー - Streamlit UI
YouTube風動画を全自動生成するアプリケーション
"""

import streamlit as st
import os
import tempfile
import shutil

# フォント検出（moviepyがなくても動作するように）
# video_generator.pyからFONT_PATHを取得する代わりに、直接フォントパスを確認
POSSIBLE_FONT_PATHS = [
    "C:/Windows/Fonts/msgothic.ttc",  # MS ゴシック
    "C:/Windows/Fonts/msmincho.ttc",   # MS 明朝
    "C:/Windows/Fonts/meiryo.ttc",     # メイリオ
    "C:/Windows/Fonts/yugothic.ttf",   # 游ゴシック
]

FONT_PATH = None
for path in POSSIBLE_FONT_PATHS:
    if os.path.exists(path):
        FONT_PATH = path
        break

# 動画生成機能は実際に使う時だけインポート
# from utils import generate_script, generate_audio, generate_image
# from video_generator import create_video

# ページ設定
st.set_page_config(
    page_title="全自動AI動画メーカー",
    page_icon="🎬",
    layout="wide"
)

# タイトル
st.title("🎬 全自動AI動画メーカー")
st.markdown("---")

# 起動時の環境変数チェック
def check_environment():
    """起動時に環境変数とAPIキーをチェック"""
    from utils import client, client_error, validate_api_key
    import os
    
    errors = []
    warnings = []
    
    # APIキーのチェック
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        errors.append("❌ OpenAI APIキーが設定されていません。`.env.local`または`.env`ファイルに`OPENAI_API_KEY`を設定してください。")
    else:
        is_valid, error_msg = validate_api_key(api_key)
        if not is_valid:
            errors.append(f"❌ APIキーの設定に問題があります: {error_msg}")
        elif client is None:
            errors.append(f"❌ OpenAIクライアントの初期化に失敗しました: {client_error}")
        else:
            # APIキーが正しく設定されていることを確認
            masked_key = api_key[:10] + "..." + api_key[-4:] if len(api_key) > 14 else "***"
            warnings.append(f"✅ APIキーが設定されています: {masked_key}")
    
    return errors, warnings

# 環境チェックを実行
env_errors, env_warnings = check_environment()

# サイドバーに設定を配置
with st.sidebar:
    st.header("⚙️ 設定")
    
    # 環境エラーがある場合は表示
    if env_errors:
        for error in env_errors:
            st.error(error)
        st.info("💡 修正方法:\n1. `.env.local`ファイルを開く\n2. `OPENAI_API_KEY=sk-あなたのAPIキー` と記述\n3. ファイルを保存\n4. ページをリロード（F5キー）")
    elif env_warnings:
        for warning in env_warnings:
            st.success(warning)
    else:
        st.info("OpenAI APIキーは`.env.local`または`.env`ファイルに設定してください。")
    
    # フォントパスの確認
    if FONT_PATH:
        st.success(f"✅ フォント検出: {os.path.basename(FONT_PATH)}")
    else:
        st.warning("⚠️ 日本語フォントが見つかりません。字幕が正しく表示されない可能性があります。")
    
    # 環境情報の表示（展開可能）
    with st.expander("🔍 環境情報（デバッグ用）"):
        import sys
        st.code(f"""Python実行パス:
{sys.executable}

Pythonバージョン:
{sys.version.split()[0]}

現在の作業ディレクトリ:
{os.getcwd()}
""")
        
        # ライブラリのチェック
        libraries_status = []
        try:
            import cv2
            libraries_status.append(("✅", "opencv-python-headless", cv2.__version__))
        except ImportError:
            libraries_status.append(("❌", "opencv-python-headless", "未インストール"))
        
        try:
            import pydub
            # pydubには__version__属性がない場合があるため、安全に取得
            try:
                version = pydub.__version__
            except AttributeError:
                # importlib.metadataを使用してバージョンを取得
                try:
                    import importlib.metadata
                    version = importlib.metadata.version('pydub')
                except:
                    version = "インストール済み"
            libraries_status.append(("✅", "pydub", version))
        except ImportError:
            libraries_status.append(("❌", "pydub", "未インストール"))
        
        try:
            import numpy
            libraries_status.append(("✅", "numpy", numpy.__version__))
        except ImportError:
            libraries_status.append(("❌", "numpy", "未インストール"))
        
        st.markdown("**ライブラリの状態:**")
        for status, lib_name, version in libraries_status:
            st.text(f"{status} {lib_name}: {version}")

# メインコンテンツ
st.markdown("### 📝 動画のテーマを入力してください")

# テキスト入力
theme = st.text_input(
    "テーマ",
    placeholder="例: 日本の四季の美しさ、最新のAI技術、健康な生活習慣など",
    label_visibility="collapsed"
)

# 動画生成ボタン
if st.button("🚀 動画生成開始", type="primary", use_container_width=True):
    if not theme:
        st.error("❌ テーマを入力してください。")
    else:
        # 必要なモジュールをインポート（実際に使う時だけ）
        import sys
        import subprocess
        
        # Python環境の情報を表示（デバッグ用）
        python_path = sys.executable
        python_version = sys.version
        
        # 各ライブラリのインポートを個別にチェック
        missing_libraries = []
        
        # cv2のチェック
        try:
            import cv2
            cv2_version = cv2.__version__
        except ImportError as e:
            missing_libraries.append(("opencv-python-headless", "cv2", str(e)))
        
        # pydubのチェック
        try:
            import pydub
        except ImportError as e:
            missing_libraries.append(("pydub", "pydub", str(e)))
        
        # numpyのチェック
        try:
            import numpy
        except ImportError as e:
            missing_libraries.append(("numpy", "numpy", str(e)))
        
        # PILのチェック
        try:
            from PIL import Image
        except ImportError as e:
            missing_libraries.append(("pillow", "PIL", str(e)))
        
        # エラーがある場合は詳細を表示
        if missing_libraries:
            st.error("❌ 必要なライブラリがインストールされていません")
            st.markdown("### 詳細情報")
            st.code(f"Python実行パス: {python_path}\nPythonバージョン: {python_version.split()[0]}")
            
            st.markdown("### 不足しているライブラリ:")
            for lib_name, import_name, error_msg in missing_libraries:
                st.error(f"- **{lib_name}** (インポート名: `{import_name}`)")
                st.code(f"  エラー: {error_msg}")
            
            st.markdown("### インストール方法")
            install_cmd = "python -m pip install " + " ".join([lib[0] for lib in missing_libraries])
            st.code(install_cmd, language="bash")
            st.info(f"💡 ターミナルで以下のコマンドを実行してください:")
            st.code(f"cd 01_Applications\\04_tubeauto\n{install_cmd}", language="bash")
            st.info("💡 または: `pip install -r requirements.txt`")
            st.stop()
        
        # すべてのライブラリが揃っている場合のみインポート
        try:
            from utils import generate_script, generate_audio, generate_image
            from video_generator import create_video
        except ImportError as e:
            st.error(f"❌ モジュールのインポートに失敗しました: {str(e)}")
            st.code(f"Python実行パス: {python_path}\nPythonバージョン: {python_version}")
            st.info("💡 Streamlitアプリを再起動してください: `python -m streamlit run app.py`")
            st.stop()
        
        # APIキーの確認（既にサイドバーでチェック済みだが、念のため）
        if env_errors:
            st.error("❌ 環境設定に問題があります。サイドバーを確認してください。")
            st.stop()
        
        from utils import client
        if client is None:
            st.error("❌ OpenAI APIキーが正しく設定されていません。`.env.local`ファイルを確認してください。")
            st.stop()
        else:
            # 一時ディレクトリを作成
            temp_dir = tempfile.mkdtemp()
            
            try:
                # 進捗状況を表示するためのステータス
                status = st.status("🎬 動画生成を開始します...", expanded=True)
                
                with status:
                    st.write("📝 ステップ 1/5: 台本を生成中...")
                    progress_bar = st.progress(0)
                    
                    try:
                        # 台本を生成
                        script_data = generate_script(theme)
                        st.success(f"✅ 台本生成完了（{len(script_data)}セクション）")
                        progress_bar.progress(20)
                    except Exception as e:
                        st.error(f"❌ 台本生成エラー: {str(e)}")
                        raise
                    
                    # 各セクションの画像と音声を生成
                    for i, section in enumerate(script_data):
                        section_num = i + 1
                        total_sections = len(script_data)
                        
                        st.write(f"🎨 ステップ {section_num * 2}/5: セクション{section_num}の画像を生成中...")
                        try:
                            image_path = os.path.join(temp_dir, f"image_{i}.png")
                            generated_image_path = generate_image(
                                section["visual_prompt"],
                                os.path.join(temp_dir, f"image_{i}")
                            )
                            # ファイルを移動
                            if generated_image_path != image_path:
                                shutil.move(generated_image_path, image_path)
                            section["image_path"] = image_path
                            st.success(f"✅ セクション{section_num}の画像生成完了")
                        except Exception as e:
                            st.error(f"❌ 画像生成エラー（セクション{section_num}）: {str(e)}")
                            raise
                        
                        progress_bar.progress(20 + (section_num * 30 // total_sections))
                        
                        st.write(f"🔊 ステップ {section_num * 2 + 1}/5: セクション{section_num}の音声を生成中...")
                        try:
                            audio_path = os.path.join(temp_dir, f"audio_{i}.mp3")
                            generated_audio_path = generate_audio(
                                section["text"],
                                os.path.join(temp_dir, f"audio_{i}")
                            )
                            # ファイルを移動
                            if generated_audio_path != audio_path:
                                shutil.move(generated_audio_path, audio_path)
                            section["audio_path"] = audio_path
                            st.success(f"✅ セクション{section_num}の音声生成完了")
                        except Exception as e:
                            st.error(f"❌ 音声生成エラー（セクション{section_num}）: {str(e)}")
                            raise
                        
                        progress_bar.progress(20 + ((section_num * 2) * 30 // total_sections))
                    
                    st.write("🎬 ステップ 5/5: 動画を合成中...")
                    try:
                        output_path = os.path.join(temp_dir, "output.mp4")
                        # 絶対パスに変換
                        output_path = os.path.abspath(output_path)
                        final_video_path = create_video(script_data, output_path)
                        st.success("✅ 動画生成完了！")
                        progress_bar.progress(100)
                    except Exception as e:
                        st.error(f"❌ 動画生成エラー: {str(e)}")
                        raise
                
                # 生成された動画を表示
                st.markdown("---")
                st.markdown("### 🎉 生成された動画")
                
                if os.path.exists(final_video_path):
                    video_file = open(final_video_path, "rb")
                    video_bytes = video_file.read()
                    st.video(video_bytes)
                    
                    # ダウンロードボタン
                    st.download_button(
                        label="📥 動画をダウンロード",
                        data=video_bytes,
                        file_name="generated_video.mp4",
                        mime="video/mp4",
                        use_container_width=True
                    )
                else:
                    st.error("❌ 動画ファイルが見つかりません。")
                    
            except Exception as e:
                st.error(f"❌ エラーが発生しました: {str(e)}")
                # エラーの種類に応じて適切なヒントを表示
                error_str = str(e)
                if "ffmpeg" in error_str.lower() or "WinError 2" in error_str:
                    st.info("💡 ヒント: ffmpegが見つからない場合は、音声なしの動画が生成されます。\n"
                           "音声付き動画が必要な場合は、ffmpegをインストールしてください: https://ffmpeg.org/download.html")
                elif "ファイルが見つかりません" in error_str or "file not found" in error_str.lower():
                    st.info("💡 ヒント: 画像や音声ファイルのパスを確認してください。\n"
                           "一時ディレクトリのパスが正しく設定されているか確認してください。")
                else:
                    st.info("💡 ヒント: エラーの詳細を確認してください。必要に応じて、アプリを再起動してください。")
            finally:
                # 一時ファイルをクリーンアップ（オプション: デバッグ時はコメントアウト）
                # shutil.rmtree(temp_dir, ignore_errors=True)
                pass

# フッター
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center; color: gray;'>
        <p>全自動AI動画メーカー - Powered by OpenAI GPT-4o, DALL-E 3, TTS</p>
    </div>
    """,
    unsafe_allow_html=True
)

