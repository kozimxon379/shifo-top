import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  HeartPulse,
  Home,
  Sun,
  Moon,
  Globe,
  ShoppingCart,
  Heart,
  User,
  PhoneCall,
  Menu,
  X,
  Building2,
  Stethoscope,
  Pill,
  BookOpenText,
  Check
} from 'lucide-react';

export default function Navbar() {
  const {
    lang,
    t,
    changeLanguage,
    darkMode,
    toggleTheme,
    cart,
    favorites,
    user
  } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesCount = favorites.length;

  const navLinks = [
    { to: '/', label: t.nav.home, icon: Home },
    { to: '/clinics', label: t.nav.clinics, icon: Building2 },
    { to: '/doctors', label: t.nav.doctors, icon: Stethoscope },
    { to: '/store', label: t.nav.store, icon: Pill },
    { to: '/encyclopedia', label: t.nav.encyclopedia, icon: BookOpenText }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const languages = [
    { code: 'uz', label: "O'zbekcha", short: 'UZ' },
    { code: 'ru', label: 'Русский', short: 'RU' },
    { code: 'en', label: 'English', short: 'EN' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-colors">
      {/* Top Clinical & Emergency Notice Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-200 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-xs shadow-emerald-400"></span>
            </span>
            <span className="font-semibold tracking-wide text-slate-300 hidden sm:inline whitespace-nowrap">
              {t.hero.badge || "24/7 Shoshilinch & Malakali Tibbiyot Portali"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium shrink-0 whitespace-nowrap">
            <span className="hidden md:inline text-slate-400 whitespace-nowrap">
              {t.footerExtra?.hotlineLabel || "Ishonch telefoni:"} <strong className="text-slate-200 font-semibold">{t.nav.trustPhone || "+998 71 200-00-03"}</strong>
            </span>
            <a
              href="tel:103"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white px-3 py-1 rounded-full font-bold transition-all shadow-sm shadow-rose-600/30 whitespace-nowrap btn-spring"
              title={t.aria?.emergencyCall || "Favqulodda tez yordamga qo'ng'iroq qilish"}
            >
              <PhoneCall className="w-3 h-3" />
              <span>103 {t.nav.emergency || "Tez Yordam"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="glass-nav">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Left aligned: Logo + Desktop Navigation Links */}
            <div className="flex items-center gap-4 xl:gap-8 min-w-0">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group shrink-0 btn-spring">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-600/20 ring-1 ring-white/20 group-hover:scale-105 transition-all shrink-0">
                  <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 animate-heart-pulse" />
                </div>
                <div className="flex flex-col shrink-0">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center whitespace-nowrap leading-tight">
                    shifo<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-400">.top</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1.5 whitespace-nowrap leading-none mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{t.tagline || "Aqlli tibbiyot portali"}</span>
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
                {navLinks.map((link) => {
                  const active = isActive(link.to);
                  const IconComp = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`inline-flex items-center gap-2 px-3 py-2 xl:px-3.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap shrink-0 transition-all ${
                        active
                          ? 'bg-teal-500/10 dark:bg-teal-400/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 dark:border-teal-400/20 shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <IconComp
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          active ? 'text-teal-600 dark:text-teal-400 scale-105' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      />
                      <span className="whitespace-nowrap select-none">{link.label}</span>
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 ml-0.5 animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label={t.aria?.selectLanguage || "Select language"}
                  aria-expanded={langDropdownOpen}
                >
                  <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="uppercase">{lang}</span>
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-in fade-in zoom-in-95">
                    {languages.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          changeLanguage(item.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                          lang === item.code
                            ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/50 dark:bg-teal-950/40'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{item.label}</span>
                        {lang === item.code && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="btn-spring p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label={t.aria?.toggleTheme || "Toggle theme"}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              {/* Favorites Link */}
              <Link
                to="/favorites"
                className="btn-spring relative p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={t.nav.favorites}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : 'hover:text-rose-500'
                  }`}
                />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                to="/cart"
                className="btn-spring relative inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">{t.nav.cart}</span>
                {cartCount > 0 && (
                  <span className="bg-white text-teal-800 text-[10px] font-black px-1.5 py-0.2 rounded-full ml-0.5">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User / Admin Link */}
              <Link
                to={user.isLoggedIn && user.role === 'admin' ? '/admin' : '/login'}
                className={`btn-spring inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors ${
                  user.isLoggedIn && user.role === 'admin'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : user.isLoggedIn
                    ? 'border-teal-300 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <User className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">
                  {user.isLoggedIn
                    ? (user.role === 'admin' ? (t.nav.admin || 'Admin') : (user.name || user.username))
                    : t.nav.login}
                </span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                aria-label={t.aria?.mobileMenu || "Mobile menu"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              const IconComp = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
