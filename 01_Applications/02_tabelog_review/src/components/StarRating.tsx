"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  const stars = [];
  const fullStars = Math.floor(rating);
  const hasPartialStar = rating % 1 > 0;
  const partialFill = rating % 1;

  for (let i = 0; i < maxRating; i++) {
    if (i < fullStars) {
      // Full star
      stars.push(
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            "fill-orange-500 text-orange-500",
            interactive && "cursor-pointer hover:scale-110 transition-transform"
          )}
          onClick={() => interactive && onChange?.(i + 1)}
        />
      );
    } else if (i === fullStars && hasPartialStar) {
      // Partial star
      stars.push(
        <div key={i} className="relative">
          <Star className={cn(sizeClasses[size], "text-gray-300")} />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${partialFill * 100}%` }}
          >
            <Star
              className={cn(sizeClasses[size], "fill-orange-500 text-orange-500")}
            />
          </div>
        </div>
      );
    } else {
      // Empty star
      stars.push(
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            "text-gray-300",
            interactive && "cursor-pointer hover:scale-110 transition-transform hover:text-orange-300"
          )}
          onClick={() => interactive && onChange?.(i + 1)}
        />
      );
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      <div className="flex items-center">{stars}</div>
      {showValue && (
        <span className={cn("font-bold text-orange-600 ml-1", textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
