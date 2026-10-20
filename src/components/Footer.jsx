import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HeartPulse, PhoneCall, ShieldCheck, Send, MapPin, Mail, Award, Clock } from 'lucide-react';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Emergency */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white">
                shifo<span className="text-teal-400">.top</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed">
              O'zbekistondagi eng yirik aqlli tibbiyot ekotizimi: kasalliklar bo'yicha eng yaqin davolash punktlarini topish, qulay vaqtga navbatsiz shifokor qabuliga yozilish va tezkor dorixona xizmati.
            </p>

            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <PhoneCall className="w-4 h-4" />
                <span>Favqulodda Shoshilinch Yordam</span>
              </div>
              <div className="flex items-baseline gap-3">
                <a href="tel:103" className="text-xl font-black text-white hover:text-rose-400 transition-colors">
                  103
                </a>
                <span className="text-xs text-slate-400">/ 24 soat bepul tez yordam</span>
              </div>
            </div>
          </div>

          {/* Col 2: Sahifalar */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-400" />
              Asosiy Bo'limlar
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/clinics" className="hover:text-teal-400 transition-colors">
                  {t.nav.clinics}
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-teal-400 transition-colors">
                  {t.nav.doctors}
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:text-teal-400 transition-colors">
                  {t.nav.store}
                </Link>
              </li>
              <li>
                <Link to="/encyclopedia" className="hover:text-teal-400 transition-colors">
                  {t.nav.encyclopedia}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-teal-400 transition-colors">
                  {t.nav.admin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Bog'lanish va manzillar */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              Bog'lanish & Markaz
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Toshkent shahri, Shayxontohur tumani, Navoiy ko'chasi 1-A</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+998 (71) 200-00-03</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>info@shifo.top</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sog'liqni Saqlash Vazirligi akkreditatsiyasi</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Telegram & Xavfsizlik */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              Telegram Bot Xizmati
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Qabullarni eslatish, yangi dori vositalari narxlari va tezkor shifokor maslahatlari Telegram botimiz orqali:
            </p>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md shadow-cyan-600/30"
            >
              <Send className="w-4 h-4" />
              <span>@shifo_top_bot</span>
            </a>
          </div>
        </div>

        {/* Bottom medical disclaimer and copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center space-y-3">
          <p className="text-[11px] text-slate-500 max-w-4xl mx-auto leading-relaxed">
            ⚠️ <b>Ogohlantirish:</b> shifo.top platformasidagi ma'lumotlar va AI tibbiy maslahatchisi faqat axborot-tavsiya maqsadida taqdim etiladi. O'tkir va xavfli holatlarda darhol tez yordam (103) ga yoki yaqin davolash muassasasiga murojaat qiling. O'zboshimchalik bilan og'ir dori vositalarini qabul qilmang.
          </p>
          <div className="text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-4">
            <span>© 2026 shifo.top. Barcha huquqlar himoyalangan.</span>
            <span className="hidden sm:inline">•</span>
            <span>React + Tailwind CSS + Telegram Bot API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
