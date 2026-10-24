import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sendTelegramMessage } from '../utils/telegram';
import { createProductFallbackSvg } from '../utils/imageFallback';
import {
  Shield,
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Send,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  DollarSign,
  Package,
  Building,
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
  Copy,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import GoogleIcon from '../components/GoogleIcon';
import confetti from 'canvas-confetti';

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
    addToast
  } = useApp();

  const validTabs = ['dashboard', 'revenue', 'sales', 'products', 'appointments', 'telegram'];

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
  // Chart is mounted immediately so its height is stable from millisecond 0 (prevents layout shifting)
  const [chartMounted] = useState(true);

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

  // Synchronous scroll restoration BEFORE paint to prevent visual jumps and shifts
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

  // Save scroll position immediately before page reload (Ctrl+R)
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
  const [simulatedInboxOpen, setSimulatedInboxOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

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

    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setAuthStep('code');
    setCodeDigits(['', '', '', '', '', '']);
    setCodeError('');
    setResendTimer(60);
    setSimulatedInboxOpen(true);
    setCopiedCode(false);

    // 1. Send as real Telegram message / notification
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const telegramMsg = `🔐 <b>SHIFO.TOP — ADMIN TASDIQLASH KODI</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Hurmatli Administrator!\n` +
      `Admin panelga kirish uchun tasdiqlash kodingiz:\n\n` +
      `👉 <b>KIRISH KODI: <code>${code}</code></b> 👈\n\n` +
      `📧 <b>Gmail:</b> ${cleanEmail}\n` +
      `🕒 <b>Vaqt:</b> ${timeNow}\n\n` +
      `⚠️ <i>Xavfsizlik: Bu kodni begonalarga bermang!</i>`;

    try {
      await sendTelegramMessage(telegramMsg, telegramConfig.botToken, telegramConfig.chatId);
    } catch (err) {
      console.warn("Telegram yuborishda xatolik:", err);
    }

    // 2. Dispatch an instant high-visibility on-screen message
    if (addToast) {
      addToast(
        `📩 Yangi xabar: Kod [${code}]`,
        `Tasdiqlash kodi xabar tariqasida yuborildi: ${code}`,
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

  const handleAutoFillCode = () => {
    if (!generatedCode) return;
    const digits = generatedCode.split('');
    setCodeDigits(digits);
    setCodeError('');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
    if (addToast) addToast("Kod to'ldirildi!", "6 xonali tasdiqlash kodi avtomatik kiritildi.", "success");
  };

  const handleVerifyCodeSubmit = (e) => {
    if (e) e.preventDefault();
    const fullCode = codeDigits.join('');

    if (fullCode.length < 6) {
      setCodeError("Iltimos, 6 xonali tasdiqlash kodini to'liq kiriting.");
      return;
    }

    if (fullCode === generatedCode) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }

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
      setCodeError("Kiritilgan kod noto'g'ri! Iltimos, Gmail.com pochtangizga kelgan kodni to'g'ri kiriting.");
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
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-100/70 dark:bg-slate-950 animate-in fade-in">
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center justify-between px-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Bosh sahifaga qaytish</span>
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Xavfsiz Admin Zona</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-xs text-left">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border-2 border-blue-500/30 shadow-md">
                <GoogleIcon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {authStep === 'email' ? "Admin panelga kirish" : "Gmail.com ga kelgan kodni kiriting"}
              </h2>
              <p className="text-xs text-slate-500">
                {authStep === 'email'
                  ? "Admin paneliga kirish uchun rasmiy Gmail pochtangizni yozing:"
                  : `Tasdiqlash kodi ${adminEmail} manziliga yuborildi`}
              </p>
            </div>

            {/* STEP 1: GMAIL INPUT */}
            {authStep === 'email' && (
              <form onSubmit={handleSendGmailCode} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 space-y-1.5">
                  <div className="font-extrabold text-teal-900 dark:text-teal-300 text-xs flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-teal-600" />
                    <span>Kod xabar tariqasida yuboriladi:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Gmail pochtangizni kiriting va tugmani bosing. Tasdiqlash kodi darhol <b>Telegram botga</b> va ekranga <b>xabar tariqasida</b> yuboriladi.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Gmail pochta manzilingiz *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@gmail.com"
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-500/25 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kodni xabar tariqasida yuborish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: CODE VERIFICATION (Kelgan xabar) */}
            {authStep === 'code' && (
              <div className="space-y-4">
                {/* Incoming Message Notification Card */}
                {simulatedInboxOpen && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/60 dark:via-teal-950/60 dark:to-cyan-950/60 border-2 border-emerald-400/60 shadow-lg space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-black text-emerald-900 dark:text-emerald-200 text-xs">
                        <Send className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                        <span>YANGI XABAR KELDI (KOD)</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                        Telegram & SMS
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300">
                      Kimdan: <b>shifo.top Xavfsizlik xizmati</b> • Qabul qiluvchi: <b>{adminEmail}</b>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-300 dark:border-emerald-800 shadow-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Kirish Tasdiqlash Kodi:</span>
                        <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-emerald-600 dark:text-emerald-400">
                          {generatedCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoFillCode}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedCode ? "Kiritildi!" : "Kodni qo'yish"}</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-emerald-800 dark:text-emerald-300/80 italic">
                      * Ushbu kod bir vaqtning o'zida Telegram botingizga ham xabar tariqasida yuborildi.
                    </p>
                  </div>
                )}

                <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block font-bold text-slate-700 dark:text-slate-300">
                        6 xonali tasdiqlash kodini kiriting:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthStep('email');
                          setCodeError('');
                        }}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Pochtani o'zgartirish
                      </button>
                    </div>

                    {/* 6 Digit Input Boxes */}
                    <div
                      className="flex justify-between gap-1.5 sm:gap-2.5 py-1"
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
                          className={`w-11 h-13 sm:w-12 sm:h-14 rounded-2xl border-2 text-center text-xl sm:text-2xl font-black font-mono focus:outline-none transition-all ${
                            codeError
                              ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600'
                              : digit
                              ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500'
                          }`}
                        />
                      ))}
                    </div>

                    {codeError && (
                      <div className="mt-2 text-rose-500 font-bold text-xs flex items-center gap-1.5 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{codeError}</span>
                      </div>
                    )}
                  </div>

                  {/* Resend Code Row */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Kod kelmadimi?</span>
                    {resendTimer > 0 ? (
                      <span className="font-semibold text-slate-400">
                        Qayta yuborish: <b className="font-mono text-blue-600">{resendTimer}s</b>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendGmailCode}
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Kodni qayta yuborish
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Tasdiqlash va Admin panelga kirish</span>
                    <ArrowRight className="w-4 h-4" />
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
      alert("Iltimos, nom va narxni kiriting!");
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
    } else {
      addProduct(payload);
    }

    setProductModalOpen(false);
  };

  const handleSaveTelegram = (e) => {
    e.preventDefault();
    saveTelegramConfig(tokenInput, chatIdInput);
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

  const filteredAdminProducts = products.filter(p =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(prodSearch.toLowerCase())
  );

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

  const totalSalesRevenue = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  const deliveringOrdersCount = orders.filter(o => o.status === 'delivering').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;
  const processingOrdersCount = orders.filter(o => o.status === 'processing').length;

  // Sidebar Menu Items Definition with dynamic i18n
  const menuItems = [
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
      icon: BarChart3,
      badge: orders.length > 0 ? `${orders.length}` : null
    },
    {
      id: 'products',
      label: t.admin.sidebar.inventory,
      icon: PieChart,
      badge: `${products.length}`
    },
    {
      id: 'appointments',
      label: t.admin.sidebar.appointments,
      icon: Calendar,
      badge: `${appointments.length}`
    },
    {
      id: 'telegram',
      label: t.admin.sidebar.telegram,
      icon: Send,
      badge: telegramConfig.isConnected ? t.admin.sidebar.statusConnected : t.admin.sidebar.statusDemo
    }
  ];

  const chartDays = t.admin.chart.days || ["Dush", "Sesh", "Chor", "Pay", "Juma", "Shan", "Yak"];
  const chartData = [
    { day: chartDays[0], val: 45, apt: 14 },
    { day: chartDays[1], val: 70, apt: 22 },
    { day: chartDays[2], val: 85, apt: 28 },
    { day: chartDays[3], val: 60, apt: 19 },
    { day: chartDays[4], val: 95, apt: 34 },
    { day: chartDays[5], val: 75, apt: 24 },
    { day: chartDays[6], val: 50, apt: 16 }
  ];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-100/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased">
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* DEDICATED FULL-HEIGHT SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 xl:w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/90 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-lg tracking-tight text-slate-900 dark:text-white">
                  shifo<span className="text-teal-600 dark:text-teal-400">.top</span>
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-900/40">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 block tracking-wide">
                Admin Dashboard v2.4
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Profile Snippet */}
        <div className="px-3.5 py-3 mx-3 my-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs relative">
            <GoogleIcon className="w-4 h-4" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 absolute -bottom-0.5 -right-0.5"></span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
              {user.name && user.name !== 'Bosh Administrator' ? user.name : t.nav.adminUser}
            </div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono truncate flex items-center gap-1">
              <span>{user.email || 'admin@gmail.com'}</span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t.admin.sidebarHeading || "Asosiy Boshqaruv"}
          </div>

          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/20 translate-x-0.5'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <IconComponent
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {isActive ? (
                  <span className="w-2 h-2 rounded-full bg-white shadow-xs shrink-0 ml-2 animate-pulse"></span>
                ) : item.badge ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 ml-2">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          {/* Telegram Status mini-pill */}
          <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-blue-500" />
              <span>Telegram Bot:</span>
            </span>
            <span className={`font-extrabold flex items-center gap-1 ${telegramConfig.isConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${telegramConfig.isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`}></span>
              <span>{telegramConfig.isConnected ? (t.admin.sidebar?.statusConnected || 'Faol') : (t.admin.sidebar?.statusDemo || 'Demo')}</span>
            </span>
          </div>

          {/* Jump to public website */}
          <Link
            to="/"
            className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-900/60 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Asosiy saytga qaytish</span>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleAdminLogout}
            className="w-full py-2 px-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Hisobdan chiqish</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT (TOPBAR + SCROLLABLE DASHBOARD CONTENT) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* ADMIN TOPBAR */}
        <header className="h-16 px-4 sm:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Menyuni ochish"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Section Title */}
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Admin</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="font-extrabold text-slate-900 dark:text-white capitalize">
                  {menuItems.find(m => m.id === activeTab)?.label || activeTab}
                </span>
              </div>
            </div>
          </div>

          {/* Topbar Right Actions: Language, Theme, Public Site Link */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
              {['uz', 'ru', 'en'].map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => changeLanguage(l)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-black uppercase transition-all ${
                    lang === l
                      ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Dark / Light Mode Switch */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title={darkMode ? "Yorug' rejim" : "Tungi rejim"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Public Site Link */}
            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
              title="Asosiy veb-saytni ko'rish"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Saytni ko'rish</span>
            </Link>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main ref={mainScrollRef} onScroll={handleMainScroll} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: ASOSIY BOSHQARUV (DASHBOARD) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 4 Stat Cards with Hover Lift */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">
                      {t.admin.stats.totalAppointments}
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                      {totalAppointmentsCount}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      {approvedAppointmentsCount} {t.admin.stats.approvedSuffix}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">
                      {t.admin.stats.totalRevenue}
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 block tracking-tight">
                      {grossRevenue.toLocaleString()} {t.common.currency}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +18.4% {t.admin.stats.growth}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">
                      {t.admin.stats.totalProducts}
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                      {totalProductsCount}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {t.admin.stats.inStockAll}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">
                      {t.admin.stats.activeClinics}
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                      8 {t.admin.stats.clinicsUnit}
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                      {t.admin.stats.emergency247}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Building className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Weekly Activity Trends Chart Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {t.admin.chart.title}
                      </h3>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-900/40">
                        7 kunlik dinamika
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t.admin.chart.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/50 dark:border-teal-900/40 px-3 py-1 rounded-xl flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                      <span>{t.admin.chart.realtime}</span>
                    </span>
                  </div>
                </div>

                {/* Chart Visualization Area */}
                <div className="pt-2">
                  <div className="relative w-full">
                    {/* Background Guideline Marks */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-9 pt-8 px-1">
                      <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600">35+ {t.admin.chart.bookingUnit}</span>
                      </div>
                      <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600">25 {t.admin.chart.bookingUnit}</span>
                      </div>
                      <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600">15 {t.admin.chart.bookingUnit}</span>
                      </div>
                      <div className="border-b border-slate-200/70 dark:border-slate-800 w-full flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600">0</span>
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
                              <div className="absolute -top-11 z-30 px-2.5 py-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-extrabold rounded-lg shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95">
                                <span>{item.day}: {item.apt} {t.admin.chart.bookingUnit} ({item.val}%)</span>
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

                            {/* Bar Track Container with explicit height so percentage resolves reliably */}
                            <div className="w-full max-w-[46px] h-44 sm:h-48 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl p-1 flex flex-col justify-end relative overflow-hidden transition-all duration-300 group-hover:ring-2 group-hover:ring-teal-500/40 dark:group-hover:ring-teal-400/40">
                              {/* Animated Colored Bar with rising transition */}
                              <div
                                className={`w-full rounded-xl transition-all duration-1000 ease-out relative shadow-sm ${
                                  isPeak
                                    ? 'bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 group-hover:brightness-110 shadow-emerald-500/20'
                                    : 'bg-gradient-to-t from-teal-600 via-emerald-600 to-cyan-400 group-hover:brightness-110 shadow-teal-500/20'
                                }`}
                                style={{ height: chartMounted ? `${Math.max(item.val, 12)}%` : '0%' }}
                              >
                                {/* Gloss effect top highlight line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 rounded-t-xl" />
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

                  {/* Chart Footnote / Summary Legend */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3 px-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-teal-600 to-emerald-600"></span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">O'rtacha kunlik dinamika</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-emerald-500 to-teal-400"></span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Eng yuqori yuklama (Pik)</span>
                      </div>
                    </div>
                    <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span>Jami:</span>
                      <b className="text-teal-600 dark:text-teal-400 font-extrabold">
                        {chartData.reduce((acc, c) => acc + c.apt, 0)} {t.admin.chart.bookingUnit}
                      </b>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span>Kunlik:</span>
                      <b className="text-slate-800 dark:text-slate-200 font-bold">
                        ~{Math.round(chartData.reduce((acc, c) => acc + c.apt, 0) / chartData.length)} {t.admin.chart.bookingUnit}/kun
                      </b>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Bookings preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Recent Appointments */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span>{t.admin.recentApts}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('appointments')}
                      className="text-teal-600 dark:text-teal-400 hover:underline font-bold cursor-pointer"
                    >
                      {t.admin.allCount} ({appointments.length})
                    </button>
                  </div>

                  <div className="space-y-2">
                    {appointments.slice(0, 3).map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-2 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{apt.patientName}</div>
                          <div className="text-[11px] text-slate-500">{apt.doctorName} • {apt.timeSlot}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          apt.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {apt.status === 'approved' ? t.admin.appointmentsTable.approved : t.admin.appointmentsTable.pending}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Overview */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-indigo-600" />
                      <span>{t.admin.pharmacyStock}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="text-teal-600 dark:text-teal-400 hover:underline font-bold cursor-pointer"
                    >
                      {t.admin.sidebar?.inventory || "Mahsulotlar"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {products.slice(0, 3).map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-2 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = createProductFallbackSvg(prod.name, prod.category);
                            }}
                            className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-slate-700"
                          />
                          <div className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                            {prod.name}
                          </div>
                        </div>
                        <span className="font-extrabold text-teal-600 dark:text-teal-400">
                          {Number(prod.price).toLocaleString()} {t.common.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DAROMAD DIAGNOSTIKASI */}
          {activeTab === 'revenue' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    <span>{t.admin.revenueAnalytics.title}</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    {t.admin.revenueAnalytics.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">{t.admin.stats.totalRevenue}:</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {grossRevenue.toLocaleString()} {t.common.currency}
                  </span>
                </div>
              </div>

              {/* Financial KPI Cards with Hover Lift */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="text-slate-500 font-semibold block">{t.admin.revenueAnalytics.avgCheckup}</span>
                  <span className="text-lg font-bold text-teal-900 dark:text-teal-200 mt-1 block">
                    {(155000).toLocaleString()} {t.common.currency}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="text-slate-500 font-semibold block">{t.admin.revenueAnalytics.monthlyForecast}</span>
                  <span className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mt-1 block">
                    {(38500000).toLocaleString()} {t.common.currency}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="text-slate-500 font-semibold block">{t.admin.revenueAnalytics.growthRate}</span>
                  <span className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mt-1 block">
                    +18.4% {t.admin.revenueAnalytics.vsLastMonth}
                  </span>
                </div>
              </div>

              {/* Revenue share per category with Animated Progress Bars */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t.admin.revenueAnalytics.breakdownTitle}
                </h4>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-semibold mb-1.5">
                      <span>{t.admin.revenueAnalytics.doctorShare}</span>
                      <span className="font-bold text-teal-700 dark:text-teal-300">
                        68% ({(8600000).toLocaleString()} {t.common.currency})
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: chartMounted ? '68%' : '0%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1.5">
                      <span>{t.admin.revenueAnalytics.pharmacyShare}</span>
                      <span className="font-bold text-indigo-700 dark:text-indigo-300">
                        32% ({(4050000).toLocaleString()} {t.common.currency})
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: chartMounted ? '32%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOTUVLAR VA BUYURTMALAR */}
          {activeTab === 'sales' && (
            <div className="space-y-6 text-xs">
              {/* Sales KPI Cards with Hover Lift */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">Jami Dorixona Savdosi</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                      {totalSalesRevenue.toLocaleString()} {t.common.currency}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {orders.length} ta faol buyurtma
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">Kuryerda / Yetkazilmoqda</span>
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
                      {deliveringOrdersCount} ta buyurtma
                    </span>
                    <span className="text-[10px] text-slate-400">
                      O'rtacha yetkazish: 30 daqiqa
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Truck className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">Muvaffaqiyatli Yetkazildi</span>
                    <span className="text-xl font-black text-teal-600 dark:text-teal-400 mt-1 block">
                      {deliveredOrdersCount} ta buyurtma
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                      100% mijoz qoniqishi
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center transition-transform group-hover:scale-110">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Toolbar & Filter Bar */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Search Input */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Mijoz ismi, telefon, ID yoki manzil bo'yicha qidiruv..."
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Actions right */}
                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      type="button"
                      onClick={resetOrders}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors"
                      title="Namuna buyurtmalarni qayta tiklash"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Namunaviy buyurtmalarni yuklash</span>
                    </button>
                  </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setOrderFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      orderFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Barchasi ({orders.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderFilter('delivering')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                      orderFilter === 'delivering'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Truck className="w-3 h-3" />
                    <span>Yetkazilmoqda ({deliveringOrdersCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderFilter('processing')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
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
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
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
                <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 mx-auto flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 opacity-70" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {t.admin.salesOrders.empty}
                    </h4>
                    <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                      Hozircha tizimda onlayn dorixona buyurtmalari mavjud emas. Sinov uchun namunaviy buyurtmalarni yuklashingiz mumkin.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetOrders}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-blue-500/20"
                  >
                    ⚡ Namuna buyurtmalarni yuklash
                  </button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
                  <Search className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
                  <p className="font-bold text-slate-700 dark:text-slate-300">
                    Qidiruv va filtr bo'yicha hech qanday buyurtma topilmadi.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setOrderSearch(''); setOrderFilter('all'); }}
                    className="text-xs text-blue-600 hover:underline font-bold"
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
                        className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                              #{ord.id}
                            </span>
                            <span className="text-slate-400 text-xs">
                              {ord.createdAt || 'Yangi'}
                            </span>
                          </div>

                          {/* Status Pill */}
                          <div className="flex items-center gap-2">
                            {isDelivering && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold text-[11px]">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                                <Truck className="w-3.5 h-3.5" />
                                <span>Yetkazilmoqda ({ord.deliveryMinutes || '30 daqiqa'})</span>
                              </span>
                            )}
                            {isDelivered && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
                                <Check className="w-3.5 h-3.5" />
                                <span>Yetkazildi (Muvaffaqiyatli)</span>
                              </span>
                            )}
                            {isProcessing && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-extrabold text-[11px]">
                                <span>⏱ Tayyorlanmoqda</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Order Details Body */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          {/* Left: Customer Info */}
                          <div className="md:col-span-5 space-y-2">
                            <div className="font-black text-slate-900 dark:text-white text-sm">
                              {ord.customerName}
                            </div>
                            <div className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-mono">{ord.phone}</span>
                            </div>
                            <div className="text-slate-600 dark:text-slate-400 flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>{ord.address}</span>
                            </div>
                            <div className="pt-1 flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                To'lov: {ord.paymentMethod}
                              </span>
                              {ord.promoCode && (
                                <span className="px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200/60 dark:border-teal-900/40 text-[10px] font-black">
                                  Promokod: {ord.promoCode}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Middle: Purchased Products Preview */}
                          <div className="md:col-span-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Buyurtma qilingan mahsulotlar ({ord.items?.length || 0} xil):
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
                                <span className="text-slate-400 text-xs">Mahsulotlar tafsiloti mavjud</span>
                              )}
                            </div>
                          </div>

                          {/* Right: Total Price & Actions */}
                          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end gap-3 h-full">
                            <div className="text-left md:text-right">
                              <span className="text-[10px] text-slate-400 block font-semibold">Umumiy to'lov:</span>
                              <span className="text-base font-black text-blue-600 dark:text-blue-400">
                                {Number(ord.total).toLocaleString()} {t.common.currency}
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto justify-start md:justify-end">
                              {!isDelivered && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, 'delivered')}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] transition-colors flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Yetkazildi</span>
                                </button>
                              )}

                              {!isDelivering && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, 'delivering')}
                                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-[11px] transition-colors flex items-center gap-1"
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
                                  }
                                }}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
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
                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={prodSearch}
                      onChange={(e) => setProdSearch(e.target.value)}
                      placeholder={t.admin.productsCrud.searchPlaceholder}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 whitespace-nowrap">
                    <span>Jami:</span>
                    <span className="text-teal-600 dark:text-teal-400 font-extrabold">
                      {filteredAdminProducts.length} ta
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-teal-500/20 transition-all hover:scale-102 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.admin.productsCrud.addProduct}</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
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

                          <td className="p-4 font-bold text-teal-600 dark:text-teal-400">
                            {Number(prod.price).toLocaleString()} {t.common.currency}
                          </td>

                          <td className="p-4">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{prod.stock || 50} {t.admin.unitDona}</span>
                          </td>

                          <td className="p-4">
                            {prod.prescriptionRequired ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                {t.admin.prescriptionYes}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
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

          {/* TAB 5: QABULLAR RO'YXATI */}
          {activeTab === 'appointments' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t.admin.appointmentsTable.title}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-extrabold text-xs">
                    {appointments.length}
                  </span>
                </h3>
                <span className="text-slate-400">{t.admin.appointmentsTable.subtitle}</span>
              </div>

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
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white">{apt.patientName}</div>
                          <div className="text-[11px] text-slate-500">{apt.phone}</div>
                          {apt.symptoms && (
                            <div className="text-[10px] text-slate-400 italic line-clamp-1">"{apt.symptoms}"</div>
                          )}
                        </td>

                        <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                          <div>{apt.doctorName}</div>
                          <div className="text-[10px] text-blue-600 dark:text-blue-400">{apt.specialty}</div>
                        </td>

                        <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                          {apt.clinicName}
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white">{apt.date}</div>
                          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{apt.timeSlot}</div>
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
                              onClick={() => updateAppointmentStatus(apt.id, 'approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                            >
                              {t.admin.appointmentsTable.approve}
                            </button>
                          )}
                          {apt.status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => updateAppointmentStatus(apt.id, 'rejected')}
                              className="px-2.5 py-1 border border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-bold text-[11px] transition-colors"
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
          )}

          {/* TAB 6: TELEGRAM BOT SOZLAMALARI */}
          {activeTab === 'telegram' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
              <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span>{t.admin.telegramTab.title}</span>
                  </h3>
                  <p className="text-slate-500 mt-1">
                    {t.admin.telegramTab.desc}
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
                      className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      {t.admin.telegramTab.saveSettings}
                    </button>

                    <button
                      type="button"
                      onClick={handleTestTelegram}
                      disabled={isTestingTelegram}
                      className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isTestingTelegram ? t.admin.telegramTab.sending : t.admin.telegramTab.testBtn}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Bot Connection Guide */}
              <div className="md:col-span-5 bg-blue-50/60 dark:bg-blue-950/30 p-6 rounded-3xl border border-blue-200/60 dark:border-blue-900/40 space-y-4">
                <h4 className="font-bold text-sm text-blue-950 dark:text-blue-200">
                  {t.admin.telegramTab.guideTitle}
                </h4>
                <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p>{t.admin.telegramTab.guideStep1}</p>
                  <p>{t.admin.telegramTab.guideStep2}</p>
                  <p>{t.admin.telegramTab.guideStep3}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingProduct ? t.admin.productsCrud.formTitleEdit : t.admin.productsCrud.formTitleAdd}
              </h3>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="text-white/80 hover:text-white"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
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
                      className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
                >
                  {t.admin.productsCrud.save}
                </button>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-100"
                >
                  {t.admin.productsCrud.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
