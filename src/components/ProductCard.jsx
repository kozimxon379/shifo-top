import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingCart, Star, ShieldCheck, Check } from 'lucide-react';
import { createProductFallbackSvg } from '../utils/imageFallback';

export default function ProductCard({ product }) {
  const { t, addToCart, cart, toggleFavorite, isFavorite } = useApp();

  const inCart = cart.some(item => item.id === product.id);
  const isFav = isFavorite(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="interactive-card group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-4 hover:border-teal-400/60 dark:hover:border-teal-500/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative ambient card glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>

      {/* Top badges & Favorite heart */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 h-44 mb-3 relative z-10 shadow-xs">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = createProductFallbackSvg(product.name, product.category);
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Favorite toggle */}
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          className={`btn-spring absolute top-2.5 right-2.5 p-2 rounded-2xl backdrop-blur-md transition-all cursor-pointer ${
            isFav
              ? 'bg-rose-500 text-white shadow-md scale-105'
              : 'bg-white/85 dark:bg-slate-900/85 text-slate-600 dark:text-slate-300 hover:text-rose-500 shadow-xs'
          }`}
          aria-label="Sevimlilarga qo'shish"
        >
          <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-white scale-110' : ''}`} />
        </button>

        {/* Discount badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">
            -{discountPercent}%
          </span>
        )}

        {/* Prescription Tag */}
        <div className="absolute bottom-2 left-2 right-2">
          {product.prescriptionRequired ? (
            <span className="inline-block bg-amber-500/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg backdrop-blur-md shadow-xs">
              {t.store.prescription}
            </span>
          ) : (
            <span className="inline-block bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg backdrop-blur-md shadow-xs">
              {t.store.noPrescription}
            </span>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="space-y-2 flex-1 relative z-10">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="capitalize font-semibold text-teal-600 dark:text-teal-400">{t.store.categories[product.category] || product.categoryName || product.category}</span>
          <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-400 text-[10px] font-normal">({product.reviewsCount})</span>
          </div>
        </div>

        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Pricing & Cart Action */}
      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 relative z-10">
        <div>
          <div className="text-base font-black text-teal-600 dark:text-teal-400">
            {Number(product.price).toLocaleString()} <span className="text-xs font-normal">{t.common.currency}</span>
          </div>
          {product.originalPrice && (
            <div className="text-[11px] text-slate-400 line-through">
              {Number(product.originalPrice).toLocaleString()} {t.common.currency}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className={`btn-spring btn-shimmer flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
            inCart
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
              : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-teal-500/20'
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
              <span>{t.store.buyBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
