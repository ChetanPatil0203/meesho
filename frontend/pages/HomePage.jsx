import { useState, useEffect, useRef } from 'react';
import { products, categories, heroSlides } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import RecentlyViewed from '../components/RecentlyViewed';










const testimonials = [
  { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'Amazing quality products at great prices! Delivery was super fast. Totally recommend ShopKart for everyone.', avatar: 'PS', bg: 'from-pink-400 to-rose-500' },
  { name: 'Rahul Verma', location: 'Delhi', rating: 5, text: 'Best online shopping experience in India. The return policy is hassle-free and customer support is excellent.', avatar: 'RV', bg: 'from-blue-400 to-indigo-500' },
  { name: 'Anita Patel', location: 'Ahmedabad', rating: 4, text: 'Love the variety of ethnic wear here. Found my favourite kurtis at 60% off. Will definitely shop again!', avatar: 'AP', bg: 'from-purple-400 to-violet-500' },
  { name: 'Suresh Kumar', location: 'Bangalore', rating: 5, text: 'Electronics at unbeatable prices. Got my smartphone delivered in just 1 day. Excellent service!', avatar: 'SK', bg: 'from-emerald-400 to-green-500' }];


const trustBadges = [
  { icon: '🚚', title: 'Free Delivery', subtitle: 'On orders above ₹499' },
  { icon: '🔄', title: 'Easy Returns', subtitle: '7-day return policy' },
  { icon: '🔒', title: '100% Secure', subtitle: 'Safe & encrypted payments' },
  { icon: '🏆', title: 'Top Quality', subtitle: 'Verified sellers only' }];


const dealProducts = products.filter((p) => p.discount >= 55).slice(0, 4);
const trendingProducts = products.slice(0, 6);
const bestSellers = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 6);
const newArrivals = products.filter((p) => p.badge === 'New Launch' || p.badge === 'New' || p.badge === 'Trending').slice(0, 4);
const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);

export default function HomePage({ onNavigate, wishlist, onToggleWishlist, onAddToCart }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdown, setCountdown] = useState({ h: 5, m: 42, s: 17 });
  const [activeTab, setActiveTab] = useState('trending');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((s) => (s + 1) % heroSlides.length), 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 5, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');
  const tabProducts = activeTab === 'trending' ? trendingProducts : activeTab === 'bestsellers' ? bestSellers : topRated;

  return (
    <div className="min-h-screen">
      {/* ── Hero Carousel ── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(220px, 45vw, 480px)' }}>
        {heroSlides.map((slide, i) =>
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ${i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>

            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                <div className="max-w-xl">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-white/30">
                    {slide.tag}
                  </span>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onNavigate('listing', { category: slide.category })}
                      className="bg-white text-[#3B5BDB] font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm md:text-base">

                      {slide.cta} →
                    </button>
                    <button
                      onClick={() => onNavigate('listing')}
                      className="bg-white/20 backdrop-blur-sm text-white font-medium px-5 py-2.5 rounded-xl border border-white/40 hover:bg-white/30 transition-all text-sm">

                      Browse All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <button onClick={() => setCurrentSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white text-lg font-bold transition-all border border-white/30">
          ‹
        </button>
        <button onClick={() => setCurrentSlide((s) => (s + 1) % heroSlides.length)}
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white text-lg font-bold transition-all border border-white/30">
          ›
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) =>
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-white w-7' : 'bg-white/50 w-2'}`} />
          )}
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {trustBadges.map((b) =>
              <div key={b.title} className="flex items-center gap-3 py-3 px-4">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">{b.title}</p>
                  <p className="text-[11px] text-gray-400">{b.subtitle}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">

        {/* ── Category Scroll ── */}
        <section className="py-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Shop by Category</h2>
            <button onClick={() => onNavigate('listing')} className="text-[#3B5BDB] text-sm font-medium hover:underline flex items-center gap-1">
              View All <span>→</span>
            </button>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
            {categories.map((cat) =>
              <button key={cat.name} onClick={() => onNavigate('listing', { category: cat.name })}
                className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-blue-50 border-2 border-transparent group-hover:border-[#3B5BDB] group-hover:scale-105 transition-all duration-200 shadow-sm">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] md:text-xs text-gray-600 group-hover:text-[#3B5BDB] font-medium text-center leading-tight">{cat.name}</span>
              </button>
            )}
          </div>
        </section>

        {/* ── Flash Sale ── */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 rounded-2xl overflow-hidden">
            <div className="px-5 md:px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl animate-bounce">⚡</span>
                    <h2 className="text-white font-extrabold text-xl tracking-tight">Flash Sale</h2>
                  </div>
                  <p className="text-orange-100 text-xs">Hurry up! Offer ends in</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {[pad(countdown.h), pad(countdown.m), pad(countdown.s)].map((val, i) =>
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-black text-xl w-11 h-11 rounded-xl flex items-center justify-center shadow-inner tabular-nums">
                        {val}
                      </div>
                      {i < 2 && <span className="text-white/70 font-bold text-lg">:</span>}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => onNavigate('listing', { discount: 'high' })}
                className="bg-white text-orange-500 font-bold px-5 py-2 rounded-xl hover:bg-orange-50 transition-colors text-sm shadow-lg">
                View All Flash Deals →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 md:px-8 pb-5">
              {dealProducts.map((p) =>
                <div key={p.id} onClick={() => onNavigate('product', { productId: p.id })}
                  className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-lg transition-all duration-200 group active:scale-95">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2 relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                      {p.discount}% OFF
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-bold text-gray-900 text-sm">₹{p.price.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400 line-through">₹{p.mrp.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Tabbed Product Section ── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {[['trending', '🔥 Trending'], ['bestsellers', '⭐ Best Sellers'], ['toprated', '🏅 Top Rated']].map(([key, label]) =>
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === key ? 'bg-white text-[#3B5BDB] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {label}
                </button>
              )}
            </div>
            <button onClick={() => onNavigate('listing')} className="text-[#3B5BDB] text-sm font-medium hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {tabProducts.map((p) =>
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                isWishlisted={wishlist.includes(p.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            )}
          </div>
        </section>

        {/* ── Promo Banners ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { title: 'New Arrivals', subtitle: 'Fresh Styles Just Landed', color: 'from-violet-500 to-purple-700', cat: 'Women', emoji: '👗', accent: 'Shop Collection' },
            { title: 'Electronics Sale', subtitle: 'Gadgets up to 40% OFF', color: 'from-blue-500 to-indigo-700', cat: 'Electronics', emoji: '📱', accent: 'Explore Deals' },
            { title: "Men's Premium", subtitle: 'Quality meets style', color: 'from-emerald-500 to-teal-700', cat: 'Men', emoji: '👔', accent: 'Shop Now' }].
            map((b) =>
              <button key={b.title} onClick={() => onNavigate('listing', { category: b.cat })}
                className={`bg-gradient-to-br ${b.color} rounded-2xl p-6 text-white text-left hover:shadow-xl transition-all duration-200 group relative overflow-hidden active:scale-[0.98]`}>
                <div className="absolute -right-4 -bottom-4 text-7xl opacity-20 group-hover:opacity-30 transition-opacity">{b.emoji}</div>
                <div className="text-4xl mb-3">{b.emoji}</div>
                <h3 className="font-bold text-xl">{b.title}</h3>
                <p className="text-sm text-white/75 mt-1">{b.subtitle}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                  {b.accent} →
                </div>
              </button>
            )}
        </section>

        {/* ── New Arrivals Strip ── */}
        {newArrivals.length > 0 &&
          <section className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#3B5BDB] rounded-full" />
                <h2 className="text-lg md:text-xl font-bold text-gray-800">New Arrivals</h2>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">JUST IN</span>
              </div>
              <button onClick={() => onNavigate('listing')} className="text-[#3B5BDB] text-sm font-medium hover:underline">View All →</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {newArrivals.map((p) =>
                <div key={p.id} onClick={() => onNavigate('product', { productId: p.id })}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <span className="bg-white text-[#3B5BDB] text-[10px] font-black px-2 py-0.5 rounded-md">{p.badge}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="font-bold text-sm text-gray-900">₹{p.price.toLocaleString()}</span>
                      <span className="text-green-600 text-xs font-semibold">{p.discount}% off</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        }

        {/* ── Top Brands ── */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-6 bg-orange-400 rounded-full" />
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Top Brands</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'Redmi', color: 'from-orange-50 to-orange-100', text: 'text-orange-600' },
              { name: 'boAt', color: 'from-blue-50 to-blue-100', text: 'text-blue-600' },
              { name: 'Lakme', color: 'from-pink-50 to-pink-100', text: 'text-pink-600' },
              { name: 'Prestige', color: 'from-red-50 to-red-100', text: 'text-red-600' },
              { name: 'SpeedRun', color: 'from-green-50 to-green-100', text: 'text-green-600' },
              { name: 'Philips', color: 'from-indigo-50 to-indigo-100', text: 'text-indigo-600' }].
              map((brand) =>
                <button key={brand.name} onClick={() => onNavigate('listing', { brand: brand.name })}
                  className={`bg-gradient-to-br ${brand.color} rounded-xl py-4 px-3 text-center border border-white hover:shadow-md transition-all group`}>
                  <div className={`w-11 h-11 mx-auto mb-2 rounded-full bg-white flex items-center justify-center font-bold ${brand.text} text-lg shadow-sm group-hover:scale-110 transition-transform`}>
                    {brand.name[0]}
                  </div>
                  <p className="text-xs font-semibold text-gray-700">{brand.name}</p>
                </button>
              )}
          </div>
        </section>

        {/* ── App Download Banner ── */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-[#3B5BDB] to-[#6B4FBB] rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-6 px-6 md:px-10 py-7">
              <div className="flex-1 text-white">
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest mb-2">Download the App</p>
                <h3 className="text-2xl md:text-3xl font-extrabold mb-2">Shop on the Go!</h3>
                <p className="text-blue-200 text-sm mb-5">Get exclusive app-only deals, faster checkout and real-time order tracking.</p>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-colors">
                    <span className="text-xl">🍎</span>
                    <div className="text-left">
                      <div className="text-[9px] text-gray-400 leading-none">Download on the</div>
                      <div className="text-sm font-bold leading-tight">App Store</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-colors">
                    <span className="text-xl">▶</span>
                    <div className="text-left">
                      <div className="text-[9px] text-gray-400 leading-none">Get it on</div>
                      <div className="text-sm font-bold leading-tight">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-center text-white bg-white/10 rounded-xl px-6 py-4 backdrop-blur-sm">
                  <p className="text-3xl font-black">50L+</p>
                  <p className="text-xs text-blue-200">Happy Customers</p>
                </div>
                <div className="text-center text-white bg-white/10 rounded-xl px-6 py-4 backdrop-blur-sm">
                  <p className="text-3xl font-black">4.8★</p>
                  <p className="text-xs text-blue-200">App Rating</p>
                </div>
                <div className="text-center text-white bg-white/10 rounded-xl px-6 py-4 backdrop-blur-sm">
                  <p className="text-3xl font-black">1Cr+</p>
                  <p className="text-xs text-blue-200">Products Listed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-6 bg-yellow-400 rounded-full" />
            <h2 className="text-lg md:text-xl font-bold text-gray-800">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t) =>
              <div key={t.name} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }, (_, i) =>
                    <span key={i} className={`text-base ${i < t.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.bg} text-white flex items-center justify-center font-bold text-xs flex-shrink-0`}>{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{t.name}</p>
                    <p className="text-[11px] text-gray-400">{t.location}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-[10px] bg-green-50 text-green-600 font-semibold px-2 py-0.5 rounded-full">✓ Verified</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Recently Viewed Products ── */}
        <RecentlyViewed onNavigate={onNavigate} onQuickView={(prod) => setQuickViewProduct(prod)} />

      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
        onAddToCart={onAddToCart}
        onNavigate={onNavigate}
      />
    </div>);
}