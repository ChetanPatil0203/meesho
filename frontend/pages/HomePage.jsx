import { useState, useEffect, useRef } from 'react';
import { products, categories, heroSlides } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import RecentlyViewed from '../components/RecentlyViewed';
import ResellModal from '../components/ResellModal';
import { REELS_DATA } from '../components/VideoReelsModal';

const shopioHeroSlides = [
  {
    id: 1,
    title: 'Shopio Maha Indian Shopping Festival',
    subtitle: 'Lowest Prices of the Year · Up to 80% OFF on 1 Crore+ Products',
    cta: 'Shop Mega Deals',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&h=600&fit=crop&auto=format',
    badge: '🔥 MAHA SALE LIVE',
    bg: 'from-[#6E0E5D]/95 via-[#9F2089]/85 to-transparent',
    category: 'Women',
  },
  {
    id: 2,
    title: 'Ethnic Elegance: Sarees & Kurtis From ₹199',
    subtitle: 'Pure Silk, Chiffon, Rayon & Georgette · Direct from Weavers with Free Delivery',
    cta: 'Explore Ethnic',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&h=600&fit=crop&auto=format',
    badge: '🥻 ETHNIC SPECIAL',
    bg: 'from-[#7A0D5B]/95 via-[#C2185B]/85 to-transparent',
    category: 'Women',
  },
  {
    id: 3,
    title: 'Smart Gadgets & Electronics Flash Sale',
    subtitle: 'TWS Earbuds, Smartwatches, Speakers & Power Banks starting ₹99',
    cta: 'Grab Tech Deals',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&h=600&fit=crop&auto=format',
    badge: '⚡ FLASH SALE',
    bg: 'from-[#1E1B4B]/95 via-[#4338CA]/85 to-transparent',
    category: 'Electronics',
  },
  {
    id: 4,
    title: 'Men & Kids Fashion Carnival',
    subtitle: 'Trendy Cotton Shirts, Denim, Sneakers & Traditional Wear at Wholesale Prices',
    cta: 'Shop Men & Kids',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=600&fit=crop&auto=format',
    badge: '👕 TRENDING NOW',
    bg: 'from-[#064E3B]/95 via-[#047857]/85 to-transparent',
    category: 'Men',
  },
];

const categoryPills = [
  { name: 'Sarees', category: 'Women', icon: '🥻', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150&h=150&fit=crop' },
  { name: 'Kurtis', category: 'Women', icon: '👗', img: 'https://images.unsplash.com/photo-1583391733981-8498401ef4d8?w=150&h=150&fit=crop' },
  { name: 'Men Shirts', category: 'Men', icon: '👔', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&h=150&fit=crop' },
  { name: 'Footwear', category: 'Footwear', icon: '👟', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop' },
  { name: 'Earphones', category: 'Electronics', icon: '🎧', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop' },
  { name: 'Beauty', category: 'Beauty', icon: '💄', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&h=150&fit=crop' },
  { name: 'Jewellery', category: 'Accessories', icon: '💍', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&h=150&fit=crop' },
  { name: 'Home Decor', category: 'Home & Kitchen', icon: '🏠', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop' },
  { name: 'Bags & Wallets', category: 'Accessories', icon: '👜', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=150&h=150&fit=crop' },
];

const trustBadges = [
  { icon: '🚚', title: 'Free Delivery', subtitle: 'On 100% of products' },
  { icon: '💵', title: 'Cash on Delivery', subtitle: 'Pay when you receive' },
  { icon: '🔄', title: '7 Days Easy Returns', subtitle: 'Instant doorstep pickup' },
  { icon: '🏷️', title: 'Lowest Price Guarantee', subtitle: 'Direct from wholesale suppliers' },
];

const testimonials = [
  {
    name: 'Pooja Kadam',
    location: 'Pune, Maharashtra',
    rating: 5,
    text: 'शॉपिओवर कपडे खूप स्वस्त आणि उत्तम दर्जाचे आहेत! मी कुरती मागवली होती, अगदी 2 दिवसात पोहोचली. कॅश ऑन डिलिव्हरीमुळे विश्वास वाढला.',
    avatar: 'PK',
    product: "Women's Rayon Kurti",
  },
  {
    name: 'Anjali Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    text: 'I started reselling sarees on WhatsApp through Shopio. Earned ₹8,500 extra margin last month! Super reliable packaging and fast payouts.',
    avatar: 'AS',
    product: 'Banarasi Silk Saree',
  },
  {
    name: 'Gaurav Patil',
    location: 'Nagpur',
    rating: 5,
    text: 'boAt headphones are 100% genuine and 40% cheaper than other shopping apps. Return process is also very smooth.',
    avatar: 'GP',
    product: 'boAt Rockerz Headphones',
  },
];

export default function HomePage({
  onNavigate,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onOpenSpinWheel,
  onOpenReel,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdown, setCountdown] = useState({ h: 6, m: 24, s: 45 });
  const [activeTab, setActiveTab] = useState('trending');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [resellProduct, setResellProduct] = useState(null);
  const timerRef = useRef(null);

  // Auto carousel slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % shopioHeroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Flash Sale Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) return { h: 5, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  // Filtered collections
  const flashSaleProducts = products.filter((p) => p.discount >= 50).slice(0, 4);
  const trendingProducts = products.slice(0, 8);
  const bestSellers = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  const under299 = products.filter((p) => p.price <= 599).slice(0, 8);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const displayedProducts =
    activeTab === 'trending'
      ? trendingProducts
      : activeTab === 'bestsellers'
      ? bestSellers
      : activeTab === 'under299'
      ? under299
      : topRated;

  return (
    <div className="min-h-screen pb-12">
      {/* ── Hero Carousel ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '270px', height: 'clamp(270px, 45vw, 480px)' }}>
        {shopioHeroSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover object-center" />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full">
                <div className="max-w-xl text-white">
                  <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-[10px] sm:text-xs font-black px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full mb-2 sm:mb-3 shadow-md">
                    {slide.badge}
                  </span>
                  <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-2 sm:mb-3 drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="text-[11px] sm:text-sm md:text-base text-pink-100 mb-3 sm:mb-6 leading-relaxed max-w-lg font-medium drop-shadow-xs line-clamp-2 sm:line-clamp-none">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => onNavigate('listing', { category: slide.category })}
                      className="bg-white text-[#9F2089] font-extrabold px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-pink-50 transition-all shadow-xl hover:shadow-2xl active:scale-95 text-xs sm:text-sm flex items-center gap-1.5"
                    >
                      <span>{slide.cta}</span>
                      <span>→</span>
                    </button>
                    <button
                      onClick={() => onNavigate('listing')}
                      className="bg-black/30 backdrop-blur-md text-white font-bold px-3.5 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-white/30 hover:bg-white/20 transition-all text-xs sm:text-sm"
                    >
                      View All 1 Cr+ Items
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel controls */}
        <button
          onClick={() => setCurrentSlide((s) => (s - 1 + shopioHeroSlides.length) % shopioHeroSlides.length)}
          className="absolute left-2 sm:left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white/20 backdrop-blur-md hover:bg-white/50 rounded-full flex items-center justify-center text-white text-base sm:text-xl font-bold transition-all border border-white/30"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentSlide((s) => (s + 1) % shopioHeroSlides.length)}
          className="absolute right-2 sm:right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white/20 backdrop-blur-md hover:bg-white/50 rounded-full flex items-center justify-center text-white text-base sm:text-xl font-bold transition-all border border-white/30"
        >
          ›
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
          {shopioHeroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'bg-white w-6 sm:w-8' : 'bg-white/40 w-2 sm:w-2.5'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Shopio Trust Strip ── */}
      <div className="bg-white dark:bg-[#161F30] border-b border-gray-100 dark:border-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
            {trustBadges.map((b) => (
              <div key={b.title} className="flex items-center gap-2 sm:gap-3 py-3 px-2 sm:px-3">
                <span className="text-xl sm:text-2xl p-1.5 sm:p-2 bg-pink-50 dark:bg-gray-800 rounded-xl">{b.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-snug">{b.title}</p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{b.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
        {/* ── Circular Story / Category Bubbles ── */}
        <section className="py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-sm sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
                <span>✨ Top Categories</span>
                <span className="text-[10px] sm:text-xs font-semibold text-[#F43397] bg-pink-50 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  Wholesale
                </span>
              </h2>
            </div>
            <button
              onClick={() => onNavigate('listing')}
              className="text-xs font-bold text-[#9F2089] dark:text-[#F43397] hover:underline flex items-center gap-1"
            >
              See All <span>→</span>
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto scrollbar-hide py-1 sm:py-2">
            {categoryPills.map((pill) => (
              <button
                key={pill.name}
                onClick={() => onNavigate('listing', { category: pill.category })}
                className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
              >
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#9F2089] to-[#F43397] shadow-xs group-hover:scale-108 transition-all duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white dark:border-gray-900">
                    <img src={pill.img} alt={pill.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-gray-800 dark:text-gray-200 mt-1.5 group-hover:text-[#9F2089] transition-colors text-center line-clamp-1">
                  {pill.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Flash Deals Ticker Banner ── */}
        <section className="my-5 sm:my-6 bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#FF8A00] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl sm:text-2xl animate-bounce">⚡</span>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight">Flash Sale Ends In</h2>
              </div>
              <p className="text-[11px] sm:text-xs text-pink-100 font-medium">Extra discounts on bestselling styles for the next few hours!</p>
            </div>

            {/* Countdown Clock */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <div className="flex items-center gap-1">
                <div className="w-9 sm:w-11 h-10 sm:h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-black text-base sm:text-xl border border-white/30">
                  {pad(countdown.h)}
                </div>
                <span className="text-base sm:text-xl font-bold">:</span>
                <div className="w-9 sm:w-11 h-10 sm:h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-black text-base sm:text-xl border border-white/30">
                  {pad(countdown.m)}
                </div>
                <span className="text-base sm:text-xl font-bold">:</span>
                <div className="w-9 sm:w-11 h-10 sm:h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-black text-base sm:text-xl border border-white/30">
                  {pad(countdown.s)}
                </div>
              </div>
              <button
                onClick={() => onNavigate('listing', { badge: '60% OFF' })}
                className="px-4 sm:px-5 py-2 sm:py-3 bg-white text-gray-900 font-extrabold text-xs sm:text-sm rounded-xl hover:bg-pink-50 transition-colors shadow-lg active:scale-95 whitespace-nowrap"
              >
                Grab Flash Deals
              </button>
            </div>
          </div>

          {/* Flash items preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6">
            {flashSaleProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => onNavigate('product', { productId: p.id })}
                className="bg-white/95 dark:bg-[#161F30]/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 text-gray-800 dark:text-gray-100 flex gap-2 sm:gap-3 cursor-pointer hover:scale-102 transition-transform shadow-md"
              >
                <img src={p.image} alt="" className="w-12 sm:w-14 h-16 sm:h-18 object-cover rounded-lg sm:rounded-xl flex-shrink-0" />
                <div className="min-w-0 flex flex-col justify-center">
                  <span className="text-[9px] sm:text-[10px] font-black text-red-600 bg-red-50 dark:bg-gray-800 px-1 py-0.5 rounded w-fit">
                    -{p.discount}% OFF
                  </span>
                  <p className="text-xs font-bold line-clamp-1 mt-0.5 sm:mt-1">{p.name}</p>
                  <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mt-0.5">
                    ₹{p.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Shop The Look: Short Video Reels ── */}
        <section className="my-6 sm:my-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-sm sm:text-xl font-black text-gray-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
                <span>🎬 Shop The Look</span>
                <span className="text-[10px] sm:text-xs font-bold text-white bg-gradient-to-r from-red-600 to-pink-600 px-2 sm:px-2.5 py-0.5 rounded-full animate-pulse">
                  LIVE REELS
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Watch real customer reviews & fashion drape trials. Click to buy instantly!
              </p>
            </div>
            <button
              onClick={() => onOpenReel?.(0)}
              className="text-xs font-bold text-[#9F2089] dark:text-[#F43397] hover:underline hidden sm:flex items-center gap-1"
            >
              Watch All Reels <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {REELS_DATA.map((reel, idx) => (
              <div
                key={reel.id}
                onClick={() => onOpenReel?.(idx)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg cursor-pointer bg-black aspect-[9/13] sm:aspect-[9/14] transform hover:-translate-y-2 transition-all duration-300 shine-effect"
              >
                <img
                  src={reel.poster}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40 group-hover:via-black/10 transition-colors" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                    Reel
                  </span>
                  <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    ❤️ {reel.likes}
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/30 backdrop-blur-md group-hover:bg-[#9F2089] text-white flex items-center justify-center transition-all group-hover:scale-115 shadow-xl border border-white/50">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="ml-0.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-3.5 z-10 space-y-2">
                  <p className="text-white text-xs font-bold line-clamp-1 group-hover:text-pink-200 transition-colors">
                    {reel.title}
                  </p>
                  <div className="bg-white/95 dark:bg-[#161F30]/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex items-center justify-between shadow-lg">
                    <div className="min-w-0 pr-1">
                      <p className="text-[11px] font-bold text-gray-800 dark:text-gray-100 truncate">
                        {reel.product.name}
                      </p>
                      <p className="text-xs font-black text-[#9F2089] dark:text-[#F43397]">
                        ₹{reel.product.price}{' '}
                        <span className="text-[10px] text-gray-400 line-through font-normal">
                          ₹{reel.product.mrp}
                        </span>
                      </p>
                    </div>
                    <span className="text-[10px] font-black bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white px-2.5 py-1 rounded-lg sm:rounded-xl whitespace-nowrap shadow-xs">
                      Shop Look
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Spin & Win Lucky Wheel Banner ── */}
        <section className="my-5 sm:my-6 bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#FF8A00] rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-white shadow-xl relative overflow-hidden shine-effect">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl sm:text-4xl shadow-inner animate-wobble flex-shrink-0">
                🎡
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                  <span>🎁</span> Free Daily Spin
                </div>
                <h3 className="text-lg sm:text-2xl font-black">
                  Shopio Lucky Wheel: Extra ₹150 OFF!
                </h3>
                <p className="text-[11px] sm:text-sm text-pink-100 mt-0.5">
                  Win instant discount coupons, 100 free coins, or free express delivery!
                </p>
              </div>
            </div>

            <button
              onClick={onOpenSpinWheel}
              className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-white text-[#9F2089] hover:bg-yellow-300 hover:text-gray-900 font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 animate-glow flex-shrink-0"
            >
              <span>🎁</span> SPIN WHEEL NOW
            </button>
          </div>
        </section>

        {/* ── Resell & Earn Cash Margin Card (Shopio Signature) ── */}
        <section className="my-5 sm:my-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-pink-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="bg-pink-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Earn from Home with Zero Investment
            </span>
            <h2 className="text-lg sm:text-3xl font-black mt-2 leading-tight">
              Start Your Online Business with Shopio Reselling!
            </h2>
            <p className="text-[11px] sm:text-sm text-pink-100 mt-1.5 sm:mt-2 leading-relaxed">
              1. Choose product · 2. Add profit margin (e.g. ₹150) · 3. Share with friends on WhatsApp. Shopio
              ships directly to customer with Cash on Delivery and credits your bank!
            </p>
            <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-5 flex-wrap">
              <button
                onClick={() => onNavigate('resell')}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#F43397] to-[#9F2089] text-white font-extrabold text-xs sm:text-sm rounded-xl hover:opacity-95 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>💼</span> Open Reseller Hub
              </button>
              <button
                onClick={() => onNavigate('resell')}
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm rounded-xl transition-all text-center justify-center"
              >
                Browse Catalog
              </button>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-20 text-[180px] pointer-events-none">
            💼
          </div>
        </section>

        {/* ── Main Tabbed Products Section ── */}
        <section className="my-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                Products For You
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Curated wholesale products with direct supplier warranties
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'trending', label: '🔥 Trending', icon: '' },
                { id: 'bestsellers', label: '⭐ Best Sellers', icon: '' },
                { id: 'under299', label: '💰 Budget Deals', icon: '' },
                { id: 'toprated', label: '🏆 Top Rated', icon: '' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#9F2089]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                isWishlisted={wishlist.includes(p.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('listing')}
              className="px-8 py-3.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-bold rounded-2xl hover:opacity-95 shadow-md hover:shadow-lg active:scale-95 transition-all text-sm inline-flex items-center gap-2"
            >
              <span>Explore More 10,000+ Products</span>
              <span>→</span>
            </button>
          </div>
        </section>

        {/* ── Testimonials & Verified Reviews ── */}
        <section className="my-10 bg-white dark:bg-[#161F30] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#F43397] uppercase tracking-wider">Customer Stories</span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1">
              Loved by 15 Crore+ Indian Shoppers on Shopio
            </h2>
            <p className="text-xs text-gray-400 mt-1">Real feedback from satisfied customers across Maharashtra and India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm mb-3">
                    {'★'.repeat(t.rating)}
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9F2089] to-[#F43397] text-white font-bold text-xs flex items-center justify-center">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t.name}</p>
                      <p className="text-[10px] text-gray-400">{t.location}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    ✓ Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recently Viewed Component ── */}
        <RecentlyViewed onNavigate={onNavigate} onQuickView={(p) => setQuickViewProduct(p)} />
      </div>

      {/* ── Quick View Modal ── */}
      {quickViewProduct && (
        <QuickViewModal
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
          product={quickViewProduct}
          onAddToCart={onAddToCart}
          onNavigate={onNavigate}
        />
      )}

      {/* ── Resell Modal ── */}
      {resellProduct && (
        <ResellModal
          isOpen={Boolean(resellProduct)}
          onClose={() => setResellProduct(null)}
          product={resellProduct}
        />
      )}
    </div>
  );
}