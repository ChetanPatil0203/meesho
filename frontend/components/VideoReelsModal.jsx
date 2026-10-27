import { useState, useRef, useEffect } from 'react';

export const REELS_DATA = [
  {
    id: 'reel-1',
    creator: '@divya_ethnic',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
    title: 'Banarasi Soft Silk Saree - Wedding special look under ₹400! ✨',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-traditional-costume-posing-41712-large.mp4',
    poster: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&fit=crop&auto=format',
    likes: 1420,
    product: {
      id: 'prod-saree',
      name: 'Banarasi Soft Silk Rich Pallu Saree',
      price: 389,
      mrp: 1499,
      discount: 74,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop&auto=format',
    },
  },
  {
    id: 'reel-2',
    creator: '@tech_guy_rahul',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    title: 'Best Bluetooth Calling Smartwatch with 1.85" HD Display ⚡',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-operating-a-smartwatch-41484-large.mp4',
    poster: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&fit=crop&auto=format',
    likes: 2890,
    product: {
      id: 'prod-watch',
      name: 'Noise ColorFit Pulse 2 Max 1.85" Calling Smartwatch',
      price: 899,
      mrp: 2999,
      discount: 70,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&auto=format',
    },
  },
  {
    id: 'reel-3',
    creator: '@sneha_dailylooks',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&auto=format',
    title: 'Pure Cotton Printed Kurti - Super comfy college & office wear! 🌸',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-a-scarf-smiling-at-the-camera-41870-large.mp4',
    poster: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&fit=crop&auto=format',
    likes: 954,
    product: {
      id: 'prod-kurti',
      name: 'Women Pure Cotton Straight Kurti with Pant',
      price: 299,
      mrp: 999,
      discount: 70,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&h=300&fit=crop&auto=format',
    },
  },
  {
    id: 'reel-4',
    creator: '@meera_jewels',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&auto=format',
    title: 'Royal 24K Gold Plated Choker & Earrings Unboxing & Try-On! 💎',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-traditional-costume-posing-41712-large.mp4',
    poster: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&fit=crop&auto=format',
    likes: 3120,
    product: {
      id: 'prod-choker',
      name: 'Royal 24K Gold Plated Choker & Earrings Set',
      price: 249,
      mrp: 1299,
      discount: 80,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop&auto=format',
    },
  },
  {
    id: 'reel-5',
    creator: '@urban_men_fits',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format',
    title: 'Casual Streetwear fit under ₹800! Denim Jacket + Sneakers 🔥',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-operating-a-smartwatch-41484-large.mp4',
    poster: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&fit=crop&auto=format',
    likes: 1840,
    product: {
      id: 'prod-jacket',
      name: 'Men Classic Casual Denim Jacket',
      price: 499,
      mrp: 1499,
      discount: 66,
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=300&fit=crop&auto=format',
    },
  },
  {
    id: 'reel-6',
    creator: '@home_makeover_diy',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format',
    title: 'Transform your bedroom under ₹400 with 100% Cotton Bed Sheet ✨',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-a-scarf-smiling-at-the-camera-41870-large.mp4',
    poster: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&fit=crop&auto=format',
    likes: 2490,
    product: {
      id: 'prod-bedsheet',
      name: 'Pure Cotton Double Bed Sheet 220TC',
      price: 349,
      mrp: 999,
      discount: 65,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=300&fit=crop&auto=format',
    },
  },
];

export default function VideoReelsModal({
  isOpen,
  initialReelIndex = 0,
  onClose,
  onAddToCart,
  onBuyNow,
  onShowToast,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialReelIndex);
  const [liked, setLiked] = useState({});
  const [isMuted, setIsMuted] = useState(true);
  const [heartAnim, setHeartAnim] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(initialReelIndex);
  }, [initialReelIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex, isOpen]);

  if (!isOpen) return null;

  const currentReel = REELS_DATA[currentIndex];
  const isCurrentLiked = liked[currentReel.id];

  const handleLike = () => {
    setLiked((prev) => ({ ...prev, [currentReel.id]: !prev[currentReel.id] }));
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 500);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REELS_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REELS_DATA.length) % REELS_DATA.length);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[380px] h-[90vh] max-h-[720px] bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="absolute top-0 inset-x-0 p-4 z-20 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
            <span className="text-white text-xs font-black tracking-wide uppercase">
              Shopio Live Reel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-sm backdrop-blur-xs"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center font-bold text-sm backdrop-blur-xs hover:bg-black/60"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Video Element */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src={currentReel.videoUrl}
            poster={currentReel.poster}
            muted={isMuted}
            loop
            playsInline
            autoPlay
            className="w-full h-full object-cover cursor-pointer"
            onClick={handleLike}
          />

          {/* Floating Heart Pop Animation */}
          {heartAnim && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <span className="text-7xl animate-heart-pop filter drop-shadow-lg">❤️</span>
            </div>
          )}
        </div>

        {/* Right Action Sidebar (Like, Share, Navigation) */}
        <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-4 text-white">
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 group transition-transform active:scale-90"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                isCurrentLiked ? 'bg-red-500 text-white' : 'bg-black/40 text-white'
              }`}
            >
              <svg width="22" height="22" fill={isCurrentLiked ? 'white' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold">
              {currentReel.likes + (isCurrentLiked ? 1 : 0)}
            </span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: currentReel.title, url: window.location.href });
              } else {
                onShowToast?.('Reel link copied to share! 🚀');
              }
            }}
            className="flex flex-col items-center gap-1 group active:scale-90"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-lg">
              💬
            </div>
            <span className="text-[11px] font-bold">Share</span>
          </button>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-xl text-white font-bold transition-transform active:scale-90"
          >
            ↓
          </button>
        </div>

        {/* Bottom Overlay: Creator Info & Product Card */}
        <div className="absolute bottom-0 inset-x-0 p-4 z-20 bg-gradient-to-t from-black via-black/80 to-transparent space-y-3">
          {/* Creator & Title */}
          <div className="text-white">
            <div className="flex items-center gap-2 mb-1">
              <img
                src={currentReel.creatorAvatar}
                alt={currentReel.creator}
                className="w-7 h-7 rounded-full object-cover border border-white/60"
              />
              <span className="text-xs font-black">{currentReel.creator}</span>
              <span className="text-[10px] bg-[#9F2089] px-2 py-0.5 rounded-full font-bold">
                Follow
              </span>
            </div>
            <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">
              {currentReel.title}
            </p>
          </div>

          {/* Sticky In-Video Product Buy Card */}
          <div className="bg-white/95 dark:bg-[#161F30]/95 backdrop-blur-md rounded-2xl p-2.5 flex items-center gap-2.5 border border-pink-200/50 shadow-xl">
            <img
              src={currentReel.product.image}
              alt={currentReel.product.name}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {currentReel.product.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-black text-[#9F2089] dark:text-[#F43397]">
                  ₹{currentReel.product.price}
                </span>
                <span className="text-[10px] text-gray-400 line-through">
                  ₹{currentReel.product.mrp}
                </span>
                <span className="text-[9px] font-bold text-green-700 bg-green-50 px-1 rounded">
                  {currentReel.product.discount}% OFF
                </span>
              </div>
            </div>

            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => {
                  onAddToCart?.(currentReel.product);
                  onShowToast?.(`Added ${currentReel.product.name} to Cart! 🛒`);
                }}
                className="p-2 bg-pink-100 hover:bg-pink-200 text-[#9F2089] rounded-xl transition-colors text-xs font-bold"
                title="Add to Cart"
              >
                🛒
              </button>
              <button
                onClick={() => {
                  onClose();
                  onBuyNow?.(currentReel.product);
                }}
                className="px-3 py-2 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white rounded-xl text-xs font-extrabold shadow-md hover:opacity-95 active:scale-95 transition-all"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
