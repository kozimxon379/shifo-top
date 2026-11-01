import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
import AnimatedCounter from '../components/AnimatedCounter';
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
  AlertCircle,
  Building2,
  Award,
  Zap,
  Activity,
  ChevronDown,
  ChevronUp,
  Scale,
  Droplet,
  BookOpen,
  Star,
  HelpCircle,
  Send,
  Smartphone,
  BadgeCheck,
  Brain,
  Thermometer,
  Bone,
  Baby,
  Eye,
  Quote,
  UserCheck,
  CalendarCheck,
  Pill,
  ShieldAlert
} from 'lucide-react';

export default function HomePage() {
  const {
    t,
    lang,
    products,
    doctors,
    clinics,
    reviews,
    openBookingModal,
    openReviewModal,
    liveMetrics,
    addToast
  } = useApp();
  const navigate = useNavigate();

  // Search & Diagnosis state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [diagnosisModalResult, setDiagnosisModalResult] = useState(null);



  // Live query evaluation for instant feedback
  const liveSearchResult = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return null;
    return consultMedicalAI(searchQuery.trim(), lang || 'uz');
  }, [searchQuery, lang]);

  // How it works active step
  const [activeStep, setActiveStep] = useState(0);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // BMI Interactive Calculator state
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState('male');

  // Newsletter subscribe state
  const [subscriberContact, setSubscriberContact] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Selected clinic category filter on homepage
  const [clinicFilter, setClinicFilter] = useState('all');

  // Hero Omnibar Search Tabs (All, Doctors, Clinics, Pharmacy, AI)
  const [heroSearchTab, setHeroSearchTab] = useState('all');

  const getSearchPlaceholder = () => {
    switch (heroSearchTab) {
      case 'doctors':
        return "Shifokor ismi yoki mutaxassisligini qidiring (masalan: Kardiolog)...";
      case 'clinics':
        return "Klinika nomi yoki yo'nalishini kiriting (masalan: Shox Med)...";
      case 'store':
        return "Dori vositasi yoki vitamin nomini kiriting (masalan: Paratsetamol)...";
      case 'ai':
        return "Sizni nima bezovta qilyapti? (masalan: bosh og'rig'i va holsizlik)...";
      default:
        return t.hero.searchPlaceholder || "Kasallik, alomat, shifokor yoki klinika nomini yozing...";
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchFocused(false);

    if (heroSearchTab === 'doctors') {
      navigate('/doctors?q=' + encodeURIComponent(searchQuery.trim()));
      return;
    }
    if (heroSearchTab === 'clinics') {
      navigate('/clinics?q=' + encodeURIComponent(searchQuery.trim()));
      return;
    }
    if (heroSearchTab === 'store') {
      navigate('/store?q=' + encodeURIComponent(searchQuery.trim()));
      return;
    }

    const result = consultMedicalAI(searchQuery.trim(), lang || 'uz');
    setDiagnosisModalResult(result);
  };

  const handleQuickSymptomClick = (symptom) => {
    setSearchQuery(symptom);
    setIsSearchFocused(false);
    const result = consultMedicalAI(symptom, lang || 'uz');
    setDiagnosisModalResult(result);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!subscriberContact.trim()) return;
    setIsSubscribed(true);
    if (addToast) {
      addToast(
        "Muvaffaqiyatli a'zo bo'lindi!",
        `${subscriberContact} manziliga foydali salomatlik tavsiyalari yuboriladi.`,
        'success'
      );
    }
  };

  // BMI calculation logic
  const bmiData = useMemo(() => {
    const hMeters = heightCm / 100;
    if (hMeters <= 0) return { bmi: 0, category: 'Noma\'lum', color: 'text-slate-500', barPercent: 0 };
    const bmiVal = parseFloat((weightKg / (hMeters * hMeters)).toFixed(1));

    let category = "Normal, me'yordagi vazn";
    let color = "text-emerald-600 dark:text-emerald-400";
    let barPercent = Math.min(Math.max(((bmiVal - 15) / (35 - 15)) * 100, 5), 100);
    let advice = "Sizning tana vazningiz sog'lom me'yorda. To'g'ri ovqatlanish va haftasiga 3 marta jismoniy faollikni davom ettiring.";

    if (bmiVal < 18.5) {
      category = "Vazn yetishmovchiligi (Kam vazn)";
      color = "text-sky-600 dark:text-sky-400";
      advice = "Kalloriyali, oqsilga boy oziq-ovqatlarni ko'paytirish va terapevt yoki gastroenterolog bilan maslahatlashish tavsiya etiladi.";
    } else if (bmiVal >= 25 && bmiVal < 30) {
      category = "Ortiqcha vazn (Birinchi daraja)";
      color = "text-amber-600 dark:text-amber-400";
      advice = "Qand va xamirli taomlarni kamaytirish, kuniga kamida 8,000 qadam piyoda yurish va parhezshunos bilan ratsion tuzish tavsiya qilinadi.";
    } else if (bmiVal >= 30) {
      category = "Semizlik (Shifokor nazorati zarur)";
      color = "text-rose-600 dark:text-rose-400";
      advice = "Endokrinolog va kardiolog tekshiruvidan o'tish, qondagi glyukoza va xolesterin miqdorini tahlil qilish tavsiya etiladi.";
    }

    const minIdeal = Math.round(18.5 * hMeters * hMeters);
    const maxIdeal = Math.round(24.9 * hMeters * hMeters);
    const dailyWaterLiters = (weightKg * 0.033).toFixed(1);

    return {
      bmi: bmiVal,
      category,
      color,
      barPercent,
      advice,
      idealMin: minIdeal,
      idealMax: maxIdeal,
      waterLiters: dailyWaterLiters
    };
  }, [heightCm, weightKg]);

  const liveDoctors = doctors && doctors.length > 0 ? doctors : initialDoctors;
  const liveClinics = clinics && clinics.length > 0 ? clinics : initialClinics;
  const featuredDoctors = liveDoctors.slice(0, 3);
  const featuredProducts = products.slice(0, 4);
  const topClinics = useMemo(() => {
    if (clinicFilter === 'emergency') {
      return liveClinics.filter(c => c.emergency247).slice(0, 3);
    }
    return liveClinics.slice(0, 3);
  }, [clinicFilter, liveClinics]);

  // Medical Specialties Directory with Professional Icons
  const medicalSpecialties = [
    {
      id: 'kardiologiya',
      name: "Kardiologiya",
      desc: "Yurak, qon bosimi va tomir kasalliklari diagnostikasi",
      icon: HeartPulse,
      doctorsCount: 42,
      specialtyQuery: "Kardiolog",
      badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      accentBorder: "hover:border-rose-500/50"
    },
    {
      id: 'nevrologiya',
      name: "Nevrologiya",
      desc: "Bosh og'rig'i, migren, asab tizimi va umurtqa pog'onasi",
      icon: Brain,
      doctorsCount: 38,
      specialtyQuery: "Nevropatolog",
      badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      accentBorder: "hover:border-indigo-500/50"
    },
    {
      id: 'terapiya',
      name: "Terapiya & Umumiy amaliyot",
      desc: "Shamollash, gripp, ichki a'zolar va birlamchi konsultatsiya",
      icon: Stethoscope,
      doctorsCount: 65,
      specialtyQuery: "Terapevt",
      badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      accentBorder: "hover:border-teal-500/50"
    },
    {
      id: 'pediatriya',
      name: "Pediatriya",
      desc: "Go'daklar va bolalar salomatligi, emlash va rivojlanish",
      icon: Baby,
      doctorsCount: 29,
      specialtyQuery: "Pediatr",
      badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      accentBorder: "hover:border-sky-500/50"
    },
    {
      id: 'stomatologiya',
      name: "Stomatologiya",
      desc: "Tish davolash, implantatsiya, karies va estetik restavratsiya",
      icon: Sparkles,
      doctorsCount: 51,
      specialtyQuery: "Stomatolog",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      accentBorder: "hover:border-emerald-500/50"
    },
    {
      id: 'travmatologiya',
      name: "Travmatologiya & Ortopediya",
      desc: "Suyak sinishi, bo'g'im og'riqlari, artroz va reabilitatsiya",
      icon: Bone,
      doctorsCount: 24,
      specialtyQuery: "Travmatolog",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      accentBorder: "hover:border-amber-500/50"
    },
    {
      id: 'gastroenterologiya',
      name: "Gastroenterologiya",
      desc: "Oshqozon-ichak trakti, jigar, o't qopi va gastrit muolajasi",
      icon: Activity,
      doctorsCount: 31,
      specialtyQuery: "Gastroenterolog",
      badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      accentBorder: "hover:border-orange-500/50"
    },
    {
      id: 'oftalmologiya',
      name: "Oftalmologiya",
      desc: "Ko'rish qobiliyatini tekshirish, katarakta, lazer korreksiya",
      icon: Eye,
      doctorsCount: 22,
      specialtyQuery: "Oftalmolog",
      badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      accentBorder: "hover:border-cyan-500/50"
    }
  ];

  // How it works steps data with Lucide Icons
  const stepsData = [
    {
      step: 1,
      stepNumber: "01",
      title: "Alomat yoki kasallikni yozing",
      desc: "Qidiruv maydoniga og'riq yoki alomatni kiriting. Shifo AI soniyalar ichida sabablarini tahlil qilib, kerakli mutaxassisni tavsiya qiladi.",
      icon: Search,
      actionText: "Alomatni qidirish",
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    {
      step: 2,
      stepNumber: "02",
      title: "Eng yaqin klinika yoki shifokorni tanlang",
      desc: "Interaktiv xaritada o'zingizga eng yaqin tibbiyot markazi, shifokor tajribasi, qabul narxi va bemorlar baholarini taqqoslang.",
      icon: MapPin,
      actionText: "Xaritani ko'rish",
      action: () => {
        const el = document.getElementById('map-preview-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      step: 3,
      stepNumber: "03",
      title: "1 bosishda navbatsiz qabulga yoziling",
      desc: "Sizga mos sana va vaqtni tanlang. Telefon raqamingizni kiriting — navbatingiz bir zumda tasdiqlanadi va klinika tizimiga kiritiladi.",
      icon: CalendarCheck,
      actionText: "Shifokorlarni ko'rish",
      action: () => navigate('/doctors')
    },
    {
      step: 4,
      stepNumber: "04",
      title: "Telegram xabarnoma va yo'llanma",
      desc: "Uchrashuv vaqti, klinika manzili va eslatmalar to'g'ridan-to'g'ri Telegramingizga keladi. Qabulga kechikmaysiz va navbat kutmaysiz.",
      icon: Smartphone,
      actionText: "Dorixonaga o'tish",
      action: () => navigate('/store')
    }
  ];

  // Quick symptoms with proper icons and individual color accents
  const quickSymptoms = [
    { label: "Bosh og'rig'i", icon: Brain, badgeColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60" },
    { label: "Gripp & Isitma", icon: Thermometer, badgeColor: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60" },
    { label: "Yurak sanchishi", icon: HeartPulse, badgeColor: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60" },
    { label: "Tish og'rig'i", icon: Sparkles, badgeColor: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60" },
    { label: "Bel & Bo'g'im", icon: Bone, badgeColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60" },
    { label: "Qandli diabet", icon: Droplet, badgeColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60" },
    { label: "Gastrit", icon: Activity, badgeColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60" }
  ];

  // FAQ list
  const faqList = [
    {
      q: "Shifo.top orqali shifokor qabuliga yozilish bepulmi?",
      a: "Ha, bizning platforma orqali navbatsiz shifokor ko'rigiga yozilish mutlaqo bepul. Siz faqatgina klinikaga borganingizda shifokorning rasmiy narxnomasidagi ko'rik to'lovini amalga oshirasiz (yoki joyida kartadan to'laysiz)."
    },
    {
      q: "Tez tibbiy yordam (103) chaqiruvi qanday amalga oshiriladi?",
      a: "Favqulodda hayotiy xavf tug'ilganda saytning yuqori qismidagi yoki favqulodda bo'limidagi '103' qizil tugmasini bosing. Siz to'g'ridan-to'g'ri Respublika Shoshilinch Yordam dispetcheriga ulanasiz. Shuningdek, xaritada 24/7 ishlaydigan eng yaqin shoshilinch statsionar shifoxonalarni ko'rishingiz mumkin."
    },
    {
      q: "Telegram bot orqali qanday xabarlar keladi?",
      a: "Qabulga yozilganingizda Telegram bot sizga uchrashuv talonini, shifokor kabinet raqamini, klinikaning aniq xarita lokatsiyasini va qabuldan 2 soat oldin eslatmani yuboradi. Agar dorixonadan buyurtma bersangiz, yetkazib berish holati ham botda ko'rsatiladi."
    },
    {
      q: "Dorixonadagi dori vositalari qancha vaqtda yetkaziladi?",
      a: "Toshkent shahri bo'ylab shoshilinch kuryerlik yetkazib berish 45 daqiqadan 90 daqiqagacha amalga oshiriladi. Viloyat markazlariga esa 24 soat ichida yetkaziladi. Barcha dori vositalari O'zbekiston Respublikasi Farmatsevtika agentligi tomonidan sertifikatlangan."
    },
    {
      q: "Qabul vaqtini bekor qilish yoki o'zgartirish mumkinmi?",
      a: "Albatta. Qabul vaqtini o'zgartirish uchun profil sahifangizdan yoki Telegram botingizga kelgan tasdiq xabari orqali istalgan payt 'Bekor qilish' yoki 'Vaqtni ko'chirish' tugmasini bosishingiz mumkin. Bu boshqa bemorlarga qulay vaqtni ochib beradi."
    },
    {
      q: "Platformada faqat xususiy klinikalar bormi yoki davlat shifoxonalari ham kiritilganmi?",
      a: "Platformamizda Toshkent va barcha viloyatlardagi eng yirik ko'p tarmoqli davlat shifoxonalari (16-shoshilinch markazi, Respublika Kardiologiya, Neyroxirurgiya ilmiy markazlari) hamda nufuzli litsenziyalangan xususiy tibbiyot maskanlari to'liq qamrab olingan."
    }
  ];

  // Featured Knowledge Articles
  const featuredDiseases = diseasesDirectory.slice(0, 3);

  // Patient Reviews Data
  const patientReviews = [
    {
      id: 1,
      name: "Dilshod Rahimov",
      location: "Toshkent shahri, Chilonzor",
      doctorVisited: "Dr. Alisher Karimov (Kardiolog)",
      clinic: "Respublika Kardiologiya Markazi",
      rating: 5,
      date: "Kecha, 16:40",
      review: "Yurak sohasidagi og'riq tufayli Shifo.top orqali navbatsiz qabulga yozildim. Telegram orqali lokatsiya va talon bir zumda keldi. Shifokor juda e'tiborli ekan, darhol EKG va tahlillar o'tkazildi. Rahmat!",
      verified: true
    },
    {
      id: 2,
      name: "Madina Karimova",
      location: "Samarqand viloyati",
      doctorVisited: "Dr. Nilufar Qosimova (Nevrolog)",
      clinic: "Akfa Medline",
      rating: 5,
      date: "3 kun oldin",
      review: "Surunkali migren qiynab kelardi. AI maslahatchi orqali sabablarini bilib, dr. Nilufar qabuliga yozildim. Kerakli dori vositalarini shu yerdagi dorixonadan chegirma bilan buyurtma qildim, kuryer tezda yetkazib berdi.",
      verified: true
    },
    {
      id: 3,
      name: "Jasur Bekmirzayev",
      location: "Toshkent shahri, Mirzo Ulug'bek",
      doctorVisited: "Dr. Jamshid Rustamov (Terapevt)",
      clinic: "Shox Med Center",
      rating: 5,
      date: "5 kun oldin",
      review: "Kechqurun o'tkir shamollash va yuqori harorat bilan qoldim. 24/7 navbatchi klinikani xaritadan 5 daqiqada topdik va eng qisqa yo'l bilan yetib bordik. Tizim hayotni ancha osonlashtirgan!",
      verified: true
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-14 medical-hero-mesh border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headlines, Search & Quick Chips */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Clinical Verification Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-verified text-xs font-semibold shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600 shadow-xs shadow-teal-500"></span>
                </span>
                <span className="tracking-wide">{t.hero.badge || "24/7 Shoshilinch & Malakali Tibbiyot"}</span>
                <span className="text-teal-300 dark:text-teal-700">|</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-bold hidden sm:inline">Jonli Portal</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                {t.hero.titleMain}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 dark:from-teal-400 dark:via-teal-300 dark:to-emerald-300">
                  {t.hero.findNearestClinic}
                </span>{" "}
                {t.hero.findSuffix}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Navbatsiz qabul, O'zbekistonning eng tajribali shifokorlari va 24/7 bepul sun'iy intellekt tibbiy maslahatchisi bir joyda.
              </p>

              {/* PRIMARY SEARCH CONSOLE (Omnibar with Segmented Mode Tabs) */}
              <div className="space-y-2 max-w-xl">
                {/* Fast Mode Segmented Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {[
                    { id: 'all', label: "Barchasi", icon: Sparkles },
                    { id: 'doctors', label: "Shifokorlar", icon: Stethoscope },
                    { id: 'clinics', label: "Klinikalar", icon: Building2 },
                    { id: 'store', label: "Dorixona", icon: Pill },
                    { id: 'ai', label: "AI Maslahat", icon: Activity }
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isSelected = heroSearchTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setHeroSearchTab(tab.id)}
                        className={`btn-spring inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 text-white shadow-xs shadow-teal-600/30 ring-1 ring-teal-500'
                            : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800'
                        }`}
                      >
                        <TabIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-teal-600 dark:text-teal-400'}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <form
                  onSubmit={handleHeroSearch}
                  className="relative pt-0.5"
                >
                  <div className="omnibar-shell rounded-2xl p-2 sm:p-2.5 flex items-center gap-2">
                    <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 ml-2.5 shrink-0" />
                    
                    {/* Location Badge */}
                    <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                      <MapPin className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>Toshkent</span>
                    </div>

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                      placeholder={getSearchPlaceholder()}
                      className="w-full bg-transparent border-none px-2 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                    />

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1.5 py-1 cursor-pointer"
                        title="Tozalash"
                      >
                        ✕
                      </button>
                    )}

                    <button
                      type="submit"
                      className="btn-spring btn-shimmer shrink-0 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-semibold px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span className="hidden sm:inline">{t.hero.searchBtn}</span>
                      <span className="sm:hidden">{t.common.search}</span>
                    </button>
                  </div>

                  {/* LIVE SEARCH HINT / 'UNAQA KASALLIK YO'Q' DROPDOWN */}
                  {isSearchFocused && liveSearchResult && (
                    <div className="absolute left-0 right-0 top-full mt-2 z-50 animate-in fade-in slide-in-from-top-2">
                      {!liveSearchResult.matched ? (
                        /* Not Found State */
                        <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900/80 rounded-2xl shadow-2xl p-3.5 sm:p-4 text-left">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                              <AlertCircle className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                                  Unaqa kasallik yo'q
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                                  Mavjud emas
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                «<span className="font-semibold text-slate-900 dark:text-white">{searchQuery}</span>» nomli kasallik topilmadi. Haqiqiy kasallik yoki alomat nomini kiriting.
                              </p>
                              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                                  Mavjud haqiqiy kasalliklardan tanlang:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {(liveSearchResult.suggestedDiseases || []).slice(0, 6).map((item) => (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        setSearchQuery(item.name);
                                        const res = consultMedicalAI(item.name, lang || 'uz');
                                        setDiagnosisModalResult(res);
                                        setIsSearchFocused(false);
                                      }}
                                      className="text-[11px] px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-slate-700 hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                                    >
                                      {item.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Matched Condition Found */
                        <div className="bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-800/80 rounded-2xl shadow-2xl p-2 sm:p-2.5 text-left">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setDiagnosisModalResult(liveSearchResult);
                              setIsSearchFocused(false);
                            }}
                            className="w-full flex items-center justify-between text-left p-2 rounded-xl hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                                <Activity className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {liveSearchResult.diseaseName}
                                </div>
                                <div className="text-[10px] text-teal-600 dark:text-teal-400 truncate">
                                  {liveSearchResult.category} • Tashxis, sabablar va davolash punktlari
                                </div>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 shrink-0 ml-2">
                              Ko'rish →
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </div>

              {/* Quick Symptoms Chips with Colored Badges */}
              <div className="pt-1 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    Tezkor alomatlar:
                  </span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200/50 dark:border-teal-800/50">
                    1 bosishda tashxis
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickSymptoms.map((s) => {
                    const SymptomIcon = s.icon;
                    return (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => handleQuickSymptomClick(s.label)}
                        className="btn-spring inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all text-xs cursor-pointer shadow-xs hover:shadow-sm"
                      >
                        <span className={`p-1 rounded-lg ${s.badgeColor || 'bg-teal-50 text-teal-600'}`}>
                          <SymptomIcon className="w-3 h-3" />
                        </span>
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trust Indicators Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9 / 5</span>
                  <span className="text-slate-400 font-normal">(12,400+ fikr)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Tezkor elektron navbat</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>100% SSV Litsenziyasi</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase Photo with Ambient Glow & Floating Widgets */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Ambient Soft Mesh Glow */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-teal-500/25 via-emerald-500/20 to-sky-500/20 rounded-3xl blur-2xl -z-10 pointer-events-none" />

                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-2xl bg-slate-900 group">
                  <img
                    src="/images/uzbek_medical_hero.jpg"
                    alt="Shifo.top professional shifokorlar jamoasi"
                    className="w-full h-[380px] sm:h-[460px] object-cover object-top dark:brightness-95 transition-transform duration-500 group-hover:scale-102"
                  />
                  {/* Seamless ambient gradients to blend with page theme */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-transparent pointer-events-none hidden lg:block" />

                  {/* Floating live card top-left with smooth slow float */}
                  <div className="absolute top-4 left-4 p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/40 dark:border-slate-700/60 shadow-xl animate-float-slow">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        150+ Shifoxonalar
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">• 24/7 Ochiq</span>
                    </div>
                  </div>

                  {/* Floating live card top-right with delayed float */}
                  <div className="absolute top-4 right-4 px-3 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/40 dark:border-slate-700/60 shadow-xl animate-float-delayed">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-slate-900 dark:text-white font-black text-sm">4.9</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] font-normal">/ 5.0 (12k+)</span>
                    </div>
                  </div>

                  {/* Bottom overlay doctor showcase info card */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/40 dark:border-slate-700/60 shadow-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-600/30">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          500+ Malakali vrachlar
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          <span>Kardiolog, Pediatr, Nevrolog & Terapiya</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate('/doctors')}
                      className="btn-spring btn-shimmer shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-teal-600/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Yozilish</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Feature Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 sm:mt-16">
            <div className="interactive-card surface-card p-4 rounded-2xl flex items-center gap-3.5 border border-slate-200/80 dark:border-slate-800/80 hover:border-teal-500/50 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  150+ Shifoxonalar
                </h4>
                <p className="text-[11px] text-slate-500 truncate">Eng yaqin markazlar</p>
              </div>
            </div>

            <div className="interactive-card surface-card p-4 rounded-2xl flex items-center gap-3.5 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  500+ Malakali vrachlar
                </h4>
                <p className="text-[11px] text-slate-500 truncate">Oliy toifali vrachlar</p>
              </div>
            </div>

            <div className="interactive-card surface-card p-4 rounded-2xl flex items-center gap-3.5 border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-500/50 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  24/7 AI Maslahatchi
                </h4>
                <p className="text-[11px] text-slate-500 truncate">Tezkor bepul tahlil</p>
              </div>
            </div>

            <div className="interactive-card surface-card p-4 rounded-2xl flex items-center gap-3.5 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/50 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  1 daqiqada yozilish
                </h4>
                <p className="text-[11px] text-slate-500 truncate">Navbatsiz qabul</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK DIAGNOSIS RESULT POPUP MODAL (If user searched in Hero) */}
      {diagnosisModalResult && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] !m-0 !p-4 w-screen h-screen flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setDiagnosisModalResult(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    diagnosisModalResult.matched ? 'bg-teal-600' : 'bg-rose-600'
                  }`}
                >
                  {diagnosisModalResult.matched ? (
                    <Activity className="w-5 h-5 text-white" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {diagnosisModalResult.matched ? (
                      <>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-teal-400">
                          {t.home.modal.headerBadge}
                        </span>
                        {diagnosisModalResult.category && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {diagnosisModalResult.category}
                          </span>
                        )}
                        {diagnosisModalResult.urgency && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                            {diagnosisModalResult.urgency}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                          Unaqa kasallik yo'q
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          Qidiruv natijasi
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-bold leading-tight mt-0.5">
                    {diagnosisModalResult.diseaseName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDiagnosisModalResult(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            {!diagnosisModalResult.matched ? (
              /* Dedicated 'Unaqa kasallik yo'q' View */
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                {/* Warning Card */}
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">
                      Unaqa kasallik yo'q yoki noto'g'ri so'z kiritildi
                    </h4>
                    <p className="text-rose-700 dark:text-rose-300 mt-1 leading-relaxed text-xs">
                      {diagnosisModalResult.summary}
                    </p>
                  </div>
                </div>

                {/* Suggestions Grid */}
                {diagnosisModalResult.suggestedDiseases && diagnosisModalResult.suggestedDiseases.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3 text-xs">
                      <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Haqiqiy tibbiy kasalliklar ro'yxatidan birini tanlang:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {diagnosisModalResult.suggestedDiseases.map((sd) => (
                        <button
                          key={sd.id}
                          type="button"
                          onClick={() => {
                            const res = consultMedicalAI(sd.name, lang || 'uz');
                            setDiagnosisModalResult(res);
                          }}
                          className="p-2.5 text-left rounded-xl bg-white dark:bg-slate-800 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                              {sd.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {sd.category}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Link to Medical Encyclopedia */}
                <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">
                        Tibbiy ensiklopediya
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        Barcha tasdiqlangan klinik kasalliklar va davolash qo'llanmalari
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDiagnosisModalResult(null);
                      navigate('/encyclopedia');
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Ensiklopediyaga o'tish →
                  </button>
                </div>
              </div>
            ) : (
              /* Rich Clinical Matched Disease View */
              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                  {diagnosisModalResult.summary}
                </p>

                {/* Clickable suggested alternative diseases */}
                {diagnosisModalResult.suggestedDiseases && diagnosisModalResult.suggestedDiseases.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                    <h4 className="font-bold text-teal-900 dark:text-teal-300 flex items-center gap-1.5 mb-2 text-xs">
                      <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>O'xshash yoki bog'liq boshqa kasalliklar:</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {diagnosisModalResult.suggestedDiseases.map((sd) => (
                        <button
                          key={sd.id}
                          type="button"
                          onClick={() => {
                            const res = consultMedicalAI(sd.name, lang || 'uz');
                            setDiagnosisModalResult(res);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700 hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                        >
                          {sd.name} →
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
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

                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
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

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-2 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <span>{t.home.modal.clinicsTitle}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {diagnosisModalResult.clinics.map((clinic) => (
                      <div
                        key={clinic.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex flex-col justify-between"
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
                            className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-center transition-colors cursor-pointer"
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
            )}

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
              {diagnosisModalResult.matched ? (
                <span className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                  {t.home.modal.doctorSpecialist} <strong className="text-teal-600 dark:text-teal-400 font-bold ml-1">{diagnosisModalResult.doctorSpecialty}</strong>
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-medium">
                  Shifo.top tibbiy bazasida 1,500+ tasdiqlangan klinik ma'lumotlar mavjud
                </span>
              )}
              <button
                type="button"
                onClick={() => setDiagnosisModalResult(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs shadow-xs"
              >
                {diagnosisModalResult.matched ? t.home.modal.closeBtn : "Tushundim, yopish"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 2. MEDICAL SPECIALTIES & DEPARTMENTS EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4" />
              <span>Tibbiy Ixtisosliklar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Barcha yo'nalishlar bo'yicha yetakchi mutaxassislar
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kerakli sohani tanlang va Toshkentdagi eng tajribali shifokorlar qabuliga yoziling
            </p>
          </div>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors shrink-0"
          >
            <span>Barcha shifokorlar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {medicalSpecialties.map((spec) => {
            const IconComponent = spec.icon;
            return (
              <div
                key={spec.id}
                onClick={() => navigate('/doctors')}
                className={`surface-specular rounded-3xl p-5 cursor-pointer flex flex-col justify-between interactive-card group border border-slate-200/80 dark:border-slate-800/80 ${spec.accentBorder || 'hover:border-teal-500/50'} shadow-xs hover:shadow-xl transition-all duration-300`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${spec.badgeColor || 'bg-teal-500/10 text-teal-600'} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                      {spec.doctorsCount}+ shifokor
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {spec.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>Mutaxassislar ko'rigi</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. STEP-BY-STEP PATIENT JOURNEY (Qanday ishlaydi?) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="max-w-2xl mb-8">
            <span className="px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-1.5">
              <span>Bemorlar uchun qo'llanma</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-3">
              Shifo.top orqali 4 oddiy qadam
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Hech qanday navbatlarsiz, ortiqcha qog'ozbozliksiz va yashirin to'lovlarsiz tibbiy xizmatlardan foydalaning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stepsData.map((item, idx) => {
              const IconComp = item.icon;
              const isSelected = activeStep === idx;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(idx)}
                  className={`btn-spring relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-teal-500 shadow-md'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-teal-400">
                        {item.stepNumber}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-300">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                    }}
                    className="btn-spring mt-4 w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE MAP PREVIEW SECTION */}
      <section id="map-preview-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* 5. TOP CLINICS & MEDICAL CENTERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>Eng Nufuzli Tibbiyot Markazlari</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Zamonaviy texnologiya va jahon standartidagi klinikalar
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              MRT, MSKT, raqamli laboratoriya va 24/7 shoshilinch xizmatga ega yetakchi markazlar
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setClinicFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                clinicFilter === 'all'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'surface-card text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              Barcha markazlar
            </button>
            <button
              type="button"
              onClick={() => setClinicFilter('emergency')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                clinicFilter === 'emergency'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'surface-card text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              24/7 Shoshilinch
            </button>
            <Link
              to="/clinics"
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 ml-2"
            >
              <span>Barchasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topClinics.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>
      </section>

      {/* 6. TOP RATED DOCTORS SECTION */}
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

      {/* 7. INTERACTIVE HEALTH & BMI CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="surface-card rounded-2xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Interactive Inputs */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  <span>Interaktiv Salomatlik Asbobi</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
                  Tana Vazni Indeksi (BMI) va Tavsiyalar
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Bo'y va vazningizni kiriting — biz sizning vazningiz xalqaro tibbiy me'yorlarga qanchalik mosligini va kunlik suv talabini hisoblab beramiz.
                </p>
              </div>

              {/* Gender and Age Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Jinsingiz
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        gender === 'male'
                          ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Erkak
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        gender === 'female'
                          ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Ayol
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Yoshingiz: <span className="text-teal-600 dark:text-teal-400 font-bold">{age} yosh</span>
                  </label>
                  <input
                    type="range"
                    min="14"
                    max="90"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Kundalik suv me'yori
                  </label>
                  <div className="flex items-center gap-2 p-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-xl text-sky-800 dark:text-sky-300 font-bold text-xs">
                    <Droplet className="w-4 h-4 text-sky-500 fill-sky-500" />
                    <span>~ {bmiData.waterLiters} litr / kun</span>
                  </div>
                </div>
              </div>

              {/* Sliders for Height & Weight */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Bo'yingiz:</span>
                    <span className="text-base font-bold text-teal-600 dark:text-teal-400">
                      {heightCm} sm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="220"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full accent-teal-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>120 sm</span>
                    <span>170 sm</span>
                    <span>220 sm</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Vazningiz:</span>
                    <span className="text-base font-bold text-teal-600 dark:text-teal-400">
                      {weightKg} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="160"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-teal-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>35 kg</span>
                    <span>75 kg</span>
                    <span>160 kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Result Card */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/50 p-6 sm:p-10 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Sizning hisoblangan natijangiz
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">
                    {bmiData.bmi}
                  </span>
                  <div>
                    <span className="text-xs font-medium text-slate-400">BMI ball</span>
                    <div className={`text-sm font-bold ${bmiData.color}`}>
                      {bmiData.category}
                    </div>
                  </div>
                </div>

                {/* Visual BMI Gauge Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="relative pt-2">
                    <div
                      className="absolute top-0 -translate-x-1/2 transition-all duration-500 ease-out flex flex-col items-center pointer-events-none z-10"
                      style={{ left: `${bmiData.barPercent}%` }}
                    >
                      <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-white rounded-full shadow-md"></div>
                      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-900 dark:border-t-white -mt-0.5"></div>
                    </div>

                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                      <div className="h-full bg-sky-400 w-[20%]" title="Kam vazn (<18.5)"></div>
                      <div className="h-full bg-emerald-500 w-[35%]" title="Normal (18.5-24.9)"></div>
                      <div className="h-full bg-amber-400 w-[25%]" title="Ortiqcha vazn (25-29.9)"></div>
                      <div className="h-full bg-rose-500 w-[20%]" title="Semizlik (>30)"></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>15</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>35+</span>
                  </div>
                </div>

                {/* Medical Advice Box */}
                <div className="p-4 rounded-xl surface-card space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Tavsiya etilgan maqbul vazn:</span>
                  </div>
                  <div className="text-sm font-bold text-teal-600 dark:text-teal-400">
                    {bmiData.idealMin} kg — {bmiData.idealMax} kg oralig'ida
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                    {bmiData.advice}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/doctors')}
                  className="btn-spring w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs text-center transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Terapevt bilan maslahatlashish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 8. ONLINE PHARMACY HIGHLIGHTS SECTION */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 py-16 border-y border-slate-200/60 dark:border-slate-800/60">
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

      {/* 9. MEDICAL ENCYCLOPEDIA & PREVENTIVE HEALTH GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Tibbiy Ensiklopediya</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Kasalliklarning oldini olish va birinchi yordam qoidalari
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Shifokorlar tomonidan tasdiqlangan ilmiy tavsiyalar, sabablar va davolash usullari
            </p>
          </div>

          <Link
            to="/encyclopedia"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors shrink-0"
          >
            <span>Barcha kasalliklar ro'yxati</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDiseases.map((item) => (
            <div
              key={item.id}
              className="surface-card rounded-2xl p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    3 daqiqa o'qish
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {item.name}
                </h3>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Asosiy alomatlari:
                  </span>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pl-4 list-disc">
                    {item.symptoms.slice(0, 3).map((sym, idx) => (
                      <li key={idx} className="line-clamp-1">{sym}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-teal-600 dark:text-teal-400 block mb-1">
                    Mutaxassis tavsiyasi:
                  </span>
                  <p className="line-clamp-2">{item.treatments[0]}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Shifokor: <b className="text-slate-700 dark:text-slate-200 font-semibold">{item.doctorSpecialty}</b>
                </span>
                <Link
                  to="/encyclopedia"
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1"
                >
                  <span>Batafsil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. EMERGENCY & TELEGRAM BOT CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-800 bg-slate-900">
          <img
            src="/images/clinic_hospital.jpg"
            alt="Zamonaviy shifoxona binosi"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80"></div>

          <div className="relative p-8 sm:p-12 text-white max-w-2xl space-y-4 z-10">
            <span className="px-3.5 py-1 rounded-full bg-white/10 text-white font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 border border-white/15">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span>24/7 Shoshilinch Yordam & Aloqa</span>
            </span>

            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Shoshilinch tibbiy holatmi yoki navbatsiz qabul kerakmi?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              103 tez yordam xizmati orqali bir zumda brigada chaqiring yoki Telegram bot orqali istalgan klinikaga navbat oling.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/doctors"
                className="btn-spring px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Shifokor qabuliga yozilish</span>
              </Link>
              <a
                href="tel:103"
                className="btn-spring px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>103 Tez Yordam</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 11. VERIFIED PATIENT REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left max-w-xl">
            <div className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase flex items-center justify-center sm:justify-start gap-1.5">
              <Quote className="w-4 h-4" />
              <span>Bemorlar Fikrlari & Jonli Baholar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Bemorlarning 5 yulduzli xolis baholari
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Haqiqiy tashrif buyurgan bemorlarning shifokorlar va klinikalar haqidagi jonli fikrlari
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (openReviewModal && clinics && clinics[0]) {
                openReviewModal({ targetType: 'clinic', target: clinics[0] });
              }
            }}
            className="btn-spring px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
          >
            <Star className="w-4 h-4 fill-slate-950" />
            <span>Fikr va 5★ Baho qoldirish</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(reviews || []).slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="interactive-card surface-card rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <div className="flex items-center gap-0.5">
                      {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100">{rev.rating}.0</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center">
                    {rev.patientName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{rev.patientName}</span>
                      {rev.verifiedVisit && (
                        <BadgeCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">{rev.visitDate ? `Tashrif: ${rev.visitDate}` : 'Tasdiqlangan tashrif'}</div>
                    <div className="text-[10px] font-medium text-teal-600 dark:text-teal-400 mt-0.5">
                      {rev.targetName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="interactive-card p-4 rounded-2xl surface-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">100% Litsenziyalangan</div>
              <div className="text-[11px] text-slate-500">SSV akkreditatsiyasi</div>
            </div>
          </div>

          <div className="interactive-card p-4 rounded-2xl surface-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">500+ Oliy Toifali</div>
              <div className="text-[11px] text-slate-500">Tajribali shifokorlar</div>
            </div>
          </div>

          <div className="interactive-card p-4 rounded-2xl surface-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">24/7 Uzluksiz Aloqa</div>
              <div className="text-[11px] text-slate-500">Shoshilinch tibbiy ko'mak</div>
            </div>
          </div>

          <div className="interactive-card p-4 rounded-2xl surface-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">0 daqiqa kutish</div>
              <div className="text-[11px] text-slate-500">Elektron tezkor navbat</div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FREQUENTLY ASKED QUESTIONS (FAQ Accordion) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Savollarga Javoblar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ko'p beriladigan savollar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Shifo.top tizimidan foydalanish, qabulga yozilish va xizmatlar haqida barcha ma'lumotlar
          </p>
        </div>

        <div className="space-y-3">
          {faqList.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="surface-card rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-teal-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 13. REAL STATS COUNTER WITH 10S LIVE TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 surface-card rounded-2xl text-xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Tizim Jonli Monitoringi
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-300 hidden sm:inline">
              Oxirgi hodisa: <b className="text-teal-600 dark:text-teal-400 font-semibold">{liveMetrics?.lastEvent}</b>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>10s avto-yangilanish faol</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="interactive-card surface-card p-6 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400">
              <AnimatedCounter value={liveMetrics?.todayConsultations || 148} duration={500} suffix="+" />
            </div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-2">
              Bugungi qabullar
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Jonli ro'yxatdan o'tishlar
            </div>
          </div>

          <div className="interactive-card surface-card p-6 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              <AnimatedCounter value={liveMetrics?.activeAmbulances || 19} duration={500} />
            </div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-2">
              Tez yordam (103)
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Brigadalar faol reysda
            </div>
          </div>

          <div className="interactive-card surface-card p-6 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">
              <AnimatedCounter value={liveMetrics?.curedPatientsToday || 132} duration={500} suffix="+" />
            </div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-2">
              Sog'aygan bemorlar
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Bugungi muolajalar yakuni
            </div>
          </div>

          <div className="interactive-card surface-card p-6 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-black text-amber-500">
              {liveMetrics?.trafficScore || 2} ball
            </div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-2">
              Yo'l harakati
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
              {liveMetrics?.trafficText?.split('(')[0] || "Tirbandliksiz"}
            </div>
          </div>
        </div>
      </section>

      {/* 14. HEALTH NEWSLETTER & TELEGRAM NOTIFICATION SIGNUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Send className="w-3.5 h-3.5" />
              <span>Sog'lom Hayot Xabarnomasi</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Haftalik tibbiy maslahatlar va yangiliklar
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Telegram bot yoki telefoningiz orqali mavsumiy kasalliklar profilaktikasi, dorixona chegirmalari va tibbiyot yangiliklaridan birinchilardan xabardor bo'ling.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {isSubscribed ? (
              <div className="bg-teal-500/20 border border-teal-400 text-teal-200 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <div className="font-bold text-xs text-white">Tabriklaymiz, siz a'zo bo'ldingiz!</div>
                  <div className="text-[11px] text-teal-200">Foydali xabarlar muntazam yetkaziladi.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="text"
                  value={subscriberContact}
                  onChange={(e) => setSubscriberContact(e.target.value)}
                  placeholder="Telefon yoki @telegram..."
                  className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 min-w-[240px]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>A'zo bo'lish</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
