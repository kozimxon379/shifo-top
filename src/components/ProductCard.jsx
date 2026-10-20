import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingCart, Star, ShieldCheck, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { t, addToCart, cart, toggleFavorite, isFavorite } = useApp();

  const inCart = cart.some(item => item.id === product.id);
  const isFav = isFavorite(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Top badges & Favorite heart */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 h-44 mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Favorite toggle */}
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${
            isFav
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
          }`}
          aria-label="Sevimlilarga qo'shish"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
        </button>

        {/* Discount badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
            -{discountPercent}%
          </span>
        )}

        {/* Prescription Tag */}
        <div className="absolute bottom-2 left-2 right-2">
          {product.prescriptionRequired ? (
            <span className="inline-block bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
              {t.store.prescription}
            </span>
          ) : (
            <span className="inline-block bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
              {t.store.noPrescription}
            </span>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="capitalize">{product.categoryName || product.category}</span>
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
          {product.name}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Pricing & Cart Action */}
      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div>
          <div className="text-base font-extrabold text-teal-600 dark:text-teal-400">
            {Number(product.price).toLocaleString()} <span className="text-xs font-normal">so'm</span>
          </div>
          {product.originalPrice && (
            <div className="text-[11px] text-slate-400 line-through">
              {Number(product.originalPrice).toLocaleString()} so'm
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            inCart
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20'
          }`}
        >
          {inCart ? (
            <>
              <Check className="w-4 h-4" />
              <span>{t.store.inCart}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>{t.store.addToCart}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
