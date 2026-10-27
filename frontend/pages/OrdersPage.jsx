import { useState, useEffect } from 'react';

const sampleOrders = [
  {
    id: 'MEE-948123',
    date: '12 Sep 2026',
    product: "Women's Rayon Kurti - Floral Print",
    amount: 599,
    status: 'Delivered',
    qty: 1,
    image: 'https://images.unsplash.com/photo-1583391733981-8498401ef4d8?w=120&h=140&fit=crop&auto=format',
    seller: 'Fashion Hub',
  },
  {
    id: 'MEE-628419',
    date: '5 Sep 2026',
    product: 'boAt Rockerz 450 Wireless Headphones',
    amount: 1299,
    status: 'Shipped',
    qty: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=140&fit=crop&auto=format',
    seller: 'ElectroWorld',
  },
  {
    id: 'MEE-481920',
    date: '28 Aug 2026',
    product: 'Sports Running Shoes - Men Lightweight',
    amount: 1299,
    status: 'Delivered',
    qty: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=140&fit=crop&auto=format',
    seller: 'ShoeMart',
  },
  {
    id: 'MEE-312940',
    date: '15 Aug 2026',
    product: "Women's Silk Saree with Blouse Piece",
    amount: 2499,
    status: 'Cancelled',
    qty: 1,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=120&h=140&fit=crop&auto=format',
    seller: 'SilkKraft',
  },
];

const statusColors = {
  Delivered: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
  Shipped: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
  Processing: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',
  Cancelled: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrdersPage({ onNavigate, onBack, onAddToCart, onShowToast }) {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('meesho_orders') || '[]');
      // Combine stored orders with sample orders
      setOrders([...stored, ...sampleOrders]);
    } catch {
      setOrders(sampleOrders);
    }
  }, []);

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const updated = orders.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      setOrders(updated);
      try {
        const stored = JSON.parse(localStorage.getItem('meesho_orders') || '[]');
        const updatedStored = stored.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o));
        localStorage.setItem('meesho_orders', JSON.stringify(updatedStored));
      } catch {
        // ignore
      }
      onShowToast?.('Order has been cancelled', 'info');
    }
  };

  const handleBuyAgain = (order) => {
    if (onAddToCart) {
      onAddToCart(
        {
          id: order.id,
          name: order.product,
          price: order.amount,
          mrp: order.amount + 400,
          image: order.image,
        },
        1
      );
      onShowToast?.(`Added "${order.product.slice(0, 25)}..." to cart! 🛒`);
    } else {
      onNavigate('listing');
    }
  };

  const filtered = orders.filter((o) => {
    const matchTab = activeTab === 'All' || o.status === activeTab;
    const matchSearch =
      o.product?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 md:pb-12">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onBack || (() => onNavigate('home'))}
            title="Go Back (मागे जा)"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-[#161F30] border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-[#9F2089] hover:border-[#9F2089] dark:hover:text-[#F43397] dark:hover:border-[#F43397] transition-all shadow-xs active:scale-95 group flex-shrink-0"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">My Orders</h1>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Track, return, or buy again from your previous orders
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-[#9F2089] dark:text-[#F43397] hover:underline hidden sm:inline-block"
        >
          Explore More Products →
        </button>
      </div>

      {/* Search orders */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search your orders by product name or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 dark:border-gray-700 rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs outline-none focus:border-[#9F2089] bg-white dark:bg-[#161F30] dark:text-white shadow-xs"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 sm:gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-xs'
                : 'bg-white dark:bg-[#161F30] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#9F2089]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white dark:bg-[#161F30] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-xs">
          <div className="text-4xl sm:text-5xl mb-3">📦</div>
          <h3 className="font-black text-gray-800 dark:text-gray-100 text-sm sm:text-base">No orders found</h3>
          <p className="text-gray-400 text-xs mt-1">Your {activeTab.toLowerCase()} orders will appear here.</p>
          <button
            onClick={() => onNavigate('home')}
            className="mt-4 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs font-bold shadow-md hover:opacity-95"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 p-3.5 sm:p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-16 sm:w-20 h-20 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0 border border-gray-100 dark:border-gray-700">
                  <img src={order.image} alt={order.product} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1.5 sm:gap-2 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-100 line-clamp-1">
                        {order.product}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                        Order #{order.id} · {order.date}
                      </p>
                      <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mt-1">
                        ₹{order.amount.toLocaleString()}{' '}
                        <span className="text-[10px] sm:text-[11px] font-normal text-gray-400">({order.qty || 1} item)</span>
                      </p>
                    </div>

                    <span
                      className={`text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full flex-shrink-0 ${
                        statusColors[order.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => onNavigate('order-tracking', { orderId: order.id })}
                      className="text-[11px] sm:text-xs bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-bold px-2.5 sm:px-3.5 py-1.5 rounded-xl hover:opacity-95 shadow-2xs"
                    >
                      Track Order 🛵
                    </button>
                    <button
                      onClick={() => handleBuyAgain(order)}
                      className="text-[11px] sm:text-xs text-[#9F2089] dark:text-[#F43397] font-bold border border-[#9F2089] dark:border-[#F43397] px-2.5 sm:px-3.5 py-1.5 rounded-xl hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Buy Again
                    </button>
                    <button
                      onClick={() => setSelectedInvoice(order)}
                      className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 font-bold border border-gray-200 dark:border-gray-700 px-2.5 sm:px-3.5 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      📄 Invoice
                    </button>
                    {(order.status === 'Processing' || order.status === 'Shipped') && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-[11px] sm:text-xs text-red-500 font-bold border border-red-200 px-2.5 sm:px-3.5 py-1.5 rounded-xl hover:bg-red-50 transition-colors ml-0 sm:ml-auto"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Invoice Modal ── */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="bg-white dark:bg-[#161F30] rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-2xl animate-fade-in text-xs max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-[#9F2089]">Shopio</span>
                <span className="text-[10px] text-gray-400 font-mono">Tax Invoice / Bill of Supply</span>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Invoice No: <strong>INV-{selectedInvoice.id}</strong></span>
                <span>Date: <strong>{selectedInvoice.date}</strong></span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <p className="font-bold text-gray-800 dark:text-gray-200">{selectedInvoice.product}</p>
                <div className="flex justify-between mt-1 text-gray-500">
                  <span>Qty: {selectedInvoice.qty || 1}</span>
                  <span className="font-black text-gray-900 dark:text-white">₹{selectedInvoice.amount}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{selectedInvoice.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Delivery:</span>
                  <span className="text-green-600 font-bold">FREE (₹0)</span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Taxes:</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between font-black text-sm text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span>Total Paid:</span>
                  <span>₹{selectedInvoice.amount}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#9F2089] text-white font-bold rounded-xl text-center"
              >
                🖨️ Print Receipt
              </button>
              <button
                onClick={() => {
                  alert('Invoice downloaded successfully to your device.');
                  setSelectedInvoice(null);
                }}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-center"
              >
                📥 Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}