import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Calendar, Clock, Award, Building, Heart, CheckCircle2 } from 'lucide-react';
import { createDoctorFallbackSvg } from '../utils/imageFallback';

export default function DoctorCard({ doctor }) {
  const { t, openBookingModal, toggleFavorite, isFavorite } = useApp();
  const isFav = isFavorite(doctor.id);

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative">
      {/* Top section: Avatar, Info, Favorite */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative">
            <img
              src={doctor.image}
              alt={doctor.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = createDoctorFallbackSvg(doctor.name, doctor.specialty);
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-md group-hover:scale-105 transition-transform"
              loading="lazy"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
              {doctor.specialty}
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
              {doctor.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {doctor.degree}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(doctor.id)}
            className={`p-2 rounded-full border transition-colors shrink-0 ${
              isFav
                ? 'bg-rose-50 border-rose-200 text-rose-500 fill-rose-500'
                : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
            }`}
            aria-label="Sevimlilarga saqlash"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Doctor stats (Experience, Rating, Patients) */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-center text-xs mb-3">
          <div>
            <div className="font-extrabold text-slate-900 dark:text-white">
              {doctor.experienceYears}+
            </div>
            <div className="text-[10px] text-slate-400">
              {t.doctors.exp}
            </div>
          </div>

          <div className="border-x border-slate-200 dark:border-slate-700">
            <div className="font-extrabold text-amber-500 flex items-center justify-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{doctor.rating}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              {t.doctors.rating}
            </div>
          </div>

          <div>
            <div className="font-extrabold text-slate-900 dark:text-white">
              {doctor.patientsTreated ? doctor.patientsTreated.toLocaleString() : '3,000+'}
            </div>
            <div className="text-[10px] text-slate-400">
              bemor
            </div>
          </div>
        </div>

        {/* Clinic & Bio */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
            <Building className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">{doctor.clinicName}</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-[11px] leading-relaxed">
            {doctor.bio}
          </p>
        </div>

        {/* Available Time Slots Preview */}
        {doctor.availableSlots && doctor.availableSlots.length > 0 && (
          <div className="mt-3">
            <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-600" />
              <span>Yaqin qabul vaqtlari (Bugun / Ertaga):</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {doctor.availableSlots.slice(0, 4).map((slot) => (
                <span
                  key={slot}
                  className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold text-[10px]"
                >
                  {slot}
                </span>
              ))}
              {doctor.availableSlots.length > 4 && (
                <span className="text-[10px] text-slate-400 px-1 py-0.5 font-bold">
                  +{doctor.availableSlots.length - 4} yana
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pricing & Booking action */}
      <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">
            {t.appointment.price}:
          </span>
          <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">
            {Number(doctor.price).toLocaleString()} <span className="text-xs font-normal">so'm</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => openBookingModal(doctor)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 hover:scale-102 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>{t.doctors.bookAppointment}</span>
        </button>
      </div>
    </div>
  );
}
