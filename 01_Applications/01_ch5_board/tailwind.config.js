/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 5ch風カラーパレット（より忠実に）
        board: {
          bg: '#efefef',
          header: '#800000', // 暗い赤
          headerText: '#ffffff',
          link: '#0000ee',
          visited: '#551a8b',
          text: '#000000',
          accent: '#cc1105',
          border: '#cccccc',
          res: '#efefef', // レス背景は基本白に近い
          resAlt: '#f0e0d6', // 交互または強調用
          resBorder: '#d9bfb7',
          name: '#228b22', // 名前（緑）
        }
      },
      fontFamily: {
        sans: ['MS PGothic', 'Meiryo', 'sans-serif'],
        mono: ['MS Gothic', 'monospace'],
      },
    },
  },
  plugins: [],
}

