import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import adminService from '../services/adminService';
import { triggerConfetti } from '../utils/confetti';

export default function AuthModal({
  isOpen,
  onClose,
  initialTab = 'login',
  onSuccess,
  onShowToast,
  onShowIncomingOtp,
  onShowRegistrationSms,
}) {
  const [tab, setTab] = useState(initialTab); // 'login' | 'signup'
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'

  // Form State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP flow state
  const [otpSent, setOtpSent] = useState(false);
  const [activeOtpCode, setActiveOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const otpInputRef = useRef(null);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // Handle Resend Countdown Timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  // Clean 10-digit phone
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  // Send OTP handler
  const handleSendOtp = async () => {
    if (!cleanPhone || cleanPhone.length !== 10) {
      onShowToast?.('कृपया वैध १० अंकी मोबाईल नंबर टाका (Please enter valid 10-digit mobile number)', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.sendOtp(cleanPhone);
      setOtpSent(true);
      setActiveOtpCode(res.otp);
      setCountdown(30);

      // Trigger realistic top SMS push banner on user's screen!
      onShowIncomingOtp?.({
        phone: cleanPhone,
        otp: res.otp,
        message: res.smsText,
      });

      onShowToast?.(`ओटीपी पाठवला आहे: +91 ${cleanPhone} वर कोड आला! 📲`, 'success');

      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 200);
    } catch (err) {
      onShowToast?.(err.message || 'OTP पाठवण्यात त्रुटी आली', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and complete Login / Registration
  const handleVerifyOtpAndProceed = async (e) => {
    e?.preventDefault();

    if (!cleanPhone || cleanPhone.length !== 10) {
      onShowToast?.('कृपया १० अंकी मोबाईल नंबर टाका', 'error');
      return;
    }

    if (!otp || otp.trim().length < 4) {
      onShowToast?.('कृपया मिळालेला ओटीपी कोड टाका', 'error');
      return;
    }

    // In signup tab, validate required registration fields
    if (tab === 'signup') {
      if (!name.trim()) {
        onShowToast?.('कृपया आपले संपूर्ण नाव टाका (Please enter your full name)', 'error');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        onShowToast?.('कृपया वैध ईमेल पत्ता टाका (Please enter a valid email)', 'error');
        return;
      }
    }

    // Check App Access Permission controlled by Admin Panel
    const checkEmail = email || `${cleanPhone}@shopio.com`;
    const isAllowed = adminService.isUserAllowedToUseApp(checkEmail);
    if (!isAllowed) {
      onShowToast?.('⚠️ परवानगी नाकारली: Admin ने तुमचा ॲप ॲक्सेस बंद केला आहे (Access Revoked by Admin)', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyOtp({
        phone: cleanPhone,
        otp: otp.trim(),
        name: tab === 'signup' ? name.trim() : undefined,
        email: tab === 'signup' ? email.trim() : undefined,
        password: password || undefined,
      });

      const userProfile = {
        name: res.user.name || name || 'Chetan Pazi',
        email: res.user.email || email || `${cleanPhone}@shopio.com`,
        phone: `+91 ${cleanPhone}`,
        city: 'Mumbai',
        state: 'Maharashtra',
      };

      // Save user session
      localStorage.setItem('meesho_user_profile', JSON.stringify(userProfile));
      localStorage.setItem('shopio_auth_token', res.token || 'demo_token');

      // Update admin user directory
      adminService.createUser({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        role: 'customer',
        appAccess: true,
      });

      triggerConfetti(2500);

      // CRITICAL REQUIREMENT:
      // "registration successfully complete zali ki text la message yaylahaw"
      if (tab === 'signup' || res.isNewUser) {
        onShowRegistrationSms?.({
          phone: cleanPhone,
          name: userProfile.name,
          email: userProfile.email,
          message: res.smsNotification?.message || `Welcome to Shopio, ${userProfile.name}! Your registration is successfully completed.`,
        });
      }

      onSuccess?.(userProfile);
      onShowToast?.(`स्वागत आहे, ${userProfile.name}! 👋 Login Successful`, 'success');
      onClose();
    } catch (err) {
      onShowToast?.(err.message || 'अवैध ओटीपी. कृपया तपासून पुन्हा प्रयत्न करा.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Direct Password Login
  const handlePasswordLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      onShowToast?.('कृपया ईमेल/मोबाईल आणि पासवर्ड टाका', 'error');
      return;
    }

    const isAllowed = adminService.isUserAllowedToUseApp(email);
    if (!isAllowed) {
      onShowToast?.('⚠️ परवानगी नाकारली: Admin ने तुमचा ॲप ॲक्सेस बंद केला आहे', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(email, password);
      const userProfile = {
        name: res.user?.name || email.split('@')[0],
        email: res.user?.email || email,
        phone: res.user?.phone || '+91 9876543210',
        city: 'Mumbai',
        state: 'Maharashtra',
      };

      localStorage.setItem('meesho_user_profile', JSON.stringify(userProfile));
      triggerConfetti(1500);
      onSuccess?.(userProfile);
      onShowToast?.(`Welcome back, ${userProfile.name}! 👋`, 'success');
      onClose();
    } catch (err) {
      onShowToast?.(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#161F30] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border border-pink-100 dark:border-pink-900/40 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#F43397] p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl shadow-md border border-white/30">
                S
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg tracking-tight leading-none">Shopio</span>
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
                    M-Trusted
                  </span>
                </div>
                <p className="text-pink-100 text-xs mt-0.5">
                  {tab === 'login' ? 'लॉगिन करा आणि खरेदी सुरू करा' : 'नवीन मोफत खाते तयार करा'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white font-bold transition-transform active:scale-90"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-pink-100 font-semibold">
            <span>✓ मोफत डिलिव्हरी</span>
            <span>✓ कॅश ऑन डिलिव्हरी</span>
            <span>✓ ७ दिवस सोपे रिटर्न</span>
          </div>
        </div>

        {/* Navigation Tabs (Login vs Sign Up) */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 text-xs font-black">
          <button
            onClick={() => {
              setTab('login');
              setOtpSent(false);
            }}
            className={`flex-1 py-3.5 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'border-[#9F2089] text-[#9F2089] dark:text-[#F43397] bg-pink-50/50 dark:bg-pink-950/20'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <span>📱</span>
            <span>लॉगिन (Sign In)</span>
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setOtpSent(false);
            }}
            className={`flex-1 py-3.5 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              tab === 'signup'
                ? 'border-[#9F2089] text-[#9F2089] dark:text-[#F43397] bg-pink-50/50 dark:bg-pink-950/20'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <span>✨</span>
            <span>नवीन नोंदणी (Sign Up)</span>
          </button>
        </div>

        {/* Modal Body Form */}
        <div className="p-6 space-y-4 text-xs">
          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <>
              {/* Method Switcher */}
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    loginMethod === 'otp'
                      ? 'bg-white dark:bg-[#161F30] text-[#9F2089] dark:text-[#F43397] shadow-xs'
                      : 'text-gray-500'
                  }`}
                >
                  ⚡ Mobile + OTP लॉगिन
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    loginMethod === 'password'
                      ? 'bg-white dark:bg-[#161F30] text-[#9F2089] dark:text-[#F43397] shadow-xs'
                      : 'text-gray-500'
                  }`}
                >
                  🔒 ईमेल व पासवर्ड
                </button>
              </div>

              {loginMethod === 'otp' ? (
                <div className="space-y-3.5">
                  {/* Mobile Number Input */}
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      मोबाईल नंबर (10-Digit Mobile Number)
                    </label>
                    <div className="flex rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus-within:border-[#9F2089] overflow-hidden transition-colors bg-white dark:bg-[#1E293B]">
                      <span className="px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 font-bold border-r border-gray-200 dark:border-gray-700 flex items-center gap-1.5">
                        <span>🇮🇳</span> +91
                      </span>
                      <input
                        type="tel"
                        maxLength="10"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="flex-1 px-3.5 py-2.5 outline-none font-bold text-gray-800 dark:text-white tracking-wider text-sm bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading || cleanPhone.length !== 10}
                        className="px-3.5 py-2 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold text-[11px] disabled:opacity-40 transition-opacity hover:opacity-95"
                      >
                        {loading ? 'पाठवत आहे...' : otpSent ? 'पुन्हा पाठवा' : 'ओटीपी मिळवा'}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      मोबाईल नंबर टाकल्यावर तुमच्या फोनवर लगेच टेक्स्ट मेसेज (SMS) ने ओटीपी येईल.
                    </p>
                  </div>

                  {/* OTP Input box once sent */}
                  {otpSent && (
                    <div className="p-3.5 rounded-2xl bg-pink-50/80 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/40 space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-black text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                          <span>📩</span> मिळालेला ६-अंकी OTP टाका
                        </label>
                        {countdown > 0 ? (
                          <span className="text-[10px] text-gray-500 font-bold">
                            पुन्हा पाठवा ({countdown}s)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-[10px] text-[#9F2089] dark:text-[#F43397] font-black hover:underline"
                          >
                            Resend OTP 🔄
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          ref={otpInputRef}
                          type="text"
                          maxLength="6"
                          placeholder="e.g. 542918"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="flex-1 border-2 border-pink-300 dark:border-pink-700/80 rounded-xl px-3.5 py-2.5 outline-none font-mono text-center tracking-[0.4em] font-black text-base text-gray-900 dark:text-white bg-white dark:bg-[#161F30]"
                        />
                        {activeOtpCode && (
                          <button
                            type="button"
                            onClick={() => setOtp(activeOtpCode)}
                            className="px-3 bg-pink-200 dark:bg-pink-900/60 hover:bg-pink-300 text-[#9F2089] dark:text-pink-200 font-black rounded-xl text-[11px] transition-colors"
                            title="Auto-fill received code"
                          >
                            ⚡ Auto-Fill
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={otpSent ? handleVerifyOtpAndProceed : handleSendOtp}
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#F43397] text-white font-extrabold rounded-2xl hover:opacity-95 shadow-lg shadow-pink-500/25 transition-all text-sm active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>{otpSent ? '✓ पडताळणी करून लॉगिन करा (Verify & Login)' : 'ओटीपी पाठवा (Send OTP) →'}</span>
                  </button>
                </div>
              ) : (
                /* Password Login Form */
                <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                      ईमेल किंवा मोबाईल नंबर
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. chetan@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                      पासवर्ड
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white text-xs font-semibold pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                      >
                        {showPassword ? '👁️' : '🙈'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold rounded-2xl hover:opacity-95 shadow-md transition-all text-xs active:scale-95"
                  >
                    लॉगिन करा (Sign In)
                  </button>
                </form>
              )}
            </>
          )}

          {/* TAB 2: SIGN UP / REGISTRATION */}
          {tab === 'signup' && (
            <div className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  संपूर्ण नाव (Full Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="उदा. चेतन पाझी (Chetan Pazi)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white text-xs font-semibold"
                />
              </div>

              {/* Mobile Number with OTP */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  मोबाईल नंबर (Mobile Number) <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus-within:border-[#9F2089] overflow-hidden transition-colors bg-white dark:bg-[#1E293B]">
                  <span className="px-3.5 py-2 bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 font-bold border-r border-gray-200 dark:border-gray-700 flex items-center gap-1">
                    <span>🇮🇳</span> +91
                  </span>
                  <input
                    type="tel"
                    maxLength="10"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 px-3 py-2 outline-none font-bold text-gray-800 dark:text-white tracking-wider text-xs bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || cleanPhone.length !== 10}
                    className="px-3 py-2 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white font-extrabold text-[11px] disabled:opacity-40 transition-opacity hover:opacity-95"
                  >
                    {otpSent ? 'पुन्हा पाठवा' : 'ओटीपी पाठवा'}
                  </button>
                </div>
              </div>

              {/* OTP Field */}
              {otpSent && (
                <div className="p-3 rounded-2xl bg-pink-50/80 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/40 space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-black text-gray-800 dark:text-gray-100 flex items-center gap-1">
                      <span>📩</span> मेसेजमधील ६-अंकी OTP टाका
                    </span>
                    {countdown > 0 ? (
                      <span className="text-[10px] text-gray-400">({countdown}s)</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[10px] text-[#9F2089] font-bold hover:underline"
                      >
                        Resend
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      ref={otpInputRef}
                      type="text"
                      maxLength="6"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="flex-1 border-2 border-pink-300 dark:border-pink-700/80 rounded-xl px-3 py-2 outline-none font-mono text-center tracking-[0.3em] font-black text-sm text-gray-900 dark:text-white bg-white dark:bg-[#161F30]"
                    />
                    {activeOtpCode && (
                      <button
                        type="button"
                        onClick={() => setOtp(activeOtpCode)}
                        className="px-2.5 bg-pink-200 dark:bg-pink-900/60 text-[#9F2089] dark:text-pink-200 font-bold rounded-xl text-[10px]"
                      >
                        Auto-Fill
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  ईमेल पत्ता (Email Address) <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="उदा. name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white text-xs font-semibold"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  पासवर्ड (Create Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="किमान ६ अक्षरी पासवर्ड"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9F2089] dark:bg-[#1E293B] dark:text-white text-xs font-semibold pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {/* Register & Send Welcome Text Message Button */}
              <button
                type="button"
                onClick={otpSent ? handleVerifyOtpAndProceed : handleSendOtp}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#F43397] text-white font-extrabold rounded-2xl hover:opacity-95 shadow-lg shadow-pink-500/25 transition-all text-xs active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🎉</span>
                <span>
                  {otpSent
                    ? 'नोंदणी पूर्ण करा आणि मेसेज मिळवा (Register & Receive SMS)'
                    : 'पुढे जा व ओटीपी पाठवा (Send OTP to Mobile) →'}
                </span>
              </button>
            </div>
          )}

          {/* Social Google Login Fallback */}
          <div className="relative flex items-center gap-3 pt-2">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-[10px] text-gray-400 font-bold">किंवा</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <button
            type="button"
            onClick={() => {
              const demoUser = {
                name: 'Google User',
                email: 'user@gmail.com',
                phone: '+91 9876543210',
                city: 'Mumbai',
                state: 'Maharashtra',
              };
              localStorage.setItem('meesho_user_profile', JSON.stringify(demoUser));
              onSuccess?.(demoUser);
              onShowToast?.('Google द्वारे यशस्वी लॉगिन! 👋', 'success');
              onClose();
            }}
            className="w-full py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <span>🌐</span> Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
