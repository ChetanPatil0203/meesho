import { useEffect, useState } from 'react';
import { triggerConfetti } from '../utils/confetti';

export default function OrderSuccessPage({ orderId, total, address, items = [], onNavigate, onBack }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
      triggerConfetti(3500);
    }, 150);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center">
      <div className="flex justify-start mb-4">
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
      <div className={`transition-all duration-500 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#038D63] to-emerald-400 mx-auto flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
          <svg width="44" height="44" fill="none" stroke="white" strokeWidth="3.5" viewBox="0 0 24 24">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
      </div>

      <span className="inline-block bg-pink-100 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397] font-bold text-xs px-3.5 py-1 rounded-full mb-2">
        Order Placed Successfully! 🎉
      </span>

      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
        Thank You for Shopping on Shopio!
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-6 max-w-md mx-auto">
        Your order has been confirmed by the supplier. We will send delivery updates via SMS and WhatsApp.
      </p>

      {/* Summary Card */}
      <div className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 text-left mb-6">
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 text-xs">
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px]">Order ID</p>
            <p className="font-black text-sm text-[#9F2089] dark:text-[#F43397] mt-0.5">#{orderId}</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px]">Total Paid / Payable</p>
            <p className="font-black text-sm text-gray-900 dark:text-white mt-0.5">₹{total?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px]">Estimated Delivery</p>
            <p className="font-bold text-green-700 dark:text-green-400 mt-0.5">By Saturday (Free Delivery)</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px]">Payment Method</p>
            <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">Cash on Delivery / Online ✅</p>
          </div>
        </div>

        {address && (
          <div className="mt-4 pt-1">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Delivering to</p>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-100">{address.name} ({address.phone})</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              {address.address}, {address.city}, {address.state} - {address.pincode}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onNavigate('order-tracking', { orderId })}
          className="flex-1 py-3.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold rounded-2xl hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Track My Order
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="flex-1 py-3.5 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-extrabold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs sm:text-sm"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}