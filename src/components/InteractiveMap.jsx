import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Car,
  Footprints,
  Route,
  CheckCircle2,
  Eye,
  EyeOff,
  LocateFixed,
  Info
} from 'lucide-react';

export default function InteractiveMap({ selectedClinicId, onSelectClinic }) {
  const { t, openBookingModal, refreshCountdown, isRefreshing, liveMetrics } = useApp();
  const [activeClinicId, setActiveClinicId] = useState(selectedClinicId || initialClinics[0].id);
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: 41.3111, lng: 69.2797 }); // Tashkent center (Navoiy / Amir Temur)
  const [showRoute, setShowRoute] = useState(true);
  const [routeMode, setRouteMode] = useState('car'); // 'car' | 'walk' | 'taxi'
  const [activeTab, setActiveTab] = useState('route'); // 'route' | 'details'

  // Synchronize active clinic when prop changes from parent
  useEffect(() => {
    if (selectedClinicId) {
      setActiveClinicId(selectedClinicId);
      setShowRoute(true);
    }
  }, [selectedClinicId]);

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
          // Simulated fallback location in central Tashkent
          setTimeout(() => {
            setUserCoords({ lat: 41.3125, lng: 69.2785 });
            setIsLocating(false);
          }, 600);
        }
      );
    } else {
      setTimeout(() => setIsLocating(false), 500);
    }
  };

  // Convert lat/lng to percentage on Tashkent bounding box for custom interactive SVG map
  // Tashkent bbox: lat 41.24 to 41.38, lng 69.16 to 69.32
  const getMapPosition = (lat, lng) => {
    const minLat = 41.24;
    const maxLat = 41.38;
    const minLng = 69.16;
    const maxLng = 69.32;

    const x = Math.max(10, Math.min(90, ((lng - minLng) / (maxLng - minLng)) * 100));
    const y = Math.max(10, Math.min(90, ((maxLat - lat) / (maxLat - minLat)) * 100));

    return { left: `${x}%`, top: `${y}%`, x, y };
  };

  const pUser = getMapPosition(userCoords.lat, userCoords.lng);
  const pClinic = getMapPosition(activeClinic.lat, activeClinic.lng);

  // Realistic city street turn waypoints connecting user to clinic
  const cornerY = pUser.y + (pClinic.y - pUser.y) * 0.48;
  const routePathD = `M ${pUser.x} ${pUser.y} L ${pUser.x} ${cornerY} L ${pClinic.x} ${cornerY} L ${pClinic.x} ${pClinic.y}`;

  // Midpoint coordinate on the route for floating badge
  const badgeX = (pUser.x + pClinic.x) / 2;
  const badgeY = cornerY;

  // Travel time and fare calculations based on actual distance
  const distance = activeClinic.distanceKm || 2.4;
  const carMins = Math.max(3, Math.round(distance * 2.3 + 2));
  const walkMins = Math.max(6, Math.round(distance * 13));
  const taxiMins = Math.max(3, Math.round(distance * 2.1 + 2));
  const taxiFare = (12000 + Math.round(distance * 2600)).toLocaleString() + " so'm";

  const currentDuration =
    routeMode === 'car' ? carMins : routeMode === 'walk' ? walkMins : taxiMins;

  // External live navigation URLs with precise start & destination coordinates
  const yandexRtt = routeMode === 'walk' ? 'pd' : 'auto';
  const yandexNavUrl = `https://yandex.uz/maps/?rtext=${userCoords.lat},${userCoords.lng}~${activeClinic.lat},${activeClinic.lng}&rtt=${yandexRtt}`;

  const googleMode = routeMode === 'walk' ? 'walking' : 'driving';
  const googleNavUrl = `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${activeClinic.lat},${activeClinic.lng}&travelmode=${googleMode}`;

  const currentClinicQueue = liveMetrics?.clinicQueues?.[activeClinic.id] || { queue: 2, waitMinutes: 6 };

  // Mode color theme
  const modeColors = {
    car: {
      stroke: '#0284c7',
      glow: 'rgba(2, 132, 199, 0.35)',
      badge: 'bg-sky-500 text-white',
      border: 'border-sky-500',
      activeTab: 'bg-sky-600 text-white shadow-md'
    },
    walk: {
      stroke: '#10b981',
      glow: 'rgba(16, 185, 129, 0.35)',
      badge: 'bg-emerald-500 text-white',
      border: 'border-emerald-500',
      activeTab: 'bg-emerald-600 text-white shadow-md'
    },
    taxi: {
      stroke: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.35)',
      badge: 'bg-amber-500 text-white',
      border: 'border-amber-500',
      activeTab: 'bg-amber-600 text-white shadow-md'
    }
  };

  const currentTheme = modeColors[routeMode];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
      {/* Top Filter & Toolbar */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-teal-600" />
            {t.clinics.filterSpecialty}
          </span>
          {['all', 'Kardiologiya', 'Nevrologiya', 'Xirurgiya', 'Terapiya', 'Stomatologiya'].map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterSpecialty(dept)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                filterSpecialty === dept
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {dept === 'all' ? t.clinics.allSpecialties : dept}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* 10-second live auto-refresh indicator */}
          <div
            title="Xarita va yo'l ma'lumotlari har 10 soniyada yangilanadi"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs"
          >
            <span className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-amber-400 animate-spin' : 'bg-emerald-500 animate-pulse'}`}></span>
            <span className="hidden sm:inline">10s yangilanish:</span>
            <span className="font-mono text-teal-600 dark:text-teal-400">{isRefreshing ? '...' : `${refreshCountdown}s`}</span>
          </div>

          {/* Quick Route Toggle */}
          <button
            type="button"
            onClick={() => setShowRoute(!showRoute)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all ${
              showRoute
                ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            {showRoute ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showRoute ? (t.map.hideRoute || "Marshrutni yashirish") : (t.map.showRoute || "Marshrutni ko'rsatish")}</span>
          </button>

          {/* Recenter / Locate Me */}
          <button
            type="button"
            onClick={handleLocateMe}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-bold hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors"
          >
            <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? t.map.locating : t.map.locateMe}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        {/* Interactive Map Visual Area */}
        <div className="lg:col-span-7 xl:col-span-8 relative bg-slate-900 p-4 flex items-center justify-center overflow-hidden min-h-[420px] select-none">
          {/* Stylized Map Grid and Streets Texture */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

          {/* Tashkent Simulated Street Background Roads */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Background city road network */}
            <ellipse cx="50" cy="50" rx="42" ry="36" fill="none" stroke="#1e293b" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            <path d="M 10 25 Q 35 45 90 30" fill="none" stroke="#1e293b" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M 20 80 Q 55 60 85 85" fill="none" stroke="#1e293b" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M 30 10 Q 50 50 65 90" fill="none" stroke="#1e293b" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            <path d="M 75 10 L 25 90" fill="none" stroke="#1e293b" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
            <path d="M 5 50 L 95 50" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />

            {/* DYNAMIC VISUAL ROUTE LAYERS */}
            {showRoute && (
              <g className="transition-all duration-500">
                {/* 1. Route Outer Glow Halo */}
                <path
                  d={routePathD}
                  fill="none"
                  stroke={currentTheme.stroke}
                  strokeWidth="10"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  opacity="0.25"
                />

                {/* 2. Route Asphalt Base Casing */}
                <path
                  d={routePathD}
                  fill="none"
                  stroke="#020617"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  opacity="0.85"
                />

                {/* 3. Main Colored Road Navigation Line */}
                <path
                  d={routePathD}
                  fill="none"
                  stroke={currentTheme.stroke}
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />

                {/* 4. Animated Moving Directional Pulse Dashes */}
                <path
                  d={routePathD}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeDasharray="4 6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className="animate-route-flow"
                />

                {/* Waypoint turn dots */}
                <circle
                  cx={pUser.x}
                  cy={cornerY}
                  r="2"
                  fill="#ffffff"
                  stroke={currentTheme.stroke}
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={pClinic.x}
                  cy={cornerY}
                  r="2"
                  fill="#ffffff"
                  stroke={currentTheme.stroke}
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            )}
          </svg>

          {/* FLOATING ROUTE ETA BADGE ON THE ROAD */}
          {showRoute && (
            <div
              className="absolute z-35 -translate-x-1/2 -translate-y-full -mt-2 transition-all duration-300 pointer-events-auto"
              style={{ left: `${badgeX}%`, top: `${badgeY}%` }}
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 border border-sky-400/50 shadow-xl text-white text-[11px] font-bold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {routeMode === 'car' && <Car className="w-3.5 h-3.5 text-sky-400" />}
                {routeMode === 'walk' && <Footprints className="w-3.5 h-3.5 text-emerald-400" />}
                {routeMode === 'taxi' && <Car className="w-3.5 h-3.5 text-amber-400" />}
                <span>
                  {currentDuration} daq • {distance} km
                </span>
              </div>
            </div>
          )}

          {/* User Location Simulated Marker ("Siz shu yerdasiz") */}
          <div
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto group cursor-pointer"
            style={pUser}
            onClick={handleLocateMe}
            title={t.map.youAreHere}
          >
            <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-cyan-400 opacity-60"></span>
            <div className="w-6 h-6 rounded-full bg-cyan-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-[10px] font-black ring-4 ring-cyan-500/30">
              ●
            </div>
            <div className="absolute top-7 whitespace-nowrap bg-slate-950/90 border border-cyan-400/50 text-cyan-200 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg pointer-events-none">
              {t.map.youAreHere} (Navoiy ko'chasi)
            </div>
          </div>

          {/* Clinic Pins on Map */}
          {filteredClinics.map((clinic) => {
            const isCurrent = clinic.id === activeClinicId;
            const pos = getMapPosition(clinic.lat, clinic.lng);

            return (
              <div
                key={clinic.id}
                className="absolute z-25 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                style={pos}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveClinicId(clinic.id);
                    setShowRoute(true);
                    if (onSelectClinic) onSelectClinic(clinic);
                  }}
                  className={`group relative flex items-center justify-center p-2 rounded-2xl shadow-2xl transition-all duration-300 ${
                    isCurrent
                      ? 'bg-rose-600 text-white scale-125 z-40 ring-4 ring-rose-400/80 shadow-rose-600/50'
                      : 'bg-teal-600/90 text-white hover:scale-110 hover:bg-teal-500 border border-white/20'
                  }`}
                  aria-label={clinic.name}
                >
                  <MapPin className="w-5 h-5" />
                  {clinic.emergency247 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                  )}
                </button>

                {/* Floating Pin Label for Active Clinic */}
                {isCurrent && (
                  <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 border border-rose-500/60 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-2xl z-50 flex items-center gap-1.5 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>{clinic.name.split(' ')[0]} {clinic.name.split(' ')[1]}</span>
                    <span className="text-[10px] text-rose-300 font-extrabold ml-0.5">
                      ({clinic.distanceKm} km)
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Live Route Mode Switcher on Map (Top-Right) */}
          <div className="absolute top-4 right-4 z-40 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700 shadow-xl text-xs">
            <button
              type="button"
              onClick={() => { setRouteMode('car'); setShowRoute(true); }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                routeMode === 'car'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Avtomobilda marshrut"
            >
              <Car className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.map.byCar || "Avtomobil"}</span>
            </button>

            <button
              type="button"
              onClick={() => { setRouteMode('walk'); setShowRoute(true); }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                routeMode === 'walk'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Piyoda marshrut"
            >
              <Footprints className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.map.byWalk || "Piyoda"}</span>
            </button>

            <button
              type="button"
              onClick={() => { setRouteMode('taxi'); setShowRoute(true); }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                routeMode === 'taxi'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Taksi / Yandex Go"
            >
              <Car className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.map.byTaxi || "Taksi"}</span>
            </button>
          </div>

          {/* Map Legend Overlay (Bottom-Left) */}
          <div className="absolute bottom-4 left-4 z-30 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 text-[11px] space-y-1.5 shadow-xl text-white">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
              <span className="font-semibold text-slate-300">{t.map.yourPoint}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 shadow-[0_0_8px_#f43f5e]"></span>
              <span className="font-semibold text-slate-300">{t.map.selectedClinic}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-600"></span>
              <span className="font-semibold text-slate-300">{t.map.hospitals}</span>
            </div>
          </div>
        </div>

        {/* Selected Clinic & Route Navigation Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 p-5 flex flex-col justify-between bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            {/* Header Tabs: Marshrut (Directions) vs Klinika haqida */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('route')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'route'
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Route className="w-4 h-4 text-teal-600" />
                <span>{t.map.routeTitle || "Marshrut"}</span>
                {showRoute && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'details'
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Info className="w-4 h-4 text-teal-600" />
                <span>Klinika haqida</span>
              </button>
            </div>

            {/* TAB 1: REAL DIRECTIONS / MARSHRUT PANEL */}
            {activeTab === 'route' ? (
              <div className="space-y-3.5">
                {/* Route Header Info Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        {t.map.routeActive || "Faol Marshrut"}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {activeClinic.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {activeClinic.address}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-extrabold text-xs shrink-0">
                      {distance} km
                    </span>
                  </div>

                  {/* Mode Selector Tabs inside Directions */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setRouteMode('car')}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        routeMode === 'car'
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Car className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                      <div className="text-[11px] font-black">{carMins} daq</div>
                      <div className="text-[9px] text-slate-500">{t.map.byCar || "Avtomobil"}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRouteMode('walk')}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        routeMode === 'walk'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Footprints className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                      <div className="text-[11px] font-black">{walkMins} daq</div>
                      <div className="text-[9px] text-slate-500">{t.map.byWalk || "Piyoda"}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRouteMode('taxi')}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        routeMode === 'taxi'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Car className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                      <div className="text-[11px] font-black">{taxiMins} daq</div>
                      <div className="text-[9px] text-slate-500">Yandex Go</div>
                    </button>
                  </div>

                  {routeMode === 'taxi' && (
                    <div className="text-[11px] flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-semibold">
                      <span>{t.map.estFare || "Taxminiy yo'lkira"}:</span>
                      <span className="font-extrabold">{taxiFare}</span>
                    </div>
                  )}

                  {/* Real-time 10s Live Traffic & Clinic Queue Badges */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300">
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Yo'l holati:
                      </div>
                      <div className="font-bold truncate mt-0.5">
                        {liveMetrics?.trafficText || "Tirbandliksiz, yashil yo'lak"}
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-teal-800 dark:text-teal-300">
                      <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping"></span>
                        Tirik navbat (10s):
                      </div>
                      <div className="font-bold truncate mt-0.5">
                        {currentClinicQueue.queue} kishi (~{currentClinicQueue.waitMinutes} daq)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Navigation Instructions */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                    {t.map.routeSteps || "Harakatlanish bosqichlari:"}
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {t.map.stepStart || "Siz turgan nuqtadan yo'lga chiqing"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">150 metr to'g'ri harakatlaning</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {activeClinic.district} tomon asosiy shoh ko'chaga chiqing
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {Math.round(distance * 0.4 * 10) / 10} km davom eting
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {activeClinic.address.split(',')[0]} tomon buriling
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {Math.round(distance * 0.6 * 10) / 10} km to'g'ri yuring
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
                      <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        🏁
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-rose-900 dark:text-rose-200">
                          {activeClinic.name} binosiga yetib keldingiz
                        </p>
                        <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">
                          Avtoturargoh va asosiy kirish eshigi o'ng tomonda
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB 2: CLINIC DETAILS PANEL */
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

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

                {/* Name & Address */}
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
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="space-y-2 pt-4">
            {/* Direct External Navigation Links */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={yandexNavUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 text-center"
                title="Yandex Navigator orqali real marshrutni ochish"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Yandex Xarita</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              <a
                href={googleNavUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-1.5 text-center"
                title="Google Maps orqali real yo'nalish"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>

            {/* Booking & Call Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const doctorInClinic = initialDoctors.find(d => d.clinicId === activeClinic.id) || initialDoctors[0];
                  openBookingModal({
                    ...doctorInClinic,
                    clinicName: activeClinic.name
                  });
                }}
                className="py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.clinics.bookBtn}</span>
              </button>

              <a
                href={`tel:${activeClinic.phone.replace(/[^0-9+]/g, '')}`}
                className="py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                <span>{t.clinics.callBtn}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
