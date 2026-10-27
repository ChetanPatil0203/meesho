import { useState, useEffect } from 'react';

export default function FloatingWidgets({
  onOpenAiChat,
  onOpenSpinWheel,
  onShowToast,
  isLoggedIn = false,
}) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent('Hello Shopio Team! I need help with shopping and deals.');
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  // If user is not logged in and not scrolled, render nothing
  if (!isLoggedIn && !showScrollTop) {
    return null;
  }

  return (
    <aside aria-label="Quick Actions" className="fixed bottom-20 md:bottom-6 right-4 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* ── Back to Top Button ── */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="pointer-events-auto w-10 h-10 rounded-full bg-white dark:bg-[#1E293B] shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-[#9F2089] hover:text-white transition-all transform hover:-translate-y-1 active:scale-90 text-sm font-black animate-fade-in"
          title="Back to Top"
        >
          ↑
        </button>
      )}

      {/* ── AI Chat Box & Spin Wheel: Only shown after user logs in ── */}
      {isLoggedIn && (
        <>
          {/* ── Shopio AI Chat Box Launcher Button ── */}
          <button
            onClick={onOpenAiChat}
            aria-label="Shopio AI Assistant"
            className="pointer-events-auto relative group flex items-center gap-2.5 bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#D81B80] text-white p-2.5 sm:px-3.5 sm:py-2.5 rounded-full shadow-2xl hover:opacity-95 transition-all transform hover:scale-105 active:scale-95 animate-glow cursor-pointer"
            title="Shopio AI Chat Box"
          >
            <span className="absolute -inset-1 rounded-full bg-[#8B5CF6]/35 animate-ping pointer-events-none" />
            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-base shadow-inner">
              🤖
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
              <span className="text-[9px] uppercase font-black text-pink-200 tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI Assistant
              </span>
              <span className="text-xs font-black">
                AI Chat Box
              </span>
            </div>
          </button>

          {/* ── Spin & Win Floating Interactive Gift Launcher (Spine) ── */}
          <button
            onClick={onOpenSpinWheel}
            aria-label="Spin and Win Mega Discounts"
            className="pointer-events-auto group relative flex items-center gap-2.5 bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#FF8A00] text-white p-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:opacity-95 transition-all transform hover:scale-108 active:scale-95 animate-glow cursor-pointer"
          >
            <div className="text-2xl animate-wobble">
              🎁
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
              <span className="text-[10px] uppercase font-black text-yellow-300 tracking-wider">
                Daily Reward
              </span>
              <span className="text-xs font-black">
                Spin & Win ₹150 OFF
              </span>
            </div>
            {/* Pulsing indicator dot */}
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping absolute -top-0.5 -right-0.5" />
          </button>
        </>
      )}
    </aside>
  );
}
