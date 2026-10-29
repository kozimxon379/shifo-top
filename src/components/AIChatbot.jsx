import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { consultMedicalAI } from '../data/aiMedicalBrain';
import { createDoctorFallbackSvg } from '../utils/imageFallback';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize2,
  Minimize2,
  Hospital,
  UserCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function AIChatbot() {
  const { lang, t, openBookingModal } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: t.aiChat.greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = consultMedicalAI(query, lang);

      const aiMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        aiData: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      if (speechActive && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToSpeak = `${aiResponse.diseaseName}. Sabablari: ${aiResponse.causes[0]}. Davolash: ${aiResponse.treatments[0]}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ';
        window.speechSynthesis.speak(utterance);
      }
    }, 600);
  };

  const handleClear = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: t.aiChat.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const toggleSpeech = () => {
    if (speechActive && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeechActive(!speechActive);
  };

  // Sync welcome message on language change if no other messages exist
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'msg-welcome') {
        return [{
          ...prev[0],
          text: t.aiChat.greeting
        }];
      }
      return prev;
    });
  }, [lang, t.aiChat.greeting]);

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-teal-600/25 btn-spring border border-white/20 cursor-pointer"
            aria-label={t.aiChat.openAria}
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-teal-800"></span>
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold tracking-wide flex items-center gap-1.5 leading-tight">
                <span>Shifo AI</span>
                <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-semibold text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  24/7 Live
                </span>
              </span>
              <span className="text-[11px] text-teal-100 font-medium">
                {t.aiChat.pillSubtitle}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 animate-in zoom-in-95 ${
            isExpanded
              ? 'w-[92vw] sm:w-[580px] h-[85vh] sm:h-[680px]'
              : 'w-[92vw] sm:w-[420px] h-[540px]'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5 leading-none">
                  <span>Shifo AI</span>
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">
                  {t.aiChat.subtitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Audio synthesis toggle */}
              <button
                type="button"
                onClick={toggleSpeech}
                title={speechActive ? t.aiChat.voiceMute : t.aiChat.voiceUnmute}
                className={`p-1.5 rounded-lg transition-colors ${
                  speechActive ? 'bg-white/30 text-amber-300' : 'text-teal-200 hover:bg-white/10'
                }`}
              >
                {speechActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Clear chat */}
              <button
                type="button"
                onClick={handleClear}
                title={t.aiChat.clearChat}
                className="p-1.5 text-teal-200 hover:bg-white/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Maximize toggle */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? t.aiChat.minimize : t.aiChat.maximize}
                className="hidden sm:inline-flex p-1.5 text-teal-200 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={t.common.close}
                className="p-1.5 text-teal-200 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-nowrap text-xs flex gap-1.5 scrollbar-none">
            {t.aiChat.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-medium transition-all shrink-0 hover:border-teal-400"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                  }`}
                >
                  {/* Simple text message */}
                  {msg.text && (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {/* Rich structured medical AI Consultation */}
                  {msg.aiData && !msg.aiData.matched ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-rose-500 font-bold text-xs pb-1 border-b border-slate-200 dark:border-slate-700">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Unaqa kasallik yo'q (Topilmadi)</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                        {msg.aiData.summary}
                      </p>
                      {msg.aiData.suggestedDiseases && msg.aiData.suggestedDiseases.length > 0 && (
                        <div className="pt-1.5">
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                            Mavjud haqiqiy kasalliklardan birini tanlang:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.aiData.suggestedDiseases.map((sd) => (
                              <button
                                key={sd.id}
                                type="button"
                                onClick={() => handleSend(sd.name)}
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-slate-700 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-slate-600 hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                              >
                                {sd.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : msg.aiData && (
                    <div className="space-y-3">
                      {/* Condition Title */}
                      <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                        <div>
                          <span className="text-[10px] font-bold tracking-wider text-teal-600 dark:text-teal-400 uppercase">
                            {msg.aiData.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {msg.aiData.diseaseName}
                          </h4>
                        </div>
                        {msg.aiData.urgency && (
                          <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            {msg.aiData.urgency}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        {msg.aiData.summary}
                      </p>

                      {/* 1. Kelib chiqish sabablari (Causes) */}
                      <div className="bg-amber-50/80 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                        <h5 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{t.aiChat.causes}</span>
                        </h5>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300 pl-4 list-disc">
                          {msg.aiData.causes.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>

                      {/* 2. Tibbiy shifo yo'li & Birinchi yordam (Treatments) */}
                      <div className="bg-emerald-50/80 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
                        <h5 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 mb-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.aiChat.treatments}</span>
                        </h5>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300 pl-4 list-disc">
                          {msg.aiData.treatments.map((tr, i) => (
                            <li key={i}>{tr}</li>
                          ))}
                        </ul>
                      </div>

                      {/* 3. Recommended Doctor & Direct Booking Button */}
                      {msg.aiData.doctor && (
                        <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={msg.aiData.doctor.image}
                              alt={msg.aiData.doctor.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = createDoctorFallbackSvg(msg.aiData.doctor.name, msg.aiData.doctor.specialty);
                              }}
                              className="w-9 h-9 rounded-full object-cover border border-teal-500"
                            />
                            <div>
                              <div className="font-bold text-teal-900 dark:text-teal-200">
                                {msg.aiData.doctor.name}
                              </div>
                              <div className="text-[10px] text-teal-700 dark:text-teal-400">
                                {msg.aiData.doctor.specialty} • {msg.aiData.doctor.clinicName}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              openBookingModal(msg.aiData.doctor);
                            }}
                            className="shrink-0 flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[11px] shadow-sm transition-colors"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{t.aiChat.bookDoctor}</span>
                          </button>
                        </div>
                      )}

                      {/* 4. Nearest Clinics */}
                      {msg.aiData.clinics && msg.aiData.clinics.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                            <Hospital className="w-3 h-3 text-teal-600" />
                            <span>{t.aiChat.nearestClinics}</span>
                          </div>
                          <div className="space-y-1">
                            {msg.aiData.clinics.slice(0, 2).map((clinic) => (
                              <div
                                key={clinic.id}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-[11px]"
                              >
                                <div>
                                  <div className="font-semibold text-slate-800 dark:text-white">
                                    {clinic.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                    {clinic.district} • {clinic.distanceKm} km {t.aiChat.distanceAway}
                                  </div>
                                </div>
                                <a
                                  href={`tel:${clinic.phone.replace(/[^0-9+]/g, '')}`}
                                  className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                                >
                                  {clinic.phone}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic p-2 bg-white dark:bg-slate-800 rounded-xl max-w-xs border border-slate-200 dark:border-slate-700">
                <Sparkles className="w-4 h-4 text-teal-500 animate-spin" />
                <span>{t.aiChat.analyzing}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Disclaimer footer */}
          <div className="px-3 py-1 bg-amber-50/60 dark:bg-amber-950/20 text-[10px] text-amber-800 dark:text-amber-300 text-center border-t border-amber-200/40 dark:border-amber-900/20">
            {t.aiChat.disclaimer}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.aiChat.placeholder}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-2xl shadow-sm transition-all shrink-0"
              aria-label={t.aiChat.send}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
