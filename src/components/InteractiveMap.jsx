import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialClinics } from '../data/clinicsData';
import { initialDoctors } from '../data/doctorsData';
import { createClinicFallbackSvg } from '../utils/imageFallback';
import {
  MapPin,
  Navigation,
  PhoneCall,
  Clock,
  Star,
  ShieldCheck,
  Compass,
  Calendar,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function InteractiveMap({ selectedClinicId, onSelectClinic }) {
  const { t, openBookingModal } = useApp();
  const [activeClinicId, setActiveClinicId] = useState(selectedClinicId || initialClinics[0].id);
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: 41.3111, lng: 69.2797 }); // Tashkent center

  const activeClinic = initialClinics.find(c => c.id === activeClinicId) || initialClinics[0];

  const filteredClinics = initialClinics.filter(c => {
    if (filterSpecialty === 'all') return true;
    return c.departments.includes(filterSpecialty);
  });

  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setIsLocating(false);
        },
        () => {
          // Fallback to simulated Tashkent location
          setTimeout(() => {
            setIsLocating(false);
          }, 800);
        }
      );
    } else {
      setTimeout(() => setIsLocating(false), 500);
    }
  };

  // Convert lat/lng to percentage on Tashkent bounding box for custom interactive SVG map
  // Tashkent approx bbox: lat 41.22 to 41.38, lng 69.15 to 69.35
  const getMapPosition = (lat, lng) => {
    const minLat = 41.24;
    const maxLat = 41.38;
    const minLng = 69.16;
    const maxLng = 69.32;

    const x = Math.max(8, Math.min(92, ((lng - minLng) / (maxLng - minLng)) * 100));
    const y = Math.max(8, Math.min(92, ((maxLat - lat) / (maxLat - minLat)) * 100));

    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
      {/* Top filter toolbar */}
      <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1">
            <Layers className="w-4 h-4 text-teal-600" />
            {t.clinics.filterSpecialty}
          </span>
          {["all", "Kardiologiya", "Nevrologiya", "Xirurgiya", "Terapiya", "Stomatologiya"].map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterSpecialty(dept)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                filterSpecialty === dept
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {dept === 'all' ? t.clinics.allSpecialties : dept}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLocateMe}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-bold hover:bg-teal-100 transition-colors"
        >
          <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? t.map.locating : t.map.locateMe}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Interactive Map Visual Area */}
        <div className="lg:col-span-8 relative bg-slate-100 dark:bg-slate-950 p-4 flex items-center justify-center overflow-hidden min-h-[380px]">
          {/* Stylized Map Grid and Streets Texture */}
          <div className="absolute inset-0 opacity-20 dark:opacity-30 pointer-events-none bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:20px_20px]"></div>

          {/* Tashkent Roads Simulated SVG paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300 dark:stroke-slate-800" strokeWidth="2" fill="none">
            {/* Major ring road */}
            <ellipse cx="50%" cy="50%" rx="38%" ry="34%" className="stroke-teal-500/30 dark:stroke-teal-400/20" strokeWidth="4" />
            <path d="M 100 200 Q 300 150 500 350 T 800 300" className="stroke-cyan-500/20" strokeWidth="3" />
            <path d="M 200 50 Q 350 250 650 450" className="stroke-slate-400/30 dark:stroke-slate-700/40" strokeWidth="3" />
            <path d="M 50 350 L 800 150" className="stroke-slate-400/30 dark:stroke-slate-700/40" strokeWidth="2" />
          </svg>

          {/* User Location Simulated Marker */}
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
            style={getMapPosition(userCoords.lat, userCoords.lng)}
          >
            <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-cyan-400 opacity-60"></span>
            <div className="w-5 h-5 rounded-full bg-cyan-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold">
              ●
            </div>
            <div className="absolute top-6 whitespace-nowrap bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
              {t.map.youAreHere}
            </div>
          </div>

          {/* Clinic Pins on Map */}
          {filteredClinics.map((clinic) => {
            const isCurrent = clinic.id === activeClinicId;
            const pos = getMapPosition(clinic.lat, clinic.lng);

            return (
              <div
                key={clinic.id}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                style={pos}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveClinicId(clinic.id);
                    if (onSelectClinic) onSelectClinic(clinic);
                  }}
                  className={`group relative flex items-center justify-center p-2 rounded-2xl shadow-xl transition-all duration-300 ${
                    isCurrent
                      ? 'bg-rose-600 text-white scale-125 z-40 ring-4 ring-rose-300 dark:ring-rose-900'
                      : 'bg-teal-600 text-white hover:scale-110 hover:bg-teal-700'
                  }`}
                  aria-label={clinic.name}
                >
                  <MapPin className="w-5 h-5" />
                  {clinic.emergency247 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                  )}
                </button>

                {/* Floating Pin Label on active */}
                {isCurrent && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold px-3 py-1 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                    {clinic.name.split(' ')[0]} {clinic.name.split(' ')[1]}
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 ml-1">
                      ({clinic.distanceKm} km)
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Map legend overlay */}
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t.map.selectedClinic}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-600"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t.map.hospitals}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t.map.yourPoint}</span>
            </div>
          </div>
        </div>

        {/* Selected Clinic Details Sidebar Card */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            {/* Image & Badges */}
            <div className="relative rounded-2xl overflow-hidden h-36">
              <img
                src={activeClinic.image}
                alt={activeClinic.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = createClinicFallbackSvg(activeClinic.name);
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                {activeClinic.emergency247 && (
                  <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {t.clinics.open247}
                  </span>
                )}
                <span className="bg-teal-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {activeClinic.distanceKm} km {t.map.distanceAway}
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>{activeClinic.rating}</span>
                  <span className="text-[10px] text-slate-200 font-normal">
                    ({activeClinic.reviewsCount} {t.map.reviews})
                  </span>
                </div>
                <span className="text-[10px] text-teal-200 font-medium">
                  {activeClinic.region}
                </span>
              </div>
            </div>

            {/* Clinic Details */}
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {activeClinic.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 mt-1.5">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{activeClinic.address} ({activeClinic.district})</span>
              </p>
            </div>

            {/* Working Hours */}
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <Clock className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="font-medium">{activeClinic.workHours}</span>
            </div>

            {/* Departments */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                {t.map.departments}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeClinic.departments.map((dept) => (
                  <span
                    key={dept}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <button
              type="button"
              onClick={() => {
                const doctorInClinic = initialDoctors.find(d => d.clinicId === activeClinic.id) || initialDoctors[0];
                openBookingModal({
                  ...doctorInClinic,
                  clinicName: activeClinic.name
                });
              }}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.clinics.bookBtn}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${activeClinic.phone.replace(/[^0-9+]/g, '')}`}
                className="py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                <span>{t.clinics.callBtn}</span>
              </a>

              <a
                href={`https://yandex.uz/maps/?text=${encodeURIComponent(activeClinic.name + ' ' + activeClinic.address)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-600" />
                <span>{t.clinics.routeBtn}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
