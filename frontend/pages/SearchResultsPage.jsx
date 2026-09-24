import { useState, useMemo } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';










const sortOptions = ['Relevance', 'Popularity', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Discount'];

export default function SearchResultsPage({ query, onNavigate, wishlist, onToggleWishlist, onAddToCart }) {
  const [sortBy, setSortBy] = useState('Relevance');
  const [view, setView] = useState('grid');
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceRange, setPriceRange] = useState(30000);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    let found = q ?
    products.filter((p) =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.subcategory.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
    ) :
    [...products];

    found = found.filter((p) => p.price <= priceRange);
    if (selectedRating > 0) found = found.filter((p) => p.rating >= selectedRating);

    switch (sortBy) {
      case 'Price: Low to High':found.sort((a, b) => a.price - b.price);break;
      case 'Price: High to Low':found.sort((a, b) => b.price - a.price);break;
      case 'Rating':found.sort((a, b) => b.rating - a.rating);break;
      case 'Discount':found.sort((a, b) => b.discount - a.discount);break;
      case 'Popularity':found.sort((a, b) => b.reviews - a.reviews);break;
    }
    return found;
  }, [query, sortBy, priceRange, selectedRating]);

  const suggestions = ['Women Kurti', 'Men Shirt', 'Running Shoes', 'Headphones', 'Saree', 'Smartphones'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb + query */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button onClick={() => onNavigate('home')} className="hover:text-[#3B5BDB]">Home</button>
        <span>›</span>
        <span className="text-gray-800 font-medium">Search: "{query}"</span>
      </div>

      <div className="flex gap-6">
        {/* Filter sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">
            <h3 className="font-bold text-gray-800">Refine Results</h3>

            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Price Range</h4>
              <input type="range" min={500} max={30000} value={priceRange} onChange={(e) => setPriceRange(+e.target.value)} className="w-full accent-[#3B5BDB]" />
              <div className="flex justify-between text-xs text-gray-500 mt-1"><span>₹500</span><span>₹{priceRange.toLocaleString()}</span></div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Rating</h4>
              {[4, 3, 2].map((r) =>
              <label key={r} className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="radio" name="rating" checked={selectedRating === r} onChange={() => setSelectedRating(selectedRating === r ? 0 : r)} className="accent-[#3B5BDB]" />
                  <span className="text-yellow-400 text-xs">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                  <span className="text-xs text-gray-500">& above</span>
                </label>
              )}
            </div>

            {/* Try searching for */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Popular Searches</h4>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) =>
                <button key={s} onClick={() => onNavigate('search', { query: s })} className="text-xs bg-blue-50 text-[#3B5BDB] px-2.5 py-1 rounded-full hover:bg-[#3B5BDB] hover:text-white transition-colors">
                    {s}
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-4 flex flex-wrap items-center gap-3">
            <div className="flex-1">
              <h2 className="font-bold text-gray-800">
                {results.length > 0 ? `${results.length} results for "${query}"` : `No results for "${query}"`}
              </h2>
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none hover:border-[#3B5BDB]">
              {sortOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setView('grid')} className={`p-1.5 ${view === 'grid' ? 'bg-[#3B5BDB] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </button>
              <button onClick={() => setView('list')} className={`p-1.5 ${view === 'list' ? 'bg-[#3B5BDB] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>
            </div>
          </div>

          {results.length === 0 ?
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20 px-8">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-bold text-xl text-gray-700 mb-2">No results found for "{query}"</h3>
              <p className="text-gray-400 text-sm mb-6">Try different keywords or browse our categories</p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {suggestions.map((s) =>
              <button key={s} onClick={() => onNavigate('search', { query: s })} className="text-sm bg-blue-50 text-[#3B5BDB] px-4 py-2 rounded-xl hover:bg-[#3B5BDB] hover:text-white transition-colors font-medium">
                    {s}
                  </button>
              )}
              </div>
              <button onClick={() => onNavigate('listing')} className="text-[#3B5BDB] font-semibold hover:underline">Browse All Products</button>
            </div> :
          view === 'grid' ?
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {results.map((p) => <ProductCard key={p.id} product={p} onNavigate={onNavigate} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} onAddToCart={onAddToCart} />)}
            </div> :

          <div className="space-y-3">
              {results.map((p) => <ProductCard key={p.id} product={p} onNavigate={onNavigate} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} onAddToCart={onAddToCart} view="list" />)}
            </div>
          }
        </main>
      </div>
    </div>);

}