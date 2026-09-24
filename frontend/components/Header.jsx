import { useState } from 'react';













const navCategories = ['Women', 'Men', 'Kids', 'Beauty', 'Electronics', 'Home & Kitchen', 'Footwear', 'Accessories', 'Grocery', 'Sports'];

const allSuggestions = [
'Women Kurti', 'Women Saree', 'Men Shirt', 'Running Shoes', 'boAt Headphones',
'Silk Saree', 'Yoga Mat', 'Redmi 5G Phone', 'Kids Kurta', 'Lakme Primer',
'JBL Speaker', 'Leather Handbag', 'Diamond Necklace', 'Air Fryer', 'Smart Band'];


export default function Header({ cartCount, wishlistCount, onNavigate, currentPage, searchQuery, onSearchChange, onSearchSubmit, isLoggedIn, onLoginClick }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Dark Mode state with localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('sk_theme') === 'dark' || document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sk_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sk_theme', 'light');
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
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onSearchChange(transcript);
        onSearchSubmit(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const recentSearches = ['Women Kurti', 'Running Shoes', 'Mobile Under 15000'];
  const trendingSearches = ['Silk Saree', 'boAt Earphones', 'Men Shirt', 'Yoga Mat', 'Air Fryer'];

  const suggestions = searchQuery.length > 0 ?
  allSuggestions.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 7) :
  [];

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearchSubmit(searchQuery);
      setSearchFocused(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Main header */}
      <div className="border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 md:gap-4">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex-shrink-0 flex items-center gap-2">
            <div className="w-9 h-9 bg-[#3B5BDB] rounded-xl flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2" />
                <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <div className="font-extrabold text-[#3B5BDB] text-lg leading-none tracking-tight">ShopKart</div>
              <div className="text-[9px] text-gray-400 leading-none mt-0.5">Shop More, Live Better</div>
            </div>
          </button>

          {/* Location */}
          <button className="hidden lg:flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg px-2.5 py-2 hover:border-[#3B5BDB] hover:text-[#3B5BDB] transition-colors flex-shrink-0">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <div className="text-left">
              <div className="text-[9px] text-gray-400 leading-none">Deliver to</div>
              <div className="font-semibold text-gray-700 text-xs leading-tight">Mumbai 400001</div>
            </div>
            <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
          </button>

          {/* Search */}
          <div className="flex-1 relative">
            <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-all ${
              isListening ? 'border-red-500 shadow-md ring-2 ring-red-200' : searchFocused ? 'border-[#3B5BDB] shadow-sm' : 'border-gray-200'
            }`}>
              <svg className="ml-3 flex-shrink-0 text-gray-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder={isListening ? 'Listening... Speak now 🎙️' : 'Search products, brands & more...'}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 px-3 py-2.5 text-sm bg-transparent text-gray-800 placeholder:text-gray-400" />
              
              {/* Voice search button */}
              <button
                type="button"
                onClick={startVoiceSearch}
                title="Search by Voice"
                className={`px-2.5 py-1.5 rounded-lg mr-1 transition-all ${
                  isListening
                    ? 'text-red-500 bg-red-50 animate-pulse'
                    : 'text-gray-400 hover:text-[#3B5BDB] hover:bg-blue-50'
                }`}
              >
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>

              {searchQuery &&
              <button onClick={() => onSearchChange('')} className="px-2 text-gray-400 hover:text-gray-600">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              }
              <button
                onClick={() => {if (searchQuery.trim()) {onSearchSubmit(searchQuery);setSearchFocused(false);}}}
                className="bg-[#3B5BDB] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#2F4AC4] transition-colors flex-shrink-0">
                Search
              </button>
            </div>

            {/* Search dropdown */}
            {searchFocused &&
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
                {searchQuery.length === 0 ?
              <div className="p-4">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Recent Searches</p>
                        {recentSearches.map((s) =>
                    <button key={s} onClick={() => {onSearchChange(s);onSearchSubmit(s);}}
                    className="flex items-center gap-2 w-full text-sm text-left py-1.5 text-gray-600 hover:text-[#3B5BDB] transition-colors">
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.5" /></svg>
                            {s}
                          </button>
                    )}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Trending Now</p>
                        {trendingSearches.map((s) =>
                    <button key={s} onClick={() => {onSearchChange(s);onSearchSubmit(s);}}
                    className="flex items-center gap-2 w-full text-sm text-left py-1.5 text-gray-600 hover:text-[#3B5BDB] transition-colors">
                            <span className="text-orange-400 text-base leading-none">🔥</span> {s}
                          </button>
                    )}
                      </div>
                    </div>
                    <div className="border-t border-gray-100 mt-3 pt-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Popular Categories</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['Women', 'Men', 'Electronics', 'Beauty', 'Kids', 'Sports'].map((c) =>
                    <button key={c} onClick={() => {setSearchFocused(false);onNavigate('listing', { category: c });}}
                    className="text-xs bg-blue-50 text-[#3B5BDB] px-3 py-1 rounded-full hover:bg-[#3B5BDB] hover:text-white transition-colors font-medium">
                            {c}
                          </button>
                    )}
                      </div>
                    </div>
                  </div> :
              suggestions.length > 0 ?
              <div className="py-2">
                    {suggestions.map((s) =>
                <button key={s} onClick={() => {onSearchChange(s);onSearchSubmit(s);setSearchFocused(false);}}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#3B5BDB] transition-colors text-left">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-gray-400 flex-shrink-0">
                          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <span dangerouslySetInnerHTML={{
                    __html: s.replace(new RegExp(`(${searchQuery})`, 'gi'), '<strong class="text-[#3B5BDB]">$1</strong>')
                  }} />
                      </button>
                )}
                  </div> :

              <div className="p-4 text-center text-sm text-gray-400">
                    Press Enter to search for "<strong className="text-gray-700">{searchQuery}</strong>"
                  </div>
              }
              </div>
            }
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-0.5">
            <button onClick={isLoggedIn ? () => onNavigate('profile') : onLoginClick}
            className="hidden sm:flex flex-col items-center px-3 py-1.5 text-gray-600 hover:text-[#3B5BDB] hover:bg-blue-50 rounded-xl transition-all group">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="group-hover:stroke-[#3B5BDB]">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-[10px] mt-0.5 font-medium">{isLoggedIn ? 'Profile' : 'Login'}</span>
            </button>

            <button onClick={() => onNavigate('wishlist')}
            className="relative hidden sm:flex flex-col items-center px-3 py-1.5 text-gray-600 hover:text-[#3B5BDB] hover:bg-blue-50 rounded-xl transition-all group">
              <div className="relative">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="group-hover:stroke-[#3B5BDB]">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                {wishlistCount > 0 &&
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-1">
                    {wishlistCount}
                  </span>
                }
              </div>
              <span className="text-[10px] mt-0.5 font-medium">Wishlist</span>
            </button>

            <button onClick={() => onNavigate('cart')}
            className="relative flex flex-col items-center px-3 py-1.5 text-gray-600 hover:text-[#3B5BDB] hover:bg-blue-50 rounded-xl transition-all group">
              <div className="relative">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="group-hover:stroke-[#3B5BDB]">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 &&
                <span className="absolute -top-2 -right-2 bg-[#3B5BDB] text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-1 animate-bounce-in">
                    {cartCount}
                  </span>
                }
              </div>
              <span className="text-[10px] mt-0.5 font-medium">Cart</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="flex flex-col items-center px-2.5 py-1.5 text-gray-600 hover:text-yellow-500 hover:bg-yellow-50/50 rounded-xl transition-all group"
            >
              <span className="text-lg leading-none transition-transform group-hover:scale-110">
                {darkMode ? '☀️' : '🌙'}
              </span>
              <span className="text-[10px] mt-0.5 font-medium">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-gray-600 hover:text-[#3B5BDB] rounded-lg">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Nav categories */}
      <nav className="hidden md:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {navCategories.map((cat) =>
            <button key={cat} onClick={() => onNavigate('listing', { category: cat })}
            className="flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-all border-b-2 whitespace-nowrap text-gray-600 hover:text-[#3B5BDB] hover:border-[#3B5BDB] border-transparent">
                {cat}
              </button>
            )}
            <div className="w-px h-4 bg-gray-200 mx-2 flex-shrink-0" />
            <button onClick={() => onNavigate('listing')}
            className="flex-shrink-0 px-4 py-2.5 text-sm font-semibold text-orange-500 hover:text-orange-600 border-b-2 border-transparent hover:border-orange-400 whitespace-nowrap">
              🔥 New Arrivals
            </button>
            <button onClick={() => onNavigate('listing', { badge: 'Best Seller' })}
            className="flex-shrink-0 px-4 py-2.5 text-sm font-semibold text-[#3B5BDB] hover:text-[#2F4AC4] border-b-2 border-transparent hover:border-[#3B5BDB] whitespace-nowrap">
              ⭐ Best Sellers
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen &&
      <div className="fixed inset-0 z-[60] bg-black/50 animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-72 h-full shadow-2xl animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#3B5BDB] to-[#2F4AC4]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
                <span className="font-bold text-white">ShopKart</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white/70 hover:text-white">✕</button>
            </div>
            <div className="p-3 overflow-y-auto h-[calc(100%-60px)]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-2">Categories</p>
              {navCategories.map((cat) =>
            <button key={cat} onClick={() => {onNavigate('listing', { category: cat });setMobileMenuOpen(false);}}
            className="w-full text-left px-3 py-2.5 text-sm rounded-xl hover:bg-blue-50 hover:text-[#3B5BDB] transition-colors text-gray-700 font-medium">
                  {cat}
                </button>
            )}
              <hr className="my-3 border-gray-100" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">My Account</p>
              <button onClick={() => {onNavigate('orders');setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2.5 text-sm rounded-xl hover:bg-blue-50 text-gray-700">📦 My Orders</button>
              <button onClick={() => {onNavigate('wishlist');setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2.5 text-sm rounded-xl hover:bg-blue-50 text-gray-700">❤️ Wishlist</button>
              <button onClick={() => {onNavigate('profile');setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2.5 text-sm rounded-xl hover:bg-blue-50 text-gray-700">👤 Profile</button>
            </div>
          </div>
        </div>
      }
    </header>);

}