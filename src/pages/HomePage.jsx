import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { initialClinics } from '../data/clinicsData';
import { initialDoctors } from '../data/doctorsData';
import { diseasesDirectory } from '../data/diseasesData';
import { consultMedicalAI } from '../data/aiMedicalBrain';
import InteractiveMap from '../components/InteractiveMap';
import DoctorCard from '../components/DoctorCard';
import ProductCard from '../components/ProductCard';
import ClinicCard from '../components/ClinicCard';
import {
  Search,
  MapPin,
  Stethoscope,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Building,
  Users,
  Award,
  Zap,
  Activity
} from 'lucide-react';

export default function HomePage() {
  const { t, products, openBookingModal } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [diagnosisModalResult, setDiagnosisModalResult] = useState(null);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const result = consultMedicalAI(searchQuery, t.lang || 'uz');
    setDiagnosisModalResult(result);
  };

  const handleQuickSymptomClick = (symptom) => {
    setSearchQuery(symptom);
    const result = consultMedicalAI(symptom, t.lang || 'uz');
    setDiagnosisModalResult(result);
  };

  const featuredDoctors = initialDoctors.slice(0, 3);
  const featuredProducts = products.slice(0, 4);
  const topClinics = initialClinics.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headings */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {t.hero.titleMain} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                {t.hero.findNearestClinic}
              </span>{" "}
              {t.hero.findSuffix}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t.hero.titleSub}
            </p>

            {/* PRIMARY DISEASE/SYMPTOM SEARCH BAR */}
            <form
              onSubmit={handleHeroSearch}
              className="relative max-w-2xl mx-auto pt-2"
            >
              <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-teal-500/10 border-2 border-teal-500/40 focus-within:border-teal-500 p-2 sm:p-2.5 transition-all">
                <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.hero.searchPlaceholder}
                  className="w-full bg-transparent border-none px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all hover:scale-102 flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.hero.searchBtn}</span>
                  <span className="sm:hidden">{t.common.search}</span>
                </button>
              </div>
            </form>

            {/* Quick Symptoms Chips */}
            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold block sm:inline mb-1 sm:mb-0 mr-2">
                {t.hero.quickSymptomsTitle}
              </span>
              <div className="inline-flex flex-wrap justify-center gap-1.5">
                {(t.hero.quickSymptoms || [
                  "Bosh og'rig'i",
                  "Gripp & Isitma",
                  "Gastrit",
                  "Yurak sanchishi",
                  "Tish og'rig'i",
                  "Bel og'rig'i",
                  "Qandli diabet"
                ]).map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => handleQuickSymptomClick(symptom)}
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-all text-[11px]"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4 Feature Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 sm:mt-16">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.hero.features.f1Title}</h4>
                <p className="text-[11px] text-slate-500">{t.hero.features.f1Desc}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.hero.features.f2Title}</h4>
                <p className="text-[11px] text-slate-500">{t.hero.features.f2Desc}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.hero.features.f3Title}</h4>
                <p className="text-[11px] text-slate-500">{t.hero.features.f3Desc}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.hero.features.f4Title}</h4>
                <p className="text-[11px] text-slate-500">{t.hero.features.f4Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK DIAGNOSIS RESULT POPUP MODAL (If user searched in Hero) */}
      {diagnosisModalResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-teal-200" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-teal-200">
                    {t.home.modal.headerBadge}
                  </span>
                  <h3 className="text-lg font-bold leading-tight">
                    {diagnosisModalResult.diseaseName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDiagnosisModalResult(null)}
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                {diagnosisModalResult.summary}
              </p>

              {/* 1. Kelib chiqish sabablari */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-2 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t.home.modal.causesTitle}</span>
                </h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 pl-4 list-disc">
                  {diagnosisModalResult.causes.map((cause, idx) => (
                    <li key={idx}>{cause}</li>
                  ))}
                </ul>
              </div>

              {/* 2. Tibbiy shifo yo'li */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 mb-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.home.modal.treatmentsTitle}</span>
                </h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 pl-4 list-disc">
                  {diagnosisModalResult.treatments.map((tr, idx) => (
                    <li key={idx}>{tr}</li>
                  ))}
                </ul>
              </div>

              {/* 3. Eng yaqin davolash punktlari */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-2 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-teal-600" />
                  <span>{t.home.modal.clinicsTitle}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {diagnosisModalResult.clinics.map((clinic) => (
                    <div
                      key={clinic.id}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{clinic.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{clinic.address}</div>
                        <div className="text-teal-600 dark:text-teal-400 font-bold mt-1 text-[11px]">
                          {clinic.distanceKm} km {t.map.distanceAway}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setDiagnosisModalResult(null);
                            openBookingModal(diagnosisModalResult.doctor);
                          }}
                          className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-center transition-colors"
                        >
                          {t.home.modal.bookBtn}
                        </button>
                        <a
                          href={`tel:${clinic.phone.replace(/[^0-9+]/g, '')}`}
                          className="px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                        >
                          {t.home.modal.callBtn}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
              <span className="text-[11px] text-slate-500">
                {t.home.modal.doctorSpecialist} <b>{diagnosisModalResult.doctorSpecialty}</b>
              </span>
              <button
                type="button"
                onClick={() => setDiagnosisModalResult(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white font-bold rounded-xl"
              >
                {t.home.modal.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE MAP PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
              {t.home.mapSection.badge}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {t.home.mapSection.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.home.mapSection.subtitle}
            </p>
          </div>

          <Link
            to="/clinics"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
          >
            <span>{t.home.mapSection.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <InteractiveMap />
      </section>

      {/* TOP RATED DOCTORS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
              {t.home.doctorsSection.badge}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {t.home.doctorsSection.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.home.doctorsSection.subtitle}
            </p>
          </div>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
          >
            <span>{t.home.doctorsSection.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </section>

      {/* ONLINE PHARMACY HIGHLIGHTS SECTION */}
      <section className="bg-slate-100/70 dark:bg-slate-900/40 py-16 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
                {t.home.storeSection.badge}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                {t.home.storeSection.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {t.home.storeSection.subtitle}
              </p>
            </div>

            <Link
              to="/store"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
            >
              <span>{t.home.storeSection.goToStore}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* EMERGENCY & TELEGRAM BOT CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-cyan-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,#14b8a6_0%,transparent_70%)] opacity-20 pointer-events-none"></div>

          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider">
              {t.home.telegramBanner.badge}
            </span>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {t.home.telegramBanner.title}
            </h3>

            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
              {t.home.telegramBanner.desc}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/doctors"
                className="px-6 py-3 bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-2xl text-xs shadow-lg transition-all hover:scale-102"
              >
                {t.home.telegramBanner.bookNow}
              </Link>
              <a
                href="tel:103"
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs shadow-lg transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t.home.telegramBanner.emergency}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* REAL STATS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400">
              80+
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t.home.statsCounters.c1Label}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              500+
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t.home.statsCounters.c2Label}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">
              45,000+
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t.home.statsCounters.c3Label}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="text-3xl sm:text-4xl font-black text-amber-500">
              99.2%
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t.home.statsCounters.c4Label}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
