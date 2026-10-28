import React from 'react';
import { useApp } from '../context/AppContext';
import { initialDoctors } from '../data/doctorsData';
import { MapPin, PhoneCall, Star, Clock, Calendar, Navigation } from 'lucide-react';
import { createClinicFallbackSvg } from '../utils/imageFallback';

export default function ClinicCard({ clinic, onSelectOnMap }) {
  const { t, openBookingModal } = useApp();

  return (
    <div className="interactive-card group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 hover:border-teal-400/60 dark:hover:border-teal-500/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative ambient card glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>

      <div className="relative z-10">
        {/* Image & Badges */}
        <div className="relative rounded-2xl overflow-hidden h-44 mb-4 shadow-xs">
          <img
            src={clinic.image}
            alt={clinic.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = createClinicFallbackSvg(clinic.name);
            }}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
            {clinic.emergency247 && (
              <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                {t.clinics.open247}
              </span>
            )}
            <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
              {clinic.distanceKm} km {t.map.distanceAway}
            </span>
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-1 text-xs font-black text-amber-300 bg-slate-950/60 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-amber-300/20">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{clinic.rating}</span>
              <span className="text-slate-300 text-[10px] font-normal">({clinic.reviewsCount})</span>
            </div>
            <span className="text-[10px] font-bold text-teal-200 bg-teal-950/80 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-teal-500/30">
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
            <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
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
                className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/50 text-teal-700 dark:text-teal-300 group-hover:border-teal-400/50 transition-colors"
              >
                {d}
              </span>
            ))}
            {clinic.departments.length > 4 && (
              <span className="text-[10px] text-slate-400 px-1 py-0.5 font-bold">
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
          className="btn-spring btn-shimmer w-full py-2.5 px-4 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>{t.clinics.bookBtn}</span>
        </button>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href={`tel:${clinic.phone.replace(/[^0-9+]/g, '')}`}
            className="btn-spring py-2 px-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{t.clinics.callBtn}</span>
          </a>

          {onSelectOnMap ? (
            <button
              type="button"
              onClick={() => onSelectOnMap(clinic)}
              className="btn-spring py-2 px-2.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{t.clinics.routeBtn || "Marshrut"}</span>
            </button>
          ) : (
            <a
              href={`https://yandex.uz/maps/?rtext=41.3111,69.2797~${clinic.lat},${clinic.lng}&rtt=auto`}
              target="_blank"
              rel="noreferrer"
              className="btn-spring py-2 px-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{t.clinics.routeBtn}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
