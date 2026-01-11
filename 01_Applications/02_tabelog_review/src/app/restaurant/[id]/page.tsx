"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Phone,
  Calendar,
  ChevronLeft,
  Utensils,
  Star,
  ExternalLink,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StarRating } from "@/components/StarRating";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { restaurants, reviews } from "@/data/mockData";
import { Review } from "@/types";

export default function RestaurantDetailPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const restaurantReviews = reviews.filter((r) => r.restaurantId === restaurantId);

  const [localReviews, setLocalReviews] = useState<Review[]>(restaurantReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            お店が見つかりませんでした
          </h1>
          <Link href="/">
            <Button>トップページに戻る</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleReviewSubmit = (reviewData: {
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
  }) => {
    const newReview: Review = {
      id: `new-${Date.now()}`,
      restaurantId: restaurant.id,
      userId: "current-user",
      userName: "ゲストユーザー",
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      rating: reviewData.rating,
      visitDate: new Date().toISOString().split("T")[0],
      visitType: reviewData.visitType as "lunch" | "dinner" | "drink",
      title: reviewData.title,
      content: reviewData.content,
      images: [],
      helpfulCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      scores: reviewData.scores,
    };

    setLocalReviews((prev) => [newReview, ...prev]);
    setShowReviewForm(false);
  };

  const averageScores = useMemo(() => {
    if (localReviews.length === 0) return null;

    const totals = localReviews.reduce(
      (acc, review) => ({
        taste: acc.taste + review.scores.taste,
        service: acc.service + review.scores.service,
        atmosphere: acc.atmosphere + review.scores.atmosphere,
        costPerformance: acc.costPerformance + review.scores.costPerformance,
      }),
      { taste: 0, service: 0, atmosphere: 0, costPerformance: 0 }
    );

    const count = localReviews.length;
    return {
      taste: totals.taste / count,
      service: totals.service / count,
      atmosphere: totals.atmosphere / count,
      costPerformance: totals.costPerformance / count,
    };
  }, [localReviews]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            お店一覧に戻る
          </Link>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative h-64 md:h-80 rounded-xl overflow-hidden">
              <Image
                src={restaurant.images[0]}
                alt={restaurant.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-4">
              {restaurant.images.slice(1, 3).map((image, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden bg-gray-100"
                >
                  <Image
                    src={image}
                    alt={`${restaurant.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-orange-500 text-white">
                  {restaurant.category}
                </Badge>
                <span className="text-sm text-gray-500">{restaurant.area}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {restaurant.name}
              </h1>
              <p className="text-sm text-gray-500">{restaurant.nameKana}</p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-3">
                <StarRating rating={restaurant.rating} size="lg" />
                <span className="text-3xl font-bold text-orange-600">
                  {restaurant.rating.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {localReviews.length}件の口コミ
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mt-4">
            {restaurant.features.map((feature) => (
              <Badge key={feature} variant="outline" className="text-gray-600">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="w-full justify-start bg-white border border-gray-200 p-1 mb-6">
                  <TabsTrigger value="reviews" className="flex-1">
                    口コミ ({localReviews.length})
                  </TabsTrigger>
                  <TabsTrigger value="info" className="flex-1">
                    店舗情報
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="reviews" className="space-y-6">
                  {/* Write Review Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      口コミを書く
                    </Button>
                  </div>

                  {/* Review Form */}
                  <AnimatePresence>
                    {showReviewForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ReviewForm
                          restaurantName={restaurant.name}
                          onSubmit={handleReviewSubmit}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {localReviews.map((review, index) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        index={index}
                        isNew={review.id.startsWith("new-")}
                      />
                    ))}
                  </div>

                  {localReviews.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                      <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        まだ口コミがありません。最初の口コミを投稿してみませんか？
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="info">
                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6 space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        {restaurant.description}
                      </p>

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">住所</p>
                            <p className="text-gray-900">{restaurant.address}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">電話番号</p>
                            <p className="text-gray-900">{restaurant.tel}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">営業時間</p>
                            <p className="text-gray-900">{restaurant.businessHours}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">定休日</p>
                            <p className="text-gray-900">{restaurant.holiday}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Utensils className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">予算</p>
                            <p className="text-gray-900">
                              昼: {restaurant.budget.lunch} / 夜: {restaurant.budget.dinner}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Score Breakdown */}
              {averageScores && (
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4">評価の内訳</h3>
                    <div className="space-y-3">
                      {[
                        { key: "taste", label: "味" },
                        { key: "service", label: "サービス" },
                        { key: "atmosphere", label: "雰囲気" },
                        { key: "costPerformance", label: "コスパ" },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-20">{label}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{
                                width: `${
                                  averageScores[key as keyof typeof averageScores] * 20
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold text-orange-600 w-8">
                            {averageScores[key as keyof typeof averageScores].toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Info */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">店舗情報</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">エリア</span>
                      <span className="text-gray-900">{restaurant.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ジャンル</span>
                      <span className="text-gray-900">{restaurant.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">昼の予算</span>
                      <span className="text-gray-900">{restaurant.budget.lunch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">夜の予算</span>
                      <span className="text-gray-900">{restaurant.budget.dinner}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0">
                <CardContent className="p-6 text-center text-white">
                  <h3 className="font-bold text-lg mb-2">このお店に行きましたか？</h3>
                  <p className="text-sm text-white/80 mb-4">
                    あなたの体験を共有してください
                  </p>
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-white text-orange-600 hover:bg-orange-50"
                  >
                    口コミを書く
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

