import { useState, useEffect } from 'react';

const defaultSteps = [
  { status: 'Order Placed', time: '10:23 AM, Today', done: true, icon: '📋', desc: 'Order verified by supplier' },
  { status: 'Packed & Processed', time: '02:15 PM, Today', done: true, icon: '📦', desc: 'Item packed in secure tamper-proof bag' },
  { status: 'Shipped with Courier', time: 'Expected Tomorrow', done: true, icon: '🚚', desc: 'Handed over to BlueDart / Delhivery Express' },
  { status: 'Out for Delivery', time: 'Expected by Friday', done: false, icon: '🛵', current: true, desc: 'Delivery partner will call before arrival' },
  { status: 'Delivered', time: 'Expected by Saturday, 7:00 PM', done: false, icon: '🏠', desc: 'Package handed over at doorstep' },
];

export default function OrderTrackingPage({ orderId, onNavigate, onBack }) {
  const [order, setOrder] = useState(null);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem('meesho_orders') || '[]');
      const found = orders.find((o) => o.id === orderId);
      if (found) {
        setOrder(found);
        if (found.status === 'Cancelled') setCancelled(true);
      }
    } catch {
      // ignore
    }
  }, [orderId]);

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setCancelled(true);
      try {
        const orders = JSON.parse(localStorage.getItem('meesho_orders') || '[]');
        const updated = orders.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o));
        localStorage.setItem('meesho_orders', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  const steps = cancelled
    ? [
        { status: 'Order Placed', time: 'Completed', done: true, icon: '📋' },
        { status: 'Order Cancelled', time: 'Just now', done: true, icon: '❌', isCancel: true },
      ]
    : defaultSteps;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack || (() => onNavigate('orders'))}
          title="Go Back (मागे जा)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#161F30] border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-[#9F2089] hover:border-[#9F2089] dark:hover:text-[#F43397] dark:hover:border-[#F43397] transition-all shadow-xs active:scale-95 group flex-shrink-0"
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back</span>
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Track Order Status</h1>
          <p className="text-xs text-gray-500">Order ID: <strong className="text-[#9F2089] dark:text-[#F43397]">#{orderId || 'MEE-789123'}</strong></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-base text-gray-900 dark:text-white">Live Tracking</h2>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              cancelled ? 'bg-red-50 text-red-600' : 'bg-green-50 text-[#038D63]'
            }`}>
              {cancelled ? 'Cancelled' : '● On Schedule'}
            </span>
          </div>

          <div className="relative pl-2">
            {steps.map((step, i) => (
              <div key={step.status} className="flex gap-4 relative">
                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div
                    className={`absolute left-5 top-10 w-0.5 h-14 ${
                      step.done ? 'bg-[#9F2089]' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}

                {/* Circle Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-base z-10 transition-all ${
                    step.isCancel
                      ? 'bg-red-500 text-white'
                      : step.done
                      ? 'bg-[#9F2089] text-white shadow-xs'
                      : step.current
                      ? 'bg-pink-100 dark:bg-gray-700 border-2 border-[#9F2089]'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  {step.done && !step.isCancel ? (
                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <p
                    className={`font-bold text-xs ${
                      step.isCancel
                        ? 'text-red-600'
                        : step.done
                        ? 'text-gray-900 dark:text-white'
                        : step.current
                        ? 'text-[#9F2089] dark:text-[#F43397]'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.status}
                    {step.current && (
                      <span className="ml-2 text-[10px] bg-pink-50 text-[#9F2089] px-2 py-0.5 rounded-full font-bold">
                        In Transit
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{step.time}</p>
                  {step.desc && <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{step.desc}</p>}
                </div>
              </div>
            ))}
          </div>

          {!cancelled && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleCancelOrder}
                className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors"
              >
                Cancel this Order
              </button>
            </div>
          )}
        </div>

        {/* Courier & Delivery Info */}
        <div className="space-y-4">
          {/* Delivery Partner */}
          <div className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">Courier Partner</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-gray-800 dark:text-gray-100">BlueDart Express (Air)</p>
                <p className="text-xs text-gray-400 mt-0.5">AWB: BD-8492048192</p>
              </div>
              <span className="text-xs bg-green-50 text-[#038D63] font-bold px-2.5 py-1 rounded-xl">
                Verified Delivery
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">Shipping Address</h3>
            <p className="font-bold text-sm text-gray-800 dark:text-gray-100">{order?.address?.name || 'Chetan Pazi'}</p>
            <p className="text-xs text-gray-500 leading-relaxed mt-1">
              {order?.address?.address || 'Flat 402, Sai Shraddha Residency, Near Shivaji Park, Mumbai, Maharashtra - 400028'}
            </p>
            <p className="text-xs text-gray-400 mt-1">📞 {order?.address?.phone || '+91 9876543210'}</p>
          </div>

          {/* Help button */}
          <div className="bg-pink-50 dark:bg-gray-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="text-xs">
              <p className="font-bold text-[#9F2089] dark:text-[#F43397]">Need Help with this Order?</p>
              <p className="text-gray-500 dark:text-gray-400">Available 24x7 via chat and phone</p>
            </div>
            <button
              onClick={() => alert('Shopio Customer Support: Toll Free 1800-123-6337\nEmail: support@shopio.com')}
              className="px-3.5 py-2 bg-[#9F2089] text-white text-xs font-bold rounded-xl"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}