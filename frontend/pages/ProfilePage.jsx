import { useState } from 'react';







const sidebarLinks = [
  { icon: '👤', label: 'My Profile', key: 'profile' },
  { icon: '📦', label: 'My Orders', key: 'orders' },
  { icon: '❤️', label: 'Wishlist', key: 'wishlist' },
  { icon: '📍', label: 'Addresses', key: 'addresses' },
  { icon: '💳', label: 'Payments', key: 'payments' },
  { icon: '🏷️', label: 'Coupons', key: 'coupons' },
  { icon: '🔔', label: 'Notifications', key: 'notifications' },
  { icon: '❓', label: 'Help & Support', key: 'support' },
  { icon: '⚙️', label: 'Settings', key: 'settings' },
  { icon: '🚪', label: 'Logout', key: 'logout' }];


const orderHistory = [
  { id: 'SK123456789', date: '12 Apr 2025', items: "Women's Kurti", amount: 599, status: 'Delivered', image: 'https://images.unsplash.com/photo-1583391733981-8498401ef4d8?w=80&h=90&fit=crop&auto=format' },
  { id: 'SK987654321', date: '5 Apr 2025', items: 'boAt Headphones', amount: 1299, status: 'Shipped', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=90&fit=crop&auto=format' },
  { id: 'SK456789123', date: '28 Mar 2025', items: 'Running Shoes', amount: 1299, status: 'Processing', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=90&fit=crop&auto=format' }];


const statusColor = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700'
};

export default function ProfilePage({ onNavigate, onShowToast, isLoggedIn }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [name, setName] = useState('Chetan Pazi');
  const [email, setEmail] = useState('chetan@gmail.com');
  const [phone, setPhone] = useState('+91 9876543210');
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    onShowToast('Profile updated successfully!');
  };

  const handleSidebarClick = (key) => {
    if (key === 'logout') { onNavigate('home'); return; }
    if (key === 'orders') { onNavigate('orders'); return; }
    if (key === 'wishlist') { onNavigate('wishlist'); return; }
    setActiveSection(key);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-[#3B5BDB] to-[#2F4AC4] p-5 text-white">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-3">
                CP
              </div>
              <p className="font-bold">{name}</p>
              <p className="text-blue-200 text-sm">{email}</p>
            </div>
            <nav className="p-2">
              {sidebarLinks.map((link) =>
                <button key={link.key} onClick={() => handleSidebarClick(link.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors text-left ${activeSection === link.key ? 'bg-blue-50 text-[#3B5BDB] font-semibold' : 'text-gray-600 hover:bg-gray-50'} ${link.key === 'logout' ? 'text-red-500 hover:bg-red-50' : ''}`}>
                  <span>{link.icon}</span>
                  {link.label}
                </button>
              )}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 space-y-4">
          {activeSection === 'profile' &&
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-xl text-gray-800">My Profile</h2>
                {!editing &&
                  <button onClick={() => setEditing(true)} className="text-[#3B5BDB] text-sm font-medium border border-[#3B5BDB] px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                    Edit Profile
                  </button>
                }
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-full bg-[#3B5BDB] text-white flex items-center justify-center text-3xl font-bold">CP</div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">{name}</p>
                  <p className="text-gray-500 text-sm">{email}</p>
                  <p className="text-gray-500 text-sm">{phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: name, setter: setName, editable: true },
                  { label: 'Email Address', value: email, setter: setEmail, editable: true },
                  { label: 'Mobile Number', value: phone, setter: setPhone, editable: true },
                  { label: 'Member Since', value: 'January 2024', editable: false }].
                  map((field) =>
                    <div key={field.label}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{field.label}</label>
                      {editing && field.editable ?
                        <input value={field.value} onChange={(e) => field.setter?.(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3B5BDB]" /> :

                        <p className="text-sm font-medium text-gray-800 border border-transparent px-3 py-2">{field.value}</p>
                      }
                    </div>
                  )}
              </div>

              {editing &&
                <div className="flex gap-3 mt-5">
                  <button onClick={handleSave} className="px-6 py-2 bg-[#3B5BDB] text-white font-semibold rounded-xl hover:bg-[#2F4AC4] transition-colors">Save Changes</button>
                  <button onClick={() => setEditing(false)} className="px-6 py-2 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                </div>
              }
            </div>
          }

          {activeSection === 'coupons' &&
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-xl text-gray-800 mb-5">My Coupons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { code: 'FIRST100', discount: '₹100 off', desc: 'On first order above ₹500', expires: '30 Apr 2025', min: '₹500' },
                  { code: 'SAVE50', discount: '₹50 off', desc: 'On all orders above ₹300', expires: '15 Apr 2025', min: '₹300' },
                  { code: 'WELCOME50', discount: '₹50 off', desc: 'On your first order', expires: '20 Apr 2025', min: '₹200' },
                  { code: 'HDFC10', discount: '10% off', desc: '10% instant discount with HDFC Cards', expires: '31 Mar 2025', min: '₹999' }].
                  map((coupon) =>
                    <div key={coupon.code} className="border-2 border-dashed border-[#3B5BDB] rounded-xl p-4 bg-blue-50 relative overflow-hidden">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-xl text-[#3B5BDB]">{coupon.discount}</p>
                          <p className="text-sm text-gray-700 mt-0.5">{coupon.desc}</p>
                          <p className="text-xs text-gray-400 mt-1">Min order: {coupon.min} · Expires: {coupon.expires}</p>
                        </div>
                        <button className="bg-[#3B5BDB] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#2F4AC4] transition-colors">Apply</button>
                      </div>
                      <div className="mt-3 flex items-center gap-2 bg-white rounded-lg px-3 py-1.5">
                        <span className="font-mono font-bold text-sm text-[#3B5BDB]">{coupon.code}</span>
                        <button className="ml-auto text-xs text-gray-400 hover:text-gray-600">Copy</button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          }

          {activeSection === 'notifications' &&
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-xl text-gray-800">Notifications</h2>
                <button className="text-xs text-[#3B5BDB] hover:underline">Mark all as read</button>
              </div>
              <div className="space-y-3">
                {[
                  { icon: '📦', title: 'Order Update', msg: 'Your order #SK123456789 has been shipped!', time: '2h ago', unread: true },
                  { icon: '🏷️', title: 'Special Offer', msg: 'Get 40% off on all Women wear today only!', time: '5h ago', unread: true },
                  { icon: '💳', title: 'Payment Update', msg: 'Payment of ₹1,299 successful for order #SK987654321', time: '1d ago', unread: false },
                  { icon: '🚚', title: 'Delivery Update', msg: 'Your order will be delivered today by 7 PM.', time: '1d ago', unread: false },
                  { icon: '💡', title: 'Product Recommendation', msg: 'Based on your shopping history, you may like these products.', time: '2d ago', unread: false }].
                  map((n, i) =>
                    <div key={i} className={`flex gap-4 p-4 rounded-xl ${n.unread ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${n.unread ? 'bg-[#3B5BDB]' : 'bg-gray-200'}`}>
                        {n.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${n.unread ? 'text-[#3B5BDB]' : 'text-gray-700'}`}>{n.title}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{n.time}</span>
                            <button className="text-xs text-red-400 hover:text-red-500">🗑</button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{n.msg}</p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          }

          {activeSection === 'addresses' &&
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-xl text-gray-800 mb-5">Saved Addresses</h2>
              <div className="space-y-3">
                {[
                  { name: 'Chetan Pazi', type: 'Home', address: '204, Park Avenue, Andheri West, Mumbai, Maharashtra - 400053', phone: '+91 9876543210', default: true },
                  { name: 'Chetan Pazi', type: 'Work', address: '5th Floor, Tech Tower, BKC, Mumbai, Maharashtra - 400051', phone: '+91 9876543210', default: false }].
                  map((addr, i) =>
                    <div key={i} className={`border-2 rounded-xl p-4 ${addr.default ? 'border-[#3B5BDB]' : 'border-gray-200'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">{addr.name}</span>
                            <span className="text-xs bg-blue-100 text-[#3B5BDB] px-2 py-0.5 rounded-full">{addr.type}</span>
                            {addr.default && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>}
                          </div>
                          <p className="text-sm text-gray-600">{addr.address}</p>
                          <p className="text-sm text-gray-500 mt-0.5">📞 {addr.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-[#3B5BDB] text-xs border border-[#3B5BDB] px-3 py-1 rounded-lg hover:bg-blue-50">Edit</button>
                          <button className="text-red-500 text-xs border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50">Delete</button>
                        </div>
                      </div>
                    </div>
                  )}
                <button className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 text-sm text-gray-500 hover:border-[#3B5BDB] hover:text-[#3B5BDB] transition-colors">
                  + Add New Address
                </button>
              </div>
            </div>
          }

          {activeSection === 'support' &&
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-xl text-gray-800 mb-5">Help & Support</h2>
              <div className="mb-4">
                <input type="text" placeholder="Search for help..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3B5BDB]" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {['Orders', 'Payments', 'Returns', 'Refunds', 'Delivery', 'Account'].map((topic) =>
                  <button key={topic} className="p-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-[#3B5BDB] hover:text-[#3B5BDB] hover:bg-blue-50 transition-all">
                    {topic}
                  </button>
                )}
              </div>
              <div className="bg-[#3B5BDB] rounded-xl p-5 text-white flex items-center justify-between">
                <div>
                  <p className="font-bold">Need more help?</p>
                  <p className="text-blue-200 text-sm mt-0.5">Chat with our support team 24/7</p>
                </div>
                <button className="bg-white text-[#3B5BDB] font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm">Start Chat</button>
              </div>
            </div>
          }

          {/* Default - show orders */}
          {!['profile', 'coupons', 'notifications', 'addresses', 'support'].includes(activeSection) &&
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-xl text-gray-800 mb-4 capitalize">{activeSection}</h2>
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-3">🚧</div>
                <p>Coming soon</p>
              </div>
            </div>
          }
        </main>
      </div>
    </div>);

}