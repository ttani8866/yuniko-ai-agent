'use client';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-gray-900">
                テキスト生成 AI
              </h1>
              <p className="text-xs text-gray-500">Marketplace</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              Powered by Gemini
            </span>
            <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">G</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

