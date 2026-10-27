import { useState, useMemo, useEffect } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/SkeletonCard';
import QuickViewModal from '../components/QuickViewModal';

const sortOptions = ['Relevance', 'Popularity', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Discount'];
const brands = ['FashionHub', 'StyleMen', 'SpeedRun', 'boAt', 'SilkKraft', 'Prestige', 'Redmi', 'GoldLane', 'StyleBag', 'Lakme', 'JBL', 'Xiaomi', 'Himalaya', 'KidStyle', 'Philips'];
const catList = ['Women', 'Men', 'Kids', 'Beauty', 'Electronics', 'Home & Kitchen', 'Footwear', 'Accessories', 'Sports'];

function Pagination({ total, page, perPage, onPage }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    return start + i;
  });
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-[#9F2089] hover:text-[#9F2089] transition-colors disabled:opacity-30"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
            p === page
              ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-xs'
              : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#9F2089]'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-[#9F2089] hover:text-[#9F2089] transition-colors disabled:opacity-30"
      >
        ›
      </button>
    </div>
  );
}

export default function ProductListingPage({ onNavigate, onBack, wishlist, onToggleWishlist, onAddToCart, filters }) {
  const [sortBy, setSortBy] = useState('Relevance');
  const [view, setView] = useState('grid');
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [selectedBrands, setSelectedBrands] = useState(filters?.brand ? [filters.brand] : []);
  const [selectedRating, setSelectedRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const PER_PAGE = 8;

  useEffect(() => {
    if (filters?.category) setSelectedCategory(filters.category);
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [selectedCategory, selectedBrands, selectedRating, minDiscount, sortBy]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase() || p.subcategory?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (selectedBrands.length > 0) result = result.filter((p) => selectedBrands.includes(p.brand));
    if (selectedRating > 0) result = result.filter((p) => p.rating >= selectedRating);
    if (minDiscount > 0) result = result.filter((p) => p.discount >= minDiscount);
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (filters?.badge) {
      result = result.filter(
        (p) =>
          p.badge === filters.badge ||
          (filters.badge === 'Lowest Price' && p.price <= 599) ||
          (filters.badge === 'Best Seller' && p.reviews > 2000)
      );
    }
    switch (sortBy) {
      case 'Price: Low to High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'Rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'Discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'Popularity':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    return result;
  }, [selectedCategory, selectedBrands, selectedRating, minDiscount, priceRange, sortBy, filters]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
  };

  const clearAll = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setSelectedRating(0);
    setMinDiscount(0);
    setPriceRange([0, 30000]);
  };

  const activeFilterCount = [
    selectedCategory,
    ...selectedBrands,
    selectedRating > 0 ? '1' : '',
    minDiscount > 0 ? '1' : '',
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6 text-xs">
      {/* Category */}
      <div>
        <h4 className="font-black text-sm text-gray-800 dark:text-gray-100 mb-3">Category</h4>
        <div className="space-y-2">
          {catList.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'border-[#9F2089] bg-[#9F2089]'
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-[#9F2089]'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              >
                {selectedCategory.toLowerCase() === cat.toLowerCase() && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'text-[#9F2089] dark:text-[#F43397] font-bold'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-black text-sm text-gray-800 dark:text-gray-100 mb-3">Price Range</h4>
        <input
          type="range"
          min={0}
          max={30000}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
          className="w-full accent-[#9F2089] h-1.5 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">₹{priceRange[0]}</span>
          <span className="bg-pink-50 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397] font-bold px-2 py-0.5 rounded-lg">
            ₹{priceRange[1].toLocaleString()}
          </span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-black text-sm text-gray-800 dark:text-gray-100 mb-3">Customer Rating</h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === r}
                onChange={() => setSelectedRating(selectedRating === r ? 0 : r)}
                className="accent-[#9F2089]"
              />
              <span className="text-yellow-400 font-bold">{r}★ & above</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Discount */}
      <div>
        <h4 className="font-black text-sm text-gray-800 dark:text-gray-100 mb-3">Discount</h4>
        <div className="space-y-1.5">
          {[30, 40, 50, 60].map((d) => (
            <label key={d} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="discount"
                checked={minDiscount === d}
                onChange={() => setMinDiscount(minDiscount === d ? 0 : d)}
                className="accent-[#9F2089]"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{d}% or more</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="font-black text-sm text-gray-800 dark:text-gray-100 mb-3">Top Brands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => toggleBrand(b)}
                className="rounded accent-[#9F2089]"
              />
              <span className="text-gray-700 dark:text-gray-300">{b}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

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
          <span className="text-gray-800 dark:text-gray-200 font-bold whitespace-nowrap">
            {selectedCategory || 'All Products'}
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 p-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 className="font-black text-base text-gray-900 dark:text-white">Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="text-xs text-red-500 font-bold hover:underline">
                  Reset
                </button>
              )}
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Top Control Bar */}
          <div className="bg-white dark:bg-[#161F30] rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-2.5 sm:p-4 mb-4 sm:mb-5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
            <div>
              <h2 className="text-sm sm:text-lg font-black text-gray-900 dark:text-white">
                {selectedCategory || 'All Products'}{' '}
                <span className="text-xs font-normal text-gray-400">({filtered.length} items found)</span>
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setShowFilter(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-pink-50 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397] rounded-xl"
              >
                <span>⚙️ Filter</span>
                {activeFilterCount > 0 && <span>({activeFilterCount})</span>}
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E293B] dark:text-white rounded-xl px-2 sm:px-3 py-1.5 text-xs font-bold outline-none focus:border-[#9F2089] max-w-[125px] sm:max-w-none truncate"
                >
                  {sortOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid / List view toggle */}
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`p-1.5 transition-colors ${
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
                  className={`p-1.5 transition-colors ${
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

          {/* Product Grid / List */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white dark:bg-[#161F30] rounded-3xl border border-gray-100 dark:border-gray-800 text-center py-20 px-4 shadow-xs">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="font-black text-gray-800 dark:text-gray-100 text-base">No products match your filters</h3>
              <p className="text-gray-400 text-xs mt-1">Try resetting or broadening your filters.</p>
              <button
                onClick={clearAll}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-bold text-xs rounded-xl"
              >
                Clear All Filters
              </button>
            </div>
          ) : view === 'grid' ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((p) => (
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
              <Pagination total={filtered.length} page={page} perPage={PER_PAGE} onPage={setPage} />
            </>
          ) : (
            <>
              <div className="space-y-3">
                {filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((p) => (
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
              <Pagination total={filtered.length} page={page} perPage={PER_PAGE} onPage={setPage} />
            </>
          )}
        </main>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {showFilter && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowFilter(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#161F30] rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-black text-base text-gray-800 dark:text-gray-100">Filters</h3>
              <button
                onClick={() => setShowFilter(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <FilterContent />
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <button
                onClick={clearAll}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="flex-1 py-3 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-bold rounded-xl text-xs"
              >
                Show Results ({filtered.length})
              </button>
            </div>
          </div>
        </div>
      )}

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