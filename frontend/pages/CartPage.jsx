import { useState } from 'react';
















const COUPON_CODES = {
  FIRST100: 100,
  SAVE50: 50,
  WELCOME50: 50
};

export default function CartPage({ items, onNavigate, onUpdateQuantity, onRemoveItem, onShowToast }) {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const itemTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const mrpTotal = items.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const discount = mrpTotal - itemTotal;
  const deliveryCharge = itemTotal >= 499 ? 0 : 40;
  const platformFee = 20;
  const total = itemTotal + deliveryCharge + platformFee - couponDiscount;

  const applyCoupon = () => {
    const disc = COUPON_CODES[couponInput.toUpperCase()];
    if (disc) {
      setAppliedCoupon(couponInput.toUpperCase());
      setCouponDiscount(disc);
      onShowToast(`Coupon applied! ₹${disc} discount 🎉`);
    } else {
      onShowToast('Invalid coupon code', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty!</h2>
        <p className="text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <button onClick={() => onNavigate('home')} className="bg-[#3B5BDB] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#2F4AC4] transition-colors">
          Start Shopping
        </button>
      </div>);

  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Cart ({items.length} items)</h1>

      {/* Free Delivery Meter */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between text-xs mb-2">
          {itemTotal >= 499 ? (
            <span className="font-bold text-green-600 flex items-center gap-1.5">
              <span>🎉</span> Congratulations! You have unlocked <strong>FREE Delivery</strong>!
            </span>
          ) : (
            <span className="font-semibold text-gray-700 flex items-center gap-1.5">
              <span>🚚</span> Add <strong className="text-[#3B5BDB]">₹{499 - itemTotal}</strong> more to get <strong>FREE Delivery</strong>!
            </span>
          )}
          <span className="font-bold text-xs text-gray-500">
            ₹{itemTotal.toLocaleString()} / ₹499
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              itemTotal >= 499
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-[#3B5BDB] to-[#6B4FBB]'
            }`}
            style={{ width: `${Math.min(100, Math.round((itemTotal / 499) * 100))}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) =>
          <div key={`${item.product.id}-${item.color}-${item.size}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex gap-4">
                <div className="w-24 h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 cursor-pointer" onClick={() => onNavigate('product', { productId: item.product.id })}>
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 cursor-pointer hover:text-[#3B5BDB] transition-colors line-clamp-2" onClick={() => onNavigate('product', { productId: item.product.id })}>
                    {item.product.name}
                  </h3>
                  {(item.color || item.size) &&
                <p className="text-xs text-gray-400 mt-1">
                      {item.color && `Color: ${item.color}`}{item.color && item.size && ' | '}{item.size && `Size: ${item.size}`}
                    </p>
                }
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-bold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                    <span className="text-sm text-gray-400 line-through">₹{(item.product.mrp * item.quantity).toLocaleString()}</span>
                    <span className="text-xs font-semibold text-green-600">{item.product.discount}% off</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">{item.product.delivery}</p>

                  {/* Quantity control */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600">−</button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600">+</button>
                    </div>
                    <button onClick={() => onRemoveItem(item.product.id)} className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Remove</button>
                    <button className="text-sm text-[#3B5BDB] hover:underline font-medium">Move to Wishlist</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Continue shopping */}
          <button onClick={() => onNavigate('listing')} className="text-[#3B5BDB] text-sm font-medium hover:underline flex items-center gap-1 mt-2">
            ← Continue Shopping
          </button>
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">🏷️ Coupons & Offers</h3>
            {appliedCoupon ?
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <span className="text-green-700 text-sm font-medium">✅ {appliedCoupon} applied — ₹{couponDiscount} off</span>
                <button onClick={() => {setAppliedCoupon('');setCouponDiscount(0);}} className="text-xs text-red-500 hover:text-red-600">Remove</button>
              </div> :

            <div className="flex gap-2">
                <input type="text" placeholder="Enter coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3B5BDB]" />
                <button onClick={applyCoupon} className="px-4 py-2 text-[#3B5BDB] font-semibold text-sm border-2 border-[#3B5BDB] rounded-lg hover:bg-blue-50 transition-colors">Apply</button>
              </div>
            }
            <div className="mt-3 space-y-1">
              {Object.entries(COUPON_CODES).map(([code, disc]) =>
              <button key={code} onClick={() => {setCouponInput(code);}} className="w-full text-left text-xs text-gray-500 hover:text-[#3B5BDB] py-0.5">
                  {code} — ₹{disc} off
                </button>
              )}
            </div>
          </div>

          {/* Price details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-700 mb-4 uppercase text-xs tracking-wider">Price Details</h3>
            <div className="space-y-3">
              {[
              { label: `Price (${items.length} items)`, value: `₹${mrpTotal.toLocaleString()}` },
              { label: 'Discount', value: `-₹${discount.toLocaleString()}`, green: true },
              { label: 'Delivery Charges', value: deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`, green: deliveryCharge === 0 },
              { label: 'Platform Fee', value: `₹${platformFee}` },
              ...(couponDiscount > 0 ? [{ label: 'Coupon Discount', value: `-₹${couponDiscount}`, green: true }] : [])].
              map((row) =>
              <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-gray-600">{row.label}</span>
                  <span className={row.green ? 'text-green-600 font-medium' : 'text-gray-800'}>{row.value}</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              {discount > 0 && <p className="text-green-600 text-sm font-medium mt-1">🎉 You save ₹{(discount + couponDiscount).toLocaleString()} on this order!</p>}
            </div>

            <button onClick={() => onNavigate('checkout')} className="w-full mt-4 py-3.5 bg-[#3B5BDB] text-white font-bold rounded-xl hover:bg-[#2F4AC4] transition-colors flex items-center justify-center gap-2">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
              Proceed to Checkout
            </button>

            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-xs text-gray-400"><span>🔒</span> Secure Checkout</div>
              <div className="flex items-center gap-1 text-xs text-gray-400"><span>🚚</span> Free Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}