import { useState, useMemo } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';

const sortOptions = ['Relevance', 'Popularity', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Discount'];

export default function SearchResultsPage({ query, onNavigate, onBack, wishlist, onToggleWishlist, onAddToCart }) {
  const [sortBy, setSortBy] = useState('Relevance');
  const [view, setView] = useState('grid');
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceRange, setPriceRange] = useState(30000);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    let found = q
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.subcategory?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        )
      : [...products];

    found = found.filter((p) => p.price <= priceRange);
    if (selectedRating > 0) found = found.filter((p) => p.rating >= selectedRating);

    switch (sortBy) {
      case 'Price: Low to High':
        found.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        found.sort((a, b) => b.price - a.price);
        break;
      case 'Rating':
        found.sort((a, b) => b.rating - a.rating);
        break;
      case 'Discount':
        found.sort((a, b) => b.discount - a.discount);
        break;
      case 'Popularity':
        found.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    return found;
  }, [query, sortBy, priceRange, selectedRating]);

  const suggestions = ['Silk Saree', 'Rayon Kurti', 'Men Casual Shirt', 'Running Shoes', 'boAt Headphones', 'Air Fryer'];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20">
      {/* Breadcrumb & Back Button */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
        <button
          onClick={onBack || (() => onNavigate('home'))}
          title="Go Back (मागे जा)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#161F30] border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-[#9F2089] hover:border-[#9F2089] dark:hover:text-[#F43397] dark:hover:border-[#F43397] transition-all shadow-xs active:scale-95 group flex-shrink-0"
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back</span>
        </button>
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500 overflow-x-auto scrollbar-hide py-0.5">
          <button onClick={() => onNavigate('home')} className="hover:text-[#9F2089] font-medium whitespace-nowrap">
            Home
          </button>
          <span>›</span>
          <span className="text-gray-800 dark:text-gray-200 font-bold whitespace-nowrap">Search results for "{query}"</span>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 p-5 space-y-5 sticky top-24">
            <h3 className="font-black text-sm text-gray-900 dark:text-white">Refine Search</h3>

            <div>
              <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300 mb-2">Max Price</h4>
              <input
                type="range"
                min={300}
                max={30000}
                value={priceRange}
                onChange={(e) => setPriceRange(+e.target.value)}
                className="w-full accent-[#9F2089]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>₹300</span>
                <span className="font-bold text-[#9F2089]">₹{priceRange.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300 mb-2">Minimum Rating</h4>
              {[4, 3, 2].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer mb-1.5 text-xs">
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === r}
                    onChange={() => setSelectedRating(selectedRating === r ? 0 : r)}
                    className="accent-[#9F2089]"
                  />
                  <span className="text-yellow-400">{'★'.repeat(r)}</span>
                  <span className="text-gray-500">& above</span>
                </label>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300 mb-2">Trending Searches</h4>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => onNavigate('search', { query: s })}
                    className="text-[11px] bg-pink-50 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397] font-semibold px-2.5 py-1 rounded-full hover:bg-[#9F2089] hover:text-white transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results Main */}
        <main className="flex-1 min-w-0">
          <div className="bg-white dark:bg-[#161F30] rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-2.5 sm:p-3.5 mb-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
            <h2 className="font-black text-xs sm:text-sm text-gray-900 dark:text-white">
              {results.length > 0 ? (
                <span>
                  Showing {results.length} results for "<span className="text-[#9F2089] dark:text-[#F43397]">{query}</span>"
                </span>
              ) : (
                <span>No exact match for "{query}"</span>
              )}
            </h2>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E293B] text-gray-800 dark:text-white rounded-xl px-2 sm:px-3 py-1.5 text-xs font-bold outline-none max-w-[125px] sm:max-w-none truncate"
              >
                {sortOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>

              <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`p-1.5 ${
                    view === 'grid'
                      ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white'
                      : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 ${
                    view === 'list'
                      ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white'
                      : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="bg-white dark:bg-[#161F30] rounded-3xl border border-gray-100 dark:border-gray-800 text-center py-20 px-4 shadow-xs">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="font-black text-gray-800 dark:text-gray-100 text-base mb-1">
                No products found for "{query}"
              </h3>
              <p className="text-gray-400 text-xs mb-6">Check your spelling or explore popular categories below.</p>
              <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-md mx-auto">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => onNavigate('search', { query: s })}
                    className="text-xs bg-pink-50 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397] font-bold px-3 py-1.5 rounded-xl hover:bg-[#9F2089] hover:text-white transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onNavigate('listing')}
                className="bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
              >
                Browse All 10,000+ Products
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {results.map((p) => (
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
          ) : (
            <div className="space-y-3">
              {results.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onNavigate={onNavigate}
                  isWishlisted={wishlist.includes(p.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  view="list"
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />
              ))}
            </div>
          )}
        </main>
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
    </div>
  );
}