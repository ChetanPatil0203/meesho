import { useState, useCallback, useEffect } from 'react';
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
import ResellPage from './pages/ResellPage';
import Toast from './components/Toast';
import SpinWheelModal from './components/SpinWheelModal';
import FloatingWidgets from './components/FloatingWidgets';
import VideoReelsModal from './components/VideoReelsModal';
import CustomerLoginPage from './pages/CustomerLoginPage';
import ShopioAdminPortal from '@admin/AdminPortal';
import adminService from '@admin/adminService';
import { triggerConfetti } from './utils/confetti';
import AuthModal from './components/AuthModal';
import { IncomingOtpBanner, RegistrationSuccessSmsModal } from './components/SmsNotificationBanner';
import PortalSelectPage from './pages/PortalSelectPage';
import SearchResultsPage from './pages/SearchResultsPage';

const noHeaderPages = ['portal', 'login', 'admin', 'admin-web'];
const noFooterPages = ['portal', 'login', 'checkout', 'order-success', 'admin', 'admin-web'];

export default function App() {
  const [nav, setNav] = useState(() => {
    try {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      const search = new URLSearchParams(window.location.search);
      const isDefaultAdmin = import.meta.env.VITE_DEFAULT_PORTAL === 'admin';

      if (
        hash === 'admin' ||
        hash === 'admin-web' ||
        path === 'admin' ||
        path === 'admin-web' ||
        search.has('admin') ||
        search.get('panel') === 'admin' ||
        isDefaultAdmin
      ) {
        return { page: 'admin' };
      }
      if (hash === 'login' || path === 'login') return { page: 'login' };
      if (hash === 'home' || path === 'home') return { page: 'home' };
      if (hash && hash !== '') return { page: hash };
      if (path && path !== '') return { page: path };
    } catch {
      // ignore
    }
    return { page: 'home' };
  });

  // Listen for hash / URL changes (e.g. typing #admin in URL bar)
  useEffect(() => {
    const handleLocationChange = () => {
      try {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        const path = window.location.pathname.replace(/^\//, '').toLowerCase();
        const search = new URLSearchParams(window.location.search);
        if (
          hash === 'admin' ||
          hash === 'admin-web' ||
          path === 'admin' ||
          path === 'admin-web' ||
          search.has('admin') ||
          search.get('panel') === 'admin'
        ) {
          setNav({ page: 'admin' });
        } else if (hash === 'home' || path === 'home' || hash === '') {
          setNav({ page: 'home' });
        } else if (hash && hash !== '') {
          setNav({ page: hash });
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);
  const [navHistory, setNavHistory] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState(['p1', 'p4']);
  const [toasts, setToasts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('meesho_user_profile') || localStorage.getItem('shopio_auth_token'));
  });
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState('login');
  const [incomingOtp, setIncomingOtp] = useState(null);
  const [registrationSms, setRegistrationSms] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [reelsModal, setReelsModal] = useState({ open: false, index: 0 });

  const getParentPage = useCallback((currentPage, currentData) => {
    switch (currentPage) {
      case 'product':
        return currentData?.category
          ? { page: 'listing', data: { category: currentData.category } }
          : { page: 'home' };
      case 'checkout':
        return currentData?.buyNow
          ? { page: 'product', data: { productId: currentData.buyNow.id } }
          : { page: 'cart' };
      case 'order-tracking':
        return { page: 'orders' };
      case 'orders':
        return { page: 'profile' };
      case 'order-success':
      case 'listing':
      case 'search':
      case 'cart':
      case 'wishlist':
      case 'profile':
      case 'resell':
        return { page: 'home' };
      case 'home':
      case 'admin':
      case 'admin-web':
      case 'portal':
      default:
        return { page: 'portal' };
    }
  }, []);

  const navigate = useCallback((page, data, replace = false) => {
    setNav((curr) => {
      if (!replace && (curr.page !== page || JSON.stringify(curr.data) !== JSON.stringify(data))) {
        setNavHistory((prev) => [...prev, curr]);
      }
      return { page, data };
    });
    try {
      if (replace) {
        window.history.replaceState({ page, data }, '', `#${page}`);
      } else {
        window.history.pushState({ page, data }, '', `#${page}`);
      }
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    setNavHistory((prevHistory) => {
      if (prevHistory.length > 0) {
        const last = prevHistory[prevHistory.length - 1];
        setNav(last);
        try {
          window.history.replaceState({ page: last.page, data: last.data }, '', `#${last.page}`);
        } catch {
          // ignore
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return prevHistory.slice(0, -1);
      } else {
        setNav((curr) => {
          const fallback = getParentPage(curr.page, curr.data);
          try {
            window.history.replaceState({ page: fallback.page, data: fallback.data }, '', `#${fallback.page}`);
          } catch {
            // ignore
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return fallback;
        });
        return [];
      }
    });
  }, [getParentPage]);

  // Support browser Back/Forward navigation
  useEffect(() => {
    try {
      const initial = window.location.hash.replace('#', '') || 'portal';
      window.history.replaceState({ page: initial }, '', `#${initial}`);
    } catch {
      // ignore
    }

    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setNav({ page: event.state.page, data: event.state.data });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const hash = window.location.hash.replace('#', '') || 'portal';
        setNav({ page: hash });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const addToCart = useCallback(
    (product, qty = 1, color, size) => {
      setCartItems((prev) => {
        const existing = prev.find(
          (i) => i.product.id === product.id && i.color === color && i.size === size
        );
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id && i.color === color && i.size === size
              ? { ...i, quantity: Math.min(10, i.quantity + qty) }
              : i
          );
        }
        return [...prev, { product, quantity: qty, color, size }];
      });
      triggerConfetti(1500);
      showToast(`"${product.name.slice(0, 25)}..." added to cart 🛒`);
    },
    [showToast]
  );

  const updateQuantity = useCallback((productId, qty) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity: Math.min(10, qty) } : i))
      );
    }
  }, []);

  const removeItem = useCallback(
    (productId) => {
      setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
      showToast('Item removed from cart');
    },
    [showToast]
  );

  const toggleWishlist = useCallback(
    (id) => {
      setWishlist((prev) => {
        if (prev.includes(id)) {
          showToast('Removed from wishlist');
          return prev.filter((w) => w !== id);
        }
        showToast('Saved to wishlist ❤️');
        return [...prev, id];
      });
    },
    [showToast]
  );

  const handleSearchSubmit = (q) => {
    navigate('search', { query: q });
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('meesho_user_profile');
    sessionStorage.removeItem('meesho_user_profile');
    localStorage.removeItem('shopio_auth_token');
    localStorage.removeItem('shopio_customer_logged_in');
    setIsLoggedIn(false);
    setShowSpinWheel(false);
    setShowAiChat(false);
    showToast('यशस्वीरीत्या लॉगआउट झाले! (Logged out successfully)', 'info');
    navigate('home');
  }, [navigate, showToast]);

  const { page, data } = nav;
  const showHeader = !noHeaderPages.includes(page);
  const showFooter = !noFooterPages.includes(page) && !noHeaderPages.includes(page);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F19] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors">
      {showHeader && (
        <Header
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          onNavigate={navigate}
          onBack={goBack}
          currentPage={page}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => navigate('login')}
          onLogout={handleLogout}
        />
      )}

      <div className={`flex-1 ${showHeader ? 'pb-16 md:pb-0' : ''}`}>
        {page === 'portal' && (
          <PortalSelectPage
            onSelectAdmin={() => navigate('admin')}
            onSelectUser={() => navigate('home')}
            onLoginSuccess={(user) => {
              setIsLoggedIn(true);
              navigate('home');
            }}
          />
        )}
        {page === 'login' && (
          <CustomerLoginPage
            onSuccess={(user) => {
              setIsLoggedIn(true);
              navigate('home');
            }}
            onNavigate={navigate}
            onShowToast={showToast}
            onShowIncomingOtp={(data) => setIncomingOtp(data)}
            onShowRegistrationSms={(sms) => setRegistrationSms(sms)}
          />
        )}
        {page === 'home' && (
          <HomePage
            onNavigate={navigate}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onOpenSpinWheel={() => setShowSpinWheel(true)}
            onOpenReel={(index) => setReelsModal({ open: true, index })}
          />
        )}
        {page === 'listing' && (
          <ProductListingPage
            onNavigate={navigate}
            onBack={goBack}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            filters={data}
          />
        )}
        {page === 'search' && (
          <SearchResultsPage
            query={data?.query || searchQuery || ''}
            onNavigate={navigate}
            onBack={goBack}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
          />
        )}
        {page === 'product' && (
          <ProductDetailPage
            productId={data?.productId || 'p1'}
            onNavigate={navigate}
            onBack={goBack}
            isWishlisted={wishlist.includes(data?.productId || '')}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onShowToast={showToast}
          />
        )}
        {page === 'cart' && (
          <CartPage
            items={cartItems}
            onNavigate={navigate}
            onBack={goBack}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onShowToast={showToast}
            onMoveToWishlist={(prod) => {
              removeItem(prod.id);
              toggleWishlist(prod.id);
            }}
          />
        )}
        {page === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            checkoutData={data}
            onNavigate={navigate}
            onBack={goBack}
            onShowToast={showToast}
            onClearCart={() => setCartItems([])}
          />
        )}
        {page === 'order-success' && (
          <OrderSuccessPage
            orderId={data?.orderId || 'MEE-789123'}
            total={data?.total || 0}
            address={data?.address}
            items={data?.items}
            onNavigate={navigate}
            onBack={goBack}
          />
        )}
        {page === 'order-tracking' && (
          <OrderTrackingPage
            orderId={data?.orderId || 'MEE-948123'}
            onNavigate={navigate}
            onBack={goBack}
          />
        )}
        {page === 'orders' && (
          <OrdersPage
            onNavigate={navigate}
            onBack={goBack}
            onAddToCart={addToCart}
            onShowToast={showToast}
          />
        )}
        {page === 'profile' && (
          <ProfilePage
            onNavigate={navigate}
            onBack={goBack}
            onShowToast={showToast}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          />
        )}
        {page === 'wishlist' && (
          <WishlistPage
            wishlist={wishlist}
            onNavigate={navigate}
            onBack={goBack}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
          />
        )}
        {(page === 'resell' || page === 'resell-info') && (
          <ResellPage
            onNavigate={navigate}
            onBack={goBack}
            onShowToast={showToast}
            onAddToCart={addToCart}
          />
        )}
        {(page === 'admin' || page === 'admin-web') && (
          <ShopioAdminPortal
            onNavigate={navigate}
            onShowToast={showToast}
          />
        )}
      </div>

      {showFooter && <Footer onNavigate={navigate} />}

      {/* ── Mobile Bottom Navigation Bar ── */}
      {showHeader && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#161F30]/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden z-40 safe-area-bottom">
          <div className="grid grid-cols-5 px-1 py-1.5">
            {[
              {
                icon: (active) => (
                  <svg width="20" height="20" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? '0' : '2'} viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
                label: 'Home',
                page: 'home',
              },
              {
                icon: (active) => (
                  <svg width="20" height="20" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                ),
                label: 'Categories',
                page: 'listing',
              },
              {
                icon: (active) => (
                  <svg width="20" height="20" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                  </svg>
                ),
                label: 'Orders',
                page: 'orders',
              },
              {
                icon: (active) => (
                  <span className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}>💼</span>
                ),
                label: 'Resell',
                page: 'resell',
              },
              {
                icon: (active) => (
                  <div className="relative">
                    <svg width="20" height="20" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" fill="none" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2.5 bg-[#F43397] text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-black px-1 shadow-xs">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </div>
                ),
                label: 'Cart',
                page: 'cart',
              },
            ].map((item) => {
              const isActive = nav.page === item.page || (item.page === 'profile' && nav.page === 'profile');
              return (
                <button
                  key={item.label}
                  onClick={() => (item.page === 'login' ? setShowLogin(true) : navigate(item.page))}
                  className={`flex flex-col items-center py-1 gap-1 transition-all relative ${isActive ? 'text-[#9F2089] dark:text-[#F43397]' : 'text-gray-400 dark:text-gray-500'
                    }`}
                >
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#9F2089] dark:bg-[#F43397] rounded-full" />
                  )}
                  <span className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                    {item.icon(isActive)}
                  </span>
                  <span className={`text-[10px] leading-none ${isActive ? 'font-black' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* ── Login / Sign Up Modal with Mobile + OTP Flow & Incoming SMS Notification ── */}
      <AuthModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        initialTab={loginTab}
        onSuccess={() => {
          setIsLoggedIn(true);
          setShowLogin(false);
        }}
        onShowToast={showToast}
        onShowIncomingOtp={(otpData) => setIncomingOtp(otpData)}
        onShowRegistrationSms={(smsData) => setRegistrationSms(smsData)}
      />

      {/* ── Simulated Incoming OTP SMS Notification Banner ── */}
      <IncomingOtpBanner
        otpData={incomingOtp}
        onAutoFill={() => setIncomingOtp(null)}
        onClose={() => setIncomingOtp(null)}
      />

      {/* ── Simulated Registration Success Official SMS Popup ── */}
      <RegistrationSuccessSmsModal
        smsData={registrationSms}
        onClose={() => setRegistrationSms(null)}
      />

      {/* ── Shopping Customer Modals & Widgets (Only on Customer Shopping App & Only for Logged-In Users) ── */}
      {page !== 'portal' && page !== 'admin' && page !== 'admin-web' && page !== 'login' && (
        <>
          {/* AI Chat Box & Spin Wheel: ONLY for Logged-In Customers */}
          {isLoggedIn && (
            <>
              <FloatingWidgets
                isLoggedIn={isLoggedIn}
                onOpenAiChat={() => setShowAiChat(true)}
                onOpenSpinWheel={() => setShowSpinWheel(true)}
                onShowToast={showToast}
              />

              <AiChatModal
                isOpen={showAiChat}
                onClose={() => setShowAiChat(false)}
                onOpenSpinWheel={() => {
                  setShowAiChat(false);
                  setShowSpinWheel(true);
                }}
                onNavigate={navigate}
                onAddToCart={addToCart}
                onShowToast={showToast}
                isLoggedIn={isLoggedIn}
              />

              <SpinWheelModal
                isOpen={showSpinWheel}
                onClose={() => setShowSpinWheel(false)}
                onShowToast={showToast}
                onNavigate={navigate}
              />
            </>
          )}

          <VideoReelsModal
            isOpen={reelsModal.open}
            initialReelIndex={reelsModal.index}
            onClose={() => setReelsModal({ open: false, index: 0 })}
            onAddToCart={addToCart}
            onBuyNow={(prod) => {
              navigate('checkout', { buyNow: prod, qty: 1 });
            }}
            onShowToast={showToast}
          />
        </>
      )}

      {/* ── Toast Notifications ── */}
      <div className="fixed top-4 right-4 z-[90] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>
    </div>
  );
}