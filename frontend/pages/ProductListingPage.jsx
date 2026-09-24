import { useState, useMemo, useEffect } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/SkeletonCard';










const sortOptions = ['Relevance', 'Popularity', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Discount'];
const brands = ['FashionKart', 'StyleMen', 'SpeedRun', 'boAt', 'SilkKraft', 'Prestige', 'Redmi', 'GoldLane', 'StyleBag', 'Lakme', 'JBL', 'Xiaomi', 'Himalaya', 'KidStyle', 'FlexFit', 'Philips'];
const catList = ['Women', 'Men', 'Kids', 'Beauty', 'Electronics', 'Home & Kitchen', 'Footwear', 'Accessories', 'Sports'];

function Pagination({ total, page, perPage, onPage }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    return start + i;
  });
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#3B5BDB] hover:text-[#3B5BDB] transition-colors disabled:opacity-30">
        ‹
      </button>
      {pages.map((p) =>
      <button key={p} onClick={() => onPage(p)}
      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors ${p === page ? 'bg-[#3B5BDB] text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:border-[#3B5BDB] hover:text-[#3B5BDB]'}`}>
          {p}
        </button>
      )}
      <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#3B5BDB] hover:text-[#3B5BDB] transition-colors disabled:opacity-30">
        ›
      </button>
    </div>);

}

export default function ProductListingPage({ onNavigate, wishlist, onToggleWishlist, onAddToCart, filters }) {
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

  const PER_PAGE = 8;

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [selectedCategory, selectedBrands, selectedRating, minDiscount, sortBy]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedBrands.length > 0) result = result.filter((p) => selectedBrands.includes(p.brand));
    if (selectedRating > 0) result = result.filter((p) => p.rating >= selectedRating);
    if (minDiscount > 0) result = result.filter((p) => p.discount >= minDiscount);
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (filters?.badge) result = result.filter((p) => p.badge === filters.badge || filters.badge === 'new' && p.badge === 'New Launch');
    switch (sortBy) {
      case 'Price: Low to High':result.sort((a, b) => a.price - b.price);break;
      case 'Price: High to Low':result.sort((a, b) => b.price - a.price);break;
      case 'Rating':result.sort((a, b) => b.rating - a.rating);break;
      case 'Discount':result.sort((a, b) => b.discount - a.discount);break;
      case 'Popularity':result.sort((a, b) => b.reviews - a.reviews);break;
    }
    return result;
  }, [selectedCategory, selectedBrands, selectedRating, minDiscount, priceRange, sortBy, filters]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);
  };

  const clearAll = () => {
    setSelectedCategory('');setSelectedBrands([]);setSelectedRating(0);setMinDiscount(0);setPriceRange([0, 30000]);
  };

  const activeFilterCount = [selectedCategory, ...selectedBrands, selectedRating > 0 ? '1' : '', minDiscount > 0 ? '1' : ''].filter(Boolean).length;

  const FilterContent = () =>
  <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-bold text-sm text-gray-800 mb-3">Category</h4>
        <div className="space-y-2">
          {catList.map((cat) =>
        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedCategory === cat ? 'border-[#3B5BDB] bg-[#3B5BDB]' : 'border-gray-300 group-hover:border-[#3B5BDB]'}`}
          onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}>
                {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className={`text-sm ${selectedCategory === cat ? 'text-[#3B5BDB] font-semibold' : 'text-gray-600'}`}>{cat}</span>
            </label>
        )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-sm text-gray-800 mb-3">Price Range</h4>
        <input type="range" min={0} max={30000} value={priceRange[1]}
      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
      className="w-full accent-[#3B5BDB] h-1.5" />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span className="bg-gray-100 px-2 py-0.5 rounded-lg">₹{priceRange[0]}</span>
          <span className="bg-blue-50 text-[#3B5BDB] font-semibold px-2 py-0.5 rounded-lg">₹{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="font-bold text-sm text-gray-800 mb-3">Brand</h4>
        <div className="space-y-2">
          {brands.slice(0, 8).map((brand) =>
        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedBrands.includes(brand) ? 'border-[#3B5BDB] bg-[#3B5BDB]' : 'border-gray-300 group-hover:border-[#3B5BDB]'}`}
          onClick={() => toggleBrand(brand)}>
                {selectedBrands.includes(brand) && <svg width="10" height="10" fill="white" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>}
              </div>
              <span className="text-sm text-gray-600">{brand}</span>
            </label>
        )}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-bold text-sm text-gray-800 mb-3">Customer Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map((r) =>
        <label key={r} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedRating === r ? 'border-[#3B5BDB] bg-[#3B5BDB]' : 'border-gray-300 group-hover:border-[#3B5BDB]'}`}
          onClick={() => setSelectedRating(selectedRating === r ? 0 : r)}>
                {selectedRating === r && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="text-yellow-400 text-sm">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
              <span className="text-sm text-gray-500">& above</span>
            </label>
        )}
        </div>
      </div>

      {/* Discount */}
      <div>
        <h4 className="font-bold text-sm text-gray-800 mb-3">Minimum Discount</h4>
        <div className="flex flex-wrap gap-2">
          {[10, 20, 30, 40, 50].map((d) =>
        <button key={d} onClick={() => setMinDiscount(minDiscount === d ? 0 : d)}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${minDiscount === d ? 'border-[#3B5BDB] bg-[#3B5BDB] text-white' : 'border-gray-200 text-gray-600 hover:border-[#3B5BDB]'}`}>
              {d}%+
            </button>
        )}
        </div>
      </div>
    </div>;


  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <button onClick={() => onNavigate('home')} className="hover:text-[#3B5BDB]">Home</button>
        <span>›</span>
        <span className="text-gray-700 font-medium">{selectedCategory || 'All Products'}</span>
      </div>

      {/* Mobile category chips - horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-3 md:hidden" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => setSelectedCategory('')}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all ${!selectedCategory ? 'border-[#3B5BDB] bg-[#3B5BDB] text-white' : 'border-gray-200 text-gray-600 bg-white'}`}>
          All
        </button>
        {catList.map((cat) =>
        <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all ${selectedCategory === cat ? 'border-[#3B5BDB] bg-[#3B5BDB] text-white' : 'border-gray-200 text-gray-600 bg-white'}`}>
            {cat}
          </button>
        )}
      </div>

      <div className="flex gap-5">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" /></svg>
                Filters
              </h3>
              {activeFilterCount > 0 &&
              <button onClick={clearAll} className="text-xs text-[#3B5BDB] font-semibold hover:underline">Clear all ({activeFilterCount})</button>
              }
            </div>
            <FilterContent />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 mb-4 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-gray-800 text-sm md:text-base truncate">{selectedCategory || 'All Products'}</h1>
              <p className="text-xs text-gray-400">{filtered.length} products found</p>
            </div>

            {/* Mobile: Filter + Sort */}
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={() => setShowFilter(true)}
              className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 hover:border-[#3B5BDB] transition-colors relative">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" /></svg>
                Filter
                {activeFilterCount > 0 &&
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#3B5BDB] text-white text-[9px] rounded-full flex items-center justify-center font-bold">{activeFilterCount}</span>
                }
              </button>
              <button onClick={() => setShowSortSheet(true)}
              className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 hover:border-[#3B5BDB] transition-colors">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="21" y2="12" /><line x1="9" y1="18" x2="21" y2="18" /></svg>
                Sort
              </button>
            </div>

            {/* Desktop sort */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="hidden lg:block border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none hover:border-[#3B5BDB] transition-colors">
              {sortOptions.map((o) => <option key={o}>{o}</option>)}
            </select>

            <div className="hidden md:flex border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setView('grid')} className={`p-2 transition-colors ${view === 'grid' ? 'bg-[#3B5BDB] text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </button>
              <button onClick={() => setView('list')} className={`p-2 transition-colors ${view === 'list' ? 'bg-[#3B5BDB] text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>
            </div>
          </div>

          {/* Active filter pills */}
          {activeFilterCount > 0 &&
          <div className="flex flex-wrap gap-2 mb-3">
              {selectedCategory &&
            <span className="bg-blue-50 text-[#3B5BDB] text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')} className="hover:text-red-500 font-bold">×</button>
                </span>
            }
              {selectedBrands.map((b) =>
            <span key={b} className="bg-blue-50 text-[#3B5BDB] text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                  {b}
                  <button onClick={() => toggleBrand(b)} className="hover:text-red-500 font-bold">×</button>
                </span>
            )}
              {selectedRating > 0 &&
            <span className="bg-yellow-50 text-yellow-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                  {selectedRating}★+
                  <button onClick={() => setSelectedRating(0)} className="hover:text-red-500 font-bold">×</button>
                </span>
            }
              {minDiscount > 0 &&
            <span className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                  {minDiscount}%+ off
                  <button onClick={() => setMinDiscount(0)} className="hover:text-red-500 font-bold">×</button>
                </span>
            }
            </div>
          }

          {/* Products grid */}
          {loading ?
          <div className={view === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3' : 'space-y-3'}>
              {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
            </div> :
          filtered.length === 0 ?
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-bold text-xl text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-400 text-sm mb-5">Try adjusting or clearing your filters</p>
              <button onClick={clearAll} className="bg-[#3B5BDB] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#2F4AC4] text-sm active:scale-95 transition-all">
                Clear All Filters
              </button>
            </div> :
          view === 'grid' ?
          <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((p) =>
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} onAddToCart={onAddToCart} />
              )}
              </div>
              <Pagination total={filtered.length} page={page} perPage={PER_PAGE} onPage={setPage} />
            </> :

          <>
              <div className="space-y-3">
                {filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((p) =>
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} onAddToCart={onAddToCart} view="list" />
              )}
              </div>
              <Pagination total={filtered.length} page={page} perPage={PER_PAGE} onPage={setPage} />
            </>
          }
        </main>
      </div>

      {/* ── Mobile Filter Drawer (slide-up) ── */}
      {showFilter &&
      <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowFilter(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[88vh] flex flex-col animate-slide-up"
          onClick={(e) => e.stopPropagation()}>
          
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-800">Filters</h3>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 &&
              <button onClick={clearAll} className="text-sm text-red-500 font-semibold">Clear all</button>
              }
                <button onClick={() => setShowFilter(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
              </div>
            </div>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <FilterContent />
            </div>
            {/* Apply button */}
            <div className="px-5 py-4 border-t border-gray-100 safe-area-bottom">
              <button onClick={() => setShowFilter(false)}
            className="w-full py-3.5 bg-[#3B5BDB] text-white font-bold rounded-2xl hover:bg-[#2F4AC4] transition-colors active:scale-95 text-base">
                Apply Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>
            </div>
          </div>
        </div>
      }

      {/* ── Mobile Sort Sheet ── */}
      {showSortSheet &&
      <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowSortSheet(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl animate-slide-up"
          onClick={(e) => e.stopPropagation()}>
          
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-800">Sort By</h3>
            </div>
            <div className="py-2 pb-8 safe-area-bottom">
              {sortOptions.map((opt) =>
            <button key={opt} onClick={() => {setSortBy(opt);setShowSortSheet(false);}}
            className={`w-full flex items-center justify-between px-6 py-4 text-sm transition-colors ${sortBy === opt ? 'text-[#3B5BDB] font-bold bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {opt}
                  {sortBy === opt &&
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-[#3B5BDB]">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
              }
                </button>
            )}
            </div>
          </div>
        </div>
      }
    </div>);

}