import { useState, useRef, useEffect } from 'react';
import { products } from '../data/products';
import ResellModal from '../components/ResellModal';
import WriteReviewModal from '../components/WriteReviewModal';
import RecentlyViewed from '../components/RecentlyViewed';











const reviews = [
{ name: 'Priya M.', rating: 5, date: '12 Mar 2025', text: 'Excellent quality! The fabric is soft and the print is vibrant. Sizing is accurate.', verified: true, helpful: 42 },
{ name: 'Deepa S.', rating: 4, date: '5 Mar 2025', text: 'Good product, fast delivery. Slight color variation from the photo but still beautiful.', verified: true, helpful: 28 },
{ name: 'Ritu K.', rating: 5, date: '28 Feb 2025', text: 'Love this kurti! Great value for money. Will order more colors.', verified: true, helpful: 19 }];


export default function ProductDetailPage({ productId, onNavigate, isWishlisted, onToggleWishlist, onAddToCart, onShowToast }) {
  const product = products.find((p) => p.id === productId) || products[0];
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [addedPulse, setAddedPulse] = useState(false);
  const [showResell, setShowResell] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [productReviews, setProductReviews] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`sk_rev_${product.id}`));
      return saved && saved.length > 0 ? saved : reviews;
    } catch {
      return reviews;
    }
  });

  const imgRef = useRef(null);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  // Track Recently Viewed Products
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sk_recently_viewed') || '[]');
      const updated = [product.id, ...stored.filter((id) => id !== product.id)].slice(0, 10);
      localStorage.setItem('sk_recently_viewed', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [product.id]);

  const handleAddReview = (newReview) => {
    const updated = [newReview, ...productReviews];
    setProductReviews(updated);
    try {
      localStorage.setItem(`sk_rev_${product.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAddToCart = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      onShowToast('Please select a size', 'error');
      return;
    }
    onAddToCart(product, quantity, selectedColor, selectedSize);
    onShowToast('Added to cart! 🛒');
    setAddedPulse(true);
    setTimeout(() => setAddedPulse(false), 600);
  };

  const handleCheckPincode = () => {
    if (pincode.length === 6) {
      setPincodeResult('✅ Delivery available by 14 Apr 2025 | Free delivery');
    } else {
      setPincodeResult('Please enter a valid 6-digit pincode');
    }
  };

  const handleCoupon = () => {
    if (coupon.toUpperCase() === 'FIRST100') {
      setCouponApplied(true);
      onShowToast('Coupon applied! ₹100 discount added 🎉');
    } else {
      onShowToast('Invalid coupon code', 'error');
    }
  };

  const finalPrice = couponApplied ? product.price - 100 : product.price;
  const savings = product.mrp - finalPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 pb-28 md:pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => onNavigate('home')} className="hover:text-[#3B5BDB] whitespace-nowrap">Home</button>
        <span>›</span>
        <button onClick={() => onNavigate('listing', { category: product.category })} className="hover:text-[#3B5BDB] whitespace-nowrap">{product.category}</button>
        <span>›</span>
        <span className="text-gray-700 font-medium line-clamp-1 whitespace-nowrap">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* ── Image Gallery ── */}
        <div className="space-y-3">
          {/* Main image with swipe dots */}
          <div ref={imgRef} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative"
          style={{ aspectRatio: '1 / 1' }}>
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300" />
            

            {/* Discount badge */}
            {product.discount > 0 &&
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-sm">
                -{product.discount}% OFF
              </div>
            }

            {/* Wishlist */}
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-200 ${isWishlisted ? 'text-red-500 scale-110' : 'text-gray-400'}`}>
              
              <svg width="20" height="20" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>

            {/* Prev/Next on desktop */}
            {product.images.length > 1 &&
            <>
                <button onClick={() => setSelectedImage((i) => Math.max(0, i - 1))}
              disabled={selectedImage === 0}
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 shadow rounded-full items-center justify-center text-gray-600 hover:bg-white disabled:opacity-30">
                  ‹
                </button>
                <button onClick={() => setSelectedImage((i) => Math.min(product.images.length - 1, i + 1))}
              disabled={selectedImage === product.images.length - 1}
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 shadow rounded-full items-center justify-center text-gray-600 hover:bg-white disabled:opacity-30">
                  ›
                </button>
              </>
            }

            {/* Mobile swipe dots */}
            {product.images.length > 1 &&
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                {product.images.map((_, i) =>
              <button key={i} onClick={() => setSelectedImage(i)}
              className={`h-1.5 rounded-full transition-all ${i === selectedImage ? 'bg-[#3B5BDB] w-5' : 'bg-gray-300 w-1.5'}`} />
              )}
              </div>
            }
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 &&
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {product.images.map((img, i) =>
            <button key={i} onClick={() => setSelectedImage(i)}
            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-[#3B5BDB] shadow-sm' : 'border-gray-200 opacity-70'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
            )}
            </div>
          }

          {/* Trust strip - desktop only */}
          <div className="hidden md:grid grid-cols-3 gap-2">
            {[['🚚', 'Free Delivery'], ['🔄', '7-day Returns'], ['🔒', 'Secure Pay']].map(([icon, label]) =>
            <div key={label} className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2">
                <span className="text-base">{icon}</span>
                <span className="text-xs font-medium text-gray-600">{label}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Product Info ── */}
        <div className="space-y-4">
          <div>
            <span className="inline-block text-xs bg-blue-50 text-[#3B5BDB] px-2.5 py-0.5 rounded-full font-semibold mb-2">{product.brand}</span>
            <h1 className="text-lg md:text-2xl font-bold text-gray-800 leading-snug">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-lg px-3 py-1">
                <span className="text-green-700 font-bold text-sm">{product.rating}</span>
                <span className="text-yellow-400">★</span>
              </div>
              <span className="text-sm text-gray-400">{product.reviews.toLocaleString()} ratings</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${product.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {product.inStock ? '● In Stock' : '● Out of Stock'}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-gray-900">₹{finalPrice.toLocaleString()}</span>
              <span className="text-base text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
              <span className="text-base font-bold text-green-600">{product.discount}% off</span>
            </div>
            <p className="text-sm text-green-600 font-semibold mt-1">You save ₹{savings.toLocaleString()}!</p>
            {couponApplied && <p className="text-green-600 text-xs mt-1 font-medium">✅ Coupon FIRST100 applied — ₹100 saved!</p>}
            <p className="text-xs text-gray-400 mt-2">Inclusive of all taxes · EMI from ₹{Math.round(product.price / 12)}/month</p>
          </div>

          {/* Offers */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-1.5">
              <span className="text-base">🏷️</span> Available Offers
            </h3>
            <div className="space-y-2">
              {['Bank Offer: 10% Instant Discount on HDFC Cards', 'Get FLAT ₹100 off on first order (Code: FIRST100)', 'Free Delivery on orders above ₹499'].map((offer) =>
              <div key={offer} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-green-500 flex-shrink-0 mt-0.5 font-bold">✓</span>
                  <span>{offer}</span>
                </div>
              )}
            </div>
          </div>

          {/* Color selector */}
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-2">
              Color: <span className="text-[#3B5BDB] font-bold">{selectedColor}</span>
            </h3>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((color) =>
              <button key={color} onClick={() => setSelectedColor(color)}
              className={`px-4 py-2 rounded-xl text-sm border-2 transition-all font-medium ${selectedColor === color ? 'border-[#3B5BDB] bg-blue-50 text-[#3B5BDB]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {color}
                </button>
              )}
            </div>
          </div>

          {/* Size selector */}
          {product.sizes.length > 1 &&
          <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-gray-700">
                  Size: {selectedSize ? <span className="text-[#3B5BDB] font-bold">{selectedSize}</span> : <span className="text-gray-400">Select</span>}
                </h3>
                <button className="text-xs text-[#3B5BDB] underline underline-offset-2">Size Guide</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) =>
              <button key={size} onClick={() => setSelectedSize(size)}
              className={`min-w-[44px] h-10 px-3 rounded-xl text-sm border-2 transition-all font-semibold ${selectedSize === size ? 'border-[#3B5BDB] bg-[#3B5BDB] text-white' : 'border-gray-200 text-gray-600 hover:border-[#3B5BDB] hover:text-[#3B5BDB]'}`}>
                    {size}
                  </button>
              )}
              </div>
            </div>
          }

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Quantity</h3>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden w-fit">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 text-xl font-light text-gray-600 transition-colors active:bg-gray-100">
                  −
                </button>
                <span className="w-12 text-center font-bold text-gray-800 text-sm">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 text-xl font-light text-gray-600 transition-colors active:bg-gray-100">
                  +
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-5">Max 10 per order</div>
          </div>

          {/* CTA — desktop only; mobile gets sticky bar */}
          <div className="hidden md:flex gap-3">
            <button onClick={handleAddToCart}
            className={`flex-1 py-3.5 bg-[#3B5BDB] text-white font-bold rounded-xl hover:bg-[#2F4AC4] transition-all flex items-center justify-center gap-2 ${addedPulse ? 'scale-95' : ''}`}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Add to Cart
            </button>
            <button onClick={() => onNavigate('checkout', { buyNow: product })}
            className="flex-1 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all active:scale-95">
              Buy Now ⚡
            </button>
          </div>

          {/* Resell and Earn Button */}
          <button
            type="button"
            onClick={() => setShowResell(true)}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95"
          >
            <span>💼</span> Resell this Product on WhatsApp & Earn Cash Margin
          </button>

          {/* Delivery checker */}
          <div className="border border-gray-200 rounded-2xl p-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
              <span>🚚</span> Check Delivery
            </h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter 6-digit pincode" maxLength={6} value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckPincode()}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-[#3B5BDB]" />
              <button onClick={handleCheckPincode}
              className="px-4 py-2.5 text-[#3B5BDB] font-bold text-sm border-2 border-[#3B5BDB] rounded-xl hover:bg-blue-50 transition-colors active:scale-95">
                Check
              </button>
            </div>
            {pincodeResult && <p className="text-xs mt-2 text-green-600 font-medium">{pincodeResult}</p>}
            <p className="text-xs text-gray-400 mt-2">🗓️ {product.delivery}</p>
          </div>

          {/* Coupon */}
          {!couponApplied &&
          <div className="border-2 border-dashed border-[#3B5BDB]/40 rounded-2xl p-4 bg-blue-50/50">
              <h3 className="font-semibold text-sm text-[#3B5BDB] mb-3 flex items-center gap-2">
                <span>🏷️</span> Apply Coupon
              </h3>
              <div className="flex gap-2">
                <input type="text" placeholder="Enter coupon code" value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              className="flex-1 border border-blue-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-[#3B5BDB] font-mono" />
                <button onClick={handleCoupon}
              className="px-4 py-2.5 bg-[#3B5BDB] text-white font-bold text-sm rounded-xl hover:bg-[#2F4AC4] transition-colors active:scale-95">
                  Apply
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">💡 Try <strong>FIRST100</strong> for ₹100 off</p>
            </div>
          }
          {couponApplied &&
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-sm font-bold text-green-700">Coupon FIRST100 Applied!</p>
                <p className="text-xs text-green-600">₹100 discount added to your order</p>
              </div>
            </div>
          }

          {/* Seller info */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Sold & fulfilled by</p>
                <p className="font-bold text-gray-800">{product.seller}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-yellow-400 text-xs">★</span>
                  <span className="text-xs text-gray-500">{product.sellerRating} seller rating</span>
                </div>
              </div>
              <div className="text-right text-xs text-gray-500 space-y-1">
                <p>✅ 7-day returns</p>
                <p>🔒 Genuine product</p>
                <p>📦 Packed carefully</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="mt-8">
        <div className="flex border-b border-gray-200 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {['description', 'specifications', 'reviews'].map((tab) =>
          <button key={tab} onClick={() => setActiveTab(tab)}
          className={`flex-shrink-0 px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px whitespace-nowrap ${activeTab === tab ? 'border-[#3B5BDB] text-[#3B5BDB]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab === 'reviews' ? `Reviews (${product.reviews.toLocaleString()})` : tab}
            </button>
          )}
        </div>

        <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 border-t-0 p-5 md:p-6">
          {activeTab === 'description' &&
          <div>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {['100% Genuine Product', 'Easy 7-day Returns', 'Fast & Free Delivery', 'Secure Payments'].map((h) =>
              <div key={h} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-xl px-3 py-2">
                    <span className="text-green-500 font-bold">✓</span> {h}
                  </div>
              )}
              </div>
            </div>
          }
          {activeTab === 'specifications' &&
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-gray-100">
              {Object.entries(product.specifications).map(([key, val], idx) =>
            <div key={key} className={`flex gap-4 px-4 py-3 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100 last:border-0`}>
                  <span className="text-xs text-gray-500 w-28 flex-shrink-0 font-medium">{key}</span>
                  <span className="text-xs font-semibold text-gray-800">{val}</span>
                </div>
            )}
            </div>
          }
          {activeTab === 'reviews' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-sm text-gray-800">Customer Ratings & Reviews</h4>
                  <p className="text-xs text-gray-500">Verified buyer ratings ({productReviews.length} reviews)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWriteReview(true)}
                  className="bg-[#3B5BDB] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#2F4AC4] transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span>✍️</span> Write a Review
                </button>
              </div>

              {productReviews.map((r, i) => (
                <div key={i} className="border-b border-gray-100 pb-5 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3B5BDB] to-[#6B4FBB] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {r.name?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <p className="font-semibold text-sm text-gray-800">{r.name}</p>
                        <span className="text-gray-400 text-xs">{r.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }, (_, j) => (
                            <span key={j} className={`text-sm ${j < r.rating ? 'text-yellow-400' : 'text-gray-200'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        {r.verified && (
                          <span className="text-green-600 text-[10px] bg-green-50 px-2 py-0.5 rounded-full font-medium">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                      {r.title && <p className="font-bold text-xs text-gray-800 mt-1">{r.title}</p>}
                      <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{r.text}</p>

                      {/* Attached review photos */}
                      {r.photos && r.photos.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {r.photos.map((ph, idx) => (
                            <img
                              key={idx}
                              src={ph}
                              alt=""
                              className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-xs"
                            />
                          ))}
                        </div>
                      )}

                      <button className="text-xs text-gray-400 mt-2 hover:text-gray-600">
                        👍 Helpful ({r.helpful || 1})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 &&
      <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">You may also like</h2>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {related.map((p) =>
          <div key={p.id} onClick={() => onNavigate('product', { productId: p.id })}
          className="flex-shrink-0 w-36 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group">
                <div className="aspect-square overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{p.name}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-sm font-bold text-gray-900">₹{p.price.toLocaleString()}</span>
                    <span className="text-[10px] text-green-600 font-semibold">{p.discount}% off</span>
                  </div>
                </div>
              </div>
          )}
          </div>
        </div>
      }

      {/* ── Recently Viewed Products ── */}
      <RecentlyViewed currentProductId={product.id} onNavigate={onNavigate} />

      {/* ── Mobile Sticky Bottom Bar ── */}
      <div className="fixed bottom-16 left-0 right-0 md:hidden z-30 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 safe-area-bottom">
        <div className="flex gap-2">
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`w-12 h-12 flex-shrink-0 rounded-xl border-2 flex items-center justify-center transition-all ${isWishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400'}`}>
            
            <svg width="20" height="20" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
          <button
            onClick={() => setShowResell(true)}
            className="w-12 h-12 flex-shrink-0 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center text-lg shadow-xs"
            title="Resell on WhatsApp"
          >
            💼
          </button>
          <button onClick={handleAddToCart}
          className={`flex-1 h-12 bg-[#3B5BDB] text-white font-bold rounded-xl hover:bg-[#2F4AC4] transition-all text-sm flex items-center justify-center gap-2 active:scale-95 ${addedPulse ? 'scale-95 bg-[#2F4AC4]' : ''}`}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Add to Cart
          </button>
          <button onClick={() => onNavigate('checkout', { buyNow: product })}
          className="flex-1 h-12 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all text-sm active:scale-95">
            Buy Now ⚡
          </button>
        </div>
      </div>

      {/* Resell Modal */}
      <ResellModal
        isOpen={showResell}
        onClose={() => setShowResell(false)}
        product={product}
        onShowToast={onShowToast}
      />

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        product={product}
        onSubmit={handleAddReview}
        onShowToast={onShowToast}
      />
    </div>);

}