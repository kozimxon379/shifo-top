import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import { createProductFallbackSvg } from '../utils/imageFallback';

export default function ProductCard({ product }) {
  const { t, addToCart, cart, toggleFavorite, isFavorite } = useApp();

  const inCart = cart.some(item => item.id === product.id);
  const isFav = isFavorite(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="interactive-card group surface-card rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
      {/* Top badges & Favorite heart */}
      <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 h-44 mb-3 z-10">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = createProductFallbackSvg(product.name, product.category);
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Favorite toggle */}
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          className={`btn-spring absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
            isFav
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
          }`}
          aria-label="Sevimlilarga qo'shish"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
        </button>

        {/* Discount badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
            -{discountPercent}%
          </span>
        )}

        {/* Prescription Tag */}
        <div className="absolute bottom-2 left-2 right-2">
          {product.prescriptionRequired ? (
            <span className="inline-block bg-amber-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
              {t.store.prescription}
            </span>
          ) : (
            <span className="inline-block bg-emerald-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
              {t.store.noPrescription}
            </span>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="space-y-2 flex-1 relative z-10">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="capitalize font-semibold text-teal-600 dark:text-teal-400">
            {t.store.categories[product.category] || product.categoryName || product.category}
          </span>
          <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
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
          <div className="text-base font-bold text-teal-600 dark:text-teal-400">
            {Number(product.price).toLocaleString()} <span className="text-xs font-normal text-slate-500">{t.common.currency}</span>
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
          className={`btn-spring flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer ${
            inCart
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          {inCart ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{t.store.inCart}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{t.store.buyBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
