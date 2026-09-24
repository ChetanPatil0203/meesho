import { useState } from 'react';





const allOrders = [
  { id: 'SK123456789', date: '12 Apr 2025', product: "Women's Rayon Kurti - Floral Print", amount: 599, status: 'Delivered', qty: 1, image: 'https://images.unsplash.com/photo-1583391733981-8498401ef4d8?w=80&h=90&fit=crop&auto=format' },
  { id: 'SK987654321', date: '5 Apr 2025', product: 'boAt Rockerz 450 Wireless Headphones', amount: 1299, status: 'Shipped', qty: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=90&fit=crop&auto=format' },
  { id: 'SK456789123', date: '28 Mar 2025', product: 'Sports Running Shoes - Men', amount: 1299, status: 'Processing', qty: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=90&fit=crop&auto=format' },
  { id: 'SK111222333', date: '15 Mar 2025', product: "Women's Silk Saree with Blouse", amount: 2499, status: 'Cancelled', qty: 1, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&h=90&fit=crop&auto=format' },
  { id: 'SK444555666', date: '2 Mar 2025', product: 'Redmi Note 13 Pro 5G 256GB', amount: 24999, status: 'Delivered', qty: 1, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=90&fit=crop&auto=format' }];


const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
  Returned: 'bg-purple-100 text-purple-700'
};

const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

export default function OrdersPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = allOrders.filter((o) => {
    const matchTab = activeTab === 'All' || o.status === activeTab;
    const matchSearch = o.product.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    return matchTab && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">My Orders</h1>

      <div className="mb-4">
        <input type="text" placeholder="Search by product name or order ID..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3B5BDB] bg-white shadow-sm" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {tabs.map((tab) =>
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab ? 'bg-[#3B5BDB] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#3B5BDB] hover:text-[#3B5BDB]'}`}>
            {tab}
          </button>
        )}
      </div>

      {/* Orders */}
      {filtered.length === 0 ?
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">📦</div>
          <h3 className="font-bold text-gray-700 text-lg">No orders found</h3>
          <p className="text-gray-400 text-sm mt-1">Your {activeTab.toLowerCase()} orders will appear here</p>
          <button onClick={() => onNavigate('home')} className="mt-4 bg-[#3B5BDB] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2F4AC4] transition-colors">Start Shopping</button>
        </div> :

        <div className="space-y-3">
          {filtered.map((order) =>
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={order.image} alt={order.product} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm text-gray-800 line-clamp-2">{order.product}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Order #{order.id} · {order.date}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">₹{order.amount.toLocaleString()}</p>
                    </div>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {order.status === 'Delivered' &&
                      <>
                        <button className="text-xs text-[#3B5BDB] border border-[#3B5BDB] px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">Buy Again</button>
                        <button className="text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors">Return</button>
                        <button className="text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors">Invoice</button>
                      </>
                    }
                    {(order.status === 'Shipped' || order.status === 'Processing') &&
                      <>
                        <button onClick={() => onNavigate('order-tracking', { orderId: order.id })} className="text-xs bg-[#3B5BDB] text-white px-3 py-1 rounded-lg hover:bg-[#2F4AC4] transition-colors">Track Order</button>
                        <button className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">Cancel</button>
                      </>
                    }
                    <button onClick={() => onNavigate('order-tracking', { orderId: order.id })} className="text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    </div>);

}