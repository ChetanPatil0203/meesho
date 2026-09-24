import { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import SearchResultsPage from './pages/SearchResultsPage';
import Toast from './components/Toast';




















const noHeaderPages = [];
const noFooterPages = ['checkout', 'order-success'];

export default function App() {
  const [nav, setNav] = useState({ page: 'home' });
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '', name: '', phone: '' });

  const navigate = useCallback((page, data) => {
    setNav({ page, data });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const addToCart = useCallback((product, qty = 1, color, size) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.color === color && i.size === size);
      if (existing) {
        return prev.map((i) => i.product.id === product.id && i.color === color && i.size === size ?
          { ...i, quantity: Math.min(10, i.quantity + qty) } :
          i
        );
      }
      return [...prev, { product, quantity: qty, color, size }];
    });
    showToast(`"${product.name.slice(0, 30)}..." added to cart 🛒`);
  }, [showToast]);

  const updateQuantity = useCallback((productId, qty) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setCartItems((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity: Math.min(10, qty) } : i));
    }
  }, []);

  const removeItem = useCallback((productId) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    showToast('Item removed from cart');
  }, [showToast]);

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => {
      if (prev.includes(id)) {
        showToast('Removed from wishlist');
        return prev.filter((w) => w !== id);
      }
      showToast('Added to wishlist ❤️');
      return [...prev, id];
    });
  }, [showToast]);

  const handleSearchSubmit = (q) => {
    navigate('search', { query: q });
  };

  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) return;
    setIsLoggedIn(true);
    setShowLogin(false);
    showToast('Welcome back! 👋');
  };

  const handleSignup = () => {
    if (!loginForm.name || !loginForm.email || !loginForm.password) return;
    setIsLoggedIn(true);
    setShowLogin(false);
    showToast('Account created successfully! 🎉');
  };

  const { page, data } = nav;
  const showHeader = !noHeaderPages.includes(page);
  const showFooter = !noFooterPages.includes(page) && !noHeaderPages.includes(page);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col">
      {showHeader &&
        <Header
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          onNavigate={navigate}
          currentPage={page}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setShowLogin(true)} />

      }

      <div className="flex-1">
        {page === 'home' &&
          <HomePage onNavigate={navigate} wishlist={wishlist} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} />
        }
        {page === 'listing' &&
          <ProductListingPage onNavigate={navigate} wishlist={wishlist} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} filters={data} />
        }
        {page === 'search' &&
          <SearchResultsPage
            query={data?.query || searchQuery || ''}
            onNavigate={navigate}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart} />

        }
        {page === 'product' &&
          <ProductDetailPage
            productId={data?.productId || 'p1'}
            onNavigate={navigate}
            isWishlisted={wishlist.includes(data?.productId || '')}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onShowToast={showToast} />

        }
        {page === 'cart' &&
          <CartPage items={cartItems} onNavigate={navigate} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} onShowToast={showToast} />
        }
        {page === 'checkout' &&
          <CheckoutPage cartItems={cartItems} onNavigate={navigate} onShowToast={showToast} onClearCart={() => setCartItems([])} />
        }
        {page === 'order-success' &&
          <OrderSuccessPage orderId={data?.orderId || 'SK123'} total={data?.total || 0} address={data?.address} onNavigate={navigate} />
        }
        {page === 'order-tracking' &&
          <OrderTrackingPage orderId={data?.orderId || 'SK123456789'} onNavigate={navigate} />
        }
        {page === 'orders' &&
          <OrdersPage onNavigate={navigate} />
        }
        {page === 'profile' &&
          <ProfilePage onNavigate={navigate} onShowToast={showToast} isLoggedIn={isLoggedIn} />
        }
        {page === 'wishlist' &&
          <WishlistPage wishlist={wishlist} onNavigate={navigate} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} />
        }
      </div>

      {showFooter && <Footer onNavigate={navigate} />}

      {/* ── Mobile Bottom Nav ── */}
      {showHeader &&
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden z-40 safe-area-bottom">
          <div className="grid grid-cols-6 px-1 pt-1 pb-1">
            {[
              {
                icon: (active) =>
                  <svg width="22" height="22" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? '0' : '1.8'} viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>,

                label: 'Home', page: 'home'
              },
              {
                icon: (active) =>
                  <svg width="22" height="22" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>,

                label: 'Categories', page: 'listing'
              },
              {
                icon: (_active) =>
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>,

                label: 'Search', page: 'search'
              },
              {
                icon: (active) =>
                  <svg width="22" height="22" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" />
                    <line x1="9" y1="12" x2="15" y2="12" stroke="white" strokeWidth="1.5" /><line x1="9" y1="16" x2="13" y2="16" stroke="white" strokeWidth="1.5" />
                  </svg>,

                label: 'Orders', page: 'orders'
              },
              {
                icon: (active) =>
                  <svg width="22" height="22" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>,

                label: 'Profile', page: isLoggedIn ? 'profile' : 'login'
              },
              {
                icon: (active) =>
                  <div className="relative">
                    <svg width="22" height="22" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" fill="none" />
                    </svg>
                    {cartCount > 0 &&
                      <span className="absolute -top-2 -right-2 bg-[#3B5BDB] text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-black px-1 shadow-sm">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    }
                  </div>,

                label: 'Cart', page: 'cart'
              }].
              map((item) => {
                const isActive = nav.page === item.page || item.page === 'profile' && nav.page === 'profile';
                return (
                  <button
                    key={item.label}
                    onClick={() => item.page === 'login' ? setShowLogin(true) : navigate(item.page)}
                    className={`flex flex-col items-center py-2 gap-1 transition-all duration-200 relative ${isActive ? 'text-[#3B5BDB]' : 'text-gray-400'}`}>

                    {isActive &&
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#3B5BDB] rounded-full" />
                    }
                    <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                      {item.icon(isActive)}
                    </span>
                    <span className={`text-[9px] leading-none font-medium ${isActive ? 'font-bold' : ''}`}>
                      {item.label}
                    </span>
                  </button>);

              })}
          </div>
        </nav>
      }
      <div className="h-16 md:hidden" />

      {/* Login Modal */}
      {showLogin &&
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setShowLogin(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-[#3B5BDB] to-[#2F4AC4] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center font-bold text-sm">S</div>
                    <span className="font-bold">ShopKart</span>
                  </div>
                  <h2 className="text-xl font-bold">{loginTab === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
                  <p className="text-blue-200 text-sm mt-0.5">{loginTab === 'login' ? 'Login to continue shopping' : 'Join millions of shoppers'}</p>
                </div>
                <button onClick={() => setShowLogin(false)} className="text-white/70 hover:text-white text-xl">✕</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button onClick={() => setLoginTab('login')} className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${loginTab === 'login' ? 'border-[#3B5BDB] text-[#3B5BDB]' : 'border-transparent text-gray-500'}`}>Login</button>
              <button onClick={() => setLoginTab('signup')} className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${loginTab === 'signup' ? 'border-[#3B5BDB] text-[#3B5BDB]' : 'border-transparent text-gray-500'}`}>Sign Up</button>
            </div>

            <div className="p-6 space-y-3">
              {loginTab === 'signup' &&
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                  <input type="text" placeholder="Enter your name" value={loginForm.name} onChange={(e) => setLoginForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#3B5BDB]" />
                </div>
              }
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email / Mobile</label>
                <input type="text" placeholder="Enter email or mobile number" value={loginForm.email} onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#3B5BDB]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                <input type="password" placeholder="Enter password" value={loginForm.password} onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#3B5BDB]" />
              </div>
              {loginTab === 'login' && <div className="text-right"><button className="text-xs text-[#3B5BDB] hover:underline">Forgot Password?</button></div>}

              <button
                onClick={loginTab === 'login' ? handleLogin : handleSignup}
                className="w-full py-3 bg-[#3B5BDB] text-white font-bold rounded-xl hover:bg-[#2F4AC4] transition-colors">

                {loginTab === 'login' ? 'Login' : 'Create Account'}
              </button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <span className="text-lg">G</span> Continue with Google
              </button>

              {/* Quick links */}
              <div className="text-center pt-2 border-t border-gray-100">
                <button onClick={() => navigate('seller')} className="text-xs text-[#3B5BDB] hover:underline">Become a Seller →</button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[70] space-y-2 pointer-events-none">
        {toasts.map((toast) =>
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
        )}
      </div>
    </div>);

}