import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  User,
  Lock,
  Phone,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  ArrowRight,
  Sparkles,
  Mail
} from 'lucide-react';
import GoogleIcon from '../components/GoogleIcon';

export default function LoginPage() {
  const { t, user, loginUser, logoutUser } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('gmail'); // 'gmail' | 'username' | 'phone'
  const [gmail, setGmail] = useState('admin@gmail.com');
  const [gmailPassword, setGmailPassword] = useState('admin123');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [smsCode, setSmsCode] = useState('');
  const [smsSent, setSmsSent] = useState(false);

  const handleGmailSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = gmail.trim().toLowerCase();
    if (!cleanEmail) return;

    if (isAdmin) {
      navigate('/admin');
      return;
    }

    loginUser({
      username: cleanEmail,
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      role: 'patient',
      phone: '+998 90 123 45 67'
    });
    navigate('/');
  };

  const handleGoogleOneTapLogin = () => {
    navigate('/admin');
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser) {
      return;
    }

    if (cleanUser === 'admin' || cleanUser.includes('admin')) {
      loginUser({
        username: 'admin@gmail.com',
        email: 'admin@gmail.com',
        name: t.nav.adminUser || 'Bosh Administrator',
        role: 'admin',
        phone: '+998 71 200 00 03'
      });
      navigate('/admin');
      return;
    }

    loginUser({
      username: cleanUser,
      email: `${cleanUser}@gmail.com`,
      name: cleanUser.includes('doctor') || cleanUser.includes('dr') ? 'Dr. Shifokor' : cleanUser,
      role: cleanUser.includes('doctor') || cleanUser.includes('dr') ? 'doctor' : 'patient',
      phone: '+998 90 123 45 67'
    });
    navigate('/');
  };

  const handleSendSms = () => {
    if (phone.length < 9) {
      alert("Iltimos, to'liq telefon raqamingizni kiriting!");
      return;
    }
    setSmsSent(true);
    setSmsCode('7742'); // Simulated OTP
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!smsCode) return;

    loginUser({
      username: 'user_' + phone.slice(-4),
      email: `user_${phone.slice(-4)}@gmail.com`,
      name: 'Mijoz (' + phone.slice(-4) + ')',
      role: 'patient',
      phone
    });
    navigate('/');
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      loginUser({
        username: 'admin@gmail.com',
        email: 'admin@gmail.com',
        name: t.nav.adminUser || 'Bosh Administrator',
        role: 'admin',
        phone: '+998 71 200 00 03'
      });
      navigate('/admin');
    } else if (role === 'doctor') {
      loginUser({
        username: 'dr_karimov@gmail.com',
        email: 'dr_karimov@gmail.com',
        name: 'Dr. Alisher Karimov',
        role: 'doctor',
        phone: '+998 90 333 44 55'
      });
      navigate('/');
    } else {
      loginUser({
        username: 'jasur_r@gmail.com',
        email: 'jasur_r@gmail.com',
        name: 'Jasur Rahimov',
        role: 'patient',
        phone: '+998 90 777 88 99'
      });
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {/* If already logged in, show user profile card with quick Admin switch */}
      {user.isLoggedIn ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl text-center space-y-5 text-xs">
          <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center border-2 border-teal-500 shadow-md">
            <User className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              {user.role}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">
              {user.name === 'Bosh Administrator' ? t.nav.adminUser : user.name}
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <GoogleIcon className="w-3.5 h-3.5" />
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                {user.email || (user.role === 'admin' ? 'admin@gmail.com' : `${user.username || 'user'}@gmail.com`)}
              </span>
              <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded-md font-extrabold">
                ✓ Gmail
              </span>
            </div>
            {user.phone && <p className="text-slate-400 text-[11px] mt-0.5">{user.phone}</p>}
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">{t.admin.appointmentsTable.status}:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{t.auth.statusOnline}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.auth.roleLabel}</span>
              <span className="font-bold capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500">Google Pochta:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <GoogleIcon className="w-3 h-3" />
                <span>{user.email || (user.role === 'admin' ? 'admin@gmail.com' : `${user.username}@gmail.com`)}</span>
              </span>
            </div>
          </div>

          {/* Direct Admin Access Button */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                loginUser({
                  username: 'admin@gmail.com',
                  email: 'admin@gmail.com',
                  name: t.nav.adminUser || 'Bosh Administrator',
                  role: 'admin',
                  phone: '+998 71 200 00 03'
                });
                navigate('/admin');
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.auth.goToAdmin || "Admin panelga o'tish"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Quick Role Switcher on Profile Card */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-left">
              <span className="text-[11px] font-bold text-slate-400 block mb-2 text-center">
                {t.auth.quickDemo || "Rollar o'rtasida tezkor almashish:"}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className={`p-2 rounded-xl text-[10px] font-bold border transition-colors flex items-center justify-center gap-1 ${
                    user.role === 'admin'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50'
                  }`}
                >
                  <GoogleIcon className="w-3 h-3 shrink-0" />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('doctor')}
                  className={`p-2 rounded-xl text-[10px] font-bold border transition-colors ${
                    user.role === 'doctor'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-teal-50'
                  }`}
                >
                  👨‍⚕️ {t.auth.roleDoctor || "Shifokor"}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('patient')}
                  className={`p-2 rounded-xl text-[10px] font-bold border transition-colors ${
                    user.role === 'patient'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  👤 {t.auth.rolePatient || "Bemor"}
                </button>
              </div>
            </div>

            {/* Switch Account via Google */}
            <button
              type="button"
              onClick={() => {
                logoutUser();
                setActiveTab('gmail');
              }}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <GoogleIcon className="w-3.5 h-3.5" />
              <span>Boshqa Gmail orqali kirish</span>
            </button>

            <button
              type="button"
              onClick={logoutUser}
              className="w-full py-2.5 border border-rose-300 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.nav.logout}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-xs">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-xs">
              <GoogleIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {t.auth.loginTitle}
            </h2>
            <p className="text-[11px] text-slate-500">
              Admin yoki mijoz profiliga kirish
            </p>
          </div>

          {/* Instant 1-Click Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleOneTapLogin}
            className="w-full py-3 px-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 text-xs font-black text-slate-800 dark:text-white group cursor-pointer"
          >
            <GoogleIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Google (Gmail) orqali darhol kirish (Admin)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] text-slate-400 uppercase tracking-widest font-extrabold absolute">
              yoki usulni tanlang
            </span>
          </div>

          {/* Login Type Tabs (Gmail vs Username vs Phone) */}
          <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('gmail')}
              className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'gmail'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GoogleIcon className="w-3 h-3" />
              <span>Gmail</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('username')}
              className={`py-2 rounded-xl font-bold transition-all ${
                activeTab === 'username'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.auth.tabUsername}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('phone')}
              className={`py-2 rounded-xl font-bold transition-all ${
                activeTab === 'phone'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.auth.tabPhone}
            </button>
          </div>

          {/* Form 1: Gmail Authentication */}
          {activeTab === 'gmail' && (
            <form onSubmit={handleGmailSubmit} className="space-y-4">
              {/* Preset Note */}
              <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-300 text-[11px] space-y-1">
                <div className="font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Admin Gmail ma'lumotlari:</span>
                </div>
                <div className="flex justify-between">
                  <span>Gmail: <b className="font-mono text-blue-700 dark:text-blue-300">admin@gmail.com</b></span>
                  <span>Parol: <b className="font-mono text-blue-700 dark:text-blue-300">admin123</b></span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gmail pochta manzili *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.auth.password} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={gmailPassword}
                    onChange={(e) => setGmailPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Google (Gmail) orqali tizimga kirish</span>
              </button>
            </form>
          )}

          {/* Form 2: Username & Password */}
          {activeTab === 'username' && (
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.auth.username} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masalan: admin@gmail.com yoki bemor_uz"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.auth.password} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all text-xs"
              >
                {t.auth.loginBtn}
              </button>
            </form>
          )}

          {/* Form 3: Phone number + SMS OTP */}
          {activeTab === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.auth.phone} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {!smsSent ? (
                <button
                  type="button"
                  onClick={handleSendSms}
                  className="w-full py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors"
                >
                  {t.auth.sendSms}
                </button>
              ) : (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.auth.smsCode} *
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-teal-600 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        maxLength="4"
                        required
                        value={smsCode}
                        onChange={(e) => setSmsCode(e.target.value)}
                        placeholder="7742"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-500 rounded-xl text-slate-900 dark:text-white font-mono text-center text-lg tracking-widest focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 mt-1 block">
                      Sinov kodi kiritildi: 7742
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all text-xs"
                  >
                    {t.auth.loginBtn}
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block mb-2 text-center">
              {t.auth.quickDemo}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('patient')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {t.auth.rolePatient}
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('doctor')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {t.auth.roleDoctor}
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1"
              >
                <GoogleIcon className="w-2.5 h-2.5" />
                <span>Admin (Gmail)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
