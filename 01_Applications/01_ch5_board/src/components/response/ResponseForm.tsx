import { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ResponseFormProps {
  threadId: number;
  onSubmit: (data: { name?: string; mail?: string; body: string; imageUrl?: string }) => Promise<void>;
  disabled?: boolean;
}

export function ResponseForm({ threadId, onSubmit, disabled }: ResponseFormProps) {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('画像サイズは2MB以内にしてください');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!body.trim()) {
      setError('本文を入力してください');
      return;
    }

    if (body.length > 2000) {
      setError('本文は2000文字以内にしてください');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim() || undefined,
        mail: mail.trim() || undefined,
        body: body.trim(),
        imageUrl: imageUrl || undefined,
      });
      // 成功したらフォームをクリア（名前とメールは保持）
      setBody('');
      setImageUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-board-res border border-board-resBorder p-4"
    >
      <h3 className="font-bold mb-3">書き込む</h3>
      
      {disabled ? (
        <div className="text-center py-4 text-gray-500">
          このスレッドは1000レスに達したため書き込みできません（dat落ち）
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-600">名前</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="名無しさん"
                maxLength={32}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600">メール</label>
              <Input
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                placeholder="sage"
                maxLength={64}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-600">本文</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="本文を入力..."
              rows={4}
              maxLength={2000}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {body.length}/2000
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">画像添付（任意）</label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {imageUrl && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setImageUrl('')}
                >
                  削除
                </Button>
              )}
            </div>
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="プレビュー" className="h-20 w-auto border" />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting || !body.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              '投稿中...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                書き込む
              </>
            )}
          </Button>
        </form>
      )}
    </motion.div>
  );
}

