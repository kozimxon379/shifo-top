import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialClinics } from '../data/clinicsData';
import InteractiveMap from '../components/InteractiveMap';
import ClinicCard from '../components/ClinicCard';
import {
  Search,
  MapPin,
  Filter,
  ShieldCheck,
  PhoneCall,
  Navigation,
  Layers,
  ArrowUpDown,
  Building
} from 'lucide-react';

export default function ClinicsPage() {
  const { t } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [only247, setOnly247] = useState(false);
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'rating', 'name'
  const [selectedClinicForMap, setSelectedClinicForMap] = useState(null);

  const filteredClinics = initialClinics
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
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
          Davolash Muassasalari & Geomanzillar
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          {t.clinics.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.clinics.subtitle}
        </p>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.clinics.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              <option value="Kardiologiya">Kardiologiya</option>
              <option value="Nevrologiya">Nevrologiya</option>
              <option value="Xirurgiya">Xirurgiya</option>
              <option value="Travmatologiya">Travmatologiya</option>
              <option value="Terapiya">Terapiya</option>
              <option value="Pediatriya">Pediatriya</option>
              <option value="Stomatologiya">Stomatologiya</option>
            </select>

            {/* Region filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">{t.clinics.allRegions}</option>
              <option value="Toshkent shahri">Toshkent shahri</option>
              <option value="Samarqand viloyati">Samarqand viloyati</option>
            </select>

            {/* 24/7 toggle checkbox */}
            <label className="flex items-center gap-2 cursor-pointer font-bold px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={only247}
                onChange={(e) => setOnly247(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded-sm focus:ring-teal-500"
              />
              <span>Faqat 24/7 Shoshilinch</span>
            </label>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 font-semibold text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Saralash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
            >
              <option value="distance">Eng yaqin masofa bo'yicha</option>
              <option value="rating">Reytingi yuqorilar</option>
              <option value="name">Nomi (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-teal-600" />
          <span>Interaktiv Xarita (Haqiqiy shifoxonalar nuqtalari)</span>
        </div>
        <InteractiveMap selectedClinicId={selectedClinicForMap} />
      </div>

      {/* Clinics Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold">
            Topilgan klinikalar soni: <span className="text-teal-600 dark:text-teal-400 font-extrabold">{filteredClinics.length}</span> ta
          </span>
        </div>

        {filteredClinics.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Building className="w-12 h-12 text-slate-400 mx-auto" />
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
