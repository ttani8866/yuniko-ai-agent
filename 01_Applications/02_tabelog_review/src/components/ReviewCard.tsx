"use client";

import { motion } from "framer-motion";
import { ThumbsUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "./StarRating";
import { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
  index?: number;
  isNew?: boolean;
}

export function ReviewCard({ review, index = 0, isNew = false }: ReviewCardProps) {
  const visitTypeLabel = {
    lunch: "ランチ",
    dinner: "ディナー",
    drink: "飲み会",
  };

  const scoreLabels = {
    taste: "味",
    service: "サービス",
    atmosphere: "雰囲気",
    costPerformance: "CP",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: isNew ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: isNew ? 0 : index * 0.1 }}
    >
      <Card className="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-gray-200">
                <AvatarImage src={review.userAvatar} alt={review.userName} />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-sm">
                  {review.userName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900 text-sm">{review.userName}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{review.visitDate}訪問</span>
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    {visitTypeLabel[review.visitType]}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-xl font-bold text-orange-600 mt-0.5">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg">
            {Object.entries(review.scores).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-xs text-gray-500 mb-1">
                  {scoreLabels[key as keyof typeof scoreLabels]}
                </p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${value * 20}%` }}
                  />
                </div>
                <p className="text-xs font-bold text-orange-600 mt-1">{value.toFixed(1)}</p>
              </div>
            ))}
          </div>

          <Separator className="bg-gray-100" />

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-orange-600 hover:bg-orange-50 text-xs"
            >
              <ThumbsUp className="w-3.5 h-3.5 mr-1.5" />
              参考になった ({review.helpfulCount})
            </Button>
            <span className="text-xs text-gray-400">{review.createdAt}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
