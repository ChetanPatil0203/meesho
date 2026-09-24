import { useEffect, useState } from 'react';








export default function OrderSuccessPage({ orderId, total, address, onNavigate }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className={`transition-all duration-500 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <div className="w-24 h-24 rounded-full bg-green-500 mx-auto flex items-center justify-center mb-6 shadow-lg">
          <svg width="40" height="40" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully! 🎉</h1>
      <p className="text-gray-500 mb-6">Thank you for shopping with ShopKart. Your order has been confirmed.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-left mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Order ID</p>
            <p className="font-bold text-[#3B5BDB] mt-1">#{orderId}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Total Amount</p>
            <p className="font-bold text-gray-800 mt-1">₹{total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Expected Delivery</p>
            <p className="font-semibold text-green-600 mt-1">14 Apr 2025</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Payment</p>
            <p className="font-semibold text-gray-800 mt-1">Online ✅</p>
          </div>
        </div>

        {address &&
        <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Delivering to</p>
            <p className="text-sm font-semibold text-gray-800">{address.name}</p>
            <p className="text-sm text-gray-500">{address.address}, {address.city}, {address.state} - {address.pincode}</p>
          </div>
        }
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => onNavigate('order-tracking', { orderId })} className="flex-1 py-3 bg-[#3B5BDB] text-white font-bold rounded-xl hover:bg-[#2F4AC4] transition-colors flex items-center justify-center gap-2">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          Track Order
        </button>
        <button onClick={() => onNavigate('home')} className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
          Continue Shopping
        </button>
      </div>
    </div>);

}