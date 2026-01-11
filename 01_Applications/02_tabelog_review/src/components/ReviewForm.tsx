"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  restaurantName?: string;
  onSubmit: (review: {
    rating: number;
    visitType: string;
    title: string;
    content: string;
    scores: {
      taste: number;
      service: number;
      atmosphere: number;
      costPerformance: number;
    };
  }) => void;
}

export function ReviewForm({ restaurantName, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [visitType, setVisitType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scores, setScores] = useState({
    taste: 0,
    service: 0,
    atmosphere: 0,
    costPerformance: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const scoreLabels = {
    taste: "味",
    service: "サービス",
    atmosphere: "雰囲気",
    costPerformance: "コスパ",
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (rating === 0) newErrors.rating = "評価を選択してください";
    if (!visitType) newErrors.visitType = "訪問タイプを選択してください";
    if (!title.trim()) newErrors.title = "タイトルを入力してください";
    if (!content.trim()) newErrors.content = "口コミ内容を入力してください";
    if (content.length < 50) newErrors.content = "口コミは50文字以上で入力してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSubmit({
      rating,
      visitType,
      title,
      content,
      scores,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          口コミを投稿しました！
        </h3>
        <p className="text-gray-600">ご投稿ありがとうございます。</p>
      </motion.div>
    );
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">
          {restaurantName ? `${restaurantName}の口コミを書く` : "口コミを投稿"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label className={cn(errors.rating && "text-red-500")}>
              総合評価 <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className={cn(
                    "w-8 h-8 cursor-pointer transition-all hover:scale-110",
                    value <= (hoverRating || rating)
                      ? "fill-orange-500 text-orange-500"
                      : "text-gray-300"
                  )}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(value)}
                />
              ))}
              {rating > 0 && (
                <span className="text-2xl font-bold text-orange-600 ml-2">
                  {rating}.0
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm">{errors.rating}</p>
            )}
          </div>

          {/* Visit Type */}
          <div className="space-y-2">
            <Label className={cn(errors.visitType && "text-red-500")}>
              訪問タイプ <span className="text-red-500">*</span>
            </Label>
            <Select value={visitType} onValueChange={setVisitType}>
              <SelectTrigger
                className={cn(
                  "bg-gray-50 border-gray-200",
                  errors.visitType && "border-red-500 focus:ring-red-200"
                )}
              >
                <SelectValue placeholder="訪問タイプを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lunch">ランチ</SelectItem>
                <SelectItem value="dinner">ディナー</SelectItem>
                <SelectItem value="drink">飲み会</SelectItem>
              </SelectContent>
            </Select>
            {errors.visitType && (
              <p className="text-red-500 text-sm">{errors.visitType}</p>
            )}
          </div>

          {/* Score Details */}
          <div className="space-y-3">
            <Label>詳細評価（任意）</Label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(scoreLabels).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-medium text-orange-600">
                      {scores[key as keyof typeof scores] || "-"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={cn(
                          "w-5 h-5 cursor-pointer transition-transform hover:scale-110",
                          value <= scores[key as keyof typeof scores]
                            ? "fill-orange-400 text-orange-400"
                            : "text-gray-300"
                        )}
                        onClick={() =>
                          setScores((prev) => ({
                            ...prev,
                            [key]: value,
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className={cn(errors.title && "text-red-500")}>
              タイトル <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="一言で感想を表現してください"
              className={cn(
                "bg-gray-50 border-gray-200",
                errors.title && "border-red-500 focus:ring-red-200"
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className={cn(errors.content && "text-red-500")}>
              口コミ内容 <span className="text-red-500">*</span>
              <span className="text-gray-500 text-xs ml-2">
                （{content.length}/50文字以上）
              </span>
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="料理の味、サービス、雰囲気など、詳しくお聞かせください"
              rows={6}
              className={cn(
                "bg-gray-50 border-gray-200 resize-none",
                errors.content && "border-red-500 focus:ring-red-200"
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                口コミを投稿する
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

