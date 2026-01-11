"""
OpenAI API連携モジュール
GPT-4o、DALL-E 3、TTSを使用して台本生成、画像生成、音声生成を行う
"""

import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# 環境変数を読み込む
# .env.localがあれば優先的に読み込み、なければ.envを読み込む
load_dotenv('.env.local')  # .env.localを優先
load_dotenv()  # .envも読み込む（.env.localがない場合のフォールバック）

# プレースホルダー値のリスト
PLACEHOLDER_VALUES = [
    'your_api_key_here',
    'your_api*****here',
    'your_api',
    'sk-your-api-key-here',
    'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
]


def validate_api_key(api_key: str) -> tuple[bool, str]:
    """
    APIキーの妥当性をチェックする
    
    Args:
        api_key: チェックするAPIキー
        
    Returns:
        (is_valid, error_message)のタプル
    """
    if not api_key:
        return False, "APIキーが設定されていません。"
    
    # プレースホルダー値のチェック
    api_key_lower = api_key.lower().strip()
    for placeholder in PLACEHOLDER_VALUES:
        if placeholder.lower() in api_key_lower:
            return False, f"APIキーがプレースホルダー値（{placeholder}）のままです。実際のAPIキーを設定してください。"
    
    # 形式チェック
    if not (api_key.startswith('sk-') or api_key.startswith('BlbkFJ')):
        return False, f"APIキーの形式が正しくありません。'sk-'または'BlbkFJ'で始まる必要があります。"
    
    # 長さチェック（最低限の長さ）
    if len(api_key) < 20:
        return False, "APIキーが短すぎます。正しいAPIキーを設定してください。"
    
    return True, ""


def initialize_openai_client() -> tuple[OpenAI | None, str]:
    """
    OpenAIクライアントを初期化し、APIキーの妥当性をチェックする
    
    Returns:
        (client, error_message)のタプル
        clientがNoneの場合はエラーメッセージが返される
    """
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        return None, "OpenAI APIキーが設定されていません。`.env.local`または`.env`ファイルに`OPENAI_API_KEY`を設定してください。"
    
    # APIキーの妥当性チェック
    is_valid, error_message = validate_api_key(api_key)
    if not is_valid:
        return None, f"APIキーの設定に問題があります: {error_message}"
    
    try:
        client = OpenAI(api_key=api_key)
        # 簡単なAPI呼び出しでテスト（オプション）
        # client.models.list()  # コメントアウト: 起動時に毎回API呼び出しすると遅い
        return client, ""
    except Exception as e:
        error_str = str(e)
        if "401" in error_str or "invalid_api_key" in error_str.lower():
            return None, "APIキーが無効です。正しいAPIキーを設定してください。https://platform.openai.com/account/api-keys から取得できます。"
        elif "429" in error_str:
            return None, "レート制限に達しています。しばらく待ってから再試行してください。"
        else:
            return None, f"OpenAIクライアントの初期化に失敗しました: {error_str}"


# OpenAIクライアントを初期化
client, client_error = initialize_openai_client()


def generate_script(theme: str) -> list:
    """
    テーマから台本を生成する
    
    Args:
        theme: 動画のテーマ
        
    Returns:
        台本データのリスト。各要素は {"text": "...", "visual_prompt": "...", "subtitle": "..."} の形式
        
    Raises:
        Exception: API呼び出しに失敗した場合
    """
    if client is None:
        raise Exception(client_error if client_error else "OpenAI APIキーが設定されていません。`.env.local`または`.env`ファイルに`OPENAI_API_KEY`を設定してください。")
    
    try:
        # GPT-4oを使用して台本を生成
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": """あなたは動画制作のプロデューサーです。
テーマに基づいて、親しみやすい口語体の日本語で台本を作成してください。
各セクションは、以下の3つのフィールドを含むJSONオブジェクトです:
- "text": 話すテキスト（口語体の日本語）
- "visual_prompt": 画像生成用のプロンプト（英語推奨）
- "subtitle": 字幕に表示するテキスト（簡潔に）

JSON形式で、以下のような構造で返してください:
{
  "sections": [
    {"text": "...", "visual_prompt": "...", "subtitle": "..."},
    {"text": "...", "visual_prompt": "...", "subtitle": "..."}
  ]
}"""
                },
                {
                    "role": "user",
                    "content": f"テーマ「{theme}」について、3〜5セクションの台本を作成してください。各セクションは話すテキスト、視覚的なプロンプト、字幕を含むJSONオブジェクトにしてください。"
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        
        # レスポンスからJSONを抽出
        content = response.choices[0].message.content
        result = json.loads(content)
        
        # "sections"キーから台本データを取得
        if "sections" in result:
            script_data = result["sections"]
        elif isinstance(result, list):
            script_data = result
        else:
            # フォールバック: 直接配列として扱う
            script_data = [result] if isinstance(result, dict) else []
        
        # 各セクションに必要なキーがあるか確認し、なければデフォルト値を設定
        formatted_data = []
        for section in script_data:
            formatted_section = {
                "text": section.get("text", section.get("話すテキスト", "")),
                "visual_prompt": section.get("visual_prompt", section.get("visualPrompt", section.get("視覚的なプロンプト", ""))),
                "subtitle": section.get("subtitle", section.get("字幕", section.get("text", "")))
            }
            # 空の値がないか確認
            if not formatted_section["text"] or not formatted_section["visual_prompt"]:
                continue
            formatted_data.append(formatted_section)
        
        if not formatted_data:
            raise Exception("有効な台本データが生成されませんでした。")
        
        return formatted_data
        
    except Exception as e:
        error_str = str(e)
        # エラーの種類に応じて適切なメッセージを返す
        if "401" in error_str or "invalid_api_key" in error_str.lower():
            raise Exception("APIキーが未設定または無効です。`.env.local`ファイルを確認してください。https://platform.openai.com/account/api-keys から正しいAPIキーを取得してください。")
        elif "429" in error_str:
            raise Exception("レート制限です。しばらく待ってから再試行してください。")
        elif "500" in error_str or "503" in error_str:
            raise Exception("サーバーエラーです。時間をおいて再試行してください。")
        else:
            raise Exception(f"台本生成に失敗しました: {error_str}")


def generate_audio(text: str, filename: str) -> str:
    """
    テキストから音声を生成する
    
    Args:
        text: 音声化するテキスト
        filename: 保存するファイル名（拡張子なし）
        
    Returns:
        生成された音声ファイルのパス
        
    Raises:
        Exception: API呼び出しに失敗した場合
    """
    if client is None:
        raise Exception(client_error if client_error else "OpenAI APIキーが設定されていません。`.env.local`または`.env`ファイルに`OPENAI_API_KEY`を設定してください。")
    
    try:
        # OpenAI TTSを使用して音声を生成
        response = client.audio.speech.create(
            model="tts-1",
            voice="alloy",
            input=text
        )
        
        # 音声ファイルを保存
        audio_path = f"{filename}.mp3"
        with open(audio_path, "wb") as f:
            f.write(response.content)
        
        return audio_path
        
    except Exception as e:
        error_str = str(e)
        if "401" in error_str or "invalid_api_key" in error_str.lower():
            raise Exception("APIキーが未設定または無効です。`.env.local`ファイルを確認してください。")
        elif "429" in error_str:
            raise Exception("レート制限です。しばらく待ってから再試行してください。")
        elif "500" in error_str or "503" in error_str:
            raise Exception("サーバーエラーです。時間をおいて再試行してください。")
        else:
            raise Exception(f"音声生成に失敗しました: {error_str}")


def generate_image(prompt: str, filename: str) -> str:
    """
    プロンプトから画像を生成する
    
    Args:
        prompt: 画像生成用のプロンプト
        filename: 保存するファイル名（拡張子なし）
        
    Returns:
        生成された画像ファイルのパス
        
    Raises:
        Exception: API呼び出しに失敗した場合
    """
    if client is None:
        raise Exception(client_error if client_error else "OpenAI APIキーが設定されていません。`.env.local`または`.env`ファイルに`OPENAI_API_KEY`を設定してください。")
    
    try:
        # DALL-E 3を使用して画像を生成
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1
        )
        
        # 画像URLを取得
        image_url = response.data[0].url
        
        # 画像をダウンロードして保存
        import requests
        img_response = requests.get(image_url)
        image_path = f"{filename}.png"
        with open(image_path, "wb") as f:
            f.write(img_response.content)
        
        return image_path
        
    except Exception as e:
        error_str = str(e)
        if "401" in error_str or "invalid_api_key" in error_str.lower():
            raise Exception("APIキーが未設定または無効です。`.env.local`ファイルを確認してください。")
        elif "429" in error_str:
            raise Exception("レート制限です。しばらく待ってから再試行してください。")
        elif "500" in error_str or "503" in error_str:
            raise Exception("サーバーエラーです。時間をおいて再試行してください。")
        else:
            raise Exception(f"画像生成に失敗しました: {error_str}")

