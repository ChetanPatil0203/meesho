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
    <footer className="bg-[#0F1629] text-gray-300 mt-12">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-yellow-400">📬</span> Subscribe for Exclusive Deals
            </h3>
            <p className="text-gray-400 text-sm mt-0.5">Get weekly offers, flash sale alerts & new arrivals in your inbox</p>
          </div>
          {subscribed ?
          <div className="flex items-center gap-2 text-green-400 font-semibold bg-green-900/30 px-5 py-2.5 rounded-xl border border-green-800">
              <span>✓</span> You're subscribed!
            </div> :

          <div className="flex gap-2 w-full md:w-auto">
              <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              className="flex-1 md:w-72 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-[#3B5BDB] focus:outline-none placeholder:text-gray-500" />
            
              <button onClick={handleSubscribe}
            className="px-5 py-2.5 bg-[#3B5BDB] text-white rounded-xl text-sm font-semibold hover:bg-[#2F4AC4] transition-colors whitespace-nowrap active:scale-95">
                Subscribe
              </button>
            </div>
          }
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-4 group">
            <div className="w-8 h-8 bg-[#3B5BDB] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2" />
                <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span className="text-white font-extrabold text-lg">ShopKart</span>
          </button>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            India's trusted marketplace for fashion, electronics, beauty & more. Shop from 1 Crore+ products.
          </p>
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2"><span>📍</span> Mumbai, Maharashtra 400001</div>
            <div className="flex items-center gap-2"><span>📞</span> 1800-123-4567 (Toll Free)</div>
            <div className="flex items-center gap-2"><span>✉️</span> support@shopkart.in</div>
          </div>
          <div className="flex gap-2 mt-5">
            {[
            { icon: '📘', label: 'Facebook' },
            { icon: '🐦', label: 'Twitter' },
            { icon: '📸', label: 'Instagram' },
            { icon: '▶', label: 'YouTube' }].
            map((s) =>
            <button key={s.label} title={s.label}
            className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#3B5BDB] transition-colors text-sm">
                {s.icon}
              </button>
            )}
          </div>
        </div>

        {[
        {
          title: 'Shop',
          links: [
          { label: 'Women\'s Fashion', action: () => onNavigate('listing', { category: 'Women' }) },
          { label: 'Men\'s Fashion', action: () => onNavigate('listing', { category: 'Men' }) },
          { label: 'Kids', action: () => onNavigate('listing', { category: 'Kids' }) },
          { label: 'Electronics', action: () => onNavigate('listing', { category: 'Electronics' }) },
          { label: 'Beauty & Care', action: () => onNavigate('listing', { category: 'Beauty' }) },
          { label: 'Sports & Fitness', action: () => onNavigate('listing', { category: 'Sports' }) }]

        },
        {
          title: 'Customer Help',
          links: [
          { label: 'My Orders', action: () => onNavigate('orders') },
          { label: 'Track Order', action: () => onNavigate('order-tracking', { orderId: 'SK123456789' }) },
          { label: 'Returns & Refunds', action: () => onNavigate('profile') },
          { label: 'Cancel Order', action: () => onNavigate('orders') },
          { label: 'Contact Support', action: () => {} },
          { label: 'FAQ', action: () => {} }]

        },
        {
          title: 'Company',
          links: [
          { label: 'About ShopKart', action: () => {} },
          { label: 'Careers', action: () => {} },
          { label: 'Press & Media', action: () => {} },
          { label: 'Blog', action: () => {} },
          { label: 'Sitemap', action: () => {} },
          { label: 'Accessibility', action: () => {} }]

        },
        {
          title: 'Policies & Help',
          links: [
          { label: 'Privacy Policy', action: () => {} },
          { label: 'Terms of Use', action: () => {} },
          { label: 'Return Policy', action: () => {} },
          { label: 'Security & Safety', action: () => {} },
          { label: 'Shipping & Delivery', action: () => {} },
          { label: 'Grievance Redressal', action: () => {} }]

        }].
        map((section) =>
        <div key={section.title}>
            <h4 className="text-white font-bold mb-4 text-sm">{section.title}</h4>
            <ul className="space-y-2.5">
              {section.links.map((link) =>
            <li key={link.label}>
                  <button onClick={link.action}
              className="text-gray-400 text-sm hover:text-white transition-colors text-left">
                    {link.label}
                  </button>
                </li>
            )}
            </ul>
          </div>
        )}
      </div>

      {/* Payment & Security */}
      <div className="border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">Accepted Payment Methods</p>
              <div className="flex items-center gap-2 flex-wrap">
                {['💳 Visa', '💳 Mastercard', '🏦 Net Banking', '📱 UPI', '👛 Wallets', '💵 COD'].map((method) =>
                <span key={method} className="text-[10px] bg-gray-800 text-gray-400 px-2.5 py-1 rounded-md border border-gray-700">{method}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                <span>🔒</span> SSL Encrypted
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                <span>✅</span> PCI DSS Compliant
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-4 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-600 text-xs">
            © 2025 ShopKart Technologies Pvt. Ltd. · All rights reserved · Made with ❤️ in India
          </p>
          <div className="flex gap-4 text-xs text-gray-600">
            <button className="hover:text-gray-300 transition-colors">Privacy Policy</button>
            <button className="hover:text-gray-300 transition-colors">Terms of Use</button>
            <button className="hover:text-gray-300 transition-colors">Cookie Policy</button>
            <button className="hover:text-gray-300 transition-colors">Grievance</button>
          </div>
        </div>
      </div>
    </footer>);

}