import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { initialClinics } from '../data/clinicsData';
import InteractiveMap from '../components/InteractiveMap';
import ClinicCard from '../components/ClinicCard';
import {
  Search,
  MapPin,
  Building2,
  PhoneCall,
  Navigation,
  ArrowUpDown,
  Star,
  ShieldCheck
} from 'lucide-react';

export default function ClinicsPage() {
  const { t, clinics } = useApp();
  const clinicsList = clinics && clinics.length > 0 ? clinics : initialClinics;

  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [only247, setOnly247] = useState(false);
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'rating', 'name'
  const [selectedClinicForMap, setSelectedClinicForMap] = useState(null);

  // Dynamic filter lists from clinics database
  const availableRegions = useMemo(() => {
    return Array.from(new Set(clinicsList.map(c => c.region))).filter(Boolean);
  }, [clinicsList]);

  const availableSpecialties = useMemo(() => {
    return Array.from(new Set(clinicsList.flatMap(c => c.departments))).filter(Boolean).sort();
  }, [clinicsList]);

  const filteredClinics = clinicsList
    .filter((clinic) => {
      const q = search.toLowerCase();
      const matchesSearch =
        clinic.name.toLowerCase().includes(q) ||
        clinic.address.toLowerCase().includes(q) ||
        clinic.district.toLowerCase().includes(q) ||
        clinic.departments.some(d => d.toLowerCase().includes(q));

      const matchesSpecialty =
        selectedSpecialty === 'all' || clinic.departments.includes(selectedSpecialty);

      const matchesRegion =
        selectedRegion === 'all' || clinic.region === selectedRegion;

      const matches247 = !only247 || clinic.emergency247;

      return matchesSearch && matchesSpecialty && matchesRegion && matches247;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleSelectOnMap = (clinic) => {
    setSelectedClinicForMap(clinic.id);
    const mapEl = document.getElementById('interactive-map-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Clinics Page Visual Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-800 bg-slate-900 text-white min-h-[190px] flex items-center p-6 sm:p-8">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity">
          <img
            src="/images/clinic_hospital.jpg"
            alt="Tibbiyot klinikalari"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80 z-0"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{clinicsList.length}+ Rasmiy Tibbiyot Maskani</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {t.clinics.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.clinics.subtitle} Toshkent va viloyatlar bo'yicha eng yaqin klinikalarni toping va navbatsiz qabulga yoziling.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-medium text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10">
              <PhoneCall className="w-3 h-3 text-rose-400" />
              <span>24/7 Shoshilinch Yordam</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10">
              <Navigation className="w-3 h-3 text-teal-400" />
              <span>Geomanzil & Marshrut</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>4.9 / 5 O'rtacha Reyting</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="surface-card p-4 sm:p-5 rounded-2xl space-y-4 text-xs">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.clinics.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Specialty filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">{t.clinics.allSpecialties}</option>
              {availableSpecialties.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            {/* Region filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">{t.clinics.allRegions}</option>
              {availableRegions.map((reg) => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>

            {/* 24/7 toggle checkbox */}
            <label className="flex items-center gap-2 cursor-pointer font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 select-none hover:border-teal-500 transition-colors">
              <input
                type="checkbox"
                checked={only247}
                onChange={(e) => setOnly247(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded-sm focus:ring-teal-500"
              />
              <span>{t.clinics.open247}</span>
            </label>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 font-medium text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{t.store.sortBy}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
            >
              <option value="distance">{t.clinics.distance}</option>
              <option value="rating">{t.store.sortOptions.rating}</option>
              <option value="name">{t.store.sortOptions.name}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div id="interactive-map-section">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Interaktiv Xarita (Shifoxonalar geomanzili)</span>
        </div>
        <InteractiveMap selectedClinicId={selectedClinicForMap} />
      </div>

      {/* Clinics Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold">
            Topilgan klinikalar soni: <span className="text-teal-600 dark:text-teal-400 font-bold">{filteredClinics.length}</span> ta
          </span>
        </div>

        {filteredClinics.length === 0 ? (
          <div className="text-center py-12 surface-card rounded-2xl p-8 space-y-3">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Mos klinika topilmadi
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Qidiruv so'zini yoki filtrlarni o'zgartirib ko'ring.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClinics.map((clinic) => (
              <ClinicCard
                key={clinic.id}
                clinic={clinic}
                onSelectOnMap={handleSelectOnMap}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
