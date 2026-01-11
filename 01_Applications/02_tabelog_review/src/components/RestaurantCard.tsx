"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Utensils, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import { Restaurant } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index?: number;
}

export function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/restaurant/${restaurant.id}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            {/* Image Section */}
            <div className="relative h-44 bg-gray-100">
              {restaurant.images[0] ? (
                <Image
                  src={restaurant.images[0]}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Utensils className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <Badge className="bg-orange-500 hover:bg-orange-500 text-white text-xs px-2 py-1">
                  {restaurant.category}
                </Badge>
              </div>
              {/* Rating Badge */}
              <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
                <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span className="font-bold text-orange-600 text-sm">
                  {restaurant.rating.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <CardContent className="p-4">
              <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-1 hover:text-orange-600 transition-colors">
                {restaurant.name}
              </h3>
              <p className="text-xs text-gray-500 mb-3">{restaurant.nameKana}</p>

              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="line-clamp-1">{restaurant.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="line-clamp-1 text-xs">{restaurant.businessHours}</span>
                </div>
              </div>

              {/* Budget */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">昼: {restaurant.budget.lunch}</span>
                  <span className="text-gray-500">夜: {restaurant.budget.dinner}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mt-3">
                {restaurant.features.slice(0, 3).map((feature) => (
                  <Badge
                    key={feature}
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>

              {/* Review Count */}
              <p className="text-xs text-gray-500 mt-3">
                口コミ {restaurant.reviewCount}件
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
}
