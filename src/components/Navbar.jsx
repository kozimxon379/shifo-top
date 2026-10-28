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
  MapPin,
  Stethoscope,
  BookOpen,
  Store
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
    user,
    loginUser
  } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesCount = favorites.length;

  const navLinks = [
    { to: '/', label: t.nav.home, icon: Home, emoji: '🏠' },
    { to: '/clinics', label: t.nav.clinics, icon: MapPin, emoji: '🏥' },
    { to: '/doctors', label: t.nav.doctors, icon: Stethoscope, emoji: '🩺' },
    { to: '/store', label: t.nav.store, icon: Store, emoji: '💊' },
    { to: '/encyclopedia', label: t.nav.encyclopedia, icon: BookOpen, emoji: '📖' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const handleAdminLinkClick = () => {
    // AdminPage handles secure Gmail + OTP verification
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top emergency announcement bar */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-medium tracking-wide hidden sm:inline">
              {t.hero.badge}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
            <a
              href="tel:103"
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 px-2.5 py-0.5 rounded-full transition-colors text-white"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span>{t.nav.emergency}</span>
            </a>
            <span className="hidden md:inline text-teal-200">
              {t.nav.trustPhone}
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <nav className="glass border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0 btn-spring">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 group-hover:scale-108 group-hover:rotate-3 transition-all duration-300">
                <HeartPulse className="w-6 h-6 animate-heart-pulse drop-shadow-xs" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                  shifo<span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">.top</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 -mt-1 hidden 2xl:block">
                  {t.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links - Single line, pill-shaped, perfectly spaced */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                const IconComp = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => handleAdminLinkClick(link.to)}
                    className={`btn-spring inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs xl:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-600/30 scale-[1.02]'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    {IconComp && (
                      <IconComp
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          active ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:scale-110'
                        }`}
                      />
                    )}
                    <span className="text-sm">{link.emoji}</span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side controls: Lang, Theme, Favorites, Cart, Auth */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                  aria-label="Tilni tanlash"
                >
                  <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="uppercase">{lang}</span>
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-in fade-in zoom-in-95">
                    {[
                      { code: 'uz', label: "O'zbekcha" },
                      { code: 'ru', label: 'Русский' },
                      { code: 'en', label: 'English' }
                    ].map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          changeLanguage(item.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors ${
                          lang === item.code ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{item.label}</span>
                        {lang === item.code && <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400"></span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="btn-spring p-2 sm:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0 cursor-pointer"
                aria-label="Mavzuni almashtirish"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-300" /> : <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform duration-300" />}
              </button>

              {/* Favorites Link */}
              <Link
                to="/favorites"
                className="btn-spring relative p-2 sm:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0"
                aria-label={t.nav.favorites}
              >
                <Heart className={`w-4 h-4 transition-transform ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500 scale-105' : 'hover:text-rose-500'}`} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                to="/cart"
                className="btn-spring btn-shimmer relative inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition-all shrink-0 whitespace-nowrap"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">{t.nav.cart}</span>
                {cartCount > 0 && (
                  <span className="bg-white text-teal-800 text-[10px] font-black px-1.5 py-0.2 rounded-full ml-0.5 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User / Admin Link */}
              <Link
                to={user.isLoggedIn && user.role === 'admin' ? '/admin' : '/login'}
                onClick={() => handleAdminLinkClick('/admin')}
                className={`btn-spring inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  user.isLoggedIn && user.role === 'admin'
                    ? 'border-emerald-500/80 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shadow-xs'
                    : user.isLoggedIn
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={user.isLoggedIn ? `${user.name} (${user.role})` : t.nav.login}
              >
                <User className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span className="inline whitespace-nowrap text-emerald-600 dark:text-emerald-300 font-bold">
                  {user.isLoggedIn ? (user.role === 'admin' ? (t.nav.admin || 'Admin') : (user.name || user.username)) : t.nav.login}
                </span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                aria-label="Mobil menyu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              const IconComp = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAdminLinkClick(link.to);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {IconComp && <IconComp className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                  <span className="text-base">{link.emoji}</span>
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
