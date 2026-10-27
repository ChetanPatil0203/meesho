import { useState, useEffect, useMemo } from 'react';
import { styleRecommendationService } from '../services/styleRecommendationService';
import { triggerConfetti } from '../utils/confetti';

const OCCASIONS = [
  { id: 'college', label: 'College', icon: '🎓' },
  { id: 'office', label: 'Office', icon: '💼' },
  { id: 'date', label: 'Date', icon: '💕' },
  { id: 'party', label: 'Party', icon: '🎉' },
  { id: 'wedding', label: 'Wedding', icon: '💍' },
  { id: 'vacation', label: 'Vacation', icon: '🌴' },
  { id: 'casual', label: 'Casual', icon: '👟' },
  { id: 'everyday', label: 'Everyday', icon: '🏃' },
];

const STYLES = [
  'Casual',
  'Trendy',
  'Minimal',
  'Formal',
  'Streetwear',
  'Traditional',
  'Party',
];

const BUDGET_OPTIONS = [
  { id: 'all', label: 'All Budgets' },
  { id: 'budget', label: 'Budget (< ₹800)' },
  { id: 'mid-range', label: 'Mid-range (₹800 - ₹2000)' },
  { id: 'premium', label: 'Premium (> ₹2000)' },
];

const COLOR_OPTIONS = [
  'Any',
  'Black',
  'White',
  'Blue',
  'Beige',
  'Pink',
  'Green',
  'Brown',
];

export default function ShopioStylistModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onNavigate,
  onShowToast,
}) {
  const [occasion, setOccasion] = useState('casual');
  const [style, setStyle] = useState('casual');
  const [budget, setBudget] = useState('all');
  const [color, setColor] = useState('any');
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch recommendations whenever product, occasion, style, budget, or color changes
  useEffect(() => {
    if (!isOpen || !product) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    styleRecommendationService
      .getRecommendations({
        productId: product.id,
        occasion,
        style,
        budget,
        color,
      })
      .then((data) => {
        if (!isMounted) return;
        const recs = data.recommendations || [];
        setRecommendations(recs);
        // By default, select all available recommended items
        setSelectedProductIds(new Set(recs.map((r) => r.product.id)));
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Stylist recommendation error:', err);
        setError('Style recommendations are temporarily unavailable.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, product, occasion, style, budget, color]);

  // Toggle selection of a recommended product in the outfit
  const handleToggleSelect = (productId) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  // Filter selected items
  const selectedItems = useMemo(() => {
    return recommendations.filter((r) => selectedProductIds.has(r.product.id) && r.product.inStock);
  }, [recommendations, selectedProductIds]);

  // Dynamic calculations for selected outfit
  const selectedTotal = useMemo(() => {
    return selectedItems.reduce((sum, r) => sum + (r.product.price || 0), 0);
  }, [selectedItems]);

  const selectedMrpTotal = useMemo(() => {
    return selectedItems.reduce((sum, r) => sum + (r.product.mrp || r.product.price || 0), 0);
  }, [selectedItems]);

  const totalSavings = Math.max(0, selectedMrpTotal - selectedTotal);

  // Add all selected outfit items to cart
  const handleAddCompleteLook = () => {
    if (selectedItems.length === 0) {
      onShowToast?.('Please select at least one item from the outfit', 'error');
      return;
    }

    selectedItems.forEach((r) => {
      onAddToCart?.(
        r.product,
        1,
        r.product.colors?.[0] || 'Default',
        r.product.sizes?.[0] || ''
      );
    });

    triggerConfetti(2000);
    onShowToast?.(
      `🎉 Added ${selectedItems.length} outfit items to your cart! Total: ₹${selectedTotal.toLocaleString()}`
    );
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#161F30] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-pink-100 dark:border-gray-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="relative px-5 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-pink-50/70 via-purple-50/40 to-white dark:from-[#1E293B] dark:to-[#161F30] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#9F2089] to-[#F43397] flex items-center justify-center text-white text-xl shadow-md flex-shrink-0 animate-pulse">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
                  ✨ Shopio Stylist
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9F2089]/10 text-[#9F2089] dark:text-[#F43397] dark:bg-pink-950/40">
                  AI Style Assistant
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Let's complete your look with curated complementary pieces
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex items-center justify-center text-sm font-bold transition-all shadow-xs hover:scale-105"
            title="Close Stylist"
          >
            ✕
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. Selected Base Item Card */}
          <div className="bg-gradient-to-r from-gray-50 to-pink-50/30 dark:from-[#1E293B] dark:to-[#161F30] border border-gray-200/80 dark:border-gray-700/80 rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-2xs">
            <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 bg-[#9F2089] text-white text-[8px] font-bold px-1 py-0.2 rounded">
                Base
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9F2089] dark:text-[#F43397]">
                Selected Item
              </span>
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white line-clamp-1 leading-snug">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base font-black text-gray-900 dark:text-white">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-xs font-bold text-[#038D63]">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                Category: <span className="font-semibold">{product.category}</span>
                {product.subcategory ? ` • ${product.subcategory}` : ''}
              </p>
            </div>
          </div>

          {/* 2. Occasion Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>🎯</span> What are you dressing for?
              </label>
              <span className="text-[11px] text-gray-400 font-medium">
                Tap to switch vibe
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide py-1">
              {OCCASIONS.map((occ) => {
                const isActive = occasion.toLowerCase() === occ.id.toLowerCase();
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setOccasion(occ.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-md scale-102 ring-2 ring-pink-300 dark:ring-pink-900'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#9F2089] hover:bg-pink-50/50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{occ.icon}</span>
                    <span>{occ.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Style Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>👗</span> Choose your style
              </label>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs font-bold text-[#9F2089] dark:text-[#F43397] flex items-center gap-1 hover:underline"
              >
                <span>{showFilters ? '▲ Hide Filters' : '▼ More Filters (Color & Budget)'}</span>
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {STYLES.map((st) => {
                const isActive = style.toLowerCase() === st.toLowerCase();
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStyle(st.toLowerCase())}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      isActive
                        ? 'bg-[#9F2089] text-white shadow-xs font-black'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Optional Filters (Budget & Color) */}
          {showFilters && (
            <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Price Preference:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {BUDGET_OPTIONS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBudget(b.id)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                        budget === b.id
                          ? 'bg-[#9F2089] text-white border-[#9F2089]'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Color Preference:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c.toLowerCase())}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                        color === c.toLowerCase()
                          ? 'bg-[#9F2089] text-white border-[#9F2089]'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Recommendations Section: "Complete Your Look ✨" ── */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                  Complete Your Look ✨
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-[#038D63] dark:bg-green-950/40">
                  {recommendations.length} Matching Items
                </span>
              </div>
              <span className="text-[11px] text-gray-400 hidden sm:inline">
                Rule-based fashion compatibility
              </span>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-9 h-9 border-4 border-[#9F2089] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-gray-500 animate-pulse">
                  Styling your outfit with Shopio fashion rules...
                </p>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl p-5 text-center my-4">
                <p className="text-xs font-bold mb-3">{error}</p>
                <button
                  onClick={() => setOccasion('casual')}
                  className="px-4 py-1.5 bg-[#9F2089] text-white text-xs font-bold rounded-xl"
                >
                  Retry with Casual
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && recommendations.length === 0 && (
              <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center space-y-3">
                <div className="text-3xl">👗✨</div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  Sorry, we couldn't find a perfect match right now.
                </p>
                <p className="text-xs text-gray-500">
                  Try another style or occasion to discover matching pieces.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setStyle('casual')}
                    className="px-3.5 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-[#9F2089]"
                  >
                    Change Style
                  </button>
                  <button
                    onClick={() => setOccasion('casual')}
                    className="px-3.5 py-1.5 bg-[#9F2089] text-white rounded-xl text-xs font-bold hover:opacity-95"
                  >
                    Change Occasion
                  </button>
                </div>
              </div>
            )}

            {/* Outfit Recommendations Cards */}
            {!loading && !error && recommendations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {recommendations.map((rec) => {
                  const p = rec.product;
                  const isSelected = selectedProductIds.has(p.id);

                  return (
                    <div
                      key={p.id}
                      className={`relative rounded-2xl border transition-all duration-200 p-3 sm:p-3.5 flex gap-3 sm:gap-3.5 items-start ${
                        isSelected
                          ? 'border-[#9F2089]/60 bg-pink-50/30 dark:bg-[#1E293B] shadow-xs'
                          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161F30] opacity-80'
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggleSelect(p.id)}
                        className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border transition-colors flex-shrink-0 ${
                          isSelected
                            ? 'bg-[#9F2089] border-[#9F2089] text-white'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                        }`}
                        title={isSelected ? 'Remove from outfit' : 'Add to outfit'}
                      >
                        {isSelected && <span className="text-xs font-black">✓</span>}
                      </button>

                      {/* Product Thumbnail */}
                      <div
                        className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 cursor-pointer relative group"
                        onClick={() => {
                          onClose();
                          onNavigate?.('product', { productId: p.id });
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                        />
                        {p.discount > 0 && (
                          <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[8px] font-black px-1 py-0.2 rounded">
                            -{p.discount}%
                          </span>
                        )}
                      </div>

                      {/* Info & Action area */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold text-[#9F2089] dark:text-[#F43397] uppercase tracking-wider line-clamp-1">
                              {p.brand || 'Shopio'} • {p.subcategory || p.category}
                            </span>
                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs flex-shrink-0">
                              {rec.matchScore}% Match
                            </span>
                          </div>

                          <h4
                            onClick={() => {
                              onClose();
                              onNavigate?.('product', { productId: p.id });
                            }}
                            className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-1 cursor-pointer hover:text-[#9F2089] transition-colors leading-tight"
                          >
                            {p.name}
                          </h4>

                          {/* Recommendation reason */}
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            💡 {rec.reason}
                          </p>
                        </div>

                        <div>
                          {/* Price */}
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                              ₹{p.price.toLocaleString()}
                            </span>
                            {p.mrp && p.mrp > p.price && (
                              <span className="text-[11px] text-gray-400 line-through">
                                ₹{p.mrp.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Quick buttons */}
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onNavigate?.('product', { productId: p.id });
                              }}
                              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-lg transition-colors"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onAddToCart?.(p, 1, p.colors?.[0] || 'Default', p.sizes?.[0] || '');
                                onShowToast?.(`Added "${p.name.slice(0, 20)}..." to cart 🛒`);
                              }}
                              className="px-2.5 py-1 bg-pink-50 dark:bg-pink-950/40 text-[#9F2089] dark:text-[#F43397] hover:bg-[#9F2089] hover:text-white text-[11px] font-bold rounded-lg transition-all"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky Bottom Bar: Total Outfit & CTA ── */}
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161F30] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                  Selected Outfit Total:
                </span>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  ₹{selectedTotal.toLocaleString()}
                </span>
                {totalSavings > 0 && (
                  <span className="text-xs text-[#038D63] font-bold">
                    (Save ₹{totalSavings.toLocaleString()})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto flex gap-2">
            <button
              type="button"
              onClick={handleAddCompleteLook}
              disabled={selectedItems.length === 0}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold rounded-2xl hover:opacity-95 transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <span>🛒</span>
              <span>Add Complete Look to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
