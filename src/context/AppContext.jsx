import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './i18n';
import { initialProducts } from '../data/productsData';
import { initialOrders } from '../data/ordersData';
import {
  sendTelegramMessage,
  formatAppointmentMessage,
  formatOrderMessage,
  DEFAULT_TELEGRAM_TOKEN,
  DEFAULT_TELEGRAM_CHAT_ID
} from '../utils/telegram';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. Language state
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('shifo_lang') || 'uz';
  });

  const t = translations[lang] || translations.uz;

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('shifo_lang', newLang);
  };

  // 2. Dark/Light Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('shifo_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('shifo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('shifo_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  // 3. Toasts state
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message = '', type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 4. Products state (with CRUD persistence and local asset migration)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('shifo_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasUnsplash = parsed.some(p => p.image && p.image.includes('unsplash.com'));
        if (hasUnsplash) {
          localStorage.setItem('shifo_products', JSON.stringify(initialProducts));
          return initialProducts;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('shifo_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (newProd) => {
    const prod = {
      ...newProd,
      id: 'prod-' + Date.now(),
      rating: 5.0,
      reviewsCount: 1
    };
    setProducts(prev => [prod, ...prev]);
    addToast(t.common.success, `${prod.name} muvaffaqiyatli qo'shildi!`, 'success');
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    addToast(t.common.success, `Mahsulot ma'lumotlari yangilandi!`, 'info');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast(t.common.success, `Mahsulot o'chirildi!`, 'warning');
  };

  // 5. Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('shifo_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('shifo_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    addToast("Savatga qo'shildi", `${product.name} savatga kiritildi.`, 'success');
  };

  const updateCartQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    addToast("O'chirildi", "Mahsulot savatdan olib tashlandi", 'info');
  };

  const clearCart = () => setCart([]);

  // 6. Favorites state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('shifo_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ["prod-1", "doc-1"];
  });

  useEffect(() => {
    localStorage.setItem('shifo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (itemId) => {
    setFavorites(prev => {
      const isFav = prev.includes(itemId);
      if (isFav) {
        addToast("Sevimlilardan olib tashlandi", "", "info");
        return prev.filter(id => id !== itemId);
      } else {
        addToast("Sevimlilarga qo'shildi!", "", "success");
        return [...prev, itemId];
      }
    });
  };

  const isFavorite = (itemId) => favorites.includes(itemId);

  // 7. Promo Code state
  const [appliedPromo, setAppliedPromo] = useState(null);

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SHIFO2026') {
      setAppliedPromo({ code: 'SHIFO2026', discountPercent: 20, desc: "20% maxsus chegirma" });
      addToast("Promokod faollashtirildi!", "SHIFO2026 orqali 20% chegirma berildi!", "success");
      return true;
    } else if (clean === 'SALOM') {
      setAppliedPromo({ code: 'SALOM', discountPercent: 10, desc: "10% xush kelibsiz chegirmasi" });
      addToast("Promokod faollashtirildi!", "10% chegirma qo'llandi!", "success");
      return true;
    } else if (clean === 'BEPUL') {
      setAppliedPromo({ code: 'BEPUL', freeDelivery: true, desc: "Bepul yetkazib berish" });
      addToast("Promokod faollashtirildi!", "Yetkazib berish bepul qilindi!", "success");
      return true;
    } else {
      addToast("Xato promokod", "Bunday promokod mavjud emas yoki muddati o'tgan.", "error");
      return false;
    }
  };

  // 8. Telegram Bot Settings
  const [telegramConfig, setTelegramConfig] = useState(() => {
    const saved = localStorage.getItem('shifo_telegram');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.botToken && parsed.chatId) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return {
      botToken: DEFAULT_TELEGRAM_TOKEN,
      chatId: DEFAULT_TELEGRAM_CHAT_ID,
      isConnected: true
    };
  });

  const saveTelegramConfig = (token, chatId) => {
    const newConfig = {
      botToken: token || DEFAULT_TELEGRAM_TOKEN,
      chatId: chatId || DEFAULT_TELEGRAM_CHAT_ID,
      isConnected: Boolean((token || DEFAULT_TELEGRAM_TOKEN) && (chatId || DEFAULT_TELEGRAM_CHAT_ID))
    };
    setTelegramConfig(newConfig);
    localStorage.setItem('shifo_telegram', JSON.stringify(newConfig));
    addToast("Telegram sozlamalari saqlandi", "Bildirishnomalar avtomatik yuboriladi.", "success");
  };

  // 9. Appointments state
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('shifo_appointments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "apt-101",
        patientName: "Javohir Toshmatov",
        phone: "+998 90 123 45 67",
        doctorId: "doc-1",
        doctorName: "Dr. Alisher Karimov",
        specialty: "Kardiolog",
        clinicName: "Respublika Kardiologiya Markazi",
        date: "2026-10-22",
        timeSlot: "10:30",
        price: 150000,
        symptoms: "Yurak sohasida davriy sanchiq va arterial bosim oshishi",
        status: "approved",
        createdAt: "2026-10-20 18:20"
      },
      {
        id: "apt-102",
        patientName: "Madina Karimova",
        phone: "+998 93 987 65 43",
        doctorId: "doc-2",
        doctorName: "Dr. Nilufar Qosimova",
        specialty: "Nevropatolog",
        clinicName: "Akfa Medline",
        date: "2026-10-23",
        timeSlot: "14:00",
        price: 180000,
        symptoms: "Boshning o'ng tomonida kuchli migren va uyqusizlik",
        status: "pending",
        createdAt: "2026-10-20 20:15"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('shifo_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const bookAppointment = async (bookingData) => {
    const newApt = {
      ...bookingData,
      id: "apt-" + Date.now(),
      status: "pending",
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAppointments(prev => [newApt, ...prev]);

    // Format and send via Telegram Bot
    const msg = formatAppointmentMessage(newApt);
    await sendTelegramMessage(msg, telegramConfig.botToken, telegramConfig.chatId);

    addToast(t.appointment.successTitle, t.appointment.telegramSent, "success");
    return newApt;
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    let updatedApt = null;
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        updatedApt = { ...a, status: newStatus };
        return updatedApt;
      }
      return a;
    }));

    if (newStatus === 'approved' && updatedApt) {
      const msg = formatAppointmentMessage(updatedApt);
      await sendTelegramMessage(msg, telegramConfig.botToken, telegramConfig.chatId);
    }

    addToast("Holat yangilandi", `Qabul holati: ${newStatus}`, "info");
  };

  // 10. Orders state
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('shifo_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return initialOrders;
  });

  useEffect(() => {
    localStorage.setItem('shifo_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = async (orderInfo) => {
    const newOrder = {
      ...orderInfo,
      id: Date.now().toString().slice(-6),
      items: [...cart],
      status: "delivering",
      deliveryMinutes: "30 - 45",
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setOrders(prev => [newOrder, ...prev]);

    // Send Telegram Notification with full details and delivery arrival time
    const msg = formatOrderMessage(newOrder);
    await sendTelegramMessage(msg, telegramConfig.botToken, telegramConfig.chatId);

    clearCart();
    setAppliedPromo(null);
    addToast("Buyurtma tasdiqlandi!", "Telegram botga buyurtma va yetkazish vaqti yuborildi.", "success");
    return newOrder;
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    addToast("Buyurtma holati yangilandi", `Buyurtma #${id}: ${newStatus}`, "info");
  };

  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    addToast("Buyurtma o'chirildi", `Buyurtma #${id} ro'yxatdan olib tashlandi`, "warning");
  };

  const resetOrders = () => {
    setOrders(initialOrders);
    addToast("Namuna buyurtmalar yuklandi", "Sinov buyurtmalari ro'yxati qayta tiklandi.", "success");
  };

  // 11. User Auth state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shifo_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'admin' && !parsed.email) {
          parsed.email = 'admin@gmail.com';
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return {
      isLoggedIn: true,
      username: "admin@gmail.com",
      email: "admin@gmail.com",
      phone: "+998 71 200 00 03",
      role: "admin",
      name: "Bosh Administrator"
    };
  });

  useEffect(() => {
    localStorage.setItem('shifo_user', JSON.stringify(user));
  }, [user]);

  const loginUser = (userData) => {
    const isRoleAdmin =
      userData.role === 'admin' ||
      userData.username?.toLowerCase().includes('admin') ||
      userData.email?.toLowerCase().includes('admin');

    const updatedUser = {
      isLoggedIn: true,
      email: userData.email || (isRoleAdmin ? 'admin@gmail.com' : undefined),
      ...userData,
      role: isRoleAdmin ? 'admin' : (userData.role || 'patient')
    };

    setUser(updatedUser);
    localStorage.setItem('shifo_user', JSON.stringify(updatedUser));
    addToast("Xush kelibsiz!", `${userData.name || userData.email || userData.username} tizimga kirdi`, "success");
  };

  const logoutUser = () => {
    setUser({
      isLoggedIn: false,
      username: "",
      phone: "",
      role: "guest",
      name: ""
    });
    addToast("Chiqildi", "Hisobdan muvaffaqiyatli chiqdingiz", "info");
  };

  // 12. Global Booking Modal target
  const [bookingModalDoctor, setBookingModalDoctor] = useState(null);

  const openBookingModal = (doctor) => {
    setBookingModalDoctor(doctor);
  };

  const closeBookingModal = () => {
    setBookingModalDoctor(null);
  };

  // 13. Real-time 10-Second Auto-Refresh Engine
  const [refreshCountdown, setRefreshCountdown] = useState(10);
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const [liveMetrics, setLiveMetrics] = useState({
    trafficScore: 1,
    trafficText: "Tirbandliksiz, yashil yo'lak",
    activeAmbulances: 19,
    todayConsultations: 148,
    curedPatientsToday: 132,
    activeClinicsOnline: 8,
    clinicQueues: {
      'clinic-1': { queue: 2, waitMinutes: 6 },
      'clinic-2': { queue: 4, waitMinutes: 14 },
      'clinic-3': { queue: 1, waitMinutes: 4 },
      'clinic-4': { queue: 3, waitMinutes: 9 },
      'clinic-5': { queue: 2, waitMinutes: 7 },
      'clinic-6': { queue: 1, waitMinutes: 3 },
      'clinic-7': { queue: 5, waitMinutes: 18 },
      'clinic-8': { queue: 2, waitMinutes: 5 }
    },
    lastEvent: "Kardiologiya bo'yicha yangi qabul band qilindi"
  });

  const liveEventsPool = [
    "Akfa Medline: Navbatdagi bemor shifokor ko'rigiga kirdi",
    "Tez yordam (103): Chaqiruv bo'yicha navbatchi brigada manzilga yetib bordi",
    "Dorixona: Dori vositasi uchun yangi buyurtma tezkor kuryerga topshirildi",
    "Shox Med Center: Laboratoriya tahlili natijalari tayyor bo'ldi",
    "Kardiologiya Markazi: Shoshilinch qabul muvaffaqiyatli amalga oshirildi",
    "Stomatologiya: Yangi ko'rik vaqti muvaffaqiyatli tasdiqlandi"
  ];

  const executeDataRefresh = () => {
    setIsRefreshing(true);
    setLastUpdated(new Date().toLocaleTimeString());

    // 1. Sync from localStorage in case external changes occurred
    try {
      const storedApts = localStorage.getItem('shifo_appointments');
      if (storedApts) setAppointments(JSON.parse(storedApts));

      const storedProds = localStorage.getItem('shifo_products');
      if (storedProds) setProducts(JSON.parse(storedProds));

      const storedOrders = localStorage.getItem('shifo_orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch (e) {
      console.error("Auto-refresh sync error:", e);
    }

    // 2. Realistic dynamic metrics update
    setLiveMetrics(prev => {
      const randomEvent = liveEventsPool[Math.floor(Math.random() * liveEventsPool.length)];
      const updatedQueues = { ...prev.clinicQueues };
      Object.keys(updatedQueues).forEach(cId => {
        const delta = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const newQ = Math.max(1, Math.min(6, (updatedQueues[cId]?.queue || 2) + delta));
        updatedQueues[cId] = {
          queue: newQ,
          waitMinutes: Math.max(3, newQ * 3 + Math.floor(Math.random() * 2))
        };
      });

      const trafficScores = [1, 1, 2, 2, 2, 1];
      const newScore = trafficScores[Math.floor(Math.random() * trafficScores.length)];
      const trafficTexts = {
        1: "Yo'l butunlay ochiq (1 ball)",
        2: "Tirbandliksiz, yashil yo'lak (2 ball)",
        3: "O'rtacha shahar harakati (3 ball)"
      };

      return {
        ...prev,
        trafficScore: newScore,
        trafficText: trafficTexts[newScore] || "Tirbandliksiz, yashil yo'lak",
        activeAmbulances: 18 + Math.floor(Math.random() * 5),
        todayConsultations: prev.todayConsultations + (Math.random() > 0.6 ? 1 : 0),
        curedPatientsToday: prev.curedPatientsToday + (Math.random() > 0.7 ? 1 : 0),
        clinicQueues: updatedQueues,
        lastEvent: randomEvent
      };
    });

    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // 1-second countdown ticker for 10-second auto refresh
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const timer = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          executeDataRefresh();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefreshEnabled]);

  // Cross-tab storage synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'shifo_appointments' && e.newValue) {
        try { setAppointments(JSON.parse(e.newValue)); } catch (err) {}
      }
      if (e.key === 'shifo_products' && e.newValue) {
        try { setProducts(JSON.parse(e.newValue)); } catch (err) {}
      }
      if (e.key === 'shifo_orders' && e.newValue) {
        try { setOrders(JSON.parse(e.newValue)); } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const manualRefresh = () => {
    setRefreshCountdown(10);
    executeDataRefresh();
    addToast(t.common.liveSync || "Jonli yangilanish", "Ma'lumotlar muvaffaqiyatli yangilandi!", "info");
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        t,
        changeLanguage,
        darkMode,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        favorites,
        toggleFavorite,
        isFavorite,
        appliedPromo,
        applyPromoCode,
        telegramConfig,
        saveTelegramConfig,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        resetOrders,
        user,
        loginUser,
        logoutUser,
        bookingModalDoctor,
        openBookingModal,
        closeBookingModal,
        refreshCountdown,
        lastUpdated,
        isRefreshing,
        autoRefreshEnabled,
        setAutoRefreshEnabled,
        liveMetrics,
        manualRefresh
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
