import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Send,
  X,
  MapPin,
  CreditCard
} from 'lucide-react';

export default function CartPage() {
  const {
    t,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedPromo,
    applyPromoCode,
    placeOrder,
    user
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Naqd yoki karta bilan qabul qilganda');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Delivery fee calculation
  let deliveryFee = subtotal > 200000 || appliedPromo?.freeDelivery ? 0 : 20000;

  // Discount calculation
  let discountAmount = 0;
  if (appliedPromo?.discountPercent) {
    discountAmount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim() || !customerName.trim()) {
      alert("Iltimos, yetkazib berish ma'lumotlarini to'ldiring!");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await placeOrder({
        customerName,
        phone,
        address,
        paymentMethod,
        promoCode: appliedPromo?.code || null,
        total: finalTotal,
        subtotal,
        deliveryFee,
        discountAmount
      });

      setOrderComplete(order);
      setCheckoutModalOpen(false);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xl">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            Buyurtma #{orderComplete.id} qabul qilindi!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Xaridingiz uchun rahmat!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2">
            Buyurtmangiz tezkor kuryer xizmatiga yo'naltirildi va to'liq ma'lumotlar Telegram botimizga yuborildi. Operatorimiz 5 daqiqada sizga qo'ng'iroq qiladi.
          </p>
        </div>

        <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-900 text-xs text-teal-900 dark:text-teal-200 flex items-center justify-center gap-2 max-w-md mx-auto">
          <Send className="w-4 h-4 text-teal-600" />
          <span>Telegram bot orqali kvitansiya jo'natildi</span>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <Link
            to="/store"
            onClick={() => setOrderComplete(null)}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all"
          >
            Dorixonaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t.cart.emptyTitle}
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {t.cart.emptyDesc}
        </p>
        <div className="pt-2">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all"
          >
            <span>{t.cart.startShopping}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div>
        <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
          Xarid Savati
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          {t.cart.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-800">
            <span>Mahsulotlar ({cart.length})</span>
            <button
              type="button"
              onClick={clearCart}
              className="text-rose-500 hover:text-rose-700 font-semibold"
            >
              Savatni tozalash
            </button>
          </div>

          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 text-xs"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {item.name}
                </h4>
                <div className="text-teal-600 dark:text-teal-400 font-bold mt-1">
                  {Number(item.price).toLocaleString()} so'm
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => updateCartQuantity(item.id, -1)}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  aria-label="Kamaytirish"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold text-slate-900 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(item.id, 1)}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  aria-label="Ko'paytirish"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Total for item & Delete */}
              <div className="text-right shrink-0">
                <div className="font-extrabold text-slate-900 dark:text-white">
                  {(item.price * item.quantity).toLocaleString()} so'm
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 mt-1 transition-colors"
                  aria-label="O'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Promo Code Box */}
        <div className="lg:col-span-4 space-y-5">
          {/* Promo code card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-teal-600" />
              <span>Promokod bormi?</span>
            </h4>

            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="SHIFO2026 yoki SALOM"
                className="flex-1 uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors"
              >
                {t.cart.applyPromo}
              </button>
            </form>

            {appliedPromo && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>Promokod: <b>{appliedPromo.code}</b> ({appliedPromo.desc})</span>
                <span className="font-bold">Aktiv</span>
              </div>
            )}
          </div>

          {/* Order Summary breakdown */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t.cart.orderSummary}
            </h3>

            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t.cart.subtotal}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {subtotal.toLocaleString()} so'm
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>{t.cart.discount}</span>
                  <span>-{discountAmount.toLocaleString()} so'm</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t.cart.delivery}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">{t.cart.free}</span>
                  ) : (
                    `${deliveryFee.toLocaleString()} so'm`
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {t.cart.finalTotal}
              </span>
              <span className="text-xl font-black text-teal-600 dark:text-teal-400">
                {finalTotal.toLocaleString()} so'm
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutModalOpen(true)}
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-2xl text-xs shadow-lg shadow-teal-500/20 transition-all hover:scale-102 flex items-center justify-center gap-2"
            >
              <span>{t.cart.checkoutBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-teal-700 to-cyan-800 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {t.cart.checkoutModal.title}
              </h3>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Qabul qiluvchi ismi va familiyasi *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Masalan: Azizbek Norov"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Telefon raqamingiz *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.cart.checkoutModal.address} *
                </label>
                <textarea
                  rows="2"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Toshkent shahri, Chilonzor tumani, 9-mavze, 12-uy..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.cart.checkoutModal.paymentMethod}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                >
                  <option value="Qabul qilganda naqd yoki karta">{t.cart.checkoutModal.payCash}</option>
                  <option value="Click / Payme / Uzum">{t.cart.checkoutModal.payClick}</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSubmitting ? "Yuborilmoqda..." : `${t.cart.checkoutModal.confirmBtn} (${finalTotal.toLocaleString()} so'm)`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
