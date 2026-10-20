import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { sendTelegramMessage } from '../utils/telegram';
import { createProductFallbackSvg } from '../utils/imageFallback';
import {
  Shield,
  LayoutDashboard,
  Package,
  Calendar,
  Send,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Check,
  X,
  ExternalLink
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
    telegramConfig,
    saveTelegramConfig,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'appointments', 'telegram'

  // Product CRUD Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'medicines',
    categoryName: 'Dori vositalari',
    stock: 50,
    prescriptionRequired: false,
    image: '',
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
          Admin huquqi talab qilinadi
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Admin panel va mahsulotlar CRUD tizimini sinab ko'rish uchun quyidagi tugmani bosing:
        </p>
        <button
          type="button"
          onClick={() => {
            loginUser({
              username: 'admin',
              name: 'Bosh Administrator',
              role: 'admin',
              phone: '+998 71 200 00 03'
            });
          }}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all"
        >
          Admin sifatida tizimga kirish
        </button>
      </div>
    );
  }

  // Calculate Dashboard Metrics
  const totalAppointmentsCount = appointments.length;
  const approvedAppointmentsCount = appointments.filter(a => a.status === 'approved').length;
  const grossRevenue = appointments
    .filter(a => a.status === 'approved')
    .reduce((sum, a) => sum + (Number(a.price) || 0), 12500000);
  const totalProductsCount = products.length;

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      price: '',
      originalPrice: '',
      category: 'medicines',
      categoryName: 'Dori vositalari',
      stock: 50,
      prescriptionRequired: false,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
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
      categoryName: prod.categoryName || 'Dori vositalari',
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
      addToast("Xabar yuborildi!", "Telegram botga test xabari yetib bordi.", "success");
    } else {
      addToast("Xatolik", res.error || "Xabar yuborib bo'lmadi", "error");
    }
  };

  const filteredAdminProducts = products.filter(p =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(prodSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>Administrator Hududi</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {t.admin.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.admin.subtitle}
          </p>
        </div>

        {/* Telegram status pill */}
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${
            telegramConfig.isConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${telegramConfig.isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
            <span>{telegramConfig.isConnected ? "Telegram Bot Ulandi" : "Telegram Demo Rejimda"}</span>
          </span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{t.admin.tabs.dashboard}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all shrink-0 ${
            activeTab === 'products'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.admin.tabs.products} ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all shrink-0 ${
            activeTab === 'appointments'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t.admin.tabs.appointments} ({appointments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('telegram')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all shrink-0 ${
            activeTab === 'telegram'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{t.admin.tabs.telegram}</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD METRICS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">
                  {t.admin.stats.totalAppointments}
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                  {totalAppointmentsCount}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">
                  {approvedAppointmentsCount} tasi tasdiqlangan
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">
                  {t.admin.stats.totalRevenue}
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                  {grossRevenue.toLocaleString()} <span className="text-xs font-normal">so'm</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +18.4% o'sish
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">
                  {t.admin.stats.totalProducts}
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                  {totalProductsCount}
                </span>
                <span className="text-[10px] text-slate-400">
                  Omborda to'liq mavjud
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">
                  {t.admin.stats.activeClinics}
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                  8 ta
                </span>
                <span className="text-[10px] text-teal-600 font-bold">
                  24/7 Shoshilinch xizmat
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Activity Trend Graph (Visual SVG Chart) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Haftalik Qabullar va Bemorlar Tashrifi Dinamikasi
                </h3>
                <p className="text-xs text-slate-500">
                  Oxirgi 7 kundagi navbatsiz shifokor qabullari statistikasi
                </p>
              </div>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-xl">
                Real vaqt rejimida
              </span>
            </div>

            <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 px-4">
              {[
                { day: "Dush", val: 45, apt: 14 },
                { day: "Sesh", val: 70, apt: 22 },
                { day: "Chor", val: 85, apt: 28 },
                { day: "Pay", val: 60, apt: 19 },
                { day: "Juma", val: 95, apt: 34 },
                { day: "Shan", val: 75, apt: 24 },
                { day: "Yak", val: 50, apt: 16 }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.apt} qabul
                  </span>
                  <div
                    className="w-full max-w-[42px] bg-gradient-to-t from-teal-600 to-cyan-500 rounded-xl transition-all duration-500 group-hover:brightness-110"
                    style={{ height: `${item.val}%` }}
                  ></div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={prodSearch}
                onChange={(e) => setProdSearch(e.target.value)}
                placeholder="Mahsulot nomini qidiring..."
                className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-teal-500/20 transition-all hover:scale-102"
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
                    <th className="p-4">Mahsulot</th>
                    <th className="p-4">Kategoriya</th>
                    <th className="p-4">Narxi</th>
                    <th className="p-4">Zaxira (Soni)</th>
                    <th className="p-4">Retsept</th>
                    <th className="p-4 text-right">Amallar</th>
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
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{prod.name}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{prod.description}</div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-600 dark:text-slate-300 capitalize">
                        {prod.categoryName || prod.category}
                      </td>

                      <td className="p-4 font-bold text-teal-600 dark:text-teal-400">
                        {Number(prod.price).toLocaleString()} so'm
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{prod.stock || 50} dona</span>
                      </td>

                      <td className="p-4">
                        {prod.prescriptionRequired ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Retseptli
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Retseptsiz
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/50 rounded-lg transition-colors"
                          title="Tahrirlash"
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
                          title="O'chirish"
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

      {/* TAB 3: APPOINTMENTS TABLE */}
      {activeTab === 'appointments' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs animate-in fade-in">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Bemorlar Qabuli Ro'yxati ({appointments.length})
            </h3>
            <span className="text-slate-400">Barcha ma'lumotlar avtomatik saqlanadi</span>
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
                      <div className="text-[10px] text-teal-600 dark:text-teal-400">{apt.specialty}</div>
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                      {apt.clinicName}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{apt.date}</div>
                      <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">{apt.timeSlot}</div>
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

      {/* TAB 4: TELEGRAM BOT INTEGRATION SETTINGS */}
      {activeTab === 'telegram' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in text-xs">
          {/* Settings Form */}
          <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-teal-600" />
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
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-sm"
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
                  <span>{isTestingTelegram ? "Yuborilmoqda..." : t.admin.telegramTab.testBtn}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Setup Guide */}
          <div className="md:col-span-5 bg-teal-50/60 dark:bg-teal-950/30 p-6 rounded-3xl border border-teal-200/60 dark:border-teal-900/40 space-y-4">
            <h4 className="font-bold text-sm text-teal-950 dark:text-teal-200">
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

      {/* PRODUCT ADD / EDIT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-teal-700 to-cyan-800 text-white p-5 flex items-center justify-between">
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
                  placeholder="Masalan: Paracetamol 500mg"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.admin.productsCrud.price} *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    placeholder="15000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      const catNameMap = {
                        medicines: 'Dori vositalari',
                        vitamins: 'Vitaminlar & BAD',
                        devices: 'Tibbiy uskunalar',
                        hygiene: 'Gigiyena & Antiseptiklar',
                        firstaid: 'Birinchi yordam'
                      };
                      setProdForm({
                        ...prodForm,
                        category: e.target.value,
                        categoryName: catNameMap[e.target.value] || e.target.value
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                  >
                    <option value="medicines">Dori vositalari</option>
                    <option value="vitamins">Vitaminlar & BAD</option>
                    <option value="devices">Tibbiy uskunalar</option>
                    <option value="hygiene">Gigiyena & Antiseptiklar</option>
                    <option value="firstaid">Birinchi yordam</option>
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
                  placeholder="https://images.unsplash.com/..."
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
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all"
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
