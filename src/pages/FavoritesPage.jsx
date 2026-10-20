import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { initialDoctors } from '../data/doctorsData';
import ProductCard from '../components/ProductCard';
import DoctorCard from '../components/DoctorCard';
import { Heart, Stethoscope, Store, ArrowRight } from 'lucide-react';

export default function FavoritesPage() {
  const { t, favorites, products } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'products', 'doctors'

  const favoriteProducts = products.filter(p => favorites.includes(p.id));
  const favoriteDoctors = initialDoctors.filter(d => favorites.includes(d.id));

  const totalCount = favoriteProducts.length + favoriteDoctors.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div>
        <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
          {t.favoritesPage.badge}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          {t.nav.favorites} ({totalCount})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.favoritesPage.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.favoritesPage.tabAll} ({totalCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.favoritesPage.tabStore} ({favoriteProducts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'doctors'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.favoritesPage.tabDoctors} ({favoriteDoctors.length})
        </button>
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {t.favoritesPage.emptyTitle}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t.favoritesPage.emptyDesc}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/store"
              className="px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-xs hover:bg-teal-700 transition-colors"
            >
              {t.cart.startShopping}
            </Link>
            <Link
              to="/doctors"
              className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.nav.doctors}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Favorite Doctors */}
          {(activeTab === 'all' || activeTab === 'doctors') && favoriteDoctors.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <span>{t.favoritesPage.savedDoctors} ({favoriteDoctors.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteDoctors.map((doc) => (
                  <DoctorCard key={doc.id} doctor={doc} />
                ))}
              </div>
            </div>
          )}

          {/* Favorite Products */}
          {(activeTab === 'all' || activeTab === 'products') && favoriteProducts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-teal-600" />
                <span>{t.favoritesPage.savedProducts} ({favoriteProducts.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favoriteProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
