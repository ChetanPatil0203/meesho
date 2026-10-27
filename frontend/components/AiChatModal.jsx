import { useState, useEffect, useRef } from 'react';
import { products } from '../data/products';

export default function AiChatModal({
  isOpen,
  onClose,
  onOpenSpinWheel,
  onNavigate,
  onAddToCart,
  onShowToast,
  isLoggedIn = false,
}) {
  const [messages, setMessages] = useState(() => {
    let userName = 'ग्राहक';
    try {
      const p = JSON.parse(localStorage.getItem('meesho_user_profile') || '{}');
      if (p.name) userName = p.name.split(' ')[0];
    } catch {}

    return [
      {
        id: 'msg-init-1',
        sender: 'ai',
        time: 'Just now',
        text: `नमस्कार ${userName}! 👋 मी तुमचा **Shopio AI खरेदी सहाय्यक (Shopping Assistant)** आहे.`,
      },
      {
        id: 'msg-init-2',
        sender: 'ai',
        time: 'Just now',
        text: `मी तुम्हाला आजचे **टॉप ऑफर्स**, **कमी किमतीतील साड्या व कपडे**, **ऑर्डर ट्रॅकिंग**, आणि **लकी स्पिन (Spin & Win)** फिरवून डिस्काउंट मिळवण्यात थेट मदत करू शकतो. खालील पर्यायांमधून निवडा किंवा टाईप करा:`,
        chips: [
          '🎡 लकी स्पिन फिरवा',
          '🔥 आजचे बेस्ट ऑफर्स',
          '🥻 ₹500 च्या आतील साड्या',
          '📦 माझी ऑर्डर कुठे आहे?',
          '🏷️ डिस्काउंट कूपन कोड',
        ],
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen || !isLoggedIn) return null;

  // AI Response generator with rich product match and actions
  const generateAiResponse = (userQuery) => {
    const q = (userQuery || '').toLowerCase().trim();

    // 1. Spin & Win wheel inquiry
    if (
      q.includes('spin') ||
      q.includes('spine') ||
      q.includes('व्हील') ||
      q.includes('फिरवा') ||
      q.includes('lucky wheel') ||
      q.includes('wheel') ||
      q.includes('बक्षीस') ||
      q.includes('रिवॉर्ड')
    ) {
      return {
        text: `🎡 **Shopio Lucky Spin & Win** सुरू आहे! तुम्ही दररोज व्हील फिरवून **₹150 OFF**, **Extra 20% Discount**, किंवा **100 Shopio Coins** मोफत जिंकू शकता. खाली दिलेल्या बटनावर क्लिक करून आत्ताच फिरवा!`,
        action: {
          label: '🎡 आताच लकी स्पिन फिरवा (Open Spin Wheel)',
          type: 'open_spin',
        },
      };
    }

    // 2. Order Tracking
    if (
      q.includes('order') ||
      q.includes('ऑर्डर') ||
      q.includes('track') ||
      q.includes('कधी येईल') ||
      q.includes('पोहोचेल') ||
      q.includes('status')
    ) {
      return {
        text: `📦 **तुमची चालू ऑर्डर:**\n- ऑर्डर क्र.: **MEE-948123**\n- स्थिती: **मार्गावर आहे (Shipped - Out for Delivery)**\n- अंदाजित डिलिव्हरी: **उद्या दुपारी 2 वाजेपर्यंत**.\n\nतुम्ही खालील बटनावर क्लिक करून थेट लाईव्ह ट्रॅकिंग मॅप पाहू शकता:`,
        action: {
          label: '📦 थेट ऑर्डर ट्रॅकिंग पहा (Track Order)',
          type: 'navigate_orders',
        },
      };
    }

    // 3. Coupons & Discounts
    if (
      q.includes('coupon') ||
      q.includes('कूपन') ||
      q.includes('discount') ||
      q.includes('सूट') ||
      q.includes('offer') ||
      q.includes('कोड') ||
      q.includes('code')
    ) {
      return {
        text: `🎉 **आजचे खास डिस्काउंट कूपन कोड्स:**\n\n1. 🎟️ \`LUCKY150\` - ₹499 वरील खरेदीवर थेट **₹150 सूट**\n2. 🎟️ \`SUPER20\` - कपड्यांवर **20% अतिरिक्त डिस्काउंट**\n3. 🎟️ \`FREESHIP\` - **100% मोफत होम डिलिव्हरी**\n\nचेकआउट करताना हा कोड टाका आणि जास्तीत जास्त बचत करा!`,
        chips: ['🎡 लकी स्पिन फिरवा', '🥻 साड्यांचे कलेक्शन', '👟 शूज आणि चप्पल'],
      };
    }

    // 4. Returns & Refunds
    if (
      q.includes('return') ||
      q.includes('परत') ||
      q.includes('refund') ||
      q.includes('पैसे') ||
      q.includes('रिप्लेस')
    ) {
      return {
        text: `🔄 **7-दिवसांचे सोपे रिटर्न धोरण (Easy 7 Days Returns):**\n- वस्तू मिळाल्यापासून 7 दिवसांच्या आत विनामूल्य रिटर्न रिक्वेस्ट करता येते.\n- डिलिव्हरी पार्टनर घरी येऊन पार्सल घेऊन जाईल.\n- रिटर्न झाल्यावर 24 तासांच्या आत तुमचे पैसे मूळ खात्यात किंवा Shopio वॉलेटमध्ये जमा होतील.`,
        chips: ['📦 माझी ऑर्डर', '📞 कस्टमर केअर नंबर'],
      };
    }

    // 5. Cash on Delivery (COD)
    if (
      q.includes('cod') ||
      q.includes('cash') ||
      q.includes('रोख') ||
      q.includes('कॅश') ||
      q.includes('payment')
    ) {
      return {
        text: `💵 **कॅश ऑन डिलिव्हरी (Cash on Delivery) उपलब्ध आहे!**\nShopio वरील सर्व 1 कोटी+ वस्तूंवर COD पर्याय उपलब्ध आहे. पार्सल हातात मिळाल्यावरच पैसे द्या. याशिवाय UPI, Google Pay, PhonePe आणि कार्ड पेमेंटवर अधिक सुरक्षितता मिळते.`,
        chips: ['🔥 आजचे टॉप ऑफर्स', '🥻 साड्यांचे कलेक्शन'],
      };
    }

    // 6. Saree / Kurti / Women's fashion
    if (
      q.includes('saree') ||
      q.includes('साडी') ||
      q.includes('kurti') ||
      q.includes('कुर्ती') ||
      q.includes('dress') ||
      q.includes('women') ||
      q.includes('महिला')
    ) {
      const matchProducts = products
        .filter((p) => p.category === 'Women')
        .slice(0, 3);

      return {
        text: `🥻 **महिलांसाठी बेस्टसेलर साड्या आणि कुर्ती:**\nहे डिझाईन्स सध्या सर्वात लोकप्रिय आहेत, थेट सुरत आणि कांजीवरमच्या विणकरांकडून होलसेल भावात!`,
        productCards: matchProducts,
        action: {
          label: '🛍️ संपूर्ण विमेन कलेक्शन पहा (View All)',
          type: 'navigate_category',
          category: 'Women',
        },
      };
    }

    // 7. Men Fashion / Shirts
    if (
      q.includes('men') ||
      q.includes('shirt') ||
      q.includes('पुरुष') ||
      q.includes('शर्ट') ||
      q.includes('tshirt') ||
      q.includes('पँट')
    ) {
      const matchProducts = products
        .filter((p) => p.category === 'Men')
        .slice(0, 3);

      return {
        text: `👔 **पुरुषांसाठी ट्रेंडी कॉटन शर्ट्स आणि फॅशन:**\nउत्कृष्ट दर्जाचे फॅब्रिक आणि आकर्षक रंग, फक्त ₹399 पासून सुरू:`,
        productCards: matchProducts,
        action: {
          label: '🛍️ संपूर्ण मेन्स कलेक्शन पहा (View All)',
          type: 'navigate_category',
          category: 'Men',
        },
      };
    }

    // 8. Electronics / Gadgets / Watches
    if (
      q.includes('watch') ||
      q.includes('phone') ||
      q.includes('headphone') ||
      q.includes('earphone') ||
      q.includes('घड्याळ') ||
      q.includes('इलेक्ट्रॉनिक्स') ||
      q.includes('tech')
    ) {
      const matchProducts = products
        .filter((p) => p.category === 'Electronics')
        .slice(0, 3);

      return {
        text: `⚡ **स्मार्ट गॅजेट्स व ऑडिओ डील्स:**\nboAt, Noise आणि प्रीमियम वायरलेस इयरबड्सवर थेट 65% पर्यंत फ्लॅश डिस्काउंट!`,
        productCards: matchProducts,
        action: {
          label: '📱 इलेक्ट्रॉनिक्स डील्स एक्सप्लोर करा',
          type: 'navigate_category',
          category: 'Electronics',
        },
      };
    }

    // 9. Customer Support / Contact
    if (
      q.includes('help') ||
      q.includes('मदत') ||
      q.includes('care') ||
      q.includes('call') ||
      q.includes('number') ||
      q.includes('सपोर्ट')
    ) {
      return {
        text: `📞 **Shopio 24x7 ग्राहक सेवा (Customer Care):**\n- टोल-फ्री नंबर: **1800-123-6337** (सकाळी 8 ते रात्री 10)\n- ईमेल: **help@shopio.com**\n- WhatsApp सपोर्ट: **+91 9876543210**\n\nआम्ही तुम्हाला 2 मिनिटांत सहकार्य करू.`,
        action: {
          label: '💬 WhatsApp वर चॅट सुरू करा',
          type: 'open_whatsapp',
        },
      };
    }

    // Default Fallback with contextual suggestions
    const trendingProducts = products.slice(0, 3);
    return {
      text: `समजले! मी तुमच्यासाठी सर्वात जास्त विक्री झालेल्या आणि चांगल्या रेटिंग असलेल्या वस्तू शोधल्या आहेत. तुम्हाला यापैकी काही पाहायला आवडेल का? किंवा तुम्ही अधिक विशिष्ट माहिती (उदा. "साडी", "₹500 मधील वस्तू", "स्पिन व्हील") विचारू शकता.`,
      productCards: trendingProducts,
      chips: [
        '🎡 लकी स्पिन फिरवा',
        '🥻 साड्या व कुर्ती',
        '📦 ऑर्डर स्टेटस',
        '🏷️ डिस्काउंट कूपन',
      ],
    };
  };

  const handleSend = (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query || !query.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Realistic AI thinking delay
    setTimeout(() => {
      const response = generateAiResponse(query);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...response,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionClick = (action) => {
    if (!action) return;

    if (action.type === 'open_spin') {
      onClose?.();
      onOpenSpinWheel?.();
    } else if (action.type === 'navigate_orders') {
      onClose?.();
      onNavigate?.('orders');
    } else if (action.type === 'navigate_category') {
      onClose?.();
      onNavigate?.('listing', { category: action.category });
    } else if (action.type === 'open_whatsapp') {
      const text = encodeURIComponent('Hello Shopio Team! I need help with my account.');
      window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-cleared',
        sender: 'ai',
        time: 'Just now',
        text: 'चॅट हिस्ट्री रिफ्रेश केली आहे. मी तुम्हाला काय मदत करू शकतो? 🛍️✨',
        chips: ['🎡 लकी स्पिन फिरवा', '🔥 आजचे ऑफर्स', '📦 ऑर्डर ट्रॅक करा'],
      },
    ]);
  };

  return (
    <div
      className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-6 z-[60] flex flex-col justify-end sm:block pointer-events-none"
      aria-label="Shopio AI Assistant"
    >
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs sm:hidden pointer-events-auto"
      />

      {/* Main Chat Box Container */}
      <div
        className="pointer-events-auto relative w-full sm:w-[390px] h-[85vh] sm:h-[580px] bg-white dark:bg-[#111827] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modern Gradient AI Header ── */}
        <div className="bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#6366F1] p-3.5 sm:p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/30 animate-pulse">
                🤖
              </div>
              <span className="w-3 h-3 bg-emerald-400 border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm sm:text-base leading-tight">
                  Shopio AI Assistant
                </h3>
                <span className="text-[9px] uppercase tracking-wider font-extrabold bg-white/25 px-1.5 py-0.5 rounded-full">
                  2.0
                </span>
              </div>
              <p className="text-[11px] text-pink-100 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping inline-block" />
                ऑनलाइन खरेदी सहाय्यक (Live)
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              title="चॅट रिफ्रेश करा (Clear Chat)"
              className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-xs font-bold transition-all text-white"
            >
              🔄
            </button>
            <button
              onClick={onClose}
              title="बंद करा (Close)"
              className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-sm font-black transition-all text-white ml-0.5"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Chat Messages Stream Area ── */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-gray-50/60 dark:bg-[#0B0F19]/60 scrollbar-thin">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[88%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs transition-all ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-tr from-[#9F2089] to-[#F43397] text-white rounded-tr-xs'
                    : 'bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 border border-gray-200/80 dark:border-gray-700/80 rounded-tl-xs'
                }`}
              >
                {/* Text formatting */}
                <div className="whitespace-pre-line font-normal">
                  {m.text}
                </div>

                {/* Optional Product Cards in AI response */}
                {m.productCards && m.productCards.length > 0 && (
                  <div className="mt-2.5 space-y-2">
                    {m.productCards.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-100 dark:border-gray-700 hover:border-[#9F2089] transition-all group text-left cursor-pointer"
                        onClick={() => {
                          onClose?.();
                          onNavigate?.('product', { productId: p.id });
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-[#9F2089]">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              ₹{p.price}
                            </span>
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{p.mrp}
                            </span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-1 py-0.2 rounded font-black">
                              {p.discount}% OFF
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart?.(p, 1);
                            onShowToast?.(`"${p.name.slice(0, 18)}..." कार्टमध्ये जोडले! 🛒`);
                          }}
                          className="p-1.5 rounded-lg bg-[#9F2089] hover:bg-[#851871] text-white text-xs font-bold transition-transform active:scale-95"
                          title="Add to Cart"
                        >
                          🛒
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Direct Action Button */}
                {m.action && (
                  <button
                    onClick={() => handleActionClick(m.action)}
                    className="mt-2.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#FF8A00] text-white text-xs font-black shadow-md hover:opacity-95 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>{m.action.label}</span>
                  </button>
                )}

                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-pink-200' : 'text-gray-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>

              {/* Quick Prompt Chips */}
              {m.chips && m.chips.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[92%]">
                  {m.chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white dark:bg-[#1E293B] border border-pink-200 dark:border-pink-900/50 text-[#9F2089] dark:text-[#F43397] hover:bg-pink-50 dark:hover:bg-gray-800 transition-all shadow-2xs hover:scale-105 active:scale-95"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 w-20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#9F2089] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#D81B80] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-bounce [animation-delay:0.4s]" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Box Form ── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-2.5 sm:p-3 bg-white dark:bg-[#111827] border-t border-gray-100 dark:border-gray-800 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="विचारा: साडी, ऑर्डर स्टेटस, स्पिन किंवा ऑफर्स..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl bg-gray-100 dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 border border-transparent focus:border-[#9F2089] outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white flex items-center justify-center font-black shadow-md hover:opacity-90 disabled:opacity-40 transition-all transform active:scale-95 flex-shrink-0"
            title="पाठवा (Send)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
