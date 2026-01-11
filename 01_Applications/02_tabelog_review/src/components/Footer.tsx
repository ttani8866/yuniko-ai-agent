"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">食</span>
              </div>
              <span className="text-xl font-bold text-white">グルメナビ</span>
            </div>
            <p className="text-sm leading-relaxed">
              グルメナビは、実際に訪れたユーザーの口コミを基に、
              あなたにぴったりのレストランを見つけるお手伝いをします。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">サービス</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  お店を探す
                </Link>
              </li>
              <li>
                <Link href="/write-review" className="hover:text-orange-500 transition-colors">
                  口コミを書く
                </Link>
              </li>
              <li>
                <Link href="/ranking" className="hover:text-orange-500 transition-colors">
                  ランキング
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">サポート</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-orange-500 transition-colors">
                  ヘルプ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-500 transition-colors">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange-500 transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-orange-500 transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2026 グルメナビ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

