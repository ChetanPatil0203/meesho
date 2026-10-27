import { useState } from 'react';
import { triggerConfetti } from '../utils/confetti';

const PRIZES = [
  { label: '₹150 OFF', code: 'LUCKY150', color: '#9F2089', text: '#FFFFFF', desc: 'Flat ₹150 OFF on orders above ₹499' },
  { label: 'Extra 20%', code: 'SUPER20', color: '#FF8A00', text: '#FFFFFF', desc: 'Extra 20% OFF up to ₹200 on Fashion' },
  { label: '100 Coins', code: 'COINS100', color: '#038D63', text: '#FFFFFF', isCoins: 100, desc: '100 Shopio Coins credited to your wallet!' },
  { label: '₹100 OFF', code: 'SHOPIO100', color: '#D81B80', text: '#FFFFFF', desc: 'Flat ₹100 OFF on your cart' },
  { label: 'Free Delivery', code: 'FREESHIP', color: '#3B82F6', text: '#FFFFFF', desc: 'Free Express Doorstep Delivery' },
  { label: '₹75 OFF', code: 'MAHASALE', color: '#E11D48', text: '#FFFFFF', desc: 'Maha Festival Sale ₹75 OFF discount' },
];

export default function SpinWheelModal({ isOpen, onClose, onShowToast, onNavigate }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const [hasSpun, setHasSpun] = useState(() => {
    const lastSpun = localStorage.getItem('shopio_last_spin_date');
    const today = new Date().toDateString();
    return lastSpun === today;
  });

  if (!isOpen) return null;

  const segmentAngle = 360 / PRIZES.length;

  const handleSpin = () => {
    if (spinning) return;

    setSpinning(true);
    setWonPrize(null);

    // Pick a winning index (0 to 5)
    const winningIndex = Math.floor(Math.random() * PRIZES.length);
    
    // Each segment is 60 degrees. Needle is at top (270 deg or -90 deg).
    // Segment i center angle: i * 60 + 30
    // To land segment i under the top needle (270°):
    // Target rotation: 360 * 5 + (360 - (winningIndex * 60 + 30) - 90)
    const extraRotations = 360 * 5; // 5 full turns
    const targetAngle = extraRotations + (360 - winningIndex * segmentAngle - segmentAngle / 2 + 270);
    const finalRotation = rotation + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      const prize = PRIZES[winningIndex];
      setWonPrize(prize);
      setHasSpun(true);
      localStorage.setItem('shopio_last_spin_date', new Date().toDateString());

      // Trigger celebratory confetti
      triggerConfetti(3000);

      // If coins won, update user profile in localStorage
      if (prize.isCoins) {
        try {
          const profile = JSON.parse(localStorage.getItem('meesho_user_profile') || '{"coins": 150}');
          profile.coins = (profile.coins || 150) + prize.isCoins;
          localStorage.setItem('meesho_user_profile', JSON.stringify(profile));
        } catch {}
      }

      onShowToast(`🎉 Congratulations! You won ${prize.label}!`);
    }, 4000);
  };

  const handleCopyCode = () => {
    if (!wonPrize) return;
    navigator.clipboard?.writeText(wonPrize.code);
    onShowToast(`Coupon code ${wonPrize.code} copied! Apply at checkout 🛍️`);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#161F30] rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden text-center relative animate-bounce-in border border-pink-100 dark:border-pink-900/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#F43397] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold transition-colors"
          >
            ✕
          </button>
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-xs">
            <span>🎡</span> Shopio Lucky Wheel
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Spin & Win Mega Discounts!
          </h3>
          <p className="text-pink-100 text-xs mt-1">
            दररोज लकी व्हील फिरवा आणि जिंका खास डिस्काउंट आणि कॉइन्स!
          </p>
        </div>

        {/* Wheel Section */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-yellow-400 shadow-xl shadow-yellow-500/20 pointer-events-none" />

            {/* Needle / Pointer at top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none filter drop-shadow-md">
              <svg width="28" height="34" viewBox="0 0 24 30" fill="none">
                <path d="M12 28L4 8C3 6 4.5 4 6.5 4H17.5C19.5 4 21 6 20 8L12 28Z" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="12" cy="9" r="3" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Rotating Wheel SVG */}
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full rounded-full transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.25, 1)"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.1, 1)',
              }}
            >
              {PRIZES.map((prize, idx) => {
                const startAngle = idx * segmentAngle;
                const endAngle = (idx + 1) * segmentAngle;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const x1 = 150 + 140 * Math.cos(startRad);
                const y1 = 150 + 140 * Math.sin(startRad);
                const x2 = 150 + 140 * Math.cos(endRad);
                const y2 = 150 + 140 * Math.sin(endRad);

                const midAngle = startAngle + segmentAngle / 2;
                const textRad = (midAngle * Math.PI) / 180;
                const textX = 150 + 85 * Math.cos(textRad);
                const textY = 150 + 85 * Math.sin(textRad);

                return (
                  <g key={prize.code}>
                    <path
                      d={`M 150 150 L ${x1} ${y1} A 140 140 0 0 1 ${x2} ${y2} Z`}
                      fill={prize.color}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill={prize.text}
                      fontSize="13"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    >
                      {prize.label}
                    </text>
                  </g>
                );
              })}
              {/* Center Cap */}
              <circle cx="150" cy="150" r="28" fill="#FFFFFF" stroke="#9F2089" strokeWidth="4" />
              <text x="150" y="153" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="900" fill="#9F2089">
                S
              </text>
            </svg>
          </div>

          {/* Won Prize Display or Spin Button */}
          {wonPrize ? (
            <div className="w-full mt-4 p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/80 border border-pink-200 dark:border-pink-900/50 animate-bounce-in">
              <span className="text-2xl">🎉</span>
              <h4 className="text-base font-black text-gray-900 dark:text-white mt-1">
                You Won: {wonPrize.label}!
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{wonPrize.desc}</p>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="font-mono text-sm font-black bg-white dark:bg-gray-900 px-3 py-1.5 rounded-xl border-2 border-dashed border-[#9F2089] text-[#9F2089] dark:text-[#F43397]">
                  {wonPrize.code}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all"
                >
                  Copy & Use 📋
                </button>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate?.('home');
                  }}
                  className="flex-1 py-2 text-xs font-bold text-[#9F2089] hover:underline"
                >
                  Shop Mega Deals Now →
                </button>
                <button
                  onClick={() => {
                    setWonPrize(null);
                    handleSpin();
                  }}
                  className="py-1 px-3 text-[11px] font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Spin Again 🔄
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full mt-4 space-y-2">
              <button
                disabled={spinning}
                onClick={handleSpin}
                className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  spinning
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#FF8A00] hover:opacity-95 animate-glow'
                }`}
              >
                {spinning ? (
                  <>
                    <span className="animate-spin inline-block">🎡</span>
                    Spinning the Wheel...
                  </>
                ) : (
                  <>
                    <span>🎁</span> SPIN NOW TO WIN!
                  </>
                )}
              </button>
              <p className="text-[11px] text-gray-400">
                100% Guaranteed Reward on every spin!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
