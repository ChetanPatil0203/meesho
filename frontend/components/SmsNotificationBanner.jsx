import { useEffect } from 'react';

// Play a pleasant simulated phone SMS notification sound using Web Audio API
export function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    // Note 1 (800Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Note 2 (1200Hz - pleasant ding)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.12);
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.35);
  } catch {
    // ignore audio failure on restricted browsers
  }
}

/**
 * Top floating incoming SMS notification (simulating real mobile push message)
 */
export function IncomingOtpBanner({ otpData, onAutoFill, onClose }) {
  useEffect(() => {
    if (otpData) {
      playNotificationSound();
    }
  }, [otpData]);

  if (!otpData) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-3 animate-bounce-subtle pointer-events-auto">
      <div className="bg-slate-950/95 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-3.5 backdrop-blur-md flex items-start gap-3 relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-400 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-md">
          💬
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
            <span className="font-black text-emerald-400 flex items-center gap-1">
              <span>●</span> Messages · SHOPIO-VERIFY
            </span>
            <span>Just now</span>
          </div>

          <p className="text-xs font-semibold text-slate-200 leading-snug">
            Your Shopio verification code is <strong className="text-yellow-300 font-mono tracking-widest text-sm bg-yellow-400/20 px-1.5 py-0.5 rounded-md">{otpData.otp}</strong>. Valid for 10 minutes.
          </p>

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => onAutoFill?.(otpData.otp)}
              className="px-3 py-1 bg-gradient-to-r from-[#9F2089] to-[#F43397] hover:opacity-90 text-white text-[11px] font-black rounded-lg shadow-sm transition-all active:scale-95"
            >
              ⚡ Auto-Fill Code ({otpData.otp})
            </button>
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-slate-400 hover:text-white text-[11px] font-bold"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Incoming Registration Success Text Message Popup
 * Exactly fulfills user requirement:
 * "registration successfully complete zali ki text la message yaylahaw"
 */
export function RegistrationSuccessSmsModal({ smsData, onClose }) {
  useEffect(() => {
    if (smsData) {
      playNotificationSound();
    }
  }, [smsData]);

  if (!smsData) return null;

  return (
    <div
      className="fixed inset-0 z-[95] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#161F30] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-pink-200 dark:border-pink-900/40 relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar simulating SMS receiver app */}
        <div className="bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#F43397] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg">
                📩
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                  <span>टेक्स्ट मेसेज प्राप्त झाला (New SMS)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[11px] text-pink-100">Sender: SHOPIO-IND · SIM 1</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* SMS Bubble View */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-[11px] text-gray-400 pb-2 border-b border-gray-100 dark:border-gray-800">
            <span>To: <strong className="text-gray-700 dark:text-gray-200">+91 {smsData.phone}</strong></span>
            <span>Today · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Realistic SMS Chat Card */}
          <div className="bg-pink-50/80 dark:bg-pink-950/20 border-2 border-pink-200/80 dark:border-pink-800/40 rounded-2xl p-4 space-y-2.5 text-xs text-gray-800 dark:text-gray-100 shadow-xs relative">
            <div className="flex items-center gap-2">
              <span className="text-base">🎉</span>
              <p className="font-black text-sm text-[#9F2089] dark:text-[#F43397]">
                नोंदणी यशस्वी! (Registration Successful)
              </p>
            </div>

            <p className="leading-relaxed font-medium">
              प्रिय <strong>{smsData.name || 'ग्राहक'}</strong>, Shopio मध्ये आपले मनःपूर्वक स्वागत आहे!
            </p>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              आपले खाते यशस्वीरित्या सुरू झाले असून, आपल्या पहिल्या ऑर्डरवर <strong>₹100 सूट</strong> व <strong>100% मोफत डिलिव्हरी</strong> लागू झाली आहे.
            </p>

            {/* Coupon Chip */}
            <div className="bg-white dark:bg-[#1E293B] border border-dashed border-[#9F2089] rounded-xl p-2.5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Welcome Promo Code</p>
                <p className="font-black text-sm text-[#9F2089] dark:text-[#F43397] font-mono">SHOPIO100</p>
              </div>
              <span className="text-xs font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-1 rounded-md">
                ₹100 OFF Applied
              </span>
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 pt-1">
              🌐 Shopio Official Link: <span className="text-[#9F2089] font-semibold underline">https://shopio.in/account</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold rounded-2xl hover:opacity-95 shadow-md shadow-pink-500/20 transition-all text-xs active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🛍️</span>
              <span>खरेदी सुरू करा (Start Shopping Now)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs"
            >
              मेसेज बंद करा (Dismiss SMS)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
