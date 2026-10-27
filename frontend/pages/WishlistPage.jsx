import { products } from '../data/products';

export default function WishlistPage({ wishlist, onNavigate, onBack, onToggleWishlist, onAddToCart }) {
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="flex justify-start mb-6">
          <button
            onClick={onBack || (() => onNavigate('home'))}
            title="Go Back (मागे जा)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#161F30] border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-[#9F2089] hover:border-[#9F2089] dark:hover:text-[#F43397] dark:hover:border-[#F43397] transition-all shadow-xs active:scale-95 group"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back</span>
          </button>
        </div>
        <div className="w-24 h-24 bg-pink-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
          ❤️
        </div>
        <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-2">Your Wishlist is Empty!</h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
          Save your favourite styles, kurtis, sarees, electronics & accessories to buy them later.
        </p>
        <button
          onClick={onBack || (() => onNavigate('home'))}
          className="bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold px-8 py-3.5 rounded-2xl hover:opacity-95 shadow-md transition-all active:scale-95 text-sm"
        >
          Discover Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
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
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              My Wishlist ({wishlistedProducts.length})
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Items you have saved to purchase later
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-[#9F2089] dark:text-[#F43397] hover:underline hidden sm:inline-block"
        >
          Explore More Products →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wishlistedProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-[#161F30] rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
          >
            <div
              className="relative aspect-[3/4] bg-gray-50 dark:bg-gray-800 overflow-hidden cursor-pointer"
              onClick={() => onNavigate('product', { productId: p.id })}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {p.discount >= 40 && (
                <div className="absolute bottom-2 left-2 bg-gradient-to-r from-red-600 to-pink-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                  {p.discount}% OFF
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(p.id);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 dark:bg-[#1E293B] shadow-sm flex items-center justify-center text-[#F43397] hover:scale-110 transition-transform"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
            </div>

            <div className="p-3 flex flex-col flex-1 justify-between">
              <div>
                <h3
                  className="text-xs font-bold text-gray-800 dark:text-gray-100 line-clamp-2 cursor-pointer hover:text-[#9F2089]"
                  onClick={() => onNavigate('product', { productId: p.id })}
                >
                  {p.name}
                </h3>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="font-black text-sm text-gray-900 dark:text-white">
                    ₹{p.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 line-through">₹{p.mrp.toLocaleString()}</span>
                </div>
                <p className="text-[10px] font-bold text-[#038D63] mt-0.5">Free Delivery</p>
              </div>

              <button
                onClick={() => {
                  onAddToCart(p);
                  onToggleWishlist(p.id);
                }}
                disabled={!p.inStock}
                className="w-full mt-3 py-2 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-2xs transition-all disabled:opacity-40"
              >
                Move to Cart 🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}