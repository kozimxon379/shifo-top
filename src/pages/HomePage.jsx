import React, { useState, useMemo } from 'react';
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
  ShieldAlert,
  BadgeCheck,
  Compass
} from 'lucide-react';

export default function HomePage() {
  const {
    t,
    lang,
    products,
    openBookingModal,
    liveMetrics,
    addToast
  } = useApp();
  const navigate = useNavigate();

  // Search & Diagnosis state
  const [searchQuery, setSearchQuery] = useState('');
  const [diagnosisModalResult, setDiagnosisModalResult] = useState(null);

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

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const result = consultMedicalAI(searchQuery, lang || 'uz');
    setDiagnosisModalResult(result);
  };

  const handleQuickSymptomClick = (symptom) => {
    setSearchQuery(symptom);
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

  const featuredDoctors = initialDoctors.slice(0, 3);
  const featuredProducts = products.slice(0, 4);
  const topClinics = useMemo(() => {
    if (clinicFilter === 'emergency') {
      return initialClinics.filter(c => c.emergency247).slice(0, 3);
    }
    return initialClinics.slice(0, 3);
  }, [clinicFilter]);

  // Medical Specialties Directory
  const medicalSpecialties = [
    {
      id: 'kardiologiya',
      name: "Kardiologiya",
      nameRu: "Кардиология",
      desc: "Yurak, qon bosimi va tomir kasalliklari diagnostikasi",
      icon: HeartPulse,
      color: "from-rose-500/10 to-red-500/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900",
      doctorsCount: 42,
      specialtyQuery: "Kardiolog"
    },
    {
      id: 'nevrologiya',
      name: "Nevrologiya",
      nameRu: "Неврология",
      desc: "Bosh og'rig'i, migren, asab tizimi va umurtqa pog'onasi",
      icon: Activity,
      color: "from-purple-500/10 to-indigo-500/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900",
      doctorsCount: 38,
      specialtyQuery: "Nevropatolog"
    },
    {
      id: 'terapiya',
      name: "Terapiya & Umumiy amaliyot",
      nameRu: "Терапия и общая практика",
      desc: "Shamollash, gripp, ichki a'zolar va birlamchi konsultatsiya",
      icon: Stethoscope,
      color: "from-teal-500/10 to-emerald-500/20 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900",
      doctorsCount: 65,
      specialtyQuery: "Terapevt"
    },
    {
      id: 'pediatriya',
      name: "Pediatriya",
      nameRu: "Педиатрия",
      desc: "Go'daklar va bolalar salomatligi, emlash va rivojlanish",
      icon: Users,
      color: "from-amber-500/10 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900",
      doctorsCount: 29,
      specialtyQuery: "Pediatr"
    },
    {
      id: 'stomatologiya',
      name: "Stomatologiya",
      nameRu: "Стоматология",
      desc: "Tish davolash, implantatsiya, karies va estetik restavratsiya",
      icon: Sparkles,
      color: "from-cyan-500/10 to-blue-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900",
      doctorsCount: 51,
      specialtyQuery: "Stomatolog"
    },
    {
      id: 'travmatologiya',
      name: "Travmatologiya & Ortopediya",
      nameRu: "Травматология и ортопедия",
      desc: "Suyak sinishi, bo'g'im og'riqlari, artroz va operatsiyadan keyin reabilitatsiya",
      icon: ShieldAlert,
      color: "from-emerald-500/10 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
      doctorsCount: 24,
      specialtyQuery: "Travmatolog"
    },
    {
      id: 'gastroenterologiya',
      name: "Gastroenterologiya",
      nameRu: "Гастроэнтерология",
      desc: "Oshqozon-ichak trakti, jigar, o't qopi va gastrit muolajasi",
      icon: Zap,
      color: "from-blue-500/10 to-indigo-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900",
      doctorsCount: 31,
      specialtyQuery: "Gastroenterolog"
    },
    {
      id: 'oftalmologiya',
      name: "Oftalmologiya",
      nameRu: "Офтальмология",
      desc: "Ko'rish qobiliyatini tekshirish, katarakta, lazer korreksiya",
      icon: Compass,
      color: "from-pink-500/10 to-rose-500/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900",
      doctorsCount: 22,
      specialtyQuery: "Oftalmolog"
    }
  ];

  // How it works steps data
  const stepsData = [
    {
      step: 1,
      title: "Alomat yoki kasallikni yozing",
      desc: "Qidiruv maydoniga og'riq yoki alomatni kiriting. Shifo AI soniyalar ichida sabablarini tahlil qilib, kerakli mutaxassisni tavsiya qiladi.",
      icon: Search,
      actionText: "Alomatni qidirish",
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    {
      step: 2,
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
      title: "1 bosishda navbatsiz qabulga yoziling",
      desc: "Sizga mos sana va vaqtni tanlang. Telefon raqamingizni kiriting — navbatingiz bir zumda tasdiqlanadi va klinika tizimiga kiritiladi.",
      icon: Calendar,
      actionText: "Shifokorlarni ko'rish",
      action: () => navigate('/doctors')
    },
    {
      step: 4,
      title: "Telegram xabarnoma va xarita yo'llanmasi",
      desc: "Uchrashuv vaqti, klinika manzili va eslatmalar to'g'ridan-to'g'ri Telegramingizga keladi. Qabulga kechikmaysiz va navbat kutmaysiz.",
      icon: Smartphone,
      actionText: "Dorixonaga o'tish",
      action: () => navigate('/store')
    }
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
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden">
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
                  className="shrink-0 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
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
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-all text-[11px] cursor-pointer"
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
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                {diagnosisModalResult.summary}
              </p>

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

            <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
              <span className="text-[11px] text-slate-500">
                {t.home.modal.doctorSpecialist} <b>{diagnosisModalResult.doctorSpecialty}</b>
              </span>
              <button
                type="button"
                onClick={() => setDiagnosisModalResult(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white font-bold rounded-xl cursor-pointer"
              >
                {t.home.modal.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MEDICAL SPECIALTIES & DEPARTMENTS EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4" />
              <span>Tibbiy Ixtisosliklar & Bo'limlar</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {medicalSpecialties.map((spec) => {
            const IconComponent = spec.icon;
            return (
              <div
                key={spec.id}
                onClick={() => navigate('/doctors')}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${spec.color} flex items-center justify-center border shadow-xs group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {spec.doctorsCount}+ shifokor
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {spec.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                  <span>Mutaxassis ko'rigi</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. STEP-BY-STEP PATIENT JOURNEY (Qanday ishlaydi?) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-cyan-950 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,#0d9488_0%,transparent_70%)] opacity-20 pointer-events-none"></div>

          <div className="max-w-2xl mb-8">
            <span className="px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold text-xs uppercase tracking-wider">
              Bemorlar uchun qo'llanma
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-3">
              Shifo.top orqali sog'lom hayot sari 4 oddiy qadam
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/80 mt-2 leading-relaxed">
              Hech qanday navbatlarsiz, ortiqcha qog'ozbozliksiz va yashirin to'lovlarsiz tibbiy xizmatlardan foydalaning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepsData.map((item, idx) => {
              const IconComp = item.icon;
              const isSelected = activeStep === idx;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(idx)}
                  className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/15 border-teal-400 shadow-lg shadow-teal-500/20 scale-102'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/30 text-teal-300 flex items-center justify-center font-black text-sm">
                        0{item.step}
                      </div>
                      <IconComp className="w-5 h-5 text-teal-300" />
                    </div>

                    <h3 className="font-bold text-sm text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-teal-100/70 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                    }}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
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
              <Building className="w-4 h-4" />
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                clinicFilter === 'all'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Barcha markazlar
            </button>
            <button
              type="button"
              onClick={() => setClinicFilter('emergency')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                clinicFilter === 'emergency'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              24/7 Shoshilinch
            </button>
            <Link
              to="/clinics"
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 ml-2"
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

      {/* 7. INTERACTIVE HEALTH & BMI CALCULATOR (Tana Vazni Indeksi Kalkulyatori) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Interactive Inputs */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  <span>Interaktiv Salomatlik Asbobi</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
                  Tana Vazni Indeksi (TVI / BMI) va Tavsiyalar
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Bo'y va vazningizni kiriting — biz sizning vazningiz xalqaro tibbiy me'yorlarga qanchalik mosligini va kunlik suv talabini hisoblab beramiz.
                </p>
              </div>

              {/* Gender and Age Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Jinsingiz
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
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
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Yoshingiz: <span className="text-teal-600 dark:text-teal-400">{age} yosh</span>
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
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
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Bo'yingiz:</span>
                    <span className="text-base font-black text-teal-600 dark:text-teal-400">
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
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>120 sm</span>
                    <span>170 sm</span>
                    <span>220 sm</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Vazningiz:</span>
                    <span className="text-base font-black text-teal-600 dark:text-teal-400">
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
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>35 kg</span>
                    <span>75 kg</span>
                    <span>160 kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Result Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-teal-50/40 dark:from-slate-800/80 dark:to-slate-900 p-6 sm:p-10 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Sizning hisoblangan natijangiz
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">
                    {bmiData.bmi}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-400">BMI ball</span>
                    <div className={`text-sm font-extrabold ${bmiData.color}`}>
                      {bmiData.category}
                    </div>
                  </div>
                </div>

                {/* Visual BMI Gauge Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div className="h-full bg-sky-400 w-[20%]" title="Kam vazn (<18.5)"></div>
                    <div className="h-full bg-emerald-500 w-[35%]" title="Normal (18.5-24.9)"></div>
                    <div className="h-full bg-amber-400 w-[25%]" title="Ortiqcha vazn (25-29.9)"></div>
                    <div className="h-full bg-rose-500 w-[20%]" title="Semizlik (>30)"></div>
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
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Tavsiya etilgan maqbul vazn:</span>
                  </div>
                  <div className="text-sm font-black text-teal-600 dark:text-teal-400">
                    {bmiData.idealMin} kg — {bmiData.idealMax} kg oralig'ida
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                    {bmiData.advice}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/doctors')}
                  className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs text-center shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
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

      {/* 9. MEDICAL ENCYCLOPEDIA & PREVENTIVE HEALTH GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Tibbiy Ensiklopediya & Salomatlik Qo'llanmasi</span>
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
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    3 daqiqa o'qish
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug">
                  {item.name}
                </h3>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Asosiy alomatlari:
                  </span>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pl-4 list-disc">
                    {item.symptoms.slice(0, 3).map((sym, idx) => (
                      <li key={idx} className="line-clamp-1">{sym}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-teal-600 dark:text-teal-400 block mb-1">
                    Mutaxassis tavsiyasi:
                  </span>
                  <p className="line-clamp-2">{item.treatments[0]}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  Shifokor: <b className="text-slate-700 dark:text-slate-200">{item.doctorSpecialty}</b>
                </span>
                <Link
                  to="/encyclopedia"
                  className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1"
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

      {/* 11. VERIFIED PATIENT REVIEWS & TRUST GUARANTEES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
            Bemorlar Tajribasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Minglab insonlar Shifo.top orqali sog'lig'ini tikladi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Haqiqiy bemorlarning shifokorlar va klinikalar haqidagi xolis fikrlari
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {patientReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{rev.review}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                    <span>{rev.name}</span>
                    {rev.verified && (
                      <BadgeCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">{rev.location}</div>
                  <div className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                    {rev.doctorVisited}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">100% Litsenziyalangan</div>
              <div className="text-[11px] text-slate-500">SSV akkreditatsiyasi</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">500+ Oliy Toifali</div>
              <div className="text-[11px] text-slate-500">Tajribali shifokorlar</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">24/7 Uzluksiz Aloqa</div>
              <div className="text-[11px] text-slate-500">Shoshilinch tibbiy ko'mak</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">0 daqiqa kutish</div>
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
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-teal-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 13. REAL STATS COUNTER WITH 10S LIVE TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              Tizim jonli monitoring ko'rsatkichlari
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
              Hodisa: <b className="text-teal-600 dark:text-teal-400">{liveMetrics?.lastEvent}</b>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-slate-500 font-semibold">
              Monitoring: <b className="text-teal-600 dark:text-teal-400">Faol</b>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all">
            <div className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400">
              {liveMetrics?.todayConsultations || 148}+
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Bugungi shifokor qabullari (Jonli)
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {liveMetrics?.activeAmbulances || 19}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              103 Tez yordam brigadalari reysda
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all">
            <div className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">
              {liveMetrics?.curedPatientsToday || 132}+
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Sog'lom bemorlar (Bugun)
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all">
            <div className="text-3xl sm:text-4xl font-black text-amber-500">
              {liveMetrics?.trafficScore || 2} ball
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Yo'l holati ({liveMetrics?.trafficText?.split('(')[0] || "Tirbandliksiz"})
            </div>
          </div>
        </div>
      </section>

      {/* 14. HEALTH NEWSLETTER & TELEGRAM NOTIFICATION SIGNUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-teal-800/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Send className="w-3.5 h-3.5" />
              <span>Sog'lom Hayot Xabarnomasi</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Haftalik tibbiy maslahatlar va aksiyalarni qabul qiling
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Telegram bot yoki telefoningiz orqali mavsumiy kasalliklar profilaktikasi, dorixona chegirmalari va tibbiyot yangiliklaridan birinchilardan xabardor bo'ling.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {isSubscribed ? (
              <div className="bg-teal-500/20 border border-teal-400 text-teal-200 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-teal-400 shrink-0" />
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
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 min-w-[240px]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
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
