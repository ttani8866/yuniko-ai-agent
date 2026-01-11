"use client";

import { useState } from "react";
import { Search, MapPin, Utensils, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, areas, budgetRanges } from "@/data/mockData";

interface SearchBarProps {
  onSearch: (filters: {
    keyword: string;
    area: string;
    category: string;
    budget: string;
  }) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = () => {
    onSearch({ keyword, area, category, budget });
  };

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Keyword Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="店名、キーワードで検索..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-300 focus:ring-orange-200"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-orange-300 focus:ring-orange-200">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                <SelectValue placeholder="エリアを選択" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのエリア</SelectItem>
              {areas.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-orange-300 focus:ring-orange-200">
              <div className="flex items-center">
                <Utensils className="w-4 h-4 mr-2 text-orange-500" />
                <SelectValue placeholder="ジャンルを選択" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのジャンル</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-orange-300 focus:ring-orange-200">
              <div className="flex items-center">
                <Wallet className="w-4 h-4 mr-2 text-orange-500" />
                <SelectValue placeholder="予算を選択" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての予算</SelectItem>
              {budgetRanges.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium"
        >
          <Search className="w-5 h-5 mr-2" />
          この条件で検索
        </Button>
      </div>
    </div>
  );
}
