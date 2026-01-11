import type { Metadata } from "next";
import { Oswald, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "VAZ | 数字のその先にある、心を科学する。",
  description: "混沌東京から生まれる、新しいクリエイティブの共鳴。A NEW FOLKLORE OF UTOPIA, BEAUTY, AND DECADENCE IN TOKYO.",
  keywords: ["VAZ", "クリエイティブ", "東京", "インフルエンサー", "マーケティング"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${oswald.variable} ${notoSansJP.variable} ${notoSerifJP.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
