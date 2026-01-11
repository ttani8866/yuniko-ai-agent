import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getToolById } from '@/lib/tools';

export async function POST(request: NextRequest) {
  try {
    const { toolId, userInput, imageBase64 } = await request.json();

    if (!toolId || !userInput) {
      return NextResponse.json(
        { error: 'toolId と userInput は必須です' },
        { status: 400 }
      );
    }

    const tool = getToolById(toolId);
    if (!tool) {
      return NextResponse.json(
        { error: '指定されたツールが見つかりません' },
        { status: 404 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY が設定されていません。.env.local を確認してください。' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // gemini-2.0-flash を使用（画像にも対応）
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    let prompt = `${tool.systemPrompt}

## ユーザーからの入力
${userInput}`;

    if (imageBase64) {
      // 画像付きの場合
      prompt += '\n\n## 添付画像\n添付された画像も参考にしてテキストを生成してください。';
      
      // Base64からデータ部分を抽出
      const base64Data = imageBase64.split(',')[1];
      const mimeType = imageBase64.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({ 
        success: true,
        output: text,
        toolName: tool.name,
      });
    } else {
      // テキストのみの場合
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({ 
        success: true,
        output: text,
        toolName: tool.name,
      });
    }

  } catch (error) {
    console.error('Generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `テキスト生成中にエラーが発生しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}
