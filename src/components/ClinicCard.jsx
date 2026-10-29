import React from 'react';
import { useApp } from '../context/AppContext';
import { initialDoctors } from '../data/doctorsData';
import { MapPin, PhoneCall, Star, Calendar, Navigation } from 'lucide-react';
import { createClinicFallbackSvg } from '../utils/imageFallback';

export default function ClinicCard({ clinic, onSelectOnMap }) {
  const { t, openBookingModal, openReviewModal } = useApp();

  return (
    <div className="interactive-card group surface-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
      <div className="relative z-10">
        {/* Image & Badges */}
        <div className="relative rounded-xl overflow-hidden h-44 mb-4 bg-slate-100 dark:bg-slate-800">
          <img
            src={clinic.image}
            alt={clinic.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = createClinicFallbackSvg(clinic.name);
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/10"></div>

          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
            {clinic.emergency247 && (
              <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {t.clinics.open247}
              </span>
            )}
            <span className="bg-slate-900/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10">
              {clinic.distanceKm} km {t.map.distanceAway}
            </span>
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (openReviewModal) openReviewModal({ targetType: 'clinic', target: clinic });
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-slate-950/80 hover:bg-amber-400 hover:text-slate-950 transition-colors backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 cursor-pointer shadow-xs group/rating"
              title="Barcha fikrlar va 5 yulduzli baholarni ko'rish / baholash"
            >
              <Star className="w-3.5 h-3.5 fill-amber-300 group-hover/rating:fill-slate-950" />
              <span>{clinic.rating}</span>
              <span className="text-[10px] opacity-80">({clinic.reviewsCount} baho)</span>
            </button>
            <span className="text-[10px] font-medium text-teal-200 bg-slate-950/70 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
              {clinic.region}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {clinic.name}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{clinic.address} ({clinic.district})</span>
          </p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {clinic.description}
          </p>

          {/* Departments */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {clinic.departments.slice(0, 4).map((d) => (
              <span
                key={d}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/50 text-teal-700 dark:text-teal-300"
              >
                {d}
              </span>
            ))}
            {clinic.departments.length > 4 && (
              <span className="text-[10px] text-slate-400 px-1 py-0.5 font-medium">
                +{clinic.departments.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 relative z-10">
        <button
          type="button"
          onClick={() => {
            const doctor = initialDoctors.find(d => d.clinicId === clinic.id) || initialDoctors[0];
            openBookingModal({
              ...doctor,
              clinicName: clinic.name
            });
          }}
          className="btn-spring w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Calendar className="w-4 h-4" />
          <span>{t.clinics.bookBtn}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (openReviewModal) openReviewModal({ targetType: 'clinic', target: clinic });
          }}
          className="btn-spring w-full py-2 px-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Fikrlar & 5★ Baho qo'yish ({clinic.reviewsCount})</span>
        </button>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href={`tel:${clinic.phone.replace(/[^0-9+]/g, '')}`}
            className="btn-spring py-2 px-2.5 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{t.clinics.callBtn}</span>
          </a>

          {onSelectOnMap ? (
            <button
              type="button"
              onClick={() => onSelectOnMap(clinic)}
              className="btn-spring py-2 px-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{t.clinics.routeBtn || "Marshrut"}</span>
            </button>
          ) : (
            <a
              href={`https://yandex.uz/maps/?rtext=41.3111,69.2797~${clinic.lat},${clinic.lng}&rtt=auto`}
              target="_blank"
              rel="noreferrer"
              className="btn-spring py-2 px-2.5 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{t.clinics.routeBtn}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
