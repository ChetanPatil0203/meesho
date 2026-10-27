import { useState, useEffect } from 'react';

const sidebarLinks = [
  { icon: '👤', label: 'My Profile', key: 'profile' },
  { icon: '📦', label: 'My Orders', key: 'orders' },
  { icon: '❤️', label: 'My Wishlist', key: 'wishlist' },
  { icon: '🪙', label: 'Shopio Balance & Coins', key: 'wallet' },
  { icon: '📍', label: 'Saved Addresses', key: 'addresses' },
  { icon: '🌐', label: 'Language / भाषा', key: 'language' },
  { icon: '❓', label: 'Help & Support', key: 'support' },
];

export default function ProfilePage({ onNavigate, onBack, onShowToast, isLoggedIn, onLogout }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('meesho_user_profile'));
      return (
        saved || {
          name: 'Chetan Pazi',
          email: 'chetan.pazi@gmail.com',
          phone: '+91 9876543210',
          city: 'Mumbai',
          state: 'Maharashtra',
        }
      );
    } catch {
      return {
        name: 'Chetan Pazi',
        email: 'chetan.pazi@gmail.com',
        phone: '+91 9876543210',
        city: 'Mumbai',
        state: 'Maharashtra',
      };
    }
  });

  const [coins] = useState(350);
  const [lang, setLang] = useState(() => localStorage.getItem('meesho_lang') || 'EN');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('meesho_user_profile', JSON.stringify(profile));
    setEditing(false);
    onShowToast?.('Profile details updated successfully! ✅');
  };

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('meesho_lang', newLang);
    onShowToast?.(`Language switched to ${newLang}! 🌐`);
  };

  const handleSidebarClick = (key) => {
    if (key === 'orders') {
      onNavigate('orders');
      return;
    }
    if (key === 'wishlist') {
      onNavigate('wishlist');
      return;
    }
    setActiveSection(key);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
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
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">Account & Profile</h1>
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">Manage orders, wishlist & account settings</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* User Banner */}
            <div className="bg-gradient-to-r from-[#9F2089] to-[#F43397] p-4 sm:p-5 text-white">
              <div className="flex items-center md:block gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-lg sm:text-xl font-black mb-0 md:mb-3 border border-white/30 flex-shrink-0">
                  CP
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-black text-sm sm:text-base truncate">{profile.name}</h2>
                  <p className="text-pink-100 text-xs mt-0.5 truncate">{profile.email}</p>
                  <div className="mt-1.5 md:mt-3 inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold">
                    <span>🪙</span>
                    <span>{coins} Shopio Coins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation links - horizontal scroll on mobile, vertical stack on md+ */}
            <nav className="p-2 flex md:flex-col overflow-x-auto scrollbar-hide gap-1 md:space-y-1">
              {sidebarLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => handleSidebarClick(link.key)}
                  className={`flex-shrink-0 md:w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold transition-all text-left whitespace-nowrap ${
                    activeSection === link.key
                      ? 'bg-pink-50 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397]'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <span className="text-sm sm:text-base">{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ))}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex-shrink-0 md:w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all text-left whitespace-nowrap mt-1 border-t border-gray-100 dark:border-gray-800"
                >
                  <span className="text-sm sm:text-base">🚪</span>
                  <span>लॉगआउट करा (Logout)</span>
                </button>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Details Panel */}
        <main className="flex-1 min-w-0">
          {/* PROFILE SECTION */}
          {activeSection === 'profile' && (
            <div className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Personal Information</h3>
                  <p className="text-xs text-gray-400">Manage your contact info & delivery defaults</p>
                </div>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 border-2 border-[#9F2089] text-[#9F2089] font-bold text-xs rounded-xl hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Full Name</span>
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm mt-1">{profile.name}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Email Address</span>
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm mt-1">{profile.email}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Mobile Number</span>
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm mt-1">{profile.phone}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">City & State</span>
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm mt-1">
                      {profile.city}, {profile.state}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">City</label>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">State</label>
                      <input
                        type="text"
                        value={profile.state}
                        onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-bold rounded-xl text-xs hover:opacity-95 shadow-md"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>
          )}

          {/* WALLET / COINS SECTION */}
          {activeSection === 'wallet' && (
            <div className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-1 sm:mb-2">Shopio Balance & Rewards</h3>
              <p className="text-xs text-gray-400 mb-4 sm:mb-6">Earn coins on every delivery and use them for instant checkout discounts</p>

              <div className="bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#FF8A00] rounded-3xl p-4 sm:p-6 text-white mb-6 shadow-lg">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-100">Available Balance</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl sm:text-4xl font-black">{coins}</span>
                  <span className="text-xs sm:text-base font-bold text-yellow-300">Shopio Coins (= ₹{coins} Value)</span>
                </div>
                <p className="text-xs text-pink-100 mt-2">
                  ✓ Automatically applied during your next checkout for instant price cut!
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-gray-800 dark:text-gray-200">How to Earn More Coins:</h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl flex items-center gap-3">
                  <span className="text-xl">🛍️</span>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">Shop on Shopio</p>
                    <p className="text-gray-400 text-[11px]">Earn 5% coin cashback on all delivered orders</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl flex items-center gap-3">
                  <span className="text-xl">✍️</span>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">Write Product Reviews with Photo</p>
                    <p className="text-gray-400 text-[11px]">Get 25 coins for each verified photo review</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl flex items-center gap-3">
                  <span className="text-xl">👥</span>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">Refer a Friend</p>
                    <p className="text-gray-400 text-[11px]">Earn 100 coins when your friend places their first order</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LANGUAGE SECTION */}
          {activeSection === 'language' && (
            <div className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-1 sm:mb-2">Select Preferred Language / भाषा</h3>
              <p className="text-xs text-gray-400 mb-4 sm:mb-6">Choose your language for an easy shopping experience</p>

              <div className="space-y-3">
                {[
                  { code: 'EN', name: 'English', desc: 'Default shopping interface' },
                  { code: 'मराठी', name: 'मराठी (Marathi)', desc: 'महाराष्ट्रातील ग्राहकांसाठी विशेष मराठी सपोर्ट' },
                  { code: 'हिंदी', name: 'हिंदी (Hindi)', desc: 'संपूर्ण भारत में सबसे लोकप्रिय भाषा' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLangChange(l.code)}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                      lang === l.code
                        ? 'border-[#9F2089] bg-pink-50/50 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397]'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <p className="font-black text-sm text-gray-800 dark:text-gray-100">{l.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{l.desc}</p>
                    </div>
                    {lang === l.code && <span className="text-base font-black">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SAVED ADDRESSES */}
          {activeSection === 'addresses' && (
            <div className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Saved Delivery Addresses</h3>
                <button
                  onClick={() => onNavigate('checkout')}
                  className="text-xs font-bold text-[#9F2089] border border-[#9F2089] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl hover:bg-pink-50"
                >
                  + Add in Checkout
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-800 dark:text-gray-100">Chetan Pazi</span>
                    <span className="bg-pink-100 text-[#9F2089] font-bold px-2 py-0.5 rounded text-[10px]">Home</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Flat 402, Sai Shraddha Residency, Near Shivaji Park, Mumbai, Maharashtra - 400028
                  </p>
                  <p className="text-gray-400 mt-1">📞 +91 9876543210</p>
                </div>
              </div>
            </div>
          )}

          {/* SUPPORT SECTION */}
          {activeSection === 'support' && (
            <div className="bg-white dark:bg-[#161F30] rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-1 sm:mb-2">24x7 Customer Support</h3>
              <p className="text-xs text-gray-400 mb-4 sm:mb-6">We are here to assist with any questions or order queries</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-2xl">
                  <span className="text-xl sm:text-2xl">📞</span>
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm mt-1 sm:mt-2">Toll Free Helpline</h4>
                  <p className="text-gray-500 mt-1 font-semibold">1800-123-6337</p>
                  <p className="text-[10px] text-gray-400">Available Mon–Sun 8 AM to 10 PM</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-2xl">
                  <span className="text-xl sm:text-2xl">✉️</span>
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm mt-1 sm:mt-2">Email Support</h4>
                  <p className="text-gray-500 mt-1 font-semibold">help@shopio.com</p>
                  <p className="text-[10px] text-gray-400">Response within 2 hours</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}