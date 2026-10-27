import { useState } from 'react';

const COUPON_CODES = {
  SHOPIO100: 100,
  LUCKY150: 150,
  SUPER20: 120,
  FREESHIP: 50,
  MEESHO100: 100,
  FIRST100: 100,
  SAVE50: 50,
  WELCOME50: 50,
  MAHASALE: 75,
};

export default function CartPage({
  items,
  onNavigate,
  onBack,
  onUpdateQuantity,
  onRemoveItem,
  onShowToast,
  onMoveToWishlist,
}) {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const itemTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const mrpTotal = items.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const discount = mrpTotal - itemTotal;
  const deliveryCharge = 0; // Shopio offers 100% Free Delivery!
  const platformFee = 0;
  const total = Math.max(0, itemTotal + deliveryCharge + platformFee - couponDiscount);

  const applyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).toUpperCase().trim();
    const disc = COUPON_CODES[code];
    if (disc) {
      setAppliedCoupon(code);
      setCouponDiscount(disc);
      onShowToast(`Coupon ${code} applied! ₹${disc} discount 🎉`);
      setCouponInput('');
    } else {
      onShowToast('Invalid coupon code. Try SHOPIO100 or SAVE50', 'error');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    setCouponDiscount(0);
    onShowToast('Coupon removed');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
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
          🛍️
        </div>
        <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-2">Your Shopio Cart is Empty!</h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
          Explore thousands of trendy fashion, electronics & home products at lowest wholesale prices!
        </p>
        <button
          onClick={onBack || (() => onNavigate('home'))}
          className="bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold px-8 py-3.5 rounded-2xl hover:opacity-95 shadow-md transition-all active:scale-95 text-sm"
        >
          Start Shopping Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
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
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">
            Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <span className="text-xs font-bold text-[#038D63] bg-green-50 dark:bg-gray-800 px-3 py-1 rounded-full hidden sm:inline-block">
          ✓ 100% Free Delivery on All Orders
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.color}-${item.size}`}
              className="bg-white dark:bg-[#161F30] rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-3 sm:p-4 hover:shadow-md transition-all"
            >
              <div className="flex gap-3 sm:gap-4">
                <div
                  className="w-20 sm:w-24 h-28 sm:h-32 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0 cursor-pointer"
                  onClick={() => onNavigate('product', { productId: item.product.id })}
                >
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3
                      className="font-bold text-gray-800 dark:text-gray-100 text-xs sm:text-sm cursor-pointer hover:text-[#9F2089] transition-colors line-clamp-2"
                      onClick={() => onNavigate('product', { productId: item.product.id })}
                    >
                      {item.product.name}
                    </h3>

                    {(item.color || item.size) && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.color && (
                          <span>
                            Color: <strong>{item.color}</strong>
                          </span>
                        )}
                        {item.color && item.size && ' · '}
                        {item.size && (
                          <span>
                            Size: <strong>{item.size}</strong>
                          </span>
                        )}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-black text-base text-gray-900 dark:text-white">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{(item.product.mrp * item.quantity).toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-[#038D63]">{item.product.discount}% OFF</span>
                    </div>

                    <p className="text-[11px] text-[#038D63] font-semibold mt-1 flex items-center gap-1">
                      <span>🚚</span> Free Delivery · 7-Day Return
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex-wrap gap-2">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-black text-gray-800 dark:text-gray-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          onMoveToWishlist
                            ? onMoveToWishlist(item.product)
                            : onRemoveItem(item.product.id);
                        }}
                        className="text-xs font-bold text-[#9F2089] dark:text-[#F43397] hover:underline"
                      >
                        Move to Wishlist
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-xs text-red-500 hover:text-red-600 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => onNavigate('listing')}
            className="text-[#9F2089] dark:text-[#F43397] text-xs font-bold hover:underline flex items-center gap-1 pt-2"
          >
            ← Continue Shopping on Shopio
          </button>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          {/* Coupon Box */}
          <div className="bg-white dark:bg-[#161F30] rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-1.5">
              <span>🏷️</span> Shopio Coupons
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs font-bold text-green-800">
                <span>✅ {appliedCoupon} applied (₹{couponDiscount} saved)</span>
                <button onClick={removeCoupon} className="text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (SHOPIO100)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none uppercase dark:bg-[#1E293B] dark:text-white"
                  />
                  <button
                    onClick={() => applyCoupon(couponInput)}
                    className="px-4 py-2 bg-[#9F2089] text-white font-bold text-xs rounded-xl hover:opacity-90"
                  >
                    Apply
                  </button>
                </div>
                <div className="mt-2.5 space-y-1">
                  {Object.entries(COUPON_CODES).map(([code, disc]) => (
                    <button
                      key={code}
                      onClick={() => applyCoupon(code)}
                      className="w-full text-left text-[11px] text-gray-500 hover:text-[#9F2089] py-0.5 flex justify-between"
                    >
                      <span className="font-mono font-bold text-[#9F2089] dark:text-[#F43397]">{code}</span>
                      <span>Save ₹{disc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-white dark:bg-[#161F30] rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-4">
              Price Details
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Total MRP ({items.length} items)</span>
                <span>₹{mrpTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#038D63] font-semibold">
                <span>Product Discount</span>
                <span>-₹{discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Delivery Charges</span>
                <span className="text-[#038D63] font-bold">FREE</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#038D63] font-semibold">
                  <span>Coupon Savings</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4">
              <div className="flex justify-between font-black text-base text-gray-900 dark:text-white">
                <span>Order Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-[#038D63] font-bold mt-1">
                🎉 You are saving ₹{(discount + couponDiscount).toLocaleString()} on this order!
              </p>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full mt-5 py-3.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold rounded-2xl hover:opacity-95 shadow-md active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>Continue to Checkout</span>
              <span>→</span>
            </button>

            <div className="flex items-center justify-center gap-3 mt-4 text-[10px] text-gray-400">
              <span>🔒 100% Safe Payments</span>
              <span>•</span>
              <span>🚚 Free Delivery</span>
              <span>•</span>
              <span>💵 COD Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}