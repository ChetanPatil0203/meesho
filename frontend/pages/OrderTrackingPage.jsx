




const trackingSteps = [
  { status: 'Order Placed', time: '12 Apr, 10:23 AM', done: true, icon: '📋' },
  { status: 'Confirmed', time: '12 Apr, 10:45 AM', done: true, icon: '✅' },
  { status: 'Packed', time: '12 Apr, 2:30 PM', done: true, icon: '📦' },
  { status: 'Shipped', time: '13 Apr, 9:00 AM', done: true, icon: '🚚' },
  { status: 'Out for Delivery', time: 'Expected 14 Apr', done: false, icon: '🛵', current: true },
  { status: 'Delivered', time: 'Expected 14 Apr by 7 PM', done: false, icon: '🏠' }];


export default function OrderTrackingPage({ orderId, onNavigate }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('orders')} className="text-gray-400 hover:text-gray-600">←</button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Track Order</h1>
          <p className="text-sm text-gray-500">Order #{orderId || 'SK123456789'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tracking timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5">Delivery Status</h2>
          <div className="relative">
            {trackingSteps.map((step, i) =>
              <div key={step.status} className="flex gap-4 relative">
                {/* Timeline line */}
                {i < trackingSteps.length - 1 &&
                  <div className={`absolute left-5 top-10 w-0.5 h-12 ${step.done ? 'bg-[#3B5BDB]' : 'bg-gray-200'}`} />
                }
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg z-10 ${step.done ? 'bg-[#3B5BDB]' : step.current ? 'bg-orange-100 border-2 border-orange-400' : 'bg-gray-100'}`
                }>
                  {step.done ? <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12" /></svg> : step.icon}
                </div>
                {/* Content */}
                <div className="pb-10">
                  <p className={`font-semibold text-sm ${step.done ? 'text-gray-800' : step.current ? 'text-orange-600' : 'text-gray-400'}`}>
                    {step.status}
                    {step.current && <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">In Progress</span>}
                  </p>
                  <p className={`text-xs mt-0.5 ${step.done ? 'text-gray-400' : 'text-gray-300'}`}>{step.time}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order & delivery info */}
        <div className="space-y-4">
          {/* Delivery partner */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-3">Delivery Partner</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">BlueDart</p>
                <p className="text-sm text-gray-500 mt-0.5">Tracking: BD-9876543210</p>
              </div>
              <button className="text-[#3B5BDB] text-sm font-semibold border border-[#3B5BDB] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">Contact</button>
            </div>
          </div>

          {/* Order details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-3">Order Details</h3>
            <div className="flex gap-3">
              <div className="w-14 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1583391733981-8498401ef4d8?w=120&h=140&fit=crop&auto=format" alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Women's Rayon Kurti - Floral Print</p>
                <p className="text-xs text-gray-400 mt-0.5">Color: Pink · Size: M · Qty: 1</p>
                <p className="text-sm font-bold mt-1">₹599</p>
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-3">Delivery Address</h3>
            <p className="text-sm font-semibold text-gray-800">Chetan Pazi</p>
            <p className="text-sm text-gray-500 mt-0.5">204, Park Avenue, Andheri West<br />Mumbai, Maharashtra - 400053</p>
            <p className="text-sm text-gray-500 mt-0.5">📞 +91 9876543210</p>
          </div>

          <button className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm">
            Contact Support
          </button>
        </div>
      </div>
    </div>);

}