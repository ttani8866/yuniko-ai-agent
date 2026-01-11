"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Star, Clock, MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Badge } from "@/components/ui/badge";
import { restaurants, categories, areas } from "@/data/mockData";

export default function HomePage() {
  const [filters, setFilters] = useState({
    keyword: "",
    area: "",
    category: "",
    budget: "",
  });

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      // Keyword filter
      if (
        filters.keyword &&
        !restaurant.name.toLowerCase().includes(filters.keyword.toLowerCase()) &&
        !restaurant.nameKana.toLowerCase().includes(filters.keyword.toLowerCase())
      ) {
        return false;
      }

      // Area filter
      if (filters.area && filters.area !== "all" && restaurant.area !== filters.area) {
        return false;
      }

      // Category filter
      if (
        filters.category &&
        filters.category !== "all" &&
        restaurant.category !== filters.category
      ) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleSearch = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  // Top rated restaurants for hero section
  const topRated = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              美味しいお店を
              <span className="text-orange-500">口コミ</span>
              で探そう
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              実際に訪れたユーザーのリアルな口コミを参考に、あなたにぴったりのレストランを見つけましょう
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* Quick Category Links */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm text-gray-500 flex-shrink-0">人気ジャンル:</span>
            {categories.slice(0, 8).map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-colors flex-shrink-0"
                onClick={() => setFilters((prev) => ({ ...prev, category }))}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">人気のお店</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topRated.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Restaurant List */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">お店一覧</h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredRestaurants.length}件のお店が見つかりました
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filteredRestaurants.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredRestaurants.map((restaurant, index) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="text-gray-400 mb-4">
                  <MapPin className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  条件に一致するお店が見つかりませんでした
                </h3>
                <p className="text-gray-500 text-sm">
                  検索条件を変更してお試しください
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Area Quick Links */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">エリアから探す</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setFilters((prev) => ({ ...prev, area }))}
                className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-sm font-medium"
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

