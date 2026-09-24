import { useState, useEffect } from 'react';
import { products } from '../data/products';

export default function RecentlyViewed({ currentProductId, onNavigate, onQuickView }) {
  const [viewedProducts, setViewedProducts] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sk_recently_viewed') || '[]');
      const filteredIds = stored.filter((id) => id !== currentProductId).slice(0, 8);
      const prods = filteredIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean);
      setViewedProducts(prods);
    } catch {
      setViewedProducts([]);
    }
  }, [currentProductId]);

  if (viewedProducts.length === 0) return null;

  return (
    <div className="mt-10 pt-6 border-t border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-base text-gray-800">Recently Viewed Items</h3>
          <p className="text-[11px] text-gray-400">Products you checked out recently</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('sk_recently_viewed');
            setViewedProducts([]);
          }}
          className="text-[11px] text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {viewedProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => onNavigate('product', { productId: p.id })}
            className="flex-shrink-0 w-40 bg-white rounded-2xl border border-gray-100 p-2.5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 relative mb-2">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {p.discount > 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md">
                    -{p.discount}%
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">{p.brand || 'ShopKart'}</p>
              <h4 className="text-xs font-semibold text-gray-800 line-clamp-1 leading-snug group-hover:text-[#3B5BDB] transition-colors">
                {p.name}
              </h4>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs font-black text-gray-900">₹{p.price?.toLocaleString()}</span>
              {onQuickView && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(p);
                  }}
                  className="text-[10px] font-bold text-[#3B5BDB] hover:underline"
                >
                  Quick View
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
