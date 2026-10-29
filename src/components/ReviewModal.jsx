import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import {
  Star,
  X,
  ShieldCheck,
  Building2,
  Stethoscope,
  Calendar,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Send,
  User,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function ReviewModal() {
  const {
    reviewModalTarget,
    closeReviewModal,
    reviews,
    addReview,
    likeReview,
    user,
    addToast
  } = useApp();

  // If no target is selected, do not render modal
  if (!reviewModalTarget) return null;

  const { targetType, target } = reviewModalTarget; // targetType: 'clinic' | 'doctor', target: object
  const targetId = target?.id;
  const targetName = target?.name;

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [patientName, setPatientName] = useState(user?.name && user.name !== 'Mehmon' ? user.name : '');
  const [visitDate, setVisitDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [serviceUsed, setServiceUsed] = useState('');
  const [comment, setComment] = useState('');
  const [verifiedConsent, setVerifiedConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (reviewModalTarget) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [reviewModalTarget]);

  // Filter reviews for this specific target
  const targetReviews = useMemo(() => {
    return reviews.filter(
      (r) => r.targetType === targetType && r.targetId === targetId
    );
  }, [reviews, targetType, targetId]);

  // Calculate live statistics
  const totalCount = targetReviews.length;
  const avgRating = useMemo(() => {
    if (totalCount === 0) return target?.rating || 5.0;
    const sum = targetReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    return (sum / totalCount).toFixed(1);
  }, [targetReviews, totalCount, target]);

  // Star breakdown percentages
  const starCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    targetReviews.forEach((r) => {
      const s = Math.round(Number(r.rating)) || 5;
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [targetReviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      if (addToast) {
        addToast("Izoh kiritilmadi", "Iltimos, o'z taassurotingiz va fikringizni yozing!", "warning");
      }
      return;
    }
    if (!patientName.trim()) {
      if (addToast) {
        addToast("Ism kiritilmadi", "Iltimos, ismingizni kiriting!", "warning");
      }
      return;
    }

    setIsSubmitting(true);

    addReview({
      targetType,
      targetId,
      targetName,
      patientName: patientName.trim(),
      rating,
      visitDate,
      serviceUsed: serviceUsed.trim() || (targetType === 'clinic' ? "Umumiy tibbiy ko'rik" : `${target?.specialty || "Shifokor"} qabuli`),
      comment: comment.trim()
    });

    // Reset form fields
    setComment('');
    setServiceUsed('');
    setIsSubmitting(false);
  };

  const getRatingLabel = (val) => {
    switch (val) {
      case 5:
        return "5 yulduz — A'lo darajada! Barchaga tavsiya qilaman";
      case 4:
        return "4 yulduz — Juda yaxshi, xizmat ko'rsatish yoqdi";
      case 3:
        return "3 yulduz — O'rtacha, kamchiliklar bor";
      case 2:
        return "2 yulduz — Qoniqarsiz, navbat va muomala yoqmadi";
      case 1:
        return "1 yulduz — Juda yomon, tavsiya qilmayman";
      default:
        return "Bahoni tanlang";
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] !m-0 !p-4 w-screen h-screen flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in"
      onClick={closeReviewModal}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  {targetType === 'clinic' ? "Klinika Baholari" : "Shifokor Baholari"}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Tasdiqlangan tashriflar</span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5 line-clamp-1">
                {targetName}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={closeReviewModal}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          {/* 1. Rating Overview & Stars Breakdown Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Big Score Number */}
            <div className="sm:col-span-5 text-center sm:text-left sm:border-r sm:border-slate-200 sm:dark:border-slate-700 sm:pr-4">
              <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {avgRating}
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 my-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(Number(avgRating))
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                {totalCount} ta bemor bahosi asosida
              </div>
            </div>

            {/* Stars Distribution Progress Bars */}
            <div className="sm:col-span-7 space-y-1.5">
              {[5, 4, 3, 2, 1].map((s) => {
                const count = starCounts[s] || 0;
                const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : s === 5 ? 85 : s === 4 ? 15 : 0;
                return (
                  <div key={s} className="flex items-center gap-2 text-[11px]">
                    <span className="w-7 font-bold text-slate-600 dark:text-slate-300 flex items-center gap-0.5">
                      <span>{s}</span>
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-slate-400 text-[10px] font-medium">
                      {count > 0 ? count : `${percent}%`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Interactive Review Submission Form ("Borib kelgandan keyin baho qo'yish") */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50/80 via-white to-teal-50/30 dark:from-slate-800/90 dark:via-slate-800/60 dark:to-teal-950/20 border border-teal-200 dark:border-teal-800/70 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-teal-100 dark:border-slate-700 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Siz ham borib ko'rdingizmi? Fikr va 5 yulduzli baho qoldiring</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Boshqa bemorlar to'g'ri shifokor va klinikani tanlashi uchun xolis tajribangizni ulashing
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Interactive 5-Star Rating Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Xizmat sifatini 5 yulduzda baholang *
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    {[1, 2, 3, 4, 5].map((starNum) => {
                      const active = hoverRating ? starNum <= hoverRating : starNum <= rating;
                      return (
                        <button
                          key={starNum}
                          type="button"
                          onMouseEnter={() => setHoverRating(starNum)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(starNum)}
                          className="p-1 text-slate-300 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                          aria-label={`${starNum} yulduz`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              active
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {getRatingLabel(hoverRating || rating)}
                  </span>
                </div>
              </div>

              {/* Name & Visit Date Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ism-familiyangiz *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Masalan: Dilshod Rahimov"
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tashrif buyurilgan sana *
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Service used */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ko'rsatilgan tibbiy xizmat turi (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={serviceUsed}
                  onChange={(e) => setServiceUsed(e.target.value)}
                  placeholder={
                    targetType === 'clinic'
                      ? "Masalan: Kardiologiya tekshiruvi, MRT, Statsionar davolash"
                      : "Masalan: Birlamchi ko'rik, EKG tahlili, Davolash rejasi"
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Taassurot va xolis fikringiz *
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Shifokor va xodimlar muomalasi, qabul vaqtiga rioya qilingani, tozalik va natijalar haqida batafsil fikringizni yozing..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Verified Visit Consent Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-600 dark:text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={verifiedConsent}
                  onChange={(e) => setVerifiedConsent(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded-sm focus:ring-teal-500 cursor-pointer"
                />
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Men ushbu muassasaga shaxsan borganimni va fikrim xolisligini tasdiqlayman</span>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !verifiedConsent}
                className="btn-spring w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Bahoni e'lon qilish va tasdiqlash</span>
              </button>
            </form>
          </div>

          {/* 3. Verified Reviews Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <span>Borib kelgan bemorlar fikrlari ({targetReviews.length})</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">
                Eng yangi fikrlar birinchi
              </span>
            </div>

            {targetReviews.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <Star className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  Hozircha birinchi fikrni siz qoldiring!
                </p>
                <p className="text-slate-400 text-[11px]">
                  Yuqoridagi shakl orqali 5 yulduzli baho va fikringizni yozing.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {targetReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2.5"
                  >
                    {/* Review Header: User avatar, Name, Stars, Date */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {rev.patientName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{rev.patientName}</span>
                            {rev.verifiedVisit && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 px-1.5 py-0.2 rounded-full">
                                <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                                <span>Tasdiqlangan tashrif</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>Tashrif sanasi: {rev.visitDate || rev.date}</span>
                            <span>•</span>
                            <span>{rev.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* 5-Star visual display */}
                      <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= Number(rev.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                        <span className="font-bold text-amber-600 dark:text-amber-300 text-xs ml-1">
                          {rev.rating}.0
                        </span>
                      </div>
                    </div>

                    {/* Service Used Badge */}
                    {rev.serviceUsed && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                        {targetType === 'clinic' ? <Building2 className="w-3 h-3 text-teal-600" /> : <Stethoscope className="w-3 h-3 text-teal-600" />}
                        <span>{rev.serviceUsed}</span>
                      </div>
                    )}

                    {/* Comment text */}
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-xs">
                      {rev.comment}
                    </p>

                    {/* Thumbs up like action */}
                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-[10px]">Shifo.top orqali tasdiqlangan</span>
                      <button
                        type="button"
                        onClick={() => likeReview && likeReview(rev.id)}
                        className="btn-spring inline-flex items-center gap-1 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 font-medium cursor-pointer"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Foydali ({rev.likes || 0})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            Shifo.top xolis va halol baholash tizimi
          </span>
          <button
            type="button"
            onClick={closeReviewModal}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs shadow-xs"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
