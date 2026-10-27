import { useState } from 'react';
import api from '../services/api';

const defaultAddresses = [
  {
    id: 1,
    name: 'Chetan Pazi',
    type: 'Home',
    address: 'Flat 402, Sai Shraddha Residency, Near Shivaji Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400028',
    phone: '+91 9876543210',
    default: true,
  },
  {
    id: 2,
    name: 'Chetan Pazi',
    type: 'Office',
    address: '5th Floor, Tower B, Business Tech Park, BKC',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    phone: '+91 9876543210',
    default: false,
  },
];

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery (COD)', icon: '💵', desc: 'Pay with cash or UPI at delivery doorstep' },
  { id: 'upi', label: 'UPI / QR Code', icon: '📱', desc: 'Google Pay, PhonePe, Paytm, BHIM' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay, Maestro' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'SBI, HDFC, ICICI, Axis Bank & all Indian banks' },
];

export default function CheckoutPage({
  onNavigate,
  onBack,
  cartItems = [],
  checkoutData,
  onShowToast,
  onClearCart,
}) {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('meesho_saved_addresses'));
      return saved && saved.length > 0 ? saved : defaultAddresses;
    } catch {
      return defaultAddresses;
    }
  });

  const [selectedAddress, setSelectedAddress] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    type: 'Home',
  });

  // Check if this is a direct "Buy Now" flow or normal Cart checkout
  const buyNowItem = checkoutData?.buyNow;
  const items = buyNowItem
    ? [
        {
          product: buyNowItem,
          quantity: checkoutData.quantity || 1,
          color: checkoutData.color || buyNowItem.colors?.[0] || 'Default',
          size: checkoutData.size || buyNowItem.sizes?.[0] || '',
        },
      ]
    : cartItems;

  const itemTotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const deliveryCharge = deliveryOption === 'express' ? 49 : 0;
  const total = itemTotal + deliveryCharge;

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.address || newAddr.pincode.length !== 6) {
      onShowToast?.('Please fill all required address fields correctly', 'error');
      return;
    }
    const created = {
      id: Date.now(),
      ...newAddr,
      default: false,
    };
    const updated = [created, ...addresses];
    setAddresses(updated);
    setSelectedAddress(created.id);
    localStorage.setItem('meesho_saved_addresses', JSON.stringify(updated));
    setShowAddAddressModal(false);
    onShowToast?.('New delivery address added! 📍');
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    const addr = addresses.find((a) => a.id === selectedAddress) || addresses[0];
    const orderId = `SHP-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrderObj = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      product: items[0]?.product?.name || 'Shopio Product',
      amount: total,
      status: 'Processing',
      qty: items.reduce((sum, i) => sum + i.quantity, 0),
      image: items[0]?.product?.image,
      items: items.map((i) => ({
        id: i.product?.id,
        name: i.product?.name,
        price: i.product?.price,
        image: i.product?.image,
        quantity: i.quantity,
        color: i.color,
        size: i.size,
      })),
      address: addr,
      paymentMethod: selectedPayment.toUpperCase(),
      deliveryOption,
    };

    // Save to localStorage under meesho_orders
    try {
      const existing = JSON.parse(localStorage.getItem('meesho_orders') || '[]');
      localStorage.setItem('meesho_orders', JSON.stringify([newOrderObj, ...existing]));
    } catch {
      // ignore
    }

    // Try backend API if server running
    try {
      await api.createOrder({
        totalAmount: total,
        address: addr,
        items: newOrderObj.items,
        paymentMethod: selectedPayment.toUpperCase(),
      });
    } catch {
      // ignore API failure, local order is saved
    }

    // If it was cart checkout, clear cart
    if (!buyNowItem && onClearCart) {
      onClearCart();
    }

    setProcessing(false);
    onShowToast?.('Order placed successfully! 🎉');
    onNavigate('order-success', {
      orderId,
      total,
      address: addr,
      items: newOrderObj.items,
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">No items to checkout</h2>
        <p className="text-gray-400 text-sm mb-6">Please add items to your cart first.</p>
        <button
          onClick={onBack || (() => onNavigate('home'))}
          className="bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-bold px-6 py-2.5 rounded-xl text-sm"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Delivery Address', shortLabel: 'Address' },
    { num: 2, label: 'Delivery Speed', shortLabel: 'Speed' },
    { num: 3, label: 'Payment', shortLabel: 'Payment' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 md:pb-16">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <button
          onClick={() => {
            if (step > 1) {
              setStep(step - 1);
            } else if (onBack) {
              onBack();
            } else {
              onNavigate(buyNowItem ? 'product' : 'cart', { productId: buyNowItem?.id });
            }
          }}
          title={step > 1 ? 'Previous Step' : 'Go Back (मागे जा)'}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-[#161F30] border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-[#9F2089] hover:border-[#9F2089] dark:hover:text-[#F43397] dark:hover:border-[#F43397] transition-all shadow-xs active:scale-95 group flex-shrink-0"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">{step > 1 ? 'Previous Step' : 'Back'}</span>
        </button>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white truncate">Secure Checkout</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center mb-5 sm:mb-8 bg-white dark:bg-[#161F30] p-2.5 sm:p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black transition-all flex-shrink-0 ${
                  step >= s.num
                    ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span
                className={`text-[11px] sm:text-xs font-bold truncate ${
                  step >= s.num ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                }`}
              >
                <span className="hidden sm:inline">{s.label}</span>
                <span className="inline sm:hidden">{s.shortLabel}</span>
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1.5 sm:mx-3 transition-colors ${
                  step > s.num ? 'bg-[#9F2089]' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Steps */}
        <div className="lg:col-span-2 space-y-4">
          {/* STEP 1: Address Selection */}
          {step === 1 && (
            <div className="bg-white dark:bg-[#161F30] rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="font-black text-sm sm:text-base text-gray-800 dark:text-gray-100">
                  Select Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="text-xs font-bold text-[#9F2089] dark:text-[#F43397] border border-[#9F2089] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors"
                >
                  + Add New Address
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                      selectedAddress === addr.id
                        ? 'border-[#9F2089] bg-pink-50/40 dark:bg-gray-800/80 shadow-xs'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="mt-1 accent-[#9F2089]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-800 dark:text-gray-100">{addr.name}</span>
                          <span className="text-[10px] bg-pink-100 dark:bg-gray-700 text-[#9F2089] dark:text-[#F43397] font-bold px-2 py-0.5 rounded-md">
                            {addr.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                          {addr.address}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">📞 {addr.phone}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-black rounded-xl hover:opacity-95 shadow-md text-sm transition-all"
              >
                Deliver to this Address →
              </button>
            </div>
          )}

          {/* STEP 2: Delivery Options */}
          {step === 2 && (
            <div className="bg-white dark:bg-[#161F30] rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
              <h2 className="font-black text-sm sm:text-base text-gray-800 dark:text-gray-100 mb-4">
                Choose Delivery Speed
              </h2>

              <div className="space-y-3 mb-6">
                <label
                  className={`block border-2 rounded-2xl p-3 sm:p-4 cursor-pointer transition-all ${
                    deliveryOption === 'standard'
                      ? 'border-[#9F2089] bg-pink-50/40 dark:bg-gray-800/80 shadow-xs'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryOption === 'standard'}
                        onChange={() => setDeliveryOption('standard')}
                        className="accent-[#9F2089]"
                      />
                      <div>
                        <div className="font-bold text-sm text-gray-800 dark:text-gray-100 flex items-center gap-2">
                          <span>Standard Delivery</span>
                          <span className="text-[10px] bg-green-50 text-[#038D63] font-bold px-2 py-0.5 rounded-full">
                            FREE
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Estimated delivery by Saturday</p>
                      </div>
                    </div>
                    <span className="font-black text-sm text-[#038D63]">₹0</span>
                  </div>
                </label>

                <label
                  className={`block border-2 rounded-2xl p-3 sm:p-4 cursor-pointer transition-all ${
                    deliveryOption === 'express'
                      ? 'border-[#9F2089] bg-pink-50/40 dark:bg-gray-800/80 shadow-xs'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryOption === 'express'}
                        onChange={() => setDeliveryOption('express')}
                        className="accent-[#9F2089]"
                      />
                      <div>
                        <div className="font-bold text-sm text-gray-800 dark:text-gray-100 flex items-center gap-2">
                          <span>⚡ Express Priority Delivery</span>
                          <span className="text-[10px] bg-yellow-50 text-orange-600 font-bold px-2 py-0.5 rounded-full">
                            Fastest
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Delivered within 24–48 Hours</p>
                      </div>
                    </div>
                    <span className="font-black text-sm text-gray-800 dark:text-gray-100">₹49</span>
                  </div>
                </label>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-3.5 sm:px-5 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs flex-shrink-0"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-black rounded-xl hover:opacity-95 shadow-md text-xs sm:text-sm"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Options */}
          {step === 3 && (
            <div className="bg-white dark:bg-[#161F30] rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
              <h2 className="font-black text-sm sm:text-base text-gray-800 dark:text-gray-100 mb-4">
                Select Payment Method
              </h2>

              <div className="space-y-3 mb-6">
                {paymentMethods.map((pm) => (
                  <label
                    key={pm.id}
                    className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                      selectedPayment === pm.id
                        ? 'border-[#9F2089] bg-pink-50/40 dark:bg-gray-800/80 shadow-xs'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === pm.id}
                        onChange={() => setSelectedPayment(pm.id)}
                        className="mt-1 accent-[#9F2089]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{pm.icon}</span>
                          <span className="font-bold text-sm text-gray-800 dark:text-gray-100">{pm.label}</span>
                          {pm.id === 'cod' && (
                            <span className="text-[10px] bg-green-50 text-[#038D63] font-bold px-2 py-0.2 rounded-full">
                              Most Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{pm.desc}</p>

                        {/* Extra fields for UPI */}
                        {selectedPayment === 'upi' && pm.id === 'upi' && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                              Enter UPI ID or Number
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. mobile@paytm or name@okaxis"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white"
                            />
                            <div className="flex gap-2 mt-2">
                              {['@okaxis', '@paytm', '@ybl', '@ibl'].map((ext) => (
                                <button
                                  key={ext}
                                  type="button"
                                  onClick={() => setUpiId((prev) => (prev ? prev.split('@')[0] + ext : 'chetan' + ext))}
                                  className="text-[10px] bg-white dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                                >
                                  {ext}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-3.5 sm:px-5 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs flex-shrink-0"
                >
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-black rounded-xl hover:opacity-95 shadow-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 disabled:opacity-50"
                >
                  {processing ? (
                    <span className="animate-spin">🔄 Placing Order...</span>
                  ) : (
                    <>
                      <span className="truncate">Place Order · ₹{total.toLocaleString()}</span>
                      <span>✓</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Order Summary */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#161F30] rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-4 sm:p-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-4">
              Items in Order ({items.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 border-b border-gray-100 dark:border-gray-800 pb-3 last:border-none">
                  <img
                    src={item.product?.image}
                    alt=""
                    className="w-14 h-16 object-cover rounded-xl bg-gray-50 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-100 line-clamp-1">{item.product?.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ''}
                    </p>
                    <p className="text-xs font-black text-gray-900 dark:text-white mt-1">
                      ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Items Subtotal</span>
                <span>₹{itemTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Delivery Charge</span>
                <span className={deliveryCharge === 0 ? 'text-[#038D63] font-bold' : ''}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between font-black text-base text-gray-900 dark:text-white">
                <span>To Pay</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-pink-50 dark:bg-gray-800 p-4 rounded-2xl text-xs text-[#9F2089] dark:text-pink-300 font-semibold space-y-1">
            <p>✓ 100% Purchase Protection</p>
            <p>✓ Safe & Encrypted Transactions</p>
            <p>✓ Hassle-Free 7 Days Return Guarantee</p>
          </div>
        </div>
      </div>

      {/* ── Add New Address Modal ── */}
      {showAddAddressModal && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs"
          onClick={() => setShowAddAddressModal(false)}
        >
          <div
            className="bg-white dark:bg-[#161F30] rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-sm sm:text-base text-gray-800 dark:text-gray-100">Add New Delivery Address</h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chetan Pazi"
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">House No. / Street Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Flat/House No., Building Name, Street, Landmark"
                  value={newAddr.address}
                  onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Pincode *</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="e.g. 400001"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Address Type</label>
                <div className="flex gap-2">
                  {['Home', 'Office'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAddr({ ...newAddr, type: t })}
                      className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                        newAddr.type === t
                          ? 'border-[#9F2089] bg-pink-50 text-[#9F2089] dark:bg-gray-800 dark:text-[#F43397]'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-bold rounded-xl text-xs"
                >
                  Save Address & Proceed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}