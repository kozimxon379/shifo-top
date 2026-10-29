import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { labCategories, labTests, testPresets } from '../data/labTestsData';
import { commonDrugs, interactionsMatrix, foodInteractions } from '../data/drugInteractionsData';
import { emergencyProtocols } from '../data/firstAidData';
import {
  Activity,
  HeartPulse,
  Pill,
  ShieldAlert,
  Droplet,
  Zap,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Volume2,
  VolumeX,
  PhoneCall,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Info,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Sliders,
  Search
} from 'lucide-react';

export default function HealthToolsPage() {
  const { t, openBookingModal } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab state: 'lab' | 'drugs' | 'first_aid'
  const [activeTab, setActiveTab] = useState('lab');

  useEffect(() => {
    // Check if query params or hash specified a tab
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['lab', 'drugs', 'first_aid'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // ----------------------------------------------------
  // 1. LAB TESTS STATE
  // ----------------------------------------------------
  const [gender, setGender] = useState('male'); // 'male' | 'female'
  const [selectedLabCat, setSelectedLabCat] = useState('all');
  const [testValues, setTestValues] = useState(() => {
    const initial = {};
    labTests.forEach((t) => {
      initial[t.id] = t.defaultVal;
    });
    return initial;
  });

  const handleTestValueChange = (testId, val) => {
    setTestValues((prev) => ({
      ...prev,
      [testId]: parseFloat(val) || 0
    }));
  };

  const applyPreset = (preset) => {
    setTestValues((prev) => ({
      ...prev,
      ...preset.values
    }));
  };

  const resetAllTests = () => {
    const initial = {};
    labTests.forEach((t) => {
      initial[t.id] = t.defaultVal;
    });
    setTestValues(initial);
  };

  // Helper to get normal range for a test based on gender
  const getNormalRange = (test) => {
    if (test.genderDiff) {
      return gender === 'female' ? test.femaleNormal : test.maleNormal;
    }
    return test.maleNormal;
  };

  // Calculate status: 'low' | 'normal' | 'high'
  const getTestStatus = (test, val) => {
    const range = getNormalRange(test);
    if (val < range.min) return 'low';
    if (val > range.max) return 'high';
    return 'normal';
  };

  const filteredTests = useMemo(() => {
    if (selectedLabCat === 'all') return labTests;
    return labTests.filter((t) => t.categoryId === selectedLabCat);
  }, [selectedLabCat]);

  // Count abnormal tests
  const abnormalSummary = useMemo(() => {
    let lowCount = 0;
    let highCount = 0;
    labTests.forEach((t) => {
      const status = getTestStatus(t, testValues[t.id]);
      if (status === 'low') lowCount++;
      if (status === 'high') highCount++;
    });
    return { lowCount, highCount, totalAbnormal: lowCount + highCount };
  }, [testValues, gender]);

  // ----------------------------------------------------
  // 2. DRUG INTERACTIONS STATE
  // ----------------------------------------------------
  const [drug1Id, setDrug1Id] = useState('aspirin');
  const [drug2Id, setDrug2Id] = useState('ibuprofen');

  const selectedDrug1 = useMemo(() => commonDrugs.find((d) => d.id === drug1Id), [drug1Id]);
  const selectedDrug2 = useMemo(() => commonDrugs.find((d) => d.id === drug2Id), [drug2Id]);

  const interactionResult = useMemo(() => {
    if (!drug1Id || !drug2Id) return null;
    if (drug1Id === drug2Id) {
      return {
        severity: 'warning',
        title: "Bir xil dori vositasi tanlangan",
        details: "Bir xil nomdagi dorini ikki marta tanladingiz. Bu dozaning oshib ketishi xavfini bildiradi.",
        recommendation: "Ikkita turli dori vositasini tanlab tekshiring."
      };
    }

    // Check interaction matrix in both directions
    const found = interactionsMatrix.find(
      (item) =>
        (item.drug1 === drug1Id && item.drug2 === drug2Id) ||
        (item.drug1 === drug2Id && item.drug2 === drug1Id)
    );

    if (found) return found;

    return {
      severity: 'safe',
      title: "Jiddiy to'qnashuv qayd etilmagan (Xavfsiz)",
      details: `«${selectedDrug1?.name}» va «${selectedDrug2?.name}» o'rtasida to'g'ridan-to'g'ri o'tkir kimyoviy to'qnashuv aniqlanmagan.`,
      recommendation: "Shunday bo'lsa-da, barcha dorilarni shifokor ko'rsatmasi bo'yicha va kamida 1-2 soat oraliq bilan ichish eng to'g'ri usul hisoblanadi."
    };
  }, [drug1Id, drug2Id, selectedDrug1, selectedDrug2]);

  // ----------------------------------------------------
  // 3. CPR METRONOME & FIRST AID STATE
  // ----------------------------------------------------
  const [cprRunning, setCprRunning] = useState(false);
  const [cprSoundEnabled, setCprSoundEnabled] = useState(true);
  const [cprBeatsCount, setCprBeatsCount] = useState(0);
  const [cprCycle, setCprCycle] = useState(1);
  const [isHeartBeating, setIsHeartBeating] = useState(false);
  const [openProtocolId, setOpenProtocolId] = useState('heart_attack');

  const audioCtxRef = useRef(null);
  const cprIntervalRef = useRef(null);

  // Play audio tick with Web Audio API
  const playClickSound = () => {
    if (!cprSoundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // 880 Hz beep
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio playback issue:", e);
    }
  };

  const toggleCpr = () => {
    if (cprRunning) {
      // Stop
      clearInterval(cprIntervalRef.current);
      setCprRunning(false);
      setIsHeartBeating(false);
    } else {
      // Start at 110 BPM (approx 545ms interval)
      setCprRunning(true);
      setCprBeatsCount(0);
      setCprCycle(1);

      // Play first beat immediately
      playClickSound();
      setIsHeartBeating(true);
      setTimeout(() => setIsHeartBeating(false), 200);

      const intervalMs = Math.round(60000 / 110);
      cprIntervalRef.current = setInterval(() => {
        playClickSound();
        setIsHeartBeating(true);
        setTimeout(() => setIsHeartBeating(false), 180);

        setCprBeatsCount((prev) => {
          const next = prev + 1;
          if (next >= 30) {
            setCprCycle((c) => c + 1);
            return 0;
          }
          return next;
        });
      }, intervalMs);
    }
  };

  useEffect(() => {
    return () => {
      if (cprIntervalRef.current) clearInterval(cprIntervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity">
          <img
            src="/images/clinic_hospital.jpg"
            alt="Salomatlik laboratoriyasi"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80 z-0"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide">
            <Activity className="w-3.5 h-3.5" />
            <span>Smart Salomatlik Markazi</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Interaktiv Salomatlik Yordamchilari & Tahlillar Dekoderi
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Har bir inson va oila uchun zarur bo'lgan 3 ta professional tibbiy yordamchi: tahlil natijalarini me'yorda ekanligini tekshirish, dorilar mosligi va shoshilinch birinchi yordam qoidalari.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap gap-2.5 pt-2 text-[11px] font-semibold text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <Droplet className="w-3.5 h-3.5 text-rose-400" />
              <span>8+ Laboratoriya Tahlillari</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <Pill className="w-3.5 h-3.5 text-teal-400" />
              <span>Dori Mosligi Matritsasi</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <HeartPulse className="w-3.5 h-3.5 text-amber-400" />
              <span>110 BPM CPR Metronomi</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('lab')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'lab'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-800'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>Tahlillar Tushuntirgichi</span>
          {abnormalSummary.totalAbnormal > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
              {abnormalSummary.totalAbnormal} ogohlantirish
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('drugs')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'drugs'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-800'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Dori Mosligi & Nojo'ya Ta'sir</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('first_aid')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'first_aid'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-800'
          }`}
        >
          <HeartPulse className="w-4 h-4 text-rose-300" />
          <span>Tezkor Birinchi Yordam & CPR</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TAHLILLAR TUSHUNTIRGICHI (LAB TESTS DECODER) */}
      {/* ========================================================================= */}
      {activeTab === 'lab' && (
        <div className="space-y-6">
          {/* Controls Bar: Presets & Gender Switch */}
          <div className="surface-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Tezkor Namuna Qoliplari (Presets)</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Haqiqiy holatlarni 1 tugma orqali sinab ko'ring yoki quyidagi slayderlardan o'z qon tahlil qog'ozingizdagi raqamlarni kiriting:
                </p>
              </div>

              {/* Gender Switch */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0">
                <span className="text-slate-400 text-[11px] px-2">Norma:</span>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    gender === 'male'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Erkaklar
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    gender === 'female'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Ayollar
                </button>
              </div>
            </div>

            {/* Presets Button Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {testPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="btn-spring px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-teal-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  title={preset.desc}
                >
                  <span>{preset.name}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={resetAllTests}
                className="btn-spring px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Barchasini tiklash</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedLabCat('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLabCat === 'all'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              Barcha tahlillar ({labTests.length})
            </button>
            {labCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedLabCat(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLabCat === cat.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTests.map((test) => {
              const currentVal = testValues[test.id] ?? test.defaultVal;
              const range = getNormalRange(test);
              const status = getTestStatus(test, currentVal);

              // Percentage for slider
              const percent = Math.min(
                Math.max(((currentVal - test.minRange) / (test.maxRange - test.minRange)) * 100, 0),
                100
              );

              return (
                <div
                  key={test.id}
                  className={`surface-card rounded-2xl p-5 border transition-all space-y-4 ${
                    status === 'high'
                      ? 'border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-500/20'
                      : status === 'low'
                      ? 'border-amber-300 dark:border-amber-900/60 ring-1 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {test.name}
                        </h3>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                          {test.unit}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{test.fullName}</p>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {status === 'normal' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Me'yorda</span>
                        </span>
                      )}
                      {status === 'high' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
                          <AlertCircle className="w-3 h-3" />
                          <span>Yuqori!</span>
                        </span>
                      )}
                      {status === 'low' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Past!</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Interactive Slider & Number Input */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span>Natijangizni kiriting:</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step={test.step}
                          min={test.minRange}
                          max={test.maxRange}
                          value={currentVal}
                          onChange={(e) => handleTestValueChange(test.id, e.target.value)}
                          className="w-20 px-2 py-1 text-right font-black font-mono text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="text-[11px] text-slate-400">{test.unit}</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={test.minRange}
                      max={test.maxRange}
                      step={test.step}
                      value={currentVal}
                      onChange={(e) => handleTestValueChange(test.id, e.target.value)}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />

                    {/* Reference Range Bar with Indicator */}
                    <div className="relative pt-1">
                      <div className="h-2 rounded-full flex overflow-hidden bg-slate-200 dark:bg-slate-800">
                        {/* Low segment */}
                        <div
                          className="bg-amber-400/80"
                          style={{
                            width: `${((range.min - test.minRange) / (test.maxRange - test.minRange)) * 100}%`
                          }}
                          title="Kam ko'rsatkich"
                        />
                        {/* Normal segment */}
                        <div
                          className="bg-emerald-500"
                          style={{
                            width: `${((range.max - range.min) / (test.maxRange - test.minRange)) * 100}%`
                          }}
                          title="Me'yordagi norma"
                        />
                        {/* High segment */}
                        <div className="bg-rose-500 flex-1" title="Yuqori ko'rsatkich" />
                      </div>

                      {/* Normal Range Reference Label */}
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 font-mono">
                        <span>Min: {test.minRange}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          Sog'lom norma: {range.min} - {range.max} {test.unit}
                        </span>
                        <span>Maks: {test.maxRange}</span>
                      </div>
                    </div>
                  </div>

                  {/* Medical Explanation & Actionable Advice */}
                  {status !== 'normal' ? (
                    <div
                      className={`p-3.5 rounded-xl text-xs space-y-2.5 ${
                        status === 'high'
                          ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                          : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>
                          {status === 'high' ? test.highAlert.title : test.lowAlert.title}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] leading-relaxed">
                        <p>
                          <strong>Ehtimoliy alomatlar:</strong>{' '}
                          {status === 'high' ? test.highAlert.symptoms : test.lowAlert.symptoms}
                        </p>
                        <p>
                          <strong>Ovqatlanish & Maslahat:</strong>{' '}
                          {status === 'high' ? test.highAlert.dietAdvice : test.lowAlert.dietAdvice}
                        </p>
                      </div>

                      {/* Doctor Recommendation */}
                      <div className="pt-2 border-t border-rose-200/50 dark:border-rose-900/50 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>
                            Tavsiya: {status === 'high' ? test.highAlert.recommendedDoctor : test.lowAlert.recommendedDoctor}
                          </span>
                        </span>

                        <button
                          type="button"
                          onClick={() => navigate('/doctors')}
                          className="btn-spring px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>Shifokorga yozilish</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        Ko'rsatkich me'yorda ({currentVal} {test.unit}). Organizm a'zosi sog'lom rejimda ishlamoqda.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DORI MOSLIGI & NOJO'YA TA'SIR (DRUG INTERACTIONS) */}
      {/* ========================================================================= */}
      {activeTab === 'drugs' && (
        <div className="space-y-8">
          {/* Drug Selection Interactive Box */}
          <div className="surface-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5" />
                <span>O'zaro Moslik Tekshirgich</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                2 ta dori vositasining birgalikda ichilish xavfsizligini aniqlang
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ko'pincha bemorlar og'riq qoldiruvchi, shamollash va kardiologik dorilarni bir vaqtda ichib, jiddiy asoratlarga duch kelishadi. Tekshirib ko'ring:
              </p>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Drug 1 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  1-Dori vositasi:
                </label>
                <select
                  value={drug1Id}
                  onChange={(e) => setDrug1Id(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {commonDrugs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.category})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-400 pl-1">
                  Qo'llanilishi: {selectedDrug1?.typicalUse}
                </div>
              </div>

              {/* Drug 2 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  2-Dori vositasi:
                </label>
                <select
                  value={drug2Id}
                  onChange={(e) => setDrug2Id(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {commonDrugs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.category})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-400 pl-1">
                  Qo'llanilishi: {selectedDrug2?.typicalUse}
                </div>
              </div>
            </div>

            {/* Interaction Result Card */}
            {interactionResult && (
              <div
                className={`p-6 rounded-2xl border transition-all space-y-3 ${
                  interactionResult.severity === 'danger'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/20'
                    : interactionResult.severity === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/20'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  {interactionResult.severity === 'danger' && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>XAVFLI TO'QNASHUV</span>
                    </span>
                  )}
                  {interactionResult.severity === 'warning' && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>EHTIYOTKORLIK ZARUR</span>
                    </span>
                  )}
                  {interactionResult.severity === 'safe' && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>XAVFSIZ BIRIKMA</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  {interactionResult.title}
                </h3>

                <p className="text-xs sm:text-sm leading-relaxed">
                  {interactionResult.details}
                </p>

                <div className="pt-2 border-t border-black/10 dark:border-white/10 text-xs font-semibold flex items-start gap-1.5">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-teal-600 dark:text-teal-400" />
                  <span>
                    <strong>Shifokor tavsiyasi:</strong> {interactionResult.recommendation}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Food and Drink Warnings Grid */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Oziq-ovqat va Ichimliklar bilan Birga Ichish Qoidalari
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                Dorilarni nima bilan ichish qat'iyan man etiladi?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {foodInteractions.map((item) => (
                <div
                  key={item.id}
                  className="surface-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        item.color === 'rose'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : item.color === 'amber'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.rules}
                  </p>

                  <div className="text-[11px] font-medium text-rose-600 dark:text-rose-400 pt-1">
                    <strong>Taqiqlangan guruhlar:</strong> {item.prohibitedWith}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TEZKOR BIRINCHI YORDAM & CPR (FIRST AID & METRONOME) */}
      {/* ========================================================================= */}
      {activeTab === 'first_aid' && (
        <div className="space-y-8">
          {/* Interactive CPR Metronome Box */}
          <div className="surface-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold">
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>Xalqaro Standart: 100-120 Zarb / Daqiqa</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Interaktiv CPR (Yurak Massaji) Ritm Metronomi
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Yurak to'xtaganda har bir soniya hayotiy muhim! Ushbu ritm generatori 110 BPM chastotada tovushli va vizual zarba berib, ko'krak qafasini to'g'ri tezlikda bosishga yordam beradi (30 ta bosish + 2 ta nafas).
                </p>
              </div>

              {/* Heart Rhythm Visualizer & Controls */}
              <div className="flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-80 shrink-0">
                {/* Pulsing Heart Icon */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-100 ${
                      isHeartBeating
                        ? 'bg-rose-500 scale-110 shadow-lg shadow-rose-500/50'
                        : 'bg-rose-100 dark:bg-rose-950/60 scale-100'
                    }`}
                  >
                    <HeartPulse
                      className={`w-12 h-12 transition-colors ${
                        isHeartBeating ? 'text-white' : 'text-rose-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Counter & Status */}
                <div className="text-center space-y-0.5">
                  <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                    {cprBeatsCount} <span className="text-sm font-semibold text-slate-400">/ 30 zarba</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Sikl: <strong className="text-teal-600 dark:text-teal-400">{cprCycle}-bosqich</strong>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-2 w-full">
                  <button
                    type="button"
                    onClick={toggleCpr}
                    className={`btn-spring flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      cprRunning
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    {cprRunning ? (
                      <>
                        <Square className="w-4 h-4 fill-white" />
                        <span>To'xtatish</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Ritmni Boshlash (110 BPM)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCprSoundEnabled(!cprSoundEnabled)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title={cprSoundEnabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
                  >
                    {cprSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Protocols Accordions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Hayotni Saqlab Qolish Qo'llanmalari</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  Favqulodda holatlarda nima qilish va nima QILMASLIK kerak?
                </h3>
              </div>

              <a
                href="tel:103"
                className="btn-spring px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>103 Tez Yordam</span>
              </a>
            </div>

            <div className="space-y-3">
              {emergencyProtocols.map((protocol) => {
                const isOpen = openProtocolId === protocol.id;

                return (
                  <div
                    key={protocol.id}
                    className="surface-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenProtocolId(isOpen ? null : protocol.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-base text-slate-900 dark:text-white">
                            {protocol.title}
                          </h4>
                          {protocol.severity === 'critical' && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 uppercase">
                              Kritik
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{protocol.subtitle}</p>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                        {/* Signs */}
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs space-y-1.5">
                          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            <span>Qanday aniqlanadi (Asosiy belgilar):</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1">
                            {protocol.signs.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Action Steps */}
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-2">
                          <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Zudlik bilan bajariladigan to'g'ri qadamlar:</span>
                          </div>
                          <ol className="list-decimal list-inside space-y-1.5 text-emerald-900/90 dark:text-emerald-200/90 font-medium pl-1 leading-relaxed">
                            {protocol.actionSteps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        {/* Prohibited (Do NOTs) */}
                        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs space-y-2">
                          <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                            <span>QAT'IYAN MAN ETILADI (Xavfli xatolar):</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-rose-900/90 dark:text-rose-200/90 font-medium pl-1 leading-relaxed">
                            {protocol.prohibited.map((p, idx) => (
                              <li key={idx}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
