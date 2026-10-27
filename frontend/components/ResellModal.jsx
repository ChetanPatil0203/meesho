import { useState } from 'react';

export default function ResellModal({ isOpen, onClose, product, onShowToast }) {
  const [margin, setMargin] = useState(150);

  if (!isOpen || !product) return null;

  const basePrice = product.price || 499;
  const customerPrice = basePrice + Number(margin);

  const shareText = `🛍️ *Special Trending Offer!*
  
*${product.name}*
✨ Brand: ${product.brand || 'Premium Quality'}
⭐️ Rating: ${product.rating || '4.5'}/5
🔥 Special Offer Price: *₹${customerPrice}* (Free Cash on Delivery Available)

🚚 7-day Easy Replacement & Free Delivery!
👉 Reply to this message to order now with your address & size!`;

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    onShowToast?.(`Shared with margin of ₹${margin}! 💼`);
  };

  const handleCopyText = () => {
    navigator.clipboard?.writeText(shareText);
    onShowToast?.('Product catalog copied to clipboard! 📋');
  };

  return (
    <div className="fixed inset-0 z-[75] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              💼
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Resell & Earn Margin</h3>
              <p className="text-[11px] text-pink-100">Zero Investment · Keep 100% of your profit</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white font-bold text-lg">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Product brief */}
          <div className="flex gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-100">
            <img src={product.image} alt="" className="w-14 h-16 object-cover rounded-xl flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 line-clamp-1">{product.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Supplier Wholesale Price:</p>
              <p className="text-sm font-black text-gray-900">₹{basePrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Margin input / calculator */}
          <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-purple-900">Your Cash Profit Margin:</label>
              <span className="text-sm font-black text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                + ₹{margin}
              </span>
            </div>

            {/* Quick chips */}
            <div className="flex gap-2 mb-3">
              {[50, 100, 150, 200, 300].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMargin(val)}
                  className={`flex-1 py-1 text-xs font-bold rounded-lg border transition-all ${
                    margin === val
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="20"
              max="600"
              step="10"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />

            <div className="mt-3 pt-3 border-t border-purple-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Final Price to Customer:</span>
              <span className="font-extrabold text-base text-purple-900">₹{customerPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Reseller Perks */}
          <div className="space-y-1.5 text-[11px] text-gray-600">
            <p className="flex items-center gap-1.5">
              <span className="text-green-500 font-bold">✓</span> No Shopio logo shown on shared messages (Your White-label)
            </p>
            <p className="flex items-center gap-1.5">
              <span className="text-green-500 font-bold">✓</span> Customer pays ₹{customerPrice}, you pocket ₹{margin} profit
            </p>
            <p className="flex items-center gap-1.5">
              <span className="text-green-500 font-bold">✓</span> Free doorstep Cash on Delivery for your buyers
            </p>
          </div>

          {/* Share Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1EBE5D] transition-colors shadow-sm text-xs flex items-center justify-center gap-2 active:scale-95"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
              </svg>
              Share on WhatsApp & Earn ₹{margin}
            </button>

            <button
              onClick={handleCopyText}
              className="w-full py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-xs flex items-center justify-center gap-1.5"
            >
              📋 Copy Catalog Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
