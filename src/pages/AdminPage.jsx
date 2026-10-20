import React, { useState } from 'react';
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
  XCircle,
  DollarSign,
  Package,
  Building,
  Check,
  X,
  Clock,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  User,
  Activity,
  Layers
} from 'lucide-react';

export default function AdminPage() {
  const {
    t,
    user,
    loginUser,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    appointments,
    updateAppointmentStatus,
    orders,
    telegramConfig,
    saveTelegramConfig,
    addToast
  } = useApp();

  // Active tab state: 'dashboard', 'revenue', 'sales', 'products', 'appointments', 'telegram'
  const [activeTab, setActiveTab] = useState('dashboard');

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

  // Product search in admin
  const [prodSearch, setProdSearch] = useState('');

  // Telegram settings state
  const [tokenInput, setTokenInput] = useState(telegramConfig.botToken || '');
  const [chatIdInput, setChatIdInput] = useState(telegramConfig.chatId || '');
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);

  // If user is not admin, provide a simple 1-click test button to view Admin Panel
  if (user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t.admin.authRequired.title}
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {t.admin.authRequired.desc}
        </p>
        <button
          type="button"
          onClick={() => {
            loginUser({
              username: 'admin',
              name: t.nav.adminUser,
              role: 'admin',
              phone: '+998 71 200 00 03'
            });
          }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all"
        >
          {t.admin.authRequired.loginBtn}
        </button>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header bar with branding & telegram status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>{t.admin.adminZone}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {t.admin.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.admin.subtitle}
          </p>
        </div>

        {/* Telegram status badge */}
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full border ${
            telegramConfig.isConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-amber-500/10 text-amber-500 border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-700/60'
          }`}>
            <span className={`w-2 h-2 rounded-full ${telegramConfig.isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`}></span>
            <span>{telegramConfig.isConnected ? t.admin.telegramConnected : t.admin.telegramDemo}</span>
          </span>
        </div>
      </div>

      {/* Main 2-Column Dashboard Layout (Sidebar + Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: SIDEBAR CARD */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/90 rounded-3xl p-5 shadow-sm space-y-5">
            {/* Header category label */}
            <div className="px-2">
              <span className="text-[11px] font-black tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                {t.admin.sidebarHeading}
              </span>
            </div>

            {/* Navigation Menu List */}
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full group flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-[1.01]'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <IconComponent
                        className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {/* Right side indicator: White glowing dot when active, or badge */}
                    {isActive ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-white shadow-md shadow-white/80 shrink-0 ml-2 animate-pulse"></span>
                    ) : item.badge ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 ml-2">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>

            {/* Quick Admin User Footer Card inside sidebar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 px-2 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                A
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {user.name && user.name !== 'Bosh Administrator' ? user.name : t.nav.adminUser}
                </div>
                <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{t.admin.sidebar.superuser}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: MAIN CONTENT PANELS */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* TAB 1: ASOSIY BOSHQARUV (DASHBOARD) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">
                      {t.admin.stats.totalAppointments}
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                      {totalAppointmentsCount}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {approvedAppointmentsCount} {t.admin.stats.approvedSuffix}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">
                      {t.admin.stats.totalRevenue}
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                      {grossRevenue.toLocaleString()}{' '}
                      <span className="text-xs font-normal">{t.common.currency}</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +18.4% {t.admin.stats.growth}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
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
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
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
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Building className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Weekly Activity Trends Chart Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {t.admin.chart.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t.admin.chart.subtitle}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-xl self-start sm:self-auto">
                    {t.admin.chart.realtime}
                  </span>
                </div>

                <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 px-4">
                  {chartData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.apt} {t.admin.chart.bookingUnit}
                      </span>
                      <div
                        className="w-full max-w-[44px] bg-gradient-to-t from-blue-600 to-indigo-500 rounded-xl transition-all duration-500 group-hover:brightness-110 shadow-sm"
                        style={{ height: `${item.val}%` }}
                      ></div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions & Recent Bookings preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Recent Appointments */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{t.admin.recentApts}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('appointments')}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      {t.admin.allCount} ({appointments.length})
                    </button>
                  </div>

                  <div className="space-y-2">
                    {appointments.slice(0, 3).map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-2"
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
                      className="text-blue-600 hover:underline font-bold"
                    >
                      {t.admin.tabs.products}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {products.slice(0, 3).map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-2"
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
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">
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
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
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

              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                  <span className="text-slate-500 font-semibold block">{t.admin.revenueAnalytics.avgCheckup}</span>
                  <span className="text-lg font-bold text-blue-900 dark:text-blue-200 mt-1 block">
                    155,000 {t.common.currency}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                  <span className="text-slate-500 font-semibold block">{t.admin.revenueAnalytics.monthlyForecast}</span>
                  <span className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mt-1 block">
                    38,500,000 {t.common.currency}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                  <span className="text-slate-500 font-semibold block">{t.admin.revenueAnalytics.growthRate}</span>
                  <span className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mt-1 block">
                    +18.4% {t.admin.revenueAnalytics.vsLastMonth}
                  </span>
                </div>
              </div>

              {/* Revenue share per category */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t.admin.revenueAnalytics.breakdownTitle}
                </h4>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>{t.admin.revenueAnalytics.doctorShare}</span>
                      <span>68% (8,600,000 {t.common.currency})</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>{t.admin.revenueAnalytics.pharmacyShare}</span>
                      <span>32% (4,050,000 {t.common.currency})</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOTUVLAR */}
          {activeTab === 'sales' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>{t.admin.salesOrders.title} ({orders.length})</span>
                </h3>
                <span className="text-slate-400">{t.admin.salesOrders.subtitle}</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto opacity-50" />
                  <p>{t.admin.salesOrders.empty}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {t.admin.salesOrders.orderNum} #{ord.id} — {ord.customerName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {ord.phone} • {ord.address}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {t.admin.salesOrders.payment}: {ord.paymentMethod} • {t.admin.salesOrders.promo}: {ord.promoCode || t.admin.salesOrders.none}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-sm text-blue-600 dark:text-blue-400">
                          {Number(ord.total).toLocaleString()} {t.common.currency}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {t.admin.salesOrders.delivering}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OMBORXONA / MAHSULOTLAR CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Top toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    placeholder={t.admin.productsCrud.searchPlaceholder}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-102"
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

                          <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
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
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
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
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
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
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs animate-in fade-in">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {t.admin.appointmentsTable.title} ({appointments.length})
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in text-xs">
              <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-600" />
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
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm"
                    >
                      {t.admin.telegramTab.saveSettings}
                    </button>

                    <button
                      type="button"
                      onClick={handleTestTelegram}
                      disabled={isTestingTelegram}
                      className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl transition-colors flex items-center gap-1.5"
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
