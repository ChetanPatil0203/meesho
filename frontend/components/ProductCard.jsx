










const badgeColors = {
  'Best Seller': 'bg-orange-500',
  'Top Rated': 'bg-yellow-500',
  'New Launch': 'bg-green-500',
  'New': 'bg-green-500',
  'Trending': 'bg-purple-500',
  '60% OFF': 'bg-red-500'
};

export default function ProductCard({ product, onNavigate, isWishlisted, onToggleWishlist, onAddToCart, onQuickView, view = 'grid' }) {
  const savings = product.mrp - product.price;

  if (view === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-all duration-200 group">
        <div
          className="relative flex-shrink-0 w-36 h-44 bg-gray-50 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => onNavigate('product', { productId: product.id })}>
          
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {product.badge &&
          <span className={`absolute top-2 left-2 ${badgeColors[product.badge] || 'bg-[#3B5BDB]'} text-white text-[9px] font-bold px-2 py-0.5 rounded-full`}>
              {product.badge}
            </span>
          }
          {product.discount > 50 &&
          <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
              -{product.discount}%
            </div>
          }
        </div>
        <div className="flex-1 min-w-0 py-1">
          <p className="text-xs text-gray-400 mb-0.5">{product.brand}</p>
          <h3 className="font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-[#3B5BDB] transition-colors leading-snug"
          onClick={() => onNavigate('product', { productId: product.id })}>
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5 bg-green-50 border border-green-200 rounded-md px-2 py-0.5">
              <span className="text-green-700 text-xs font-bold">{product.rating}</span>
              <span className="text-yellow-500 text-xs">★</span>
            </div>
            <span className="text-xs text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-black text-gray-900">₹{product.price.toLocaleString()}</span>
            <span className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
            <span className="text-sm font-bold text-green-600">{product.discount}% off</span>
          </div>
          <p className="text-xs text-green-600 font-medium mt-0.5">You save ₹{savings.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">🚚 {product.delivery}</p>
          <div className="flex items-center gap-2 mt-3">
            <button onClick={() => onAddToCart(product)}
            className="px-5 py-2 bg-[#3B5BDB] text-white text-sm font-bold rounded-xl hover:bg-[#2F4AC4] transition-colors active:scale-95">
              Add to Cart
            </button>
            <button onClick={() => onNavigate('product', { productId: product.id })}
            className="px-5 py-2 border-2 border-orange-500 text-orange-500 text-sm font-bold rounded-xl hover:bg-orange-50 transition-colors active:scale-95">
              Buy Now
            </button>
          </div>
        </div>
        <button onClick={() => onToggleWishlist(product.id)}
        className={`flex-shrink-0 self-start mt-1 p-2 rounded-full transition-all duration-200 ${isWishlisted ? 'text-red-500 bg-red-50 scale-110' : 'text-gray-300 hover:text-red-400 hover:bg-red-50'}`}>
          <svg width="18" height="18" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>);

  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden cursor-pointer flex-shrink-0"
      onClick={() => onNavigate('product', { productId: product.id })}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

        {product.badge &&
        <span className={`absolute top-2 left-2 ${badgeColors[product.badge] || 'bg-[#3B5BDB]'} text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm`}>
            {product.badge}
          </span>
        }

        {product.discount > 50 && !product.badge &&
        <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
            -{product.discount}%
          </div>
        }

        <button
          onClick={(e) => {e.stopPropagation();onToggleWishlist(product.id);}}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-200 ${
          isWishlisted ? 'text-red-500 scale-110' : 'text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100'}`
          }>
          
          <svg width="15" height="15" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>

        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs text-gray-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md hover:bg-[#3B5BDB] hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1 whitespace-nowrap"
          >
            <span>👁️</span> Quick View
          </button>
        )}

        {!product.inStock &&
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        }
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] text-gray-400 mb-0.5 font-medium">{product.brand}</p>
        <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug cursor-pointer hover:text-[#3B5BDB] transition-colors flex-1"
        onClick={() => onNavigate('product', { productId: product.id })}>
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex items-center gap-0.5 bg-green-50 border border-green-100 rounded px-1.5 py-0.5">
            <span className="text-green-700 text-[10px] font-bold">{product.rating}</span>
            <span className="text-yellow-500 text-[10px]">★</span>
          </div>
          <span className="text-[10px] text-gray-400">({product.reviews >= 1000 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews})</span>
        </div>

        <div className="flex items-baseline gap-1 mt-1.5 flex-wrap">
          <span className="text-sm font-black text-gray-900">₹{product.price.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
          <span className="text-[10px] font-bold text-green-600">{product.discount}% off</span>
        </div>

        <p className="text-[10px] text-gray-400 mt-0.5">🚚 {product.delivery}</p>

        {/* Actions */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="flex-1 py-1.5 bg-[#3B5BDB] text-white text-[11px] font-bold rounded-lg hover:bg-[#2F4AC4] transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
            
            Add to Cart
          </button>
          <button
            onClick={() => onNavigate('product', { productId: product.id })}
            className="flex-1 py-1.5 border border-orange-400 text-orange-500 text-[11px] font-bold rounded-lg hover:bg-orange-50 transition-colors active:scale-95">
            
            Buy Now
          </button>
        </div>
      </div>
    </div>);

}