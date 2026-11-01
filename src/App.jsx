import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import AppointmentModal from './components/AppointmentModal';
import ReviewModal from './components/ReviewModal';
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
  const { t } = useApp();
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <div className="text-6xl font-black text-teal-600">{t.notFound?.code || "404"}</div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">
        {t.notFound?.title || "Page not found"}
      </h2>
      <p className="text-xs text-slate-500">
        {t.notFound?.desc || "Sorry, the page you are looking for does not exist."}
      </p>
      <a
        href="/"
        className="inline-block px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors"
      >
        {t.notFound?.backHome || "Back to Home"}
      </a>
    </div>
  );
}

/**
 * Clean Scroll Manager:
 * Scrolls to top only when navigating to a DIFFERENT page,
 * allowing the browser's native engine to restore scroll on Ctrl+R with zero lag or shifting.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (!pathname.startsWith('/admin')) {
      document.body.style.overflow = '';
    }
    if (prevPathRef.current !== pathname) {
      if (!pathname.startsWith('/admin')) {
        window.scrollTo(0, 0);
      }
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  return null;
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!isAdmin) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [isAdmin]);

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200 ${isAdmin ? 'h-screen overflow-hidden' : ''}`}>
      <ScrollToTop />

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

      {/* Global 5-Star Reviews & Ratings Modal */}
      <ReviewModal />

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

