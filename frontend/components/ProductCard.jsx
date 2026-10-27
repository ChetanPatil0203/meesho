export default function ProductCard({
  product,
  onNavigate,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  view = 'grid',
}) {
  const savings = product.mrp - product.price;

  if (view === 'list') {
    return (
      <div className="bg-white dark:bg-[#161F30] rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 hover:shadow-lg hover:border-pink-200 transition-all duration-300 group">
        <div
          className="relative flex-shrink-0 w-full sm:w-36 h-48 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => onNavigate('product', { productId: product.id })}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.badge && (
            <span className="absolute top-2 left-2 bg-[#9F2089] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
              {product.badge}
            </span>
          )}
          {product.discount > 40 && (
            <div className="absolute bottom-2 left-2 bg-gradient-to-r from-red-600 to-pink-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
              -{product.discount}% OFF
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#9F2089] dark:text-[#F43397] uppercase tracking-wider">
                {product.brand || 'Shopio Choice'}
              </span>
              <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-bold">
                ✓ S-Trusted
              </span>
            </div>

            <h3
              className="font-bold text-gray-800 dark:text-gray-100 text-sm line-clamp-2 cursor-pointer hover:text-[#9F2089] transition-colors leading-snug mt-1"
              onClick={() => onNavigate('product', { productId: product.id })}
            >
              {product.name}
            </h3>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-[#038D63] text-white rounded-md px-1.5 py-0.5 shadow-2xs">
                <span className="text-xs font-black">{product.rating}</span>
                <span className="text-[10px]">★</span>
              </div>
              <span className="text-xs text-gray-400">
                ({product.reviews >= 1000 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2 flex-wrap">
              <span className="text-xl font-black text-gray-900 dark:text-white">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
              <span className="text-xs font-extrabold text-[#038D63]">{product.discount}% off</span>
            </div>

            <p className="text-xs text-green-700 dark:text-green-400 font-semibold mt-1">
              🎉 You save ₹{savings.toLocaleString()}!
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <span>🚚</span> {product.delivery || 'Free Delivery'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex-wrap">
            <button
              onClick={() => onAddToCart(product)}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white text-xs font-bold rounded-xl hover:opacity-95 transition-all active:scale-95 shadow-xs flex items-center gap-1.5"
            >
              <span>🛒</span> Add to Cart
            </button>
            <button
              onClick={() => onNavigate('checkout', { buyNow: product })}
              className="px-4 sm:px-5 py-2 sm:py-2.5 border-2 border-orange-500 text-orange-600 text-xs font-bold rounded-xl hover:bg-orange-50 transition-colors active:scale-95"
            >
              Buy Now ⚡
            </button>
          </div>
        </div>

        <button
          onClick={() => onToggleWishlist(product.id)}
          className={`flex-shrink-0 self-start p-2 rounded-full transition-all duration-200 ${
            isWishlisted ? 'text-[#F43397] bg-pink-50 scale-110' : 'text-gray-300 hover:text-[#F43397] hover:bg-pink-50'
          }`}
        >
          <svg width="20" height="20" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#161F30] rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
      {/* Product Image Box */}
      <div
        className="relative aspect-[3/4] bg-gray-50 dark:bg-gray-800 overflow-hidden cursor-pointer"
        onClick={() => onNavigate('product', { productId: product.id })}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Shopio Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-[#9F2089] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
              {product.badge}
            </span>
          )}
          {product.discount >= 50 && (
            <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
              -{product.discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 dark:bg-[#1E293B] shadow-md flex items-center justify-center transition-all duration-200 z-10 ${
            isWishlisted
              ? 'text-[#F43397] scale-110'
              : 'text-gray-400 hover:text-[#F43397] group-hover:opacity-100 sm:opacity-0'
          }`}
        >
          <svg width="16" height="16" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg hover:bg-[#9F2089] hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1.5 whitespace-nowrap z-10"
          >
            <span>👁️</span> Quick View
          </button>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/70 flex items-center justify-center z-20">
            <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {product.brand || 'Shopio Choice'}
            </span>
            <span className="text-[9px] text-[#038D63] font-bold">Free Delivery</span>
          </div>

          <h3
            className="text-xs font-bold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug cursor-pointer hover:text-[#9F2089] transition-colors"
            onClick={() => onNavigate('product', { productId: product.id })}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-0.5 bg-[#038D63] text-white rounded px-1.5 py-0.2">
              <span className="text-[10px] font-black">{product.rating}</span>
              <span className="text-[9px]">★</span>
            </div>
            <span className="text-[10px] text-gray-400">
              ({product.reviews >= 1000 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
            <span className="text-[10px] sm:text-[11px] font-black text-[#038D63]">{product.discount}% off</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 mt-2.5 sm:mt-3 pt-2 border-t border-gray-50 dark:border-gray-800">
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="flex-1 py-1.5 px-1 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white text-[10px] sm:text-[11px] font-bold rounded-lg hover:opacity-95 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs text-center truncate"
          >
            Add to Cart
          </button>
          <button
            onClick={() => onNavigate('checkout', { buyNow: product })}
            className="flex-1 py-1.5 px-1 border border-orange-400 text-orange-600 text-[10px] sm:text-[11px] font-bold rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors active:scale-95 text-center truncate"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}