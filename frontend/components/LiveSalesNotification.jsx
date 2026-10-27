import { useState, useEffect } from 'react';

const LIVE_PURCHASES = [
  {
    buyer: 'Pooja K.',
    city: 'Pune',
    product: 'Kanjeevaram Soft Silk Saree',
    price: '₹389',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=120&h=120&fit=crop&auto=format',
    time: '2 mins ago',
  },
  {
    buyer: 'Rahul S.',
    city: 'Mumbai',
    product: 'Noise ColorFit Pulse 2 Max',
    price: '₹899',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop&auto=format',
    time: 'Just now',
  },
  {
    buyer: 'Sneha M.',
    city: 'Kolhapur',
    product: 'Anarkali Rayon Kurti With Dupatta',
    price: '₹299',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=120&h=120&fit=crop&auto=format',
    time: '4 mins ago',
  },
  {
    buyer: 'Amit J.',
    city: 'Nagpur',
    product: 'Men Classic Casual Denim Jacket',
    price: '₹499',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=120&h=120&fit=crop&auto=format',
    time: '1 min ago',
  },
  {
    buyer: 'Priyanka D.',
    city: 'Nashik',
    product: 'Royal 24K Gold Plated Choker',
    price: '₹199',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=120&h=120&fit=crop&auto=format',
    time: '3 mins ago',
  },
  {
    buyer: 'Aniket S.',
    city: 'Solapur',
    product: 'Pure Cotton Double Bed Sheet 220TC',
    price: '₹349',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=120&h=120&fit=crop&auto=format',
    time: 'Just now',
  },
  {
    buyer: 'Meera I.',
    city: 'Bengaluru',
    product: 'Banarasi Soft Silk Rich Pallu Saree',
    price: '₹499',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=120&h=120&fit=crop&auto=format',
    time: '5 mins ago',
  },
  {
    buyer: 'Rohit M.',
    city: 'Thane',
    product: 'Sports Running Shoes - Lightweight Cushion',
    price: '₹699',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop&auto=format',
    time: '2 mins ago',
  },
  {
    buyer: 'Sheetal M.',
    city: 'Jalgaon',
    product: 'Handcrafted Traditional Kolhapuri Chappal',
    price: '₹249',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=120&h=120&fit=crop&auto=format',
    time: '6 mins ago',
  },
  {
    buyer: 'Shreya D.',
    city: 'Pune',
    product: 'Floral Print Georgette Anarkali Gown',
    price: '₹449',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b5c94?w=120&h=120&fit=crop&auto=format',
    time: 'Just now',
  },
  {
    buyer: 'Vijay B.',
    city: 'Satara',
    product: 'Men 100% Cotton Check Casual Shirt',
    price: '₹379',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&h=120&fit=crop&auto=format',
    time: '4 mins ago',
  },
  {
    buyer: 'Pallavi S.',
    city: 'Ratnagiri',
    product: 'Lakme Complexion Care CC Cream + Matte Lipstick',
    price: '₹289',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&h=120&fit=crop&auto=format',
    time: '7 mins ago',
  },
];

export default function LiveSalesNotification({ onNavigate }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Show after 3s, stay for 5s, hide for 7s, loop
    const showTimeout = setTimeout(() => {
      setVisible(true);
    }, 3000);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % LIVE_PURCHASES.length);
        setVisible(true);
      }, 800);
    }, 10000);

    return () => {
      clearTimeout(showTimeout);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed) return null;

  const current = LIVE_PURCHASES[index];

  return (
    <div
      className={`fixed bottom-20 left-4 z-40 max-w-[320px] transition-all duration-500 transform ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white/95 dark:bg-[#161F30]/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 dark:border-pink-900/30 p-2.5 flex items-center gap-3 relative group">
        {/* Close Button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 hover:text-gray-900 text-[10px] flex items-center justify-center shadow-xs"
        >
          ✕
        </button>

        {/* Thumbnail */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-pink-50">
          <img
            src={current.image}
            alt={current.product}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute bottom-0 inset-x-0 bg-[#9F2089]/90 text-[8px] font-bold text-white text-center py-0.5">
            {current.price}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block" />
            <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate">
              {current.buyer} <span className="text-gray-400 font-normal">from {current.city}</span>
            </p>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-300 truncate font-medium mt-0.5">
            Purchased {current.product}
          </p>
          <div className="flex items-center gap-2 text-[9px] text-gray-400 mt-0.5">
            <span className="text-[#038D63] font-bold">✓ Verified Purchase</span>
            <span>•</span>
            <span>{current.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
