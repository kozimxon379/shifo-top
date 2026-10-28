import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Calendar, Clock, Award, Building, Heart, CheckCircle2 } from 'lucide-react';
import { createDoctorFallbackSvg } from '../utils/imageFallback';

export default function DoctorCard({ doctor }) {
  const { t, openBookingModal, toggleFavorite, isFavorite } = useApp();
  const isFav = isFavorite(doctor.id);

  return (
    <div className="interactive-card group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 hover:border-teal-400/60 dark:hover:border-teal-500/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative subtle ambient card glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>

      {/* Top section: Avatar, Info, Favorite */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-teal-500/80 shadow-md group-hover:border-teal-400 group-hover:shadow-teal-500/20 transition-all duration-300">
              <img
                src={doctor.image}
                alt={doctor.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = createDoctorFallbackSvg(doctor.name, doctor.specialty);
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-xs animate-pulse-emerald">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 border border-teal-200/50 dark:border-teal-800/50 px-2.5 py-0.5 rounded-full inline-block mb-1 group-hover:border-teal-400 transition-colors">
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
            className={`p-2.5 rounded-2xl border btn-spring transition-all shrink-0 cursor-pointer ${
              isFav
                ? 'bg-rose-50 border-rose-200 text-rose-500 fill-rose-500 scale-105 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-slate-800'
            }`}
            aria-label="Sevimlilarga saqlash"
          >
            <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-rose-500 scale-110' : 'group-hover:scale-110'}`} />
          </button>
        </div>

        {/* Doctor stats (Experience, Rating, Patients) */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 text-center text-xs mb-3 group-hover:bg-teal-50/30 dark:group-hover:bg-slate-800 transition-colors">
          <div>
            <div className="font-black text-slate-900 dark:text-white">
              {doctor.experienceYears}+
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {t.doctors.exp}
            </div>
          </div>

          <div className="border-x border-slate-200 dark:border-slate-700">
            <div className="font-black text-amber-500 flex items-center justify-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{doctor.rating}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {t.doctors.rating}
            </div>
          </div>

          <div>
            <div className="font-black text-slate-900 dark:text-white">
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
            <Building className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">{doctor.clinicName}</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-[11px] leading-relaxed">
            {doctor.bio}
          </p>
        </div>

        {/* Available Time Slots Preview */}
        {doctor.availableSlots && doctor.availableSlots.length > 0 && (
          <div className="mt-3">
            <div className="text-[10px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span>{t.doctors.slotsAvailable}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {doctor.availableSlots.slice(0, 4).map((slot) => (
                <span
                  key={slot}
                  className="px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 font-semibold text-[10px] hover:border-teal-400 transition-colors"
                >
                  {slot}
                </span>
              ))}
              {doctor.availableSlots.length > 4 && (
                <span className="text-[10px] text-slate-400 px-1.5 py-0.5 font-bold">
                  +{doctor.availableSlots.length - 4} {t.doctors.moreSlots}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pricing & Booking action */}
      <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 relative z-10">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">
            {t.appointment.price}:
          </span>
          <span className="text-base font-black text-teal-600 dark:text-teal-400">
            {Number(doctor.price).toLocaleString()} <span className="text-xs font-normal">{t.common.currency}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => openBookingModal(doctor)}
          className="btn-spring btn-shimmer flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-500/25 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>{t.doctors.bookAppointment}</span>
        </button>
      </div>
    </div>
  );
}
