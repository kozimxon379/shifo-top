import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialDoctors } from '../data/doctorsData';
import DoctorCard from '../components/DoctorCard';
import { Search, Stethoscope, ArrowUpDown, UserCheck, Star, ShieldCheck, CreditCard } from 'lucide-react';

export default function DoctorsPage() {
  const { t, doctors } = useApp();
  const doctorsList = doctors && doctors.length > 0 ? doctors : initialDoctors;

  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [minExp, setMinExp] = useState(0);
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'exp', 'priceAsc', 'priceDesc'

  const specialtiesList = [
    { key: 'all', label: t?.doctors?.specialties?.all || 'Barcha shifokorlar' },
    { key: 'cardiologist', label: t?.doctors?.specialties?.cardiologist || 'Kardiolog' },
    { key: 'neurologist', label: t?.doctors?.specialties?.neurologist || 'Nevropatolog' },
    { key: 'gastroenterologist', label: 'Gastroenterolog' },
    { key: 'pulmonologist', label: 'Pulmonolog' },
    { key: 'urologist', label: 'Urolog' },
    { key: 'therapist', label: t?.doctors?.specialties?.therapist || 'Terapevt' },
    { key: 'ophthalmologist', label: 'Oftalmolog' },
    { key: 'ent', label: 'LOR' },
    { key: 'dermatologist', label: 'Dermatolog' },
    { key: 'orthopedist', label: 'Ortoped' },
    { key: 'surgeon', label: t?.doctors?.specialties?.surgeon || 'Xirurg' },
    { key: 'dentist', label: t?.doctors?.specialties?.dentist || 'Stomatolog' },
    { key: 'endocrinologist', label: t?.doctors?.specialties?.endocrinologist || 'Endokrinolog' },
    { key: 'pediatrician', label: t?.doctors?.specialties?.pediatrician || 'Pediatr' },
    { key: 'gynecologist', label: 'Ginekolog' },
    { key: 'allergist', label: 'Allergolog' }
  ];

  const getSpecialtyCount = (key) => {
    if (key === 'all') return doctorsList.length;
    return doctorsList.filter(
      (d) => d.specialtyKey === key || d.specialty.toLowerCase().includes(key.toLowerCase())
    ).length;
  };

  const filteredDoctors = doctorsList
    .filter((doc) => {
      const q = search.toLowerCase();
      const matchesSearch =
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.clinicName.toLowerCase().includes(q) ||
        doc.bio.toLowerCase().includes(q);

      const matchesSpecialty =
        selectedSpecialty === 'all' ||
        doc.specialtyKey === selectedSpecialty ||
        doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());

      const matchesExp = doc.experienceYears >= minExp;

      return matchesSearch && matchesSpecialty && matchesExp;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'exp') return b.experienceYears - a.experienceYears;
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Doctors Page Visual Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-800 bg-slate-900 text-white min-h-[190px] flex items-center p-6 sm:p-8">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity">
          <img
            src="/images/medical_hero_team.jpg"
            alt="Shifokorlar jamoasi"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80 z-0"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>{doctorsList.length}+ Oliy toifali shifokorlar</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {t.doctors.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.doctors.subtitle} O'zingizga qulay vaqtni tanlang va navbatsiz qabulga yoziling.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-medium text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>4.9 / 5 Baholash</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>Tasdiqlangan diplomlar</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10">
              <CreditCard className="w-3 h-3 text-teal-400" />
              <span>Click & Payme to'lovi</span>
            </span>
          </div>
        </div>
      </div>

      {/* Specialty Filter Buttons Row with Live Counts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {specialtiesList.map((sp) => {
          const count = getSpecialtyCount(sp.key);
          return (
            <button
              key={sp.key}
              type="button"
              onClick={() => setSelectedSpecialty(sp.key)}
              className={`btn-spring px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedSpecialty === sp.key
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'surface-card text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span>{sp.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedSpecialty === sp.key
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Secondary Filter Toolbar */}
      <div className="surface-card p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.doctors.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Sort & Experience filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Tajriba:</span>
            <select
              value={minExp}
              onChange={(e) => setMinExp(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
            >
              <option value={0}>Barcha tajriba</option>
              <option value={10}>10+ yil tajriba</option>
              <option value={15}>15+ yil tajriba</option>
              <option value={20}>20+ yil tajriba</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
            >
              <option value="rating">{t.store.sortOptions.rating}</option>
              <option value="exp">{t.doctors.exp}</option>
              <option value="priceAsc">{t.store.sortOptions.priceAsc}</option>
              <option value="priceDesc">{t.store.sortOptions.priceDesc}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="space-y-4">
        <div className="text-xs text-slate-500">
          Malakali shifokorlar soni: <span className="text-teal-600 dark:text-teal-400 font-bold">{filteredDoctors.length}</span> ta
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12 surface-card rounded-2xl p-8 space-y-3">
            <UserCheck className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Shifokor topilmadi
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Boshqa mutaxassislik yoki qidiruv so'zini tanlab ko'ring.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
