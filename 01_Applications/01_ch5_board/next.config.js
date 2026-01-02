/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ★ これを追加
  output: 'export',

  // ★ 画像を使っている場合の保険（使ってなくてもOK）
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
