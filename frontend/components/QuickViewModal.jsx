import { useState } from 'react';

export default function QuickViewModal({ isOpen, onClose, product, onAddToCart, onNavigate }) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
    onClose();
    onNavigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-[75] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in relative flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-500 font-bold transition-all shadow-sm"
        >
          ✕
        </button>

        {/* Left Side: Images */}
        <div className="w-full md:w-1/2 p-5 bg-gray-50 flex flex-col justify-between">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-xs border border-gray-100 relative">
            <img
              src={images[selectedImg] || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.discount > 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`w-12 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImg === idx ? 'border-[#3B5BDB] scale-105' : 'border-gray-200 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{product.brand || 'ShopKart'}</p>
            <h2 className="text-base font-bold text-gray-900 leading-snug mt-0.5 line-clamp-2">{product.name}</h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2 py-0.5 rounded-md">
                <span>{product.rating || '4.2'}</span>
                <span className="text-yellow-500">★</span>
              </span>
              <span className="text-xs text-gray-400">
                ({(product.reviews || 450).toLocaleString()} ratings)
              </span>
              <span className="text-xs text-green-600 font-semibold ml-auto">Free Delivery 🚚</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-2xl font-black text-gray-900">₹{(product.price || 0).toLocaleString()}</span>
              {product.mrp && (
                <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-bold text-green-600">({product.discount}% OFF)</span>
              )}
            </div>

            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700 mb-1.5">
                  Color: <span className="text-[#3B5BDB] font-bold">{selectedColor}</span>
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`text-xs px-3 py-1 rounded-lg border font-medium transition-all ${
                        selectedColor === c
                          ? 'border-[#3B5BDB] bg-blue-50 text-[#3B5BDB]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {product.sizes && product.sizes.length > 1 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700 mb-1.5">
                  Size: <span className="text-[#3B5BDB] font-bold">{selectedSize || 'Select'}</span>
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`text-xs min-w-[36px] py-1 px-2.5 rounded-lg border font-bold transition-all ${
                        selectedSize === s
                          ? 'border-[#3B5BDB] bg-[#3B5BDB] text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-100 text-gray-600"
                >
                  −
                </button>
                <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-100 text-gray-600"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 bg-[#3B5BDB] text-white text-xs font-bold rounded-xl hover:bg-[#2F4AC4] transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1.5"
              >
                {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-2.5 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-all active:scale-95 shadow-xs"
              >
                ⚡ Buy Now
              </button>
            </div>
            <button
              onClick={() => {
                onClose();
                onNavigate('product', { productId: product.id });
              }}
              className="w-full text-center text-xs text-[#3B5BDB] font-semibold hover:underline pt-1"
            >
              View Full Product Specifications →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
