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
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const { t, user, loginUser, logoutUser } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('username'); // 'username' or 'phone'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [smsCode, setSmsCode] = useState('');
  const [smsSent, setSmsSent] = useState(false);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    loginUser({
      username,
      name: username === 'admin' ? t.nav.adminUser : username,
      role: username === 'admin' ? 'admin' : username.includes('doctor') ? 'doctor' : 'patient',
      phone: '+998 90 123 45 67'
    });
    navigate(username === 'admin' ? '/admin' : '/');
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
      name: 'Mijoz (' + phone.slice(-4) + ')',
      role: 'patient',
      phone
    });
    navigate('/');
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      loginUser({
        username: 'admin',
        name: t.nav.adminUser,
        role: 'admin',
        phone: '+998 71 200 00 03'
      });
      navigate('/admin');
    } else if (role === 'doctor') {
      loginUser({
        username: 'dr_karimov',
        name: 'Dr. Alisher Karimov',
        role: 'doctor',
        phone: '+998 90 333 44 55'
      });
      navigate('/');
    } else {
      loginUser({
        username: 'jasur_r',
        name: 'Jasur Rahimov',
        role: 'patient',
        phone: '+998 90 777 88 99'
      });
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {/* If already logged in, show user profile card */}
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
            <p className="text-slate-400 mt-0.5">{user.phone || user.username}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">{t.admin.appointmentsTable.status}:</span>
              <span className="font-bold text-emerald-600">{t.auth.statusOnline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.auth.roleLabel}</span>
              <span className="font-bold capitalize">{user.role}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {user.role === 'admin' && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm transition-all"
              >
                {t.auth.goToAdmin}
              </button>
            )}

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
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {t.auth.loginTitle}
            </h2>
            <p className="text-[11px] text-slate-500">
              {t.auth.loginSubtitle}
            </p>
          </div>

          {/* Login Type Tabs (Username vs Phone) */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
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

          {/* Form: Username & Password */}
          {activeTab === 'username' ? (
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
                    placeholder="Masalan: admin yoki bemor_uz"
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
          ) : (
            /* Form: Phone number + SMS OTP */
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
                className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {t.auth.roleAdmin}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
