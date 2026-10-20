import React from 'react';
import { useApp } from '../context/AppContext';
import { initialDoctors } from '../data/doctorsData';
import { MapPin, PhoneCall, Star, Clock, Calendar, Navigation } from 'lucide-react';
import { createClinicFallbackSvg } from '../utils/imageFallback';

export default function ClinicCard({ clinic, onSelectOnMap }) {
  const { t, openBookingModal } = useApp();

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image & Badges */}
        <div className="relative rounded-2xl overflow-hidden h-44 mb-4">
          <img
            src={clinic.image}
            alt={clinic.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = createClinicFallbackSvg(clinic.name);
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            {clinic.emergency247 && (
              <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                {t.clinics.open247}
              </span>
            )}
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {clinic.distanceKm} km {t.map.distanceAway}
            </span>
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{clinic.rating}</span>
              <span className="text-slate-200 text-[10px]">({clinic.reviewsCount})</span>
            </div>
            <span className="text-[10px] font-semibold text-teal-200 bg-teal-950/60 px-2 py-0.5 rounded-md">
              {clinic.region}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
            {clinic.name}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{clinic.address} ({clinic.district})</span>
          </p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
            {clinic.description}
          </p>

          {/* Departments */}
          <div className="flex flex-wrap gap-1 pt-1">
            {clinic.departments.slice(0, 4).map((d) => (
              <span
                key={d}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300"
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
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          type="button"
          onClick={() => {
            const doctor = initialDoctors.find(d => d.clinicId === clinic.id) || initialDoctors[0];
            openBookingModal({
              ...doctor,
              clinicName: clinic.name
            });
          }}
          className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          <Calendar className="w-4 h-4" />
          <span>{t.clinics.bookBtn}</span>
        </button>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href={`tel:${clinic.phone.replace(/[^0-9+]/g, '')}`}
            className="py-2 px-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.clinics.callBtn}</span>
          </a>

          {onSelectOnMap ? (
            <button
              type="button"
              onClick={() => onSelectOnMap(clinic)}
              className="py-2 px-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-600" />
              <span>{t.map.viewOnMap}</span>
            </button>
          ) : (
            <a
              href={`https://yandex.uz/maps/?text=${encodeURIComponent(clinic.name + ' ' + clinic.address)}`}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-600" />
              <span>{t.clinics.routeBtn}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
