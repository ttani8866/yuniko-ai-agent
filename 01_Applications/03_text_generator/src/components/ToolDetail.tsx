'use client';

import { useState, useRef, useEffect } from 'react';
import { Tool } from '@/lib/tools';

interface ToolDetailProps {
  tool: Tool;
  onGenerate: (output: string, input: string, hasImage: boolean) => void;
  initialInput?: string;
}

export default function ToolDetail({ tool, onGenerate, initialInput = '' }: ToolDetailProps) {
  const [input, setInput] = useState(initialInput);
  const [additionalInput, setAdditionalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ツール変更時にリセット
  useEffect(() => {
    setInput(initialInput);
    setAdditionalInput('');
    setError(null);
    setUploadedImage(null);
    setImageFile(null);
  }, [tool.id, initialInput]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const fullInput = additionalInput 
        ? `${input}\n\n【追加指示】\n${additionalInput}`
        : input;

      const requestBody: { toolId: string; userInput: string; imageBase64?: string } = {
        toolId: tool.id,
        userInput: fullInput,
      };

      if (uploadedImage) {
        requestBody.imageBase64 = uploadedImage;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'エラーが発生しました');
      }

      onGenerate(data.output, input, !!uploadedImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center text-3xl">
              {tool.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
              <p className="text-gray-500 mt-1">{tool.description}</p>
            </div>
          </div>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              isFavorite
                ? 'bg-pink-50 border-pink-200 text-pink-600'
                : 'bg-white border-gray-200 text-gray-600 hover:border-pink-200'
            }`}
          >
            <svg
              className={`w-5 h-5 ${isFavorite ? 'fill-pink-500' : 'fill-none'}`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            お気に入り追加
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-8">
        {/* キャラクターメッセージ */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center text-2xl flex-shrink-0">
            🤖
          </div>
          <div className="bg-white rounded-2xl rounded-tl-none px-5 py-3 shadow-sm border border-gray-100">
            <p className="text-gray-700">以下の情報を入れてください</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* メイン入力 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {tool.id === 'rewriter' ? '書き直したい文章を入力してください。' : tool.inputPlaceholder}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tool.inputPlaceholder}
              className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-gray-700"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-400 mt-2">
              ※1000文字程度がおすすめです。長文にも対応していますが、長すぎるとエラーがでる可能性があります。
            </p>
          </div>

          {/* 画像アップロード */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              参考画像を添付（オプション）
            </label>
            
            {uploadedImage ? (
              <div className="relative inline-block">
                <img
                  src={uploadedImage}
                  alt="アップロード画像"
                  className="max-w-xs max-h-48 rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">クリックして画像をアップロード</p>
                <p className="text-gray-400 text-xs mt-1">PNG, JPG, GIF (最大 4MB)</p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* 追加指示 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              どのように{tool.id === 'rewriter' ? '書き直し' : '生成'}しますか？（オプション）
            </label>
            <textarea
              value={additionalInput}
              onChange={(e) => setAdditionalInput(e.target.value)}
              placeholder="例：カジュアルな口調で、絵文字を使って"
              className="w-full h-24 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-gray-700"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* 生成ボタン */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                生成中...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                テキストを生成
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
