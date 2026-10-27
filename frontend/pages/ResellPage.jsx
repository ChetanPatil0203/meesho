import { useState, useId } from 'react';
import { products } from '../data/products';
import ResellModal from '../components/ResellModal';
import { triggerConfetti } from '../utils/confetti';

export default function ResellPage({ onNavigate, onBack, onShowToast, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dailyOrders, setDailyOrders] = useState(3);
  const [marginPerItem, setMarginPerItem] = useState(150);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'calculator' | 'bank' | 'guide'

  // Bank payout setup state stored in localStorage
  const [bankDetails, setBankDetails] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem('shopio_reseller_bank')) || {
          accountHolder: 'Pooja Kadam',
          bankName: 'State Bank of India',
          accountNumber: '•••• •••• 8921',
          ifsc: 'SBIN0001234',
          upiId: 'pooja@sbi',
          pendingMargin: 2450,
          totalWithdrawn: 14800,
        }
      );
    } catch {
      return {
        accountHolder: '',
        bankName: '',
        accountNumber: '',
        ifsc: '',
        upiId: '',
        pendingMargin: 2450,
        totalWithdrawn: 14800,
      };
    }
  });

  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState(bankDetails);

  // Form input unique IDs for accessibility
  const accountHolderInputId = useId();
  const bankNameInputId = useId();
  const accountNumberInputId = useId();
  const ifscInputId = useId();
  const upiIdInputId = useId();

  // Calculated potential earnings
  const monthlyProfit = dailyOrders * marginPerItem * 30;

  const categories = ['All', 'Women', 'Men', 'Electronics', 'Footwear', 'Accessories'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleSaveBank = (e) => {
    e.preventDefault();
    setBankDetails(bankForm);
    localStorage.setItem('shopio_reseller_bank', JSON.stringify(bankForm));
    setIsEditingBank(false);
    onShowToast?.('Bank & UPI details saved successfully! 🏦');
  };

  const handleWithdraw = () => {
    if (bankDetails.pendingMargin <= 0) {
      onShowToast?.('No pending margin available for withdrawal.', 'error');
      return;
    }
    const amount = bankDetails.pendingMargin;
    const updated = {
      ...bankDetails,
      pendingMargin: 0,
      totalWithdrawn: bankDetails.totalWithdrawn + amount,
    };
    setBankDetails(updated);
    localStorage.setItem('shopio_reseller_bank', JSON.stringify(updated));
    triggerConfetti(2500);
    onShowToast?.(`🎉 ₹${amount.toLocaleString()} withdrawal request sent to ${bankDetails.upiId || bankDetails.bankName}!`);
  };

  const handleShareProduct = (prod) => {
    const custPrice = prod.price + 150;
    const shareText = `🛍️ *Special Offer from My Online Boutique!*\n\n*${prod.name}*\n✨ Brand Quality: ${prod.brand || 'Guaranteed'}\n⭐ Rating: ${prod.rating} / 5\n💰 Special Deal Price: *₹${custPrice}*\n🚚 *100% Free Doorstep Delivery & Cash on Delivery Available!*\n🔄 7 Days Easy Replacement Guaranteed\n\n👉 *Reply directly with your address and size to place your order!*`;
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    onShowToast?.(`Catalog for "${prod.name}" ready to share on WhatsApp! 📲`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F19] text-[#1E293B] dark:text-[#F8FAFC] pb-16">
      {/* ── Top Hero Banner ── */}
      <section className="bg-gradient-to-r from-purple-950 via-[#7D126C] to-[#9F2089] text-white pt-6 pb-12 px-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-4 relative z-10">
          <button
            onClick={onBack || (() => onNavigate('home'))}
            title="Go Back (मागे जा)"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all active:scale-95 backdrop-blur-md shadow-xs group"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back to Shopping</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-950 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-3 shadow-md">
              <span>💼</span> Zero Investment Business
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Start Your Online Business & Earn <span className="text-yellow-300">₹25,000+</span> Monthly!
            </h1>
            <p className="text-sm sm:text-base text-pink-100 mt-3 leading-relaxed">
              शॉपिओ सोबत स्वतःचा रीसेलिंग व्यवसाय सुरू करा. व्हॉट्सॲप आणि फेसबुकवर वस्तू शेअर करा, स्वतःचे प्रॉफिट मार्जिन जोडा आणि थेट बँक खात्यात नफा मिळवा!
            </p>

            {/* Quick stats pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <p className="text-xl font-black text-yellow-300">₹0</p>
                <p className="text-[11px] text-pink-100 font-semibold">Zero Investment</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <p className="text-xl font-black text-green-300">100%</p>
                <p className="text-[11px] text-pink-100 font-semibold">Free Delivery</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <p className="text-xl font-black text-yellow-300">1 Crore+</p>
                <p className="text-[11px] text-pink-100 font-semibold">Wholesale Products</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <p className="text-xl font-black text-pink-200">Weekly</p>
                <p className="text-[11px] text-pink-100 font-semibold">Direct Bank Payout</p>
              </div>
            </div>
          </div>

          {/* Reseller Earnings Card */}
          <div className="w-full max-w-sm bg-white dark:bg-[#161F30] rounded-3xl p-6 text-gray-900 dark:text-white shadow-2xl border border-pink-100 dark:border-pink-900/40 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9F2089] to-[#F43397] text-white flex items-center justify-center font-black text-sm">
                  ⭐
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100">Gold Reseller Account</p>
                  <p className="text-[10px] text-green-700 font-bold">Active & Verified ✓</p>
                </div>
              </div>
              <span className="text-[10px] bg-pink-100 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397] font-extrabold px-2.5 py-1 rounded-full">
                Shopio Partner
              </span>
            </div>

            <div className="my-4 space-y-3">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/80 p-3.5 rounded-2xl border border-pink-100 dark:border-pink-900/30">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  Pending Profit Margin
                </span>
                <p className="text-2xl font-black text-[#9F2089] dark:text-[#F43397] mt-0.5">
                  ₹{bankDetails.pendingMargin.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Ready to transfer to {bankDetails.upiId || 'Bank Account'}
                </p>
              </div>

              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                <span>Total Margins Earned:</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  ₹{(bankDetails.totalWithdrawn + bankDetails.pendingMargin).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleWithdraw}
                className="flex-1 py-3 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all"
              >
                Withdraw Margin 💸
              </button>
              <button
                onClick={() => setActiveTab('bank')}
                className="px-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="Manage Bank Account"
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sub Navigation Tabs ── */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#161F30]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto scrollbar-hide py-2 gap-2 text-xs font-bold">
          <div className="flex items-center gap-1.5 sm:gap-3">
            {[
              { id: 'catalog', label: '🛍️ Resellable Wholesale Catalog' },
              { id: 'calculator', label: '🧮 Profit Margin Calculator' },
              { id: 'bank', label: '🏦 Bank & Payout Settings' },
              { id: 'guide', label: '📖 3-Step Reselling Guide' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#9F2089] text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => onNavigate('listing')}
            className="text-xs text-[#9F2089] dark:text-[#F43397] hover:underline whitespace-nowrap hidden md:inline font-bold"
          >
            Explore Full Store Catalog →
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* ──────────────────────────────────────────────────────────
            TAB 1: WHOLESALE RESELLABLE CATALOG
        ────────────────────────────────────────────────────────── */}
        {activeTab === 'catalog' && (
          <section className="space-y-6 animate-fade-in">
            {/* Category Filter Chips */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  High-Margin Wholesale Products
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select any product, add your profit margin, and click 'Share on WhatsApp' to sell!
                </p>
              </div>

              <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === c
                        ? 'bg-[#9F2089] text-white shadow-sm'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#9F2089]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProducts.map((prod) => {
                const wholesalePrice = prod.price;
                const suggestedMargin = Math.round(wholesalePrice * 0.35 + 50);
                const customerPrice = wholesalePrice + suggestedMargin;

                return (
                  <div
                    key={prod.id}
                    className="bg-white dark:bg-[#161F30] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col justify-between group"
                  >
                    {/* Image and Badges */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                        Keep +₹{suggestedMargin} Profit
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        ⭐ {prod.rating}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase">
                          <span>{prod.brand || 'Quality Assured'}</span>
                          <span className="text-[#038D63]">Free Delivery</span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-100 mt-1 line-clamp-2">
                          {prod.name}
                        </h3>

                        {/* Price breakdown */}
                        <div className="mt-3 p-2.5 bg-gray-50 dark:bg-gray-800/80 rounded-2xl space-y-1 text-xs">
                          <div className="flex justify-between text-gray-500">
                            <span>Supplier Rate:</span>
                            <span className="font-black text-gray-900 dark:text-white">
                              ₹{wholesalePrice}
                            </span>
                          </div>
                          <div className="flex justify-between text-green-700 dark:text-green-400 font-bold">
                            <span>Your Profit Margin:</span>
                            <span>+₹{suggestedMargin}</span>
                          </div>
                          <div className="flex justify-between font-black text-[#9F2089] dark:text-[#F43397] pt-1 border-t border-gray-200 dark:border-gray-700">
                            <span>Sell to Customer for:</span>
                            <span>₹{customerPrice}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 space-y-2">
                        <button
                          onClick={() => handleShareProduct(prod)}
                          className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 active:scale-95"
                        >
                          <span>💬</span> Share on WhatsApp & Sell
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedProduct(prod)}
                            className="flex-1 py-2 bg-pink-50 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397] font-bold text-xs rounded-xl hover:bg-pink-100 transition-colors"
                          >
                            Custom Margin ✏️
                          </button>
                          <button
                            onClick={() => {
                              onAddToCart?.(prod);
                              onShowToast?.(`Added ${prod.name} to order for customer! 🛒`);
                            }}
                            className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Add to Cart"
                          >
                            🛒
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────
            TAB 2: INTERACTIVE PROFIT CALCULATOR
        ────────────────────────────────────────────────────────── */}
        {activeTab === 'calculator' && (
          <section className="bg-white dark:bg-[#161F30] rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 dark:border-gray-800 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-4xl">🧮</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-2">
                Reseller Monthly Profit Calculator
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                See how much money you can earn from home just by sharing 2–5 products a day on your WhatsApp status and groups!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Controls */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Orders Sold Per Day:
                    </label>
                    <span className="text-sm font-black text-[#9F2089] dark:text-[#F43397] bg-pink-50 dark:bg-gray-800 px-3 py-1 rounded-xl">
                      {dailyOrders} Orders / Day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={dailyOrders}
                    onChange={(e) => setDailyOrders(Number(e.target.value))}
                    className="w-full accent-[#9F2089]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>1 order</span>
                    <span>5 orders</span>
                    <span>10 orders</span>
                    <span>15 orders</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Your Cash Profit Margin Per Product:
                    </label>
                    <span className="text-sm font-black text-green-700 dark:text-green-400 bg-green-50 dark:bg-gray-800 px-3 py-1 rounded-xl">
                      +₹{marginPerItem} / Item
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="400"
                    step="10"
                    value={marginPerItem}
                    onChange={(e) => setMarginPerItem(Number(e.target.value))}
                    className="w-full accent-green-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>₹50</span>
                    <span>₹150</span>
                    <span>₹250</span>
                    <span>₹400</span>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase">Quick Margin Presets</p>
                  <div className="flex gap-2 flex-wrap">
                    {[100, 150, 200, 250, 300].map((val) => (
                      <button
                        key={val}
                        onClick={() => setMarginPerItem(val)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          marginPerItem === val
                            ? 'bg-[#9F2089] text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        +₹{val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Earnings Outcome Banner */}
              <div className="bg-gradient-to-tr from-[#9F2089] via-[#D81B80] to-[#FF8A00] rounded-3xl p-6 sm:p-8 text-white text-center shadow-2xl relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-100">
                  Estimated Monthly Income
                </span>
                <p className="text-4xl sm:text-5xl font-black mt-2 text-white">
                  ₹{monthlyProfit.toLocaleString()}
                </p>
                <p className="text-xs text-pink-100 mt-1">
                  (= ₹{(dailyOrders * marginPerItem).toLocaleString()} daily net profit!)
                </p>

                <div className="mt-6 pt-4 border-t border-white/20 text-xs text-pink-50 space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <span>✓</span> Zero inventory or packaging risk
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span> Free doorstep Cash on Delivery
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span> Margin transferred directly to your bank every Tuesday!
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('catalog')}
                  className="w-full mt-6 py-3.5 bg-white text-[#9F2089] font-black text-xs sm:text-sm rounded-xl hover:bg-yellow-300 hover:text-gray-900 transition-colors shadow-lg active:scale-95"
                >
                  Start Sharing Catalog Now 🛍️
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────
            TAB 3: BANK & PAYOUT SETTINGS
        ────────────────────────────────────────────────────────── */}
        {activeTab === 'bank' && (
          <section className="bg-white dark:bg-[#161F30] rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-800 max-w-2xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  Bank & UPI Payout Account
                </h2>
                <p className="text-xs text-gray-500">
                  Your profit margins will be credited directly to this account
                </p>
              </div>
              <button
                onClick={() => setIsEditingBank(!isEditingBank)}
                className="px-4 py-2 bg-pink-50 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397] font-bold text-xs rounded-xl hover:bg-pink-100 transition-colors"
              >
                {isEditingBank ? 'Cancel' : 'Edit Details ✏️'}
              </button>
            </div>

            {isEditingBank ? (
              <form onSubmit={handleSaveBank} className="space-y-4 text-xs">
                <div>
                  <label htmlFor={accountHolderInputId} className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Account Holder Full Name
                  </label>
                  <input
                    id={accountHolderInputId}
                    type="text"
                    required
                    value={bankForm.accountHolder}
                    onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#9F2089] dark:bg-gray-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={bankNameInputId} className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
                    <input
                      id={bankNameInputId}
                      type="text"
                      required
                      value={bankForm.bankName}
                      onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#9F2089] dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label htmlFor={accountNumberInputId} className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Account Number</label>
                    <input
                      id={accountNumberInputId}
                      type="text"
                      required
                      value={bankForm.accountNumber}
                      onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#9F2089] dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={ifscInputId} className="block font-bold text-gray-700 dark:text-gray-300 mb-1">IFSC Code</label>
                    <input
                      id={ifscInputId}
                      type="text"
                      required
                      value={bankForm.ifsc}
                      onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#9F2089] dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label htmlFor={upiIdInputId} className="block font-bold text-gray-700 dark:text-gray-300 mb-1">UPI ID (e.g. mobile@upi)</label>
                    <input
                      id={upiIdInputId}
                      type="text"
                      value={bankForm.upiId}
                      onChange={(e) => setBankForm({ ...bankForm, upiId: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#9F2089] dark:bg-gray-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all mt-4"
                >
                  Save Bank Account Details ✅
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800/80 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account Holder:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">{bankDetails.accountHolder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bank:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">{bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account Number:</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-100">{bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">IFSC Code:</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-100">{bankDetails.ifsc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">UPI ID:</span>
                    <span className="font-mono font-bold text-green-700 dark:text-green-400">{bankDetails.upiId}</span>
                  </div>
                </div>

                <div className="bg-pink-50 dark:bg-gray-800 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#9F2089] dark:text-[#F43397]">
                      Pending Margin to Withdraw: ₹{bankDetails.pendingMargin.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Total Withdrawn so far: ₹{bankDetails.totalWithdrawn.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={handleWithdraw}
                    className="px-4 py-2 bg-[#9F2089] text-white font-extrabold text-xs rounded-xl shadow-xs hover:opacity-95 active:scale-95"
                  >
                    Withdraw Now 💸
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────
            TAB 4: 3-STEP RESELLING GUIDE
        ────────────────────────────────────────────────────────── */}
        {activeTab === 'guide' && (
          <section className="bg-white dark:bg-[#161F30] rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 dark:border-gray-800 max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-4xl">🚀</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-2">
                How Reselling Works on Shopio
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                4 सोप्या पायऱ्यांमध्ये घरबसल्या दरमहा ₹25,000 पेक्षा जास्त नफा कमवा
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  icon: '🔍',
                  title: 'Select Products',
                  desc: 'Browse 1 Crore+ trending wholesale sarees, kurtis, electronics, and shoes directly from manufacturers.',
                },
                {
                  step: '02',
                  icon: '📲',
                  title: 'Share on WhatsApp',
                  desc: 'Click "Share on WhatsApp". Photos and description are shared without any Shopio branding (Your White-label).',
                },
                {
                  step: '03',
                  icon: '💰',
                  title: 'Add Your Profit',
                  desc: 'Supplier price is ₹300, you quote ₹450 to your customer. You keep ₹150 profit margin on that single piece!',
                },
                {
                  step: '04',
                  icon: '🚚',
                  title: 'Shopio Delivers COD',
                  desc: 'Shopio delivers to customer with Cash on Delivery. Upon delivery, your margin is credited directly to your bank!',
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="bg-gray-50 dark:bg-gray-800/80 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 text-center flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-black text-pink-500 bg-pink-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      Step {s.step}
                    </span>
                    <div className="text-3xl my-3">{s.icon}</div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{s.title}</h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-black text-center text-gray-900 dark:text-white mb-6">
                Success Stories from Maharashtra
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-pink-50/50 dark:bg-gray-800 p-4 rounded-2xl text-xs">
                  <p className="italic text-gray-600 dark:text-gray-300">
                    "मी पुण्यात गृहिणी आहे. रोज दुपारच्या वेळेत WhatsApp वर कुर्त्यांचे फोटो शेअर करते. मागच्या महिन्यात ₹18,400 मार्जिन थेट खात्यात आले!"
                  </p>
                  <p className="font-bold text-gray-800 dark:text-gray-100 mt-2">
                    — सुवर्णा शिंदे, पुणे (मासिक ₹18,000+)
                  </p>
                </div>
                <div className="bg-pink-50/50 dark:bg-gray-800 p-4 rounded-2xl text-xs">
                  <p className="italic text-gray-600 dark:text-gray-300">
                    "कॉलेजमध्ये असताना मी घड्याळे आणि शूज रीसेल करतो. झिरो इन्व्हेस्टमेंट असल्याने कोणतीही रिस्क नाही. शॉपिओची डिलिव्हरी सुपर फास्ट आहे."
                  </p>
                  <p className="font-bold text-gray-800 dark:text-gray-100 mt-2">
                    — रोहित साळुंके, कोल्हापूर (मासिक ₹14,000+)
                  </p>
                </div>
                <div className="bg-pink-50/50 dark:bg-gray-800 p-4 rounded-2xl text-xs">
                  <p className="italic text-gray-600 dark:text-gray-300">
                    "Customer doesn't see Shopio packaging. They think it's from my boutique! Payouts on every Tuesday without delay."
                  </p>
                  <p className="font-bold text-gray-800 dark:text-gray-100 mt-2">
                    — Aarti Deshmukh, Nagpur (₹28,500/mo)
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ── Resell Custom Margin Modal ── */}
      {selectedProduct && (
        <ResellModal
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}
