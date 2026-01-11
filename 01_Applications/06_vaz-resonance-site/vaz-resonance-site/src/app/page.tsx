"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// ===== クリエイターデータ =====
const creators = [
  {
    name: "ぷろたん",
    handle: "@purotansu",
    followers: "380万",
    platform: "YouTube",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    sns: {
      youtube: "https://www.youtube.com/@purotansu",
      twitter: "https://twitter.com/purotansu",
      instagram: "https://www.instagram.com/purotansu/",
    },
  },
  {
    name: "コスメヲタちゃんねるサラ",
    handle: "@cosmeotaku_sara",
    followers: "150万",
    platform: "YouTube",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    sns: {
      youtube: "https://www.youtube.com/@cosmeotaku_sara",
      twitter: "https://twitter.com/cosmeotaku_sara",
      instagram: "https://www.instagram.com/cosmeotaku_sara/",
    },
  },
  {
    name: "さくら",
    handle: "@sakura_meltv",
    followers: "MelTV",
    platform: "YouTube",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    sns: {
      youtube: "https://www.youtube.com/@MelTV",
      twitter: "https://twitter.com/sakura_meltv",
      instagram: "https://www.instagram.com/sakura_meltv/",
    },
  },
  {
    name: "おさき",
    handle: "@osaki_meltv",
    followers: "MelTV",
    platform: "YouTube",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    sns: {
      youtube: "https://www.youtube.com/@osakinikki",
      twitter: "https://twitter.com/tiktok_osaki",
      instagram: "https://www.instagram.com/sakichanman_you/",
    },
  },
  {
    name: "もか",
    handle: "@moka_meltv",
    followers: "MelTV",
    platform: "YouTube",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
    sns: {
      youtube: "https://www.youtube.com/@MelTV",
      twitter: "https://twitter.com/moka_meltv",
      instagram: "https://www.instagram.com/moka_meltv/",
    },
  },
  {
    name: "Kirari",
    handle: "@kirari_meltv",
    followers: "MelTV",
    platform: "YouTube",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face",
    sns: {
      youtube: "https://www.youtube.com/@MelTV",
      twitter: "https://twitter.com/kirari_meltv",
      instagram: "https://www.instagram.com/kirari_meltv/",
    },
  },
  {
    name: "みけねこ。",
    handle: "@mikeneko",
    followers: "メジャーデビュー",
    platform: "Music",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=face",
    sns: {
      youtube: "https://www.youtube.com/@mikeneko",
      twitter: "https://twitter.com/mikeneko_music",
      instagram: "https://www.instagram.com/mikeneko_official/",
    },
  },
  {
    name: "その他100名以上",
    handle: "@vaz_creators",
    followers: "100+",
    platform: "Multi",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
    sns: {
      youtube: "https://vaz.co.jp/",
      twitter: "https://twitter.com/vaz_inc",
      instagram: "https://www.instagram.com/vaz_official/",
    },
  },
];

// ===== Vibe Graph 感情ラベル =====
const vibeLabels = [
  { name: "尊さ", nameEn: "Reverence", value: 92, color: "#C41E3A", description: "推しへの敬愛と崇拝" },
  { name: "無敵感", nameEn: "Invincibility", value: 87, color: "#37B5BD", description: "自己肯定と高揚感" },
  { name: "チル", nameEn: "Chill", value: 78, color: "#6B21A8", description: "心地よい脱力と安らぎ" },
  { name: "エモい", nameEn: "Emotional", value: 85, color: "#F97316", description: "懐かしさと切なさの融合" },
  { name: "共感性羞恥", nameEn: "Vicarious Shame", value: 65, color: "#EC4899", description: "他者を通じた恥ずかしさ" },
  { name: "てぇてぇ", nameEn: "Precious", value: 90, color: "#10B981", description: "関係性への尊さ" },
];

// ===== ソリューションデータ =====
const solutions = [
  {
    id: "01",
    name: "Story Arc Doctor",
    nameJa: "ストーリーアーク・ドクター",
    description: "物語の「感情曲線」を診断・最適化。コンテンツの没入ポイントと離脱リスクを可視化し、Z世代の心を掴むナラティブを処方します。",
    features: ["感情曲線の自動解析", "離脱ポイントの特定", "最適なオチのタイミング提案"],
    icon: "📈",
    color: "#C41E3A",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  },
  {
    id: "02",
    name: "Empathic Matching",
    nameJa: "共感マッチングシステム",
    description: "クリエイターの「Vibe」とブランドの「価値観」を感性レベルでマッチング。数字では測れない相性を科学的に導き出します。",
    features: ["Vibe Graph解析", "ブランド親和性スコア", "ファン層オーバーラップ分析"],
    icon: "🔗",
    color: "#37B5BD",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: "03",
    name: "Virtual Empathy Agent",
    nameJa: "バーチャル共感エージェント",
    description: "AIがファンコミュニティの「空気」を読み、最適なエンゲージメント戦略を自動生成。クリエイターとファンの絆を深めます。",
    features: ["コメント感情解析", "最適投稿タイミング", "コミュニティ健全性モニタリング"],
    icon: "🤖",
    color: "#6B21A8",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
  },
];

// ===== 感情アークデータ =====
const emotionalArcs = [
  { name: "シンデレラ型", nameEn: "Rise", path: "M 0 80 Q 25 70, 50 50 T 100 10", color: "#C41E3A" },
  { name: "V字回復型", nameEn: "Fall-Rise", path: "M 0 30 Q 25 60, 50 90 T 75 50 Q 87 30, 100 10", color: "#37B5BD" },
  { name: "悲劇型", nameEn: "Tragedy", path: "M 0 20 Q 25 10, 50 30 T 75 60 Q 87 75, 100 90", color: "#6B21A8" },
  { name: "オデッセイ型", nameEn: "Odyssey", path: "M 0 50 Q 15 20, 30 60 T 50 30 Q 65 70, 80 40 T 100 50", color: "#F97316" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeVibe, setActiveVibe] = useState<number | null>(null);
  const engineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      if (engineRef.current) {
        const rect = engineRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementHeight = rect.height;
        
        if (elementTop < windowHeight && elementTop + elementHeight > 0) {
          const progress = Math.min(Math.max((windowHeight - elementTop) / (windowHeight + elementHeight), 0), 1);
          setScrollProgress(progress);
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ===== Header ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="font-gothic text-2xl tracking-widest text-[#1A1A1A]">VAZ</div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#intro" className="text-sm text-black/60 hover:text-[#C41E3A] transition-colors">感性AI</a>
          <a href="#engine" className="text-sm text-black/60 hover:text-[#C41E3A] transition-colors">レゾナンスエンジン</a>
          <a href="#vibe" className="text-sm text-black/60 hover:text-[#C41E3A] transition-colors">Vibe Graph</a>
          <a href="#solutions" className="text-sm text-black/60 hover:text-[#C41E3A] transition-colors">ソリューション</a>
          <a href="#creators" className="text-sm text-black/60 hover:text-[#C41E3A] transition-colors">クリエイター</a>
          <a href="#company" className="text-sm text-black/60 hover:text-[#C41E3A] transition-colors">会社概要</a>
        </nav>
        <button className="font-gothic text-sm tracking-widest border border-black/20 px-4 py-2 hover:bg-[#C41E3A] hover:text-white hover:border-[#C41E3A] transition-all">
          [MENU]
        </button>
      </header>

      {/* ===== Section 1: INTRO - 感性AI×共感エンジニアリング ===== */}
      <section id="intro" className="relative min-h-screen overflow-hidden">
        {/* Sky Gradient + Red Sun */}
        <div className="absolute inset-0 sky-gradient" />
        <div className="absolute left-1/2 -translate-x-1/2 sun-pulse" style={{ top: "-15%", width: "min(90vw, 700px)", height: "min(90vw, 700px)" }}>
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#C41E3A] via-[#8B0000] to-[#4A0000] opacity-90" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-[#1A1A1A] via-[#2A2A2A]/80 to-transparent" />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20">
          <div className={`mb-4 transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
            <p className="font-gothic text-[#37B5BD] text-xs md:text-sm tracking-[0.4em] drop-shadow-lg">
              EMOTIONAL AI × EMPATHY ENGINEERING
            </p>
          </div>

          {/* Adjusted Hero Typography - Smaller */}
          <h1 className={`transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <span className="font-gothic text-white text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight">感性AI</span>
            <span className="font-gothic text-[#37B5BD] text-3xl md:text-5xl lg:text-6xl mx-2">×</span>
            <span className="font-gothic text-white text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight">共感</span>
            <br />
            <span className="font-gothic text-[#C41E3A] text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight">ENGINEERING</span>
          </h1>

          {/* VAZ AHEAD - Larger */}
          <div className={`mt-10 max-w-2xl transition-all duration-1000 delay-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
            <p className="text-white text-2xl md:text-3xl font-bold mb-3">VAZ AHEAD！</p>
            <p className="text-white/90 text-xl md:text-2xl mb-6">～Z世代の熱を事業に変える～</p>
            <p className="text-white/80 text-base md:text-lg leading-relaxed">
              <span className="text-[#37B5BD] font-bold">数字のその先にある、心を科学する。</span>
              <br />
              <br />
              私たちは「共感」を解読し、クリエイターとファンの間に深いレゾナンスを生み出します。
            </p>
          </div>

          {/* CTA Button - Links to #engine */}
          <div className={`mt-12 transition-all duration-1000 delay-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
            <a href="#engine" className="dream-pill group inline-flex">
              <span className="relative z-10 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-white/90 group-hover:animate-ping" />
                ENTER THE RESONANCE
              </span>
            </a>
          </div>

          <div className="absolute bottom-8 left-6"><span className="text-white/50 text-sm font-mono">1.00</span></div>
        </div>
      </section>

      {/* ===== Section 2: ナラティブ・レゾナンス・エンジン ===== */}
      <section id="engine" ref={engineRef} className="relative py-32 px-6 overflow-hidden">
        {/* Unified Sky Gradient Background */}
        <div className="absolute inset-0 sky-gradient opacity-90" />
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop"
            alt="Future Tokyo"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#37B5BD]/50 via-transparent to-[#1A1A1A]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-center text-white text-xs tracking-[0.5em] mb-4 font-gothic drop-shadow-lg">NARRATIVE RESONANCE ENGINE</p>
          <h2 className="text-center font-gothic-condensed text-4xl md:text-6xl text-white mb-4 drop-shadow-lg">
            物語共鳴機関
          </h2>
          <p className="text-center text-white/90 text-lg mb-16 max-w-2xl mx-auto drop-shadow">
            Z世代の<span className="text-[#C41E3A] font-bold">感性（Vibe）</span>と
            <span className="text-[#1A1A1A] font-bold bg-white/80 px-2 rounded">物語構造（Arc）</span>をデコードする
          </p>

          {/* Scroll-animated Graph */}
          <div className="relative h-80 mb-16 bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 p-8">
              <div className="h-full relative">
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="border border-black/5" />
                  ))}
                </div>
                
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C41E3A" />
                      <stop offset="50%" stopColor="#37B5BD" />
                      <stop offset="100%" stopColor="#6B21A8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 70 Q 15 80, 25 60 T 50 85 Q 65 40, 75 30 T 100 20"
                    fill="none"
                    stroke="url(#arcGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="200"
                    strokeDashoffset={200 - (scrollProgress * 200)}
                    style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
                  />
                  {scrollProgress > 0.2 && <circle cx="25" cy="60" r="4" fill="#C41E3A" className="animate-pulse" />}
                  {scrollProgress > 0.5 && <circle cx="50" cy="85" r="4" fill="#37B5BD" className="animate-pulse" />}
                  {scrollProgress > 0.7 && <circle cx="75" cy="30" r="4" fill="#6B21A8" className="animate-pulse" />}
                </svg>

                <div className="absolute bottom-2 left-2 text-black/40 text-xs font-bold">開始</div>
                <div className="absolute bottom-2 right-2 text-black/40 text-xs font-bold">終了</div>
                <div className="absolute top-2 left-2 text-black/40 text-xs font-bold">感情↑</div>
                
                {scrollProgress > 0.2 && (
                  <div className="absolute text-[#C41E3A] text-xs font-bold bg-white px-2 py-1 rounded shadow" style={{ left: "25%", top: "50%", transform: "translateX(-50%)" }}>導入</div>
                )}
                {scrollProgress > 0.5 && (
                  <div className="absolute text-[#37B5BD] text-xs font-bold bg-white px-2 py-1 rounded shadow" style={{ left: "50%", top: "85%", transform: "translateX(-50%)" }}>谷（危機）</div>
                )}
                {scrollProgress > 0.7 && (
                  <div className="absolute text-[#6B21A8] text-xs font-bold bg-white px-2 py-1 rounded shadow" style={{ left: "75%", top: "15%", transform: "translateX(-50%)" }}>クライマックス</div>
                )}
              </div>
            </div>
          </div>

          {/* Emotional Arc Cards */}
          <h3 className="text-center text-white text-xl font-bold mb-8 drop-shadow">感情アークの基本形</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emotionalArcs.map((arc) => (
              <div key={arc.name} className="p-6 bg-white/90 backdrop-blur-md rounded-xl border border-white/50 hover:scale-105 transition-all group shadow-lg">
                <div className="h-16 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d={arc.path} fill="none" stroke={arc.color} strokeWidth="3" />
                  </svg>
                </div>
                <p className="text-xs text-black/50">{arc.nameEn}</p>
                <h4 className="font-bold text-[#1A1A1A]" style={{ color: arc.color }}>{arc.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 3: Vibe Graph（バイブス・グラフ）===== */}
      <section id="vibe" className="relative py-32 px-6 overflow-hidden">
        {/* Unified Sky Gradient */}
        <div className="absolute inset-0 sky-gradient opacity-80" />
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop"
            alt="Neural Network"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-[#37B5BD]/30" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-center text-[#1A1A1A] text-xs tracking-[0.5em] mb-4 font-gothic bg-white/80 inline-block px-4 py-2 rounded-full mx-auto">VIBE GRAPH</p>
          <h2 className="text-center font-gothic-condensed text-4xl md:text-6xl text-white mb-4 drop-shadow-lg">
            バイブス・グラフ
          </h2>
          <p className="text-center text-white/90 mb-16 max-w-2xl mx-auto drop-shadow">
            Z世代の感性を構成する「成分」を解析。ドリームピルの処方箋のように、コンテンツの感情価値を可視化します。
          </p>

          {/* Dream Pill Ingredient Panel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-white/50 p-8 md:p-12 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-8 rounded-full bg-gradient-to-r from-[#C41E3A] to-[#37B5BD] shadow-lg" />
                <div>
                  <p className="text-[#1A1A1A] font-bold text-lg">VIBE PRESCRIPTION</p>
                  <p className="text-black/50 text-sm">感情成分表</p>
                </div>
              </div>

              <div className="space-y-6">
                {vibeLabels.map((vibe, index) => (
                  <div
                    key={vibe.name}
                    className="group cursor-pointer"
                    onMouseEnter={() => setActiveVibe(index)}
                    onMouseLeave={() => setActiveVibe(null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[#1A1A1A] font-bold text-lg">{vibe.name}</span>
                        <span className="text-black/40 text-sm">{vibe.nameEn}</span>
                      </div>
                      <span className="font-mono text-2xl font-bold" style={{ color: vibe.color }}>{vibe.value}%</span>
                    </div>
                    
                    <div className="h-3 bg-black/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: mounted ? `${vibe.value}%` : "0%",
                          backgroundColor: vibe.color,
                          transitionDelay: `${index * 100}ms`,
                        }}
                      />
                    </div>

                    <div className={`mt-2 overflow-hidden transition-all duration-300 ${activeVibe === index ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}>
                      <p className="text-black/60 text-sm">{vibe.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-black/10 flex items-center justify-between">
                <p className="text-black/40 text-xs">VIBE GRAPH™ by VAZ</p>
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#C41E3A]" />
                  <div className="w-4 h-4 rounded-full bg-[#37B5BD]" />
                  <div className="w-4 h-4 rounded-full bg-[#6B21A8]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 4: Solutions ===== */}
      <section id="solutions" className="relative py-32 px-6 overflow-hidden">
        {/* Unified Sky Gradient */}
        <div className="absolute inset-0 sky-gradient" />
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop"
            alt="Technology"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#37B5BD]/40 to-[#F5F5F0]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-center text-[#C41E3A] text-xs tracking-[0.5em] mb-4 font-gothic bg-white/80 inline-block px-4 py-2 rounded-full">SOLUTIONS</p>
          <h2 className="text-center font-gothic-condensed text-4xl md:text-6xl text-[#1A1A1A] mb-16 drop-shadow">
            感性AIソリューション
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {solutions.map((solution) => (
              <div
                key={solution.id}
                className="group relative bg-white rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-xl"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={solution.image}
                    alt={solution.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${solution.color}CC, transparent)` }} />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-white/80 font-mono text-sm">{solution.id}</span>
                    <h3 className="font-gothic text-xl text-white">{solution.name}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-black/50 text-sm mb-4">{solution.nameJa}</p>
                  <p className="text-black/70 text-sm leading-relaxed mb-4">{solution.description}</p>
                  <div className="space-y-2">
                    {solution.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: solution.color }} />
                        <span className="text-black/60 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: solution.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Creators Section ===== */}
      <section id="creators" className="relative py-32 px-6 overflow-hidden">
        {/* Unified Sky Gradient */}
        <div className="absolute inset-0 sky-gradient" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-center font-gothic-condensed text-4xl md:text-6xl text-white mb-4 drop-shadow-lg">CREATORS</h2>
          <p className="text-center text-white/80 mb-16">VAZ所属クリエイター</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {creators.map((creator) => (
              <div key={creator.name} className="group bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105">
                {/* Photo */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={creator.image}
                    alt={creator.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-bold text-sm truncate">{creator.name}</p>
                    <p className="text-white/70 text-xs">{creator.handle}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-[#C41E3A] text-sm font-bold mb-3">{creator.followers}</p>
                  
                  {/* SNS Links */}
                  <div className="flex gap-3">
                    <a href={creator.sns.youtube} target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-[#FF0000] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                    <a href={creator.sns.twitter} target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-[#1DA1F2] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href={creator.sns.instagram} target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-[#E4405F] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="https://vaz.co.jp/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] font-bold px-8 py-4 rounded-full hover:bg-[#C41E3A] hover:text-white transition-all shadow-lg">
              すべてのクリエイターを見る →
            </a>
          </div>
        </div>
      </section>

      {/* ===== Company Section ===== */}
      <section id="company" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-center font-gothic-condensed text-4xl md:text-6xl text-[#1A1A1A] mb-16">COMPANY</h2>

          <div className="space-y-6">
            {[
              { label: "会社名", value: "株式会社VAZ" },
              { label: "所在地", value: "〒104-0061 東京都中央区銀座4-2-15 塚本素山ビル2F" },
              { label: "代表取締役社長", value: "谷 鉄也" },
              { label: "取締役", value: "小島 光貴 / 信澤 勝之 / 石栗 正崇 / 印銀 勝（エグゼクティブ・ディレクター） / 小寺 達也" },
              { label: "監査役", value: "西井 雅人" },
              { label: "設立", value: "2015年7月22日" },
              { label: "資本金", value: "1,278,316,080円（資本剰余金含む）" },
              { label: "主要株主", value: "共同ピーアール株式会社 / 谷 鉄也 / CA Startups Internet Fund 2号投資事業有限責任組合 / 株式会社アドウェイズ / 株式会社ホリプロ・グループ・ホールディングス / 株式会社フリークアウト・ホールディングス" },
              { label: "事業内容", value: "ソーシャルメディアマーケティング事業 / プロダクションコンテンツ事業 / メディアプラットフォーム事業 / 女性マーケティング特化チーム「PicQ」 / 感性AI事業" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col md:flex-row border-b border-black/10 pb-6">
                <div className="md:w-1/4 text-black/50 text-sm mb-2 md:mb-0 font-bold">{item.label}</div>
                <div className="md:w-3/4 text-[#1A1A1A] text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Contact ===== */}
      <section id="contact" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 sky-gradient opacity-90" />
        <div className="absolute inset-0 bg-[#1A1A1A]/70" />

        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-center font-gothic-condensed text-4xl md:text-6xl text-white mb-16">CONTACT</h2>

          <form className="space-y-6">
            <div>
              <label className="block text-white/70 text-sm mb-2">会社名</label>
              <input type="text" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:border-[#37B5BD] focus:outline-none transition-colors" placeholder="株式会社〇〇" />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">お名前</label>
              <input type="text" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:border-[#37B5BD] focus:outline-none transition-colors" placeholder="山田 太郎" />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">メールアドレス</label>
              <input type="email" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:border-[#37B5BD] focus:outline-none transition-colors" placeholder="example@company.com" />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">お問い合わせ内容</label>
              <textarea rows={5} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:border-[#37B5BD] focus:outline-none transition-colors resize-none" placeholder="お問い合わせ内容" />
            </div>
            <button type="submit" className="w-full py-4 bg-[#C41E3A] text-white font-bold rounded-lg hover:bg-[#A01830] transition-colors">
              送信する
            </button>
          </form>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-12 px-6 bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-gothic text-xl tracking-widest text-white">VAZ</div>
          <div className="flex items-center gap-6 text-sm font-bold">
            <a href="https://www.instagram.com/vaz_official/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">Instagram</a>
            <a href="https://twitter.com/vaz_inc" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">X</a>
            <a href="https://www.youtube.com/@VAZ_official" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">YouTube</a>
            <a href="https://www.tiktok.com/@vaz_official" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">TikTok</a>
          </div>
          <p className="text-white/40 text-xs">©VAZ Inc. ALL RIGHT RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
