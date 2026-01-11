"use client";

import Link from "next/link";
import { Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">食</span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              グルメナビ
            </span>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="エリア、店名、料理名で検索"
                className="pl-10 pr-4 h-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>
            <Link href="/mypage">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600">
                <User className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">マイページ</span>
              </Button>
            </Link>
            <Link href="/write-review">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                口コミを書く
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

