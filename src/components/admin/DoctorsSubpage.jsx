import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { initialClinics } from '../../data/clinicsData';
import {
  Stethoscope,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Building,
  Award,
  DollarSign,
  UserCheck,
  X,
  AlertTriangle
} from 'lucide-react';

export default function DoctorsSubpage() {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'exp', 'priceAsc', 'priceDesc', 'name'
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form state
  const defaultForm = {
    name: '',
    specialty: 'Kardiolog',
    specialtyKey: 'cardiologist',
    degree: 'Oliy toifali mutaxassis',
    clinicName: initialClinics[0]?.name || 'Akfa Medline',
    clinicId: initialClinics[0]?.id || 'clinic-1',
    experienceYears: 10,
    price: 150000,
    rating: 4.9,
    patientsTreated: 1200,
    workDays: 'Dushanba - Juma',
    bio: ''
  };

  const [form, setForm] = useState(defaultForm);

  // Specialty options
  const specialtyOptions = [
    { key: 'cardiologist', label: 'Kardiolog' },
    { key: 'neurologist', label: 'Nevropatolog' },
    { key: 'therapist', label: 'Terapevt' },
    { key: 'pediatrician', label: 'Pediatr' },
    { key: 'surgeon', label: 'Jarroh' },
    { key: 'dentist', label: 'Stomatolog' },
    { key: 'dermatologist', label: 'Dermatolog' },
    { key: 'endocrinologist', label: 'Endokrinolog' },
    { key: 'ophthalmologist', label: 'Oftalmolog' }
  ];

  // Filtered & sorted doctors
  const filteredDoctors = useMemo(() => {
    return (doctors || [])
      .filter((doc) => {
        const q = search.toLowerCase();
        const matchesSearch =
          doc.name?.toLowerCase().includes(q) ||
          doc.specialty?.toLowerCase().includes(q) ||
          doc.clinicName?.toLowerCase().includes(q) ||
          doc.bio?.toLowerCase().includes(q);

        const matchesSpecialty =
          selectedSpecialty === 'all' ||
          doc.specialtyKey === selectedSpecialty ||
          doc.specialty === selectedSpecialty;

        return matchesSearch && matchesSpecialty;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'exp') return (b.experienceYears || 0) - (a.experienceYears || 0);
        if (sortBy === 'priceAsc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'priceDesc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        return 0;
      });
  }, [doctors, search, selectedSpecialty, sortBy]);

  // Metrics
  const stats = useMemo(() => {
    const list = doctors || [];
    const total = list.length;
    const avgPrice = total > 0 ? Math.round(list.reduce((acc, d) => acc + (Number(d.price) || 0), 0) / total) : 0;
    const topRated = list.filter((d) => (d.rating || 0) >= 4.8).length;
    const clinicsSet = new Set(list.map((d) => d.clinicName).filter(Boolean));

    return {
      total,
      avgPrice,
      topRated,
      clinicsCount: clinicsSet.size
    };
  }, [doctors]);

  // Open add modal
  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setForm(defaultForm);
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      name: doctor.name || '',
      specialty: doctor.specialty || 'Kardiolog',
      specialtyKey: doctor.specialtyKey || 'cardiologist',
      degree: doctor.degree || '',
      clinicName: doctor.clinicName || '',
      clinicId: doctor.clinicId || '',
      experienceYears: doctor.experienceYears || 5,
      price: doctor.price || 100000,
      rating: doctor.rating || 4.8,
      patientsTreated: doctor.patientsTreated || 0,
      workDays: Array.isArray(doctor.workDays) ? doctor.workDays.join(', ') : doctor.workDays || 'Dushanba - Juma',
      bio: doctor.bio || ''
    });
    setIsModalOpen(true);
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      specialty: form.specialty,
      specialtyKey: form.specialtyKey,
      degree: form.degree,
      clinicName: form.clinicName,
      clinicId: form.clinicId,
      experienceYears: Number(form.experienceYears) || 1,
      price: Number(form.price) || 100000,
      rating: Number(form.rating) || 5.0,
      patientsTreated: Number(form.patientsTreated) || 0,
      workDays: typeof form.workDays === 'string' ? form.workDays.split(',').map(s => s.trim()) : form.workDays,
      bio: form.bio.trim()
    };

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, payload);
    } else {
      addDoctor(payload);
    }

    setIsModalOpen(false);
  };

  // Delete doctor
  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteDoctor(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">
              Shifokorlar va Mutaxassislar Boshqaruvi
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Platformadagi barcha shifokorlar profillari, qabul narxlari va mutaxassisliklarini boshqarish
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Shifokor Qo'shish</span>
        </button>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Jami Shifokorlar</span>
            <UserCheck className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-white mt-2">
            {stats.total} <span className="text-xs font-bold text-slate-400">nafar</span>
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 font-semibold">
            Barchasi faol qabulda
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>O'rtacha Qabul Narxi</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-white mt-2">
            {stats.avgPrice.toLocaleString()} <span className="text-xs font-bold text-slate-400">so'm</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-semibold">
            1 seans konsultatsiya
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Yuqori Reyting (4.8+)</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-white mt-2">
            {stats.topRated} <span className="text-xs font-bold text-slate-400">mutaxassis</span>
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">
            Bemorlar tavsiya qilgan
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Hamkor Klinikalar</span>
            <Building className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-white mt-2">
            {stats.clinicsCount} <span className="text-xs font-bold text-slate-400">markaz</span>
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-semibold">
            Toshkent bo'yicha
          </div>
        </div>
      </div>

      {/* 3. Search and Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Shifokor ismi, mutaxassislik yoki klinika bo'yicha qidirish..."
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-white font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Specialty Select */}
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-white font-semibold"
          >
            <option value="all">Barcha mutaxassisliklar</option>
            {specialtyOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-white font-semibold"
          >
            <option value="rating">Reyting (Yuqori)</option>
            <option value="exp">Tajriba (Ko'p yillik)</option>
            <option value="priceAsc">Narx (Arzondan)</option>
            <option value="priceDesc">Narx (Qimmatdan)</option>
            <option value="name">Alifbo bo'yicha (A-Z)</option>
          </select>
        </div>
      </div>

      {/* 4. Doctors List Cards */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Stethoscope className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            Shifokor topilmadi
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Qidiruv so'zini yoki tanlangan mutaxassislik filtrini o'zgartirib ko'ring.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-teal-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Doctor Head */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/50 flex items-center justify-center overflow-hidden shrink-0">
                      {doc.image ? (
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.classList.remove('hidden');
                            }
                          }}
                        />
                      ) : null}
                      <Stethoscope className={`w-6 h-6 text-teal-600 dark:text-teal-400 ${doc.image ? 'hidden' : ''}`} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-800 dark:text-white line-clamp-1">
                        {doc.name}
                      </h4>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-[10px] font-bold">
                        <span>{doc.specialty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{doc.rating || 5.0}</span>
                  </div>
                </div>

                {/* Degree & Clinic */}
                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.degree || "Oliy toifali shifokor"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.clinicName || "Tibbiyot Markazi"}</span>
                  </div>
                </div>

                {/* Bio */}
                {doc.bio && (
                  <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {doc.bio}
                  </p>
                )}

                {/* Metadata badges */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Qabul narxi</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {Number(doc.price || 0).toLocaleString()} so'm
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-medium block">Tajriba</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-200">
                      {doc.experienceYears || 5} yil
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(doc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Tahrirlash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(doc.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>O'chirish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. ADD / EDIT DOCTOR MODAL */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] !m-0 !p-4 w-screen h-screen flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                <h3 className="font-black text-sm">
                  {editingDoctor ? "Shifokor ma'lumotlarini tahrirlash" : "Yangi Shifokor qo'shish"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Shifokor to'liq ismi (F.I.O) *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Masalan: Dr. Sardor Rahimov"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mutaxassislik *
                  </label>
                  <select
                    value={form.specialtyKey}
                    onChange={(e) => {
                      const selected = specialtyOptions.find(o => o.key === e.target.value);
                      setForm({
                        ...form,
                        specialtyKey: e.target.value,
                        specialty: selected ? selected.label : form.specialty
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                  >
                    {specialtyOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ilmiy unvoni / Toifasi
                  </label>
                  <input
                    type="text"
                    value={form.degree}
                    onChange={(e) => setForm({ ...form, degree: e.target.value })}
                    placeholder="Oliy toifali mutaxassis, PhD"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Biriktirilgan klinika
                  </label>
                  <select
                    value={form.clinicName}
                    onChange={(e) => {
                      const clinic = initialClinics.find(c => c.name === e.target.value);
                      setForm({
                        ...form,
                        clinicName: e.target.value,
                        clinicId: clinic ? clinic.id : 'clinic-1'
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                  >
                    {initialClinics.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tajriba (yillar)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Qabul narxi (so'm) *
                  </label>
                  <input
                    type="number"
                    required
                    step="5000"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="150000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Reyting (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ish kunlari
                </label>
                <input
                  type="text"
                  value={form.workDays}
                  onChange={(e) => setForm({ ...form, workDays: e.target.value })}
                  placeholder="Dushanba - Juma yoki Dushanba, Chorshanba, Juma"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mutaxassis haqida qisqacha ma'lumot (Bio)
                </label>
                <textarea
                  rows="3"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Qanday kasalliklarni davolashi va tajribasi haqida..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-600/20 cursor-pointer"
                >
                  {editingDoctor ? "O'zgarishlarni saqlash" : "Shifokorni qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] !m-0 !p-4 w-screen h-screen flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-slate-800 dark:text-white">
              Shifokorni o'chirish
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Ushbu shifokor profilini platformadan o'chirmoqchimisiz? Ushbu amalni bekor qilib bo'lmaydi.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Ha, o'chirilsin
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
