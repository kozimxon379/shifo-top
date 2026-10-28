import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Search, Filter, Store, ArrowUpDown, SlidersHorizontal, PackageX } from 'lucide-react';

export default function StorePage() {
  const { t, products } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(600000);
  const [prescriptionOnly, setPrescriptionOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'priceAsc', 'priceDesc', 'rating', 'name'

  const categories = [
    { key: 'all', label: t.store.allCategories, emoji: '✨' },
    { key: 'medicines', label: t.store.categories.medicines, emoji: '💊' },
    { key: 'vitamins', label: t.store.categories.vitamins, emoji: '🌿' },
    { key: 'devices', label: t.store.categories.devices, emoji: '🩺' },
    { key: 'hygiene', label: t.store.categories.hygiene, emoji: '🧼' },
    { key: 'firstaid', label: t.store.categories.firstaid, emoji: '🩹' }
  ];

  const filteredProducts = products
    .filter((prod) => {
      const q = search.toLowerCase();
      const matchesSearch =
        prod.name.toLowerCase().includes(q) ||
        (prod.nameRu && prod.nameRu.toLowerCase().includes(q)) ||
        (prod.description && prod.description.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'all' || prod.category === selectedCategory;

      const matchesPrice = prod.price <= maxPrice;

      const matchesPrescription = !prescriptionOnly || prod.prescriptionRequired;

      return matchesSearch && matchesCategory && matchesPrice && matchesPrescription;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // 'featured'
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Store Page Visual Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-emerald-950 via-teal-900 to-cyan-950 text-white min-h-[200px] flex items-center p-6 sm:p-8">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity">
          <img
            src="/images/products/firstaid.jpg"
            alt="Onlayn dorixona"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/95 via-slate-900/90 to-teal-900/80 z-0"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
            <span>💊 Sertifikatlangan original dori vositalari</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {t.store.title} 🛍️
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.store.subtitle} Butun Toshkent bo'ylab 45 daqiqada tez va ishonchli yetkazib beramiz! ⚡
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-semibold text-teal-200">
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">🚚 45 daqiqada yetkazish</span>
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">🛡️ 100% Original kafolat</span>
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">💳 Click / Payme / Naqd</span>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setSelectedCategory(cat.key)}
            className={`btn-spring px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === cat.key
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-500/25 scale-[1.02]'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Filters and Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.store.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Price Range Slider */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-semibold text-slate-500">{t.store.filterPrice}</span>
            <input
              type="range"
              min="10000"
              max="600000"
              step="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-teal-600 w-32 sm:w-44 cursor-pointer"
            />
            <span className="font-bold text-teal-600 dark:text-teal-400">
              {maxPrice.toLocaleString()} {t.common.currency}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
            {/* Prescription toggle */}
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300 select-none hover:text-teal-600 transition-colors">
              <input
                type="checkbox"
                checked={prescriptionOnly}
                onChange={(e) => setPrescriptionOnly(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded-sm focus:ring-teal-500"
              />
              <span>📋 {t.store.prescription}</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 font-semibold text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{t.store.sortBy}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
              >
                <option value="featured">✨ {t.store.sortOptions.featured}</option>
                <option value="priceAsc">💵 {t.store.sortOptions.priceAsc}</option>
                <option value="priceDesc">💎 {t.store.sortOptions.priceDesc}</option>
                <option value="rating">⭐ {t.store.sortOptions.rating}</option>
                <option value="name">🔤 {t.store.sortOptions.name}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="text-xs text-slate-500">
          Mavjud mahsulotlar: <span className="text-teal-600 dark:text-teal-400 font-bold">{filteredProducts.length}</span> ta
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <PackageX className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Hech qanday dori yoki vosita topilmadi
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Qidiruv so'zini yoki narx chegarasini o'zgartirib ko'ring.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
