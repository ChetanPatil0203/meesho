import { products } from '../data/products';









export default function WishlistPage({ wishlist, onNavigate, onToggleWishlist, onAddToCart }) {
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-7xl mb-4">❤️</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty!</h2>
        <p className="text-gray-400 mb-6">Save your favourite items here and shop them later.</p>
        <button onClick={() => onNavigate('home')} className="bg-[#3B5BDB] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#2F4AC4] transition-colors">
          Discover Products
        </button>
      </div>);

  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
          <p className="text-sm text-gray-400 mt-0.5">{wishlistedProducts.length} items saved</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wishlistedProducts.map((p) =>
        <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden cursor-pointer" onClick={() => onNavigate('product', { productId: p.id })}>
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {p.discount >= 40 &&
            <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                  {p.discount}% OFF
                </div>
            }
              <button
              onClick={(e) => {e.stopPropagation();onToggleWishlist(p.id);}}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-red-500 hover:scale-110 transition-transform">
              
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
              {/* Price drop badge */}
              <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                Price Drop!
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-xs font-medium text-gray-800 line-clamp-2 cursor-pointer hover:text-[#3B5BDB]" onClick={() => onNavigate('product', { productId: p.id })}>{p.name}</h3>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="font-bold text-sm text-gray-900">₹{p.price.toLocaleString()}</span>
                <span className="text-xs text-gray-400 line-through">₹{p.mrp.toLocaleString()}</span>
              </div>
              <p className={`text-xs mt-1 font-medium ${p.inStock ? 'text-green-600' : 'text-red-500'}`}>{p.inStock ? 'In Stock' : 'Out of Stock'}</p>
              <button
              onClick={() => onAddToCart(p)}
              disabled={!p.inStock}
              className="w-full mt-2 py-1.5 bg-[#3B5BDB] text-white text-xs font-semibold rounded-lg hover:bg-[#2F4AC4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              
                Move to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>);

}