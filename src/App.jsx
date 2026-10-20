import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
          {/* Main Top Navigation */}
          <Navbar />

          {/* Main Page Routes */}
          <main className="flex-1">
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

          {/* Global Footer */}
          <Footer />

          {/* Global Floating AI Medical Consultant */}
          <AIChatbot />

          {/* Global Appointment Booking Modal */}
          <AppointmentModal />

          {/* Global Notifications Container */}
          <ToastContainer />
        </div>
      </Router>
    </AppProvider>
  );
}
