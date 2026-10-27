import { useState } from 'react';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#12071A] text-gray-300 mt-12 border-t border-purple-950">
      {/* Newsletter / App download strip */}
      <div className="border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-white font-black text-lg flex items-center gap-2">
              <span className="text-yellow-400">🛍️</span> Shop on Shopio & Get Lowest Prices
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
              Subscribe to get exclusive WhatsApp deals, mega festival sales, and new supplier stock alerts
            </p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 text-green-400 font-bold bg-green-900/30 px-5 py-2.5 rounded-2xl border border-green-800 text-xs">
              <span>✓</span> You are subscribed to Shopio Alerts!
            </div>
          ) : (
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                className="flex-1 md:w-72 px-4 py-2.5 rounded-2xl bg-purple-950/40 border border-purple-800/60 text-white text-xs focus:border-[#F43397] focus:outline-none placeholder:text-gray-500"
              />
              <button
                onClick={handleSubscribe}
                className="px-5 py-2.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white rounded-2xl text-xs font-black hover:opacity-90 transition-opacity whitespace-nowrap active:scale-95"
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 mb-4 group text-left">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#9F2089] to-[#F43397] flex items-center justify-center font-black text-white text-base">
              S
            </div>
            <div>
              <span className="text-white font-black text-xl tracking-tight leading-none block">Shopio</span>
              <span className="text-[9px] text-pink-300 font-semibold leading-none">Lowest Prices Everyday</span>
            </div>
          </button>
          <p className="text-gray-400 leading-relaxed mb-4">
            India's #1 reselling and shopping platform. 15 Crore+ happy shoppers, 100% Free Delivery, Cash on Delivery, and Easy 7-day Returns.
          </p>
          <div className="space-y-1.5 text-gray-400">
            <div>📍 Mumbai, Maharashtra & Bangalore</div>
            <div>📞 1800-123-6337 (Toll Free 24x7)</div>
            <div>✉️ help@shopio.com</div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-black mb-3 text-sm">Top Categories</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <button onClick={() => onNavigate('listing', { category: 'Women' })} className="hover:text-white transition-colors">
                Sarees & Kurtis
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('listing', { category: 'Men' })} className="hover:text-white transition-colors">
                Men's Fashion
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('listing', { category: 'Kids' })} className="hover:text-white transition-colors">
                Baby & Kids Wear
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('listing', { category: 'Electronics' })} className="hover:text-white transition-colors">
                Electronics & Gadgets
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('listing', { category: 'Home & Kitchen' })} className="hover:text-white transition-colors">
                Home & Kitchenware
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('listing', { category: 'Beauty' })} className="hover:text-white transition-colors">
                Beauty & Personal Care
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-white font-black mb-3 text-sm">Customer Care</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors">
                Track My Order
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors">
                Returns & Refunds
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors">
                Cancel Order
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">
                Shopio Coins Balance
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">
                Help & Grievance
              </button>
            </li>
          </ul>
        </div>

        {/* Reselling & Suppliers */}
        <div>
          <h4 className="text-white font-black mb-3 text-sm">Earn with Shopio</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <button onClick={() => onNavigate('resell')} className="hover:text-white transition-colors">
                Become a Reseller (Zero Cost)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                Sell on Shopio (0% Commission)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                Supplier Hub
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                WhatsApp Margin Tool
              </button>
            </li>
          </ul>
        </div>

        {/* Company & Legal */}
        <div>
          <h4 className="text-white font-black mb-3 text-sm">Policies & Trust</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">7-Day Return Policy</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">Security & Protection</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">Anti-Phishing Notice</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment methods strip */}
      <div className="border-t border-purple-900/40 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 flex-wrap text-gray-400">
            <span>Accepted Payment:</span>
            {['💵 Cash on Delivery', '📱 UPI / QR', '💳 Visa / RuPay / Mastercard', '🏦 All Major Net Banking'].map(
              (m) => (
                <span
                  key={m}
                  className="bg-purple-950/60 text-pink-200 border border-purple-800/40 px-2 py-0.5 rounded-lg text-[10px]"
                >
                  {m}
                </span>
              )
            )}
          </div>
          <div className="flex items-center gap-3 text-gray-400 text-xs">
            <span>🔒 256-Bit SSL Encrypted</span>
            <span>•</span>
            <span>🇮🇳 Made with ❤️ for Indian Shoppers</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-900/20 py-4 bg-black/40 text-[11px] text-gray-500 text-center">
        © 2026 Shopio Technologies Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
}