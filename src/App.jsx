import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import AppointmentModal from './components/AppointmentModal';
import ToastContainer from './components/ToastContainer';

// Pages
import HomePage from './pages/HomePage';
import ClinicsPage from './pages/ClinicsPage';
import DoctorsPage from './pages/DoctorsPage';
import StorePage from './pages/StorePage';
import EncyclopediaPage from './pages/EncyclopediaPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <div className="text-6xl font-black text-teal-600">404</div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">
        Sahifa topilmadi
      </h2>
      <p className="text-xs text-slate-500">
        Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan.
      </p>
      <a
        href="/"
        className="inline-block px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors"
      >
        Bosh sahifaga qaytish
      </a>
    </div>
  );
}

/**
 * Intelligent Scroll Restoration Keeper
 * Keeps exact scroll position on Ctrl+R (reload) or refresh across all routes,
 * while smoothly resetting scroll to top when navigating to a new page.
 */
function ScrollRestorationKeeper() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  // Restore scroll position on reload or path change
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      prevPathRef.current = location.pathname;
      return;
    }

    const key = `shifo_scroll_${location.pathname}`;
    const saved = sessionStorage.getItem(key);

    if (saved) {
      const top = parseInt(saved, 10);
      if (!isNaN(top) && top > 0) {
        requestAnimationFrame(() => window.scrollTo(0, top));
        const timer = setTimeout(() => window.scrollTo(0, top), 50);
        return () => clearTimeout(timer);
      }
    } else if (prevPathRef.current !== location.pathname) {
      window.scrollTo(0, 0);
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  // Continuously record scroll position for current route
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    let timeoutId = null;
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          sessionStorage.setItem(`shifo_scroll_${location.pathname}`, String(window.scrollY));
        } catch (e) {}
      }, 80);
    };

    const handleBeforeUnload = () => {
      try {
        sessionStorage.setItem(`shifo_scroll_${location.pathname}`, String(window.scrollY));
      } catch (e) {}
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  return null;
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200 ${isAdmin ? 'h-screen overflow-hidden' : ''}`}>
      {/* Intelligent Scroll Restoration on Ctrl+R */}
      <ScrollRestorationKeeper />

      {/* Main Top Navigation (Hidden in Admin Panel) */}
      {!isAdmin && <Navbar />}

      {/* Main Page Routes */}
      <main className={`flex-1 ${isAdmin ? 'h-full overflow-hidden' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clinics" element={<ClinicsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/encyclopedia" element={<EncyclopediaPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Global Footer (Hidden in Admin Panel) */}
      {!isAdmin && <Footer />}

      {/* Global Floating AI Medical Consultant (Hidden in Admin Panel) */}
      {!isAdmin && <AIChatbot />}

      {/* Global Appointment Booking Modal */}
      <AppointmentModal />

      {/* Global Notifications Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout />
      </Router>
    </AppProvider>
  );
}

