import { useState, useEffect } from 'react';

const navCategories = [
  { name: 'Women Ethnic', key: 'Women', icon: '🥻' },
  { name: 'Women Western', key: 'Women', icon: '👗' },
  { name: 'Men', key: 'Men', icon: '👔' },
  { name: 'Kids', key: 'Kids', icon: '🧒' },
  { name: 'Home & Kitchen', key: 'Home & Kitchen', icon: '🏠' },
  { name: 'Beauty & Health', key: 'Beauty', icon: '💄' },
  { name: 'Jewellery', key: 'Accessories', icon: '💍' },
  { name: 'Footwear', key: 'Footwear', icon: '👟' },
  { name: 'Electronics', key: 'Electronics', icon: '📱' },
  { name: 'Sports', key: 'Sports', icon: '🏋️' },
];

const allSuggestions = [
  "Women's Rayon Kurti",
  'Silk Saree with Blouse',
  "Men's Casual Cotton Shirt",
  'Sports Running Shoes',
  'boAt Wireless Headphones',
  'Gold Plated Necklace Set',
  'Lakme Absolute Primer',
  'Philips Digital Air Fryer',
  'Kids Cotton Kurta Set',
  'Leather Handbag for Women',
  'Redmi Note 13 Pro 5G',
  'Yoga Mat Non-Slip',
  'Cotton Bedsheet Double Bed',
];

export default function Header({
  cartCount,
  wishlistCount,
  onNavigate,
  onBack,
  currentPage,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isLoggedIn,
  onLoginClick,
  onLogout,
}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState(() => localStorage.getItem('meesho_city') || 'Mumbai');
  const [currentPincode, setCurrentPincode] = useState(() => localStorage.getItem('meesho_pin') || '400001');
  const [newPinInput, setNewPinInput] = useState('');
  const [lang, setLang] = useState(() => localStorage.getItem('meesho_lang') || 'EN');

  // Dark Mode state with localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('meesho_theme') === 'dark' || document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('meesho_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('meesho_theme', 'light');
    }
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'EN' ? 'मराठी' : lang === 'मराठी' ? 'हिंदी' : 'EN';
    setLang(nextLang);
    localStorage.setItem('meesho_lang', nextLang);
  };

  const handleUpdatePincode = (e) => {
    e.preventDefault();
    if (newPinInput.length === 6) {
      setCurrentPincode(newPinInput);
      const cities = {
        '400': 'Mumbai',
        '411': 'Pune',
        '440': 'Nagpur',
        '110': 'Delhi',
        '560': 'Bengaluru',
        '500': 'Hyderabad',
        '600': 'Chennai',
        '700': 'Kolkata',
      };
      const prefix = newPinInput.slice(0, 3);
      const foundCity = cities[prefix] || 'Maharashtra';
      setCurrentCity(foundCity);
      localStorage.setItem('meesho_city', foundCity);
      localStorage.setItem('meesho_pin', newPinInput);
      setPincodeModalOpen(false);
      setNewPinInput('');
    }
  };

  // Voice Search Handler
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice Search is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'मराठी' ? 'mr-IN' : lang === 'हिंदी' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onSearchChange(transcript);
        onSearchSubmit(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const recentSearches = ['Saree', 'Kurti Under 499', 'Running Shoes', 'boAt Earphones'];
  const trendingSearches = ['Silk Saree', 'boAt Headphones', 'Men Shirt', 'Air Fryer', 'Gold Necklace'];

  const suggestions = searchQuery.length > 0
    ? allSuggestions.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 7)
    : [];

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearchSubmit(searchQuery);
      setSearchFocused(false);
    }
  };

  const renderSearchBar = (isMobile = false) => (
    <div className={`relative ${isMobile ? 'w-full' : 'flex-1'}`}>
      <div
        className={`flex items-center border-2 rounded-2xl overflow-hidden transition-all bg-white dark:bg-[#1E293B] ${
          isListening
            ? 'border-red-500 shadow-md ring-2 ring-red-200'
            : searchFocused
              ? 'border-[#9F2089] shadow-md shadow-[#9F2089]/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
        }`}
      >
        <svg
          className="ml-3 sm:ml-3.5 flex-shrink-0 text-gray-400"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder={
            isListening
              ? 'Listening... Speak now 🎙️'
              : isMobile
                ? 'Try Saree, Kurti, Shoes...'
                : 'Try Saree, Kurti, T-Shirt, Bluetooth Headphones, Shoes...'
          }
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          onKeyDown={handleSearchKeyDown}
          className="flex-1 min-w-0 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-transparent text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none"
        />

        {/* Voice search button */}
        <button
          type="button"
          onClick={startVoiceSearch}
          title="Search by Voice"
          className={`p-1.5 sm:p-2 rounded-xl mr-0.5 sm:mr-1 transition-all ${
            isListening
              ? 'text-red-500 bg-red-50 animate-pulse'
              : 'text-gray-400 hover:text-[#9F2089] hover:bg-pink-50 dark:hover:bg-gray-700'
          }`}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>

        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="px-1.5 sm:px-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        <button
          onClick={() => {
            if (searchQuery.trim()) {
              onSearchSubmit(searchQuery);
              setSearchFocused(false);
            }
          }}
          className="bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold hover:opacity-95 transition-opacity flex-shrink-0 flex items-center gap-1"
        >
          <span>Search</span>
        </button>
      </div>

      {/* Search Dropdown */}
      {searchFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#161F30] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden animate-fade-in max-h-[70vh] overflow-y-auto">
          {searchQuery.length === 0 ? (
            <div className="p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Recent Searches
                  </p>
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        onSearchChange(s);
                        onSearchSubmit(s);
                      }}
                      className="flex items-center gap-2 w-full text-xs sm:text-sm text-left py-1.5 text-gray-700 dark:text-gray-300 hover:text-[#9F2089] transition-colors"
                    >
                      <span className="text-gray-400 text-xs">🕒</span>
                      {s}
                    </button>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Trending on Shopio
                  </p>
                  {trendingSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        onSearchChange(s);
                        onSearchSubmit(s);
                      }}
                      className="flex items-center gap-2 w-full text-xs sm:text-sm text-left py-1.5 text-gray-700 dark:text-gray-300 hover:text-[#9F2089] transition-colors"
                    >
                      <span className="text-orange-500 text-sm">🔥</span>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 mt-3 pt-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Popular Categories
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {['Women Ethnic', 'Western Wear', 'Men', 'Electronics', 'Footwear', 'Home Decor'].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setSearchFocused(false);
                        onNavigate('listing', { category: c });
                      }}
                      className="text-xs bg-pink-50 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397] px-2.5 sm:px-3 py-1 rounded-full hover:bg-[#9F2089] hover:text-white transition-colors font-semibold"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onSearchChange(s);
                    onSearchSubmit(s);
                    setSearchFocused(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-[#9F2089] transition-colors text-left"
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    className="text-gray-400 flex-shrink-0"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: s.replace(
                        new RegExp(`(${searchQuery})`, 'gi'),
                        '<strong class="text-[#9F2089] dark:text-[#F43397]">$1</strong>'
                      ),
                    }}
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs sm:text-sm text-gray-400">
              Press Enter to search for "<strong className="text-gray-700 dark:text-gray-200">{searchQuery}</strong>"
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#161F30] transition-colors">
      {/* ── Top Announcement Ticker ── */}
      <div className="bg-[#9F2089] text-white text-[11px] font-medium py-1 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-gray-900 font-extrabold text-[9px] px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
              Maha Sale
            </span>
            <span>
              {lang === 'मराठी'
                ? '🔥 शॉपिओ महा सेल: सर्व ऑर्डरवर मोफत डिलिव्हरी आणि कॅश ऑन डिलिव्हरी उपलब्ध!'
                : '🔥 SHOPIO MAHA SALE: Free Delivery on All Orders · Cash on Delivery Available · 7-Day Easy Returns'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/90">
            <button
              onClick={() => onNavigate('resell')}
              className="hover:text-yellow-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <span>💼</span> {lang === 'मराठी' ? 'रिसेल करा आणि कमवा' : 'Become a Reseller'}
            </button>
            <span className="text-white/40">|</span>
            <button
              onClick={toggleLanguage}
              className="hover:text-yellow-300 transition-colors flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full"
            >
              <span>🌐</span> {lang}
            </button>
            <span className="text-white/40">|</span>
            <button
              onClick={() => onNavigate('profile')}
              className="hover:text-yellow-300 transition-colors"
            >
              24x7 Help Center
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <div className="border-b border-gray-100 dark:border-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          {/* Desktop Single-Row Layout (md+) */}
          <div className="hidden md:flex items-center gap-2.5 sm:gap-3 md:gap-5">
            {/* Universal Back Button when not on home page */}
            {currentPage !== 'home' && (
              <button
                onClick={onBack || (() => onNavigate('home'))}
                title="Go Back (मागे जा)"
                aria-label="Go Back"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-pink-100 dark:bg-gray-800 dark:hover:bg-pink-950/40 text-gray-700 dark:text-gray-200 hover:text-[#9F2089] dark:hover:text-[#F43397] transition-all active:scale-95 text-xs font-bold flex-shrink-0 border border-gray-200 dark:border-gray-700 shadow-xs group"
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:-translate-x-0.5 transition-transform">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Back</span>
              </button>
            )}

            {/* Shopio Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex-shrink-0 flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9F2089] via-[#D81B80] to-[#F43397] flex items-center justify-center shadow-md shadow-[#9F2089]/20 group-hover:scale-105 transition-transform text-white font-black text-xl">
                S
              </div>
              <div>
                <div className="font-black text-2xl tracking-tight leading-none text-[#9F2089] dark:text-[#F43397] font-sans flex items-center">
                  <span>Shopio</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F43397] ml-0.5 inline-block"></span>
                </div>
                <div className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 tracking-wide leading-none mt-0.5">
                  Lowest Prices Guaranteed
                </div>
              </div>
            </button>

            {/* Location / Deliver to */}
            <button
              onClick={() => setPincodeModalOpen(true)}
              className="hidden lg:flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 hover:border-[#9F2089] hover:bg-[#FDF2F8] dark:hover:bg-gray-800 transition-all flex-shrink-0"
            >
              <span className="text-[#9F2089] text-base leading-none">📍</span>
              <div className="text-left">
                <div className="text-[9px] text-gray-400 dark:text-gray-500 leading-none">Deliver to</div>
                <div className="font-bold text-gray-800 dark:text-gray-200 text-xs leading-tight">
                  {currentCity} {currentPincode}
                </div>
              </div>
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24" className="text-gray-400 ml-1">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            {/* Desktop Search Bar */}
            {renderSearchBar(false)}

            {/* Action Icons & Profile */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Reseller link desktop */}
              <button
                onClick={() => onNavigate('resell')}
                className={`hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all ${currentPage === 'resell'
                    ? 'bg-pink-100 dark:bg-gray-800 text-[#9F2089] dark:text-[#F43397]'
                    : 'text-gray-700 dark:text-gray-200 hover:text-[#9F2089] hover:bg-pink-50 dark:hover:bg-gray-800'
                  }`}
              >
                <span>💼</span>
                <span>Resell & Earn</span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={isLoggedIn ? () => setUserDropdownOpen(!userDropdownOpen) : onLoginClick}
                  className="flex flex-col items-center px-2.5 py-1 text-gray-700 dark:text-gray-200 hover:text-[#9F2089] hover:bg-pink-50 dark:hover:bg-gray-800 rounded-xl transition-all group"
                >
                  <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-gray-700 flex items-center justify-center text-xs text-[#9F2089] dark:text-[#F43397] font-bold group-hover:scale-105 transition-transform">
                    {isLoggedIn ? 'CP' : '👤'}
                  </div>
                  <span className="text-[10px] mt-0.5 font-bold">{isLoggedIn ? 'Profile' : 'Sign In'}</span>
                </button>

                {isLoggedIn && userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#161F30] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-fade-in"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="font-bold text-sm text-gray-800 dark:text-gray-100">Hello, Chetan!</p>
                      <p className="text-xs text-gray-400">chetan@gmail.com</p>
                    </div>
                    <button
                      onClick={() => onNavigate('orders')}
                      className="w-full px-4 py-2.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-[#9F2089] flex items-center gap-2 font-medium"
                    >
                      <span>📦</span> My Orders
                    </button>
                    <button
                      onClick={() => onNavigate('profile')}
                      className="w-full px-4 py-2.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-[#9F2089] flex items-center gap-2 font-medium"
                    >
                      <span>🪙</span> Shopio Balance & Coins (350)
                    </button>
                    <button
                      onClick={() => onNavigate('profile')}
                      className="w-full px-4 py-2.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-[#9F2089] flex items-center gap-2 font-medium"
                    >
                      <span>⚙️</span> Settings & Profile
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-bold border-t border-gray-100 dark:border-gray-800"
                    >
                      <span>🚪</span> लॉगआउट करा (Logout)
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => onNavigate('wishlist')}
                className="relative flex flex-col items-center px-2.5 py-1 text-gray-700 dark:text-gray-200 hover:text-[#9F2089] hover:bg-pink-50 dark:hover:bg-gray-800 rounded-xl transition-all group"
              >
                <div className="relative">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    className="group-hover:stroke-[#9F2089] transition-colors"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-[#F43397] text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-1 animate-bounce-in shadow-xs">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 font-bold">Wishlist</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => onNavigate('cart')}
                className="relative flex flex-col items-center px-2.5 py-1 text-gray-700 dark:text-gray-200 hover:text-[#9F2089] hover:bg-pink-50 dark:hover:bg-gray-800 rounded-xl transition-all group"
              >
                <div className="relative">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    className="group-hover:stroke-[#9F2089] transition-colors"
                  >
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-[#9F2089] text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-1 animate-bounce-in shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 font-bold">Cart</span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="flex flex-col items-center px-2 py-1 text-gray-700 dark:text-gray-200 hover:text-yellow-500 rounded-xl transition-all"
              >
                <span className="text-base leading-none">{darkMode ? '☀️' : '🌙'}</span>
                <span className="text-[9px] mt-0.5 font-semibold text-gray-400">{darkMode ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Dual-Row Layout (< md) */}
          <div className="md:hidden flex flex-col gap-2">
            {/* Row 1: Back + Logo + Location + Dark Mode + Cart + Hamburger */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 min-w-0">
                {currentPage !== 'home' && (
                  <button
                    onClick={onBack || (() => onNavigate('home'))}
                    title="Go Back"
                    className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex-shrink-0"
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}

                <button
                  onClick={() => onNavigate('home')}
                  className="flex items-center gap-2 text-left flex-shrink-0 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#9F2089] via-[#D81B80] to-[#F43397] flex items-center justify-center text-white font-black text-base shadow-xs">
                    S
                  </div>
                  <div className="font-black text-xl tracking-tight leading-none text-[#9F2089] dark:text-[#F43397]">
                    Shopio<span className="w-1.5 h-1.5 rounded-full bg-[#F43397] ml-0.5 inline-block" />
                  </div>
                </button>
              </div>

              {/* Mobile Right Controls */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setPincodeModalOpen(true)}
                  className="flex items-center gap-1 text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-pink-50 dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <span>📍</span>
                  <span className="max-w-[55px] truncate">{currentCity}</span>
                </button>

                <button
                  onClick={toggleDarkMode}
                  title="Toggle Mode"
                  className="p-1.5 text-gray-700 dark:text-gray-200 hover:text-yellow-500 rounded-lg text-sm"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>

                <button
                  onClick={() => onNavigate('cart')}
                  className="relative p-1.5 text-gray-700 dark:text-gray-200 rounded-lg"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#9F2089] text-white text-[9px] rounded-full min-w-[15px] h-3.5 flex items-center justify-center font-bold px-0.5">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 text-gray-700 dark:text-gray-200 rounded-lg"
                  aria-label="Toggle Menu"
                >
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Row 2: Full Width Search Bar */}
            {renderSearchBar(true)}
          </div>
        </div>
      </div>

      {/* ── Nav Categories Bar ── */}
      <nav className="bg-white dark:bg-[#161F30] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center overflow-x-auto scrollbar-hide py-0.5">
            {navCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onNavigate('listing', { category: cat.key })}
                className="flex-shrink-0 px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-semibold transition-all border-b-2 whitespace-nowrap text-gray-700 dark:text-gray-200 hover:text-[#9F2089] hover:border-[#9F2089] border-transparent flex items-center gap-1 sm:gap-1.5"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1.5 sm:mx-2 flex-shrink-0" />
            <button
              onClick={() => onNavigate('listing', { badge: 'Lowest Price' })}
              className="flex-shrink-0 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[#F43397] hover:text-[#9F2089] border-b-2 border-transparent hover:border-[#F43397] whitespace-nowrap flex items-center gap-1"
            >
              <span>🔥</span> Under ₹299
            </button>
            <button
              onClick={() => onNavigate('listing', { badge: 'Best Seller' })}
              className="flex-shrink-0 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-orange-600 hover:text-orange-700 border-b-2 border-transparent hover:border-orange-500 whitespace-nowrap flex items-center gap-1"
            >
              <span>⭐</span> Best Sellers
            </button>
          </div>
        </div>
      </nav>

      {/* ── Pincode Modal ── */}
      {pincodeModalOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setPincodeModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#161F30] rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <h3 className="font-bold text-base text-gray-800 dark:text-gray-100">Select Delivery Location</h3>
              </div>
              <button
                onClick={() => setPincodeModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Enter your pincode to check product availability and faster delivery options.
            </p>
            <form onSubmit={handleUpdatePincode} className="space-y-3">
              <input
                type="text"
                placeholder="Enter 6 digit pincode (e.g. 400001)"
                maxLength={6}
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white"
                autoFocus
              />
              <button
                type="submit"
                disabled={newPinInput.length !== 6}
                className="w-full py-2.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-bold rounded-xl disabled:opacity-40 text-sm transition-all"
              >
                Apply Location
              </button>
            </form>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-[11px] text-gray-400 font-semibold mb-2">Quick Cities:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Mumbai', pin: '400001' },
                  { name: 'Pune', pin: '411001' },
                  { name: 'Nagpur', pin: '440001' },
                  { name: 'Delhi', pin: '110001' },
                  { name: 'Bengaluru', pin: '560001' },
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setCurrentCity(c.name);
                      setCurrentPincode(c.pin);
                      localStorage.setItem('meesho_city', c.name);
                      localStorage.setItem('meesho_pin', c.pin);
                      setPincodeModalOpen(false);
                    }}
                    className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#9F2089]"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Menu Drawer ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#161F30] w-72 h-full shadow-2xl animate-slide-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center font-black text-sm">
                    S
                  </div>
                  <div>
                    <span className="font-black text-lg tracking-tight">Shopio</span>
                    <p className="text-[10px] text-pink-100">Lowest Prices Everywhere</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {/* Language switcher */}
              <div className="bg-pink-50 dark:bg-gray-800 rounded-xl p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">भाषा / Language</span>
                <button
                  onClick={toggleLanguage}
                  className="bg-[#9F2089] text-white text-xs font-bold px-3 py-1 rounded-lg"
                >
                  {lang}
                </button>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                <div className="space-y-1">
                  {navCategories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        onNavigate('listing', { category: cat.key });
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-xl hover:bg-pink-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold flex items-center gap-2.5 transition-colors"
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">My Account</p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onNavigate('orders');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded-xl hover:bg-pink-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2"
                  >
                    <span>📦</span> My Orders
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('wishlist');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded-xl hover:bg-pink-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2"
                  >
                    <span>❤️</span> Wishlist ({wishlistCount})
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded-xl hover:bg-pink-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2"
                  >
                    <span>👤</span> Profile & Settings
                  </button>
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-2"
                    >
                      <span>🚪</span> लॉगआउट करा (Logout)
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLoginClick?.();
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-xl text-[#9F2089] dark:text-[#F43397] hover:bg-pink-50 dark:hover:bg-pink-950/30 font-bold flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-2"
                    >
                      <span>🔑</span> लॉगिन करा (Sign In)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}