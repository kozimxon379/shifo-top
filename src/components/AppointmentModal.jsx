import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { initialDoctors } from '../data/doctorsData';
import { createDoctorFallbackSvg } from '../utils/imageFallback';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle2,
  Send,
  Building,
  DollarSign
} from 'lucide-react';

export default function AppointmentModal() {
  const { bookingModalDoctor, closeBookingModal, bookAppointment, t, user } = useApp();

  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedDetails, setBookedDetails] = useState(null);

  // Set default values when modal opens
  useEffect(() => {
    if (bookingModalDoctor) {
      setSelectedDoctorId(bookingModalDoctor.id);
      setSelectedTimeSlot(bookingModalDoctor.availableSlots?.[0] || '10:00');
    } else if (initialDoctors.length > 0) {
      setSelectedDoctorId(initialDoctors[0].id);
      setSelectedTimeSlot(initialDoctors[0].availableSlots?.[0] || '10:00');
    }

    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);

    if (user?.isLoggedIn) {
      setPatientName(user.name || '');
      setPhone(user.phone || '');
    }

    setIsSuccess(false);
  }, [bookingModalDoctor, user]);

  if (!bookingModalDoctor) return null;

  const currentDoctor = initialDoctors.find(d => d.id === selectedDoctorId) || bookingModalDoctor;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName || !phone || !selectedDate || !selectedTimeSlot) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    setIsSubmitting(true);

    try {
      const aptData = {
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        specialty: currentDoctor.specialty,
        clinicName: currentDoctor.clinicName,
        price: currentDoctor.price,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        patientName,
        phone,
        symptoms
      };

      const result = await bookAppointment(aptData);
      setBookedDetails(result);
      setIsSuccess(true);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Calendar className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">
                {t.appointment.title}
              </h3>
              <p className="text-xs text-teal-200">
                {t.appointment.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeBookingModal}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.appointment.successTitle}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xs mx-auto">
                {t.appointment.successDesc}
              </p>
            </div>

            {/* Summary Ticket */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.appointment.doctor}:</span>
                <span className="font-bold text-slate-900 dark:text-white">{bookedDetails?.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.appointment.clinic}:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{bookedDetails?.clinicName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.admin.appointmentsTable.dateTime}:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{bookedDetails?.date} {t.appointment.hour} {bookedDetails?.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.appointment.price}:</span>
                <span className="font-bold text-slate-900 dark:text-white">{Number(bookedDetails?.price).toLocaleString()} {t.common.currency}</span>
              </div>
            </div>

            <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 rounded-xl border border-cyan-200 dark:border-cyan-900 text-xs text-cyan-800 dark:text-cyan-300 flex items-center justify-center gap-2">
              <Send className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>{t.appointment.telegramConfirmed}</span>
            </div>

            <button
              type="button"
              onClick={closeBookingModal}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md transition-all text-xs"
            >
              {t.appointment.close}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {/* Selected Doctor Summary Card */}
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 flex items-center gap-3">
              <img
                src={currentDoctor.image}
                alt={currentDoctor.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = createDoctorFallbackSvg(currentDoctor.name, currentDoctor.specialty);
                }}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-teal-950 dark:text-teal-100 truncate">
                  {currentDoctor.name}
                </h4>
                <div className="text-[11px] text-teal-700 dark:text-teal-300">
                  {currentDoctor.specialty} • {currentDoctor.clinicName}
                </div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {t.appointment.price}: {Number(currentDoctor.price).toLocaleString()} {t.common.currency}
                </div>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.appointment.selectDate} *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.appointment.selectTime} *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(currentDoctor.availableSlots || ["09:00", "10:30", "12:00", "14:30", "16:00", "17:30"]).map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.appointment.fullName} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardor Aliyev"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.appointment.phone} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Symptoms Description */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.appointment.symptoms}
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <textarea
                  rows="2"
                  placeholder="Shifokorga qisqacha shikoyatingiz..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>
                  {isSubmitting ? t.appointment.submitting : t.appointment.submit}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
