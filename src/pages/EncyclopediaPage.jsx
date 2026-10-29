import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { diseasesDirectory } from '../data/diseasesData';
import { initialClinics } from '../data/clinicsData';
import { initialDoctors } from '../data/doctorsData';
import {
  Search,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Building2,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Microscope,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function EncyclopediaPage() {
  const { t, openBookingModal } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(diseasesDirectory[0].id);

  const categories = [
    { key: 'all', label: 'Barcha kasalliklar' },
    { key: 'Kardiologiya', label: 'Kardiologiya' },
    { key: 'Nevrologiya', label: 'Nevrologiya' },
    { key: 'Gastroenterologiya', label: 'Gastroenterologiya' },
    { key: 'Pulmonologiya', label: 'Pulmonologiya' },
    { key: 'Urologiya', label: 'Urologiya & Nefrologiya' },
    { key: 'Endokrinologiya', label: 'Endokrinologiya' },
    { key: 'Dermatologiya', label: 'Dermatologiya' },
    { key: 'Ortopediya', label: 'Ortopediya & Bo\'g\'im' },
    { key: 'Oftalmologiya', label: 'Oftalmologiya (Ko\'z)' },
    { key: 'LOR', label: 'LOR (Quloq, Burun, Tomoq)' },
    { key: 'Stomatologiya', label: 'Stomatologiya' },
    { key: 'Xirurgiya', label: 'Xirurgiya' },
    { key: 'Gematologiya', label: 'Gematologiya' },
    { key: 'Terapiya', label: 'Terapiya & Viruslar' }
  ];

  const filteredDiseases = diseasesDirectory.filter((d) => {
    const q = search.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(q) ||
      d.nameRu.toLowerCase().includes(q) ||
      d.nameEn.toLowerCase().includes(q) ||
      d.keywords.some(k => k.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === 'all' ||
      d.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(d.category.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Encyclopedia Visual Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-800 bg-slate-900 text-white min-h-[190px] flex items-center p-6 sm:p-8">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity">
          <img
            src="/images/medical_hero_team.jpg"
            alt="Tibbiy ensiklopediya"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80 z-0"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ilmiy Tibbiy Yo'riqnoma & Tashxis</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {t.encyclopedia.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.encyclopedia.subtitle} Kasallik sabablari, asosiy belgilari, birinchi yordam va tavsiya etilgan shifokorlar.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-medium text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10">
              <Microscope className="w-3 h-3 text-teal-400" />
              <span>Ilmiy tasdiqlangan</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10">
              <UserCheck className="w-3 h-3 text-teal-400" />
              <span>Mutaxassislar nazorati</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>Tezkor qabul yo'llanmasi</span>
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setSelectedCategory(cat.key)}
            className={`btn-spring px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-teal-600 text-white shadow-xs'
                : 'surface-card text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.encyclopedia.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 surface-card rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
        />
      </div>

      {/* Disease Cards Accordion List */}
      <div className="space-y-4">
        {filteredDiseases.map((item) => {
          const isExpanded = expandedId === item.id;
          const clinics = item.recommendedClinicIds
            .map(id => initialClinics.find(c => c.id === id))
            .filter(Boolean);
          const doctor = initialDoctors.find(d => d.id === item.recommendedDoctorId) || initialDoctors[0];

          return (
            <div
              key={item.id}
              className="surface-card rounded-2xl overflow-hidden transition-colors"
            >
              {/* Header Accordion Trigger */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {item.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.urgency}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Medical Content */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-5 text-xs animate-in slide-in-from-top-2">
                  {/* Grid for Causes & Symptoms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. Kelib chiqish sabablari */}
                    <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 space-y-2">
                      <h4 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>{t.encyclopedia.causesTitle}</span>
                      </h4>
                      <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                        Kasallik nega va nimalar sababli kelib chiqqan?
                      </p>
                      <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 pl-4 list-disc pt-1">
                        {item.causes.map((cause, idx) => (
                          <li key={idx} className="leading-relaxed">{cause}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 2. Asosiy alomatlar */}
                    <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/50 dark:border-sky-900/30 space-y-2">
                      <h4 className="font-bold text-sky-900 dark:text-sky-300 flex items-center gap-2 text-sm">
                        <Stethoscope className="w-4 h-4 text-sky-600" />
                        <span>{t.encyclopedia.symptomsTitle}</span>
                      </h4>
                      <p className="text-[11px] text-sky-800/80 dark:text-sky-300/80">
                        Bemor o'zida qanday belgilarni his qiladi?
                      </p>
                      <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 pl-4 list-disc pt-1">
                        {item.symptoms.map((sym, idx) => (
                          <li key={idx} className="leading-relaxed">{sym}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 3. Tibbiy shifo yo'li & Birinchi yordam */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 space-y-2">
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{t.encyclopedia.treatmentTitle}</span>
                    </h4>
                    <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                      Tibbiy shifo yo'li bilan davolash usullari:
                    </p>
                    <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 pl-4 list-disc pt-1">
                      {item.treatments.map((tr, idx) => (
                        <li key={idx} className="leading-relaxed">{tr}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 4. Tavsiya etilgan shifokor & Klinikalar */}
                  <div className="pt-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span>{t.encyclopedia.clinicRecommendations}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {clinics.map((clinic) => (
                        <div
                          key={clinic.id}
                          className="p-3 rounded-xl surface-card flex flex-col justify-between"
                        >
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{clinic.name}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{clinic.district} • {clinic.distanceKm} km</div>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openBookingModal(doctor)}
                              className="btn-spring flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-center"
                            >
                              {t.clinics.bookBtn}
                            </button>
                            <a
                              href={`tel:${clinic.phone.replace(/[^0-9+]/g, '')}`}
                              className="btn-spring px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-center font-medium"
                            >
                              {t.clinics.callBtn}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
