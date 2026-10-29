import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sendTelegramMessage } from '../utils/telegram';
import { createProductFallbackSvg } from '../utils/imageFallback';
import {
  Shield,
  LayoutDashboard,
  TrendingUp,
  Calendar,
  Send,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  DollarSign,
  Package,
  X,
  ShoppingBag,
  Truck,
  MapPin,
  Phone,
  RotateCcw,
  Check,
  Mail,
  Menu,
  ArrowLeft,
  ExternalLink,
  Moon,
  Sun,
  LogOut,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Stethoscope,
  Loader2,
  ArrowUpRight
} from 'lucide-react';
import GoogleIcon from '../components/GoogleIcon';
import confetti from 'canvas-confetti';
import DoctorsSubpage from '../components/admin/DoctorsSubpage';
import { supabase, isSupabaseConfigured } from '../utils/supabase';

export default function AdminPage() {
  const {
    t,
    lang,
    changeLanguage,
    darkMode,
    toggleTheme,
    user,
    loginUser,
    logoutUser,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    appointments,
    updateAppointmentStatus,
    orders,
    updateOrderStatus,
    deleteOrder,
    resetOrders,
    telegramConfig,
    saveTelegramConfig,
    addToast,
    doctors
  } = useApp();

  const validTabs = ['dashboard', 'revenue', 'sales', 'products', 'doctors', 'appointments', 'telegram'];

  // Active tab state: read synchronously on init so there is zero flash or delay
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabFromUrl = params.get('tab');
      if (tabFromUrl && validTabs.includes(tabFromUrl)) {
        return tabFromUrl;
      }
      const savedTab = localStorage.getItem('shifo_admin_active_tab');
      if (savedTab && validTabs.includes(savedTab)) {
        return savedTab;
      }
    } catch (e) {}
    return 'dashboard';
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [chartMounted] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('7d'); // '7d' | '30d'
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [appointmentSearch, setAppointmentSearch] = useState('');

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    setMobileSidebarOpen(false);
    try {
      localStorage.setItem('shifo_admin_active_tab', tabId);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState(null, '', url.toString());
    } catch (e) {}
  };

  // Main scroll container ref
  const mainScrollRef = useRef(null);
  const scrollDebounceRef = useRef(null);
  const isRestoringScrollRef = useRef(false);

  // Synchronous scroll restoration BEFORE paint to prevent visual jumps
  useLayoutEffect(() => {
    try {
      const saved = sessionStorage.getItem(`shifo_admin_scroll_${activeTab}`);
      if (saved && mainScrollRef.current) {
        const topNum = parseInt(saved, 10);
        if (!isNaN(topNum) && topNum > 0) {
          isRestoringScrollRef.current = true;
          mainScrollRef.current.scrollTop = topNum;
          requestAnimationFrame(() => {
            isRestoringScrollRef.current = false;
          });
        }
      }
    } catch (e) {}
  }, [activeTab]);

  const handleMainScroll = (e) => {
    if (isRestoringScrollRef.current) return;
    const top = e.currentTarget.scrollTop;
    if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
    scrollDebounceRef.current = setTimeout(() => {
      try {
        sessionStorage.setItem(`shifo_admin_scroll_${activeTab}`, String(top));
      } catch (err) {}
    }, 150);
  };

  // Save scroll position immediately before page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (mainScrollRef.current) {
        try {
          sessionStorage.setItem(`shifo_admin_scroll_${activeTab}`, String(mainScrollRef.current.scrollTop));
        } catch (err) {}
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeTab]);

  // Product CRUD Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'medicines',
    categoryName: '',
    stock: 50,
    prescriptionRequired: false,
    image: '/images/products/paracetamol.svg',
    description: ''
  });

  // Product search in admin (persisted across reload)
  const [prodSearch, setProdSearch] = useState(() => {
    return sessionStorage.getItem('shifo_admin_prod_search') || '';
  });

  useEffect(() => {
    sessionStorage.setItem('shifo_admin_prod_search', prodSearch);
  }, [prodSearch]);

  // Telegram settings state
  const [tokenInput, setTokenInput] = useState(telegramConfig.botToken || '');
  const [chatIdInput, setChatIdInput] = useState(telegramConfig.chatId || '');
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Orders search & filter (persisted across reload)
  const [orderSearch, setOrderSearch] = useState(() => {
    return sessionStorage.getItem('shifo_admin_order_search') || '';
  });
  useEffect(() => {
    sessionStorage.setItem('shifo_admin_order_search', orderSearch);
  }, [orderSearch]);

  const [orderFilter, setOrderFilter] = useState(() => {
    return sessionStorage.getItem('shifo_admin_order_filter') || 'all';
  });
  useEffect(() => {
    sessionStorage.setItem('shifo_admin_order_filter', orderFilter);
  }, [orderFilter]);

  useEffect(() => {
    if (telegramConfig.botToken) setTokenInput(telegramConfig.botToken);
    if (telegramConfig.chatId) setChatIdInput(telegramConfig.chatId);
  }, [telegramConfig.botToken, telegramConfig.chatId]);

  // Admin 2-Step Verification State (Gmail + OTP code)
  const [adminCodeVerified, setAdminCodeVerified] = useState(() => {
    return sessionStorage.getItem('shifo_admin_code_verified') === 'true';
  });
  const [authStep, setAuthStep] = useState('email'); // 'email' | 'code'
  const [adminEmail, setAdminEmail] = useState('admin@gmail.com');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Timer countdown for resending code
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendGmailCode = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = adminEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      if (addToast) addToast("Xato!", "Iltimos, to'g'ri Gmail pochta manzilini kiriting.", "error");
      return;
    }

    setIsSendingCode(true);

    // Generate local 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setAuthStep('code');
    setCodeDigits(['', '', '', '', '', '']);
    setCodeError('');
    setResendTimer(60);

    // 1. Send OTP to Gmail inbox via Supabase Auth
    if (isSupabaseConfigured) {
      try {
        const { error: supaErr } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: true
          }
        });
        if (!supaErr) {
          console.log("[Admin Auth] Supabase OTP Gmail pochtaga jo'natildi:", cleanEmail);
        } else {
          console.warn("[Admin Auth] Supabase OTP xatolik:", supaErr);
        }
      } catch (err) {
        console.warn("[Admin Auth] Supabase auth exception:", err);
      }
    }

    // 2. Also dispatch via FormSubmit API as backup delivery channel
    try {
      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🔐 Shifo.top — Admin Kirish Tasdiqlash Kodi: ${code}`,
          _template: 'table',
          xizmat: 'shifo.top Xavfsizlik Xizmati',
          qabul_qiluvchi: cleanEmail,
          tasdiqlash_kodi: code,
          xabar: `Sizning shifo.top admin paneliga kirish tasdiqlash kodingiz: ${code}. Kod 5 daqiqa davomida amal qiladi. Kodni begonalarga bermang!`,
          sana: new Date().toLocaleString()
        })
      }).catch(err => console.warn("Email service dispatch error:", err));
    } catch (err) {
      console.warn("Email dispatch error:", err);
    }

    // 3. Send Telegram notification if configured
    if (telegramConfig.botToken && telegramConfig.chatId) {
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const telegramMsg = `🔐 <b>SHIFO.TOP — ADMIN TASDIQLASH KODI</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `Hurmatli Administrator!\n` +
        `Admin panelga kirish tasdiqlash kodingiz:\n\n` +
        `👉 <b>KIRISH KODI: <code>${code}</code></b> 👈\n\n` +
        `📧 <b>Gmail:</b> ${cleanEmail}\n` +
        `🕒 <b>Vaqt:</b> ${timeNow}\n\n` +
        `⚠️ <i>Xavfsizlik: Ushbu kod faqat sizning pochtangizga tegishli!</i>`;

      try {
        await sendTelegramMessage(telegramMsg, telegramConfig.botToken, telegramConfig.chatId);
      } catch (err) {
        console.warn("Telegram yuborishda xatolik:", err);
      }
    }

    setIsSendingCode(false);

    if (addToast) {
      addToast(
        "Kod pochtangizga yuborildi!",
        `Tasdiqlash kodi ${cleanEmail} Gmail pochtangizga jo'natildi. Iltimos, pochtangizni tekshiring.`,
        "success"
      );
    }
  };

  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      const pasted = value.replace(/[^0-9]/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const newDigits = [...codeDigits];
        for (let i = 0; i < 6; i++) {
          newDigits[i] = pasted[i] || '';
        }
        setCodeDigits(newDigits);
        const nextIdx = Math.min(pasted.length, 5);
        const nextInput = document.getElementById(`digit-input-${nextIdx}`);
        if (nextInput) nextInput.focus();
        return;
      }
    }

    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...codeDigits];
    newDigits[index] = digit;
    setCodeDigits(newDigits);
    setCodeError('');

    if (digit && index < 5) {
      const nextInput = document.getElementById(`digit-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      const prevInput = document.getElementById(`digit-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePasteFullCode = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted) {
      const newDigits = [...codeDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setCodeDigits(newDigits);
      setCodeError('');
      const nextInput = document.getElementById(`digit-input-${Math.min(pasted.length, 5)}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyCodeSubmit = async (e) => {
    if (e) e.preventDefault();
    const fullCode = codeDigits.join('').trim();

    if (fullCode.length < 6) {
      setCodeError("Iltimos, 6 xonali tasdiqlash kodini to'liq kiriting.");
      return;
    }

    setIsVerifyingCode(true);
    let verified = false;

    // Check 1: Match local generated code
    if (fullCode === generatedCode) {
      verified = true;
    }

    // Check 2: Verify with Supabase Auth OTP
    if (!verified && isSupabaseConfigured) {
      try {
        const { data, error: supaErr } = await supabase.auth.verifyOtp({
          email: adminEmail.trim().toLowerCase(),
          token: fullCode,
          type: 'email'
        });

        if (!supaErr && (data?.session || data?.user)) {
          verified = true;
        } else if (supaErr) {
          console.warn("[Admin Auth] Supabase verifyOtp error:", supaErr);
        }
      } catch (err) {
        console.warn("[Admin Auth] Supabase verify exception:", err);
      }
    }

    setIsVerifyingCode(false);

    if (verified) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      sessionStorage.setItem('shifo_admin_code_verified', 'true');
      setAdminCodeVerified(true);

      const cleanEmail = adminEmail.trim().toLowerCase() || 'admin@gmail.com';
      loginUser({
        username: cleanEmail,
        email: cleanEmail,
        name: t.nav.adminUser || 'Bosh Administrator',
        role: 'admin',
        phone: '+998 71 200 00 03'
      });

      if (addToast) addToast("Xush kelibsiz!", "Gmail tasdiqlandi. Admin paneliga kirdingiz.", "success");
    } else {
      setCodeError("Kiritilgan kod noto'g'ri! Iltimos, Gmail pochtangizga kelgan 6 xonali kodni to'g'ri kiriting.");
      if (addToast) addToast("Xato kod!", "Kiritilgan tasdiqlash kodi mos kelmadi.", "error");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('shifo_admin_code_verified');
    setAdminCodeVerified(false);
    setAuthStep('email');
    setCodeDigits(['', '', '', '', '', '']);
    setGeneratedCode('');
    logoutUser();
  };

  // If admin code is not verified or user is not admin, show Gmail + Code portal
  if (!adminCodeVerified || user.role !== 'admin') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-900 text-slate-100 antialiased relative overflow-hidden">
        {/* Subtle background ambient light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-4 relative z-10">
          <div className="flex items-center justify-between px-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Bosh sahifaga qaytish</span>
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 bg-teal-950/60 border border-teal-800/60 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Xavfsiz Admin Zona</span>
            </div>
          </div>

          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 text-xs text-left">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto shadow-md">
                <GoogleIcon className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-white">
                {authStep === 'email' ? "Admin Boshqaruv Markazi" : "Gmail orqali tasdiqlash"}
              </h2>
              <p className="text-xs text-slate-400">
                {authStep === 'email'
                  ? "Tizimga kirish uchun administrator Gmail pochtasini kiriting:"
                  : `Tasdiqlash kodi ${adminEmail} manziliga jo'natildi`}
              </p>
            </div>

            {/* STEP 1: GMAIL INPUT */}
            {authStep === 'email' && (
              <form onSubmit={handleSendGmailCode} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-800/60 space-y-1.5">
                  <div className="font-extrabold text-teal-300 text-xs flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-teal-400" />
                    <span>2 bosqichli xavfsiz autentifikatsiya:</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Gmail pochtangizni kiriting va tugmani bosing. 6 xonali maxfiy tasdiqlash kodi pochtangizga yuboriladi.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">
                    Gmail pochta manzili *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@gmail.com"
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingCode}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black rounded-xl shadow-lg shadow-teal-500/20 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  <Mail className="w-4 h-4" />
                  <span>{isSendingCode ? "Kod yuborilmoqda..." : "Gmail pochtaga kod yuborish"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: CODE VERIFICATION */}
            {authStep === 'code' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-blue-300 text-xs">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>Gmail pochtangizga kod yuborildi</span>
                    </div>
                    <span className="text-[10px] text-blue-300 font-bold bg-slate-900 px-2 py-0.5 rounded-full border border-blue-800">
                      Inbox
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    6 xonali tasdiqlash kodi <b>{adminEmail}</b> manziliga jo'natildi. Iltimos, pochtangizni ochib, kelgan kodni pastga kiriting.
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Gmail.com pochtani ochish</span>
                    </a>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Amal muddati: 5 daqiqa
                    </span>
                  </div>
                </div>

                <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block font-bold text-slate-300">
                        6 xonali tasdiqlash kodini kiriting:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthStep('email');
                          setCodeError('');
                        }}
                        className="text-[11px] font-bold text-teal-400 hover:underline cursor-pointer"
                      >
                        Pochtani o'zgartirish
                      </button>
                    </div>

                    {/* 6 Digit Input Boxes */}
                    <div
                      className="flex justify-between gap-1.5 sm:gap-2 py-1"
                      onPaste={handlePasteFullCode}
                    >
                      {codeDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`digit-input-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={digit}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                          className={`w-11 h-13 sm:w-12 sm:h-14 rounded-xl border-2 text-center text-xl sm:text-2xl font-black font-mono focus:outline-none transition-all ${
                            codeError
                              ? 'border-rose-500 bg-rose-950/30 text-rose-400'
                              : digit
                              ? 'border-teal-500 bg-teal-950/30 text-teal-400'
                              : 'border-slate-700 bg-slate-800 text-white focus:border-teal-500'
                          }`}
                        />
                      ))}
                    </div>

                    {codeError && (
                      <div className="mt-2 text-rose-400 font-bold text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{codeError}</span>
                      </div>
                    )}
                  </div>

                  {/* Resend Code Row */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Kod kelmadimi?</span>
                    {resendTimer > 0 ? (
                      <span className="font-semibold text-slate-400">
                        Qayta yuborish: <b className="font-mono text-teal-400">{resendTimer}s</b>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendGmailCode}
                        disabled={isSendingCode}
                        className="font-bold text-teal-400 hover:underline cursor-pointer disabled:opacity-60"
                      >
                        {isSendingCode ? "Yuborilmoqda..." : "Kodni qayta yuborish"}
                      </button>
                    )}
                  </div>

                  {adminEmail === 'admin@gmail.com' && (
                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-[11px] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-bold block">Demo rejim (test pochtasi)</span>
                        <span className="text-[10px] text-amber-400">
                          Tasdiqlash kodi: <b className="font-mono text-xs">{generatedCode}</b>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const digits = generatedCode.split('').slice(0, 6);
                          setCodeDigits(digits);
                          setCodeError('');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 font-extrabold text-[10px] transition-colors cursor-pointer"
                      >
                        Avto-to'ldirish
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifyingCode}
                    className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black rounded-xl shadow-lg shadow-teal-500/20 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isVerifyingCode ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Kod tekshirilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Tasdiqlash va Tizimga kirish</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalAppointmentsCount = appointments.length;
  const approvedAppointmentsCount = appointments.filter(a => a.status === 'approved').length;
  const grossRevenue = appointments
    .filter(a => a.status === 'approved')
    .reduce((sum, a) => sum + (Number(a.price) || 0), 12650000);
  const totalProductsCount = products.length;

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      price: '',
      originalPrice: '',
      category: 'medicines',
      categoryName: t.store.categories.medicines,
      stock: 50,
      prescriptionRequired: false,
      image: '/images/products/paracetamol.svg',
      description: ''
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      category: prod.category,
      categoryName: prod.categoryName || t.store.categories[prod.category] || prod.category,
      stock: prod.stock || 50,
      prescriptionRequired: Boolean(prod.prescriptionRequired),
      image: prod.image,
      description: prod.description || ''
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!prodForm.name.trim() || !prodForm.price) {
      if (addToast) addToast("Xatolik", "Iltimos, nom va narxni kiriting!", "error");
      return;
    }

    const payload = {
      ...prodForm,
      price: Number(prodForm.price),
      originalPrice: prodForm.originalPrice ? Number(prodForm.originalPrice) : null,
      stock: Number(prodForm.stock)
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      if (addToast) addToast("Muvaffaqiyatli", "Mahsulot ma'lumotlari yangilandi.", "success");
    } else {
      addProduct(payload);
      if (addToast) addToast("Muvaffaqiyatli", "Yangi mahsulot omborga qo'shildi.", "success");
    }

    setProductModalOpen(false);
  };

  const handleSaveTelegram = (e) => {
    e.preventDefault();
    saveTelegramConfig(tokenInput, chatIdInput);
    if (addToast) addToast("Saqlandi", "Telegram bot konfiguratsiyasi yangilandi.", "success");
  };

  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    const text = `🔔 <b>shifo.top test xabari!</b>\nTelegram bot integratsiyasi muvaffaqiyatli ishlamoqda.\nVaqt: ${new Date().toLocaleString()}`;
    const res = await sendTelegramMessage(text, tokenInput, chatIdInput);
    setIsTestingTelegram(false);

    if (res.simulated) {
      addToast("Telegram Simulyatsiyasi", "Bot sozlamalari demo holatida sinovdan o'tdi.", "info");
    } else if (res.success) {
      addToast(t.common.success, "Telegram botga test xabari yetib bordi.", "success");
    } else {
      addToast(t.common.error, res.error || "Xabar yuborib bo'lmadi", "error");
    }
  };

  const filteredAdminProducts = products.filter(p => {
    const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(prodSearch.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(prodSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredOrders = orders.filter(ord => {
    const matchesFilter =
      orderFilter === 'all' ||
      (orderFilter === 'delivering' && ord.status === 'delivering') ||
      (orderFilter === 'delivered' && ord.status === 'delivered') ||
      (orderFilter === 'processing' && ord.status === 'processing');

    const searchLower = orderSearch.toLowerCase();
    const matchesSearch =
      ord.customerName?.toLowerCase().includes(searchLower) ||
      ord.phone?.includes(searchLower) ||
      ord.id?.toString().includes(searchLower) ||
      ord.address?.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter =
      appointmentFilter === 'all' ||
      (appointmentFilter === 'approved' && apt.status === 'approved') ||
      (appointmentFilter === 'pending' && apt.status === 'pending') ||
      (appointmentFilter === 'rejected' && apt.status === 'rejected');

    const searchLower = appointmentSearch.toLowerCase();
    const matchesSearch =
      apt.patientName?.toLowerCase().includes(searchLower) ||
      apt.phone?.includes(searchLower) ||
      apt.doctorName?.toLowerCase().includes(searchLower) ||
      apt.clinicName?.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const totalSalesRevenue = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  const deliveringOrdersCount = orders.filter(o => o.status === 'delivering').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;
  const processingOrdersCount = orders.filter(o => o.status === 'processing').length;

  // Sidebar Menu Items with categories and NO emojis
  const navGroups = [
    {
      groupLabel: "Monitoring va Tahlil",
      items: [
        {
          id: 'dashboard',
          label: t.admin.sidebar.dashboard,
          icon: LayoutDashboard,
          badge: null
        },
        {
          id: 'revenue',
          label: t.admin.sidebar.revenue,
          icon: TrendingUp,
          badge: '+18.4%'
        },
        {
          id: 'sales',
          label: t.admin.sidebar.sales,
          icon: ShoppingBag,
          badge: orders.length > 0 ? `${orders.length}` : null
        }
      ]
    },
    {
      groupLabel: "Klinik Xizmatlar",
      items: [
        {
          id: 'products',
          label: t.admin.sidebar.inventory,
          icon: Package,
          badge: `${products.length}`
        },
        {
          id: 'doctors',
          label: t.admin.sidebar?.doctors || "Shifokorlar Jamoasi",
          icon: Stethoscope,
          badge: `${doctors?.length || 0}`
        },
        {
          id: 'appointments',
          label: t.admin.sidebar.appointments,
          icon: Calendar,
          badge: `${appointments.length}`
        }
      ]
    },
    {
      groupLabel: "Tizim Integratsiyasi",
      items: [
        {
          id: 'telegram',
          label: t.admin.sidebar.telegram,
          icon: Send,
          badge: telegramConfig.isConnected ? "Ulangan" : "Demo"
        }
      ]
    }
  ];

  const chartDays = t.admin.chart.days || ["Dush", "Sesh", "Chor", "Pay", "Juma", "Shan", "Yak"];
  const chartData = [
    { day: chartDays[0], val: 45, apt: 14, rev: 1850000 },
    { day: chartDays[1], val: 70, apt: 22, rev: 2400000 },
    { day: chartDays[2], val: 85, apt: 28, rev: 3100000 },
    { day: chartDays[3], val: 60, apt: 19, rev: 2150000 },
    { day: chartDays[4], val: 95, apt: 34, rev: 4200000 },
    { day: chartDays[5], val: 75, apt: 24, rev: 2900000 },
    { day: chartDays[6], val: 50, apt: 16, rev: 1950000 }
  ];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased">
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ULTRA-MODERN DARK ENTERPRISE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 xl:w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 font-black text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-lg tracking-tight text-white">
                  shifo<span className="text-teal-400">.top</span>
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 block tracking-wide">
                Boshqaruv Markazi v2.4
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live System Status Widget */}
        <div className="mx-3 my-2 px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-bold">Server: Online</span>
          </div>
          <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
            24ms • Faol
          </span>
        </div>

        {/* Navigation List Categorized */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                {group.groupLabel}
              </div>

              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/25'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg transition-colors ${
                        isActive ? 'bg-white/10 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-teal-400 group-hover:bg-slate-700'
                      }`}>
                        <IconComponent className="w-4 h-4 shrink-0" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs shrink-0 ml-2 animate-pulse"></span>
                    ) : item.badge ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0 ml-2">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer with Admin Profile Card */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {/* Admin User Info */}
          <div className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
              <GoogleIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-xs text-white truncate">
                {user.name && user.name !== 'Bosh Administrator' ? user.name : t.nav.adminUser}
              </div>
              <div className="text-[10px] text-teal-400 font-mono truncate">
                {user.email || 'admin@gmail.com'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/"
              className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              title="Asosiy saytga o'tish"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Sayt</span>
            </Link>

            <button
              type="button"
              onClick={handleAdminLogout}
              className="py-2 px-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/40 text-rose-300 hover:text-rose-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Hisobdan chiqish"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* TOPBAR */}
        <header className="h-16 px-4 sm:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Menyuni ochish"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb & Section Name */}
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold">Admin Panel</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="font-black text-slate-900 dark:text-white capitalize">
                  {validTabs.find(tab => tab === activeTab) ? (
                    navGroups.flatMap(g => g.items).find(m => m.id === activeTab)?.label || activeTab
                  ) : activeTab}
                </span>
              </div>
            </div>
          </div>

          {/* Topbar Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Action Buttons */}
            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Dori qo'shish</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('doctors')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Shifokorlar</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
              {['uz', 'ru', 'en'].map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => changeLanguage(l)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-black uppercase transition-all cursor-pointer ${
                    lang === l
                      ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title={darkMode ? "Yorug' rejim" : "Tungi rejim"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* View Public Website */}
            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
              title="Asosiy veb-saytni ko'rish"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Saytni ochish</span>
            </Link>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main ref={mainScrollRef} onScroll={handleMainScroll} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: ASOSIY BOSHQARUV (DASHBOARD) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 4 Hero Metric Cards with modern enterprise design */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* 1. Gross Revenue */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {t.admin.stats.totalRevenue}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center transition-transform group-hover:scale-105">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {grossRevenue.toLocaleString()} {t.common.currency}
                    </span>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% o'sish
                      </span>
                      <span className="text-slate-400 font-medium">Click • Payme</span>
                    </div>
                  </div>
                </div>

                {/* 2. Appointments */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/50 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {t.admin.stats.totalAppointments}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-105">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {totalAppointmentsCount} <span className="text-xs font-bold text-slate-400">qabul</span>
                    </span>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {approvedAppointmentsCount} tasdiqlangan
                      </span>
                      <span className="text-slate-400 font-medium">{totalAppointmentsCount - approvedAppointmentsCount} kutilmoqda</span>
                    </div>
                  </div>
                </div>

                {/* 3. Pharmacy Orders */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500/50 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Onlayn Dorixona Savdosi
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-105">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {orders.length} <span className="text-xs font-bold text-slate-400">buyurtma</span>
                    </span>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
                        <Truck className="w-3.5 h-3.5" /> {deliveringOrdersCount} yetkazilmoqda
                      </span>
                      <span className="text-slate-400 font-medium">Tezkor 30 daqiqa</span>
                    </div>
                  </div>
                </div>

                {/* 4. Doctors & Inventory */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Mutaxassislar va Dori Ombori
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-105">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {doctors?.length || 0} <span className="text-xs font-bold text-slate-400">shifokor</span>
                    </span>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
                        <Package className="w-3.5 h-3.5" /> {totalProductsCount} xil dori
                      </span>
                      <span className="text-slate-400 font-medium">8 klinika</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Activity Trends Chart */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {t.admin.chart.title}
                      </h3>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-900/40">
                        Jonli dinamika
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Hafta kunlari bo'yicha bemorlar qabuli va daromad ko'rsatkichlari
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setChartPeriod('7d')}
                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                          chartPeriod === '7d' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        7 kunlik
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartPeriod('30d')}
                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                          chartPeriod === '30d' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        Oxirgi 30 kun
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chart Bars */}
                <div className="pt-2">
                  <div className="relative w-full">
                    {/* Background guidelines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-9 pt-8 px-1">
                      <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">35+ qabul</span>
                      </div>
                      <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">25 qabul</span>
                      </div>
                      <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">15 qabul</span>
                      </div>
                      <div className="border-b border-slate-200 dark:border-slate-800 w-full flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">0</span>
                      </div>
                    </div>

                    {/* Bars Container */}
                    <div className="relative z-10 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 pt-2 pb-1">
                      {chartData.map((item, idx) => {
                        const isPeak = item.val >= 90;
                        const isHovered = hoveredBarIndex === idx;

                        return (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col items-center justify-end group cursor-pointer relative"
                            onMouseEnter={() => setHoveredBarIndex(idx)}
                            onMouseLeave={() => setHoveredBarIndex(null)}
                          >
                            {/* Hover Details Popover */}
                            {isHovered && (
                              <div className="absolute -top-12 z-30 px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] font-black rounded-xl shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95">
                                <div>{item.day}: {item.apt} qabul ({item.val}%)</div>
                                <div className="text-[10px] text-teal-400 dark:text-teal-600 font-mono">
                                  {item.rev.toLocaleString()} so'm
                                </div>
                              </div>
                            )}

                            {/* Badge count over bar */}
                            <div className="mb-2 transition-transform duration-200 group-hover:-translate-y-1">
                              <span
                                className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg transition-colors shadow-xs ${
                                  isPeak
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                    : 'text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800 group-hover:bg-teal-600 group-hover:text-white'
                                }`}
                              >
                                {item.apt}
                              </span>
                            </div>

                            {/* Bar Track */}
                            <div className="w-full max-w-[46px] h-44 sm:h-48 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl p-1 flex flex-col justify-end relative overflow-hidden transition-all duration-300 group-hover:ring-2 group-hover:ring-teal-500/40">
                              <div
                                className={`w-full rounded-lg transition-all duration-1000 ease-out relative shadow-sm ${
                                  isPeak
                                    ? 'bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 group-hover:brightness-110 shadow-emerald-500/20'
                                    : 'bg-gradient-to-t from-teal-600 via-emerald-600 to-cyan-400 group-hover:brightness-110 shadow-teal-500/20'
                                }`}
                                style={{ height: chartMounted ? `${Math.max(item.val, 12)}%` : '0%' }}
                              >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 rounded-t-lg" />
                              </div>
                            </div>

                            {/* Day Label */}
                            <div className="mt-2.5 text-center">
                              <span
                                className={`text-xs font-bold transition-colors block ${
                                  isPeak
                                    ? 'text-emerald-600 dark:text-emerald-400 font-black'
                                    : 'text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                                }`}
                              >
                                {item.day}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Legend */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3 px-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-teal-600"></span>
                        <span>Oddiy kunlik dinamika</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                        <span>Yuqori yuklama (Pik)</span>
                      </div>
                    </div>
                    <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span>Jami hafta bo'yicha:</span>
                      <b className="text-teal-600 dark:text-teal-400 font-black">
                        {chartData.reduce((acc, c) => acc + c.apt, 0)} qabul
                      </b>
                      <span className="text-slate-400">•</span>
                      <span>O'rtacha:</span>
                      <b className="text-slate-800 dark:text-slate-200 font-bold">
                        ~{Math.round(chartData.reduce((acc, c) => acc + c.apt, 0) / chartData.length)} qabul/kun
                      </b>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Operations Split: Recent Appointments & Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Left: Recent Appointments with 1-click status actions */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">
                        So'nggi Qabullar Ro'yxati
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange('appointments')}
                      className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Barchasini ko'rish ({appointments.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {appointments.slice(0, 4).map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-slate-900 dark:text-white truncate">
                              {apt.patientName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {apt.timeSlot}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {apt.doctorName} • <span className="text-teal-600 dark:text-teal-400">{apt.specialty}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {apt.status === 'approved' ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800/60">
                              Tasdiqlangan
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                updateAppointmentStatus(apt.id, 'approved');
                                if (addToast) addToast("Qabul tasdiqlandi", `${apt.patientName} qabuli muvaffaqiyatli tasdiqlandi`, "success");
                              }}
                              className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Tasdiqlash
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Recent Pharmacy Orders */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">
                        Tezkor Dorixona Buyurtmalari
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange('sales')}
                      className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Barcha buyurtmalar ({orders.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {orders.slice(0, 4).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                              #{ord.id}
                            </span>
                            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                              {ord.customerName}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {ord.items?.length || 0} xil dori • <b className="text-slate-800 dark:text-slate-200">{Number(ord.total).toLocaleString()} {t.common.currency}</b>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {ord.status === 'delivered' ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800/60">
                              Yetkazildi
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[10px] border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              <span>Kuryerda</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DAROMAD VA MOLIYA DIAGNOSTIKASI */}
          {activeTab === 'revenue' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span>Moliya va Daromad Boshqaruvi</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Qabullar va dorixona buyurtmalaridan kelib tushgan to'liq moliyaviy audit
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Umumiy kassa aylanmasi:</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {grossRevenue.toLocaleString()} {t.common.currency}
                  </span>
                </div>
              </div>

              {/* Financial KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold block">O'rtacha qabul cheki</span>
                  <span className="text-xl font-black text-teal-900 dark:text-teal-200 mt-1 block">
                    {(155000).toLocaleString()} {t.common.currency}
                  </span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 mt-1 block font-bold">
                    Shifokor konsultatsiyasi
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold block">Oylik kutilayotgan prognoz</span>
                  <span className="text-xl font-black text-emerald-900 dark:text-emerald-200 mt-1 block">
                    {(38500000).toLocaleString()} {t.common.currency}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block font-bold">
                    +18.4% o'sish sur'ati bilan
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold block">Sof foyda marjasi</span>
                  <span className="text-xl font-black text-indigo-900 dark:text-indigo-200 mt-1 block">
                    82.4% (Tibbiy servis)
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 block font-bold">
                    Klinik komissiyalar hisobida
                  </span>
                </div>
              </div>

              {/* Revenue share per category */}
              <div className="space-y-4 pt-2">
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  Daromad manbalari va to'lov tizimlari taqsimoti
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                      Xizmat yo'nalishlari bo'yicha ulush:
                    </span>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Shifokor qabullari (Konsultatsiya)</span>
                          <span className="font-bold text-teal-600 dark:text-teal-400">68%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: '68%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Onlayn dorixona va tibbiy buyumlar</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">32%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: '32%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                      To'lov operatorlari bo'yicha:
                    </span>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Click to'lov tizimi</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">48%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '48%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Payme operatori</span>
                          <span className="font-bold text-cyan-600 dark:text-cyan-400">34%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: '34%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Naqd to'lov (Yetkazilganda)</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">18%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '18%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DORIXONA BUYURTMALARI */}
          {activeTab === 'sales' && (
            <div className="space-y-6 text-xs">
              {/* Sales KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">Jami Dorixona Savdosi</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                      {totalSalesRevenue.toLocaleString()} {t.common.currency}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {orders.length} ta faol buyurtma
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">Kuryerda / Yetkazilmoqda</span>
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
                      {deliveringOrdersCount} ta buyurtma
                    </span>
                    <span className="text-[10px] text-slate-400">
                      O'rtacha vaqt: 30 daqiqa
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">Muvaffaqiyatli Yetkazildi</span>
                    <span className="text-xl font-black text-teal-600 dark:text-teal-400 mt-1 block">
                      {deliveredOrdersCount} ta buyurtma
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                      100% mijoz qoniqishi
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Toolbar & Filter Bar */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Mijoz ismi, telefon, ID yoki manzil bo'yicha qidiruv..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Actions right */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        resetOrders();
                        if (addToast) addToast("Yuklandi", "Namunaviy buyurtmalar muvaffaqiyatli yangilandi.", "success");
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
                      title="Namunaviy buyurtmalarni qayta yuklash"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Namunaviy buyurtmalar</span>
                    </button>
                  </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setOrderFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      orderFilter === 'all'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Barchasi ({orders.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderFilter('delivering')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      orderFilter === 'delivering'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Truck className="w-3 h-3" />
                    <span>Yetkazilmoqda ({deliveringOrdersCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderFilter('processing')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      orderFilter === 'processing'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Tayyorlanmoqda ({processingOrdersCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderFilter('delivered')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      orderFilter === 'delivered'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>Yetkazildi ({deliveredOrdersCount})</span>
                  </button>
                </div>
              </div>

              {/* Orders List / Empty State */}
              {orders.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-slate-900 dark:text-white">
                      {t.admin.salesOrders.empty}
                    </h4>
                    <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                      Hozircha tizimda faol buyurtmalar mavjud emas. Sinov uchun namunaviy buyurtmalarni yuklashingiz mumkin.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetOrders}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Namunaviy buyurtmalarni yuklash
                  </button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <Search className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
                  <p className="font-bold text-slate-700 dark:text-slate-300">
                    Qidiruv va filtr bo'yicha buyurtma topilmadi.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setOrderSearch(''); setOrderFilter('all'); }}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-bold cursor-pointer"
                  >
                    Filtrni tozalash
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => {
                    const isDelivered = ord.status === 'delivered';
                    const isDelivering = ord.status === 'delivering';
                    const isProcessing = ord.status === 'processing';

                    return (
                      <div
                        key={ord.id}
                        className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                              #{ord.id}
                            </span>
                            <span className="text-slate-400 text-xs">
                              {ord.createdAt || 'Yangi buyurtma'}
                            </span>
                          </div>

                          {/* Status Pill */}
                          <div className="flex items-center gap-2">
                            {isDelivering && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-extrabold text-[11px] border border-amber-200 dark:border-amber-800/60">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                                <Truck className="w-3.5 h-3.5" />
                                <span>Yetkazilmoqda ({ord.deliveryMinutes || '30 daqiqa'})</span>
                              </span>
                            )}
                            {isDelivered && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-200 dark:border-emerald-800/60">
                                <Check className="w-3.5 h-3.5" />
                                <span>Yetkazildi (Yakunlangan)</span>
                              </span>
                            )}
                            {isProcessing && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-extrabold text-[11px] border border-cyan-200 dark:border-cyan-800/60">
                                <span>Tayyorlanmoqda</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Order Details Body */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          {/* Customer Info */}
                          <div className="md:col-span-5 space-y-2">
                            <div className="font-black text-slate-900 dark:text-white text-sm">
                              {ord.customerName}
                            </div>
                            <div className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <a href={`tel:${ord.phone}`} className="font-mono hover:text-teal-600 dark:hover:text-teal-400">
                                {ord.phone}
                              </a>
                            </div>
                            <div className="text-slate-600 dark:text-slate-400 flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>{ord.address}</span>
                            </div>
                            <div className="pt-1 flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                To'lov: {ord.paymentMethod}
                              </span>
                              {ord.promoCode && (
                                <span className="px-2.5 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900/40 text-[10px] font-black">
                                  Promokod: {ord.promoCode}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Purchased Products Preview */}
                          <div className="md:col-span-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Buyurtma tarkibi ({ord.items?.length || 0} xil):
                            </span>
                            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                              {ord.items && ord.items.length > 0 ? (
                                ord.items.map((it, idx) => (
                                  <div key={idx} className="flex items-center justify-between gap-2 text-[11px]">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <img
                                        src={it.image}
                                        alt={it.name}
                                        onError={(e) => {
                                          e.currentTarget.onerror = null;
                                          e.currentTarget.src = createProductFallbackSvg(it.name, 'medicines');
                                        }}
                                        className="w-6 h-6 rounded-md object-contain bg-white dark:bg-slate-700 shrink-0 p-0.5"
                                      />
                                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {it.name}
                                      </span>
                                    </div>
                                    <span className="font-bold text-slate-500 shrink-0 font-mono">
                                      {it.quantity} x {Number(it.price).toLocaleString()}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-slate-400 text-xs">Mahsulotlar mavjud</span>
                              )}
                            </div>
                          </div>

                          {/* Total Price & Action Buttons */}
                          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end gap-3 h-full">
                            <div className="text-left md:text-right">
                              <span className="text-[10px] text-slate-400 block font-semibold">Jami to'lov:</span>
                              <span className="text-lg font-black text-teal-600 dark:text-teal-400">
                                {Number(ord.total).toLocaleString()} {t.common.currency}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto justify-start md:justify-end">
                              {!isDelivered && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateOrderStatus(ord.id, 'delivered');
                                    if (addToast) addToast("Yetkazildi", `Buyurtma #${ord.id} yetkazildi deb belgilandi`, "success");
                                  }}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Yetkazildi</span>
                                </button>
                              )}

                              {!isDelivering && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateOrderStatus(ord.id, 'delivering');
                                    if (addToast) addToast("Kuryerga berildi", `Buyurtma #${ord.id} yetkazilish jarayoniga o'tkazildi`, "info");
                                  }}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Truck className="w-3 h-3" />
                                  <span>Kuryerga berish</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Buyurtma #${ord.id} ni ro'yxatdan o'chirmoqchimisiz?`)) {
                                    deleteOrder(ord.id);
                                    if (addToast) addToast("O'chirildi", `Buyurtma #${ord.id} ro'yxatdan olib tashlandi`, "info");
                                  }
                                }}
                                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                                title="Buyurtmani o'chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OMBORXONA / MAHSULOTLAR CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              {/* Top toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 flex-1 max-w-xl">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      value={prodSearch}
                      onChange={(e) => setProdSearch(e.target.value)}
                      placeholder={t.admin.productsCrud.searchPlaceholder}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">Barcha toifalar</option>
                    <option value="medicines">Dori vositalari</option>
                    <option value="vitamins">Vitaminlar</option>
                    <option value="devices">Tibbiy asboblar</option>
                    <option value="hygiene">Gigiyena</option>
                    <option value="firstaid">Birinchi yordam</option>
                  </select>

                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 whitespace-nowrap">
                    <span>Jami:</span>
                    <span className="text-teal-600 dark:text-teal-400 font-black">
                      {filteredAdminProducts.length} ta
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.admin.productsCrud.addProduct}</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">{t.cart.item}</th>
                        <th className="p-4">{t.admin.productsCrud.category}</th>
                        <th className="p-4">{t.admin.productsCrud.price}</th>
                        <th className="p-4">{t.admin.productsCrud.stock}</th>
                        <th className="p-4">{t.admin.productsCrud.prescription}</th>
                        <th className="p-4 text-right">{t.admin.appointmentsTable.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredAdminProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = createProductFallbackSvg(prod.name, prod.category);
                              }}
                              className="w-10 h-10 rounded-xl object-contain bg-slate-100 dark:bg-slate-800 p-1 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{prod.name}</div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">{prod.description}</div>
                            </div>
                          </td>

                          <td className="p-4 font-semibold text-slate-600 dark:text-slate-300 capitalize">
                            {t.store.categories[prod.category] || prod.categoryName || prod.category}
                          </td>

                          <td className="p-4 font-black text-teal-600 dark:text-teal-400">
                            {Number(prod.price).toLocaleString()} {t.common.currency}
                          </td>

                          <td className="p-4">
                            <span className={`font-bold inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] ${
                              (prod.stock || 50) > 20
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                                : (prod.stock || 50) > 5
                                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              <span>{prod.stock || 50} dona</span>
                            </span>
                          </td>

                          <td className="p-4">
                            {prod.prescriptionRequired ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                                {t.admin.prescriptionYes}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                                {t.admin.prescriptionNo}
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/50 rounded-lg transition-colors cursor-pointer"
                              title={t.admin.productsCrud.editProduct}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(t.admin.productsCrud.confirmDelete)) {
                                  deleteProduct(prod.id);
                                  if (addToast) addToast("O'chirildi", "Mahsulot ro'yxatdan olib tashlandi", "info");
                                }
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                              title={t.admin.productsCrud.deleteProduct}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4.5: SHIFOKORLAR BOSHQARUVI */}
          {activeTab === 'doctors' && (
            <DoctorsSubpage />
          )}

          {/* TAB 5: QABULLAR RO'YXATI */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    value={appointmentSearch}
                    onChange={(e) => setAppointmentSearch(e.target.value)}
                    placeholder="Bemor ismi, telefon yoki shifokor bo'yicha qidirish..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAppointmentFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      appointmentFilter === 'all'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Barchasi ({appointments.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppointmentFilter('approved')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      appointmentFilter === 'approved'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Tasdiqlangan ({approvedAppointmentsCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppointmentFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      appointmentFilter === 'pending'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Kutilmoqda ({totalAppointmentsCount - approvedAppointmentsCount})
                  </button>
                </div>
              </div>

              {/* Appointments Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">{t.admin.appointmentsTable.patient}</th>
                        <th className="p-4">{t.admin.appointmentsTable.doctor}</th>
                        <th className="p-4">{t.admin.appointmentsTable.clinic}</th>
                        <th className="p-4">{t.admin.appointmentsTable.dateTime}</th>
                        <th className="p-4">{t.admin.appointmentsTable.status}</th>
                        <th className="p-4 text-right">{t.admin.appointmentsTable.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="font-black text-slate-900 dark:text-white">{apt.patientName}</div>
                            <div className="text-[11px] text-slate-500">
                              <a href={`tel:${apt.phone}`} className="hover:underline font-mono">{apt.phone}</a>
                            </div>
                            {apt.symptoms && (
                              <div className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">"{apt.symptoms}"</div>
                            )}
                          </td>

                          <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                            <div>{apt.doctorName}</div>
                            <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">{apt.specialty}</div>
                          </td>

                          <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                            {apt.clinicName}
                          </td>

                          <td className="p-4">
                            <div className="font-bold text-slate-900 dark:text-white">{apt.date}</div>
                            <div className="text-[11px] text-teal-600 dark:text-teal-400 font-bold font-mono">{apt.timeSlot}</div>
                          </td>

                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              apt.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : apt.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {apt.status === 'approved' ? t.admin.appointmentsTable.approved :
                               apt.status === 'rejected' ? t.admin.appointmentsTable.rejected :
                               t.admin.appointmentsTable.pending}
                            </span>
                          </td>

                          <td className="p-4 text-right space-x-1.5">
                            {apt.status !== 'approved' && (
                              <button
                                type="button"
                                onClick={() => {
                                  updateAppointmentStatus(apt.id, 'approved');
                                  if (addToast) addToast("Tasdiqlandi", "Bemor qabuli tasdiqlandi", "success");
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                {t.admin.appointmentsTable.approve}
                              </button>
                            )}
                            {apt.status !== 'rejected' && (
                              <button
                                type="button"
                                onClick={() => {
                                  updateAppointmentStatus(apt.id, 'rejected');
                                  if (addToast) addToast("Rad etildi", "Qabul bekor qilindi", "info");
                                }}
                                className="px-3 py-1.5 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                {t.admin.appointmentsTable.reject}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TELEGRAM BOT INTEGRATSIYASI */}
          {activeTab === 'telegram' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
              <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span>Telegram Bot Xabarnoma Tizimi</span>
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Yangi qabullar va dorixona buyurtmalari avtomatik tarzda Telegram guruhingizga yetkaziladi.
                  </p>
                </div>

                <form onSubmit={handleSaveTelegram} className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.admin.telegramTab.botToken}
                    </label>
                    <input
                      type="text"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="Masalan: 7123456789:AAFABC..."
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.admin.telegramTab.chatId}
                    </label>
                    <input
                      type="text"
                      value={chatIdInput}
                      onChange={(e) => setChatIdInput(e.target.value)}
                      placeholder="Masalan: 123456789 yoki -1001234567890"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      {t.admin.telegramTab.saveSettings}
                    </button>

                    <button
                      type="button"
                      onClick={handleTestTelegram}
                      disabled={isTestingTelegram}
                      className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isTestingTelegram ? "Xabar yuborilmoqda..." : "Xabarni sinash"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Bot Connection Guide */}
              <div className="md:col-span-5 bg-teal-50/60 dark:bg-teal-950/30 p-6 rounded-2xl border border-teal-200/60 dark:border-teal-900/40 space-y-4">
                <h4 className="font-bold text-sm text-teal-950 dark:text-teal-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>{t.admin.telegramTab.guideTitle}</span>
                </h4>
                <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                  <p className="p-2.5 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-teal-100 dark:border-teal-900/40">
                    1. Telegramda <b>@BotFather</b> ga o'ting va <code>/newbot</code> buyrug'ini yuboring.
                  </p>
                  <p className="p-2.5 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-teal-100 dark:border-teal-900/40">
                    2. Berilgan <b>HTTP API Token</b> nusxasini oling va yuqoridagi <i>Bot Token</i> maydoniga qo'ying.
                  </p>
                  <p className="p-2.5 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-teal-100 dark:border-teal-900/40">
                    3. Guruhingiz yoki profilingiz ID sini bilish uchun <b>@userinfobot</b> dan foydalaning va <i>Chat ID</i> maydoniga yozing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {productModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] !m-0 !p-4 w-screen h-screen flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setProductModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingProduct ? t.admin.productsCrud.formTitleEdit : t.admin.productsCrud.formTitleAdd}
              </h3>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.admin.productsCrud.name} *
                </label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  placeholder="Paracetamol 500mg"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.admin.productsCrud.price} ({t.common.currency}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    placeholder="15000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.admin.productsCrud.stock}
                  </label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.admin.productsCrud.category}
                  </label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => {
                      setProdForm({
                        ...prodForm,
                        category: e.target.value,
                        categoryName: t.store.categories[e.target.value] || e.target.value
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                  >
                    <option value="medicines">{t.store.categories.medicines}</option>
                    <option value="vitamins">{t.store.categories.vitamins}</option>
                    <option value="devices">{t.store.categories.devices}</option>
                    <option value="hygiene">{t.store.categories.hygiene}</option>
                    <option value="firstaid">{t.store.categories.firstaid}</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={prodForm.prescriptionRequired}
                      onChange={(e) => setProdForm({ ...prodForm, prescriptionRequired: e.target.checked })}
                      className="w-4 h-4 text-teal-600 rounded-sm focus:ring-teal-500"
                    />
                    <span>{t.admin.productsCrud.prescription}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.admin.productsCrud.image}
                </label>
                <input
                  type="text"
                  value={prodForm.image}
                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                  placeholder="/images/products/paracetamol.svg"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.admin.productsCrud.desc}
                </label>
                <textarea
                  rows="2"
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  {t.admin.productsCrud.save}
                </button>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {t.admin.productsCrud.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
