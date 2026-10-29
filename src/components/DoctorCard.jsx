import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Calendar, Clock, Building2, Heart, CheckCircle2 } from 'lucide-react';
import { createDoctorFallbackSvg } from '../utils/imageFallback';

export default function DoctorCard({ doctor }) {
  const { t, openBookingModal, openReviewModal, toggleFavorite, isFavorite } = useApp();
  const isFav = isFavorite(doctor.id);

  return (
    <div className="interactive-card group surface-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
      {/* Top section: Avatar, Info, Favorite */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <img
                src={doctor.image}
                alt={doctor.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = createDoctorFallbackSvg(doctor.name, doctor.specialty);
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900" title="Tasdiqlangan mutaxassis">
              <CheckCircle2 className="w-3 h-3" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 border border-teal-200/60 dark:border-teal-800/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
              {doctor.specialty}
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {doctor.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {doctor.degree}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(doctor.id)}
            className={`p-2 rounded-xl border btn-spring transition-colors shrink-0 cursor-pointer ${
              isFav
                ? 'bg-rose-50 border-rose-200 text-rose-500 fill-rose-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            aria-label="Sevimlilarga saqlash"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Doctor stats (Experience, Rating, Patients) */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-center text-xs mb-3">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">
              {doctor.experienceYears}+ yil
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {t.doctors.exp}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (openReviewModal) openReviewModal({ targetType: 'doctor', target: doctor });
            }}
            className="border-x border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer p-0.5 text-center group/rate"
            title="Bemorlar baholari va fikrlarini ko'rish / baholash"
          >
            <div className="font-bold text-amber-500 flex items-center justify-center gap-1 group-hover/rate:scale-105 transition-transform">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{doctor.rating}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium group-hover/rate:text-amber-600">
              {t.doctors.rating} (Fikrlar)
            </div>
          </button>

          <div>
            <div className="font-bold text-slate-900 dark:text-white">
              {doctor.patientsTreated ? doctor.patientsTreated.toLocaleString() : '3,000+'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {t.doctors.patientsWord}
            </div>
          </div>
        </div>

        {/* Clinic & Bio */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">{doctor.clinicName}</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-[11px] leading-relaxed">
            {doctor.bio}
          </p>
        </div>

        {/* Available Time Slots Preview */}
        {doctor.availableSlots && doctor.availableSlots.length > 0 && (
          <div className="mt-3">
            <div className="text-[10px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span>{t.doctors.slotsAvailable}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {doctor.availableSlots.slice(0, 4).map((slot) => (
                <span
                  key={slot}
                  className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 font-medium text-[10px]"
                >
                  {slot}
                </span>
              ))}
              {doctor.availableSlots.length > 4 && (
                <span className="text-[10px] text-slate-400 px-1 py-0.5 font-medium">
                  +{doctor.availableSlots.length - 4} {t.doctors.moreSlots}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pricing & Booking action */}
      <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 relative z-10">
        <button
          type="button"
          onClick={() => {
            if (openReviewModal) openReviewModal({ targetType: 'doctor', target: doctor });
          }}
          className="btn-spring w-full py-1.5 px-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Fikrlar & 5★ Baho qo'yish</span>
        </button>

        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">
              {t.appointment.price}:
            </span>
            <span className="text-base font-bold text-teal-600 dark:text-teal-400">
              {Number(doctor.price).toLocaleString()} <span className="text-xs font-normal text-slate-500">{t.common.currency}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => openBookingModal(doctor)}
            className="btn-spring flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.doctors.bookAppointment}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
