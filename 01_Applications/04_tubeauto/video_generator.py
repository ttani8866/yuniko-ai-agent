"""
動画編集モジュール
OpenCVとpydubを使用して、画像、音声、字幕を組み合わせて動画を生成する
"""

import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from pydub import AudioSegment
import subprocess
import tempfile

# 日本語フォントのパスを設定
# Windowsの場合の一般的なパス例（実際の環境に合わせて変更してください）
FONT_PATH = "C:/Windows/Fonts/msgothic.ttc"

# よくある日本語フォントのパスを自動検出
POSSIBLE_FONT_PATHS = [
    # Windows
    "C:/Windows/Fonts/msgothic.ttc",  # MS ゴシック
    "C:/Windows/Fonts/msmincho.ttc",   # MS 明朝
    "C:/Windows/Fonts/meiryo.ttc",     # メイリオ
    "C:/Windows/Fonts/yugothic.ttf",   # 游ゴシック
    # macOS
    "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc",
    "/System/Library/Fonts/ヒラギノ明朝 W3.ttc",
    # Linux
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
]

# フォントパスを自動検出
for path in POSSIBLE_FONT_PATHS:
    if os.path.exists(path):
        FONT_PATH = path
        break

# フォントが見つからない場合の警告
if FONT_PATH is None:
    print("警告: 日本語フォントが見つかりませんでした。字幕が正しく表示されない可能性があります。")
    print("FONT_PATHを手動で設定してください。")


def get_audio_duration(audio_path: str) -> float:
    """
    音声ファイルの長さを取得する
    
    Args:
        audio_path: 音声ファイルのパス
        
    Returns:
        音声の長さ（秒）
    """
    audio = AudioSegment.from_mp3(audio_path)
    return len(audio) / 1000.0  # ミリ秒を秒に変換


def apply_ken_burns_effect(image: np.ndarray, zoom_factor: float = 1.2, num_frames: int = 1) -> np.ndarray:
    """
    Ken Burns効果（緩やかなズーム）を適用した画像を生成する
    
    Args:
        image: 入力画像（numpy配列）
        zoom_factor: ズーム倍率（デフォルト: 1.2）
        num_frames: フレーム数（デフォルト: 1、アニメーション用）
        
    Returns:
        ズーム効果が適用された画像
    """
    h, w = image.shape[:2]
    
    # ズーム後のサイズを計算
    new_h = int(h * zoom_factor)
    new_w = int(w * zoom_factor)
    
    # リサイズ
    img_resized = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
    
    # 中央をクロップ
    start_y = (new_h - h) // 2
    start_x = (new_w - w) // 2
    img_cropped = img_resized[start_y:start_y + h, start_x:start_x + w]
    
    return img_cropped


def create_subtitle_image(text: str, width: int = 1920, height: int = 200, font_path: str = None) -> np.ndarray:
    """
    字幕を画像として生成する
    
    Args:
        text: 字幕テキスト
        width: 画像の幅
        height: 画像の高さ
        font_path: フォントファイルのパス
        
    Returns:
        字幕画像のnumpy配列（BGR形式、OpenCV用）
    """
    if font_path is None:
        font_path = FONT_PATH
    
    # 透明な背景の画像を作成
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # フォントを読み込む
    font_size = 50
    font = None
    
    if font_path and os.path.exists(font_path):
        try:
            # TTCファイルの場合は、インデックス0を指定
            if font_path.endswith('.ttc'):
                font = ImageFont.truetype(font_path, font_size, index=0)
            else:
                font = ImageFont.truetype(font_path, font_size)
        except Exception as e:
            print(f"フォント読み込みエラー: {str(e)}")
            font = ImageFont.load_default()
    else:
        font = ImageFont.load_default()
    
    # テキストのサイズを計算
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # 中央に配置
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # 黒い縁取りを描画（ストローク効果）
    stroke_width = 3
    for adj in range(-stroke_width, stroke_width + 1):
        for adj2 in range(-stroke_width, stroke_width + 1):
            if adj != 0 or adj2 != 0:
                draw.text((x + adj, y + adj2), text, font=font, fill=(0, 0, 0, 255))
    
    # 白いテキストを描画
    draw.text((x, y), text, font=font, fill=(255, 255, 255, 255))
    
    # numpy配列に変換（RGBA -> BGR）
    img_array = np.array(img)
    # OpenCV用にBGRに変換（アルファチャンネルを考慮）
    bgr_img = cv2.cvtColor(img_array, cv2.COLOR_RGBA2BGR)
    
    return bgr_img


def create_video(script_data: list, output_file: str = "output.mp4") -> str:
    """
    台本データから動画を生成する
    
    Args:
        script_data: 台本データのリスト。各要素は {"text": "...", "visual_prompt": "...", "subtitle": "..."} の形式
        output_file: 出力ファイル名
        
    Returns:
        生成された動画ファイルのパス
        
    Raises:
        Exception: 動画生成に失敗した場合
    """
    try:
        fps = 24
        video_clips = []
        audio_segments = []
        
        for i, section in enumerate(script_data):
            # 画像ファイルのパスを取得
            image_path = section.get("image_path", f"image_{i}.png")
            audio_path = section.get("audio_path", f"audio_{i}.mp3")
            subtitle_text = section.get("subtitle", section.get("text", ""))
            
            # 画像ファイルが存在するか確認（絶対パスに変換）
            if not os.path.isabs(image_path):
                # 相対パスの場合、現在の作業ディレクトリからのパスを確認
                abs_image_path = os.path.abspath(image_path)
            else:
                abs_image_path = image_path
            
            if not os.path.exists(abs_image_path):
                raise FileNotFoundError(f"画像ファイルが見つかりません: {abs_image_path} (元のパス: {image_path})")
            
            # 音声ファイルが存在するか確認（絶対パスに変換）
            if not os.path.isabs(audio_path):
                abs_audio_path = os.path.abspath(audio_path)
            else:
                abs_audio_path = audio_path
            
            if not os.path.exists(abs_audio_path):
                raise FileNotFoundError(f"音声ファイルが見つかりません: {abs_audio_path} (元のパス: {audio_path})")
            
            # 絶対パスを使用
            image_path = abs_image_path
            audio_path = abs_audio_path
            
            # 音声の長さを取得
            audio_duration = get_audio_duration(audio_path)
            num_frames = int(audio_duration * fps)
            
            # 画像を読み込む
            img = cv2.imread(image_path)
            if img is None:
                raise Exception(f"画像を読み込めませんでした: {image_path}")
            
            h, w = img.shape[:2]
            
            # 動画の標準サイズにリサイズ（16:9のアスペクト比を維持）
            target_width = 1920
            target_height = 1080
            
            img_aspect = w / h
            target_aspect = target_width / target_height
            
            # アスペクト比に応じてリサイズ
            if img_aspect > target_aspect:
                # 横長の場合、高さを基準にリサイズ
                new_height = target_height
                new_width = int(target_height * img_aspect)
            else:
                # 縦長の場合、幅を基準にリサイズ
                new_width = target_width
                new_height = int(target_width / img_aspect)
            
            img_resized = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)
            
            # 中央に配置（余白を黒で埋める）
            video_frame = np.zeros((target_height, target_width, 3), dtype=np.uint8)
            start_y = (target_height - new_height) // 2
            start_x = (target_width - new_width) // 2
            video_frame[start_y:start_y + new_height, start_x:start_x + new_width] = img_resized
            
            # 字幕画像を生成
            subtitle_img = create_subtitle_image(subtitle_text, target_width, 150, FONT_PATH)
            
            # フレームを生成（Ken Burns効果とフェード効果を含む）
            frames = []
            for frame_idx in range(num_frames):
                progress = frame_idx / max(num_frames - 1, 1)
                
                # Ken Burns効果（ズーム）
                zoom = 1.0 + 0.15 * progress  # 1.0から1.15へ
                zoomed_img = apply_ken_burns_effect(video_frame, zoom)
                
                # フェード効果
                fade_in = min(progress * 2, 1.0) if progress < 0.5 else 1.0
                fade_out = min((1.0 - progress) * 2, 1.0) if progress > 0.5 else 1.0
                fade = min(fade_in, fade_out)
                
                # フェードを適用
                frame = (zoomed_img * fade).astype(np.uint8)
                
                # 字幕を合成
                subtitle_y = target_height - 150
                frame[subtitle_y:subtitle_y + 150, :] = cv2.addWeighted(
                    frame[subtitle_y:subtitle_y + 150, :], 1.0 - 0.7,
                    subtitle_img, 0.7, 0
                )
                
                frames.append(frame)
            
            video_clips.append(frames)
            
            # 音声を読み込む
            audio = AudioSegment.from_mp3(audio_path)
            audio_segments.append(audio)
        
        # すべてのフレームを結合
        all_frames = []
        for frames in video_clips:
            all_frames.extend(frames)
        
        # 動画を書き出し
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_file, fourcc, fps, (target_width, target_height))
        
        if not out.isOpened():
            raise Exception(f"動画ファイルを開けませんでした: {output_file}")
        
        for frame in all_frames:
            out.write(frame)
        out.release()
        
        # 動画ファイルが正しく作成されたか確認
        if not os.path.exists(output_file) or os.path.getsize(output_file) == 0:
            raise Exception(f"動画ファイルが正しく作成されませんでした: {output_file}")
        
        # 音声を結合
        combined_audio = sum(audio_segments)
        
        # 一時ファイルに音声を保存
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_audio:
            temp_audio_path = temp_audio.name
            combined_audio.export(temp_audio_path, format='mp3')
        
        # 音声ファイルが正しく作成されたか確認
        if not os.path.exists(temp_audio_path) or os.path.getsize(temp_audio_path) == 0:
            raise Exception(f"音声ファイルが正しく作成されませんでした: {temp_audio_path}")
        
        # ffmpegで動画と音声を結合
        temp_output = output_file.replace('.mp4', '_temp.mp4')
        if os.path.exists(temp_output):
            os.remove(temp_output)
        os.rename(output_file, temp_output)
        
        # リネーム後のファイルの存在確認
        if not os.path.exists(temp_output):
            raise Exception(f"一時動画ファイルの作成に失敗しました: {temp_output}")
        
        # ffmpegで動画と音声を結合を試みる
        ffmpeg_success = False
        
        try:
            # ffmpegが存在するか確認（Windowsでは.exeが必要な場合がある）
            ffmpeg_cmd = 'ffmpeg'
            try:
                result = subprocess.run([ffmpeg_cmd, '-version'], capture_output=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW if hasattr(subprocess, 'CREATE_NO_WINDOW') else 0)
                ffmpeg_success = result.returncode == 0
            except (FileNotFoundError, OSError):
                ffmpeg_success = False
            
            if ffmpeg_success:
                # ffmpegコマンドを実行
                cmd = [
                    ffmpeg_cmd, '-y', '-i', temp_output, '-i', temp_audio_path,
                    '-c:v', 'copy', '-c:a', 'aac', '-strict', 'experimental',
                    output_file
                ]
                result = subprocess.run(cmd, capture_output=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW if hasattr(subprocess, 'CREATE_NO_WINDOW') else 0)
                if result.returncode == 0:
                    os.remove(temp_output)
                    os.remove(temp_audio_path)
                else:
                    ffmpeg_success = False
        except Exception:
            ffmpeg_success = False
        
        # ffmpegが使えない場合、音声なしの動画を返す
        if not ffmpeg_success:
            print("警告: ffmpegが見つからないか、実行に失敗しました。音声なしの動画を生成します。")
            if os.path.exists(temp_output):
                if os.path.exists(output_file):
                    os.remove(output_file)
                os.rename(temp_output, output_file)
            if os.path.exists(temp_audio_path):
                os.remove(temp_audio_path)
        
        return output_file
        
    except FileNotFoundError as e:
        # ファイルが見つからないエラーの場合、詳細な情報を提供
        error_msg = str(e)
        if "ffmpeg" in error_msg.lower() or "ffmpeg" in str(e):
            raise Exception(
                "動画生成に失敗しました: ffmpegが見つかりません。\n"
                "ffmpegをインストールするか、音声なしの動画を生成します。\n"
                "ffmpegのダウンロード: https://ffmpeg.org/download.html"
            )
        else:
            raise Exception(f"動画生成に失敗しました: {error_msg}\nファイルパスを確認してください。")
    except Exception as e:
        error_msg = str(e)
        # より詳細なエラーメッセージを提供
        if "WinError 2" in error_msg:
            raise Exception(
                f"動画生成に失敗しました: ファイルが見つかりません。\n"
                f"詳細: {error_msg}\n"
                f"画像や音声ファイルのパスを確認してください。"
            )
        else:
            raise Exception(f"動画生成に失敗しました: {error_msg}")
