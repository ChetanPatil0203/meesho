import { useState, useRef, useEffect } from 'react';
import { products } from '../data/products';
import ResellModal from '../components/ResellModal';
import WriteReviewModal from '../components/WriteReviewModal';
import RecentlyViewed from '../components/RecentlyViewed';
import ShopioStylistModal from '../components/ShopioStylistModal';
import VirtualTryOnModal from '../components/VirtualTryOnModal';
import { isStyleableProduct, styleRecommendationService } from '../services/styleRecommendationService';
import { isClothingCategorySupported } from '../services/virtualTryOnService';

const defaultReviews = [
  {
    name: 'Priya Mahajan',
    rating: 5,
    date: '12 Sep 2026',
    text: 'Fabric is so soft and comfortable! The floral print is vibrant and looks exactly like the photo. Fits true to size. Delivered in 2 days.',
    verified: true,
    helpful: 48,
  },
  {
    name: 'Sneha Deshmukh',
    rating: 4,
    date: '5 Sep 2026',
    text: 'Very good product at this wholesale price! Material is pure rayon, stitched well. Perfect for daily office wear.',
    verified: true,
    helpful: 32,
  },
  {
    name: 'Ritu Kulkarni',
    rating: 5,
    date: '28 Aug 2026',
    text: 'Ordered this for a family function, received so many compliments! Free COD delivery was fast.',
    verified: true,
    helpful: 24,
  },
];

export default function ProductDetailPage({
  productId,
  onNavigate,
  onBack,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onShowToast,
}) {
  const product = products.find((p) => p.id === productId) || products[0];
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('400001');
  const [pincodeResult, setPincodeResult] = useState('✅ Free Delivery available by Saturday | Cash on Delivery available');
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [showResell, setShowResell] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showStylist, setShowStylist] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [previewRecommendations, setPreviewRecommendations] = useState([]);
  const isClothing = isStyleableProduct(product);
  const canTryOn = isClothingCategorySupported(product);

  useEffect(() => {
    if (isClothing) {
      styleRecommendationService
        .getRecommendations({ productId: product.id })
        .then((res) => setPreviewRecommendations(res.recommendations || []))
        .catch(() => {});
    }
  }, [product.id, isClothing]);

  // Reviews from localStorage or default
  const [productReviews, setProductReviews] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`meesho_rev_${product.id}`));
      return saved && saved.length > 0 ? saved : defaultReviews;
    } catch {
      return defaultReviews;
    }
  });

  const imgRef = useRef(null);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  // Track Recently Viewed Products
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('meesho_recently_viewed') || '[]');
      const updated = [product.id, ...stored.filter((id) => id !== product.id)].slice(0, 10);
      localStorage.setItem('meesho_recently_viewed', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [product.id]);

  const handleAddReview = (newReview) => {
    const updated = [newReview, ...productReviews];
    setProductReviews(updated);
    try {
      localStorage.setItem(`meesho_rev_${product.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAddToCart = () => {
    if (product.sizes?.length > 1 && !selectedSize) {
      onShowToast('Please select a size', 'error');
      return;
    }
    onAddToCart(product, quantity, selectedColor, selectedSize);
    onShowToast(`"${product.name.slice(0, 25)}..." added to cart! 🛒`);
  };

  const handleBuyNow = () => {
    if (product.sizes?.length > 1 && !selectedSize) {
      onShowToast('Please select a size first', 'error');
      return;
    }
    onNavigate('checkout', {
      buyNow: product,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
  };

  const handleCheckPincode = () => {
    if (pincode.length === 6) {
      setPincodeResult(`✅ Free Delivery to ${pincode} by Saturday | Cash on Delivery available`);
      onShowToast('Delivery available for your pincode! 🚚');
    } else {
      setPincodeResult('⚠️ Please enter a valid 6-digit Indian pincode');
    }
  };

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || coupon).toUpperCase().trim();
    if (code === 'LUCKY150') {
      setAppliedDiscount(150);
      setAppliedCouponCode(code);
      onShowToast(`Lucky Wheel Coupon ${code} applied! ₹150 discount! 🎡🎉`);
    } else if (code === 'SUPER20') {
      const disc = Math.round(product.price * 0.20);
      setAppliedDiscount(disc);
      setAppliedCouponCode(code);
      onShowToast(`Coupon SUPER20 applied! ₹${disc} (20%) discount! 🎉`);
    } else if (code === 'FREESHIP') {
      setAppliedDiscount(50);
      setAppliedCouponCode(code);
      onShowToast(`Coupon FREESHIP applied! ₹50 delivery waiver! 🚚`);
    } else if (code === 'SHOPIO100' || code === 'FIRST100') {
      setAppliedDiscount(100);
      setAppliedCouponCode(code);
      onShowToast(`Coupon ${code} applied! ₹100 discount! 🎉`);
    } else if (code === 'SAVE50' || code === 'WELCOME50') {
      setAppliedDiscount(50);
      setAppliedCouponCode(code);
      onShowToast(`Coupon ${code} applied! ₹50 discount! 🎉`);
    } else if (code === 'MAHASALE') {
      const disc = Math.round(product.price * 0.15);
      setAppliedDiscount(disc);
      setAppliedCouponCode(code);
      onShowToast(`Coupon MAHASALE applied! ₹${disc} (15%) discount! 🎉`);
    } else {
      onShowToast('Invalid coupon code. Try LUCKY150, SHOPIO100 or SAVE50', 'error');
    }
  };

  const finalPrice = Math.max(0, product.price - appliedDiscount);
  const savings = product.mrp - finalPrice;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-5 pb-24 md:pb-10">
      {/* ── Top Bar: Back Button & Breadcrumbs ── */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
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
        <div className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto scrollbar-hide py-1">
          <button onClick={() => onNavigate('home')} className="hover:text-[#9F2089] whitespace-nowrap font-medium">
            Home
          </button>
          <span>›</span>
          <button
            onClick={() => onNavigate('listing', { category: product.category })}
            className="hover:text-[#9F2089] whitespace-nowrap font-medium"
          >
            {product.category}
          </button>
          <span>›</span>
          <span className="text-gray-800 dark:text-gray-200 font-bold line-clamp-1 whitespace-nowrap">
            {product.name}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
        {/* ── Left Column: Multi-Image Gallery ── */}
        <div className="space-y-4">
          <div
            ref={imgRef}
            className="bg-white dark:bg-[#161F30] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm relative aspect-[4/5]"
          >
            <img
              src={product.images?.[selectedImage] || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.discount > 0 && (
                <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-black px-3 py-1 rounded-xl shadow-md">
                  -{product.discount}% OFF
                </span>
              )}
              <span className="bg-[#9F2089] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow-sm">
                ✓ M-Trusted
              </span>
            </div>

            {/* Wishlist button */}
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-11 h-11 rounded-full bg-white/95 dark:bg-[#1E293B] shadow-lg flex items-center justify-center transition-all duration-200 ${
                isWishlisted ? 'text-[#F43397] scale-110' : 'text-gray-400 hover:text-[#F43397]'
              }`}
            >
              <svg width="22" height="22" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>

            {/* Carousel navigation buttons */}
            {product.images?.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((i) => Math.max(0, i - 1))}
                  disabled={selectedImage === 0}
                  className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-black/60 shadow-md rounded-full items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white disabled:opacity-30"
                >
                  ‹
                </button>
                <button
                  onClick={() => setSelectedImage((i) => Math.min(product.images.length - 1, i + 1))}
                  disabled={selectedImage === product.images.length - 1}
                  className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-black/60 shadow-md rounded-full items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white disabled:opacity-30"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images?.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 sm:w-20 h-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? 'border-[#9F2089] scale-102 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-2">
            {[
              ['🚚', 'Free Delivery', 'No hidden costs'],
              ['💵', 'Cash on Delivery', '100% Verified'],
              ['🔄', '7 Days Return', 'Doorstep pickup'],
            ].map(([icon, label, sub]) => (
              <div
                key={label}
                className="bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center"
              >
                <span className="text-lg sm:text-xl">{icon}</span>
                <p className="text-[11px] sm:text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5 sm:mt-1 leading-snug">{label}</p>
                <p className="text-[9px] sm:text-[10px] text-gray-400 leading-tight">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column: Product Info & Actions ── */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-pink-50 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397] px-3 py-0.5 rounded-full font-bold">
                {product.brand || 'Shopio Choice'}
              </span>
              <span className="text-xs text-[#038D63] font-semibold bg-green-50 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                Supplier: {product.seller || 'Verified Wholesaler'} (4.4★)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-snug">
              {product.name}
            </h1>

            {/* Rating pill & reviews */}
            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
              <div className="flex items-center gap-1 bg-[#038D63] text-white rounded-lg px-2.5 py-1 shadow-2xs">
                <span className="font-black text-sm">{product.rating}</span>
                <span className="text-xs">★</span>
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {product.reviews.toLocaleString()} Ratings & {productReviews.length} Reviews
              </span>
              <span className="text-xs font-bold text-[#038D63] bg-green-50 px-2 py-0.5 rounded-md">
                ● In Stock
              </span>
            </div>
          </div>

          {/* ── Price Block ── */}
          <div className="bg-gradient-to-r from-pink-50/60 via-purple-50/40 to-white dark:from-gray-800 dark:to-gray-800/40 rounded-3xl p-5 border border-pink-100 dark:border-gray-700">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                ₹{finalPrice.toLocaleString()}
              </span>
              <span className="text-lg text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
              <span className="text-sm font-black text-[#038D63]">{product.discount}% OFF</span>
            </div>

            <p className="text-sm text-[#038D63] font-bold mt-1">
              🎉 Total Savings: ₹{savings.toLocaleString()} (Direct Wholesale Price)
            </p>

            {appliedCouponCode && (
              <div className="mt-2 bg-green-50 border border-green-200 text-green-800 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center justify-between">
                <span>✅ Coupon {appliedCouponCode} applied — ₹{appliedDiscount} saved!</span>
                <button
                  onClick={() => {
                    setAppliedDiscount(0);
                    setAppliedCouponCode('');
                  }}
                  className="text-red-500 underline ml-2"
                >
                  Remove
                </button>
              </div>
            )}
            <p className="text-[11px] text-gray-400 mt-2">All taxes included · Free Shipping Nationwide</p>
          </div>

          {/* ── Color Selection ── */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                Color: <span className="text-[#9F2089] dark:text-[#F43397] font-black">{selectedColor}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                      selectedColor === c
                        ? 'border-[#9F2089] bg-pink-50 text-[#9F2089] dark:bg-gray-800 dark:border-[#F43397] dark:text-[#F43397]'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Size Selection ── */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Select Size:{' '}
                  <span className="text-[#9F2089] dark:text-[#F43397] font-black">{selectedSize || 'Choose'}</span>
                </p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs font-bold text-[#9F2089] dark:text-[#F43397] underline"
                >
                  📏 Size Chart
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[48px] h-11 px-3.5 rounded-xl text-xs font-black border-2 transition-all ${
                      selectedSize === s
                        ? 'border-[#9F2089] bg-[#9F2089] text-white shadow-xs'
                        : 'border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-[#9F2089]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Quantity Stepper ── */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Quantity:</span>
            <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-base hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
              >
                −
              </button>
              <span className="w-12 text-center text-xs font-black text-gray-800 dark:text-gray-100">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-base hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
              >
                +
              </button>
            </div>
            <span className="text-[11px] text-gray-400">(Max 10 per customer)</span>
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex gap-2 sm:gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 sm:py-3.5 px-2 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold rounded-xl sm:rounded-2xl hover:opacity-95 transition-all shadow-md active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 text-center cursor-pointer"
            >
              <span>🛒</span>
              <span className="truncate">Add to Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 sm:py-3.5 px-2 bg-[#FF8A00] hover:bg-[#E67E00] text-white font-extrabold rounded-xl sm:rounded-2xl transition-all shadow-md active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 text-center cursor-pointer"
            >
              <span>⚡</span>
              <span className="truncate">Buy Now</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              className={`px-3.5 sm:px-4 py-3 sm:py-3.5 border rounded-xl sm:rounded-2xl transition-all shadow-xs flex items-center justify-center text-sm font-bold cursor-pointer ${
                isWishlisted
                  ? 'border-pink-300 bg-pink-50 text-[#F43397] dark:bg-pink-950/40'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-300'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <span>{isWishlisted ? '❤️' : '🤍'}</span>
            </button>
          </div>

          {/* ── ✨ Try It On (AI Virtual Try-On) ── */}
          {canTryOn && (
            <button
              type="button"
              id="try-it-on-btn"
              onClick={() => setShowTryOn(true)}
              className="w-full py-3.5 sm:py-4 px-4 bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#F43397] hover:from-[#7D126C] hover:to-[#D81B80] text-white font-extrabold rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 active:scale-95 text-center group ring-2 ring-pink-300/50 dark:ring-pink-900/40 cursor-pointer"
            >
              <span className="text-base group-hover:scale-110 transition-transform">✨</span>
              <span>Try It On</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1">
                AI Fitting Room
              </span>
            </button>
          )}

          {/* ── ✨ Style This Item (AI Style Assistant) ── */}
          {isClothing && (
            <button
              type="button"
              onClick={() => setShowStylist(true)}
              className="w-full py-3 sm:py-3.5 px-3.5 bg-gradient-to-r from-purple-700 via-pink-600 to-rose-500 hover:from-purple-800 hover:to-pink-700 text-white font-extrabold rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 text-center group ring-2 ring-pink-200/50 dark:ring-pink-900/40 cursor-pointer"
            >
              <span className="text-base group-hover:scale-110 transition-transform">✨</span>
              <span>Style This Item</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1">
                AI Outfit
              </span>
            </button>
          )}

          {/* ── Resell with Margin Button ── */}
          <button
            type="button"
            onClick={() => setShowResell(true)}
            className="w-full py-3 px-3 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 text-white font-extrabold rounded-xl sm:rounded-2xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 text-center leading-normal"
          >
            <span>💼</span>
            <span>Resell this Product & Keep Profit Margin</span>
          </button>

          {/* ── Delivery Pincode Checker ── */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-white dark:bg-[#161F30]">
            <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-1.5">
              <span>🚚</span> Check Delivery & COD Availability
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleCheckPincode()}
                placeholder="Enter 6 digit pincode"
                className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white"
              />
              <button
                onClick={handleCheckPincode}
                className="px-4 py-2 bg-[#9F2089] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Check
              </button>
            </div>
            {pincodeResult && (
              <p className="text-xs font-bold text-[#038D63] mt-2 leading-relaxed">{pincodeResult}</p>
            )}
          </div>

          {/* ── Coupon Applicator ── */}
          {!appliedCouponCode && (
            <div className="border-2 border-dashed border-pink-200 dark:border-gray-700 rounded-2xl p-4 bg-pink-50/40 dark:bg-gray-800/40">
              <p className="text-xs font-extrabold text-[#9F2089] dark:text-[#F43397] mb-2 flex items-center gap-1.5">
                <span>🏷️</span> Apply Discount Coupon
              </p>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. SHOPIO100)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  className="flex-1 border border-pink-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs uppercase font-mono font-bold dark:bg-[#1E293B] dark:text-white"
                />
                <button
                  onClick={() => handleApplyCoupon(coupon)}
                  className="px-4 py-2 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white text-xs font-bold rounded-xl"
                >
                  Apply
                </button>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {['SHOPIO100', 'SAVE50', 'MAHASALE'].map((c) => (
                  <button
                    key={c}
                    onClick={() => handleApplyCoupon(c)}
                    className="text-[10px] font-bold bg-white dark:bg-gray-700 text-[#9F2089] dark:text-[#F43397] px-2.5 py-1 rounded-lg border border-pink-200 dark:border-gray-600 hover:bg-[#9F2089] hover:text-white transition-colors"
                  >
                    Tap to apply: <strong>{c}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Tabs: Specifications / Details ── */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-5 bg-white dark:bg-[#161F30]">
            <div className="flex border-b border-gray-100 dark:border-gray-800 mb-4">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-2.5 text-xs font-bold mr-6 border-b-2 transition-all ${
                  activeTab === 'description'
                    ? 'border-[#9F2089] text-[#9F2089] dark:text-[#F43397]'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 text-xs font-bold mr-6 border-b-2 transition-all ${
                  activeTab === 'specs'
                    ? 'border-[#9F2089] text-[#9F2089] dark:text-[#F43397]'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Specifications
              </button>
            </div>

            {activeTab === 'description' ? (
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description ||
                  'High quality product sourced directly from verified manufacturer. Made with premium fabric ensuring long durability, supreme softness, and easy maintenance. Wash care: Gentle machine or hand wash.'}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-xs">
                {Object.entries(product.specifications || { Fabric: 'Cotton Blend', Quality: '100% Tested' }).map(
                  ([k, v]) => (
                    <div key={k} className="bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">{k}</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">{v}</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* ── Customer Reviews Section ── */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-5 bg-white dark:bg-[#161F30]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Customer Reviews & Ratings</h3>
                <p className="text-xs text-gray-400">Verified purchases from buyers</p>
              </div>
              <button
                onClick={() => setShowWriteReview(true)}
                className="px-3 py-1.5 border border-[#9F2089] text-[#9F2089] text-xs font-bold rounded-xl hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors"
              >
                ✍️ Write Review
              </button>
            </div>

            {/* Star Distribution */}
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl mb-4">
              <div className="text-center">
                <span className="text-3xl font-black text-gray-900 dark:text-white">{product.rating}</span>
                <div className="text-yellow-400 text-xs mt-0.5">★★★★★</div>
                <span className="text-[10px] text-gray-400 mt-0.5 block">{product.reviews} total</span>
              </div>
              <div className="flex-1 space-y-1 text-[10px]">
                {[
                  [5, '72%'],
                  [4, '18%'],
                  [3, '6%'],
                  [2, '2%'],
                  [1, '2%'],
                ].map(([star, pct]) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-3 text-gray-500 font-bold">{star}★</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#038D63] h-full rounded-full" style={{ width: pct }} />
                    </div>
                    <span className="text-gray-400 w-6">{pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {productReviews.map((r, i) => (
                <div key={i} className="border-b border-gray-100 dark:border-gray-800 pb-3 last:border-none">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#038D63] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                        {r.rating} ★
                      </span>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{r.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{r.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{r.text}</p>
                  {r.verified && (
                    <span className="text-[10px] text-green-700 font-semibold mt-1 inline-block">
                      ✓ Verified Buyer
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Complete Your Look ✨ (AI Style Assistant On-Page Banner) ── */}
      {isClothing && (
        <section className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
          <div className="bg-gradient-to-r from-pink-50/90 via-purple-50/50 to-white dark:from-[#1E293B] dark:to-[#161F30] border border-pink-100 dark:border-gray-700/80 rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                    Complete Your Look ✨
                  </h2>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#9F2089] text-white shadow-2xs">
                    Shopio Stylist
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Curated complementary items matching this piece for a complete head-to-toe outfit.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStylist(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-center"
              >
                <span>✨</span>
                <span>Style This Item</span>
              </button>
            </div>

            {/* Quick Outfit Preview Grid */}
            {previewRecommendations.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5">
                {previewRecommendations.slice(0, 4).map((rec) => (
                  <div
                    key={rec.product.id}
                    onClick={() => setShowStylist(true)}
                    className="bg-white dark:bg-[#161F30] rounded-2xl border border-pink-100 dark:border-gray-700/80 p-2.5 shadow-2xs hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 mb-2">
                        <img
                          src={rec.product.image}
                          alt={rec.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-green-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-xs">
                          {rec.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                        {rec.product.name}
                      </p>
                      <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                        💡 {rec.reason}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-xs font-black text-gray-900 dark:text-white">
                        ₹{rec.product.price}
                      </span>
                      <span className="text-[10px] font-bold text-[#9F2089] dark:text-[#F43397] group-hover:underline">
                        Style →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4">
            Similar Products You Might Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <div
                key={p.id}
                onClick={() => onNavigate('product', { productId: p.id })}
                className="bg-white dark:bg-[#161F30] rounded-2xl border border-gray-100 dark:border-gray-800 p-3 shadow-xs hover:shadow-md cursor-pointer transition-all"
              >
                <img src={p.image} alt="" className="w-full aspect-[3/4] object-cover rounded-xl mb-2" />
                <p className="text-xs font-bold line-clamp-1 text-gray-800 dark:text-gray-200">{p.name}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-sm font-black text-gray-900 dark:text-white">₹{p.price}</span>
                  <span className="text-[10px] text-gray-400 line-through">₹{p.mrp}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Recently Viewed ── */}
      <RecentlyViewed currentProductId={product.id} onNavigate={onNavigate} />

      {/* ── Resell Modal ── */}
      {showResell && (
        <ResellModal
          isOpen={showResell}
          onClose={() => setShowResell(false)}
          product={product}
          onShowToast={onShowToast}
        />
      )}

      {/* ── Write Review Modal ── */}
      {showWriteReview && (
        <WriteReviewModal
          isOpen={showWriteReview}
          onClose={() => setShowWriteReview(false)}
          product={product}
          onSubmit={handleAddReview}
          onShowToast={onShowToast}
        />
      )}

      {/* ── Size Guide Modal ── */}
      {showSizeGuide && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="bg-white dark:bg-[#161F30] rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Standard Size Chart (Inches)</h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[280px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-400">
                    <th className="py-2">Size</th>
                    <th className="py-2">Bust / Chest</th>
                    <th className="py-2">Waist</th>
                    <th className="py-2">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {[
                    ['S', '36 in', '32 in', '42 in'],
                    ['M', '38 in', '34 in', '43 in'],
                    ['L', '40 in', '36 in', '44 in'],
                    ['XL', '42 in', '38 in', '44 in'],
                    ['XXL', '44 in', '40 in', '45 in'],
                  ].map(([sz, b, w, l]) => (
                    <tr key={sz} className="text-gray-700 dark:text-gray-200">
                      <td className="py-2.5 font-bold text-[#9F2089] dark:text-[#F43397]">{sz}</td>
                      <td className="py-2.5">{b}</td>
                      <td className="py-2.5">{w}</td>
                      <td className="py-2.5">{l}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-400 mt-4">
              Tip: If between sizes, we recommend choosing one size up for a relaxed fit.
            </p>
          </div>
        </div>
      )}

      {/* ── Shopio Stylist Modal ── */}
      <ShopioStylistModal
        isOpen={showStylist}
        onClose={() => setShowStylist(false)}
        product={product}
        onAddToCart={onAddToCart}
        onNavigate={onNavigate}
        onShowToast={onShowToast}
      />

      {/* ── ✨ Shopio AI Virtual Try-On Modal ── */}
      <VirtualTryOnModal
        isOpen={showTryOn}
        onClose={() => setShowTryOn(false)}
        product={product}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        isWishlisted={isWishlisted}
        onShowToast={onShowToast}
        onOpenSizeGuide={() => setShowSizeGuide(true)}
      />
    </div>
  );
}