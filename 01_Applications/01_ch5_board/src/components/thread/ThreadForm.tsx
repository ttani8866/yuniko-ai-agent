import { useState } from 'react';
import { useRouter } from 'next/router';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ThreadFormProps {
  boardId: string;
}

export function ThreadForm({ boardId }: ThreadFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
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
    
    if (!title.trim()) {
      setError('スレッドタイトルを入力してください');
      return;
    }

    if (title.length > 48) {
      setError('タイトルは48文字以内にしてください');
      return;
    }

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
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId,
          title: title.trim(),
          name: name.trim() || undefined,
          mail: mail.trim() || undefined,
          body: body.trim(),
          imageUrl: imageUrl || undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'スレッド作成に失敗しました');
      }

      // 作成したスレッドに遷移
      router.push(`/${boardId}/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'スレッド作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-board-res border border-board-resBorder p-4"
    >
      <h2 className="font-bold text-lg mb-4">新規スレッド作成</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">スレッドタイトル *</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="スレッドのタイトル（48文字以内）"
            maxLength={48}
            required
          />
          <div className="text-xs text-gray-500 text-right mt-1">
            {title.length}/48
          </div>
        </div>

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
          <label className="text-sm text-gray-600">本文（1レス目） *</label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="スレッドの本文..."
            rows={6}
            maxLength={2000}
            required
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
          disabled={isSubmitting || !title.trim() || !body.trim()}
          className="w-full"
        >
          {isSubmitting ? (
            '作成中...'
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              スレッドを立てる
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}

